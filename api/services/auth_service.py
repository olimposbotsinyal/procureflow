from datetime import datetime, timezone

from sqlalchemy.orm import Session

from api.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_jti,
)
from api.models.refresh_token import RefreshToken
from api.models.user import User


def refresh_tokens(db: Session, raw_refresh_token: str) -> dict:
    payload = decode_refresh_token(raw_refresh_token)

    user_id = int(payload["sub"])
    old_jti_hash = hash_jti(payload["jti"])

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    if hasattr(user, "is_active") and not user.is_active:
        raise ValueError("User inactive")

    token_row = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.jti_hash == old_jti_hash,
            RefreshToken.revoked_at.is_(None),
        )
        .first()
    )
    if not token_row:
        raise ValueError("Refresh token revoked or not found")

    now_utc = datetime.now(timezone.utc)
    if token_row.expires_at <= now_utc:
        raise ValueError("Refresh token expired")

    # Eski refresh token'ı rotasyon için revoke et
    token_row.revoked_at = now_utc

    # Yeni refresh token üret
    new_refresh = create_refresh_token(sub=str(user.id), role=user.role)
    new_payload = decode_refresh_token(new_refresh)
    new_jti_hash = hash_jti(new_payload["jti"])
    new_exp_ts = int(new_payload["exp"])
    new_expires_at = datetime.fromtimestamp(new_exp_ts, tz=timezone.utc)

    db.add(
        RefreshToken(
            jti_hash=new_jti_hash,
            user_id=user.id,
            expires_at=new_expires_at,
            revoked_at=None,
        )
    )

    db.commit()

    # Access token role'u payload'dan değil DB'den gelsin
    new_access = create_access_token(sub=str(user.id), role=user.role)

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
    }


def logout_refresh_token(db: Session, raw_refresh_token: str) -> None:
    payload = decode_refresh_token(raw_refresh_token)
    jti_hash_value = hash_jti(payload["jti"])

    token_row = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.jti_hash == jti_hash_value,
            RefreshToken.revoked_at.is_(None),
        )
        .first()
    )

    if not token_row:
        raise ValueError("Refresh token already revoked or not found")

    token_row.revoked_at = datetime.now(timezone.utc)
    db.commit()
