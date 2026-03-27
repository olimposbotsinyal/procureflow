# api\database.py
from pathlib import Path
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL tanımlı değil (.env dosyasını kontrol et)")
if "@host:" in DATABASE_URL or "user:password" in DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL placeholder görünüyor. api/.env dosyasını gerçek değerlerle güncelle."
    )

engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()
