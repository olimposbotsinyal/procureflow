"""Kullanıcı Profili API Endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.database import get_db
from api.core.deps import get_current_user
from api.models import User
from api.schemas.user import ProfileOut, ChangePasswordRequest, ProfileUpdate
from api.core.security import get_password_hash, verify_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/profile", response_model=ProfileOut)
def get_my_profile(
    current_user: User = Depends(get_current_user),
) -> ProfileOut:
    """Kendi profilimi getir"""
    return ProfileOut.from_orm(current_user)


@router.put("/profile", response_model=ProfileOut)
def update_my_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileOut:
    """Kendi profilimi güncelle (sadece full_name)"""
    if payload.full_name and payload.full_name.strip():
        current_user.full_name = payload.full_name.strip()

    db.commit()
    db.refresh(current_user)
    return ProfileOut.from_orm(current_user)


@router.post("/profile/change-password", status_code=status.HTTP_200_OK)
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Şifre değiştir"""
    # Eski şifre kontrolü
    if not verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Mevcut şifre yanlış"
        )

    # Yeni şifre validasyonu
    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yeni şifre en az 8 karakter olmalı",
        )

    # Aynı şifre kontrolü
    if payload.old_password == payload.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yeni şifre eski şifreden farklı olmalı",
        )

    # Şifre güncelle
    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()

    return {"message": "Şifre başarıyla değiştirildi"}


# Admin endpoints
@router.get("/{user_id}/profile", response_model=ProfileOut)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileOut:
    """Admin: Kullanıcı profilini getir"""
    if current_user.role not in ["super_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece admin bu işlemi yapabilir",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı"
        )

    return ProfileOut.from_orm(user)


@router.put("/{user_id}/profile", response_model=ProfileOut)
def update_user_profile(
    user_id: int,
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileOut:
    """Admin: Kullanıcı profilini güncelle"""
    if current_user.role not in ["super_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece admin bu işlemi yapabilir",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı"
        )

    if payload.full_name and payload.full_name.strip():
        user.full_name = payload.full_name.strip()

    db.commit()
    db.refresh(user)
    return ProfileOut.from_orm(user)
