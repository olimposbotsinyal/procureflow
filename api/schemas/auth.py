# api\schemas\auth.py
from pydantic import BaseModel, Field


class TokenRefreshRequest(BaseModel):
    refresh_token: str = Field(..., min_length=10)


class TokenPairResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LogoutRequest(BaseModel):
    refresh_token: str


class MessageResponse(BaseModel):
    message: str
