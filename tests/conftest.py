# tests\conftest.py
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

    # admin + user seed
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@procureflow.dev").first()
        if not admin:
            admin = User(
                email="admin@procureflow.dev",
                hashed_password=get_password_hash("Admin123!"),
                full_name="Admin User",
                role="admin",
                is_active=True,
            )
            db.add(admin)

        user = db.query(User).filter(User.email == "user@procureflow.dev").first()
        if not user:
            user = User(
                email="user@procureflow.dev",
                hashed_password=get_password_hash("User123!"),
                full_name="Normal User",
                role="user",
                is_active=True,
            )
            db.add(user)

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
def admin_auth_headers(client):
    payload = {"email": "admin@procureflow.dev", "password": "Admin123!"}
    r = client.post("/api/v1/auth/login", json=payload)
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def user_auth_headers(client):
    payload = {"email": "user@procureflow.dev", "password": "User123!"}
    r = client.post("/api/v1/auth/login", json=payload)
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# backward compatibility (eski testler kırılmasın)
@pytest.fixture(scope="session")
def auth_headers(admin_auth_headers):
    return admin_auth_headers


@pytest.fixture(scope="session")
def other_user_auth_headers(client):
    payload = {"email": "other@procureflow.dev", "password": "Other123!"}
    r = client.post("/api/v1/auth/login", json=payload)
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
