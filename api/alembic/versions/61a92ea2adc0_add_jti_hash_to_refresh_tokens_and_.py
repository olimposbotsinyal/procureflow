"""add jti_hash to refresh_tokens and backfill

Revision ID: 61a92ea2adc0
Revises: 8aa75c741be2
Create Date: 2026-03-29 08:39:23.332171

"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "61a92ea2adc0"
down_revision: Union[str, Sequence[str], None] = "8aa75c741be2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
