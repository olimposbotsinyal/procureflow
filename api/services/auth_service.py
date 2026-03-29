# api\services\auth_service.py
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from api.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from api.models.refresh_token import RefreshToken
from api.models.user import User


def refresh_tokens(db: Session, raw_refresh_token: str) -> dict:
    payload = decode_refresh_token(raw_refresh_token)

    user_id = int(payload["sub"])
    role = payload.get("role", "user")
    old_jti = payload["jti"]

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    if hasattr(user, "is_active") and not user.is_active:
        raise ValueError("User inactive")

    token_row = (
        db.query(RefreshToken)
        .filter(RefreshToken.jti == old_jti, RefreshToken.revoked_at.is_(None))
        .first()
    )
    if not token_row:
        raise ValueError("Refresh token revoked or not found")

    token_row.revoked_at = datetime.now(timezone.utc)

    new_refresh = create_refresh_token(sub=str(user.id), role=role)
    new_payload = decode_refresh_token(new_refresh)
    new_jti = new_payload["jti"]

    db.add(
        RefreshToken(
            jti=new_jti,
            user_id=user.id,
            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
            revoked_at=None,
        )
    )
    db.commit()

    new_access = create_access_token(sub=str(user.id), role=role)

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
    }
