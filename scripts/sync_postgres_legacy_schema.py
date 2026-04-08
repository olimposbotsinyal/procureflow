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

    statements = [
        # companies
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS color VARCHAR(20)",
        "UPDATE companies SET color = '#3b82f6' WHERE color IS NULL OR color = ''",
        # projects
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS address VARCHAR(500)",
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION",
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION",
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type VARCHAR(20)",
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS manager_name VARCHAR(255)",
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS manager_phone VARCHAR(20)",
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS manager_email VARCHAR(255)",
        "UPDATE projects SET project_type = 'merkez' WHERE project_type IS NULL OR project_type = ''",
        # quotes (legacy table compatibility)
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS project_id INTEGER",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS created_by_id INTEGER",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS description TEXT",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS company_name VARCHAR(255)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS company_contact_name VARCHAR(255)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS company_contact_phone VARCHAR(20)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS company_contact_email VARCHAR(255)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS currency VARCHAR(3)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS is_active BOOLEAN",
        # backfill defaults for compatibility
        "UPDATE quotes SET total_amount = COALESCE(total_amount, amount, 0)",
        "UPDATE quotes SET currency = COALESCE(currency, 'TRY')",
        "UPDATE quotes SET is_active = COALESCE(is_active, TRUE)",
        "UPDATE quotes SET created_by_id = COALESCE(created_by_id, created_by, user_id)",
        "UPDATE quotes SET company_name = COALESCE(company_name, 'Migrated Company')",
        "UPDATE quotes SET company_contact_name = COALESCE(company_contact_name, 'Migrated Contact')",
        "UPDATE quotes SET company_contact_phone = COALESCE(company_contact_phone, '-')",
        "UPDATE quotes SET company_contact_email = COALESCE(company_contact_email, 'migrated@example.com')",
    ]

    with engine.begin() as conn:
        for stmt in statements:
            conn.execute(text(stmt))

        # Fill project_id with any existing project to avoid null-driven crashes in legacy rows.
        first_project_id = conn.execute(
            text("SELECT id FROM projects ORDER BY id LIMIT 1")
        ).scalar()
        if first_project_id is not None:
            conn.execute(
                text("UPDATE quotes SET project_id = :pid WHERE project_id IS NULL"),
                {"pid": int(first_project_id)},
            )

    print("Schema compatibility sync completed for procureflow")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
