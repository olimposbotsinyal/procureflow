# FILE: /api/routers/advanced_settings_router.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import secrets
import smtplib
from smtplib import SMTPAuthenticationError, SMTPException, SMTPServerDisconnected
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate, make_msgid
import socket
import subprocess
from pathlib import Path

from api.models import (
    EmailSettings,
    LoggingSettings,
    BackupSettings,
    NotificationSettings,
    APIKey,
    User,
)
from api.models.assignment import CompanyRole
from api.models.company import Company
from api.database import get_db
from api.core.authz import (
    TENANT_ADMIN_SYSTEM_ROLES,
    can_access_procurement_settings,
    can_manage_shared_email_profiles,
)
from api.core.deps import get_current_user
from api.core.time import utcnow

router = APIRouter(prefix="/advanced-settings", tags=["advanced-settings"])


def _ensure_admin(current_user: User) -> User:
    """Admin check function"""
    if not can_access_procurement_settings(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için admin yetkisi gerekli",
        )
    return current_user


def _resolve_email_profile_owner(
    current_user: User, owner_user_id: int | None = None
) -> int | None:
    if can_manage_shared_email_profiles(current_user):
        return owner_user_id
    return current_user.id


def _get_or_create_settings(
    db: Session,
    model_class,
    setting_type: str = "default",
    owner_user_id: int | None = None,
):
    """Generic function to get or create singleton settings"""
    settings_query = db.query(model_class)
    if model_class == EmailSettings:
        if owner_user_id is None:
            settings_query = settings_query.filter(
                EmailSettings.owner_user_id.is_(None)
            )
        else:
            settings_query = settings_query.filter(
                EmailSettings.owner_user_id == owner_user_id
            )
    settings = settings_query.first()
    if not settings:
        if model_class == EmailSettings:
            settings = EmailSettings(
                owner_user_id=owner_user_id,
                smtp_host="",
                smtp_port=587,
                smtp_username="",
                smtp_password="",
                from_email="noreply@procureflow.com",
                from_name="ProcureFlow",
                use_tls=True,
                use_ssl=False,
                enable_email_notifications=False,
                mail_domain="",
                app_url="",
                use_custom_app_url=False,
                reply_to_email="",
                bounce_email="",
                mailbox_support_email="",
                enable_list_unsubscribe=True,
                enable_strict_from_alignment=True,
            )
        elif model_class == LoggingSettings:
            settings = LoggingSettings(
                log_level="INFO",
                log_retention_days=30,
                enable_file_logging=True,
                enable_database_logging=False,
                enable_syslog=False,
                log_api_requests=False,
                log_database_queries=False,
                log_user_actions=True,
            )
        elif model_class == BackupSettings:
            settings = BackupSettings(
                enable_automatic_backup=True,
                backup_frequency="daily",
                backup_time="02:00",
                backup_location="/backups",
                keep_last_n_backups=7,
                compress_backups=True,
                encrypt_backups=False,
            )
        elif model_class == NotificationSettings:
            settings = NotificationSettings(
                notify_on_quote_created=True,
                notify_on_quote_response=True,
                notify_on_quote_approved=True,
                notify_on_quote_rejected=False,
                notify_on_contract_created=True,
                notify_on_contract_signed=True,
                notify_on_system_errors=True,
                notify_on_maintenance=False,
                enable_daily_digest=False,
                digest_time="09:00",
            )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


# ============================================================================
# EMAIL SETTINGS ENDPOINTS
# ============================================================================


@router.get("/email", response_model=dict)
async def get_email_settings(
    owner_user_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get email (SMTP) settings - Admin only"""
    _ensure_admin(current_user)
    resolved_owner_id = _resolve_email_profile_owner(current_user, owner_user_id)
    settings = _get_or_create_settings(
        db, EmailSettings, owner_user_id=resolved_owner_id
    )
    return {
        "id": settings.id,
        "owner_user_id": settings.owner_user_id,
        "smtp_host": settings.smtp_host,
        "smtp_port": settings.smtp_port,
        "smtp_username": settings.smtp_username,
        "smtp_password": settings.smtp_password,
        "from_email": settings.from_email,
        "from_name": settings.from_name,
        "use_tls": settings.use_tls,
        "use_ssl": settings.use_ssl,
        "enable_email_notifications": settings.enable_email_notifications,
        "mail_domain": settings.mail_domain,
        "app_url": settings.app_url,
        "use_custom_app_url": settings.use_custom_app_url,
        "reply_to_email": settings.reply_to_email,
        "bounce_email": settings.bounce_email,
        "mailbox_support_email": settings.mailbox_support_email,
        "enable_list_unsubscribe": settings.enable_list_unsubscribe,
        "enable_strict_from_alignment": settings.enable_strict_from_alignment,
        "signature_name": settings.signature_name,
        "signature_title": settings.signature_title,
        "signature_note": settings.signature_note,
        "signature_image_url": settings.signature_image_url,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.get("/email/profiles", response_model=list[dict])
async def list_email_profiles(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    _ensure_admin(current_user)
    if not can_manage_shared_email_profiles(current_user):
        settings = _get_or_create_settings(
            db, EmailSettings, owner_user_id=current_user.id
        )
        return [
            {
                "owner_user_id": current_user.id,
                "label": "Kendi SMTP profilim",
                "kind": "personal",
                "from_email": settings.from_email,
            }
        ]

    rows = db.query(EmailSettings).all()
    users = {
        row.id: row
        for row in db.query(User)
        .filter(User.system_role.in_(tuple(TENANT_ADMIN_SYSTEM_ROLES)))
        .all()
    }
    profiles: list[dict] = []
    default_row = next((row for row in rows if row.owner_user_id is None), None)
    if default_row is None:
        default_row = _get_or_create_settings(db, EmailSettings, owner_user_id=None)
    profiles.append(
        {
            "owner_user_id": None,
            "label": "Varsayılan Sistem SMTP",
            "kind": "default",
            "from_email": default_row.from_email,
        }
    )
    for admin_id, admin_user in users.items():
        row = next((item for item in rows if item.owner_user_id == admin_id), None)
        company_names = [
            name
            for (name,) in db.query(Company.name)
            .join(CompanyRole, CompanyRole.company_id == Company.id)
            .filter(CompanyRole.user_id == admin_id, CompanyRole.is_active.is_(True))
            .distinct()
            .order_by(Company.name.asc())
            .all()
        ]
        company_suffix = f" ({', '.join(company_names)})" if company_names else ""
        profiles.append(
            {
                "owner_user_id": admin_id,
                "label": f"Firma SMTP: {admin_user.full_name}{company_suffix}",
                "kind": "personal",
                "from_email": row.from_email if row else "",
            }
        )
    return profiles


@router.put("/email", response_model=dict)
async def update_email_settings(
    data: dict,
    owner_user_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update email (SMTP) settings - Admin only"""
    _ensure_admin(current_user)
    resolved_owner_id = _resolve_email_profile_owner(current_user, owner_user_id)
    settings = _get_or_create_settings(
        db, EmailSettings, owner_user_id=resolved_owner_id
    )

    # Update fields (hem veritabanı hem .env için toplanacak)
    env_updates = {}
    if "smtp_host" in data:
        settings.smtp_host = data["smtp_host"]
        env_updates["SMTP_SERVER"] = data["smtp_host"]
    if "smtp_port" in data:
        settings.smtp_port = data["smtp_port"]
        env_updates["SMTP_PORT"] = str(data["smtp_port"])
    if "smtp_username" in data:
        settings.smtp_username = data["smtp_username"]
        env_updates["SENDER_EMAIL"] = data["smtp_username"]
    if "smtp_password" in data:
        settings.smtp_password = data["smtp_password"]
        env_updates["SENDER_PASSWORD"] = data["smtp_password"]
    if "from_email" in data:
        settings.from_email = data["from_email"]
        # .env'de FROM_EMAIL varsa güncellenebilir
        env_updates["FROM_EMAIL"] = data["from_email"]
    if "from_name" in data:
        settings.from_name = data["from_name"]
        env_updates["MAIL_FROM_NAME"] = data["from_name"]
    if "use_tls" in data:
        settings.use_tls = data["use_tls"]
        env_updates["SMTP_USE_TLS"] = str(data["use_tls"]).lower()
    if "use_ssl" in data:
        settings.use_ssl = data["use_ssl"]
        env_updates["SMTP_USE_SSL"] = str(data["use_ssl"]).lower()
    if "enable_email_notifications" in data:
        settings.enable_email_notifications = data["enable_email_notifications"]
    if "mail_domain" in data:
        settings.mail_domain = (data["mail_domain"] or "").strip()
        env_updates["MAIL_DOMAIN"] = settings.mail_domain
    if "app_url" in data:
        settings.app_url = (data["app_url"] or "").strip()
        env_updates["APP_URL"] = settings.app_url
    if "use_custom_app_url" in data:
        settings.use_custom_app_url = bool(data["use_custom_app_url"])
    if "reply_to_email" in data:
        settings.reply_to_email = (data["reply_to_email"] or "").strip()
        env_updates["MAIL_REPLY_TO"] = settings.reply_to_email
    if "bounce_email" in data:
        settings.bounce_email = (data["bounce_email"] or "").strip()
        env_updates["MAIL_BOUNCE_EMAIL"] = settings.bounce_email
    if "mailbox_support_email" in data:
        settings.mailbox_support_email = (data["mailbox_support_email"] or "").strip()
        env_updates["MAILBOX_SUPPORT_EMAIL"] = settings.mailbox_support_email
    if "enable_list_unsubscribe" in data:
        settings.enable_list_unsubscribe = bool(data["enable_list_unsubscribe"])
    if "enable_strict_from_alignment" in data:
        settings.enable_strict_from_alignment = bool(
            data["enable_strict_from_alignment"]
        )
    if "signature_name" in data:
        settings.signature_name = (data["signature_name"] or "").strip()
    if "signature_title" in data:
        settings.signature_title = (data["signature_title"] or "").strip()
    if "signature_note" in data:
        settings.signature_note = (data["signature_note"] or "").strip()
    if "signature_image_url" in data:
        settings.signature_image_url = (data["signature_image_url"] or "").strip()

    if hasattr(settings, "updated_at"):
        settings.updated_at = utcnow()
    if hasattr(settings, "updated_by_id"):
        settings.updated_by_id = current_user.id

    db.commit()
    db.refresh(settings)

    # Sadece varsayılan sistem profili .env dosyasını günceller.
    if resolved_owner_id is None:
        try:
            from api.utils.env_writer import update_env_file
            import os

            env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
            update_env_file(env_path, env_updates)
        except Exception as e:
            print(f"[ENV] .env dosyası güncellenemedi: {e}")

    return {
        "id": settings.id,
        "owner_user_id": settings.owner_user_id,
        "smtp_host": settings.smtp_host,
        "smtp_port": settings.smtp_port,
        "smtp_username": settings.smtp_username,
        "smtp_password": settings.smtp_password,
        "from_email": settings.from_email,
        "from_name": settings.from_name,
        "use_tls": settings.use_tls,
        "use_ssl": settings.use_ssl,
        "enable_email_notifications": settings.enable_email_notifications,
        "mail_domain": settings.mail_domain,
        "app_url": settings.app_url,
        "use_custom_app_url": settings.use_custom_app_url,
        "reply_to_email": settings.reply_to_email,
        "bounce_email": settings.bounce_email,
        "mailbox_support_email": settings.mailbox_support_email,
        "enable_list_unsubscribe": settings.enable_list_unsubscribe,
        "enable_strict_from_alignment": settings.enable_strict_from_alignment,
        "signature_name": settings.signature_name,
        "signature_title": settings.signature_title,
        "signature_note": settings.signature_note,
        "signature_image_url": settings.signature_image_url,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.post("/email/signature-image", response_model=dict)
async def upload_email_signature_image(
    file: UploadFile = File(...),
    owner_user_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ensure_admin(current_user)
    resolved_owner_id = _resolve_email_profile_owner(current_user, owner_user_id)
    settings = _get_or_create_settings(
        db, EmailSettings, owner_user_id=resolved_owner_id
    )

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
    }
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, detail="Sadece resim dosyaları yüklenebilir"
        )

    content = await file.read()
    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="İmza görseli 2MB'dan büyük olamaz")

    upload_dir = Path("uploads") / "email_signatures"
    upload_dir.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename or "signature.png").suffix.lower() or ".png"
    filename = f"signature_{secrets.token_hex(8)}{ext}"
    file_path = upload_dir / filename
    file_path.write_bytes(content)

    settings.signature_image_url = (
        f"/api/v1/advanced-settings/email/signature-image/{filename}"
    )
    db.commit()
    return {"success": True, "signature_image_url": settings.signature_image_url}


@router.get("/email/signature-image/{filename}")
async def get_email_signature_image(filename: str):
    safe_name = Path(filename).name
    file_path = Path("uploads") / "email_signatures" / safe_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Görsel bulunamadı")
    return FileResponse(file_path)


@router.post("/email/test", response_model=dict)
async def test_email_settings(
    data: dict,
    owner_user_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Test email settings by sending a test email - Admin only"""
    _ensure_admin(current_user)

    # Accept either to_email or from_email
    to_email = data.get("to_email") or data.get("from_email")
    if not to_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="to_email alanı gerekli"
        )

    resolved_owner_id = _resolve_email_profile_owner(current_user, owner_user_id)
    settings = _get_or_create_settings(
        db, EmailSettings, owner_user_id=resolved_owner_id
    )

    try:
        print("[EMAIL] Test email gönderiliyor...")
        print(f"[EMAIL] SMTP Host: {settings.smtp_host}:{settings.smtp_port}")
        print(f"[EMAIL] Username: {settings.smtp_username}")
        print(f"[EMAIL] TLS: {settings.use_tls}, SSL: {settings.use_ssl}")
        print(f"[EMAIL] To: {to_email}")

        # Create message with plain + html alternatives
        msg = MIMEMultipart("alternative")
        msg["From"] = f"{settings.from_name} <{settings.from_email}>"
        msg["To"] = to_email
        msg["Subject"] = "[ProcureFlow] SMTP Test Mesaji"
        msg["Date"] = formatdate(localtime=True)
        from_domain = (settings.from_email or "procureflow.local").split("@")[-1]
        msg["Message-ID"] = make_msgid(domain=from_domain)
        msg["X-Mailer"] = "ProcureFlow"
        msg["Content-Language"] = "tr-TR"

        body_plain = (
            "Bu bir test e-postasidir.\n\n"
            "ProcureFlow SMTP ayarlari dogru sekilde yapilandirilmistir.\n"
            "Bu ileti otomatik test amaclidir."
        )
        body_html = """
        <html>
            <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;\">
                <h3 style=\"margin: 0 0 12px;\">ProcureFlow SMTP Test Mesaji</h3>
                <p>Bu bir test e-postasidir.</p>
                <p>SMTP ayarlari dogru sekilde yapilandirilmistir.</p>
                <p style=\"font-size:12px;color:#6b7280;\">Bu ileti otomatik test amaclidir.</p>
            </body>
        </html>
        """
        msg.attach(MIMEText(body_plain, "plain", "utf-8"))
        msg.attach(MIMEText(body_html, "html", "utf-8"))

        # Send email
        print("[EMAIL] SMTP bağlantısı kuruluyor...")
        server: smtplib.SMTP | smtplib.SMTP_SSL
        if settings.use_ssl:
            server = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port)
        else:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
            if settings.use_tls:
                print("[EMAIL] TLS başlatılıyor...")
                server.starttls()

        if settings.smtp_username and settings.smtp_password:
            print("[EMAIL] Login yapılıyor...")
            server.login(settings.smtp_username, settings.smtp_password)
            print("[EMAIL] Login başarılı")

        print("[EMAIL] Email gönderiliyor...")
        server.send_message(msg)
        server.quit()
        print("[EMAIL] Email başarıyla gönderildi")

        return {
            "success": True,
            "message": f"Test email başarıyla {to_email} adresine gönderildi",
        }

    except SMTPAuthenticationError as e:
        print(f"[EMAIL] [ERROR] Kimlik doğrulama hatası: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="SMTP kimlik doğrulama başarısız. Kullanıcı adı ve şifre kontrol edin.",
        )
    except socket.gaierror as e:
        print(f"[EMAIL] [ERROR] DNS Hatası: {str(e)}")
        print(f"[EMAIL]    SMTP Host: {settings.smtp_host}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"SMTP sunucusu bulunamadı: {settings.smtp_host}. Domain adını kontrol edin.",
        )
    except socket.timeout as e:
        print(f"[EMAIL] [ERROR] Timeout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail=f"SMTP sunucusuna bağlantı zaman aşımı. Host: {settings.smtp_host}:{settings.smtp_port}",
        )
    except ConnectionRefusedError as e:
        print(f"[EMAIL] [ERROR] Bağlantı reddedildi: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"SMTP sunucusu bağlantıyı reddetti. Host: {settings.smtp_host}:{settings.smtp_port}",
        )
    except SMTPServerDisconnected as e:
        print(f"[EMAIL] [ERROR] Sunucu bağlantısı koptu: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SMTP sunucusu bağlantıyı kaybetti. Daha sonra tekrar deneyiniz.",
        )
    except SMTPException as e:
        print(f"[EMAIL] [ERROR] SMTP Hatası: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"SMTP hatası: {str(e)}",
        )
    except Exception as e:
        print(f"[EMAIL] [ERROR] Beklenmeyen hatası: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email gönderme hatası: {type(e).__name__} - {str(e)}",
        )


# ============================================================================
# LOGGING SETTINGS ENDPOINTS
# ============================================================================


@router.get("/logging", response_model=dict)
async def get_logging_settings(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get logging settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, LoggingSettings)
    return {
        "id": settings.id,
        "log_level": settings.log_level,
        "log_retention_days": settings.log_retention_days,
        "enable_file_logging": settings.enable_file_logging,
        "enable_database_logging": settings.enable_database_logging,
        "enable_syslog": settings.enable_syslog,
        "log_api_requests": settings.log_api_requests,
        "log_database_queries": settings.log_database_queries,
        "log_user_actions": settings.log_user_actions,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.put("/logging", response_model=dict)
async def update_logging_settings(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update logging settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, LoggingSettings)

    # Update fields
    if "log_level" in data:
        if data["log_level"] not in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Geçersiz log level"
            )
        settings.log_level = data["log_level"]

    if "log_retention_days" in data:
        settings.log_retention_days = max(1, data["log_retention_days"])

    if "enable_file_logging" in data:
        settings.enable_file_logging = data["enable_file_logging"]

    if "enable_database_logging" in data:
        settings.enable_database_logging = data["enable_database_logging"]

    if "enable_syslog" in data:
        settings.enable_syslog = data["enable_syslog"]

    if "log_api_requests" in data:
        settings.log_api_requests = data["log_api_requests"]

    if "log_database_queries" in data:
        settings.log_database_queries = data["log_database_queries"]

    if "log_user_actions" in data:
        settings.log_user_actions = data["log_user_actions"]

    if hasattr(settings, "updated_at"):
        settings.updated_at = utcnow()
    if hasattr(settings, "updated_by_id"):
        settings.updated_by_id = current_user.id

    db.commit()
    db.refresh(settings)

    return {
        "id": settings.id,
        "log_level": settings.log_level,
        "log_retention_days": settings.log_retention_days,
        "enable_file_logging": settings.enable_file_logging,
        "enable_database_logging": settings.enable_database_logging,
        "enable_syslog": settings.enable_syslog,
        "log_api_requests": settings.log_api_requests,
        "log_database_queries": settings.log_database_queries,
        "log_user_actions": settings.log_user_actions,
        "updated_at": getattr(settings, "updated_at", None),
    }


# ============================================================================
# BACKUP SETTINGS ENDPOINTS
# ============================================================================


@router.get("/backup", response_model=dict)
async def get_backup_settings(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get backup settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, BackupSettings)
    return {
        "id": settings.id,
        "enable_automatic_backup": settings.enable_automatic_backup,
        "backup_frequency": settings.backup_frequency,
        "backup_time": settings.backup_time,
        "backup_location": settings.backup_location,
        "keep_last_n_backups": settings.keep_last_n_backups,
        "compress_backups": settings.compress_backups,
        "encrypt_backups": settings.encrypt_backups,
        "last_backup_at": settings.last_backup_at,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.put("/backup", response_model=dict)
async def update_backup_settings(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update backup settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, BackupSettings)

    # Update fields
    if "enable_automatic_backup" in data:
        settings.enable_automatic_backup = data["enable_automatic_backup"]

    if "backup_frequency" in data:
        if data["backup_frequency"] not in [
            "hourly",
            "every_2_hours",
            "daily",
            "weekly",
            "monthly",
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Geçersiz yedek sıklığı"
            )
        settings.backup_frequency = data["backup_frequency"]

    if "backup_time" in data:
        settings.backup_time = data["backup_time"]

    if "backup_location" in data:
        settings.backup_location = data["backup_location"]

    if "keep_last_n_backups" in data:
        settings.keep_last_n_backups = max(1, data["keep_last_n_backups"])

    if "compress_backups" in data:
        settings.compress_backups = data["compress_backups"]

    if "encrypt_backups" in data:
        settings.encrypt_backups = data["encrypt_backups"]

    if hasattr(settings, "updated_at"):
        settings.updated_at = utcnow()
    if hasattr(settings, "updated_by_id"):
        settings.updated_by_id = current_user.id

    db.commit()
    db.refresh(settings)

    return {
        "id": settings.id,
        "enable_automatic_backup": settings.enable_automatic_backup,
        "backup_frequency": settings.backup_frequency,
        "backup_time": settings.backup_time,
        "backup_location": settings.backup_location,
        "keep_last_n_backups": settings.keep_last_n_backups,
        "compress_backups": settings.compress_backups,
        "encrypt_backups": settings.encrypt_backups,
        "last_backup_at": settings.last_backup_at,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.post("/backup/trigger", response_model=dict)
async def trigger_manual_backup(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Trigger manual backup - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, BackupSettings)

    project_root = Path(__file__).resolve().parents[2]
    script_path = project_root / "scripts" / "auto_full_backup.ps1"
    if not script_path.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Yedek scripti bulunamadı: {script_path}",
        )

    fallback_backup_root = str(
        project_root.parent / "procureflow_full_backups" / "manual"
    )
    configured_location = (settings.backup_location or "").strip()
    if configured_location in ["", "/backups", "\\backups"]:
        configured_location = fallback_backup_root

    command = [
        "powershell",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(script_path),
        "-Source",
        str(project_root),
        "-BackupRoot",
        configured_location,
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                result.stderr or result.stdout or "Yedekleme komutu başarısız oldu"
            ).strip(),
        )

    target_path = None
    for line in result.stdout.splitlines():
        if line.startswith("TARGET="):
            target_path = line.split("=", 1)[1].strip()
            break

    settings.last_backup_at = utcnow().isoformat()

    if hasattr(settings, "updated_at"):
        settings.updated_at = utcnow()
    if hasattr(settings, "updated_by_id"):
        settings.updated_by_id = current_user.id

    db.commit()
    db.refresh(settings)

    return {
        "success": True,
        "message": "Yedek başarıyla oluşturuldu",
        "last_backup_at": settings.last_backup_at,
        "target_path": target_path,
    }


# ============================================================================
# NOTIFICATION SETTINGS ENDPOINTS
# ============================================================================


@router.get("/notifications", response_model=dict)
async def get_notification_settings(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get notification settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, NotificationSettings)
    return {
        "id": settings.id,
        "notify_on_quote_created": settings.notify_on_quote_created,
        "notify_on_quote_response": settings.notify_on_quote_response,
        "notify_on_quote_approved": settings.notify_on_quote_approved,
        "notify_on_quote_rejected": settings.notify_on_quote_rejected,
        "notify_on_contract_created": settings.notify_on_contract_created,
        "notify_on_contract_signed": settings.notify_on_contract_signed,
        "notify_on_system_errors": settings.notify_on_system_errors,
        "notify_on_maintenance": settings.notify_on_maintenance,
        "enable_daily_digest": settings.enable_daily_digest,
        "digest_time": settings.digest_time,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.put("/notifications", response_model=dict)
async def update_notification_settings(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update notification settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, NotificationSettings)

    # Update boolean fields
    if "notify_on_quote_created" in data:
        settings.notify_on_quote_created = data["notify_on_quote_created"]
    if "notify_on_quote_response" in data:
        settings.notify_on_quote_response = data["notify_on_quote_response"]
    if "notify_on_quote_approved" in data:
        settings.notify_on_quote_approved = data["notify_on_quote_approved"]
    if "notify_on_quote_rejected" in data:
        settings.notify_on_quote_rejected = data["notify_on_quote_rejected"]
    if "notify_on_contract_created" in data:
        settings.notify_on_contract_created = data["notify_on_contract_created"]
    if "notify_on_contract_signed" in data:
        settings.notify_on_contract_signed = data["notify_on_contract_signed"]
    if "notify_on_system_errors" in data:
        settings.notify_on_system_errors = data["notify_on_system_errors"]
    if "notify_on_maintenance" in data:
        settings.notify_on_maintenance = data["notify_on_maintenance"]
    if "enable_daily_digest" in data:
        settings.enable_daily_digest = data["enable_daily_digest"]
    if "digest_time" in data:
        settings.digest_time = data["digest_time"]

    if hasattr(settings, "updated_at"):
        settings.updated_at = utcnow()
    if hasattr(settings, "updated_by_id"):
        settings.updated_by_id = current_user.id

    db.commit()
    db.refresh(settings)

    return {
        "id": settings.id,
        "notify_on_quote_created": settings.notify_on_quote_created,
        "notify_on_quote_response": settings.notify_on_quote_response,
        "notify_on_quote_approved": settings.notify_on_quote_approved,
        "notify_on_quote_rejected": settings.notify_on_quote_rejected,
        "notify_on_contract_created": settings.notify_on_contract_created,
        "notify_on_contract_signed": settings.notify_on_contract_signed,
        "notify_on_system_errors": settings.notify_on_system_errors,
        "notify_on_maintenance": settings.notify_on_maintenance,
        "enable_daily_digest": settings.enable_daily_digest,
        "digest_time": settings.digest_time,
        "updated_at": getattr(settings, "updated_at", None),
    }


# ============================================================================
# API KEY ENDPOINTS
# ============================================================================


@router.get("/api-keys", response_model=list)
async def get_api_keys(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user's API keys"""
    keys = db.query(APIKey).filter(APIKey.user_id == current_user.id).all()
    return [
        {
            "id": key.id,
            "name": key.name,
            "key": key.key,
            "is_active": key.is_active,
            "created_at": key.created_at,
            "last_used_at": key.last_used_at,
        }
        for key in keys
    ]


@router.post("/api-keys", response_model=dict)
async def create_api_key(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new API key for current user"""
    name = data.get(
        "name",
        f"API Key {len(db.query(APIKey).filter(APIKey.user_id == current_user.id).all()) + 1}",
    )

    # Generate secure random key
    key_string = f"pk_{secrets.token_urlsafe(32)}"

    api_key = APIKey(
        user_id=current_user.id,
        name=name,
        key=key_string,
        is_active=True,
        created_at=utcnow(),
    )

    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    return {
        "id": api_key.id,
        "name": api_key.name,
        "key": api_key.key,
        "is_active": api_key.is_active,
        "created_at": api_key.created_at,
        "message": "API anahtarı başarıyla oluşturuldu. Lütfen anahtarı güvenli bir yere kaydedin.",
    }


@router.delete("/api-keys/{key_id}", response_model=dict)
async def revoke_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Revoke (delete) an API key"""
    api_key = (
        db.query(APIKey)
        .filter(APIKey.id == key_id, APIKey.user_id == current_user.id)
        .first()
    )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="API anahtarı bulunamadı"
        )

    db.delete(api_key)
    db.commit()

    return {"success": True, "message": "API anahtarı başarıyla iptal edildi"}
