# api\app\domain\quote\enums.py
from enum import StrEnum


class QuoteStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
