from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect

PROJECT_ROOT = Path(__file__).resolve().parents[1]
API_DIR = PROJECT_ROOT / "api"

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(API_DIR / ".env")

from api.database import Base  # noqa: E402
import api.models  # noqa: F401,E402


def main() -> int:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL bulunamadi. api/.env dosyasini kontrol et.")
    if "/procureflow" not in database_url:
        raise RuntimeError(
            "Bu script sadece procureflow veritabanina baglanmak icin kullanilir."
        )

    engine = create_engine(database_url, future=True)
    inspector = inspect(engine)

    before = set(inspector.get_table_names())
    expected = set(Base.metadata.tables.keys())
    missing_before = sorted(expected - before)

    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    after = set(inspector.get_table_names())
    missing_after = sorted(expected - after)
    created = sorted(after - before)

    payload = {
        "database_url": database_url,
        "expected_count": len(expected),
        "before_count": len(before),
        "after_count": len(after),
        "created_count": len(created),
        "missing_before": missing_before,
        "missing_after": missing_after,
        "created_tables": created,
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
