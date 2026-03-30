from sqlalchemy import select
from api.db.session import SessionLocal
from api.models.user import User
from api.core.security import get_password_hash

EMAIL = "test@example.com"
PASSWORD = "Test1234!"
FULL_NAME = "Test User"


def run():
    db = SessionLocal()
    try:
        user = db.execute(select(User).where(User.email == EMAIL)).scalar_one_or_none()

        pwd_hash = get_password_hash(PASSWORD)

        if user:
            user.hashed_password = pwd_hash

            if hasattr(user, "full_name") and not getattr(user, "full_name", None):
                user.full_name = FULL_NAME
            if hasattr(user, "is_active"):
                user.is_active = True
            if hasattr(user, "role") and not getattr(user, "role", None):
                user.role = "user"

            db.add(user)
            db.commit()
            print(f"UPDATED: {EMAIL}")
        else:
            payload = {
                "email": EMAIL,
                "hashed_password": pwd_hash,
                "full_name": FULL_NAME,  # NOT NULL constraint için zorunlu
                "role": "user",
            }

            if hasattr(User, "is_active"):
                payload["is_active"] = True
            if hasattr(User, "is_verified"):
                payload["is_verified"] = True  # sadece varsa

            user = User(**payload)
            db.add(user)
            db.commit()
            print(f"CREATED: {EMAIL}")

    finally:
        db.close()


if __name__ == "__main__":
    run()
