from api.db.session import SessionLocal
from api.models.user import User
from api.core.security import get_password_hash


def seed_other_user() -> None:
    db = SessionLocal()
    try:
        other = db.query(User).filter(User.email == "other@procureflow.dev").first()
        if not other:
            other = User(
                email="other@procureflow.dev",
                hashed_password=get_password_hash("Other123!"),
                full_name="Other User",
                role="user",
                is_active=True,
            )
            db.add(other)
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_other_user()
