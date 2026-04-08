# schemas/user.py
from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "satinalmaci"
    approval_limit: int = 100000
    department_id: int | None = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = None
    role: str | None = None
    approval_limit: int | None = None
    department_id: int | None = None
    is_active: bool | None = None


class UserOut(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ProfileOut(BaseModel):
    """Kullanıcı profil bilgisi"""

    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    department_id: int | None = None
    approval_limit: int

    model_config = ConfigDict(from_attributes=True)


class ChangePasswordRequest(BaseModel):
    """Şifre değişimi isteği"""

    old_password: str
    new_password: str


class ProfileUpdate(BaseModel):
    """Profil güncellemesi (kişi kendi profilini update eder)"""

    full_name: str | None = None

    model_config = ConfigDict(from_attributes=True)
