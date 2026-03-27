from sqlalchemy import create_engine, text
from api.core.config import settings  # sende farklÄ±ysa: from app.core.config import settings

def main():
    engine = create_engine(settings.DATABASE_URL)

    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN"))
        conn.execute(text("UPDATE users SET is_active = TRUE WHERE is_active IS NULL"))
        conn.execute(text("ALTER TABLE users ALTER COLUMN is_active SET NOT NULL"))

    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name='users'
            ORDER BY ordinal_position
        """)).fetchall()
        print("users columns:", [r[0] for r in rows])

    print("OK: is_active fixed")

if __name__ == "__main__":
    main()

