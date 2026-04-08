"""align refresh_tokens schema to model id_jti_hash

Revision ID: 88a03a06f361
Revises: 2fbb93265c51
Create Date: 2026-03-29 10:45:23.012362

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "88a03a06f361"
down_revision: Union[str, Sequence[str], None] = "2fbb93265c51"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) Yeni kolonlar
    op.add_column("refresh_tokens", sa.Column("id", sa.Integer(), nullable=True))
    op.add_column(
        "refresh_tokens", sa.Column("jti_hash", sa.String(length=64), nullable=True)
    )

    # 2) Mevcut satır varsa jti -> jti_hash taşı (sha256)
    op.execute("""
        UPDATE refresh_tokens
        SET jti_hash = encode(digest(jti, 'sha256'), 'hex')
        WHERE jti_hash IS NULL
    """)

    # 3) id doldur (sequence ile)
    op.execute("CREATE SEQUENCE IF NOT EXISTS refresh_tokens_id_seq")
    op.execute("""
        UPDATE refresh_tokens
        SET id = nextval('refresh_tokens_id_seq')
        WHERE id IS NULL
    """)
    op.execute(
        "ALTER TABLE refresh_tokens ALTER COLUMN id SET DEFAULT nextval('refresh_tokens_id_seq')"
    )

    # 4) NOT NULL + PK/UNIQUE/INDEX
    op.alter_column("refresh_tokens", "id", nullable=False)
    op.alter_column("refresh_tokens", "jti_hash", nullable=False)

    # Eski PK(jti) düşür
    op.drop_constraint("refresh_tokens_pkey", "refresh_tokens", type_="primary")
    # Yeni PK(id)
    op.create_primary_key("refresh_tokens_pkey", "refresh_tokens", ["id"])

    # unique/indexler
    op.create_unique_constraint(
        "uq_refresh_tokens_jti_hash", "refresh_tokens", ["jti_hash"]
    )
    op.create_index(
        "ix_refresh_tokens_jti_hash", "refresh_tokens", ["jti_hash"], unique=False
    )

    # user_id index zaten olabilir; yoksa ekle
    op.create_index(
        "ix_refresh_tokens_user_id", "refresh_tokens", ["user_id"], unique=False
    )

    # eski jti + eski index kaldır
    op.drop_index("ix_refresh_tokens_jti", table_name="refresh_tokens")
    op.drop_column("refresh_tokens", "jti")


def downgrade() -> None:
    op.add_column(
        "refresh_tokens", sa.Column("jti", sa.String(length=64), nullable=True)
    )
    op.execute("UPDATE refresh_tokens SET jti = jti_hash WHERE jti IS NULL")
    op.alter_column("refresh_tokens", "jti", nullable=False)

    op.drop_index("ix_refresh_tokens_user_id", table_name="refresh_tokens")
    op.drop_index("ix_refresh_tokens_jti_hash", table_name="refresh_tokens")
    op.drop_constraint("uq_refresh_tokens_jti_hash", "refresh_tokens", type_="unique")

    op.drop_constraint("refresh_tokens_pkey", "refresh_tokens", type_="primary")
    op.create_primary_key("refresh_tokens_pkey", "refresh_tokens", ["jti"])

    op.drop_column("refresh_tokens", "jti_hash")
    op.drop_column("refresh_tokens", "id")

    op.create_index("ix_refresh_tokens_jti", "refresh_tokens", ["jti"], unique=False)
    op.create_index(
        "ix_refresh_tokens_user_id", "refresh_tokens", ["user_id"], unique=False
    )
