"""Email/SMTP Configuration Model"""

from sqlalchemy import String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base


class EmailSettings(Base):
    __tablename__ = "email_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    tenant_id: Mapped[int | None] = mapped_column(
        ForeignKey("tenants.id"), nullable=True, index=True
    )
    owner_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), nullable=True, index=True
    )

    # SMTP Server Configuration
    smtp_host: Mapped[str] = mapped_column(String(255), nullable=True)
    smtp_port: Mapped[int] = mapped_column(Integer, default=587, nullable=False)
    smtp_username: Mapped[str] = mapped_column(String(255), nullable=True)
    smtp_password: Mapped[str] = mapped_column(String(255), nullable=True)

    # Email Settings
    from_email: Mapped[str] = mapped_column(String(255), nullable=True)
    from_name: Mapped[str] = mapped_column(
        String(255), default="ProcureFlow", nullable=False
    )

    # TLS/SSL
    use_tls: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    use_ssl: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Features
    enable_email_notifications: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    mail_domain: Mapped[str | None] = mapped_column(String(255), nullable=True)
    app_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    use_custom_app_url: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    reply_to_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bounce_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    mailbox_support_email: Mapped[str | None] = mapped_column(
        String(255), nullable=True
    )
    enable_list_unsubscribe: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    enable_strict_from_alignment: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    signature_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    signature_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    signature_note: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    signature_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    tenant = relationship("Tenant", back_populates="email_settings")

    class Config:
        from_attributes = True
