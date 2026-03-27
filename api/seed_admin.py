from api.db.session import SessionLocal
from api.models import User
from api.core.security import get_password_hash

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


def run():
    db = SessionLocal()
    try:
        email = "admin@procureflow.dev"

        exists = db.query(User).filter(User.email == email).first()
        if exists:
            print("Admin already exists")
            return

        admin = User(
            email=email,
            hashed_password=get_password_hash("Admin123!"),
            full_name="Admin User",
            role="admin",
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print("Admin created")
        print("Seed completed")
    finally:
        db.close()


if __name__ == "__main__":
    run()

