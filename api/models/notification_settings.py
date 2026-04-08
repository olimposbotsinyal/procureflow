"""Notification Settings Model"""

from sqlalchemy import Boolean
from sqlalchemy.orm import Mapped, mapped_column

from api.database import Base


class NotificationSettings(Base):
    __tablename__ = "notification_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Quote notifications
    notify_on_quote_created: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    notify_on_quote_response: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    notify_on_quote_approved: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    notify_on_quote_rejected: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )

    # Contract notifications
    notify_on_contract_created: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    notify_on_contract_signed: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )

    # System notifications
    notify_on_system_errors: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    notify_on_maintenance: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    # Digest
    enable_daily_digest: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    digest_time: Mapped[str] = mapped_column(
        default="09:00", nullable=False
    )  # HH:MM format

    class Config:
        from_attributes = True
