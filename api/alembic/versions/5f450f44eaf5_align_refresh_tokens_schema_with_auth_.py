"""align refresh_tokens schema with auth model

Revision ID: 5f450f44eaf5
Revises: f2c3f182d125
Create Date: 2026-03-29 13:55:00.411962

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5f450f44eaf5"
down_revision: Union[str, Sequence[str], None] = "61a92ea2adc0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) id kolonu
    op.add_column(
        "refresh_tokens",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=True),
    )

    # PostgreSQL'de mevcut satırlar için sequence bağla
    op.execute(
        "CREATE SEQUENCE IF NOT EXISTS refresh_tokens_id_seq OWNED BY refresh_tokens.id"
    )
    op.execute(
        "ALTER TABLE refresh_tokens ALTER COLUMN id SET DEFAULT nextval('refresh_tokens_id_seq')"
    )
    op.execute(
        "UPDATE refresh_tokens SET id = nextval('refresh_tokens_id_seq') WHERE id IS NULL"
    )
    op.alter_column("refresh_tokens", "id", nullable=False)

    # 2) PK taşıma (eski PK jti varsayımı)
    op.drop_constraint("refresh_tokens_pkey", "refresh_tokens", type_="primary")
    op.create_primary_key("refresh_tokens_pkey", "refresh_tokens", ["id"])

    # 3) jti_hash kolonu + index
    op.add_column(
        "refresh_tokens", sa.Column("jti_hash", sa.String(length=64), nullable=True)
    )
    op.create_index(
        "ix_refresh_tokens_jti_hash", "refresh_tokens", ["jti_hash"], unique=False
    )
    op.create_index(
        "uq_refresh_tokens_jti_hash", "refresh_tokens", ["jti_hash"], unique=True
    )

    # 4) jti artık nullable
    op.alter_column(
        "refresh_tokens", "jti", existing_type=sa.String(length=64), nullable=True
    )


def downgrade() -> None:
    # Geri alma (minimum güvenli dönüş)
    op.alter_column(
        "refresh_tokens", "jti", existing_type=sa.String(length=64), nullable=False
    )
    op.drop_index("uq_refresh_tokens_jti_hash", table_name="refresh_tokens")
    op.drop_index("ix_refresh_tokens_jti_hash", table_name="refresh_tokens")
    op.drop_column("refresh_tokens", "jti_hash")

    op.drop_constraint("refresh_tokens_pkey", "refresh_tokens", type_="primary")
    op.create_primary_key("refresh_tokens_pkey", "refresh_tokens", ["jti"])

    op.drop_column("refresh_tokens", "id")
    op.execute("DROP SEQUENCE IF EXISTS refresh_tokens_id_seq")
