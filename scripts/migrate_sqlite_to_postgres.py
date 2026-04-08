from __future__ import annotations

import argparse
import json
import shutil
from dataclasses import dataclass
from decimal import Decimal
from datetime import datetime, UTC
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import MetaData, Table, create_engine, inspect, select, text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.exc import SQLAlchemyError


PROJECT_ROOT = Path(__file__).resolve().parents[1]
API_DIR = PROJECT_ROOT / "api"
DEFAULT_SQLITE_CANDIDATES = [
    PROJECT_ROOT / "procureflow.db",
    API_DIR / "procureflow.db",
    PROJECT_ROOT / "app.db",
    API_DIR / "app.db",
    PROJECT_ROOT / "test.db",
]


@dataclass
class TableResult:
    table: str
    rows_read: int
    rows_inserted: int
    skipped: int


def find_sqlite_db(explicit: str | None) -> Path:
    if explicit:
        path = Path(explicit).resolve()
        if not path.exists():
            raise FileNotFoundError(f"SQLite db bulunamadi: {path}")
        return path

    for candidate in DEFAULT_SQLITE_CANDIDATES:
        if candidate.exists() and candidate.stat().st_size > 0:
            return candidate

    raise FileNotFoundError("Kullanilabilir SQLite db bulunamadi")


def backup_sqlite_file(sqlite_path: Path, backup_root: Path) -> Path:
    backup_root.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(UTC).strftime("%Y%m%d_%H%M%S")
    target = backup_root / f"sqlite_backup_{sqlite_path.stem}_{ts}{sqlite_path.suffix}"
    shutil.copy2(sqlite_path, target)
    return target


def ensure_missing_tables(
    source_engine, target_engine, source_md: MetaData
) -> list[str]:
    target_inspector = inspect(target_engine)
    target_tables = set(target_inspector.get_table_names())

    create_md = MetaData()
    created: list[str] = []

    for name, table in source_md.tables.items():
        if name in target_tables:
            continue
        table.to_metadata(create_md)
        created.append(name)

    if created:
        create_md.create_all(target_engine)

    return created


def copy_table(
    source_engine, target_engine, table_name: str, batch_size: int = 1000
) -> TableResult:
    source_md = MetaData()
    target_md = MetaData()
    source_table = Table(table_name, source_md, autoload_with=source_engine)
    target_table = Table(table_name, target_md, autoload_with=target_engine)

    source_cols = {c.name for c in source_table.columns}
    target_cols = {c.name for c in target_table.columns}
    common_cols = [
        c for c in source_table.columns.keys() if c in target_cols and c in source_cols
    ]

    if not common_cols and table_name != "quotes":
        return TableResult(table=table_name, rows_read=0, rows_inserted=0, skipped=0)

    pk_cols = [c.name for c in target_table.primary_key.columns]

    rows_read = 0
    rows_inserted = 0

    with source_engine.connect() as sconn, target_engine.begin() as tconn:
        result = sconn.execute(select(*source_table.columns))

        batch: list[dict] = []
        for row in result.mappings():
            mapped_row = _map_row_for_target(
                table_name=table_name,
                row=row,
                common_cols=common_cols,
                target_cols=target_cols,
            )
            if not mapped_row:
                rows_read += 1
                continue
            batch.append(mapped_row)
            if len(batch) >= batch_size:
                inserted = _insert_batch(tconn, target_table, batch, pk_cols)
                rows_read += len(batch)
                rows_inserted += inserted
                batch = []

        if batch:
            inserted = _insert_batch(tconn, target_table, batch, pk_cols)
            rows_read += len(batch)
            rows_inserted += inserted

    skipped = rows_read - rows_inserted
    return TableResult(
        table=table_name,
        rows_read=rows_read,
        rows_inserted=rows_inserted,
        skipped=skipped,
    )


def _insert_batch(
    conn, target_table: Table, batch: list[dict], pk_cols: list[str]
) -> int:
    if not batch:
        return 0

    try:
        if pk_cols:
            stmt = (
                pg_insert(target_table)
                .values(batch)
                .on_conflict_do_nothing(index_elements=pk_cols)
            )
            result = conn.execute(stmt)
            return max(int(result.rowcount or 0), 0)

        result = conn.execute(target_table.insert(), batch)
        return max(int(result.rowcount or 0), 0)
    except SQLAlchemyError:
        # Schema farki veya kisit ihlalinde tum migration'i durdurma;
        # satir bazli dene ve uyumsuz kayitlari atla.
        inserted = 0
        for row in batch:
            try:
                if pk_cols:
                    stmt = (
                        pg_insert(target_table)
                        .values(row)
                        .on_conflict_do_nothing(index_elements=pk_cols)
                    )
                    result = conn.execute(stmt)
                    inserted += max(int(result.rowcount or 0), 0)
                else:
                    result = conn.execute(target_table.insert().values(row))
                    inserted += max(int(result.rowcount or 0), 0)
            except SQLAlchemyError:
                continue
        return inserted


def _map_row_for_target(
    table_name: str, row, common_cols: list[str], target_cols: set[str]
) -> dict:
    mapped = {c: row.get(c) for c in common_cols}

    if table_name != "quotes":
        return mapped

    # Legacy PostgreSQL quotes tablosu amount/user_id bekliyor; yeni SQLite'dan donustur.
    if "amount" in target_cols and "amount" not in mapped:
        amount_val = row.get("total_amount")
        if amount_val is None:
            amount_val = row.get("final_amount")
        if amount_val is None:
            amount_val = Decimal("0")
        mapped["amount"] = amount_val

    if "user_id" in target_cols and "user_id" not in mapped:
        user_id = row.get("created_by_id")
        if user_id is None:
            user_id = row.get("created_by")
        if user_id is None:
            user_id = row.get("assigned_to_id")
        mapped["user_id"] = user_id

    if "title" in target_cols and not mapped.get("title"):
        mapped["title"] = f"Migrated Quote #{row.get('id')}"

    if "status" in target_cols:
        status = row.get("status")
        if status is None:
            mapped["status"] = "draft"
        else:
            mapped["status"] = str(status).lower()

    if "user_id" in target_cols and mapped.get("user_id") is None:
        return {}

    return mapped


def run_migration(
    sqlite_path: Path, postgres_url: str, create_missing_tables: bool
) -> dict:
    source_url = f"sqlite:///{sqlite_path.as_posix()}"
    source_engine = create_engine(source_url, future=True)
    target_engine = create_engine(postgres_url, future=True)

    source_md = MetaData()
    source_md.reflect(source_engine)

    created_tables: list[str] = []
    if create_missing_tables:
        created_tables = ensure_missing_tables(source_engine, target_engine, source_md)

    target_inspector = inspect(target_engine)
    target_tables = set(target_inspector.get_table_names())

    # Bulk migration suresince FK kontrolu gecici kapatilir; sonunda mutlaka geri acilir.
    with target_engine.begin() as conn:
        conn.execute(text("SET session_replication_role = 'replica'"))

    try:
        results: list[TableResult] = []
        for table_name in sorted(source_md.tables.keys()):
            if table_name not in target_tables:
                continue
            results.append(copy_table(source_engine, target_engine, table_name))
    finally:
        with target_engine.begin() as conn:
            conn.execute(text("SET session_replication_role = 'origin'"))

    return {
        "source": str(sqlite_path),
        "tables_total": len(source_md.tables),
        "tables_targeted": len(results),
        "created_tables": created_tables,
        "tables": [
            {
                "table": r.table,
                "rows_read": r.rows_read,
                "rows_inserted": r.rows_inserted,
                "skipped": r.skipped,
            }
            for r in results
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="SQLite verisini PostgreSQL'e tasir")
    parser.add_argument("--sqlite", help="Kaynak sqlite dosya yolu", default=None)
    parser.add_argument("--postgres-url", help="Hedef PostgreSQL URL", default=None)
    parser.add_argument(
        "--backup-dir",
        help="SQLite yedek klasoru",
        default=str(PROJECT_ROOT / "backups" / "migration"),
    )
    parser.add_argument(
        "--no-create-missing",
        action="store_true",
        help="PostgreSQL'de eksik tablolari olusturma",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Sadece tespit yapar, veri tasimaz"
    )

    args = parser.parse_args()

    load_dotenv(API_DIR / ".env")

    postgres_url = args.postgres_url or __import__("os").environ.get("DATABASE_URL")
    if not postgres_url:
        raise RuntimeError("DATABASE_URL bulunamadi")
    if not postgres_url.startswith("postgresql"):
        raise RuntimeError("DATABASE_URL PostgreSQL olmali")

    sqlite_path = find_sqlite_db(args.sqlite)
    backup_path = backup_sqlite_file(sqlite_path, Path(args.backup_dir))

    if args.dry_run:
        payload = {
            "mode": "dry-run",
            "sqlite": str(sqlite_path),
            "backup_file": str(backup_path),
            "postgres_url": postgres_url,
        }
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0

    result = run_migration(
        sqlite_path=sqlite_path,
        postgres_url=postgres_url,
        create_missing_tables=not args.no_create_missing,
    )
    result["backup_file"] = str(backup_path)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
