# schemas/department.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class DepartmentBase(BaseModel):
    name: str
    description: str | None = None
    is_active: bool = True


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class DepartmentOut(DepartmentBase):
    id: int
    created_by_id: int | None = None
    created_at: datetime
    updated_at: datetime
    sub_items: list[dict[str, int | str]] = []
    model_config = ConfigDict(from_attributes=True)
