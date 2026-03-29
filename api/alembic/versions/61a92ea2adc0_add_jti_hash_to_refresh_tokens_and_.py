"""add jti_hash to refresh_tokens and backfill

Revision ID: 61a92ea2adc0
Revises: 8aa75c741be2
Create Date: 2026-03-29 08:39:23.332171

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import hashlib


# revision identifiers, used by Alembic.
revision: str = "61a92ea2adc0"
down_revision: Union[str, Sequence[str], None] = "8aa75c741be2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _hash_jti(jti: str) -> str:
    return hashlib.sha256(jti.encode("utf-8")).hexdigest()


def upgrade() -> None:
    # 1) Kolon ekle (geçici nullable)
    op.add_column(
        "refresh_tokens",
        sa.Column("jti_hash", sa.String(length=64), nullable=True),
    )

    # 2) Backfill
    conn = op.get_bind()
    rows = conn.execute(sa.text("SELECT id, jti FROM refresh_tokens")).fetchall()

    for row in rows:
        rid = row[0]
        jti = row[1]
        if jti is None:
            continue
        conn.execute(
            sa.text("UPDATE refresh_tokens SET jti_hash = :h WHERE id = :id"),
            {"h": _hash_jti(jti), "id": rid},
        )

    # 3) Unique index
    op.create_index(
        "ix_refresh_tokens_jti_hash",
        "refresh_tokens",
        ["jti_hash"],
        unique=True,
    )

    # 4) Not null
    op.alter_column("refresh_tokens", "jti_hash", nullable=False)


def downgrade() -> None:
    op.drop_index("ix_refresh_tokens_jti_hash", table_name="refresh_tokens")
    op.drop_column("refresh_tokens", "jti_hash")
