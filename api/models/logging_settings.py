"""Logging Configuration Model"""

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from api.database import Base


class LoggingSettings(Base):
    __tablename__ = "logging_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Log levels
    log_level: Mapped[str] = mapped_column(String(20), default="INFO", nullable=False)
    # VALUES: DEBUG, INFO, WARNING, ERROR, CRITICAL

    # Features
    enable_file_logging: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    enable_database_logging: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    enable_syslog: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Log retention
    log_retention_days: Mapped[int] = mapped_column(default=30, nullable=False)

    # Specific loggers
    log_api_requests: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    log_database_queries: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    log_user_actions: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )

    class Config:
        from_attributes = True
