import os
from sqlalchemy import create_engine, text

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "procureflow")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "96578097")

DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


def main():
    engine = create_engine(DATABASE_URL)

    with engine.begin() as conn:
        conn.execute(
            text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50)")
        )
        conn.execute(text("UPDATE users SET role='admin' WHERE role IS NULL"))
        conn.execute(text("ALTER TABLE users ALTER COLUMN role SET NOT NULL"))

        conn.execute(
            text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN")
        )
        conn.execute(text("UPDATE users SET is_active=TRUE WHERE is_active IS NULL"))
        conn.execute(text("ALTER TABLE users ALTER COLUMN is_active SET NOT NULL"))

    with engine.connect() as conn:
        rows = conn.execute(
            text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name='users'
            ORDER BY ordinal_position
        """)
        ).fetchall()
        print("users columns:", [r[0] for r in rows])


if __name__ == "__main__":
    main()
