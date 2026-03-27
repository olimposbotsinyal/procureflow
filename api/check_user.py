from api.db.session import SessionLocal
from api.models import User

db = SessionLocal()
try:
    users = db.query(User).all()
    for u in users:
        print(u.id, u.email, u.role, u.is_active)
finally:
    db.close()
