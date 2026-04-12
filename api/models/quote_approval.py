"""Teklif Onay Workflow Modeli"""

from datetime import datetime, UTC

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base


class QuoteApproval(Base):
    """Teklif Onay Workflow"""

    __tablename__ = "quote_approvals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    quote_id: Mapped[int] = mapped_column(ForeignKey("quotes.id"), nullable=False)
    supplier_quote_id: Mapped[int | None] = mapped_column(
        ForeignKey("supplier_quotes.id"), nullable=True
    )

    # Onay Kademesi
    approval_level: Mapped[int] = mapped_column(Integer)  # 1: Yönetici, 2: Direktör
    required_role: Mapped[str] = mapped_column(String(100))

    # Onay Kişisi
    approved_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )

    # Durum
    status: Mapped[str] = mapped_column(
        String(50), default="beklemede"
    )  # beklemede, onaylandı, reddedildi
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Zaman
    requested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
        server_default=text("CURRENT_TIMESTAMP"),
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # İlişkiler
    quote: Mapped["Quote"] = relationship("Quote", back_populates="approvals")
    approved_by: Mapped["User | None"] = relationship(
        "User", foreign_keys=[approved_by_id]
    )
    supplier_quote: Mapped["SupplierQuote | None"] = relationship(
        "SupplierQuote", foreign_keys=[supplier_quote_id]
    )
