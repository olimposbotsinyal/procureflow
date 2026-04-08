from pydantic import BaseModel, ConfigDict, Field


class PermissionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    category: str = Field(default="general", min_length=1, max_length=50)
    tooltip: str | None = None


class PermissionCreate(PermissionBase):
    pass


class PermissionUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    category: str | None = None
    tooltip: str | None = None


class PermissionOut(PermissionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
