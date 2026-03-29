# tests\domain\test_quote_policy.py
import pytest

from api.app.domain.quote.enums import QuoteStatus
from api.app.domain.quote.permissions import QuotePermission
from api.app.domain.quote.policy import (
    QuotePolicyError,
    can_transition,
    ensure_transition,
)


def test_draft_to_review_allowed_with_permission() -> None:
    ok = can_transition(
        QuoteStatus.DRAFT,
        QuoteStatus.REVIEW,
        [QuotePermission.QUOTE_TRANSITION],
    )
    assert ok is True


def test_draft_to_approved_denied() -> None:
    ok = can_transition(
        QuoteStatus.DRAFT,
        QuoteStatus.APPROVED,
        [QuotePermission.QUOTE_TRANSITION],
    )
    assert ok is False


def test_review_to_approved_denied_without_permission() -> None:
    ok = can_transition(QuoteStatus.REVIEW, QuoteStatus.APPROVED, [])
    assert ok is False


def test_terminal_state_accepted_has_no_outgoing_transition() -> None:
    ok = can_transition(
        QuoteStatus.ACCEPTED,
        QuoteStatus.DRAFT,
        [QuotePermission.QUOTE_TRANSITION],
    )
    assert ok is False


def test_ensure_transition_raises_on_invalid() -> None:
    with pytest.raises(QuotePolicyError):
        ensure_transition(
            QuoteStatus.DRAFT,
            QuoteStatus.APPROVED,
            [QuotePermission.QUOTE_TRANSITION],
        )
