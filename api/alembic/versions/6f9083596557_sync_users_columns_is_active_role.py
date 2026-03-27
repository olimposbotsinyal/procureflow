"""sync users columns is_active role

Revision ID: 6f9083596557
Revises: 12eb4ffa3625
Create Date: 2026-03-27 07:18:12.544755

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6f9083596557'
down_revision: Union[str, Sequence[str], None] = '12eb4ffa3625'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = {c["name"] for c in inspector.get_columns("users")}

    if "role" not in cols:
        op.add_column("users", sa.Column("role", sa.String(length=50), nullable=True))
        op.execute("UPDATE users SET role = 'admin' WHERE role IS NULL")
        op.alter_column("users", "role", nullable=False)

    if "is_active" not in cols:
        op.add_column("users", sa.Column("is_active", sa.Boolean(), nullable=True))
        op.execute("UPDATE users SET is_active = TRUE WHERE is_active IS NULL")
        op.alter_column("users", "is_active", nullable=False)

def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = {c['name'] for c in inspector.get_columns('users')}

    if "is_active" in cols:
        op.drop_column("users", "is_active")
    if "role" in cols:
        op.drop_column("users", "role")
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = {c["name"] for c in inspector.get_columns("users")}

    if "is_active" in cols:
        op.drop_column("users", "is_active")
    op.execute("""
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='users' AND column_name='is_active'
        ) THEN
            ALTER TABLE users DROP COLUMN is_active;
        END IF;
    END $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='users' AND column_name='role'
        ) THEN
            ALTER TABLE users DROP COLUMN role;
        END IF;
    END $$;
    """)
