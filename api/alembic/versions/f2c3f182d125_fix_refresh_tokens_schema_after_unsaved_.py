"""fix refresh_tokens schema after unsaved migration

Revision ID: f2c3f182d125
Revises: 88a03a06f361
Create Date: 2026-03-29 10:56:24.606287

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f2c3f182d125"
down_revision: Union[str, Sequence[str], None] = "88a03a06f361"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    # pgcrypto güvence
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

    # columns mevcut mu kontrol
    cols = {
        r[0]
        for r in bind.execute(
            sa.text("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema='public' AND table_name='refresh_tokens'
    """)
        ).fetchall()
    }

    if "id" not in cols:
        op.add_column("refresh_tokens", sa.Column("id", sa.Integer(), nullable=True))
    if "jti_hash" not in cols:
        op.add_column(
            "refresh_tokens", sa.Column("jti_hash", sa.String(length=64), nullable=True)
        )

    # jti -> jti_hash
    op.execute("""
        UPDATE refresh_tokens
        SET jti_hash = encode(digest(jti, 'sha256'), 'hex')
        WHERE jti_hash IS NULL
    """)

    # id populate + default
    op.execute("CREATE SEQUENCE IF NOT EXISTS refresh_tokens_id_seq")
    op.execute("""
        UPDATE refresh_tokens
        SET id = nextval('refresh_tokens_id_seq')
        WHERE id IS NULL
    """)
    op.execute(
        "ALTER TABLE refresh_tokens ALTER COLUMN id SET DEFAULT nextval('refresh_tokens_id_seq')"
    )

    op.alter_column("refresh_tokens", "id", nullable=False)
    op.alter_column("refresh_tokens", "jti_hash", nullable=False)

    # mevcut PK adını düş
    op.drop_constraint("refresh_tokens_pkey", "refresh_tokens", type_="primary")
    op.create_primary_key("refresh_tokens_pkey", "refresh_tokens", ["id"])

    # unique/index
    op.create_unique_constraint(
        "uq_refresh_tokens_jti_hash", "refresh_tokens", ["jti_hash"]
    )
    op.create_index(
        "ix_refresh_tokens_jti_hash", "refresh_tokens", ["jti_hash"], unique=False
    )

    # user_id index varsa tekrar yaratma hatası olabilir; önce silmeyi dene
    op.execute("DROP INDEX IF EXISTS ix_refresh_tokens_user_id")
    op.create_index(
        "ix_refresh_tokens_user_id", "refresh_tokens", ["user_id"], unique=False
    )

    op.execute("DROP INDEX IF EXISTS ix_refresh_tokens_jti")
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
