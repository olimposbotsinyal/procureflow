"""
Seed admin ve test user'ları
Render.com deployment'da build aşamasında çalıştırılır
"""

import os
import sys
from pathlib import Path

# Add parent dir to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from api.db.session import SessionLocal
from api.models.user import User
from api.core.security import get_password_hash


def seed_admin_users() -> bool:
    """Admin ve test user'larını seed et"""
    db = SessionLocal()
    try:
        # 1. Admin user (prod: admin@procureflow.dev, local: test@example.com)
        admin_email = os.getenv("SEED_ADMIN_EMAIL", "test@example.com")
        admin_password = os.getenv("SEED_ADMIN_PASSWORD", "Test1234!")

        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                full_name="Admin User",
                role="super_admin",
                is_active=True,
            )
            db.add(admin)
            db.flush()
            print(f"✅ Admin user created: {admin_email}")
        else:
            print(f"ℹ️ Admin user already exists: {admin_email}")

        # 2. Test user (backup)
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                hashed_password=get_password_hash("Test1234!"),
                full_name="Test User",
                role="super_admin",
                is_active=True,
            )
            db.add(test_user)
            db.flush()
            print("✅ Test user created: test@example.com")
        else:
            print("ℹ️ Test user already exists: test@example.com")

        # 3. Other user (for testing)
        other_user = (
            db.query(User).filter(User.email == "other@procureflow.dev").first()
        )
        if not other_user:
            other_user = User(
                email="other@procureflow.dev",
                hashed_password=get_password_hash("Other123!"),
                full_name="Other User",
                role="satinalma_uzman",
                is_active=True,
            )
            db.add(other_user)
            db.flush()
            print("✅ Other user created: other@procureflow.dev")
        else:
            print("ℹ️ Other user already exists: other@procureflow.dev")

        db.commit()
        print("✅ All seed users created/verified successfully!")
        return True

    except Exception as e:
        print(f"❌ Seeding error: {e}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    try:
        success = seed_admin_users()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)
