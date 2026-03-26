from fastapi import APIRouter

router = APIRouter(prefix="/quotes", tags=["quotes"])

FAKE_QUOTES = [
    {"id": 1, "vendor": "ABC Ltd", "amount": 1200.50, "currency": "TRY", "status": "pending"},
    {"id": 2, "vendor": "XYZ A.Ş.", "amount": 980.00, "currency": "TRY", "status": "approved"},
    {"id": 3, "vendor": "Delta Inc", "amount": 1500.00, "currency": "USD", "status": "rejected"},
]

@router.get("")
def list_quotes():
    return {"count": len(FAKE_QUOTES), "items": FAKE_QUOTES}
