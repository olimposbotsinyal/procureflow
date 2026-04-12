# api\app\domain\quote\enums.py
from enum import StrEnum


class QuoteStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"


_LEGACY_MAP: dict[str, QuoteStatus] = {
    "draft": QuoteStatus.DRAFT,
    "sent": QuoteStatus.SUBMITTED,
    "pending": QuoteStatus.SUBMITTED,
    "responded": QuoteStatus.SUBMITTED,
    "submitted": QuoteStatus.SUBMITTED,
    "approved": QuoteStatus.APPROVED,
    "rejected": QuoteStatus.REJECTED,
}


def parse_quote_status(value: str) -> QuoteStatus:
    """Normalize legacy/current status strings to domain QuoteStatus."""
    normalized = (value or "").strip().lower()
    if normalized in _LEGACY_MAP:
        return _LEGACY_MAP[normalized]
    # Attempt direct enum match as fallback
    try:
        return QuoteStatus(normalized)
    except ValueError:
        return QuoteStatus.DRAFT
