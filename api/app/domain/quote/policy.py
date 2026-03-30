# api\app\domain\quote\policy.py
from dataclasses import dataclass, field
from typing import Iterable
from datetime import datetime

from .enums import QuoteStatus
from .permissions import QuotePermission


@dataclass(frozen=True)
class TransitionRule:
    allowed_next: set[QuoteStatus]
    required_permissions: set[QuotePermission]


# Domain Events
@dataclass
class QuoteDomainEvent:
    """Base class for domain events"""

    event_type: str
    quote_id: int
    actor_id: int | None = None
    timestamp: datetime = field(default_factory=lambda: datetime.utcnow())


@dataclass
class QuoteStatusChanged(QuoteDomainEvent):
    """Event fired when quote status changes"""

    old_status: QuoteStatus | None = None
    new_status: QuoteStatus | None = None
    reason: str | None = None


# Concurrency Control
class ConcurrencyError(ValueError):
    """Raised when optimistic lock collision detected"""

    pass


class QuotePolicyError(ValueError):
    pass


TRANSITIONS: dict[QuoteStatus, TransitionRule] = {
    QuoteStatus.DRAFT: TransitionRule(
        allowed_next={QuoteStatus.SUBMITTED},
        required_permissions={QuotePermission.QUOTE_TRANSITION},
    ),
    QuoteStatus.SUBMITTED: TransitionRule(
        allowed_next={QuoteStatus.APPROVED, QuoteStatus.REJECTED},
        required_permissions={QuotePermission.QUOTE_TRANSITION},
    ),
    QuoteStatus.APPROVED: TransitionRule(
        allowed_next=set(),
        required_permissions=set(),
    ),
    QuoteStatus.REJECTED: TransitionRule(
        allowed_next=set(),
        required_permissions=set(),
    ),
}


def can_transition(
    current: QuoteStatus,
    target: QuoteStatus,
    actor_permissions: Iterable[QuotePermission],
) -> bool:
    # aynı state'e geçiş bu modelde invalid
    if current == target:
        return False

    rule = TRANSITIONS.get(current)
    if not rule:
        return False

    if target not in rule.allowed_next:
        return False

    perms = set(actor_permissions)
    return rule.required_permissions.issubset(perms)


def ensure_transition(
    current: QuoteStatus,
    target: QuoteStatus,
    actor_permissions: Iterable[QuotePermission],
    reason: str | None = None,
) -> None:
    """
    Validate transition and raise if invalid.

    Args:
        current: Current status
        target: Target status
        actor_permissions: Permissions of the actor
        reason: Optional reason for transition (used for audit)

    Raises:
        QuotePolicyError: If transition is invalid
    """
    if not can_transition(current, target, actor_permissions):
        raise QuotePolicyError(f"Invalid transition: {current} -> {target}")


def check_version_collision(
    current_version: int,
    expected_version: int,
) -> None:
    """
    Optimistic locking: detect if record was modified by another process.

    Args:
        current_version: The version from database right now
        expected_version: The version the client expected

    Raises:
        ConcurrencyError: If versions don't match (concurrent modification)
    """
    if current_version != expected_version:
        raise ConcurrencyError(
            f"Concurrency conflict: Record was modified. "
            f"Expected version {expected_version} but got {current_version}. "
            f"Please refresh and try again."
        )
