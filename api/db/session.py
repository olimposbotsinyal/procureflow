from sqlalchemy import create_engine, text
from core.config import DATABASE_URL

def test_db_connection() -> bool:
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
