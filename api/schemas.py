# schemas.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class QuoteCreate(BaseModel):
    title: str
    amount: float


class QuoteUpdate(BaseModel):
    title: str | None = None
    amount: float | None = None


class QuoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    amount: float

    created_at: datetime | None = None
    created_by: int | None = None
    updated_at: datetime | None = None
    updated_by: int | None = None
    deleted_at: datetime | None = None
    deleted_by: int | None = None


class QuoteListOut(BaseModel):
    count: int
    page: int
    size: int
    items: list[QuoteOut]


class MessageOut(BaseModel):
    message: str
