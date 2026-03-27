from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class QuoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    amount: float = Field(ge=0)


class QuoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    amount: float | None = Field(default=None, ge=0)


class QuoteOut(BaseModel):
    id: int
    user_id: int
    title: str
    amount: float
    status: Literal["draft", "submitted", "approved", "rejected"]
    created_at: datetime | None = None
    updated_at: datetime | None = None
    deleted_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class QuoteListOut(BaseModel):
    count: int
    page: int
    size: int
    items: list[QuoteOut]


class MessageOut(BaseModel):
    message: str
