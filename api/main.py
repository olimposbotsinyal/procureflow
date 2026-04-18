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
from api.routers.billing_router import router as billing_router
from api.routers.ai_lab import router as ai_lab_router
from api.routers.onboarding_router import router as onboarding_router
from api.routers.onboarding_saas import router as onboarding_saas_router
from api.routers.channel import router as channel_router
from api.routers.campaign_admin import router as campaign_admin_router
from api.routers.payment import router as payment_router
from api.routers.payment_admin import router as payment_admin_router
from api.database import Base, engine, SessionLocal
from api.models import User, Permission
from api.core.security import get_password_hash

# CRUD örnek routerlar
from api.department_crud_example import router as department_crud_router
from api.job_crud_example import router as job_crud_router
from api.user_crud_example import router as user_crud_router
from api.role_crud_example import router as role_crud_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)

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
            'ALTER TABLE system_settings ADD COLUMN public_pricing_json TEXT DEFAULT \'{"strategic_partner":{"plans":[]},"supplier":{"plans":[]}}\' NOT NULL',
            "ALTER TABLE supplier_quotes ADD COLUMN initial_final_amount REAL",
            "ALTER TABLE supplier_quotes ADD COLUMN discount_percent REAL",
            "ALTER TABLE supplier_quotes ADD COLUMN discount_amount REAL",
            "ALTER TABLE supplier_quotes ADD COLUMN payment_terms VARCHAR(255)",
            "ALTER TABLE supplier_quotes ADD COLUMN delivery_time INTEGER",
            "ALTER TABLE supplier_quotes ADD COLUMN warranty VARCHAR(255)",
            "ALTER TABLE supplier_quotes ADD COLUMN revision_number INTEGER DEFAULT 0 NOT NULL",
            "ALTER TABLE supplier_quotes ADD COLUMN is_revised_version BOOLEAN DEFAULT 0 NOT NULL",
            "ALTER TABLE supplier_quotes ADD COLUMN revision_of_id INTEGER",
            "ALTER TABLE supplier_quotes ADD COLUMN profitability_amount REAL",
            "ALTER TABLE supplier_quotes ADD COLUMN profitability_percent REAL",
            "ALTER TABLE supplier_quotes ADD COLUMN currency VARCHAR(3) DEFAULT 'TRY' NOT NULL",
            "ALTER TABLE supplier_quote_items ADD COLUMN notes TEXT",
            "ALTER TABLE supplier_quote_items ADD COLUMN revision_prices TEXT",
            "ALTER TABLE supplier_quote_items ADD COLUMN revision_number INTEGER DEFAULT 0 NOT NULL",
            "ALTER TABLE companies ADD COLUMN logo_url VARCHAR(500)",
            "ALTER TABLE companies ADD COLUMN trade_name VARCHAR(200)",
            "ALTER TABLE companies ADD COLUMN tax_office VARCHAR(255)",
            "ALTER TABLE companies ADD COLUMN tax_number VARCHAR(32)",
            "ALTER TABLE companies ADD COLUMN registration_number VARCHAR(64)",
            "ALTER TABLE companies ADD COLUMN address VARCHAR(500)",
            "ALTER TABLE companies ADD COLUMN city VARCHAR(100)",
            "ALTER TABLE companies ADD COLUMN address_district VARCHAR(100)",
            "ALTER TABLE companies ADD COLUMN postal_code VARCHAR(10)",
            "ALTER TABLE companies ADD COLUMN phone VARCHAR(20)",
            "ALTER TABLE companies ADD COLUMN contact_info VARCHAR(500)",
            "ALTER TABLE companies ADD COLUMN hide_location BOOLEAN DEFAULT FALSE NOT NULL",
            "ALTER TABLE companies ADD COLUMN share_on_whatsapp BOOLEAN DEFAULT TRUE NOT NULL",
            "ALTER TABLE users ADD COLUMN photo TEXT",
            "ALTER TABLE users ADD COLUMN personal_phone VARCHAR(32)",
            "ALTER TABLE users ADD COLUMN company_phone VARCHAR(32)",
            "ALTER TABLE users ADD COLUMN company_phone_short VARCHAR(16)",
            "ALTER TABLE users ADD COLUMN address VARCHAR(500)",
            "ALTER TABLE users ADD COLUMN hide_location BOOLEAN DEFAULT FALSE NOT NULL",
            "ALTER TABLE users ADD COLUMN share_on_whatsapp BOOLEAN DEFAULT TRUE NOT NULL",
            "ALTER TABLE users ADD COLUMN hidden_from_admin BOOLEAN DEFAULT FALSE NOT NULL",
            "ALTER TABLE users ADD COLUMN deleted_original_email VARCHAR(255)",
            "ALTER TABLE users ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE users ADD COLUMN system_role VARCHAR(50) DEFAULT 'tenant_member' NOT NULL",
            "ALTER TABLE users ADD COLUMN created_by_id INTEGER",
            "ALTER TABLE users ADD COLUMN invitation_token VARCHAR(255)",
            "ALTER TABLE users ADD COLUMN invitation_token_expires TIMESTAMP",
            "ALTER TABLE users ADD COLUMN invitation_accepted BOOLEAN DEFAULT FALSE NOT NULL",
            "CREATE UNIQUE INDEX ix_users_invitation_token ON users(invitation_token)",
            # Faz B: 4-scope mimari
            "ALTER TABLE users ADD COLUMN scope_type VARCHAR(20)",
            "ALTER TABLE users ADD COLUMN role_profile_code VARCHAR(100)",
            "ALTER TABLE companies ADD COLUMN created_by_id INTEGER",
            "ALTER TABLE companies ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE tenants ADD COLUMN support_status VARCHAR(50) DEFAULT 'new' NOT NULL",
            "ALTER TABLE tenants ADD COLUMN support_owner_name VARCHAR(255)",
            "ALTER TABLE tenants ADD COLUMN support_notes TEXT",
            "ALTER TABLE tenants ADD COLUMN support_resolution_reason TEXT",
            "ALTER TABLE tenants ADD COLUMN support_last_contacted_at TIMESTAMP",
            "ALTER TABLE departments ADD COLUMN created_by_id INTEGER",
            "ALTER TABLE departments ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE projects ADD COLUMN created_by_id INTEGER",
            "ALTER TABLE projects ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE roles ADD COLUMN created_by_id INTEGER",
            "ALTER TABLE roles ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE company_roles ADD COLUMN sub_items_json TEXT",
            "ALTER TABLE company_roles ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE suppliers ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE quotes ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE quote_approvals ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE quote_approvals ADD COLUMN required_business_role VARCHAR(100)",
            "ALTER TABLE email_settings ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE system_emails ADD COLUMN tenant_id INTEGER",
            "ALTER TABLE email_settings ADD COLUMN mail_domain VARCHAR(255)",
            "ALTER TABLE email_settings ADD COLUMN app_url VARCHAR(500)",
            "ALTER TABLE email_settings ADD COLUMN use_custom_app_url BOOLEAN DEFAULT FALSE NOT NULL",
            "ALTER TABLE email_settings ADD COLUMN reply_to_email VARCHAR(255)",
            "ALTER TABLE email_settings ADD COLUMN bounce_email VARCHAR(255)",
            "ALTER TABLE email_settings ADD COLUMN mailbox_support_email VARCHAR(255)",
            "ALTER TABLE email_settings ADD COLUMN enable_list_unsubscribe BOOLEAN DEFAULT TRUE NOT NULL",
            "ALTER TABLE email_settings ADD COLUMN enable_strict_from_alignment BOOLEAN DEFAULT TRUE NOT NULL",
            "ALTER TABLE email_settings ADD COLUMN signature_name VARCHAR(255)",
            "ALTER TABLE email_settings ADD COLUMN signature_title VARCHAR(255)",
            "ALTER TABLE email_settings ADD COLUMN signature_note VARCHAR(1000)",
            "ALTER TABLE email_settings ADD COLUMN signature_image_url VARCHAR(500)",
            "ALTER TABLE email_settings ADD COLUMN owner_user_id INTEGER",
            "ALTER TABLE system_emails ADD COLUMN owner_user_id INTEGER",
            "ALTER TABLE system_emails ADD COLUMN signature_name VARCHAR(255)",
            "ALTER TABLE system_emails ADD COLUMN signature_title VARCHAR(255)",
            "ALTER TABLE system_emails ADD COLUMN signature_note TEXT",
            "ALTER TABLE system_emails ADD COLUMN signature_image_url VARCHAR(500)",
            "ALTER TABLE system_emails ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL",
        ]:
            try:
                _mig_db.execute(_text(_col_sql))
                _mig_db.commit()
            except Exception:
                _mig_db.rollback()  # sütun zaten varsa sessizce geç
    finally:
        _mig_db.close()

    db = SessionLocal()
    try:
        # Create test users if not exists
        test_users = [
            ("test@example.com", "Test1234!", "Test User", "super_admin"),
            ("satinalmaci@example.com", "Test1234!", "Satın Almacı", "satinalmaci"),
            (
                "satinalmauzmani@example.com",
                "Test1234!",
                "Satın Alma Uzmanı",
                "satinalma_uzmani",
            ),
            (
                "satinalmayoneticisi@example.com",
                "Test1234!",
                "Satın Alma Yöneticisi",
                "satinalma_yoneticisi",
            ),
            (
                "satinalmadirektoru@example.com",
                "Test1234!",
                "Satın Alma Direktörü",
                "satinalma_direktoru",
            ),
        ]

        if db.query(User).filter(User.hidden_from_admin.is_(False)).count() == 0:
            for email, password, full_name, role in test_users:
                existing = db.query(User).filter(User.email == email).first()
                if not existing:
                    user = User(
                        email=email,
                        hashed_password=get_password_hash(password),
                        full_name=full_name,
                        role=role,
                        system_role="super_admin"
                        if role == "super_admin"
                        else "tenant_member",
                        is_active=True,
                    )
                    db.add(user)
                    db.flush()
                    db.commit()
                    print(f"[OK] ✅ Test user created: {email} / {password}")
                else:
                    print(f"[OK] ℹ️ Test user already exists: {email}")
        else:
            print("[OK] ℹ️ Test user seed skipped: visible users already exist")

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
app.include_router(billing_router, prefix="/api/v1")
app.include_router(ai_lab_router, prefix="/api/v1")
app.include_router(onboarding_router, prefix="/api/v1")
app.include_router(onboarding_saas_router, prefix="/api/v1")
app.include_router(channel_router, prefix="/api/v1")
app.include_router(campaign_admin_router, prefix="/api/v1")
app.include_router(payment_router, prefix="/api/v1")
app.include_router(payment_admin_router, prefix="/api/v1")
from api.routers.system_email_router import router as system_email_router

app.include_router(system_email_router, prefix="/api/v1")
app.include_router(files_router)
# CRUD örnek routerlar
app.include_router(department_crud_router, prefix="/api/v1")
app.include_router(job_crud_router, prefix="/api/v1")
app.include_router(user_crud_router, prefix="/api/v1")
app.include_router(role_crud_router, prefix="/api/v1")
