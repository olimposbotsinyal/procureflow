"""Quote ve Teklif İsteği (RFQ) Şemaları"""

from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, Literal


# ============ QUOTE ITEM SCHEMAS ============


class QuoteItemCreate(BaseModel):
    """Teklif kalemi oluştur"""

    line_number: str
    category_code: str = ""
    category_name: str = ""
    description: str
    unit: str
    quantity: float
    unit_price: Optional[float] = None
    vat_rate: float = 20
    group_key: Optional[str] = None
    is_group_header: bool = False
    notes: Optional[str] = None


class QuoteItemOut(QuoteItemCreate):
    """Teklif kalemi çıktı"""

    id: int
    quote_id: int
    total_price: Optional[float] = None
    sequence: int

    model_config = ConfigDict(from_attributes=True)


# ============ QUOTE SCHEMAS ============


class QuoteCreate(BaseModel):
    """Teklif oluştur"""

    project_id: int
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    company_name: str = Field(min_length=1, max_length=255)
    company_contact_name: str
    company_contact_phone: str
    company_contact_email: str
    department_id: Optional[int] = None
    assigned_to_id: Optional[int] = None


class QuoteUpdate(BaseModel):
    """Teklif güncelle"""

    title: Optional[str] = None
    amount: Optional[float] = Field(default=None, ge=0)
    description: Optional[str] = None
    company_name: Optional[str] = None
    company_contact_name: Optional[str] = None
    company_contact_phone: Optional[str] = None
    company_contact_email: Optional[str] = None


class QuoteOut(BaseModel):
    """Teklif çıktı"""

    id: int
    project_id: int
    created_by_id: int
    title: str
    description: Optional[str] = None
    status: str
    company_name: str
    company_contact_name: str
    company_contact_phone: str
    company_contact_email: str
    total_amount: float
    currency: str
    version: Optional[int] = None
    transition_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    deadline: Optional[datetime] = None
    is_active: bool
    department_id: Optional[int] = None
    assigned_to_id: Optional[int] = None
    items: list[QuoteItemOut] = []

    model_config = ConfigDict(from_attributes=True)


# Uyumluluk için eski şemalar
class QuoteCreateOld(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    amount: float = Field(ge=0)
    project_id: int | None = None


class QuoteUpdateOld(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    amount: float | None = Field(default=None, ge=0)


class QuoteListOut(BaseModel):
    count: int
    page: int
    size: int
    items: list[QuoteOut]


class MessageOut(BaseModel):
    message: str


# ============ APPROVAL SCHEMAS ============


class QuoteApprovalCreate(BaseModel):
    """Onay isteği oluştur"""

    quote_id: int
    approval_level: int
    required_role: str


class QuoteApprovalOut(BaseModel):
    """Onay çıktı"""

    id: int
    quote_id: int
    approval_level: int
    required_role: str
    status: str
    comment: Optional[str] = None
    requested_at: datetime
    completed_at: Optional[datetime] = None
    approved_by_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
