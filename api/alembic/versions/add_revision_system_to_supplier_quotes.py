"""Add revision system to supplier quotes for revision tracking and profitability

Revision ID: add_revision_system
Revises: f2c3f182d125
Create Date: 2026-04-03 10:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "add_revision_system"
down_revision = "f2c3f182d125"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add columns to supplier_quotes table
    op.add_column(
        "supplier_quotes",
        sa.Column("revision_number", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "supplier_quotes", sa.Column("revision_of_id", sa.Integer(), nullable=True)
    )
    op.add_column(
        "supplier_quotes", sa.Column("revision_reason", sa.String(500), nullable=True)
    )
    op.add_column(
        "supplier_quotes",
        sa.Column(
            "is_revised_version", sa.Boolean(), nullable=False, server_default="false"
        ),
    )
    op.add_column(
        "supplier_quotes",
        sa.Column("profitability_amount", sa.Numeric(12, 2), nullable=True),
    )
    op.add_column(
        "supplier_quotes",
        sa.Column("profitability_percent", sa.Numeric(5, 2), nullable=True),
    )
    op.add_column(
        "supplier_quotes", sa.Column("score", sa.Numeric(5, 2), nullable=True)
    )
    op.add_column(
        "supplier_quotes", sa.Column("score_rank", sa.String(50), nullable=True)
    )

    # Create foreign key for revision_of_id (self-referencing)
    op.create_foreign_key(
        "fk_supplier_quotes_revision_of_id",
        "supplier_quotes",
        "supplier_quotes",
        ["revision_of_id"],
        ["id"],
        ondelete="SET NULL",
    )

    # Add columns to supplier_quote_items table
    op.add_column(
        "supplier_quote_items",
        sa.Column("revision_number", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "supplier_quote_items", sa.Column("revision_prices", sa.Text(), nullable=True)
    )


def downgrade() -> None:
    # Remove columns from supplier_quote_items table
    op.drop_column("supplier_quote_items", "revision_prices")
    op.drop_column("supplier_quote_items", "revision_number")

    # Remove foreign key and columns from supplier_quotes table
    op.drop_constraint(
        "fk_supplier_quotes_revision_of_id", "supplier_quotes", type_="foreignkey"
    )
    op.drop_column("supplier_quotes", "score_rank")
    op.drop_column("supplier_quotes", "score")
    op.drop_column("supplier_quotes", "profitability_percent")
    op.drop_column("supplier_quotes", "profitability_amount")
    op.drop_column("supplier_quotes", "is_revised_version")
    op.drop_column("supplier_quotes", "revision_reason")
    op.drop_column("supplier_quotes", "revision_of_id")
    op.drop_column("supplier_quotes", "revision_number")
