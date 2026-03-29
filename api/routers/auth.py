# api\routers\auth.py
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from api.core.deps import get_current_user
from api.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    verify_password,
    hash_jti,
)
from api.db.session import get_db
from api.models import User, RefreshToken
from api.schemas.auth import (
    TokenPairResponse,
    TokenRefreshRequest,
    LogoutRequest,
    MessageResponse,
)
from api.services.auth_service import refresh_tokens, logout_refresh_token


router = APIRouter(prefix="/auth", tags=["auth"])


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@router.post("/login", response_model=TokenPairResponse)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(sub=str(user.id), role=user.role)
    refresh_token = create_refresh_token(sub=str(user.id), role=user.role)

    # refresh token içindeki jti + exp bilgilerini al
    payload = decode_refresh_token(refresh_token)
    jti_hash_value = hash_jti(payload["jti"])
    exp_ts = int(payload["exp"])
    expires_at = datetime.fromtimestamp(exp_ts, tz=timezone.utc)

    db.add(
        RefreshToken(
            jti_hash=jti_hash_value,
            user_id=user.id,
            expires_at=expires_at,
            revoked_at=None,
        )
    )
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
    }


@router.post("/refresh", response_model=TokenPairResponse)
def refresh_token(payload: TokenRefreshRequest, db: Session = Depends(get_db)):
    try:
        return refresh_tokens(db, payload.refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


@router.post("/logout", response_model=MessageResponse)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)):
    try:
        logout_refresh_token(db, payload.refresh_token)
        return {"message": "Logged out successfully"}
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
