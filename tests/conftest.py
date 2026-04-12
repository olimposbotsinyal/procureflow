# tests\conftest.py
import os
import re
from pathlib import Path

import pytest
from dotenv import dotenv_values, load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import OperationalError


ROOT_DIR = Path(__file__).resolve().parents[1]
SQLITE_TEST_DB_PATH = ROOT_DIR / "tests" / ".runtime" / "procureflow_test.sqlite3"
load_dotenv(ROOT_DIR / "api" / ".env")
ENV_FILE_VALUES = dotenv_values(ROOT_DIR / "api" / ".env")


def _build_test_database_url() -> str:
    explicit = os.getenv("TEST_DATABASE_URL") or ENV_FILE_VALUES.get("TEST_DATABASE_URL")
    if explicit:
        return str(explicit)

    primary = ENV_FILE_VALUES.get("DATABASE_URL") or os.getenv("DATABASE_URL")
    if primary:
        url = make_url(primary)
        database_name = url.database
        if database_name and not database_name.endswith("_test"):
            return str(url.set(database=f"{database_name}_test"))
        return str(primary)

    return "postgresql+psycopg://postgres:postgres@localhost:5432/procureflow_test"


def _ensure_test_database_exists(database_url: str) -> None:
    url = make_url(database_url)
    database_name = url.database
    if url.get_backend_name() != "postgresql" or not database_name:
        return

    if not re.fullmatch(r"[A-Za-z0-9_]+", database_name):
        raise RuntimeError(f"Guvensiz test veritabani adi: {database_name}")

    admin_database = os.getenv("POSTGRES_ADMIN_DB", "postgres")
    admin_url = url.set(database=admin_database)
    admin_engine = create_engine(
        admin_url.render_as_string(hide_password=False),
        isolation_level="AUTOCOMMIT",
        future=True,
    )
    try:
        with admin_engine.connect() as conn:
            exists = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :db_name"),
                {"db_name": database_name},
            ).scalar()
            if not exists:
                conn.execute(text(f'CREATE DATABASE "{database_name}"'))
    finally:
        admin_engine.dispose()


def _prepare_test_database_url() -> str:
    database_url = _build_test_database_url()
    try:
        _ensure_test_database_exists(database_url)
        return database_url
    except OperationalError:
        SQLITE_TEST_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        return f"sqlite:///{SQLITE_TEST_DB_PATH.as_posix()}"

# 1) Test DB
os.environ["DATABASE_URL"] = _prepare_test_database_url()

# 2) App import (env set edildikten sonra)
from api.main import app
from api.database import Base, engine, SessionLocal
from api.models.department import Department
from api.models.project import Project
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
        department = db.query(Department).filter(Department.name == "Test Department").first()
        if not department:
            department = Department(
                name="Test Department",
                description="Pytest seeded department",
                is_active=True,
            )
            db.add(department)
            db.flush()

        project = db.query(Project).filter(Project.code == "TEST-PROJECT").first()
        if not project:
            project = Project(
                name="Test Project",
                code="TEST-PROJECT",
                description="Pytest seeded project",
                is_active=True,
                project_type="merkez",
            )
            db.add(project)

        admin = db.query(User).filter(User.email == "admin@procureflow.dev").first()
        if not admin:
            admin = User(
                email="admin@procureflow.dev",
                hashed_password="",
                full_name="",
                role="admin",
                is_active=True,
            )
            db.add(admin)
        admin.hashed_password = get_password_hash("Admin123!")
        admin.full_name = "Admin User"
        admin.role = "admin"
        admin.is_active = True
        admin.department_id = department.id

        user = db.query(User).filter(User.email == "user@procureflow.dev").first()
        if not user:
            user = User(
                email="user@procureflow.dev",
                hashed_password="",
                full_name="",
                role="satinalmaci",
                is_active=True,
            )
            db.add(user)
        user.hashed_password = get_password_hash("User123!")
        user.full_name = "Normal User"
        user.role = "satinalmaci"
        user.is_active = True
        user.department_id = department.id

        other = db.query(User).filter(User.email == "other@procureflow.dev").first()
        if not other:
            other = User(
                email="other@procureflow.dev",
                hashed_password="",
                full_name="",
                role="user",
                is_active=True,
            )
            db.add(other)
        other.hashed_password = get_password_hash("Other123!")
        other.full_name = "Other User"
        other.role = "user"
        other.is_active = True
        other.department_id = department.id

        db.flush()
        for member in (admin, user):
            if member not in project.personnel:
                project.personnel.append(member)

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
