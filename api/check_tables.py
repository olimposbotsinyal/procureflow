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
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
        )
    )
    print("Database tables:")
    for row in result:
        print(f"  - {row[0]}")
