from datetime import UTC, datetime


def utcnow() -> datetime:
    """Return UTC now as naive datetime for DB compatibility."""
    return datetime.now(UTC).replace(tzinfo=None)
