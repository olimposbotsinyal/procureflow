import os
import pytest
from fastapi.testclient import TestClient

# 1) Test DB
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

# 2) App import (env set edildikten sonra)
from api.main import app
from api.database import Base, engine, SessionLocal
from api.models.user import User
from api.core.security import get_password_hash


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # temiz başlangıç
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # admin seed
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@procureflow.dev").first()
        if not existing:
            admin = User(
                email="admin@procureflow.dev",
                hashed_password=get_password_hash("Admin123!"),
                full_name="Admin User",
                role="admin",
                is_active=True,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()

    yield

    # test sonrası temizlik
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def auth_headers(client):
    payload = {"email": "admin@procureflow.dev", "password": "Admin123!"}
    r = client.post("/api/v1/auth/login", json=payload)
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
