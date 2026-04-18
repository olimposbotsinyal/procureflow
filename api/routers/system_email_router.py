from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from api.models.system_email import SystemEmail
from api.schemas.system_email import SystemEmailSchema
from api.database import get_db
from api.core.authz import can_access_procurement_settings, is_super_admin
from api.core.deps import get_current_user
from api.models.user import User

router = APIRouter(prefix="/system-emails", tags=["system-emails"])


def _ensure_admin(current_user: User) -> User:
    if not can_access_procurement_settings(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin yetkisi gerekli"
        )
    return current_user


def _resolve_owner_scope(
    current_user: User, owner_user_id: int | None = None
) -> int | None:
    if is_super_admin(current_user):
        return owner_user_id
    return current_user.id


@router.get("/", response_model=List[SystemEmailSchema])
def list_system_emails(
    owner_user_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ensure_admin(current_user)
    resolved_owner = _resolve_owner_scope(current_user, owner_user_id)
    query = db.query(SystemEmail)
    if resolved_owner is None:
        query = query.filter(SystemEmail.owner_user_id.is_(None))
    else:
        query = query.filter(SystemEmail.owner_user_id == resolved_owner)
    return query.order_by(SystemEmail.id.asc()).all()


# Slashsiz endpoint desteği
@router.get("", response_model=List[SystemEmailSchema])
def list_system_emails_no_slash(
    owner_user_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_system_emails(owner_user_id, current_user, db)


from api.schemas.system_email import SystemEmailCreate, SystemEmailUpdate


@router.post("/", response_model=SystemEmailSchema)
def add_system_email(
    email: SystemEmailCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ensure_admin(current_user)
    if db.query(SystemEmail).filter_by(email=email.email).first():
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı.")
    resolved_owner = _resolve_owner_scope(current_user, email.owner_user_id)
    obj = SystemEmail(
        email=email.email,
        password=email.password,
        owner_user_id=resolved_owner,
        description=email.description,
        signature_name=email.signature_name,
        signature_title=email.signature_title,
        signature_note=email.signature_note,
        signature_image_url=email.signature_image_url,
        is_active=email.is_active,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{email_id}", response_model=SystemEmailSchema)
def update_system_email(
    email_id: int,
    update: SystemEmailUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ensure_admin(current_user)
    obj = db.query(SystemEmail).filter_by(id=email_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Email bulunamadı.")
    resolved_owner = _resolve_owner_scope(current_user, obj.owner_user_id)
    if obj.owner_user_id != resolved_owner:
        raise HTTPException(
            status_code=403, detail="Bu email hesabını düzenleme yetkiniz yok"
        )
    # Sadece gönderilen alanları güncelle
    if update.password is not None:
        obj.password = update.password
    if update.description is not None:
        obj.description = update.description
    if update.signature_name is not None:
        obj.signature_name = update.signature_name
    if update.signature_title is not None:
        obj.signature_title = update.signature_title
    if update.signature_note is not None:
        obj.signature_note = update.signature_note
    if update.signature_image_url is not None:
        obj.signature_image_url = update.signature_image_url
    if update.is_active is not None:
        obj.is_active = update.is_active
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{email_id}")
def delete_system_email(
    email_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ensure_admin(current_user)
    obj = db.query(SystemEmail).filter_by(id=email_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Email bulunamadı.")
    resolved_owner = _resolve_owner_scope(current_user, obj.owner_user_id)
    if obj.owner_user_id != resolved_owner:
        raise HTTPException(
            status_code=403, detail="Bu email hesabını silme yetkiniz yok"
        )
    db.delete(obj)
    db.commit()
    return {"ok": True}
