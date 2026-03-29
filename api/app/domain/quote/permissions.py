# api\app\domain\quote\permissions.py
from enum import StrEnum


class QuotePermission(StrEnum):
    QUOTE_CREATE = "quote:create"
    QUOTE_READ = "quote:read"
    QUOTE_UPDATE = "quote:update"
    QUOTE_DELETE = "quote:delete"
    QUOTE_TRANSITION = "quote:transition"
    QUOTE_SHARE = "quote:share"
    QUOTE_EXPORT = "quote:export"
    QUOTE_CONTRACT_CREATE = "quote:contract:create"
