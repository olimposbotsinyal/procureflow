# api\routers\quotes.py
from datetime import datetime, UTC
from typing import Literal

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from api.db.session import get_db
from api.core.deps import get_current_user
from api.models import Quote, User
from api.schemas import QuoteCreate, QuoteUpdate, QuoteOut, QuoteListOut, MessageOut

router = APIRouter(prefix="/quotes", tags=["quotes"])


def _get_quote_or_404(quote_id: int, db: Session) -> Quote:
    row = db.query(Quote).filter(Quote.id == quote_id).first()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    return row


def _ensure_owner_or_admin(current_user: User, row: Quote) -> None:
    if current_user.role == "admin":
        return
    if row.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )


@router.get("/", response_model=QuoteListOut)
def list_quotes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    q: str | None = Query(None, description="Title contains"),
    min_amount: float | None = Query(None, ge=0),
    max_amount: float | None = Query(None, ge=0),
    sort_by: Literal["created_at", "amount", "id"] = Query("created_at"),
    sort_order: Literal["asc", "desc"] = Query("desc"),
    include_deleted: bool = Query(False),
):
    query = db.query(Quote)

    # RBAC scope
    if current_user.role != "admin":
        query = query.filter(Quote.user_id == current_user.id)

    # Soft delete visibility
    # Admin isterse include_deleted=true ile gÃ¶rebilir.
    # User tarafÄ±nda her zaman soft-deleted kayÄ±tlar gizlenir.
    if current_user.role != "admin" or not include_deleted:
        query = query.filter(Quote.deleted_at.is_(None))

    # Filters
    if q:
        query = query.filter(Quote.title.ilike(f"%{q}%"))

    if min_amount is not None:
        query = query.filter(Quote.amount >= min_amount)

    if max_amount is not None:
        query = query.filter(Quote.amount <= max_amount)

    if min_amount is not None and max_amount is not None and min_amount > max_amount:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="min_amount cannot be greater than max_amount",
        )

    # Sorting
    sort_col = getattr(Quote, sort_by)
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
    row = Quote(
        user_id=current_user.id,
        title=payload.title,
        amount=payload.amount,
        created_by=current_user.id,
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

    # Soft-deleted kaydÄ± admin gÃ¶rebilir, user gÃ¶remez.
    if row.deleted_at is not None and current_user.role != "admin":
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

    # Soft-deleted kaydÄ± sadece admin gÃ¼ncelleyebilsin (istersen tamamen yasaklarÄ±z)
    if row.deleted_at is not None and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )

    if payload.title is not None:
        row.title = payload.title
    if payload.amount is not None:
        row.amount = payload.amount

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

    # Idempotent soft delete davranÄ±ÅŸÄ±
    if row.deleted_at is None:
        row.deleted_at = datetime.now(UTC)

        row.deleted_by = current_user.id
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
    row.updated_at = datetime.now(UTC)
    row.updated_by = current_user.id

    db.commit()
    db.refresh(row)
    return row

