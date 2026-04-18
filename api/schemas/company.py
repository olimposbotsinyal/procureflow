from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CompanyDepartmentSummary(BaseModel):
    id: int
    name: str
    sub_items: list[dict[str, int | str]] = []

    model_config = ConfigDict(from_attributes=True)


class CompanyCreate(BaseModel):
    name: str
    description: str | None = None
    logo_url: str | None = None
    color: str = "#3b82f6"
    is_active: bool = True
    trade_name: str | None = None
    tax_office: str | None = None
    tax_number: str | None = None
    registration_number: str | None = None
    address: str | None = None
    city: str | None = None
    address_district: str | None = None
    postal_code: str | None = None
    phone: str | None = None
    contact_info: str | None = None
    hide_location: bool = False
    share_on_whatsapp: bool = True


class CompanyUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    logo_url: str | None = None
    color: str | None = None
    is_active: bool | None = None
    trade_name: str | None = None
    tax_office: str | None = None
    tax_number: str | None = None
    registration_number: str | None = None
    address: str | None = None
    city: str | None = None
    address_district: str | None = None
    postal_code: str | None = None
    phone: str | None = None
    contact_info: str | None = None
    hide_location: bool | None = None
    share_on_whatsapp: bool | None = None


class CompanyOut(BaseModel):
    id: int
    name: str
    description: str | None
    logo_url: str | None = None
    color: str
    is_active: bool
    trade_name: str | None = None
    tax_office: str | None = None
    tax_number: str | None = None
    registration_number: str | None = None
    address: str | None = None
    city: str | None = None
    address_district: str | None = None
    postal_code: str | None = None
    phone: str | None = None
    contact_info: str | None = None
    hide_location: bool = False
    share_on_whatsapp: bool = True
    departments: list[CompanyDepartmentSummary] = []
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
