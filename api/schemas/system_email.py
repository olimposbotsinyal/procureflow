from pydantic import BaseModel, ConfigDict


class SystemEmailSchema(BaseModel):
    id: int | None = None
    email: str
    password: str
    owner_user_id: int | None = None
    description: str | None = None
    signature_name: str | None = None
    signature_title: str | None = None
    signature_note: str | None = None
    signature_image_url: str | None = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class SystemEmailCreate(BaseModel):
    email: str
    password: str
    owner_user_id: int | None = None
    description: str | None = None
    signature_name: str | None = None
    signature_title: str | None = None
    signature_note: str | None = None
    signature_image_url: str | None = None
    is_active: bool = True


class SystemEmailUpdate(BaseModel):
    password: str | None = None
    description: str | None = None
    signature_name: str | None = None
    signature_title: str | None = None
    signature_note: str | None = None
    signature_image_url: str | None = None
    is_active: bool | None = None
