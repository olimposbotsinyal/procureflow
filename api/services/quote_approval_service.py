from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from api.models import Quote, QuoteApproval, QuoteStatusLog, User
from api.app.domain.quote.enums import QuoteStatus


ADMIN_OVERRIDE_ROLES = {"admin", "super_admin"}

ROLE_LABELS: dict[str, str] = {
    "satinalmaci": "Satın Almacı",
    "satinalma_uzmani": "Satın Alma Uzmanı",
    "satinalma_yoneticisi": "Satın Alma Yöneticisi",
    "satinalma_direktoru": "Satın Alma Direktörü",
    "admin": "Admin",
    "super_admin": "Super Admin",
    "user": "Kullanıcı",
    "*": "Yetkili Kullanıcı",
}

SUBMISSION_APPROVAL_CHAIN: dict[str, list[str]] = {
    "user": ["satinalma_yoneticisi", "satinalma_direktoru"],
    "satinalmaci": ["satinalma_yoneticisi", "satinalma_direktoru"],
    "satinalma_uzmani": ["satinalma_yoneticisi", "satinalma_direktoru"],
    "satinalma_yoneticisi": ["satinalma_direktoru"],
}


@dataclass
class ApprovalActionResult:
    pending_approval: QuoteApproval
    next_approval: QuoteApproval | None
    quote_status: str
    workflow_completed: bool


def get_role_label(role: str | None) -> str:
    normalized = str(role or "").strip().lower()
    return ROLE_LABELS.get(normalized, normalized or "Bilinmiyor")


def normalize_user_role(user: User | None) -> str | None:
    if user is None:
        return None
    role = getattr(user, "role", None)
    if role:
        return str(role).strip().lower()
    role_obj = getattr(user, "role_obj", None)
    role_name = getattr(role_obj, "name", None)
    if role_name:
        return str(role_name).strip().lower()
    return None


def resolve_submission_approval_chain(creator_role: str | None) -> list[str]:
    normalized_role = str(creator_role or "").strip().lower()
    return list(SUBMISSION_APPROVAL_CHAIN.get(normalized_role, []))


def list_project_role_approvers(
    db: Session, quote: Quote, required_role: str
) -> list[User]:
    candidates = (
        db.query(User)
        .filter(User.role == required_role, User.is_active.is_(True))
        .all()
    )
    project_members = [
        user
        for user in candidates
        if any(project.id == quote.project_id for project in user.projects)
    ]
    return project_members or candidates


def ensure_submission_approvals(db: Session, quote: Quote) -> list[QuoteApproval]:
    chain = resolve_submission_approval_chain(
        getattr(quote.created_by_user, "role", None)
    )
    existing = (
        db.query(QuoteApproval)
        .filter(
            QuoteApproval.quote_id == quote.id,
            QuoteApproval.supplier_quote_id.is_(None),
        )
        .order_by(QuoteApproval.approval_level.asc())
        .all()
    )

    if existing:
        has_pending = any(approval.status == "beklemede" for approval in existing)
        has_review_back = any(
            approval.status in {"reddedildi", "iptal"} for approval in existing
        )
        if has_review_back and not has_pending:
            # Tekrar onaya gönderimde aynı onay adımlarını baştan beklemeye al.
            now = datetime.now(UTC)
            for approval in existing:
                approval.status = "beklemede"
                approval.requested_at = now
                approval.completed_at = None
                approval.approved_by_id = None
                approval.comment = None
            db.flush()
        return existing

    created: list[QuoteApproval] = []
    for level, role in enumerate(chain, start=1):
        approval = QuoteApproval(
            quote_id=quote.id,
            approval_level=level,
            required_role=role,
            status="beklemede",
            requested_at=datetime.now(UTC),
        )
        db.add(approval)
        created.append(approval)

    if created:
        db.flush()
    return created


def get_quote_level_approvals(db: Session, quote_id: int) -> list[QuoteApproval]:
    return (
        db.query(QuoteApproval)
        .filter(
            QuoteApproval.quote_id == quote_id,
            QuoteApproval.supplier_quote_id.is_(None),
        )
        .order_by(QuoteApproval.approval_level.asc())
        .all()
    )


def has_completed_submission_approvals(db: Session, quote_id: int) -> bool:
    approvals = get_quote_level_approvals(db, quote_id)
    if not approvals:
        return True
    return all(approval.status == "onaylandı" for approval in approvals)


def get_pending_quote_approval(db: Session, quote_id: int) -> QuoteApproval | None:
    return (
        db.query(QuoteApproval)
        .filter(
            QuoteApproval.quote_id == quote_id,
            QuoteApproval.supplier_quote_id.is_(None),
            QuoteApproval.status == "beklemede",
        )
        .order_by(QuoteApproval.approval_level.asc())
        .first()
    )


def can_user_action_pending_approval(
    user: User, pending_approval: QuoteApproval
) -> bool:
    user_role = normalize_user_role(user)
    return bool(
        user_role in ADMIN_OVERRIDE_ROLES
        or pending_approval.required_role == "*"
        or pending_approval.required_role == user_role
    )


def log_quote_status_change(
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


def approve_submission_quote(
    db: Session,
    quote: Quote,
    actor: User,
    comment: str | None = None,
) -> ApprovalActionResult:
    if quote.created_by_id == actor.id:
        raise ValueError(
            "Kendi teklifinizi onaylayamazsınız. Onay için yetkili kişi gereklidir."
        )

    pending_approval = get_pending_quote_approval(db, quote.id)
    if pending_approval is None:
        raise ValueError("Bu teklif için beklemede onay bulunmamaktadır")

    if not can_user_action_pending_approval(actor, pending_approval):
        raise PermissionError(
            f"Sadece {get_role_label(pending_approval.required_role)} bu onayı yapabilir"
        )

    pending_approval.approved_by_id = actor.id
    pending_approval.status = "onaylandı"
    pending_approval.completed_at = datetime.now(UTC)
    pending_approval.comment = comment

    next_approval = get_pending_quote_approval(db, quote.id)
    quote.updated_at = datetime.now(UTC)
    quote.updated_by = actor.id
    quote.transition_reason = (
        "Tedarikçiye gönderim onayları tamamlandı"
        if next_approval is None
        else "Teklif üst onay seviyesine geçti"
    )

    # İş onayı ayrı bir aşama olduğu için RFQ statüsünü burada kapatmıyoruz.
    quote.status = QuoteStatus.SUBMITTED

    return ApprovalActionResult(
        pending_approval=pending_approval,
        next_approval=next_approval,
        quote_status=QuoteStatus.SUBMITTED.value,
        workflow_completed=next_approval is None,
    )


def reject_submission_quote(
    db: Session,
    quote: Quote,
    actor: User,
    comment: str,
) -> ApprovalActionResult:
    if quote.created_by_id == actor.id:
        raise ValueError(
            "Kendi teklifinizi reddedemezsiniz. Ret işlemi için yetkili kişi gereklidir."
        )

    pending_approval = get_pending_quote_approval(db, quote.id)
    if pending_approval is None:
        raise ValueError("Bu teklif için beklemede onay bulunmamaktadır")

    if not can_user_action_pending_approval(actor, pending_approval):
        raise PermissionError(
            f"Sadece {get_role_label(pending_approval.required_role)} bu kararı verebilir"
        )

    pending_approval.approved_by_id = actor.id
    pending_approval.status = "reddedildi"
    pending_approval.completed_at = datetime.now(UTC)
    pending_approval.comment = comment

    other_approvals = (
        db.query(QuoteApproval)
        .filter(
            QuoteApproval.quote_id == quote.id,
            QuoteApproval.supplier_quote_id.is_(None),
            QuoteApproval.id != pending_approval.id,
            QuoteApproval.status == "beklemede",
        )
        .all()
    )
    for approval in other_approvals:
        approval.status = "iptal"

    previous_status = (
        quote.status.value
        if hasattr(quote.status, "value")
        else str(quote.status).lower()
    )
    quote.status = QuoteStatus.DRAFT
    quote.updated_at = datetime.now(UTC)
    quote.updated_by = actor.id
    quote.transition_reason = f"Hata ve eksikler var: {comment}"
    if previous_status != QuoteStatus.DRAFT.value:
        log_quote_status_change(
            db,
            quote_id=quote.id,
            actor_id=actor.id,
            from_status=previous_status,
            to_status=QuoteStatus.DRAFT.value,
        )

    return ApprovalActionResult(
        pending_approval=pending_approval,
        next_approval=None,
        quote_status=QuoteStatus.DRAFT.value,
        workflow_completed=True,
    )
