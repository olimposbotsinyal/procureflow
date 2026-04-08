from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CompanyCreate(BaseModel):
    name: str
    description: str | None = None
    color: str = "#3b82f6"
    is_active: bool = True


class CompanyUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    color: str | None = None
    is_active: bool | None = None


class CompanyOut(BaseModel):
    id: int
    name: str
    description: str | None
    color: str
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
