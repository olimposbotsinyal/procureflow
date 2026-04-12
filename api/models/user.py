# models\user.py

from typing import TYPE_CHECKING

from sqlalchemy import String, Boolean, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base
from api.models.associations import (
    user_company,
    user_department,
)

if TYPE_CHECKING:
    from api.models.department import Department
    from api.models.company import Company
    from api.models.project import Project
    from api.models.assignment import CompanyRole, ProjectPermission


class User(Base):
    __tablename__ = "users"

    # ...yukarıda zaten tanımlı, tekrar eden alanlar kaldırıldı...

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        String(50),
        default="satinalmaci",
        nullable=False,
        comment="Role: super_admin, satinalma_direktoru, satinalma_yoneticisi, satinalma_uzmani, satinalmaci",
    )
    approval_limit: Mapped[int] = mapped_column(
        Integer, default=100000, nullable=False, comment="Onay limitini TL cinsinden"
    )
    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id"), nullable=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    department: Mapped["Department"] = relationship(back_populates="users")
    companies: Mapped[list["Company"]] = relationship(
        secondary=user_company, back_populates="users"
    )
    user_departments: Mapped[list["Department"]] = relationship(
        secondary=user_department, back_populates="personnel_users"
    )
    projects: Mapped[list["Project"]] = relationship(
        secondary="user_projects", back_populates="personnel"
    )
    # Company-Role assignments (which roles in which companies)
    company_roles: Mapped[list["CompanyRole"]] = relationship(
        "CompanyRole", back_populates="user", cascade="all, delete-orphan"
    )
    # Project-based permissions
    project_permissions: Mapped[list["ProjectPermission"]] = relationship(
        "ProjectPermission",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys="ProjectPermission.user_id",
    )
