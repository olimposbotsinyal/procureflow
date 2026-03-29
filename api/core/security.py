from datetime import datetime, timedelta, timezone
import os
import hashlib
from uuid import uuid4

from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
REFRESH_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_EXPIRE_DAYS", "7"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(sub: str, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": sub,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=EXPIRE_MINUTES)).timestamp()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise ValueError("Invalid or expired token")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_refresh_token(sub: str, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": sub,
        "role": role,
        "type": "refresh",
        "jti": str(uuid4()),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(days=REFRESH_EXPIRE_DAYS)).timestamp()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError as exc:
        raise ValueError("Refresh token expired") from exc
    except JWTError as exc:
        raise ValueError("Invalid refresh token") from exc

    if payload.get("type") != "refresh":
        raise ValueError("Token type must be refresh")

    if not payload.get("sub"):
        raise ValueError("Token subject is missing")

    if not payload.get("jti"):
        raise ValueError("Token jti is missing")

    return payload


def hash_jti(jti: str) -> str:
    return hashlib.sha256(jti.encode("utf-8")).hexdigest()
