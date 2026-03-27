"""add quote status

Revision ID: 80ffd3de3142
Revises: e1c56cd5ec9d
Create Date: 2026-03-27 13:44:27.375610

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '80ffd3de3142'
down_revision: Union[str, Sequence[str], None] = 'e1c56cd5ec9d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("quotes", sa.Column("status", sa.String(length=20), nullable=False, server_default="draft"))
    op.create_index(op.f("ix_quotes_status"), "quotes", ["status"], unique=False)

def downgrade():
    op.drop_index(op.f("ix_quotes_status"), table_name="quotes")
    op.drop_column("quotes", "status")

