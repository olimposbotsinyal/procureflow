from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

PROJECT_ROOT = Path(__file__).resolve().parents[1]
API_DIR = PROJECT_ROOT / "api"


def main() -> int:
    load_dotenv(API_DIR / ".env", override=True)
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL bulunamadi")
    if "/procureflow" not in database_url:
        raise RuntimeError("Bu script sadece procureflow veritabani icin calisir")

    engine = create_engine(database_url, future=True)

    with engine.begin() as conn:
        rows = (
            conn.execute(
                text(
                    """
                SELECT table_name, column_name
                FROM information_schema.columns
                WHERE table_schema='public' AND column_default LIKE 'nextval(%'
                ORDER BY table_name, column_name
                """
                )
            )
            .mappings()
            .all()
        )

        for row in rows:
            table_name = row["table_name"]
            column_name = row["column_name"]
            seq_name = conn.execute(
                text("SELECT pg_get_serial_sequence(:table, :column)"),
                {"table": f"public.{table_name}", "column": column_name},
            ).scalar()
            if not seq_name:
                continue

            max_id = conn.execute(
                text(f'SELECT COALESCE(MAX("{column_name}"), 0) FROM "{table_name}"')
            ).scalar()
            conn.execute(
                text("SELECT setval(:seq, :new_value, true)"),
                {"seq": seq_name, "new_value": int(max_id) + 1},
            )
            print(f"sequence fixed: {seq_name} -> {int(max_id) + 1}")

    print("All sequences synchronized")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
