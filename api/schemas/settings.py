"""Sistem Ayarları Şemaları"""

from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional


class SettingsUpdate(BaseModel):
    """Ayarları güncelle"""

    # SMTP
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_from_email: Optional[EmailStr] = None
    smtp_from_name: Optional[str] = None
    smtp_use_tls: Optional[bool] = None
    smtp_enabled: Optional[bool] = None

    # Company
    app_name: Optional[str] = None
    company_name: Optional[str] = None
    company_logo_url: Optional[str] = None
    vat_rates: Optional[list[float]] = None


class SettingsOut(BaseModel):
    """Ayarları döndür"""

    id: int
    # SMTP
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_from_email: Optional[str] = None
    smtp_from_name: Optional[str] = None
    smtp_use_tls: bool
    smtp_enabled: bool

    # Company
    app_name: str
    company_name: Optional[str] = None
    company_logo_url: Optional[str] = None
    vat_rates: list[float] = [1, 10, 20]

    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
