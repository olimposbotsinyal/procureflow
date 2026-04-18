"""Payment API router — çoklu sağlayıcı ödeme başlatma ve webhook."""

from __future__ import annotations

import json
import logging
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from api.core.time import utcnow
from api.database import get_db
from api.models.payment import PaymentTransaction, PaymentWebhookEvent
from api.services.payment import (
    BankTransferAdapter,
    IyzicoAdapter,
    ParamAdapter,
    PayTRAdapter,
    PaymentRequest,
    SipayAdapter,
)
from api.services.payment.provider_settings_service import list_public_active_providers
from api.services.payment.provider_settings_service import (
    get_provider_credentials_for_runtime,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payment", tags=["payment"])


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------


class InitiatePaymentRequest(BaseModel):
    provider: str  # iyzico | paytr | sipay | bank_transfer | paypal
    amount: Decimal
    currency: str = "TRY"
    description: str
    buyer_email: str
    buyer_name: str
    transaction_type: str = "subscription"
    reference_id: int | None = None
    reference_type: str | None = None
    extra: dict | None = None


# ---------------------------------------------------------------------------
# Sağlayıcı fabrika
# ---------------------------------------------------------------------------


def _get_adapter(provider: str, db: Session):
    normalized = provider.strip().lower()
    credentials = get_provider_credentials_for_runtime(db, normalized)
    if normalized == "iyzico":
        return IyzicoAdapter(credentials=credentials)
    if normalized == "paytr":
        return PayTRAdapter(credentials=credentials)
    if normalized in {"param", "parampos"}:
        return ParamAdapter(credentials=credentials)
    if normalized == "sipay":
        return SipayAdapter(credentials=credentials)
    if normalized in {"havale", "eft", "bank_transfer"}:
        return BankTransferAdapter(credentials=credentials)
    raise HTTPException(
        status_code=400,
        detail=f"'{provider}' sağlayıcısı henüz desteklenmiyor. Desteklenenler: iyzico, paytr, param, sipay, bank_transfer",
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get("/providers")
def get_payment_providers(db: Session = Depends(get_db)):
    return {"providers": list_public_active_providers(db)}


@router.post("/initiate", status_code=status.HTTP_201_CREATED)
def initiate_payment(payload: InitiatePaymentRequest, db: Session = Depends(get_db)):
    normalized_provider = payload.provider.strip().lower()
    canonical_provider = {
        "parampos": "param",
        "havale": "bank_transfer",
        "eft": "bank_transfer",
    }.get(normalized_provider, normalized_provider)
    active_codes = {row["code"] for row in list_public_active_providers(db)}
    if canonical_provider not in active_codes:
        raise HTTPException(
            status_code=400,
            detail=f"'{payload.provider}' pasif durumda veya odeme ekranina acik degil",
        )

    adapter = _get_adapter(payload.provider, db)

    req = PaymentRequest(
        amount=payload.amount,
        currency=payload.currency,
        description=payload.description,
        buyer_email=payload.buyer_email,
        buyer_name=payload.buyer_name,
        extra=payload.extra,
    )
    result = adapter.initiate_payment(req)

    # İşlem kaydını oluştur
    txn = PaymentTransaction(
        transaction_type=payload.transaction_type,
        reference_id=payload.reference_id,
        reference_type=payload.reference_type,
        provider=payload.provider,
        provider_transaction_id=result.provider_transaction_id,
        amount=payload.amount,
        currency=payload.currency,
        status="processing" if result.success else "failed",
        failure_reason=result.error_message,
        provider_response_raw=json.dumps(result.raw_response),
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)

    if not result.success:
        raise HTTPException(
            status_code=402, detail=result.error_message or "Ödeme başlatılamadı."
        )

    return {
        "transaction_id": txn.id,
        "provider": payload.provider,
        "redirect_url": result.redirect_url,
        "provider_transaction_id": result.provider_transaction_id,
    }


@router.post("/webhook/{provider}")
async def payment_webhook(
    provider: str, request: Request, db: Session = Depends(get_db)
):
    """Sağlayıcıdan gelen webhook bildirimlerini alır ve kaydeder."""
    body = await request.body()
    headers = dict(request.headers)

    try:
        payload_dict = json.loads(body)
    except json.JSONDecodeError:
        payload_dict = {}

    adapter = _get_adapter(provider, db)
    sig_valid = adapter.verify_webhook(headers, body)

    event = PaymentWebhookEvent(
        provider=provider,
        payload_raw=body.decode("utf-8", errors="replace"),
        signature_valid=sig_valid,
        processed=False,
    )
    db.add(event)
    db.flush()

    if sig_valid:
        result = adapter.handle_webhook(payload_dict)
        event.event_type = result.get("status")
        event.processed = True

        # İlgili işlemi güncelle
        txn_pid = result.get("provider_transaction_id")
        if txn_pid:
            txn = (
                db.query(PaymentTransaction)
                .filter(PaymentTransaction.provider_transaction_id == txn_pid)
                .first()
            )
            if txn:
                txn.status = (
                    "succeeded" if result.get("status") == "success" else "failed"
                )
                txn.completed_at = utcnow()
                event.linked_transaction_id = txn.id

    db.commit()
    return {"received": True}


@router.get("/transactions/{txn_id}")
def get_transaction(txn_id: int, db: Session = Depends(get_db)):
    txn = db.get(PaymentTransaction, txn_id)
    if not txn:
        raise HTTPException(status_code=404, detail="İşlem bulunamadı.")
    return {
        "id": txn.id,
        "provider": txn.provider,
        "amount": str(txn.amount),
        "currency": txn.currency,
        "status": txn.status,
        "created_at": txn.created_at,
    }
