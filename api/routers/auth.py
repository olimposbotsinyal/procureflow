# api\routers\auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from api.core.security import create_access_token, verify_password
from api.core.deps import get_current_user
from api.db.session import get_db
from api.models import User
from api.schemas.auth import TokenPairResponse, TokenRefreshRequest
from api.services.auth_service import refresh_tokens


router = APIRouter(prefix="/auth", tags=["auth"])


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(sub=user.email, role=user.role)
    return {"access_token": token, "token_type": "bearer"}


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
