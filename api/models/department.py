# models/department.py
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from api.database import Base
from api.models.associations import user_department, company_department
from api.core.time import utcnow


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=utcnow, onupdate=utcnow, nullable=False
    )

    # Relationships
    users: Mapped[list["User"]] = relationship(back_populates="department")
    companies: Mapped[list["Company"]] = relationship(
        secondary=company_department, back_populates="departments"
    )
    personnel_users: Mapped[list["User"]] = relationship(
        secondary=user_department, back_populates="user_departments"
    )
