import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise RuntimeError("DATABASE_URL bulunamadi. api/.env dosyasini kontrol et.")

if "/procureflow" not in database_url:
    raise RuntimeError(
        "Bu script sadece procureflow veritabanina baglanmak icin kullanilir."
    )

engine = create_engine(database_url)
with engine.connect() as conn:
    result = conn.execute(
        text(
            "SELECT 1 FROM information_schema.tables WHERE table_name = 'refresh_tokens'"
        )
    )
    if result.fetchone():
        print("refresh_tokens table already exists")
    else:
        print("Creating refresh_tokens table...")
        conn.execute(
            text(
                """
                CREATE TABLE refresh_tokens (
                    id BIGSERIAL PRIMARY KEY,
                    jti_hash VARCHAR(64) UNIQUE NOT NULL,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    revoked_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
                """
            )
        )
        conn.execute(
            text("CREATE INDEX ix_refresh_tokens_jti_hash ON refresh_tokens(jti_hash)")
        )
        conn.execute(
            text("CREATE INDEX ix_refresh_tokens_user_id ON refresh_tokens(user_id)")
        )
        conn.commit()
        print("refresh_tokens table created")
