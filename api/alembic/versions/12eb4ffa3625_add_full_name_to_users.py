"""add full_name to users

Revision ID: 12eb4ffa3625
Revises: 8a25273f58bf
Create Date: 2026-03-27 07:05:08.401891

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '12eb4ffa3625'
down_revision: Union[str, Sequence[str], None] = '8a25273f58bf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("full_name", sa.String(length=255), nullable=True))
    op.execute("UPDATE users SET full_name = 'Admin User' WHERE full_name IS NULL")
    op.alter_column("users", "full_name", nullable=False)

def downgrade() -> None:
    op.drop_column("users", "full_name")

