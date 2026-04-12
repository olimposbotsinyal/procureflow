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

    engine = create_engine(database_url, future=True)

    mapping_sql = """
    UPDATE quotes
    SET status = CASE
        WHEN lower(status::text) IN ('draft','tasari','tasarı') THEN 'draft'
        WHEN lower(status::text) IN ('sent','gonderilen','gönderilen') THEN 'sent'
        WHEN lower(status::text) IN ('pending','onay_bekliyor') THEN 'pending'
        WHEN lower(status::text) IN ('responded','yanitlandi','yanıtlandı') THEN 'responded'
        WHEN lower(status::text) IN ('approved','onaylandi','onaylandı') THEN 'approved'
        WHEN lower(status::text) IN ('rejected','reddedildi') THEN 'rejected'
        ELSE 'draft'
    END
    """

    with engine.begin() as conn:
        before = conn.execute(
            text(
                "SELECT status::text, COUNT(*) FROM quotes GROUP BY status::text ORDER BY status::text"
            )
        ).fetchall()
        conn.execute(text(mapping_sql))
        after = conn.execute(
            text(
                "SELECT status::text, COUNT(*) FROM quotes GROUP BY status::text ORDER BY status::text"
            )
        ).fetchall()

    print("before:", before)
    print("after:", after)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
