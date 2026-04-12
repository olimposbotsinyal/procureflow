"""Sistem Ayarları API Endpoints"""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.database import get_db
from api.core.deps import get_current_user
from api.models import User
from api.models.settings import SystemSettings
from api.schemas.settings import SettingsOut, SettingsUpdate

router = APIRouter(prefix="/settings", tags=["settings"])


def _ensure_admin(current_user: User) -> None:
    """Only super_admin can manage settings"""
    if current_user.role not in ["super_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can manage settings",
        )


def _get_or_create_settings(db: Session) -> SystemSettings:
    """Tek bir settings row var olmalı"""
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings(app_name="ProcureFlow")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("", response_model=SettingsOut)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sistem ayarlarını getir"""
    _ensure_admin(current_user)
    settings = _get_or_create_settings(db)
    payload = SettingsOut.model_validate(settings).model_dump()
    try:
        payload["vat_rates"] = [
            float(x) for x in json.loads(settings.vat_rates_json or "[1,10,20]")
        ]
    except Exception:
        payload["vat_rates"] = [1.0, 10.0, 20.0]
    return payload


@router.put("", response_model=SettingsOut)
def update_settings(
    payload: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sistem ayarlarını güncelle"""
    _ensure_admin(current_user)

    settings = _get_or_create_settings(db)

    # Güvenlik: sadece dolu alanları update et
    update_data = payload.model_dump(exclude_unset=True)
    vat_rates = update_data.pop("vat_rates", None)
    for key, value in update_data.items():
        setattr(settings, key, value)

    if vat_rates is not None:
        normalized_rates = sorted({float(x) for x in vat_rates if float(x) >= 0})
        if not normalized_rates:
            raise HTTPException(status_code=422, detail="KDV oran listesi boş olamaz")
        settings.vat_rates_json = json.dumps(normalized_rates)

    settings.updated_by_id = current_user.id
    db.commit()
    db.refresh(settings)

    payload_out = SettingsOut.model_validate(settings).model_dump()
    try:
        payload_out["vat_rates"] = [
            float(x) for x in json.loads(settings.vat_rates_json or "[1,10,20]")
        ]
    except Exception:
        payload_out["vat_rates"] = [1.0, 10.0, 20.0]
    return payload_out
