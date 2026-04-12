from datetime import datetime
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base
from api.models.associations import user_company, company_department
from api.core.time import utcnow


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    color: Mapped[str] = mapped_column(String(7), default="#3b82f6", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    # Relationships
    users: Mapped[list["User"]] = relationship(
        secondary=user_company, back_populates="companies"
    )
    departments: Mapped[list["Department"]] = relationship(
        secondary=company_department, back_populates="companies"
    )
    projects: Mapped[list["Project"]] = relationship(back_populates="company")
