"""Supplier Response - Tedarikçi Yanıtları API"""

import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, UTC
from pydantic import BaseModel

from api.database import get_db
from api.models import (
    SupplierQuote,
    SupplierQuoteItem,
    SupplierUser,
    Quote,
    Supplier,
    User,
)
from api.core.deps import get_current_user, get_current_supplier_user, get_any_user
from api.services.email_service import get_email_service

router = APIRouter(prefix="/supplier-quotes", tags=["supplier-quotes"])


def _is_postgresql(db: Session) -> bool:
    return getattr(getattr(db, "bind", None), "dialect", None).name == "postgresql"


def _ensure_initial_final_amount_column(db: Session) -> None:
    """supplier_quotes tablosunda initial_final_amount kolonu yoksa ekler."""
    try:
        if _is_postgresql(db):
            db.execute(
                text(
                    "ALTER TABLE supplier_quotes ADD COLUMN initial_final_amount DOUBLE PRECISION"
                )
            )
        else:
            db.execute(
                text("ALTER TABLE supplier_quotes ADD COLUMN initial_final_amount REAL")
            )
        db.commit()
    except Exception:
        db.rollback()


def _parse_quote_item_meta(notes: str | None) -> dict:
    if not notes:
        return {"detail": "", "image_url": ""}
    try:
        parsed = json.loads(notes)
        if isinstance(parsed, dict):
            return {
                "detail": str(parsed.get("detail") or ""),
                "image_url": str(parsed.get("image_url") or ""),
            }
    except Exception:
        pass
    return {"detail": str(notes), "image_url": ""}


def _ensure_supplier_quote_price_rules_table(db: Session) -> None:
    if _is_postgresql(db):
        db.execute(
            text("""
            CREATE TABLE IF NOT EXISTS supplier_quote_price_rules (
                id BIGSERIAL PRIMARY KEY,
                max_markup_percent DOUBLE PRECISION NOT NULL DEFAULT 25,
                max_discount_percent DOUBLE PRECISION NOT NULL DEFAULT 35,
                tolerance_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
                block_on_violation BOOLEAN NOT NULL DEFAULT TRUE,
                updated_by INTEGER,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        """)
        )
    else:
        db.execute(
            text("""
            CREATE TABLE IF NOT EXISTS supplier_quote_price_rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                max_markup_percent REAL NOT NULL DEFAULT 25,
                max_discount_percent REAL NOT NULL DEFAULT 35,
                tolerance_amount REAL NOT NULL DEFAULT 0,
                block_on_violation INTEGER NOT NULL DEFAULT 1,
                updated_by INTEGER,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        )
    row = db.execute(
        text("SELECT id FROM supplier_quote_price_rules ORDER BY id DESC LIMIT 1")
    ).first()
    if not row:
        db.execute(
            text("""
            INSERT INTO supplier_quote_price_rules (
                max_markup_percent, max_discount_percent, tolerance_amount, block_on_violation
            ) VALUES (25, 35, 0, 1)
        """)
        )
    db.commit()


def _get_supplier_quote_price_rules(db: Session) -> dict:
    _ensure_supplier_quote_price_rules_table(db)
    row = (
        db.execute(
            text("""
        SELECT max_markup_percent, max_discount_percent, tolerance_amount, block_on_violation
        FROM supplier_quote_price_rules
        ORDER BY id DESC
        LIMIT 1
    """)
        )
        .mappings()
        .first()
    )
    return {
        "max_markup_percent": float(row["max_markup_percent"]),
        "max_discount_percent": float(row["max_discount_percent"]),
        "tolerance_amount": float(row["tolerance_amount"]),
        "block_on_violation": bool(row["block_on_violation"]),
    }


def _validate_supplier_quote_price_rules(
    db: Session, quote: Quote, final_amount: float
) -> dict:
    rules = _get_supplier_quote_price_rules(db)
    baseline = float(quote.total_amount or 0)
    if baseline <= 0:
        return {"ok": True, "rules": rules, "violations": [], "allowed_range": None}

    min_allowed = (baseline * (1 - (rules["max_discount_percent"] / 100.0))) - rules[
        "tolerance_amount"
    ]
    max_allowed = (baseline * (1 + (rules["max_markup_percent"] / 100.0))) + rules[
        "tolerance_amount"
    ]

    violations: list[str] = []
    if final_amount < min_allowed:
        violations.append("Teklif tutarı izin verilen minimum değerin altında")
    if final_amount > max_allowed:
        violations.append("Teklif tutarı izin verilen maksimum değerin üstünde")

    return {
        "ok": len(violations) == 0,
        "rules": rules,
        "violations": violations,
        "allowed_range": {
            "min": round(min_allowed, 2),
            "max": round(max_allowed, 2),
            "baseline": baseline,
        },
    }


# ============ SCHEMAS ============


class SupplierQuoteItemUpdate(BaseModel):
    """Tedarikçi tarafından gönderilen fiyat"""

    quote_item_id: int
    unit_price: float
    total_price: float
    notes: str | None = None


class SupplierQuoteSubmit(BaseModel):
    """Tedarikçi teklif sunumu"""

    total_amount: float
    discount_percent: float = 0
    discount_amount: float = 0
    final_amount: float
    payment_terms: str | None = None
    delivery_time: int | None = None  # Gün sayısı
    warranty: str | None = None
    items: list[SupplierQuoteItemUpdate]


class SupplierResponseOut(BaseModel):
    """Tedarikçi yanıtı"""

    id: int
    quote_id: int
    supplier_id: int
    status: str
    total_amount: float
    discount_percent: float
    discount_amount: float
    final_amount: float
    payment_terms: str | None
    delivery_time: int | None
    warranty: str | None
    submitted_at: datetime | None
    created_at: datetime


class SupplierQuotePriceRulesUpdate(BaseModel):
    max_markup_percent: float
    max_discount_percent: float
    tolerance_amount: float = 0
    block_on_violation: bool = True


# ============ ENDPOINTS ============


@router.get("/price-rules", response_model=dict)
def get_supplier_quote_price_rules(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    role = getattr(current_user, "role", None)
    if role not in [
        "super_admin",
        "admin",
        "satinalmaci",
        "satinalma_uzmani",
        "satinalma_yoneticisi",
        "satinalma_direktoru",
    ]:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")
    return _get_supplier_quote_price_rules(db)


@router.put("/price-rules", response_model=dict)
def update_supplier_quote_price_rules(
    payload: SupplierQuotePriceRulesUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    role = getattr(current_user, "role", None)
    if role not in [
        "super_admin",
        "admin",
        "satinalmaci",
        "satinalma_uzmani",
        "satinalma_yoneticisi",
        "satinalma_direktoru",
    ]:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")

    if (
        payload.max_markup_percent < 0
        or payload.max_discount_percent < 0
        or payload.tolerance_amount < 0
    ):
        raise HTTPException(
            status_code=400, detail="Kural değerleri 0'dan küçük olamaz"
        )

    _ensure_supplier_quote_price_rules_table(db)
    db.execute(
        text("""
        INSERT INTO supplier_quote_price_rules (
            max_markup_percent, max_discount_percent, tolerance_amount,
            block_on_violation, updated_by, updated_at
        ) VALUES (
            :max_markup_percent, :max_discount_percent, :tolerance_amount,
            :block_on_violation, :updated_by, :updated_at
        )
    """),
        {
            "max_markup_percent": payload.max_markup_percent,
            "max_discount_percent": payload.max_discount_percent,
            "tolerance_amount": payload.tolerance_amount,
            "block_on_violation": payload.block_on_violation,
            "updated_by": getattr(current_user, "id", None),
            "updated_at": datetime.now(UTC).isoformat(),
        },
    )
    db.commit()
    return {"status": "success", "rules": _get_supplier_quote_price_rules(db)}


@router.get("/me")
def get_my_quotes(
    db: Session = Depends(get_db),
    current_user: SupplierUser = Depends(get_current_supplier_user),
):
    """Tedarikçinin kendisine gönderilen teklifleri listele"""

    supplier_quotes = (
        db.query(SupplierQuote)
        .filter(SupplierQuote.supplier_id == current_user.supplier_id)
        .all()
    )

    result = []
    for sq in supplier_quotes:
        quote = db.query(Quote).filter(Quote.id == sq.quote_id).first()
        items = (
            db.query(SupplierQuoteItem)
            .filter(SupplierQuoteItem.supplier_quote_id == sq.id)
            .all()
        )

        result.append(
            {
                "id": sq.id,
                "supplier_id": sq.supplier_id,
                "quote_id": sq.quote_id,
                "quote_title": quote.title if quote else "Bilinmiyor",
                "quote_company": quote.company_name if quote else None,
                "quote_status": (
                    quote.status.value
                    if quote
                    and getattr(quote, "status", None) is not None
                    and hasattr(quote.status, "value")
                    else (str(getattr(quote, "status", "")) if quote else None)
                ),
                "selected_supplier_id": (
                    getattr(quote, "selected_supplier_id", None) if quote else None
                ),
                "status": sq.status,
                "total_amount": float(sq.total_amount or 0),
                "final_amount": float(sq.final_amount or 0),
                "initial_final_amount": float(
                    getattr(sq, "initial_final_amount", None) or 0
                ),
                "revision_number": int(sq.revision_number or 0),
                "payment_terms": sq.payment_terms,
                "delivery_time": sq.delivery_time,
                "warranty": sq.warranty,
                "created_at": sq.created_at,
                "submitted_at": sq.submitted_at,
                "items": [
                    {
                        "id": item.id,
                        "quote_item_id": item.quote_item_id,
                        "description": item.quote_item.description
                        if item.quote_item
                        else "",
                        "unit": item.quote_item.unit if item.quote_item else "",
                        "quantity": float(item.quote_item.quantity or 0)
                        if item.quote_item
                        else 0,
                        "vat_rate": float(item.quote_item.vat_rate or 20)
                        if item.quote_item
                        else 20,
                        "original_unit_price": float(item.quote_item.unit_price or 0)
                        if item.quote_item
                        else 0,
                        "supplier_unit_price": float(item.unit_price or 0),
                        "supplier_total_price": float(item.total_price or 0),
                        "notes": item.notes or "",
                        "is_group_header": bool(item.quote_item.is_group_header)
                        if item.quote_item
                        else False,
                        "line_number": item.quote_item.line_number
                        if item.quote_item
                        else "",
                        "item_detail": _parse_quote_item_meta(
                            item.quote_item.notes if item.quote_item else None
                        )["detail"],
                        "item_image_url": _parse_quote_item_meta(
                            item.quote_item.notes if item.quote_item else None
                        )["image_url"],
                    }
                    for item in items
                ],
            }
        )

    return result


@router.get("/{supplier_quote_id}")
def get_supplier_quote(
    supplier_quote_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_any_user),
):
    """Tedarikçi teklifini getir (taslak/yanıtlandı)"""

    supplier_quote = (
        db.query(SupplierQuote).filter(SupplierQuote.id == supplier_quote_id).first()
    )

    if not supplier_quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Supplier user ise sadece kendi teklifini görebilir
    if isinstance(current_user, SupplierUser):
        if supplier_quote.supplier_id != current_user.supplier_id:
            raise HTTPException(status_code=403, detail="Yetkisiz erişim")

    # Quote ve items al
    quote = db.query(Quote).filter(Quote.id == supplier_quote.quote_id).first()
    items = (
        db.query(SupplierQuoteItem)
        .filter(SupplierQuoteItem.supplier_quote_id == supplier_quote_id)
        .all()
    )

    return {
        "id": supplier_quote.id,
        "quote_id": supplier_quote.quote_id,
        "quote_title": quote.title if quote else None,
        "supplier_id": supplier_quote.supplier_id,
        "supplier_name": supplier_quote.supplier.company_name
        if supplier_quote.supplier
        else None,
        "status": supplier_quote.status,
        "total_amount": float(supplier_quote.total_amount or 0),
        "discount_percent": float(supplier_quote.discount_percent or 0),
        "discount_amount": float(supplier_quote.discount_amount or 0),
        "final_amount": float(supplier_quote.final_amount or 0),
        "payment_terms": supplier_quote.payment_terms,
        "delivery_time": supplier_quote.delivery_time,
        "warranty": supplier_quote.warranty,
        "submitted_at": supplier_quote.submitted_at,
        "created_at": supplier_quote.created_at,
        "items": [
            {
                "id": item.id,
                "quote_item_id": item.quote_item_id,
                "description": item.quote_item.description if item.quote_item else None,
                "unit": item.quote_item.unit if item.quote_item else None,
                "quantity": float(item.quote_item.quantity or 0)
                if item.quote_item
                else 0,
                "vat_rate": float(item.quote_item.vat_rate or 20)
                if item.quote_item
                else 20,
                "original_unit_price": float(item.quote_item.unit_price or 0)
                if item.quote_item
                else 0,
                "supplier_unit_price": float(item.unit_price or 0),
                "supplier_total_price": float(item.total_price or 0),
                "notes": item.notes,
                "is_group_header": bool(item.quote_item.is_group_header)
                if item.quote_item
                else False,
                "line_number": item.quote_item.line_number if item.quote_item else "",
                "item_detail": _parse_quote_item_meta(
                    item.quote_item.notes if item.quote_item else None
                )["detail"],
                "item_image_url": _parse_quote_item_meta(
                    item.quote_item.notes if item.quote_item else None
                )["image_url"],
            }
            for item in items
        ],
    }


@router.post("/{supplier_quote_id}/draft-save")
def save_draft(
    supplier_quote_id: int,
    data: SupplierQuoteSubmit,
    db: Session = Depends(get_db),
    current_user=Depends(get_any_user),
):
    """Tedarikçi draft'ı kaydet (henüz gönderme)"""

    supplier_quote = (
        db.query(SupplierQuote).filter(SupplierQuote.id == supplier_quote_id).first()
    )

    if not supplier_quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Supplier user ise sadece kendi teklifini düzenleyebilir
    if isinstance(current_user, SupplierUser):
        if supplier_quote.supplier_id != current_user.supplier_id:
            raise HTTPException(status_code=403, detail="Yetkisiz erişim")

    quote = db.query(Quote).filter(Quote.id == supplier_quote.quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    price_check = _validate_supplier_quote_price_rules(
        db, quote, float(data.final_amount or 0)
    )
    if (not price_check["ok"]) and price_check["rules"]["block_on_violation"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Fiyat kontrol kuralları ihlali",
                "violations": price_check["violations"],
                "allowed_range": price_check["allowed_range"],
            },
        )

    try:
        # Fiyat bilgilerini güncelle
        supplier_quote.total_amount = data.total_amount
        supplier_quote.discount_percent = data.discount_percent
        supplier_quote.discount_amount = data.discount_amount
        supplier_quote.final_amount = data.final_amount
        supplier_quote.payment_terms = data.payment_terms
        supplier_quote.delivery_time = data.delivery_time
        supplier_quote.warranty = data.warranty

        # Items güncelle
        for item_data in data.items:
            item = (
                db.query(SupplierQuoteItem)
                .filter(
                    SupplierQuoteItem.supplier_quote_id == supplier_quote_id,
                    SupplierQuoteItem.quote_item_id == item_data.quote_item_id,
                )
                .first()
            )

            if item:
                item.unit_price = item_data.unit_price
                item.total_price = item_data.total_price
                item.notes = item_data.notes

        supplier_quote.status = "tasarı"
        db.commit()

        return {
            "status": "success",
            "message": "Taslak kaydedildi",
            "price_check": price_check,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{supplier_quote_id}/submit")
def submit_response(
    supplier_quote_id: int,
    data: SupplierQuoteSubmit,
    db: Session = Depends(get_db),
    current_user=Depends(get_any_user),
    email_service=Depends(get_email_service),
):
    """Tedarikçi teklifini gönder (final yanıt)"""

    supplier_quote = (
        db.query(SupplierQuote).filter(SupplierQuote.id == supplier_quote_id).first()
    )

    if not supplier_quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Supplier user ise sadece kendi teklifini gönderebilir
    if isinstance(current_user, SupplierUser):
        if supplier_quote.supplier_id != current_user.supplier_id:
            raise HTTPException(status_code=403, detail="Yetkisiz erişim")

    quote = db.query(Quote).filter(Quote.id == supplier_quote.quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    price_check = _validate_supplier_quote_price_rules(
        db, quote, float(data.final_amount or 0)
    )
    if (not price_check["ok"]) and price_check["rules"]["block_on_violation"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Fiyat kontrol kuralları ihlali",
                "violations": price_check["violations"],
                "allowed_range": price_check["allowed_range"],
            },
        )

    try:
        is_revision_submit = str(supplier_quote.status or "").lower() == "revize_edildi"
        next_revision_number = int(supplier_quote.revision_number or 0) + (
            1 if is_revision_submit else 0
        )

        # Kolon migration (SQLite)
        _ensure_initial_final_amount_column(db)

        # İlk gönderimde initial_final_amount'u sakla (revize sonra değiştirmez)
        if not is_revision_submit:
            supplier_quote.initial_final_amount = data.final_amount

        # Fiyat bilgilerini güncelle
        supplier_quote.total_amount = data.total_amount
        supplier_quote.discount_percent = data.discount_percent
        supplier_quote.discount_amount = data.discount_amount
        supplier_quote.final_amount = data.final_amount
        supplier_quote.payment_terms = data.payment_terms
        supplier_quote.delivery_time = data.delivery_time
        supplier_quote.warranty = data.warranty

        # Items güncelle
        for item_data in data.items:
            item = (
                db.query(SupplierQuoteItem)
                .filter(
                    SupplierQuoteItem.supplier_quote_id == supplier_quote_id,
                    SupplierQuoteItem.quote_item_id == item_data.quote_item_id,
                )
                .first()
            )

            if item:
                if is_revision_submit:
                    previous_unit_price = float(item.unit_price or 0)
                    previous_total_price = float(item.total_price or 0)
                    new_unit_price = float(item_data.unit_price or 0)
                    new_total_price = float(item_data.total_price or 0)

                    if (
                        previous_unit_price != new_unit_price
                        or previous_total_price != new_total_price
                    ):
                        revision_log: list[dict] = []
                        if item.revision_prices:
                            try:
                                parsed = json.loads(item.revision_prices)
                                if isinstance(parsed, list):
                                    revision_log = parsed
                            except Exception:
                                revision_log = []

                        revision_log.append(
                            {
                                "revision_number": next_revision_number,
                                "previous_unit_price": previous_unit_price,
                                "previous_total_price": previous_total_price,
                                "new_unit_price": new_unit_price,
                                "new_total_price": new_total_price,
                                "updated_at": datetime.now(UTC).isoformat(),
                            }
                        )
                        item.revision_prices = json.dumps(
                            revision_log, ensure_ascii=False
                        )
                        item.revision_number = next_revision_number

                item.unit_price = item_data.unit_price
                item.total_price = item_data.total_price
                item.notes = item_data.notes

        if is_revision_submit:
            supplier_quote.revision_number = next_revision_number

        # Durumu güncelle
        supplier_quote.status = "yanıtlandı"
        supplier_quote.submitted_at = datetime.now(UTC)
        supplier_quote.supplier_user_id = (
            current_user.id if isinstance(current_user, SupplierUser) else None
        )

        db.commit()

        # Email gönder - öncelik atanan satın alma sorumlusunda, yoksa oluşturan kullanıcıda
        supplier = (
            db.query(Supplier).filter(Supplier.id == supplier_quote.supplier_id).first()
        )

        notify_user = None
        if getattr(quote, "assigned_to_id", None):
            notify_user = (
                db.query(User)
                .filter(User.id == quote.assigned_to_id, User.is_active == True)
                .first()
            )
        if not notify_user:
            notify_user = (
                db.query(User)
                .filter(User.id == quote.created_by_id, User.is_active == True)
                .first()
            )

        if notify_user and notify_user.email:
            try:
                email_service.send_supplier_response_to_admin(
                    to_email=notify_user.email,
                    admin_name=getattr(notify_user, "full_name", None)
                    or getattr(notify_user, "username", "")
                    or "Yetkili",
                    supplier_company=supplier.company_name if supplier else "Tedarikçi",
                    quote_title=quote.title,
                    final_amount=float(data.final_amount),
                    revision_number=next_revision_number,
                    discount_percent=float(data.discount_percent or 0),
                    discount_amount=float(data.discount_amount or 0),
                    delivery_time=data.delivery_time,
                    payment_terms=data.payment_terms,
                    warranty=data.warranty,
                )
            except Exception:
                pass  # Email hatası işlemi durdurmaz

        return {
            "status": "success",
            "message": "Teklif başarıyla gönderildi",
            "submitted_at": supplier_quote.submitted_at,
            "price_check": price_check,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/quote/{quote_id}/responses")
def get_all_supplier_responses(
    quote_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    """Teklif için tüm tedarikçi yanıtlarını getir"""

    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Sadece quote creator'u görebilir
    if quote.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Yetkisiz erişim")

    responses = db.query(SupplierQuote).filter(SupplierQuote.quote_id == quote_id).all()

    result = []
    for response in responses:
        supplier = response.supplier or {}
        result.append(
            {
                "id": response.id,
                "supplier_id": response.supplier_id,
                "supplier_name": supplier.company_name if supplier else "Bilinmiyor",
                "supplier_phone": supplier.phone if supplier else None,
                "supplier_email": supplier.email if supplier else None,
                "status": response.status,
                "total_amount": float(response.total_amount or 0),
                "discount_percent": float(response.discount_percent or 0),
                "discount_amount": float(response.discount_amount or 0),
                "final_amount": float(response.final_amount or 0),
                "payment_terms": response.payment_terms,
                "delivery_time": response.delivery_time,
                "warranty": response.warranty,
                "submitted_at": response.submitted_at,
                "created_at": response.created_at,
                "items_count": len(response.items) if response.items else 0,
            }
        )

    return result
