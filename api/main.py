# api\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from dotenv import load_dotenv

from api.routers.health import router as health_router
from api.routers.quotes import router as quotes_router
from api.routers.auth import router as auth_router
from api.routers.admin import router as admin_router
from api.routers.files import router as files_router
from api.routers.quote_router import router as quote_router
from api.routers.supplier_router import router as supplier_router
from api.routers.supplier_portal import router as supplier_portal_router
from api.routers.approval_router import router as approval_router
from api.routers.supplier_response_router import router as supplier_response_router
from api.routers.report_router import router as report_router
from api.routers.contract_router import router as contract_router
from api.routers.settings_router import router as settings_router
from api.routers.user_profile_router import router as user_profile_router
from api.routers.advanced_settings_router import router as advanced_settings_router
from api.database import Base, engine, SessionLocal
from api.models import User, Permission, Role
from api.core.security import get_password_hash

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[STARTUP] 🚀 Initializing ProcureFlow Backend...")

    # Create all tables if they don't exist
    try:
        Base.metadata.create_all(bind=engine)
        print("[STARTUP] ✅ Database tables created/verified")
    except Exception as e:
        print(f"[STARTUP] ❌ Error creating tables: {e}")
        raise

    # Çalışma zamanı sütun migrasyonu (mevcut DB için)
    from sqlalchemy import text as _text

    _mig_db = SessionLocal()
    try:
        for _col_sql in [
            "ALTER TABLE quotes ADD COLUMN department_id INTEGER",
            "ALTER TABLE quotes ADD COLUMN assigned_to_id INTEGER",
            "ALTER TABLE quote_items ADD COLUMN vat_rate NUMERIC(5,2) DEFAULT 20 NOT NULL",
            "ALTER TABLE quote_items ADD COLUMN group_key VARCHAR(50)",
            "ALTER TABLE quote_items ADD COLUMN is_group_header BOOLEAN DEFAULT 0 NOT NULL",
            "ALTER TABLE system_settings ADD COLUMN vat_rates_json TEXT DEFAULT '[1,10,20]' NOT NULL",
            "ALTER TABLE supplier_quotes ADD COLUMN initial_final_amount REAL",
        ]:
            try:
                _mig_db.execute(_text(_col_sql))
                _mig_db.commit()
            except Exception:
                _mig_db.rollback()  # sütun zaten varsa sessizce geç
        print("[STARTUP] ✅ Runtime migrations completed")
    except Exception as e:
        print(f"[STARTUP] ⚠️ Migration error: {e}")
    finally:
        _mig_db.close()

    db = SessionLocal()
    try:
        # Create test user if not exists (local development support)
        admin = db.query(User).filter(User.email == "test@example.com").first()
        if not admin:
            admin = User(
                email="test@example.com",
                hashed_password=get_password_hash("Test1234!"),
                full_name="Test User",
                role="super_admin",
                is_active=True,
            )
            db.add(admin)
            db.flush()  # Anında veritabanına yaz
            db.commit()
            print("[STARTUP] ✅ Test user created: test@example.com / Test1234!")
        else:
            print("[STARTUP] ℹ️ Test user already exists: test@example.com")

        # Create role hierarchy if not exists
        roles_data = [
            ("Satın Almacı", "Temel seviye satın alma personeli", 0),
            ("Satın Alma Uzmanı", "Satın alma uzmanlığı", 1),
            ("Satın Alma Yöneticisi", "Satın alma yönetimi", 2),
            ("Satın Alma Müdürü", "Proje bazında yönetim", 3),
            ("Satın Alma Direktörü", "Stratejik karar verme", 4),
            ("Super Admin", "Sistem yöneticisi", 5),
        ]

        for role_name, desc, level in roles_data:
            existing = db.query(Role).filter(Role.name == role_name).first()
            if not existing:
                role = Role(
                    name=role_name,
                    description=desc,
                    hierarchy_level=level,
                    parent_id=None,  # Basitleştirildi - parent olmadan
                    is_active=True,
                )
                db.add(role)

        db.commit()

        # Create default permissions with Turkish names and tooltips
        permissions_data = [
            # Personnel Permissions
            (
                "create:personnel",
                "Personel Oluştur",
                "global",
                "Yeni personel kaydı oluşturma",
                "Yeni bir personel kayıtlamak için kullanılır",
            ),
            (
                "read:personnel",
                "Personel Görüntüle",
                "global",
                "Personel bilgisi okuma",
                "Personel detaylarını görmek için kullanılır",
            ),
            (
                "update:personnel",
                "Personel Düzenle",
                "global",
                "Personel bilgisi güncelleme",
                "Personel bilgilerini değiştirmek için kullanılır",
            ),
            (
                "delete:personnel",
                "Personel Sil",
                "global",
                "Personel kaydı silme",
                "Personel kaydını sistemden silmek için kullanılır",
            ),
            # Department Permissions
            (
                "create:department",
                "Departman Oluştur",
                "global",
                "Yeni departman oluşturma",
                "Yeni bir departman oluşturmak için kullanılır",
            ),
            (
                "read:department",
                "Departman Görüntüle",
                "global",
                "Departman bilgisi okuma",
                "Departman detaylarını görmek için kullanılır",
            ),
            (
                "update:department",
                "Departman Düzenle",
                "global",
                "Departman bilgisi güncelleme",
                "Departman bilgilerini değiştirmek için kullanılır",
            ),
            (
                "delete:department",
                "Departman Sil",
                "global",
                "Departman kaydı silme",
                "Departman kaydını sistemden silmek için kullanılır",
            ),
            # Company Permissions
            (
                "create:company",
                "Firma Oluştur",
                "global",
                "Yeni firma oluşturma",
                "Yeni bir firma kaydı oluşturmak için kullanılır",
            ),
            (
                "read:company",
                "Firma Görüntüle",
                "global",
                "Firma bilgisi okuma",
                "Firma detaylarını görmek için kullanılır",
            ),
            (
                "update:company",
                "Firma Düzenle",
                "global",
                "Firma bilgisi güncelleme",
                "Firma bilgilerini değiştirmek için kullanılır",
            ),
            (
                "delete:company",
                "Firma Sil",
                "global",
                "Firma kaydı silme",
                "Firma kaydını sistemden silmek için kullanılır",
            ),
            # Project Permissions
            (
                "create:project",
                "Proje Oluştur",
                "project",
                "Yeni proje oluşturma",
                "Yeni bir proje oluşturmak için kullanılır",
            ),
            (
                "read:project",
                "Proje Görüntüle",
                "project",
                "Proje bilgisi okuma",
                "Proje detaylarını görmek için kullanılır",
            ),
            (
                "update:project",
                "Proje Düzenle",
                "project",
                "Proje bilgisi güncelleme",
                "Proje bilgilerini değiştirmek için kullanılır",
            ),
            (
                "delete:project",
                "Proje Sil",
                "project",
                "Proje kaydı silme",
                "Proje kaydını sistemden silmek için kullanılır",
            ),
            # Role Permissions
            (
                "create:role",
                "Rol Oluştur",
                "global",
                "Yeni rol oluşturma",
                "Yeni bir rol tanımlamak için kullanılır",
            ),
            (
                "read:role",
                "Rol Görüntüle",
                "global",
                "Rol bilgisi okuma",
                "Rol detaylarını görmek için kullanılır",
            ),
            (
                "update:role",
                "Rol Düzenle",
                "global",
                "Rol bilgisi güncelleme",
                "Rol parametrelerini değiştirmek için kullanılır",
            ),
            (
                "delete:role",
                "Rol Sil",
                "global",
                "Rol kaydı silme",
                "Rol kaydını sistemden silmek için kullanılır",
            ),
            # Quote Permissions
            (
                "create:quote",
                "Teklif Oluştur",
                "project",
                "Yeni teklif oluşturma",
                "Satıcılardan yeni teklif talep etmek için kullanılır",
            ),
            (
                "read:quote",
                "Teklif Görüntüle",
                "project",
                "Teklif bilgisi okuma",
                "Gelen teklifleri incelemek için kullanılır",
            ),
            (
                "update:quote",
                "Teklif Düzenle",
                "project",
                "Teklif bilgisi güncelleme",
                "Teklif detaylarını değiştirmek için kullanılır",
            ),
            (
                "delete:quote",
                "Teklif Sil",
                "project",
                "Teklif kaydı silme",
                "Teklif kaydını iptal etmek için kullanılır",
            ),
            (
                "approve:quote",
                "Teklif Onayla",
                "project",
                "Teklif onaylama",
                "Teklifi onaylamak ve sözleşme aşamasına geçmek için kullanılır",
            ),
        ]

        for perm_code, perm_name, category, perm_desc, tooltip in permissions_data:
            existing = db.query(Permission).filter(Permission.name == perm_code).first()
            if not existing:
                perm = Permission(
                    name=perm_code,
                    description=perm_desc,
                    category=category,
                    tooltip=tooltip,
                )
                db.add(perm)

        db.commit()
        print("[OK] Permissions and roles seeded successfully")

    except Exception as e:
        print(f"[ERROR] Seeding error: {e}")
        db.rollback()
    finally:
        db.close()

    yield
    # Shutdown
    pass


app = FastAPI(
    title="ProcureFlow API", version="1.1.0", lifespan=lifespan, redirect_slashes=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)
# Include routers with proper prefixes
app.include_router(auth_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api/v1")
app.include_router(quotes_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(quote_router, prefix="/api/v1")
app.include_router(supplier_router, prefix="/api/v1")
app.include_router(supplier_portal_router, prefix="/api/v1")
app.include_router(approval_router, prefix="/api/v1")
app.include_router(supplier_response_router, prefix="/api/v1")
app.include_router(report_router, prefix="/api/v1")
app.include_router(contract_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")
app.include_router(user_profile_router, prefix="/api/v1")
app.include_router(advanced_settings_router, prefix="/api/v1")
app.include_router(files_router)
