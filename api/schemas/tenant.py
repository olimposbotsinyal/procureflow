from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TenantInitialAdminCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: str = Field(..., min_length=5, max_length=255)
    personal_phone: str | None = Field(default=None, max_length=32)
    company_phone: str | None = Field(default=None, max_length=32)
    company_phone_short: str | None = Field(default=None, max_length=16)


class TenantCreate(BaseModel):
    legal_name: str = Field(..., min_length=2, max_length=255)
    brand_name: str | None = Field(default=None, max_length=255)
    slug: str | None = Field(default=None, max_length=120)
    logo_url: str | None = Field(default=None, max_length=500)
    tax_number: str | None = Field(default=None, max_length=32)
    tax_office: str | None = Field(default=None, max_length=255)
    country: str | None = Field(default=None, max_length=100)
    city: str | None = Field(default=None, max_length=100)
    address: str | None = Field(default=None, max_length=500)
    subscription_plan_code: str | None = Field(default="starter", max_length=50)
    owner_user_id: int | None = None
    initial_admin: TenantInitialAdminCreate | None = None
    status: str = Field(default="active", max_length=50)
    onboarding_status: str = Field(default="draft", max_length=50)
    is_active: bool = True


class TenantUpdate(BaseModel):
    legal_name: str | None = Field(default=None, min_length=2, max_length=255)
    brand_name: str | None = Field(default=None, max_length=255)
    slug: str | None = Field(default=None, max_length=120)
    logo_url: str | None = Field(default=None, max_length=500)
    tax_number: str | None = Field(default=None, max_length=32)
    tax_office: str | None = Field(default=None, max_length=255)
    country: str | None = Field(default=None, max_length=100)
    city: str | None = Field(default=None, max_length=100)
    address: str | None = Field(default=None, max_length=500)
    subscription_plan_code: str | None = Field(default=None, max_length=50)
    owner_user_id: int | None = None
    status: str | None = Field(default=None, max_length=50)
    onboarding_status: str | None = Field(default=None, max_length=50)
    support_status: str | None = Field(default=None, max_length=50)
    support_owner_name: str | None = Field(default=None, max_length=255)
    support_notes: str | None = None
    support_resolution_reason: str | None = None
    support_last_contacted_at: datetime | None = None
    is_active: bool | None = None


class TenantSupportWorkflowUpdate(BaseModel):
    support_status: str | None = Field(default=None, max_length=50)
    support_owner_name: str | None = Field(default=None, max_length=255)
    support_notes: str | None = None
    support_resolution_reason: str | None = None
    support_last_contacted_at: datetime | None = None


class TenantOut(BaseModel):
    id: int
    slug: str
    legal_name: str
    brand_name: str | None = None
    logo_url: str | None = None
    tax_number: str | None = None
    tax_office: str | None = None
    country: str | None = None
    city: str | None = None
    address: str | None = None
    subscription_plan_code: str | None = None
    owner_user_id: int | None = None
    status: str
    onboarding_status: str
    support_status: str
    is_active: bool
    owner_email: str | None = None
    owner_full_name: str | None = None
    support_owner_name: str | None = None
    support_notes: str | None = None
    support_resolution_reason: str | None = None
    support_last_contacted_at: datetime | None = None
    initial_admin_email_sent: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
