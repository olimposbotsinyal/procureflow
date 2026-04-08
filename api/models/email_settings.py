"""Email/SMTP Configuration Model"""

from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from api.database import Base


class EmailSettings(Base):
    __tablename__ = "email_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

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

    class Config:
        from_attributes = True
