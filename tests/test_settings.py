"""Sistem Ayarları API Testleri"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from api.main import app
from api.database import Base, get_db, engine
from api.models import User, SystemSettings
from api.core.security import get_password_hash
from tests.conftest import override_get_db


# Test client
client = TestClient(app)


@pytest.fixture
def db_session():
    """Test database session"""
    Base.metadata.create_all(bind=engine)

    from api.database import SessionLocal

    db = SessionLocal()

    app.dependency_overrides[get_db] = lambda: db

    yield db

    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def admin_user(db_session):
    """Super admin kullanıcı oluştur"""
    admin = User(
        email="admin@test.com",
        hashed_password=get_password_hash("AdminPass123!"),
        full_name="Admin User",
        role="super_admin",
        is_active=True,
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def regular_user(db_session):
    """Normal kullanıcı oluştur"""
    user = User(
        email="user@test.com",
        hashed_password=get_password_hash("RegularPass123!"),
        full_name="Regular User",
        role="procurement_officer",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def admin_token(admin_user):
    """Admin login ve token al"""
    response = client.post(
        "/api/v1/login",
        json={
            "email": "admin@test.com",
            "password": "AdminPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    return data["access_token"]


@pytest.fixture
def regular_token(regular_user):
    """Regular user login ve token al"""
    response = client.post(
        "/api/v1/login",
        json={
            "email": "user@test.com",
            "password": "RegularPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    return data["access_token"]


class TestSettingsGet:
    """GET /api/v1/settings Testleri"""

    def test_get_settings_success(self, db_session, admin_token):
        """Admin başarıyla settings getirebilir"""
        response = client.get(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "app_name" in data
        assert data["app_name"] == "ProcureFlow"

    def test_get_settings_unauthorized(self, regular_token):
        """Non-admin kullanıcı settings getiremez"""
        response = client.get(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {regular_token}"},
        )
        assert response.status_code == 403
        data = response.json()
        assert "Only administrators" in data["detail"]

    def test_get_settings_no_token(self):
        """Token olmadan erişim başarısız"""
        response = client.get("/api/v1/settings")
        assert response.status_code == 403


class TestSettingsUpdate:
    """PUT /api/v1/settings Testleri"""

    def test_update_settings_success(self, db_session, admin_token):
        """Admin başarıyla settings güncelleyebilir"""
        response = client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "app_name": "ProcureFlow Pro",
                "maintenance_mode": True,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["app_name"] == "ProcureFlow Pro"
        assert data["maintenance_mode"] is True

    def test_update_settings_partial(self, db_session, admin_token):
        """Admin sadece seçilen alanları güncelleyebilir"""
        response = client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "maintenance_mode": True,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["app_name"] == "ProcureFlow"  # unchanged
        assert data["maintenance_mode"] is True

    def test_update_settings_disabled_mode(self, db_session, admin_token):
        """Maintenance modunu disable etme"""
        # Önce enable et
        client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"maintenance_mode": True},
        )

        # Sonra disable et
        response = client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"maintenance_mode": False},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["maintenance_mode"] is False

    def test_update_settings_unauthorized(self, regular_token):
        """Non-admin kullanıcı settings güncelleyemez"""
        response = client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {regular_token}"},
            json={"app_name": "Hacked"},
        )
        assert response.status_code == 403
        data = response.json()
        assert "Only administrators" in data["detail"]

    def test_update_settings_no_token(self):
        """Token olmadan update başarısız"""
        response = client.put(
            "/api/v1/settings",
            json={"app_name": "Hacked"},
        )
        assert response.status_code == 403


class TestSettingsAudit:
    """Settings audit trail testleri"""

    def test_settings_updated_by_tracked(self, db_session, admin_user, admin_token):
        """Settings güncellemesinde updated_by_id kaydedilir"""
        client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"app_name": "Updated App"},
        )

        # Veritabanında kontrol et
        settings = db_session.query(SystemSettings).first()
        assert settings is not None
        assert settings.updated_by_id == admin_user.id
        assert settings.app_name == "Updated App"

    def test_updated_at_timestamp(self, db_session, admin_token):
        """Settings güncellemesinde updated_at timestamp oluşturulur"""
        response = client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"app_name": "New Name"},
        )

        data = response.json()
        assert "updated_at" in data


class TestSettingsSingleton:
    """Settings singleton pattern testleri"""

    def test_only_one_settings_row(self, db_session, admin_token):
        """Veritabanında sadece bir settings row olmalı"""
        # İlk update
        client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"app_name": "First Update"},
        )

        # İkinci update
        client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"app_name": "Second Update"},
        )

        # Kontrol et: sadece 1 row olmalı
        settings_count = db_session.query(SystemSettings).count()
        assert settings_count == 1

        # Son değer kontrol et
        settings = db_session.query(SystemSettings).first()
        assert settings.app_name == "Second Update"

    def test_multiple_gets_same_row(self, db_session, admin_token):
        """Birden fazla GET isteği aynı row'u döner"""
        get1 = client.get(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
        ).json()

        get2 = client.get(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
        ).json()

        assert get1["id"] == get2["id"]


class TestSettingsValidation:
    """Settings doğrulama testleri"""

    def test_empty_payload(self, db_session, admin_token):
        """Boş payload güncellemez ama hata vermez"""
        response = client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={},
        )
        assert response.status_code == 200
        # Original values intact
        data = response.json()
        assert "app_name" in data

    def test_invalid_field_ignored(self, db_session, admin_token):
        """Geçersiz alan göz ardı edilir"""
        response = client.put(
            "/api/v1/settings",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "app_name": "Valid",
                "invalid_field": "should_be_ignored",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["app_name"] == "Valid"
        assert not hasattr(data, "invalid_field")
