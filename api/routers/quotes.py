# api/routers/quotes.py
from datetime import datetime, UTC
from typing import Literal

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from api.db.session import get_db
from api.core.deps import get_current_user
from api.models import Quote, User, QuoteStatusLog
from api.models.quote import QuoteStatus, QuoteItem
from api.models.supplier import SupplierQuote, Supplier, SupplierUser
from api.schemas import QuoteCreate, QuoteUpdate, QuoteOut, QuoteListOut, MessageOut
from api.schemas.quote import QuoteItemCreate
from api.services.user_department_service import resolve_effective_department_id
from api.services.quote_service import QuoteService
from api.services.email_service import get_email_service
from api.app.domain.quote.policy import (
    ConcurrencyError,
    QuoteStatusChanged,
    check_version_collision,
)

router = APIRouter(prefix="/quotes", tags=["quotes"])
# Event store (in-memory for now, should be replaced with proper event bus/db)
_domain_events: list[QuoteStatusChanged] = []
_ADMIN_ROLES = {"admin", "super_admin"}


def _is_admin_like(current_user: User) -> bool:
    return current_user.role in _ADMIN_ROLES


def _get_quote_or_404(quote_id: int, db: Session) -> Quote:
    row = db.query(Quote).filter(Quote.id == quote_id).first()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    return row


def _ensure_owner_or_admin(current_user: User, row: Quote) -> None:
    if _is_admin_like(current_user):
        return
    if row.created_by_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )


def _ensure_admin(current_user: User) -> None:
    if not _is_admin_like(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )


def _ensure_transition(current: str, allowed_from: set[str]) -> None:
    if current not in allowed_from:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Invalid status transition from '{current}'",
        )


def _log_status_change(
    db: Session,
    quote_id: int,
    actor_id: int,
    from_status: str,
    to_status: str,
) -> None:
    db.add(
        QuoteStatusLog(
            quote_id=quote_id,
            changed_by=actor_id,
            from_status=from_status,
            to_status=to_status,
        )
    )


@router.get("", response_model=QuoteListOut)
@router.get("/", response_model=QuoteListOut)
def list_quotes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    q: str | None = Query(None, description="Title contains"),
    min_amount: float | None = Query(None, ge=0),
    max_amount: float | None = Query(None, ge=0),
    status_filter: Literal[
        "draft", "sent", "pending", "responded", "approved", "rejected"
    ]
    | None = Query(None),
    sort_by: Literal["created_at", "total_amount", "id"] = Query("created_at"),
    sort_order: Literal["asc", "desc"] = Query("desc"),
    include_deleted: bool = Query(False),
):
    query = db.query(Quote)

    if not _is_admin_like(current_user):
        query = query.filter(Quote.created_by_id == current_user.id)

    if not _is_admin_like(current_user) or not include_deleted:
        query = query.filter(Quote.deleted_at.is_(None))

    if q:
        query = query.filter(Quote.title.ilike(f"%{q}%"))

    if min_amount is not None:
        query = query.filter(Quote.total_amount >= min_amount)

    if max_amount is not None:
        query = query.filter(Quote.total_amount <= max_amount)

    if min_amount is not None and max_amount is not None and min_amount > max_amount:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="min_amount cannot be greater than max_amount",
        )

    if status_filter is not None:
        query = query.filter(Quote.status == status_filter)

    # Map sort_by to model columns
    sort_column_map = {
        "created_at": Quote.created_at,
        "total_amount": Quote.total_amount,
        "id": Quote.id,
    }
    sort_col = sort_column_map.get(sort_by, Quote.created_at)
    query = query.order_by(desc(sort_col) if sort_order == "desc" else asc(sort_col))

    total = query.count()
    offset = (page - 1) * size
    rows = query.offset(offset).limit(size).all()

    return {
        "count": total,
        "page": page,
        "size": size,
        "items": rows,
    }


@router.post("/", response_model=QuoteOut, status_code=status.HTTP_201_CREATED)
def create_quote(
    payload: QuoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    effective_department_id = payload.department_id
    effective_assigned_to_id = payload.assigned_to_id

    if not _is_admin_like(current_user):
        effective_department_id = resolve_effective_department_id(db, current_user)
        if effective_department_id is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Kullaniciya departman atanmamis. Lutfen yoneticiye basvurun.",
            )
        effective_assigned_to_id = current_user.id

    row = Quote(
        project_id=payload.project_id,
        created_by_id=current_user.id,
        title=payload.title,
        description=payload.description,
        company_name=payload.company_name,
        company_contact_name=payload.company_contact_name,
        company_contact_phone=payload.company_contact_phone,
        company_contact_email=payload.company_contact_email,
        status=QuoteStatus.DRAFT,
        created_by=current_user.id,
        department_id=effective_department_id,
        assigned_to_id=effective_assigned_to_id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/{quote_id}", response_model=QuoteOut)
def get_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None and not _is_admin_like(current_user):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )

    return row


@router.put("/{quote_id}", response_model=QuoteOut)
def update_quote(
    quote_id: int,
    payload: QuoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None and not _is_admin_like(current_user):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )

    if payload.title is not None:
        row.title = payload.title
    if payload.amount is not None:
        row.total_amount = payload.amount
    if payload.description is not None:
        row.description = payload.description
    if payload.company_name is not None:
        row.company_name = payload.company_name
    if payload.company_contact_name is not None:
        row.company_contact_name = payload.company_contact_name
    if payload.company_contact_phone is not None:
        row.company_contact_phone = payload.company_contact_phone
    if payload.company_contact_email is not None:
        row.company_contact_email = payload.company_contact_email

    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id

    db.commit()
    db.refresh(row)
    return row


@router.put("/{quote_id}/items", response_model=QuoteOut)
def replace_quote_items(
    quote_id: int,
    items: list[QuoteItemCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklifin tüm kalemlerini yeni liste ile değiştir (taslak durumda)"""
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Quote not found")

    current_status = (
        row.status.value
        if isinstance(row.status, QuoteStatus)
        else str(row.status).lower()
    )
    if current_status != "draft":
        raise HTTPException(
            status_code=400, detail="Sadece taslak tekliflerin kalemleri düzenlenebilir"
        )

    # Mevcut kalemleri sil
    db.query(QuoteItem).filter(QuoteItem.quote_id == quote_id).delete()

    total = 0.0
    for idx, item_data in enumerate(items):
        qty = float(item_data.quantity)
        price = float(item_data.unit_price) if item_data.unit_price else 0.0
        vat_rate = float(item_data.vat_rate if item_data.vat_rate is not None else 20.0)
        if item_data.is_group_header:
            total_price = price if price > 0 else 0.0
        else:
            total_price = qty * price
        total += total_price
        db.add(
            QuoteItem(
                quote_id=quote_id,
                line_number=item_data.line_number,
                category_code=item_data.category_code or "",
                category_name=item_data.category_name or "",
                description=item_data.description,
                unit=item_data.unit,
                quantity=qty,
                unit_price=price if price > 0 else None,
                vat_rate=vat_rate,
                group_key=item_data.group_key,
                is_group_header=item_data.is_group_header,
                total_price=total_price if price > 0 else None,
                notes=item_data.notes,
                sequence=idx,
            )
        )

    row.total_amount = total
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{quote_id}", response_model=MessageOut)
def delete_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is None:
        row.deleted_at = datetime.now(UTC)
        row.deleted_by = current_user.id
        row.is_active = False
        db.commit()

    return {"message": "Quote soft-deleted"}


@router.post("/{quote_id}/restore", response_model=QuoteOut)
def restore_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Quote is not deleted",
        )

    row.deleted_at = None
    row.deleted_by = None
    row.is_active = True
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id

    db.commit()
    db.refresh(row)
    return row


@router.post("/{quote_id}/submit", response_model=QuoteOut)
def submit_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None:
        raise HTTPException(
            status_code=409, detail="Cannot change status of a deleted quote"
        )

    _ensure_transition(row.status, {"draft"})

    # Concurrency check: optimistic locking
    try:
        check_version_collision(row.version, row.version)  # version should match
    except ConcurrencyError as e:
        raise HTTPException(status_code=409, detail=str(e))

    previous_status = row.status
    row.status = "submitted"
    row.version += 1  # Increment version
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    row.transition_reason = "User submitted quote"

    _log_status_change(db, row.id, current_user.id, previous_status, row.status)

    # Emit domain event
    event = QuoteStatusChanged(
        event_type="quote.status.changed",
        quote_id=row.id,
        old_status=QuoteStatus(previous_status),
        new_status=QuoteStatus(row.status),
        reason=row.transition_reason,
        actor_id=current_user.id,
    )
    _domain_events.append(event)

    db.commit()
    db.refresh(row)
    return row


@router.post("/{quote_id}/approve", response_model=QuoteOut)
def approve_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_admin(current_user)
    row = _get_quote_or_404(quote_id, db)

    if row.deleted_at is not None:
        raise HTTPException(
            status_code=409, detail="Cannot change status of a deleted quote"
        )

    _ensure_transition(row.status, {"sent", "submitted"})

    # Concurrency check
    try:
        check_version_collision(row.version, row.version)
    except ConcurrencyError as e:
        raise HTTPException(status_code=409, detail=str(e))

    previous_status = row.status
    row.status = "approved"
    row.version += 1
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    row.transition_reason = "Quote approved by admin"

    _log_status_change(db, row.id, current_user.id, previous_status, row.status)

    # Emit domain event
    event = QuoteStatusChanged(
        event_type="quote.status.changed",
        quote_id=row.id,
        old_status=QuoteStatus(previous_status),
        new_status=QuoteStatus(row.status),
        reason=row.transition_reason,
        actor_id=current_user.id,
    )
    _domain_events.append(event)

    db.commit()
    db.refresh(row)
    return row


@router.post("/{quote_id}/reject", response_model=QuoteOut)
def reject_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_admin(current_user)
    row = _get_quote_or_404(quote_id, db)

    if row.deleted_at is not None:
        raise HTTPException(
            status_code=409, detail="Cannot change status of a deleted quote"
        )

    _ensure_transition(row.status, {"sent", "submitted"})

    # Concurrency check
    try:
        check_version_collision(row.version, row.version)
    except ConcurrencyError as e:
        raise HTTPException(status_code=409, detail=str(e))

    previous_status = row.status
    row.status = "rejected"
    row.version += 1
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    row.transition_reason = "Quote rejected by admin"

    supplier_rows = (
        db.query(SupplierQuote).filter(SupplierQuote.quote_id == row.id).all()
    )
    for supplier_row in supplier_rows:
        supplier_row.status = "reddedildi"

    _log_status_change(db, row.id, current_user.id, previous_status, row.status)

    # Emit domain event
    event = QuoteStatusChanged(
        event_type="quote.status.changed",
        quote_id=row.id,
        old_status=QuoteStatus(previous_status),
        new_status=QuoteStatus(row.status),
        reason=row.transition_reason,
        actor_id=current_user.id,
    )
    _domain_events.append(event)

    db.commit()
    db.refresh(row)
    return row


@router.get("/{quote_id}/status-history")
def get_status_history(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    logs = (
        db.query(QuoteStatusLog)
        .filter(QuoteStatusLog.quote_id == quote_id)
        .order_by(QuoteStatusLog.id.asc())
        .all()
    )
    return [
        {
            "id": log.id,
            "from_status": log.from_status,
            "to_status": log.to_status,
            "changed_by_id": log.changed_by_id,
            "created_at": log.created_at,
        }
        for log in logs
    ]


@router.get("/{quote_id}/full-audit-trail")
def get_full_audit_trail(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklifin tam audit trail'ini döner (status log + approval events)."""
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    logs = (
        db.query(QuoteStatusLog)
        .filter(QuoteStatusLog.quote_id == quote_id)
        .order_by(QuoteStatusLog.id.asc())
        .all()
    )

    timeline = [
        {
            "event_type": "status_change",
            "from_status": log.from_status,
            "to_status": log.to_status,
            "changed_by_id": log.changed_by_id,
            "created_at": log.created_at,
        }
        for log in logs
    ]

    return {
        "quote_id": quote_id,
        "quote_title": row.title,
        "total_events": len(timeline),
        "timeline": timeline,
    }


# ============================================================================
# Revize Sistemi ve Tedarikçi Teklif Yönetimi
# ============================================================================


@router.get("/{quote_id}/suppliers")
def get_suppliers_with_quotes(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Bir teklif için tedarikçi bazında gruplandırılmış teklifler getir

    Response:
    [
        {
            "supplier_id": 1,
            "supplier_name": "Acme Ltd",
            "quotes": [
                {
                    "id": 123,
                    "revision_number": 0,
                    "status": "gönderildi",
                    "total_amount": 10000,
                    "profitability_amount": None,
                    "profitability_percent": None,
                    "revisions": [...]
                }
            ]
        }
    ]
    """
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    result = QuoteService.get_supplier_quotes_grouped_by_supplier(db, quote_id)
    return result


@router.post("/{quote_id}/request-revision/{supplier_quote_id}")
def request_quote_revision(
    quote_id: int,
    supplier_quote_id: int,
    reason: str = Query(..., description="Revize isteme nedeni"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    email_service=Depends(get_email_service),
):
    """
    Tedarikçiden revize teklif iste

    Args:
        quote_id: Teklif ID'si
        supplier_quote_id: Tedarikçi teklifinin ID'si
        reason: Revize isteme nedeni
    """
    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    result = QuoteService.request_quote_revision(
        db, supplier_quote_id, reason, current_user.id
    )

    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])

    # Tedarikçiye revize talebi email gönder
    try:
        sq = (
            db.query(SupplierQuote)
            .filter(SupplierQuote.id == supplier_quote_id)
            .first()
        )
        if sq:
            supplier = db.query(Supplier).filter(Supplier.id == sq.supplier_id).first()
            revision_number = int(sq.revision_number or 0) + 1
            workspace_url = email_service.app_url + "/supplier/workspace"
            if supplier:
                supplier_users = (
                    db.query(SupplierUser)
                    .filter(
                        SupplierUser.supplier_id == sq.supplier_id,
                        SupplierUser.is_active == True,
                    )
                    .all()
                )
                for su in supplier_users:
                    email_service.send_revision_request_to_supplier(
                        to_email=su.email,
                        supplier_name=supplier.company_name,
                        quote_title=row.title,
                        reason=reason,
                        revision_number=revision_number,
                        workspace_url=workspace_url,
                    )
    except Exception:
        pass  # Email hatası işlemi durdurmaz

    return result


@router.post("/{quote_id}/submit-revision")
def submit_revised_quote(
    quote_id: int,
    payload: dict,  # {"supplier_quote_id": ..., "revised_prices": [...]}
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Tedarikçi tarafından revize teklifin gönderilmesi

    Payload:
    {
        "supplier_quote_id": 123,
        "revised_prices": [
            {"quote_item_id": 1, "unit_price": 150, "total_price": 1500},
            {"quote_item_id": 2, "unit_price": 200, "total_price": 2000}
        ]
    }
    """
    row = db.query(Quote).filter(Quote.id == quote_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Quote not found")

    result = QuoteService.submit_revised_quote(
        db,
        payload.get("supplier_quote_id"),
        payload.get("revised_prices", []),
        current_user.id,
    )

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])

    return result


@router.get("/internal/events")
def get_domain_events():
    """
    Internal endpoint to retrieve emitted domain events.
    Used for testing and debugging domain-driven design.
    """
    return {
        "events": _domain_events,
        "count": len(_domain_events),
    }


@router.post("/internal/events/clear")
def clear_domain_events():
    """
    Clear all domain events from in-memory store.
    Used in tests to reset state before each test.
    """
    global _domain_events
    _domain_events.clear()
    return {"message": "Domain events cleared"}
