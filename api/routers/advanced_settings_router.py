# FILE: /api/routers/advanced_settings_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
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
from api.database import get_db
from api.core.deps import get_current_user
from api.core.time import utcnow

router = APIRouter(prefix="/advanced-settings", tags=["advanced-settings"])


def _ensure_admin(current_user: User) -> User:
    """Admin check function"""
    if current_user.role not in ["super_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için admin yetkisi gerekli",
        )
    return current_user


def _get_or_create_settings(db: Session, model_class, setting_type: str = "default"):
    """Generic function to get or create singleton settings"""
    settings = db.query(model_class).first()
    if not settings:
        if model_class == EmailSettings:
            settings = EmailSettings(
                smtp_host="",
                smtp_port=587,
                smtp_username="",
                smtp_password="",
                from_email="noreply@procureflow.com",
                from_name="ProcureFlow",
                use_tls=True,
                use_ssl=False,
                enable_email_notifications=False,
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
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get email (SMTP) settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, EmailSettings)
    return {
        "id": settings.id,
        "smtp_host": settings.smtp_host,
        "smtp_port": settings.smtp_port,
        "smtp_username": settings.smtp_username,
        "smtp_password": settings.smtp_password,
        "from_email": settings.from_email,
        "from_name": settings.from_name,
        "use_tls": settings.use_tls,
        "use_ssl": settings.use_ssl,
        "enable_email_notifications": settings.enable_email_notifications,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.put("/email", response_model=dict)
async def update_email_settings(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update email (SMTP) settings - Admin only"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db, EmailSettings)

    # Update fields
    if "smtp_host" in data:
        settings.smtp_host = data["smtp_host"]
    if "smtp_port" in data:
        settings.smtp_port = data["smtp_port"]
    if "smtp_username" in data:
        settings.smtp_username = data["smtp_username"]
    if "smtp_password" in data:
        settings.smtp_password = data["smtp_password"]
    if "from_email" in data:
        settings.from_email = data["from_email"]
    if "from_name" in data:
        settings.from_name = data["from_name"]
    if "use_tls" in data:
        settings.use_tls = data["use_tls"]
    if "use_ssl" in data:
        settings.use_ssl = data["use_ssl"]
    if "enable_email_notifications" in data:
        settings.enable_email_notifications = data["enable_email_notifications"]

    if hasattr(settings, "updated_at"):
        settings.updated_at = utcnow()
    if hasattr(settings, "updated_by_id"):
        settings.updated_by_id = current_user.id

    db.commit()
    db.refresh(settings)

    return {
        "id": settings.id,
        "smtp_host": settings.smtp_host,
        "smtp_port": settings.smtp_port,
        "smtp_username": settings.smtp_username,
        "smtp_password": settings.smtp_password,
        "from_email": settings.from_email,
        "from_name": settings.from_name,
        "use_tls": settings.use_tls,
        "use_ssl": settings.use_ssl,
        "enable_email_notifications": settings.enable_email_notifications,
        "updated_at": getattr(settings, "updated_at", None),
    }


@router.post("/email/test", response_model=dict)
async def test_email_settings(
    data: dict,
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

    settings = _get_or_create_settings(db, EmailSettings)

    try:
        print(f"[EMAIL] Test email gönderiliyor...")
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
        print(f"[EMAIL] SMTP bağlantısı kuruluyor...")
        if settings.use_ssl:
            server = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port)
        else:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
            if settings.use_tls:
                print(f"[EMAIL] TLS başlatılıyor...")
                server.starttls()

        if settings.smtp_username and settings.smtp_password:
            print(f"[EMAIL] Login yapılıyor...")
            server.login(settings.smtp_username, settings.smtp_password)
            print(f"[EMAIL] Login başarılı")

        print(f"[EMAIL] Email gönderiliyor...")
        server.send_message(msg)
        server.quit()
        print(f"[EMAIL] Email başarıyla gönderildi")

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
