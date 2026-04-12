# api\models\__init__.py
from .associations import (
    user_company,
    user_department,
    company_department,
    user_managers,
    user_company_roles,
    user_project_permissions,
)
from .user import User
from .quote import Quote, QuoteItem, QuoteStatus
from .quote_status_log import QuoteStatusLog
from .quote_approval import QuoteApproval
from .supplier import (
    Supplier,
    SupplierUser,
    SupplierQuote,
    SupplierQuoteItem,
    ProjectSupplier,
)
from .department import Department
from .project import Project
from .project_file import ProjectFile
from .company import Company
from .role import Role, Permission
from .assignment import CompanyRole, ProjectPermission
from .settings import SystemSettings
from .email_settings import EmailSettings
from .api_key import APIKey
from .logging_settings import LoggingSettings
from .notification_settings import NotificationSettings
from .backup_settings import BackupSettings

__all__ = [
    "User",
    "Quote",
    "QuoteItem",
    "QuoteStatus",
    "QuoteStatusLog",
    "QuoteApproval",
    "Supplier",
    "SupplierUser",
    "SupplierQuote",
    "SupplierQuoteItem",
    "ProjectSupplier",
    "Department",
    "Project",
    "ProjectFile",
    "Company",
    "Role",
    "Permission",
    "CompanyRole",
    "ProjectPermission",
    "SystemSettings",
    "EmailSettings",
    "APIKey",
    "LoggingSettings",
    "NotificationSettings",
    "BackupSettings",
    "user_company",
    "user_department",
    "company_department",
    "user_managers",
    "user_company_roles",
    "user_project_permissions",
]
