# api\schemas\auth.py
from pydantic import BaseModel, Field
from typing import Optional


class TokenRefreshRequest(BaseModel):
    refresh_token: str = Field(..., min_length=10)


class UserLoginResponse(BaseModel):
    id: int
    email: str
    role: str
    full_name: Optional[str] = None
    department_id: Optional[int] = None


class TokenPairResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[UserLoginResponse] = None


class LogoutRequest(BaseModel):
    refresh_token: str


class MessageResponse(BaseModel):
    message: str
