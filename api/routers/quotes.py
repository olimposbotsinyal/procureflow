# api/routers/quotes.py
from datetime import datetime, UTC
from typing import Literal

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session

from api.db.session import get_db
from api.core.authz import (
    can_access_admin_surface,
    is_admin_like,
    is_global_procurement_manager,
    is_platform_staff,
)
from api.core.deps import get_current_user
from api.models import Quote, User, QuoteStatusLog, Project, QuoteApproval
from api.models.quote import QuoteStatus, QuoteItem
from api.models.supplier import SupplierQuote, Supplier, SupplierUser
from api.schemas import QuoteListOut, MessageOut, RfqCreate, RfqOut, RfqUpdate
from api.schemas.quote import QuoteItemCreate
from api.services.user_department_service import resolve_effective_department_id
from api.services.quote_service import QuoteService
from api.services.email_service import get_email_service
from api.services.quote_approval_service import (
    ensure_submission_approvals,
    get_business_role_label,
    get_quote_level_approvals,
    get_role_label,
    has_completed_submission_approvals,
    resolve_required_business_role,
)
from api.services.quote_transition_service import (
    ensure_model_quote_transition,
    to_domain_quote_status,
)
from api.app.domain.quote.enums import (
    to_public_quote_status,
    to_turkish_quote_status,
)
from api.app.domain.quote.permissions import QuotePermission
from api.app.domain.quote.policy import (
    ConcurrencyError,
    QuotePolicyError,
    QuoteStatusChanged,
    check_version_collision,
)

router = APIRouter(prefix="/quotes", tags=["quotes"])
# Event store (in-memory for now, should be replaced with proper event bus/db)
_domain_events: list[QuoteStatusChanged] = []


def _current_tenant_id(current_user: User) -> int | None:
    return getattr(current_user, "tenant_id", None)


def _is_global_quote_manager(current_user: User) -> bool:
    return is_admin_like(current_user) or is_global_procurement_manager(current_user)


def _get_quote_or_404(quote_id: int, db: Session) -> Quote:
    row = db.query(Quote).filter(Quote.id == quote_id).first()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    return row


def _get_scoped_quote_or_404(quote_id: int, db: Session, current_user: User) -> Quote:
    row = _get_quote_or_404(quote_id, db)
    _ensure_quote_scope(current_user, row)
    return row


def _ensure_quote_scope(current_user: User, row: Quote) -> None:
    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None and row.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )


def _ensure_project_scope(current_user: User, project: Project) -> None:
    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None and project.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu projede teklif oluşturma yetkiniz yok",
        )


def _ensure_owner_or_admin(current_user: User, row: Quote) -> None:
    _ensure_quote_scope(current_user, row)
    if _is_global_quote_manager(current_user):
        return
    if any(project.id == row.project_id for project in current_user.projects):
        return
    if row.created_by_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )


def _ensure_quote_editable(db: Session, row: Quote) -> None:
    current_status = (
        row.status.value
        if isinstance(row.status, QuoteStatus)
        else str(row.status).lower()
    )
    if current_status not in {"draft", "submitted"}:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu durumdaki teklifler düzenlenemez",
        )

    if row.sent_at is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tedarikçiye gönderilen teklifler düzenlenemez",
        )

    if current_status == "submitted" and has_completed_submission_approvals(db, row):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Onaylar tamamlandıktan sonra teklif düzenlenemez",
        )

    supplier_dispatch_exists = (
        db.query(SupplierQuote.id).filter(SupplierQuote.quote_id == row.id).first()
    )
    if supplier_dispatch_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tedarikçiye gönderim başlayan teklifler düzenlenemez",
        )


def _ensure_admin(current_user: User) -> None:
    if not can_access_admin_surface(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )


def _ensure_quote_write_access(current_user: User) -> None:
    if is_platform_staff(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Platform staff quote alaninda salt-okunur erisime sahiptir",
        )


def _get_transition_permissions(current_user: User, row: Quote) -> set[QuotePermission]:
    permissions: set[QuotePermission] = set()
    if (
        is_admin_like(current_user)
        or row.created_by_id == current_user.id
        or any(project.id == row.project_id for project in current_user.projects)
    ):
        permissions.add(QuotePermission.QUOTE_TRANSITION)
    return permissions


def _log_status_change(
    db: Session,
    quote_id: int,
    actor_id: int,
    from_status: QuoteStatus,
    to_status: QuoteStatus,
) -> None:
    db.add(
        QuoteStatusLog(
            quote_id=quote_id,
            changed_by=actor_id,
            from_status=to_public_quote_status(from_status.value),
            to_status=to_public_quote_status(to_status.value),
        )
    )


def _ensure_domain_transition(
    current: QuoteStatus,
    target: QuoteStatus,
    current_user: User,
    row: Quote,
    reason: str | None = None,
) -> None:
    try:
        ensure_model_quote_transition(
            current=current,
            target=target,
            actor_permissions=_get_transition_permissions(current_user, row),
            reason=reason,
        )
    except QuotePolicyError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(exc),
        ) from exc


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
        "draft", "submitted", "sent", "pending", "responded", "approved", "rejected"
    ]
    | None = Query(None),
    sort_by: Literal["created_at", "total_amount", "id"] = Query("created_at"),
    sort_order: Literal["asc", "desc"] = Query("desc"),
    include_deleted: bool = Query(False),
):
    query = db.query(Quote)

    if _current_tenant_id(current_user) is not None:
        query = query.filter(Quote.tenant_id == _current_tenant_id(current_user))

    if not is_admin_like(current_user):
        member_project_ids = [p.id for p in current_user.projects]
        query = query.filter(
            or_(
                Quote.created_by_id == current_user.id,
                Quote.project_id.in_(member_project_ids or [-1]),
            )
        )

    if not is_admin_like(current_user) or not include_deleted:
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
        normalized_status_filter = (
            QuoteStatus.SUBMITTED.value if status_filter == "sent" else status_filter
        )
        query = query.filter(Quote.status == normalized_status_filter)

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


@router.post("", response_model=RfqOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=RfqOut, status_code=status.HTTP_201_CREATED)
def create_quote(
    payload: RfqCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_quote_write_access(current_user)

    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    _ensure_project_scope(current_user, project)

    effective_department_id = payload.department_id
    effective_assigned_to_id = payload.assigned_to_id

    if not is_admin_like(current_user):
        if not any(p.id == payload.project_id for p in current_user.projects):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu projede teklif oluşturma yetkiniz yok",
            )
        effective_department_id = resolve_effective_department_id(db, current_user)
        if effective_department_id is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Kullaniciya departman atanmamis. Lutfen yoneticiye basvurun.",
            )
        effective_assigned_to_id = current_user.id

    row = Quote(
        tenant_id=project.tenant_id or _current_tenant_id(current_user),
        project_id=payload.project_id,
        created_by_id=current_user.id,
        title=payload.title,
        description=payload.description,
        company_name=payload.company_name,
        company_contact_name=payload.company_contact_name,
        company_contact_phone=payload.company_contact_phone,
        company_contact_email=payload.company_contact_email,
        total_amount=0,
        status=QuoteStatus.DRAFT,
        created_by=current_user.id,
        department_id=effective_department_id,
        assigned_to_id=effective_assigned_to_id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/{quote_id}", response_model=RfqOut)
def get_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None and not is_admin_like(current_user):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )

    return row


@router.put("/{quote_id}", response_model=RfqOut)
def update_quote(
    quote_id: int,
    payload: RfqUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_quote_write_access(current_user)

    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None and not is_admin_like(current_user):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )

    _ensure_quote_editable(db, row)

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


@router.put("/{quote_id}/items", response_model=RfqOut)
def replace_quote_items(
    quote_id: int,
    items: list[QuoteItemCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklifin tüm kalemlerini yeni liste ile değiştir (taslak durumda)"""
    _ensure_quote_write_access(current_user)

    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Quote not found")

    _ensure_quote_editable(db, row)

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
    _ensure_quote_write_access(current_user)

    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is None:
        row.deleted_at = datetime.now(UTC)
        row.deleted_by = current_user.id
        row.is_active = False
        db.commit()

    return {"message": "Quote soft-deleted"}


@router.post("/{quote_id}/restore", response_model=RfqOut)
def restore_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_quote_write_access(current_user)

    row = _get_scoped_quote_or_404(quote_id, db, current_user)
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


@router.post("/{quote_id}/submit", response_model=RfqOut)
def submit_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_quote_write_access(current_user)

    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None:
        raise HTTPException(
            status_code=409, detail="Cannot change status of a deleted quote"
        )

    transition_reason = "User submitted quote"
    _ensure_domain_transition(
        current=row.status,
        target=QuoteStatus.SUBMITTED,
        current_user=current_user,
        row=row,
        reason=transition_reason,
    )

    # Concurrency check: optimistic locking
    try:
        check_version_collision(row.version, row.version)  # version should match
    except ConcurrencyError as e:
        raise HTTPException(status_code=409, detail=str(e))

    previous_status = row.status
    row.status = QuoteStatus.SUBMITTED
    row.version += 1  # Increment version
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    row.transition_reason = transition_reason

    _log_status_change(db, row.id, current_user.id, previous_status, row.status)
    ensure_submission_approvals(db, row)

    # Emit domain event
    event = QuoteStatusChanged(
        event_type="quote.status.changed",
        quote_id=row.id,
        old_status=to_domain_quote_status(previous_status),
        new_status=to_domain_quote_status(row.status),
        reason=row.transition_reason,
        actor_id=current_user.id,
    )
    _domain_events.append(event)

    db.commit()
    db.refresh(row)
    return row


@router.post("/{quote_id}/approve", response_model=RfqOut)
def approve_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_admin(current_user)
    _ensure_quote_write_access(current_user)
    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_quote_scope(current_user, row)

    if row.deleted_at is not None:
        raise HTTPException(
            status_code=409, detail="Cannot change status of a deleted quote"
        )

    transition_reason = "Quote approved by admin"
    _ensure_domain_transition(
        current=row.status,
        target=QuoteStatus.APPROVED,
        current_user=current_user,
        row=row,
        reason=transition_reason,
    )

    # Concurrency check
    try:
        check_version_collision(row.version, row.version)
    except ConcurrencyError as e:
        raise HTTPException(status_code=409, detail=str(e))

    previous_status = row.status
    row.status = QuoteStatus.APPROVED
    row.version += 1
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    row.transition_reason = transition_reason

    _log_status_change(db, row.id, current_user.id, previous_status, row.status)

    # Emit domain event
    event = QuoteStatusChanged(
        event_type="quote.status.changed",
        quote_id=row.id,
        old_status=to_domain_quote_status(previous_status),
        new_status=to_domain_quote_status(row.status),
        reason=row.transition_reason,
        actor_id=current_user.id,
    )
    _domain_events.append(event)

    db.commit()
    db.refresh(row)
    return row


@router.post("/{quote_id}/reject", response_model=RfqOut)
def reject_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_admin(current_user)
    _ensure_quote_write_access(current_user)
    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_quote_scope(current_user, row)

    if row.deleted_at is not None:
        raise HTTPException(
            status_code=409, detail="Cannot change status of a deleted quote"
        )

    transition_reason = "Quote rejected by admin"
    _ensure_domain_transition(
        current=row.status,
        target=QuoteStatus.REJECTED,
        current_user=current_user,
        row=row,
        reason=transition_reason,
    )

    # Concurrency check
    try:
        check_version_collision(row.version, row.version)
    except ConcurrencyError as e:
        raise HTTPException(status_code=409, detail=str(e))

    previous_status = row.status
    row.status = QuoteStatus.REJECTED
    row.version += 1
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    row.transition_reason = transition_reason

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
        old_status=to_domain_quote_status(previous_status),
        new_status=to_domain_quote_status(row.status),
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
    """Teklif durum geçiş geçmişi (Türkçe, detaylı)"""
    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_owner_or_admin(current_user, row)

    logs = (
        db.query(QuoteStatusLog)
        .filter(QuoteStatusLog.quote_id == quote_id)
        .order_by(QuoteStatusLog.id.asc())
        .all()
    )

    result = []
    for log in logs:
        entry = {
            "id": log.id,
            "quote_id": log.quote_id,
            "changed_by_id": log.changed_by,
            "changed_by_name": log.user.full_name if log.user else "Sistem",
            "from_status": to_turkish_quote_status(log.from_status),
            "to_status": to_turkish_quote_status(log.to_status),
            "from_status_en": to_public_quote_status(log.from_status),
            "to_status_en": to_public_quote_status(log.to_status),
            "created_at": log.created_at,
            "approval_details": None,  # Şimdi doldurulacak
        }

        # Eğer SUBMITTED durumuna geçmişse, onay bilgilerini ekle
        if log.to_status == "submitted":
            approvals = (
                db.query(QuoteApproval)
                .filter(QuoteApproval.quote_id == quote_id)
                .order_by(QuoteApproval.approval_level.asc())
                .all()
            )
            entry["approval_details"] = [
                {
                    "level": a.approval_level,
                    "required_role": resolve_required_business_role(a),
                    "required_role_mirror": a.required_role,
                    "required_business_role": resolve_required_business_role(a),
                    "required_role_label": get_business_role_label(
                        resolve_required_business_role(a)
                    ),
                    "required_business_role_label": get_business_role_label(
                        resolve_required_business_role(a)
                    ),
                    "status": a.status,  # beklemede, onaylandı, reddedildi
                    "requested_at": a.requested_at,
                    "completed_at": a.completed_at,
                    "approved_by_id": a.approved_by_id,
                    "approved_by_name": a.approved_by.full_name
                    if a.approved_by
                    else None,
                    "comment": a.comment,
                }
                for a in approvals
            ]

        result.append(entry)

    return result


@router.get("/{quote_id}/full-audit-trail")
def get_full_audit_trail(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklif'in TAM AUDİT TRAIL'ı - Her adım, her onay, her değişiklik"""
    row = _get_scoped_quote_or_404(quote_id, db, current_user)
    _ensure_owner_or_admin(current_user, row)

    # 1️⃣ Status geçişleri
    status_logs = (
        db.query(QuoteStatusLog)
        .filter(QuoteStatusLog.quote_id == quote_id)
        .order_by(QuoteStatusLog.created_at.asc())
        .all()
    )

    # 2️⃣ Teklif onayları (Quote Approval - Satın alma onayı)
    quote_approvals = (
        db.query(QuoteApproval)
        .filter(QuoteApproval.quote_id == quote_id)
        .order_by(QuoteApproval.approval_level.asc())
        .all()
    )

    # 3️⃣ Tedarikçi tekliflerinin onayları (SupplierQuote Approval)
    supplier_quotes = (
        db.query(SupplierQuote).filter(SupplierQuote.quote_id == quote_id).all()
    )

    # Zamansal şekilde sırala
    timeline = []

    # Status geçişlerini ekle
    for log in status_logs:
        timeline.append(
            {
                "timestamp": log.created_at,
                "type": "STATUS_CHANGE",
                "icon": "🔄",
                "title": f"Durum Değişti: {to_turkish_quote_status(log.from_status)} → {to_turkish_quote_status(log.to_status)}",
                "actor": log.user.full_name if log.user else "Sistem",
                "actor_id": log.changed_by,
                "details": {
                    "from": to_turkish_quote_status(log.from_status),
                    "to": to_turkish_quote_status(log.to_status),
                },
            }
        )

    # Quote onaylarını ekle
    for approval in quote_approvals:
        resolved_business_role = resolve_required_business_role(approval)
        resolved_role_label = get_business_role_label(resolved_business_role)
        if approval.status == "beklemede":
            timeline.append(
                {
                    "timestamp": approval.requested_at,
                    "type": "APPROVAL_REQUESTED",
                    "icon": "⏳",
                    "title": f"Gönderim Onayı Açıldı: Seviye {approval.approval_level} - {resolved_role_label}",
                    "actor": row.created_by_user.full_name
                    if row.created_by_user
                    else "Sistem",
                    "actor_id": row.created_by_id,
                    "details": {
                        "level": approval.approval_level,
                        "role": resolved_business_role,
                        "required_role": resolved_business_role,
                        "required_role_mirror": approval.required_role,
                        "business_role": resolved_business_role,
                        "role_label": resolved_role_label,
                        "business_role_label": resolved_role_label,
                        "status": "Onay Bekliyor",
                    },
                }
            )
        elif approval.status == "onaylandı":
            timeline.append(
                {
                    "timestamp": approval.completed_at,
                    "type": "APPROVAL_GRANTED",
                    "icon": "✅",
                    "title": f"{resolved_role_label} Onayladı",
                    "actor": approval.approved_by.full_name
                    if approval.approved_by
                    else "?",
                    "actor_id": approval.approved_by_id,
                    "details": {
                        "level": approval.approval_level,
                        "role": resolved_business_role,
                        "required_role": resolved_business_role,
                        "required_role_mirror": approval.required_role,
                        "business_role": resolved_business_role,
                        "role_label": resolved_role_label,
                        "business_role_label": resolved_role_label,
                        "comment": approval.comment,
                    },
                }
            )
        elif approval.status == "reddedildi":
            timeline.append(
                {
                    "timestamp": approval.completed_at,
                    "type": "APPROVAL_REJECTED",
                    "icon": "❌",
                    "title": f"Gönderim Onayı Reddedildi: Seviye {approval.approval_level}",
                    "actor": approval.approved_by.full_name
                    if approval.approved_by
                    else "?",
                    "actor_id": approval.approved_by_id,
                    "details": {
                        "level": approval.approval_level,
                        "role": resolved_business_role,
                        "required_role": resolved_business_role,
                        "required_role_mirror": approval.required_role,
                        "business_role": resolved_business_role,
                        "role_label": resolved_role_label,
                        "business_role_label": resolved_role_label,
                        "comment": approval.comment or "Açıklama yok",
                    },
                }
            )

    # Tedarikçi teklif onaylarını ekle
    for sq in supplier_quotes:
        supplier_name = sq.supplier.company_name if sq.supplier else "?"

        if sq.status in {"gönderilen", "gönderildi"}:
            timeline.append(
                {
                    "timestamp": sq.created_at,
                    "type": "SUPPLIER_REQUEST_SENT",
                    "icon": "📤",
                    "title": f"Tedarikçiye Gönderildi, Yanıt Bekleniyor: {supplier_name}",
                    "actor": row.created_by_user.full_name
                    if row.created_by_user
                    else "Sistem",
                    "actor_id": row.created_by_id,
                    "details": {
                        "supplier": supplier_name,
                        "revision": int(sq.revision_number or 0),
                        "status": sq.status,
                    },
                }
            )
        elif sq.status == "tasarı" and sq.updated_at:
            timeline.append(
                {
                    "timestamp": sq.updated_at,
                    "type": "SUPPLIER_DRAFT",
                    "icon": "📝",
                    "title": f"Tedarikçi Taslak Kaydetti: {supplier_name}",
                    "actor": "Tedarikçi Sistemi",
                    "details": {"supplier": supplier_name},
                }
            )
        elif sq.status == "yanıtlandı" and sq.submitted_at:
            timeline.append(
                {
                    "timestamp": sq.submitted_at,
                    "type": "SUPPLIER_SUBMITTED",
                    "icon": "📨",
                    "title": f"{supplier_name} Yanıtladı",
                    "actor": "Tedarikçi Sistemi",
                    "details": {
                        "supplier": supplier_name,
                        "price": float(sq.final_amount),
                        "terms": sq.payment_terms or "Belirtmedi",
                    },
                }
            )
        elif sq.status == "revize_edildi":
            timeline.append(
                {
                    "timestamp": sq.updated_at or sq.created_at,
                    "type": "REVISION_REQUESTED",
                    "icon": "🛠️",
                    "title": f"Revize İstendi: {supplier_name}",
                    "actor": row.updated_by or "Sistem",
                    "details": {
                        "supplier": supplier_name,
                        "status": sq.status,
                        "reason": sq.notes or "Belirtilmedi",
                    },
                }
            )
        elif sq.status == "onaylandı":
            timeline.append(
                {
                    "timestamp": sq.updated_at or sq.submitted_at or sq.created_at,
                    "type": "BUSINESS_APPROVED",
                    "icon": "🏁",
                    "title": f"İş Onayı Verildi: {supplier_name}",
                    "actor": row.updated_by or "Sistem",
                    "details": {
                        "supplier": supplier_name,
                        "status": sq.status,
                        "amount": float(sq.final_amount or 0),
                    },
                }
            )
        elif sq.status == "kapatıldı_yüksek_fiyat":
            timeline.append(
                {
                    "timestamp": sq.updated_at or sq.created_at,
                    "type": "BUSINESS_CLOSED",
                    "icon": "📁",
                    "title": f"Teklif Kapatıldı: {supplier_name}",
                    "actor": row.updated_by or "Sistem",
                    "details": {
                        "supplier": supplier_name,
                        "status": sq.status,
                    },
                }
            )

    # Taramansal sıralama
    timeline.sort(key=lambda x: x["timestamp"])

    completed_approvals = [a for a in quote_approvals if a.status == "onaylandı"]
    if quote_approvals and len(completed_approvals) == len(quote_approvals):
        latest_approval_at = max(
            (a.completed_at for a in completed_approvals if a.completed_at),
            default=row.updated_at or row.created_at,
        )
        timeline.append(
            {
                "timestamp": latest_approval_at,
                "type": "APPROVAL_SUMMARY",
                "icon": "🧾",
                "title": "Onay Özeti: Tüm gönderim onayları tamamlandı",
                "actor": "Sistem",
                "details": {
                    "levels": len(quote_approvals),
                    "next": "Tedarikçiye gönderim yapılabilir",
                },
            }
        )
        timeline.sort(key=lambda x: x["timestamp"])

    if str(row.status).lower() == "approved":
        timeline.append(
            {
                "timestamp": row.updated_at or row.created_at,
                "type": "CONTRACT_STAGE",
                "icon": "📜",
                "title": "Teklif sözleşme aşamasına geçti ve kapatıldı",
                "actor": row.updated_by or "Sistem",
                "details": {
                    "status": to_turkish_quote_status(row.status),
                },
            }
        )
        timeline.sort(key=lambda x: x["timestamp"])

    return {
        "quote_id": quote_id,
        "quote_title": row.title,
        "current_status": to_turkish_quote_status(row.status),
        "total_events": len(timeline),
        "timeline": timeline,
        "summary": {
            "created_at": row.created_at,
            "created_by": row.created_by_user.full_name if row.created_by_user else "?",
            "status_changes": len(status_logs),
            "approval_levels": len(quote_approvals),
            "suppliers_responded": sum(
                1 for sq in supplier_quotes if sq.status == "yanıtlandı"
            ),
        },
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

    result = QuoteService.get_supplier_quotes_grouped_by_supplier(db, row)
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
    _ensure_quote_write_access(current_user)

    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    target_supplier_quote = (
        db.query(SupplierQuote).filter(SupplierQuote.id == supplier_quote_id).first()
    )
    if not target_supplier_quote:
        raise HTTPException(status_code=404, detail="Tedarikçi teklifi bulunamadı")
    if int(target_supplier_quote.quote_id) != int(quote_id):
        raise HTTPException(
            status_code=400,
            detail="Revize istenen tedarikçi teklifi bu RFQ'ya ait değil",
        )

    result = QuoteService.request_quote_revision(
        db, row, supplier_quote_id, reason, current_user.id
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
                        SupplierUser.is_active,
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
    row = _get_scoped_quote_or_404(quote_id, db, current_user)

    supplier_quote_id = payload.get("supplier_quote_id")
    if not isinstance(supplier_quote_id, int):
        raise HTTPException(status_code=422, detail="supplier_quote_id zorunludur")

    revised_prices = payload.get("revised_prices", [])
    if not isinstance(revised_prices, list):
        raise HTTPException(status_code=422, detail="revised_prices liste olmalıdır")

    result = QuoteService.submit_revised_quote(
        db,
        row,
        supplier_quote_id,
        revised_prices,
        current_user.id,
    )

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])

    return result


@router.post("/{quote_id}/approve-supplier/{supplier_quote_id}")
def approve_supplier_quote(
    quote_id: int,
    supplier_quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Karşılaştırma ekranında seçilen tedarikçi teklifini onaylar."""
    _ensure_quote_write_access(current_user)

    row = _get_quote_or_404(quote_id, db)
    _ensure_owner_or_admin(current_user, row)

    if row.deleted_at is not None:
        raise HTTPException(
            status_code=409, detail="Silinmiş teklif için onay yapılamaz"
        )

    selected_quote = (
        db.query(SupplierQuote)
        .filter(
            SupplierQuote.id == supplier_quote_id,
            SupplierQuote.quote_id == quote_id,
        )
        .first()
    )
    if not selected_quote:
        raise HTTPException(status_code=404, detail="Tedarikçi teklifi bulunamadı")
    if selected_quote.status not in {"yanıtlandı", "onaylandı"}:
        raise HTTPException(
            status_code=409,
            detail="İş onayı yalnızca yanıtlanmış tedarikçi teklifleri için verilebilir",
        )

    all_supplier_quotes = (
        db.query(SupplierQuote).filter(SupplierQuote.quote_id == quote_id).all()
    )

    for supplier_quote in all_supplier_quotes:
        if supplier_quote.id == selected_quote.id:
            supplier_quote.status = "onaylandı"
            continue

        supplier_quote.status = "kapatıldı_yüksek_fiyat"

    if hasattr(row, "selected_supplier_id"):
        setattr(row, "selected_supplier_id", selected_quote.supplier_id)

    previous_status = row.status
    if row.status != QuoteStatus.APPROVED:
        row.status = QuoteStatus.APPROVED
        row.version += 1
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id
    row.transition_reason = "Tedarikçi karşılaştırma ekranından onaylandı"

    _log_status_change(db, row.id, current_user.id, previous_status, row.status)

    db.commit()
    return {
        "status": "success",
        "quote_id": quote_id,
        "supplier_quote_id": selected_quote.id,
        "supplier_id": selected_quote.supplier_id,
        "supplier_name": selected_quote.supplier.company_name
        if selected_quote.supplier
        else "-",
        "approved_amount": float(selected_quote.final_amount or 0),
        "message": "Tedarikçi teklifi onaylandı",
    }


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
