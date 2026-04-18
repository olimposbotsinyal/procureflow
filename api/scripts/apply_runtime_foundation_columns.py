from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import text

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import api.models  # noqa: F401
from api.database import Base, engine
from api.db.session import SessionLocal


STATEMENTS = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS system_role VARCHAR(50) DEFAULT 'tenant_member' NOT NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by_id INTEGER",
    "ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by_id INTEGER",
    "ALTER TABLE companies ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE departments ADD COLUMN IF NOT EXISTS created_by_id INTEGER",
    "ALTER TABLE departments ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by_id INTEGER",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE roles ADD COLUMN IF NOT EXISTS created_by_id INTEGER",
    "ALTER TABLE roles ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE company_roles ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE quote_approvals ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE quote_approvals ADD COLUMN IF NOT EXISTS required_business_role VARCHAR(100)",
    "ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS owner_user_id INTEGER",
    "ALTER TABLE system_emails ADD COLUMN IF NOT EXISTS tenant_id INTEGER",
    "ALTER TABLE system_emails ADD COLUMN IF NOT EXISTS owner_user_id INTEGER",
]


def main() -> int:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        for statement in STATEMENTS:
            db.execute(text(statement))
        db.commit()
    finally:
        db.close()

    print("APPLIED_RUNTIME_FOUNDATION_COLUMNS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
