from dataclasses import dataclass
from typing import Iterable

from .enums import QuoteStatus
from .permissions import QuotePermission


@dataclass(frozen=True)
class TransitionRule:
    allowed_next: set[QuoteStatus]
    required_permissions: set[QuotePermission]


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


class QuotePolicyError(ValueError):
    pass


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
) -> None:
    if not can_transition(current, target, actor_permissions):
        raise QuotePolicyError(f"Invalid transition: {current} -> {target}")
