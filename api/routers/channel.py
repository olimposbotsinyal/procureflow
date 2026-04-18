"""Channel scope API router."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from api.database import get_db
from api.models.channel import (
    ChannelOrganization,
    ChannelMember,
    CommissionContract,
    CommissionLedger,
    ChannelReferral,
)

router = APIRouter(prefix="/channel", tags=["channel"])


# ---------------------------------------------------------------------------
# Schemas (satır içi — ileride api/schemas/channel.py'ye taşınabilir)
# ---------------------------------------------------------------------------


class ChannelOrgCreate(BaseModel):
    name: str
    slug: str
    tax_number: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    website: str | None = None
    address: str | None = None
    account_owner_user_id: int | None = None


class ChannelOrgRead(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool

    class Config:
        from_attributes = True


class CommissionContractCreate(BaseModel):
    channel_org_id: int
    contract_type: str = "commission"
    commission_rate_partner: float | None = None
    commission_rate_supplier: float | None = None
    fixed_amount_per_unit: float | None = None
    target_count: int | None = None
    currency: str = "TRY"


class LedgerEntryRead(BaseModel):
    id: int
    event_type: str
    amount: float
    currency: str
    status: str

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get("/organizations", response_model=list[ChannelOrgRead])
def list_channel_organizations(db: Session = Depends(get_db)):
    return (
        db.query(ChannelOrganization)
        .filter(ChannelOrganization.is_active == True)
        .all()
    )


@router.post(
    "/organizations", response_model=ChannelOrgRead, status_code=status.HTTP_201_CREATED
)
def create_channel_organization(
    payload: ChannelOrgCreate, db: Session = Depends(get_db)
):
    existing = (
        db.query(ChannelOrganization)
        .filter(ChannelOrganization.slug == payload.slug)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Bu slug zaten kullanımda.")
    org = ChannelOrganization(**payload.model_dump())
    db.add(org)
    db.commit()
    db.refresh(org)
    return org


@router.get("/organizations/{org_id}", response_model=ChannelOrgRead)
def get_channel_organization(org_id: int, db: Session = Depends(get_db)):
    org = db.get(ChannelOrganization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Channel organizasyonu bulunamadı.")
    return org


@router.post("/contracts", status_code=status.HTTP_201_CREATED)
def create_commission_contract(
    payload: CommissionContractCreate, db: Session = Depends(get_db)
):
    org = db.get(ChannelOrganization, payload.channel_org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Channel organizasyonu bulunamadı.")
    contract = CommissionContract(**payload.model_dump())
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return {"id": contract.id, "message": "Sözleşme oluşturuldu."}


@router.get("/organizations/{org_id}/ledger", response_model=list[LedgerEntryRead])
def get_ledger(org_id: int, db: Session = Depends(get_db)):
    entries = (
        db.query(CommissionLedger)
        .filter(CommissionLedger.channel_org_id == org_id)
        .order_by(CommissionLedger.created_at.desc())
        .all()
    )
    return entries
