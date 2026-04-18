# routers/admin.py
import os
import uuid
import json
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import delete, func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import Any

from api.core.deps import get_db, get_current_user
from api.core.authz import (
    ADMIN_MANAGED_SYSTEM_ROLES,
    LEGACY_ADMIN_ROLES,
    can_access_admin_surface,
    can_manage_role_catalog,
    can_access_quote_workspace,
    can_create_project,
    can_manage_tenant_governance,
    can_read_admin_catalog,
    can_view_all_projects,
    get_business_role_priority,
    is_admin_managed_account,
    is_platform_staff,
    is_reserved_workspace_role,
    is_super_admin,
    is_tenant_admin,
    normalized_role,
    normalized_system_role,
    resolve_requested_user_system_role,
)
from api.core.security import get_password_hash, verify_password
from api.models import (
    Department,
    Project,
    Supplier,
    SupplierQuote,
    User,
    Company,
    ProjectFile,
    Role,
    Permission,
    ProjectPermission,
    Quote,
    QuoteApproval,
    QuoteStatusLog,
    UserPermissionOverride,
    RolePermissionDelegation,
    user_company,
    user_department,
    user_managers,
    user_company_roles,
    user_project_permissions,
)
from api.models.assignment import CompanyRole
from api.models.api_key import APIKey
from api.models.project import user_projects
from api.models.project_file import ProjectFile
from api.models.refresh_token import RefreshToken
from api.models.report import QuoteComparison, SupplierRating, PriceAnalysis, Contract
from api.schemas.assignment import (
    CompanyAssignmentCreate,
    CompanyAssignmentUpdate,
    CompanyAssignmentOut,
)
from api.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentOut
from api.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut, ProjectFileOut
from api.schemas.user import UserCreate, UserUpdate, UserOut
from api.schemas.company import CompanyCreate, CompanyUpdate, CompanyOut
from api.schemas.role import RoleCreate, RoleUpdate, RoleOut
from api.schemas.permission import PermissionOut
from api.schemas.permission_override import (
    PermissionCatalogNode,
    RolePermissionDelegationBulkUpdate,
    RolePermissionDelegationOut,
    UserPermissionOverrideBulkUpdate,
    UserPermissionOverrideOut,
)
from api.core.permission_matrix import build_matrix_response
from api.schemas.subscription import SubscriptionCatalogSnapshotOut
from api.schemas.tenant import (
    TenantCreate,
    TenantUpdate,
    TenantOut,
    TenantSupportWorkflowUpdate,
)
from api.services.file_service import FileUploadService
from api.services.subscription_service import (
    build_subscription_catalog_snapshot,
    enforce_active_internal_user_limit,
    enforce_active_project_limit,
    validate_subscription_plan_code,
)
from api.services.billing_service import ensure_tenant_subscription_for_plan
from api.services.user_department_service import resolve_effective_department_id
from api.services.email_service import get_email_service
from api.models.tenant import Tenant, TenantSettings
from api.models.settings import SystemSettings
from api.services.public_pricing_service import (
    default_public_pricing_config,
    ensure_public_pricing_json,
    parse_public_pricing_config,
    serialize_public_pricing_config,
)

router = APIRouter(prefix="/admin", tags=["admin"])

CRITICAL_PERMISSION_KEYS = {
    "admin_surface",
    "admin_surface.user_create",
    "admin_surface.user_edit",
    "admin_surface.user_disable",
    "admin_surface.user_delete",
    "manage_users",
    "tenant_governance_write",
    "tenant_governance_write.detail_edit",
    "support_workflow",
    "shared_email",
}

PERMISSION_CATALOG_TREE = [
    {
        "key": "workspace_home",
        "label": "Yonetim Ana Sayfasi",
        "description": "Yonetim ozet kartlari ve genel operasyon panelleri.",
        "children": [
            {
                "key": "workspace_home.kpi_cards",
                "label": "KPI Kartlari",
                "description": "Ana KPI kartlarini goruntuleme.",
            },
            {
                "key": "workspace_home.operation_feed",
                "label": "Operasyon Akisi",
                "description": "Son operasyon hareketlerini goruntuleme.",
            },
        ],
    },
    {
        "key": "admin_surface",
        "label": "Yonetim Alani",
        "description": "Kullanici, departman ve yonetim ekranlarina erisim.",
        "children": [
            {
                "key": "admin_surface.user_view",
                "label": "Personel Listeleme",
                "description": "Personel listesi ve detaylarini goruntuleme.",
            },
            {
                "key": "admin_surface.user_create",
                "label": "Personel Olusturma",
                "description": "Yeni personel kaydi acma.",
            },
            {
                "key": "admin_surface.user_edit",
                "label": "Personel Duzenleme",
                "description": "Var olan personel kayitlarini guncelleme.",
            },
            {
                "key": "admin_surface.user_disable",
                "label": "Personel Pasife Alma",
                "description": "Personel kaydini pasif duruma cekme.",
            },
            {
                "key": "admin_surface.user_delete",
                "label": "Personel Silme",
                "description": "Pasif personel kaydini kaldirma.",
            },
        ],
    },
    {
        "key": "manage_users",
        "label": "Kullanici Yonetimi",
        "description": "Rol atama ve kullanici yonetim aksiyonlari.",
        "children": [],
    },
    {
        "key": "quote_workspace",
        "label": "Teklif Calisma Alani",
        "description": "Teklif surecleri ve satin alma operasyonlari.",
        "children": [
            {
                "key": "quote_workspace.list",
                "label": "Teklif Listeleme",
                "description": "Teklif listesi ve durumlarini goruntuleme.",
            },
            {
                "key": "quote_workspace.create",
                "label": "Teklif Olusturma",
                "description": "Yeni teklif olusturma.",
            },
            {
                "key": "quote_workspace.edit",
                "label": "Teklif Duzenleme",
                "description": "Mevcut teklif kaydini duzenleme.",
            },
            {
                "key": "quote_workspace.submit_approval",
                "label": "Onaya Gonderme",
                "description": "Teklifi onay surecine gonderme.",
            },
            {
                "key": "quote_workspace.comparison",
                "label": "Teklif Karsilastirma",
                "description": "Teklifleri karsilastirma ekranina erisim.",
            },
        ],
    },
    {
        "key": "approval_review",
        "label": "Onay Inceleme",
        "description": "Onay bekleyen kayitlari inceleme.",
        "children": [],
    },
    {
        "key": "tenant_governance_read",
        "label": "Stratejik Partner Yonetimi (Okuma)",
        "description": "Stratejik partner yonetim kayitlarini goruntuleme.",
        "children": [
            {
                "key": "tenant_governance_read.list",
                "label": "Liste",
                "description": "Stratejik partner listesi ve ozetini goruntuleme.",
            },
            {
                "key": "tenant_governance_read.detail",
                "label": "Detay",
                "description": "Stratejik partner detayini goruntuleme.",
            },
        ],
    },
    {
        "key": "tenant_governance_write",
        "label": "Stratejik Partner Yonetimi (Yazma)",
        "description": "Stratejik partner yonetim kayitlarini guncelleme.",
        "children": [
            {
                "key": "tenant_governance_write.detail_edit",
                "label": "Detay Duzenleme",
                "description": "Stratejik partner detay alanlarini duzenleme.",
            },
        ],
    },
    {
        "key": "support_workflow",
        "label": "Destek Akisi Guncelleme",
        "description": "Destek workflow alanlarina erisim.",
        "children": [],
    },
    {
        "key": "tenant_identity",
        "label": "Stratejik Partner Kimlik Ayarlari",
        "description": "Stratejik partner marka ve kimlik ayarlari.",
        "children": [],
    },
    {
        "key": "shared_email",
        "label": "Ortak E-Posta Profilleri",
        "description": "Platform SMTP/profil yonetimi.",
        "children": [],
    },
]


def _flatten_permission_catalog_keys() -> set[str]:
    keys: set[str] = set()
    for item in PERMISSION_CATALOG_TREE:
        keys.add(item["key"])
        for child in item.get("children", []):
            keys.add(child["key"])
    return keys


def _can_delegate_permission_key(
    db: Session,
    current_user: User,
    permission_key: str,
) -> bool:
    if is_super_admin(current_user):
        return True

    normalized_key = (permission_key or "").strip().lower()
    if not normalized_key:
        return False

    if normalized_key in CRITICAL_PERMISSION_KEYS:
        return False

    existing_rules = (
        db.query(RolePermissionDelegation)
        .filter(RolePermissionDelegation.permission_key == normalized_key)
        .all()
    )

    if existing_rules:
        current_system_role = normalized_system_role(current_user)
        current_business_role = normalized_role(current_user)
        for rule in existing_rules:
            role_match = rule.system_role and rule.system_role == current_system_role
            business_match = (
                rule.business_role and rule.business_role == current_business_role
            )
            if (role_match or business_match) and rule.can_delegate:
                return True
        return False

    return is_tenant_admin(current_user)


def _validate_permission_override_scope(
    db: Session,
    current_user: User,
    target_user: User,
    items: list,
) -> None:
    if is_super_admin(current_user):
        return

    if is_admin_managed_account(target_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Yonetici kullanicilarin kisiye ozel izinleri yalnizca super admin tarafindan duzenlenebilir",
        )

    for item in items:
        if not _can_delegate_permission_key(db, current_user, item.permission_key):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Bu izin anahtari icin delege yetkiniz yok: {item.permission_key}",
            )


def _slugify_tenant(value: str) -> str:
    normalized = value.strip().lower()
    normalized = normalized.replace("ı", "i").replace("ğ", "g").replace("ü", "u")
    normalized = normalized.replace("ş", "s").replace("ö", "o").replace("ç", "c")
    normalized = "-".join(
        part
        for part in "".join(ch if ch.isalnum() else "-" for ch in normalized).split("-")
        if part
    )
    return normalized or "tenant"


def _ensure_unique_tenant_slug(
    db: Session, slug: str, current_id: int | None = None
) -> str:
    candidate = slug
    counter = 2
    while True:
        existing = db.query(Tenant).filter(Tenant.slug == candidate).first()
        if not existing or existing.id == current_id:
            return candidate
        candidate = f"{slug}-{counter}"
        counter += 1


def _serialize_tenant(
    db: Session, tenant: Tenant, *, initial_admin_email_sent: bool = False
) -> TenantOut:
    owner = None
    if tenant.owner_user_id:
        owner = db.query(User).filter(User.id == tenant.owner_user_id).first()

    return TenantOut.model_validate(tenant, from_attributes=True).model_copy(
        update={
            "owner_email": getattr(owner, "email", None),
            "owner_full_name": getattr(owner, "full_name", None),
            "initial_admin_email_sent": initial_admin_email_sent,
        }
    )


def _ensure_tenant_owner_candidate(
    db: Session, tenant: Tenant, owner_user_id: int | None
) -> None:
    if owner_user_id is None:
        return

    owner = db.query(User).filter(User.id == owner_user_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Tenant owner adayi bulunamadi")
    if owner.tenant_id != tenant.id:
        raise HTTPException(
            status_code=400, detail="Tenant owner adayi ayni tenant icinde olmali"
        )

    if not is_admin_managed_account(owner):
        raise HTTPException(
            status_code=400,
            detail="Tenant owner yalnizca tenant admin kullanicilardan secilebilir",
        )


# Helper to check if user can manage tenant governance
def require_tenant_governance_manager(current_user: User = Depends(get_current_user)):
    if not can_manage_tenant_governance(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece super admin bu işlemi yapabilir",
        )
    return current_user


def require_tenant_governance_reader(current_user: User = Depends(get_current_user)):
    if not (is_super_admin(current_user) or is_platform_staff(current_user)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece super admin veya platform personeli bu işlemi yapabilir",
        )
    return current_user


def require_admin_user(current_user: User = Depends(get_current_user)):
    if not can_access_admin_surface(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin yetkisi gerekli",
        )
    return current_user


def require_org_catalog_user(current_user: User = Depends(get_current_user)):
    if not can_access_quote_workspace(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu katalog için yetkiniz yok",
        )
    return current_user


def require_project_workspace_user(current_user: User = Depends(get_current_user)):
    if not can_access_quote_workspace(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu proje yuzeyi icin yetkiniz yok",
        )
    return current_user


def require_admin_catalog_reader(current_user: User = Depends(get_current_user)):
    if not can_read_admin_catalog(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu katalog için yetkiniz yok",
        )
    return current_user


def require_role_management_user(current_user: User = Depends(get_current_user)):
    if not can_manage_role_catalog(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Rol yonetimi icin yonetici yetkisi gerekir",
        )
    return current_user


def _is_super_admin_account(user: User) -> bool:
    return normalized_system_role(user) == "super_admin"


def _count_other_visible_super_admins(db: Session, excluded_user_id: int) -> int:
    return (
        db.query(User)
        .filter(
            or_(User.system_role == "super_admin", User.role == "super_admin"),
            User.hidden_from_admin.is_(False),
            User.id != excluded_user_id,
        )
        .count()
    )


def _is_scoped_admin(current_user: User) -> bool:
    return is_tenant_admin(current_user) and not is_super_admin(current_user)


def _restrict_roles_query_for_role_management(query: Any, current_user: User):
    if is_super_admin(current_user):
        return query

    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None:
        return query.filter(Role.tenant_id == tenant_id)

    return query.filter(Role.created_by_id == current_user.id)


def _ensure_manageable_role_level(current_user: User, role: Role):
    if is_super_admin(current_user):
        return

    actor_priority = get_business_role_priority(current_user)
    if role.hierarchy_level <= actor_priority:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Yalnizca alt roldeki roller duzenlenebilir",
        )


def _ensure_manageable_new_role_level(
    current_user: User,
    parent_role: Role | None,
):
    if is_super_admin(current_user):
        return

    actor_priority = get_business_role_priority(current_user)
    new_role_level = (parent_role.hierarchy_level + 1) if parent_role else 0
    if new_role_level <= actor_priority:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Yalnizca kendi alt seviyenize yeni rol olusturabilirsiniz",
        )


def _current_tenant_id(current_user: User) -> int | None:
    return getattr(current_user, "tenant_id", None)


def _current_tenant(db: Session, current_user: User) -> Tenant | None:
    tenant_id = _current_tenant_id(current_user)
    if tenant_id is None:
        return None
    return db.query(Tenant).filter(Tenant.id == tenant_id).first()


def _require_workspace_tenant_scope(current_user: User, *, detail: str) -> None:
    if _current_tenant_id(current_user) is not None or is_super_admin(current_user):
        return

    if normalized_system_role(current_user) in {
        "tenant_owner",
        "tenant_admin",
        "tenant_member",
    }:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


def _restrict_companies_query_for_admin(query: Any, current_user: User):
    if _is_scoped_admin(current_user):
        if _current_tenant_id(current_user) is not None:
            return query.filter(Company.tenant_id == _current_tenant_id(current_user))
        return query.filter(Company.created_by_id == current_user.id)
    return query


def _restrict_users_query_for_admin(query: Any, current_user: User):
    if _is_scoped_admin(current_user):
        tenant_id = _current_tenant_id(current_user)
        query = _exclude_admin_managed_users(query)
        if tenant_id is not None:
            return query.filter(User.tenant_id == tenant_id)
        return query.filter(User.created_by_id == current_user.id)
    return query


def _restrict_users_query_for_workspace(query: Any, current_user: User):
    if can_read_admin_catalog(current_user):
        return _restrict_users_query_for_admin(query, current_user)

    tenant_id = _current_tenant_id(current_user)
    query = _exclude_admin_managed_users(query)
    if tenant_id is not None:
        return query.filter(User.tenant_id == tenant_id)
    return query.filter(User.id == current_user.id)


def _restrict_project_query_for_admin(query: Any, current_user: User):
    if _is_scoped_admin(current_user):
        if _current_tenant_id(current_user) is not None:
            return query.filter(Project.tenant_id == _current_tenant_id(current_user))
        return query.filter(Project.created_by_id == current_user.id)
    return query


def _restrict_departments_query_for_admin(query: Any, current_user: User):
    if _is_scoped_admin(current_user):
        if _current_tenant_id(current_user) is not None:
            return query.filter(
                Department.tenant_id == _current_tenant_id(current_user)
            )
        return query.filter(Department.created_by_id == current_user.id)
    return query


def _restrict_departments_query_for_workspace(query: Any, current_user: User):
    if can_read_admin_catalog(current_user):
        return _restrict_departments_query_for_admin(query, current_user)

    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None:
        return query.filter(Department.tenant_id == tenant_id)
    return query.filter(Department.id == getattr(current_user, "department_id", None))


def _restrict_roles_query_for_admin(query: Any, current_user: User):
    if _is_scoped_admin(current_user):
        if _current_tenant_id(current_user) is not None:
            return query.filter(Role.tenant_id == _current_tenant_id(current_user))
        return query.filter(Role.created_by_id == current_user.id)
    return query


def _exclude_admin_managed_users(query: Any):
    return query.filter(
        or_(
            User.system_role.is_(None),
            User.system_role.notin_(tuple(ADMIN_MANAGED_SYSTEM_ROLES)),
        ),
        User.role.notin_(tuple(LEGACY_ADMIN_ROLES)),
    )


def _ensure_department_scope(
    db: Session, current_user: User, department_id: int | None
):
    if not _is_scoped_admin(current_user) or department_id is None:
        return
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=403, detail="Bu departman üzerinde yetkiniz yok"
        )
    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None and department.tenant_id != tenant_id:
        raise HTTPException(
            status_code=403, detail="Bu departman üzerinde yetkiniz yok"
        )
    if tenant_id is None and department.created_by_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Bu departman üzerinde yetkiniz yok"
        )


def _ensure_role_scope(db: Session, current_user: User, role_id: int | None):
    if is_super_admin(current_user) or role_id is None:
        return
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=403, detail="Bu rol üzerinde yetkiniz yok")
    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None and role.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Bu rol üzerinde yetkiniz yok")
    if tenant_id is None and role.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu rol üzerinde yetkiniz yok")


def _ensure_manageable_user_role(current_user: User, requested_role: str | None):
    if _is_scoped_admin(current_user) and is_reserved_workspace_role(requested_role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tenant admin, admin veya super admin hesabi olusturamaz ya da guncelleyemez.",
        )


def _ensure_company_scope(db: Session, current_user: User, company_id: int | None):
    if not _is_scoped_admin(current_user) or company_id is None:
        return
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=403, detail="Bu firma üzerinde yetkiniz yok")
    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None and company.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Bu firma üzerinde yetkiniz yok")
    if tenant_id is None and company.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu firma üzerinde yetkiniz yok")


def _ensure_company_assignment_tenant_consistency(
    user: User,
    company: Company,
    role: Role,
    department: Department | None = None,
):
    tenant_ids = {
        tenant_id
        for tenant_id in [
            user.tenant_id,
            company.tenant_id,
            role.tenant_id,
            department.tenant_id if department else None,
        ]
        if tenant_id is not None
    }
    if len(tenant_ids) > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Firma atamasindaki kullanici, firma, rol ve departman ayni tenant kapsaminda olmalidir",
        )


def _ensure_user_scope(user: User, current_user: User):
    if _is_scoped_admin(current_user):
        tenant_id = _current_tenant_id(current_user)
        if tenant_id is not None and user.tenant_id != tenant_id:
            raise HTTPException(
                status_code=403, detail="Bu personel üzerinde yetkiniz yok"
            )
        if tenant_id is None and user.created_by_id != current_user.id:
            raise HTTPException(
                status_code=403, detail="Bu personel üzerinde yetkiniz yok"
            )
    if _is_scoped_admin(current_user) and is_admin_managed_account(user):
        raise HTTPException(
            status_code=403,
            detail="Tenant admin bu hesabi personel akisindan yonetemez",
        )


def _ensure_project_scope(project: Project, current_user: User):
    if not _is_scoped_admin(current_user):
        return

    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None and project.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Bu proje üzerinde yetkiniz yok")
    if tenant_id is None and project.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu proje üzerinde yetkiniz yok")


def _can_create_project(current_user: User) -> bool:
    return can_create_project(current_user)


def _can_view_all_projects(current_user: User) -> bool:
    return can_view_all_projects(current_user)


def _ensure_project_member_or_global(project: Project, current_user: User) -> None:
    if _can_view_all_projects(current_user):
        return
    if any(p.id == project.id for p in current_user.projects):
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Bu projede işlem yapma yetkiniz yok",
    )


def _resolve_project_responsible_users(
    db: Session,
    current_user: User,
    responsible_user_ids: list[int] | None,
) -> list[User]:
    if not responsible_user_ids:
        return []

    requested_ids = {int(user_id) for user_id in responsible_user_ids}
    users_query = db.query(User).filter(User.id.in_(requested_ids), User.is_active)
    current_tenant_id = _current_tenant_id(current_user)
    if current_tenant_id is not None:
        users_query = users_query.filter(User.tenant_id == current_tenant_id)

    users = users_query.all()
    resolved_ids = {user.id for user in users}
    if resolved_ids != requested_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proje sorumlulari ayni tenant kapsaminda aktif kullanicilar olmalidir",
        )

    return users


def _ensure_unique_project_code(
    db: Session,
    current_user: User,
    code: str,
    *,
    excluded_project_id: int | None = None,
) -> None:
    existing_query = db.query(Project).filter(Project.code == code)
    tenant_id = _current_tenant_id(current_user)
    if tenant_id is not None:
        existing_query = existing_query.filter(Project.tenant_id == tenant_id)
    if excluded_project_id is not None:
        existing_query = existing_query.filter(Project.id != excluded_project_id)
    if existing_query.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu proje kodu bu tenant icinde zaten mevcut",
        )


# ==================== COMPANY ENDPOINTS ====================


@router.get("/tenants", response_model=list[TenantOut])
async def list_tenants(
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_reader),
):
    tenants = (
        db.query(Tenant).order_by(Tenant.created_at.desc(), Tenant.id.desc()).all()
    )
    return [_serialize_tenant(db, tenant) for tenant in tenants]


@router.get("/subscription-catalog", response_model=SubscriptionCatalogSnapshotOut)
async def get_subscription_catalog(
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_manager),
):
    return build_subscription_catalog_snapshot(db)


@router.get("/onboarding-studio/summary")
async def get_onboarding_studio_summary(
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_reader),
):
    tenant_rows = db.query(Tenant).all()
    onboarding_queue_count = sum(
        1
        for tenant in tenant_rows
        if str(tenant.onboarding_status or "").lower() != "active"
    )
    owner_pending_count = sum(1 for tenant in tenant_rows if not tenant.owner_user_id)
    branding_pending_count = sum(
        1 for tenant in tenant_rows if not tenant.brand_name or not tenant.logo_url
    )

    quotes_missing_tenant = (
        db.query(func.count(Quote.id)).filter(Quote.tenant_id.is_(None)).scalar() or 0
    )
    approvals_missing_tenant = (
        db.query(func.count(QuoteApproval.id))
        .filter(QuoteApproval.tenant_id.is_(None))
        .scalar()
        or 0
    )
    quotes_project_tenant_mismatch = (
        db.query(func.count(Quote.id))
        .join(Project, Project.id == Quote.project_id)
        .filter(
            Quote.tenant_id.is_not(None),
            Project.tenant_id.is_not(None),
            Quote.tenant_id != Project.tenant_id,
        )
        .scalar()
        or 0
    )
    supplier_private_count = (
        db.query(func.count(Supplier.id))
        .filter(Supplier.tenant_id.is_not(None))
        .scalar()
        or 0
    )
    supplier_platform_network_count = (
        db.query(func.count(Supplier.id)).filter(Supplier.tenant_id.is_(None)).scalar()
        or 0
    )
    supplier_quote_scope_mismatch = (
        db.query(func.count(SupplierQuote.id))
        .join(Quote, Quote.id == SupplierQuote.quote_id)
        .join(Supplier, Supplier.id == SupplierQuote.supplier_id)
        .filter(
            Quote.tenant_id.is_not(None),
            Supplier.tenant_id.is_not(None),
            Quote.tenant_id != Supplier.tenant_id,
        )
        .scalar()
        or 0
    )
    approvals_quote_tenant_mismatch = (
        db.query(func.count(QuoteApproval.id))
        .join(Quote, Quote.id == QuoteApproval.quote_id)
        .filter(
            QuoteApproval.tenant_id.is_not(None),
            Quote.tenant_id.is_not(None),
            QuoteApproval.tenant_id != Quote.tenant_id,
        )
        .scalar()
        or 0
    )
    supplier_quotes_platform_network_count = (
        db.query(func.count(SupplierQuote.id))
        .join(Supplier, Supplier.id == SupplierQuote.supplier_id)
        .filter(Supplier.tenant_id.is_(None))
        .scalar()
        or 0
    )

    return {
        "tenant_count": len(tenant_rows),
        "onboarding_queue_count": onboarding_queue_count,
        "owner_pending_count": owner_pending_count,
        "branding_pending_count": branding_pending_count,
        "rfq_readiness": {
            "quotes_missing_tenant": quotes_missing_tenant,
            "approvals_quote_tenant_mismatch": approvals_quote_tenant_mismatch,
            "approvals_missing_tenant": approvals_missing_tenant,
            "quotes_project_tenant_mismatch": quotes_project_tenant_mismatch,
            "supplier_quote_scope_mismatch": supplier_quote_scope_mismatch,
            "supplier_quotes_platform_network_count": supplier_quotes_platform_network_count,
            "transition_ready": (
                quotes_missing_tenant == 0
                and approvals_missing_tenant == 0
                and approvals_quote_tenant_mismatch == 0
                and quotes_project_tenant_mismatch == 0
                and supplier_quote_scope_mismatch == 0
            ),
        },
        "supplier_mix": {
            "private_count": supplier_private_count,
            "platform_network_count": supplier_platform_network_count,
        },
    }


@router.post("/tenants", response_model=TenantOut)
async def create_tenant(
    payload: TenantCreate,
    db: Session = Depends(get_db),
    email_service=Depends(get_email_service),
    current_user: User = Depends(require_tenant_governance_manager),
):
    try:
        subscription_plan_code = validate_subscription_plan_code(
            payload.subscription_plan_code
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    initial_admin_user: User | None = None
    initial_admin_email_sent = False

    if payload.initial_admin:
        existing_user = (
            db.query(User).filter(User.email == payload.initial_admin.email).first()
        )
        if existing_user and not existing_user.hidden_from_admin:
            raise HTTPException(
                status_code=400, detail="Ilk tenant admin e-postasi zaten kayitli"
            )

    slug = _ensure_unique_tenant_slug(
        db, _slugify_tenant(payload.slug or payload.brand_name or payload.legal_name)
    )
    tenant = Tenant(
        slug=slug,
        legal_name=payload.legal_name,
        brand_name=payload.brand_name,
        logo_url=payload.logo_url,
        tax_number=payload.tax_number,
        tax_office=payload.tax_office,
        country=payload.country,
        city=payload.city,
        address=payload.address,
        subscription_plan_code=subscription_plan_code,
        owner_user_id=payload.owner_user_id,
        status=payload.status,
        onboarding_status=payload.onboarding_status,
        is_active=payload.is_active,
    )
    db.add(tenant)
    db.flush()
    ensure_tenant_subscription_for_plan(
        db,
        tenant,
        subscription_plan_code=subscription_plan_code,
        status_value="active" if payload.is_active else "paused",
    )
    db.add(
        TenantSettings(
            tenant_id=tenant.id,
            smtp_mode="platform_default",
            locale="tr-TR",
            timezone="Europe/Istanbul",
            is_active=True,
        )
    )

    if payload.initial_admin:
        placeholder_password = secrets.token_urlsafe(24)
        invitation_token = secrets.token_urlsafe(32)
        invitation_expires = datetime.now(timezone.utc) + timedelta(hours=24)
        initial_admin_user = User(
            email=payload.initial_admin.email,
            full_name=payload.initial_admin.full_name,
            hashed_password=get_password_hash(placeholder_password),
            role="admin",
            system_role="tenant_admin",
            approval_limit=300000,
            personal_phone=payload.initial_admin.personal_phone,
            company_phone=payload.initial_admin.company_phone,
            company_phone_short=payload.initial_admin.company_phone_short,
            is_active=True,
            hidden_from_admin=False,
            deleted_original_email=None,
            tenant_id=tenant.id,
            created_by_id=current_user.id,
            invitation_token=invitation_token,
            invitation_token_expires=invitation_expires,
            invitation_accepted=False,
        )
        db.add(initial_admin_user)
        db.flush()
        tenant.owner_user_id = initial_admin_user.id

    db.commit()
    db.refresh(tenant)
    if initial_admin_user is not None:
        db.refresh(initial_admin_user)
        try:
            initial_admin_email_sent = email_service.send_internal_user_invitation(
                to_email=initial_admin_user.email,
                full_name=initial_admin_user.full_name,
                activation_token=initial_admin_user.invitation_token,
                company_name=tenant.brand_name or tenant.legal_name,
                owner_user_id=None,
            )
        except Exception:
            initial_admin_email_sent = False
    return _serialize_tenant(
        db, tenant, initial_admin_email_sent=initial_admin_email_sent
    )


@router.put("/tenants/{tenant_id}", response_model=TenantOut)
async def update_tenant(
    tenant_id: int,
    payload: TenantUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_manager),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant bulunamadi")

    update_data = payload.model_dump(exclude_unset=True)
    if "subscription_plan_code" in update_data:
        try:
            update_data["subscription_plan_code"] = validate_subscription_plan_code(
                update_data.get("subscription_plan_code")
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
    if "owner_user_id" in update_data:
        _ensure_tenant_owner_candidate(db, tenant, update_data["owner_user_id"])
    if "slug" in update_data and update_data["slug"]:
        update_data["slug"] = _ensure_unique_tenant_slug(
            db, _slugify_tenant(str(update_data["slug"])), tenant.id
        )
    elif any(key in update_data for key in {"brand_name", "legal_name"}):
        base_name = str(
            update_data.get("brand_name")
            or update_data.get("legal_name")
            or tenant.brand_name
            or tenant.legal_name
        )
        update_data["slug"] = _ensure_unique_tenant_slug(
            db, _slugify_tenant(base_name), tenant.id
        )

    for key, value in update_data.items():
        setattr(tenant, key, value)

    ensure_tenant_subscription_for_plan(
        db,
        tenant,
        subscription_plan_code=tenant.subscription_plan_code or "starter",
        status_value="active" if tenant.is_active else "paused",
    )

    db.commit()
    db.refresh(tenant)
    return _serialize_tenant(db, tenant)


@router.patch("/tenants/{tenant_id}/support-workflow", response_model=TenantOut)
async def update_tenant_support_workflow(
    tenant_id: int,
    payload: TenantSupportWorkflowUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_reader),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant bulunamadi")

    update_data = payload.model_dump(exclude_unset=True)
    next_status = (
        str(update_data.get("support_status") or tenant.support_status or "new")
        .strip()
        .lower()
    )
    resolution_reason = str(
        update_data.get("support_resolution_reason")
        or tenant.support_resolution_reason
        or ""
    ).strip()
    if next_status == "resolved" and not resolution_reason:
        raise HTTPException(
            status_code=400,
            detail="Cozulen destek kaydi icin kapanis nedeni zorunludur",
        )
    if next_status != "resolved" and "support_resolution_reason" not in update_data:
        update_data["support_resolution_reason"] = None

    for key, value in update_data.items():
        setattr(tenant, key, value)

    db.commit()
    db.refresh(tenant)
    return _serialize_tenant(db, tenant)


@router.get("/companies", response_model=list[CompanyOut])
async def list_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_catalog_reader),
):
    """Tüm firmaları listele"""
    query = db.query(Company).filter(Company.is_active)
    query = _restrict_companies_query_for_admin(query, current_user)
    return query.all()


@router.post("/companies", response_model=CompanyOut)
async def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Yeni firma ekle"""
    existing_query = db.query(Company).filter(Company.name == company.name)
    existing_query = _restrict_companies_query_for_admin(existing_query, current_user)
    existing = existing_query.first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu firma zaten mevcut"
        )

    new_company = Company(
        **company.model_dump(),
        created_by_id=current_user.id,
        tenant_id=_current_tenant_id(current_user),
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company


@router.put("/companies/{company_id}", response_model=CompanyOut)
async def update_company(
    company_id: int,
    company: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Firma bilgilerini güncelle"""
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Firma bulunamadı"
        )

    _ensure_company_scope(db, current_user, company_id)

    update_data = company.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"] != db_company.name:
        existing_query = db.query(Company).filter(
            Company.name == str(update_data["name"])
        )
        existing_query = _restrict_companies_query_for_admin(
            existing_query, current_user
        )
        existing_query = existing_query.filter(Company.id != company_id)
        existing = existing_query.first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Bu firma zaten mevcut"
            )
    for key, value in update_data.items():
        setattr(db_company, key, value)

    db.commit()
    db.refresh(db_company)
    return db_company


@router.post("/companies/{company_id}/logo", response_model=dict)
async def upload_company_logo(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Firma logosu yükle (dosya)"""
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Firma bulunamadı")
    _ensure_company_scope(db, current_user, company_id)

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
    }
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Sadece resim dosyaları yüklenebilir (JPEG, PNG, GIF, WebP, SVG)",
        )

    content = await file.read()
    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Logo dosyası 2MB'dan büyük olamaz")

    upload_dir = os.path.join("uploads", "company_logos")
    os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "logo.png")[1].lower() or ".png"
    filename = f"company_{company_id}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(upload_dir, filename)

    if db_company.logo_url:
        old_file = os.path.basename(str(db_company.logo_url))
        old_path = os.path.join(upload_dir, old_file)
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception:
                pass

    with open(file_path, "wb") as f:
        f.write(content)

    logo_url = f"/api/v1/admin/company-logo/{filename}"
    db_company.logo_url = logo_url
    db.commit()
    db.refresh(db_company)
    return {"status": "success", "logo_url": logo_url}


@router.get("/company-logo/{filename}")
async def get_company_logo(filename: str):
    """Firma logosunu sun"""
    safe_name = os.path.basename(filename)
    file_path = os.path.join("uploads", "company_logos", safe_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Logo bulunamadı")
    return FileResponse(file_path)


@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Firma sil"""
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Firma bulunamadı"
        )

    _ensure_company_scope(db, current_user, company_id)

    db.delete(db_company)
    db.commit()
    return {"message": "Firma başarıyla silindi"}


# ==================== DEPARTMENT ENDPOINTS ====================


@router.get("/departments", response_model=list[DepartmentOut])
async def list_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_org_catalog_user),
    is_active: bool | None = None,
):
    """Tüm departmanları veya filtreli listele"""
    query = db.query(Department)
    query = _restrict_departments_query_for_workspace(query, current_user)
    if is_active is not None:
        query = query.filter(Department.is_active == is_active)
    return query.all()


@router.post("/departments", response_model=DepartmentOut)
async def create_department(
    dept: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Yeni departman ekle"""
    existing_query = db.query(Department).filter(Department.name == dept.name)
    existing_query = _restrict_departments_query_for_admin(existing_query, current_user)
    existing = existing_query.first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu departman zaten mevcut"
        )

    new_dept = Department(
        **dept.model_dump(),
        created_by_id=None if is_super_admin(current_user) else current_user.id,
        tenant_id=_current_tenant_id(current_user),
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept


@router.put("/departments/{dept_id}", response_model=DepartmentOut)
async def update_department(
    dept_id: int,
    dept_data: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Departman güncelle"""
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Departman bulunamadı")
    _ensure_department_scope(db, current_user, dept_id)

    update_data = dept_data.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"] != dept.name:
        existing_query = db.query(Department).filter(
            Department.name == str(update_data["name"])
        )
        existing_query = _restrict_departments_query_for_admin(
            existing_query, current_user
        )
        existing_query = existing_query.filter(Department.id != dept_id)
        existing = existing_query.first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu departman zaten mevcut",
            )
    for field, value in update_data.items():
        setattr(dept, field, value)

    db.commit()
    db.refresh(dept)
    return dept


@router.delete("/departments/{dept_id}")
async def delete_department(
    dept_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Departman sil"""
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Departman bulunamadı")
    _ensure_department_scope(db, current_user, dept_id)

    # Check if department has users
    users_count = db.query(User).filter(User.department_id == dept_id).count()
    if users_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bu departmanda {users_count} personel var. Önce onları başka departmana taşıyın",
        )

    try:
        db.delete(dept)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Departman silinirken hata oluştu: {str(e)}"
        )
    return {"message": "Departman silindi"}


# ==================== ROLE ENDPOINTS ====================


@router.get("/roles", response_model=list[RoleOut])
async def list_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role_management_user),
):
    """Tüm rolleri listele"""
    query = db.query(Role).filter(Role.is_active)
    query = _restrict_roles_query_for_role_management(query, current_user)
    return query.all()


@router.post("/roles", response_model=RoleOut)
async def create_role(
    role_data: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role_management_user),
):
    """Yeni rol ekle"""
    if not is_super_admin(current_user) and is_reserved_workspace_role(role_data.name):
        raise HTTPException(
            status_code=400,
            detail="Admin ve super admin rolleri tenant bazinda olusturulamaz",
        )

    existing_query = db.query(Role).filter(Role.name == role_data.name)
    existing_query = _restrict_roles_query_for_role_management(
        existing_query, current_user
    )
    existing = existing_query.first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu rol zaten mevcut"
        )

    # Calculate hierarchy level based on parent
    hierarchy_level = 0
    if role_data.parent_id:
        _ensure_role_scope(db, current_user, role_data.parent_id)
        parent_role = db.query(Role).filter(Role.id == role_data.parent_id).first()
        if not parent_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Parent rol bulunamadı"
            )
        _ensure_manageable_role_level(current_user, parent_role)
        _ensure_manageable_new_role_level(current_user, parent_role)
        hierarchy_level = parent_role.hierarchy_level + 1
    else:
        _ensure_manageable_new_role_level(current_user, None)

    new_role = Role(
        name=role_data.name,
        description=role_data.description,
        created_by_id=None if is_super_admin(current_user) else current_user.id,
        tenant_id=_current_tenant_id(current_user),
        parent_id=role_data.parent_id,
        hierarchy_level=hierarchy_level,
        is_active=True,
    )

    # Add permissions if provided
    if role_data.permission_ids:
        permissions = (
            db.query(Permission)
            .filter(Permission.id.in_(role_data.permission_ids))
            .all()
        )
        new_role.permissions = permissions

    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role


@router.put("/roles/{role_id}", response_model=RoleOut)
async def update_role(
    role_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role_management_user),
):
    """Rol güncelle"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol bulunamadı"
        )

    _ensure_role_scope(db, current_user, role_id)
    if not is_super_admin(current_user) and is_reserved_workspace_role(role.name):
        raise HTTPException(
            status_code=400, detail="Admin kendi yonetici rolunu duzenleyemez"
        )
    _ensure_manageable_role_level(current_user, role)

    update_data = role_data.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"] != role.name:
        existing_query = db.query(Role).filter(Role.name == str(update_data["name"]))
        existing_query = _restrict_roles_query_for_role_management(
            existing_query, current_user
        )
        existing_query = existing_query.filter(Role.id != role_id)
        existing = existing_query.first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Bu rol zaten mevcut"
            )

    # Handle permissions separately
    permission_ids = update_data.pop("permission_ids", None)
    parent_id = update_data.pop("parent_id", None)

    # If parent_id changed, recalculate hierarchy_level
    if parent_id is not None:
        _ensure_role_scope(db, current_user, parent_id)
        parent_role = db.query(Role).filter(Role.id == parent_id).first()
        if parent_role:
            _ensure_manageable_role_level(current_user, parent_role)
            _ensure_manageable_new_role_level(current_user, parent_role)
            update_data["hierarchy_level"] = parent_role.hierarchy_level + 1
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Parent rol bulunamadı"
            )

    # Apply updates
    for field, value in update_data.items():
        setattr(role, field, value)

    if parent_id is not None:
        role.parent_id = parent_id

    if permission_ids is not None:
        permissions = (
            db.query(Permission).filter(Permission.id.in_(permission_ids)).all()
        )
        role.permissions = permissions

    db.commit()
    db.refresh(role)
    return role


@router.delete("/roles/{role_id}")
async def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role_management_user),
):
    """Rol sil"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol bulunamadı"
        )

    _ensure_role_scope(db, current_user, role_id)
    if not is_super_admin(current_user) and is_reserved_workspace_role(role.name):
        raise HTTPException(
            status_code=400, detail="Admin kendi yonetici rolunu silemez"
        )
    _ensure_manageable_role_level(current_user, role)

    db.delete(role)
    db.commit()
    return {"message": "Rol başarıyla silindi"}


# ==================== PERMISSION ENDPOINTS ====================


@router.get("/permissions", response_model=list[PermissionOut])
async def list_permissions(
    db: Session = Depends(get_db), _: User = Depends(require_role_management_user)
):
    """Tüm izinleri listele"""
    return db.query(Permission).all()


@router.get("/permission-catalog", response_model=list[PermissionCatalogNode])
async def get_permission_catalog(_: User = Depends(require_admin_catalog_reader)):
    """Menu ve alt menu seviyesinde izin katalogunu don."""
    return PERMISSION_CATALOG_TREE


@router.get("/role-permission-matrix")
async def get_role_permission_matrix(_: User = Depends(require_admin_catalog_reader)):
    """
    Rol tabanlı menü görünürlük matrisi — tek kaynak.
    Her rol profili için aktif permission key listesini döner.
    Frontend önizleme bileşeni bu endpoint'ten beslenmeli.
    """
    return build_matrix_response()


@router.get(
    "/users/{user_id}/permission-overrides",
    response_model=list[UserPermissionOverrideOut],
)
async def get_user_permission_overrides(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Personel bulunamadi")

    _ensure_user_scope(target_user, current_user)

    overrides = (
        db.query(UserPermissionOverride)
        .filter(UserPermissionOverride.user_id == user_id)
        .order_by(UserPermissionOverride.permission_key.asc())
        .all()
    )
    return overrides


@router.put(
    "/users/{user_id}/permission-overrides",
    response_model=list[UserPermissionOverrideOut],
)
async def replace_user_permission_overrides(
    user_id: int,
    payload: UserPermissionOverrideBulkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Personel bulunamadi")

    _ensure_user_scope(target_user, current_user)
    _validate_permission_override_scope(db, current_user, target_user, payload.items)

    valid_keys = _flatten_permission_catalog_keys()
    for item in payload.items:
        if item.permission_key not in valid_keys:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Gecersiz permission anahtari: {item.permission_key}",
            )

    db.query(UserPermissionOverride).filter(
        UserPermissionOverride.user_id == user_id
    ).delete()

    created_items: list[UserPermissionOverride] = []
    for item in payload.items:
        new_item = UserPermissionOverride(
            user_id=user_id,
            permission_key=item.permission_key,
            allowed=item.allowed,
            granted_by_user_id=current_user.id,
        )
        db.add(new_item)
        created_items.append(new_item)

    db.commit()
    for item in created_items:
        db.refresh(item)
    return created_items


@router.get(
    "/role-permission-delegations", response_model=list[RolePermissionDelegationOut]
)
async def list_role_permission_delegations(
    system_role: str | None = None,
    business_role: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_manager),
):
    query = db.query(RolePermissionDelegation)
    if system_role:
        query = query.filter(RolePermissionDelegation.system_role == system_role)
    if business_role:
        query = query.filter(RolePermissionDelegation.business_role == business_role)
    return query.order_by(RolePermissionDelegation.permission_key.asc()).all()


@router.put(
    "/role-permission-delegations", response_model=list[RolePermissionDelegationOut]
)
async def replace_role_permission_delegations(
    payload: RolePermissionDelegationBulkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_tenant_governance_manager),
):
    normalized_system_role = (payload.system_role or "").strip().lower() or None
    normalized_business_role = (payload.business_role or "").strip().lower() or None

    if not normalized_system_role and not normalized_business_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="En az bir rol kapsami girilmeli (system_role veya business_role)",
        )

    valid_keys = _flatten_permission_catalog_keys()
    for item in payload.items:
        if item.permission_key not in valid_keys:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Gecersiz permission anahtari: {item.permission_key}",
            )

    db.query(RolePermissionDelegation).filter(
        RolePermissionDelegation.system_role == normalized_system_role,
        RolePermissionDelegation.business_role == normalized_business_role,
    ).delete()

    created: list[RolePermissionDelegation] = []
    for item in payload.items:
        row = RolePermissionDelegation(
            system_role=normalized_system_role,
            business_role=normalized_business_role,
            permission_key=item.permission_key,
            can_delegate=item.can_delegate,
            created_by_user_id=current_user.id,
        )
        db.add(row)
        created.append(row)

    db.commit()
    for row in created:
        db.refresh(row)
    return created


# ==================== PROJECT ENDPOINTS ====================


@router.get("/projects", response_model=list[ProjectOut])
async def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_project_workspace_user),
):
    """Tüm projeleri listele"""
    query = db.query(Project).filter(Project.is_active)
    query = _restrict_project_query_for_admin(query, current_user)
    if _can_view_all_projects(current_user):
        return query.all()
    return (
        query.join(Project.personnel)
        .filter(User.id == current_user.id)
        .distinct()
        .all()
    )


@router.post("/projects", response_model=ProjectOut)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Yeni proje ekle (proje oluşturma yetkisi olan personel)"""
    try:
        if not _can_create_project(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Proje oluşturma yetkiniz yok",
            )
        _require_workspace_tenant_scope(
            current_user,
            detail="Tenant kapsamı olmayan kullanıcı proje oluşturamaz. Önce tenant bootstrap akışını tamamlayın.",
        )

        print(f"[DEBUG] Proje oluşturma isteği alındı: {project}")
        print(f"[DEBUG] Kullanıcı: {current_user.email} ({current_user.role})")

        _ensure_unique_project_code(db, current_user, project.code)

        # Schema data'sını model'e dönüştür
        data = project.model_dump(exclude={"responsible_user_ids"})
        print(f"[DEBUG] Proje data: {data}")

        _ensure_company_scope(db, current_user, data.get("company_id"))
        enforce_active_project_limit(db, _current_tenant(db, current_user))

        new_project = Project(
            **data,
            created_by_id=current_user.id,
            tenant_id=_current_tenant_id(current_user),
        )
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        # Projeyi oluşturan kişi otomatik olarak projeye eklenir.
        if current_user not in new_project.personnel:
            new_project.personnel.append(current_user)

        # UI'da seçilen satın alma sorumlularını projeye ata.
        if project.responsible_user_ids:
            users = _resolve_project_responsible_users(
                db,
                current_user,
                project.responsible_user_ids,
            )
            for user in users:
                if user not in new_project.personnel:
                    new_project.personnel.append(user)

        db.commit()
        db.refresh(new_project)

        print(f"[DEBUG] Proje başarıyla oluşturuldu: ID={new_project.id}")
        return new_project

    except ValueError as e:
        print(f"[ERROR] Validation hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation hatası: {str(e)}",
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        print(f"[ERROR] Proje oluşturma hatası: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Proje oluşturulamadı: {str(e)}",
        )


@router.put("/projects/{proj_id}", response_model=ProjectOut)
async def update_project(
    proj_id: int,
    proj_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Proje güncelle"""
    proj = db.query(Project).filter(Project.id == proj_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    _ensure_project_scope(proj, current_user)

    _ensure_project_member_or_global(proj, current_user)

    if not _can_create_project(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Projeyi güncelleme yetkiniz yok",
        )

    update_data = proj_data.model_dump(
        exclude_unset=True, exclude={"responsible_user_ids"}
    )
    if "code" in update_data and update_data.get("code"):
        _ensure_unique_project_code(
            db,
            current_user,
            update_data["code"],
            excluded_project_id=proj_id,
        )
    if "company_id" in update_data:
        _ensure_company_scope(db, current_user, update_data.get("company_id"))
    for field, value in update_data.items():
        setattr(proj, field, value)

    if proj_data.responsible_user_ids is not None:
        users = _resolve_project_responsible_users(
            db,
            current_user,
            proj_data.responsible_user_ids,
        )
        # Proje sahibini düşürme: current user her zaman projede kalsın.
        if current_user not in users:
            users.append(current_user)
        proj.personnel = users

    db.commit()
    db.refresh(proj)
    return proj


@router.delete("/projects/{proj_id}")
async def delete_project(
    proj_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Proje sil"""
    proj = db.query(Project).filter(Project.id == proj_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    _ensure_project_scope(proj, current_user)

    _ensure_project_member_or_global(proj, current_user)

    if not _can_create_project(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Projeyi silme yetkiniz yok",
        )

    try:
        # Some legacy tables are not wired with ORM cascades; clear them explicitly.
        quote_ids = [
            qid
            for (qid,) in db.query(Quote.id).filter(Quote.project_id == proj_id).all()
        ]
        if quote_ids:
            db.execute(delete(Contract).where(Contract.quote_id.in_(quote_ids)))
            db.execute(
                delete(PriceAnalysis).where(PriceAnalysis.quote_id.in_(quote_ids))
            )
            db.execute(
                delete(SupplierRating).where(SupplierRating.quote_id.in_(quote_ids))
            )
            db.execute(
                delete(QuoteComparison).where(QuoteComparison.quote_id.in_(quote_ids))
            )
            db.execute(
                delete(QuoteStatusLog).where(QuoteStatusLog.quote_id.in_(quote_ids))
            )

        db.execute(
            delete(ProjectPermission).where(ProjectPermission.project_id == proj_id)
        )
        db.execute(
            delete(user_project_permissions).where(
                user_project_permissions.c.project_id == proj_id
            )
        )
        db.execute(delete(user_projects).where(user_projects.c.project_id == proj_id))

        db.delete(proj)
        db.commit()
        return {"message": "Proje silindi"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Proje silinemedi: projeye bagli kayitlar var ({str(e.orig)})",
        )


# ==================== USER/PERSONNEL ENDPOINTS ====================


@router.get("/users", response_model=list[UserOut])
async def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_org_catalog_user),
):
    """Tüm personeli listele"""
    query = db.query(User).filter(User.hidden_from_admin.is_(False))
    query = _restrict_users_query_for_workspace(query, current_user)
    users = query.all()
    for user in users:
        resolve_effective_department_id(db, user)
    db.commit()
    return users


@router.post("/users", response_model=UserOut)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    email_service=Depends(get_email_service),
    current_user: User = Depends(require_admin_user),
):
    """Yeni personel ekle"""
    _ensure_manageable_user_role(current_user, user_data.role)
    email_owner_id = None if is_super_admin(current_user) else current_user.id
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing and not existing.hidden_from_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu email zaten kayıtlı"
        )

    enforce_active_internal_user_limit(db, _current_tenant(db, current_user))

    archived_user = (
        db.query(User)
        .filter(
            User.hidden_from_admin.is_(True),
            User.deleted_original_email == user_data.email,
        )
        .first()
    )

    # Set default approval limits based on role
    approval_limits = {
        "satinalmaci": 100000,
        "satinalma_uzmani": 200000,
        "satinalma_yoneticisi": 300000,
        "satinalma_direktoru": 1000000,
    }
    placeholder_password = secrets.token_urlsafe(24)
    invitation_token = secrets.token_urlsafe(32)
    invitation_expires = datetime.now(timezone.utc) + timedelta(hours=24)

    payload = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": get_password_hash(placeholder_password),
        "role": user_data.role,
        "tenant_id": _current_tenant_id(current_user),
        "approval_limit": user_data.approval_limit
        or approval_limits.get(user_data.role, 100000),
        "department_id": user_data.department_id,
        "photo": user_data.photo,
        "personal_phone": user_data.personal_phone,
        "company_phone": user_data.company_phone,
        "company_phone_short": user_data.company_phone_short,
        "address": user_data.address,
        "hide_location": user_data.hide_location,
        "share_on_whatsapp": user_data.share_on_whatsapp,
        "is_active": user_data.is_active,
        "hidden_from_admin": False,
        "deleted_original_email": None,
        "created_by_id": current_user.id,
        "invitation_token": invitation_token,
        "invitation_token_expires": invitation_expires,
        "invitation_accepted": False,
    }

    if archived_user:
        _ensure_department_scope(db, current_user, user_data.department_id)
        for field, value in payload.items():
            setattr(archived_user, field, value)
        db.commit()
        db.refresh(archived_user)
        email_sent = False
        try:
            email_sent = email_service.send_internal_user_invitation(
                to_email=archived_user.email,
                full_name=archived_user.full_name,
                activation_token=archived_user.invitation_token,
                owner_user_id=email_owner_id,
            )
        except Exception:
            pass
        return UserOut.model_validate(archived_user, from_attributes=True).model_copy(
            update={"invitation_email_sent": email_sent}
        )

    new_user = User(
        **payload,
        system_role=resolve_requested_user_system_role(
            current_user,
            user_data.role,
            user_data.system_role,
        ),
    )
    _ensure_department_scope(db, current_user, user_data.department_id)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    email_sent = False
    try:
        email_sent = email_service.send_internal_user_invitation(
            to_email=new_user.email,
            full_name=new_user.full_name,
            activation_token=new_user.invitation_token,
            owner_user_id=email_owner_id,
        )
    except Exception:
        pass
    return UserOut.model_validate(new_user, from_attributes=True).model_copy(
        update={"invitation_email_sent": email_sent}
    )


@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Personel güncelle (Sadece Super Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    _ensure_user_scope(user, current_user)
    if "department_id" in user_data.model_dump(exclude_unset=True):
        _ensure_department_scope(db, current_user, user_data.department_id)

    update_data = user_data.model_dump(exclude_unset=True)
    if not is_super_admin(current_user) and "tenant_id" in update_data:
        requested_tenant_id = update_data.get("tenant_id")
        if requested_tenant_id != _current_tenant_id(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tenant admin personeli baska tenant'a tasiyamaz",
            )
        update_data["tenant_id"] = _current_tenant_id(current_user)

    if "role" in update_data or "system_role" in update_data:
        requested_role = str(update_data.get("role") or user.role or "")
        requested_system_role = str(
            update_data.get("system_role") or user.system_role or ""
        )
        _ensure_manageable_user_role(current_user, requested_role)
        if (
            not is_super_admin(current_user)
            and requested_system_role.strip().lower() in ADMIN_MANAGED_SYSTEM_ROLES
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tenant admin personel akisinda yonetici sistem rolune gecis yapamaz",
            )
        update_data["system_role"] = resolve_requested_user_system_role(
            current_user,
            requested_role,
            requested_system_role,
        )
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Pasif personeli listeden kaldırarak arşivle (Sadece Super Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    _ensure_user_scope(user, current_user)

    if user.is_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Aktif personel silinemez. Önce personeli pasife alın.",
        )

    if _is_super_admin_account(user):
        if _count_other_visible_super_admins(db, user_id) == 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Son super admin kaydı kaldırılamaz.",
            )

    db.query(CompanyRole).filter(CompanyRole.user_id == user_id).delete()
    db.query(ProjectPermission).filter(ProjectPermission.user_id == user_id).delete()
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete()
    db.query(APIKey).filter(APIKey.user_id == user_id).delete()

    db.execute(delete(user_company).where(user_company.c.user_id == user_id))
    db.execute(delete(user_department).where(user_department.c.user_id == user_id))
    db.execute(delete(user_managers).where(user_managers.c.user_id == user_id))
    db.execute(delete(user_managers).where(user_managers.c.manager_id == user_id))
    db.execute(
        delete(user_company_roles).where(user_company_roles.c.user_id == user_id)
    )
    db.execute(
        delete(user_project_permissions).where(
            user_project_permissions.c.user_id == user_id
        )
    )
    db.execute(delete(user_projects).where(user_projects.c.user_id == user_id))

    db.query(Quote).filter(Quote.assigned_to_id == user_id).update(
        {Quote.assigned_to_id: None}, synchronize_session=False
    )
    db.query(QuoteApproval).filter(QuoteApproval.approved_by_id == user_id).update(
        {QuoteApproval.approved_by_id: None}, synchronize_session=False
    )
    db.query(ProjectFile).filter(ProjectFile.uploaded_by == user_id).update(
        {ProjectFile.uploaded_by: None}, synchronize_session=False
    )
    db.query(ProjectPermission).filter(
        ProjectPermission.granted_by_id == user_id
    ).update({ProjectPermission.granted_by_id: None}, synchronize_session=False)
    db.query(Contract).filter(Contract.signed_by_id == user_id).update(
        {Contract.signed_by_id: None}, synchronize_session=False
    )

    suffix = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    original_email = user.email
    user.email = f"deleted-user-{user.id}-{suffix}@procureflow.local"
    user.full_name = "Silinen Personel (Isten Ayrildi)"
    user.photo = None
    user.personal_phone = None
    user.company_phone = None
    user.company_phone_short = None
    user.address = None
    user.hide_location = True
    user.share_on_whatsapp = False
    user.department_id = None
    user.approval_limit = 0
    user.hidden_from_admin = True
    user.deleted_original_email = original_email
    user.hashed_password = get_password_hash(f"deleted-{user.id}-{suffix}")
    db.commit()
    return {"message": "Personel listeden kaldırıldı"}


@router.post("/users/{user_id}/projects/{project_id}")
async def assign_user_to_project(
    user_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Personeli projeye ata"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    _ensure_user_scope(user, current_user)
    _ensure_project_scope(project, current_user)

    _ensure_project_member_or_global(project, current_user)

    if project not in user.projects:
        user.projects.append(project)
        db.commit()

    return {"message": f"{user.full_name} {project.name} projesine atandı"}


@router.delete("/users/{user_id}/projects/{project_id}")
async def remove_user_from_project(
    user_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Personeli projeden çıkar"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    _ensure_user_scope(user, current_user)
    _ensure_project_scope(project, current_user)

    _ensure_project_member_or_global(project, current_user)

    if project in user.projects:
        user.projects.remove(project)
        db.commit()

    return {"message": f"{user.full_name} {project.name} projesinden çıkarıldı"}


# ==================== PROJECT FILE ENDPOINTS ====================


@router.post("/projects/{proj_id}/files", response_model=ProjectFileOut)
async def upload_project_file(
    proj_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Projeye dosya yukle"""
    # Proje kontrolu
    project = db.query(Project).filter(Project.id == proj_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadi")

    _ensure_project_scope(project, current_user)
    _ensure_project_member_or_global(project, current_user)
    if not _can_create_project(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Proje dosyasi yukleme yetkiniz yok",
        )

    # Sirket kontrolu
    if not project.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proje bir sirkete atanmis olmali",
        )

    # Dosya içeriğini oku
    file_content = await file.read()
    file_size = len(file_content)

    upload_filename = file.filename or "upload.bin"

    # Dosya doğrulama
    is_valid, error_msg = FileUploadService.validate_file(upload_filename, file_size)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)

    # Önce veritabanında kayıt oluştur (ID almak için)
    project_file = ProjectFile(
        project_id=proj_id,
        filename="",  # Gecici, dosya kaydettikten sonra guncellenecek
        original_filename=upload_filename,
        file_type=file.content_type or FileUploadService.get_file_type(upload_filename),
        file_size=file_size,
        file_path="",  # Gecici, dosya kaydettikten sonra guncellenecek
        uploaded_by=current_user.id,
    )

    db.add(project_file)
    db.flush()  # ID'yi almak için flush et
    file_id = project_file.id

    # Dosyayı kaydet (sirket/proje kategorisine)
    try:
        file_path = FileUploadService.save_file(
            company_id=project.company_id,
            project_id=proj_id,
            file_id=file_id,
            file_content=file_content,
            original_filename=upload_filename,
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dosya kaydedilemedi: {str(e)}",
        )

    # Dosya yolunu ve adını güncelle
    filename = FileUploadService.generate_filename(file_id, upload_filename)
    project_file.filename = filename
    project_file.file_path = file_path

    db.commit()
    db.refresh(project_file)

    return project_file


@router.get("/projects/{proj_id}/files", response_model=list[ProjectFileOut])
async def list_project_files(
    proj_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Proje dosyalar�n� listele"""
    project = db.query(Project).filter(Project.id == proj_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamad�")

    current_user = _
    _ensure_project_scope(project, current_user)
    _ensure_project_member_or_global(project, current_user)

    files = db.query(ProjectFile).filter(ProjectFile.project_id == proj_id).all()
    return files


@router.delete("/files/{file_id}")
async def delete_project_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Proje dosyas�n� sil (Sadece Super Admin)"""
    project_file = db.query(ProjectFile).filter(ProjectFile.id == file_id).first()
    if not project_file:
        raise HTTPException(status_code=404, detail="Dosya bulunamad�")
    project = db.query(Project).filter(Project.id == project_file.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    _ensure_project_scope(project, current_user)
    _ensure_project_member_or_global(project, current_user)
    if not _can_create_project(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Proje dosyasi silme yetkiniz yok",
        )

    # Fiziksel dosyay� sil
    FileUploadService.delete_file(project_file.file_path)

    # Veritaban�ndan sil
    db.delete(project_file)
    db.commit()

    return {"message": "Dosya silindi"}


# ==================== DEMO DATA ENDPOINTS ====================


@router.post("/load-demo-data")
async def load_demo_data(
    db: Session = Depends(get_db), _: User = Depends(require_tenant_governance_manager)
):
    """Demo verilerini yükle (Sadece Super Admin)"""
    try:
        results: dict[str, Any] = {
            "users": 0,
            "departments": 0,
            "companies": 0,
            "projects": 0,
            "skipped": {
                "users": 0,
                "departments": 0,
                "companies": 0,
                "projects": 0,
            },
        }

        # Users Data
        users_data = [
            {
                "email": "satinalma@example.com",
                "full_name": "SATIN ALAMA",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmauzmani@example.com",
                "full_name": "SATIN ALAMA UZMANI",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmayoneticisi@example.com",
                "full_name": "SATIN ALAMA YÖNETİCİSİ",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmamuduru@example.com",
                "full_name": "SATIN ALAMA MÜDÜRÜ",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmadirektoru@example.com",
                "full_name": "SATIN ALAMA DİREKTÖRÜ",
                "role": "personnel",
                "password": "Test123!",
            },
        ]

        for user in users_data:
            existing = db.query(User).filter(User.email == user["email"]).first()
            if existing:
                results["skipped"]["users"] += 1
            else:
                new_user = User(
                    email=user["email"],
                    full_name=user["full_name"],
                    hashed_password=get_password_hash(user["password"]),
                    role=user["role"],
                    is_active=True,
                )
                db.add(new_user)
                results["users"] += 1

        db.commit()

        # Departments Data
        departments_data = [
            "SATIN ALAMA",
            "SATIN ALAMA UZMANI",
            "SATIN ALAMA YÖNETİCİSİ",
            "SATIN ALAMA MÜDÜRÜ",
            "SATIN ALAMA DİREKTÖRÜ",
        ]

        for dept_name in departments_data:
            existing = db.query(Department).filter(Department.name == dept_name).first()
            if existing:
                results["skipped"]["departments"] += 1
            else:
                new_dept = Department(
                    name=dept_name, description=f"{dept_name} Departmanı"
                )
                db.add(new_dept)
                results["departments"] += 1

        db.commit()

        # Companies Data
        companies_data = [
            {"name": "YÖRPAŞ AŞ.", "color": "#8B008B"},
            {"name": "KOMAGENE", "color": "#0000FF"},
            {"name": "PİZZA MAX", "color": "#FFFF00"},
            {"name": "BEREKET DÖNER", "color": "#008000"},
            {"name": "SCHBİTZEL LANDMANN", "color": "#FF0000"},
        ]

        for company in companies_data:
            existing = db.query(Company).filter(Company.name == company["name"]).first()
            if existing:
                results["skipped"]["companies"] += 1
            else:
                new_company = Company(
                    name=company["name"], color_code=company["color"], is_active=True
                )
                db.add(new_company)
                results["companies"] += 1

        db.commit()

        # Fetch companies for projects
        companies = db.query(Company).all()

        # Projects Data
        project_names = [
            "E-Ticaret Platformu Geliştirme",
            "Mobil Uygulama Yazılımı",
            "KYS Sistem İyileştirmesi",
            "Veritabanı Migrasyonu",
            "API Entegrasyonu",
        ]

        project_codes = ["ECOM", "MOB", "KYS", "DB", "API"]
        project_locations = [
            "İstanbul, Levent",
            "Ankara, Çankaya",
            "İzmir, Alsancak",
            "Bursa, Osmangazi",
            "Gaziantep, Şehitkamil",
        ]
        project_phones = [
            "0212 123 45 67",
            "0312 234 56 78",
            "0232 345 67 89",
            "0224 456 78 90",
            "0342 567 89 01",
        ]

        for company in companies:
            for i in range(5):
                code = f"{project_codes[i]}-{str(company.id).zfill(3)}"
                existing = db.query(Project).filter(Project.code == code).first()
                if existing:
                    results["skipped"]["projects"] += 1
                else:
                    new_project = Project(
                        name=f"{project_names[i]} - {company.name}",
                        description=f"Demo proje: {project_names[i]}",
                        code=code,
                        company_id=company.id,
                        manager_email="serkaneryilmazz@gmail.com",
                        manager_name=f"Proje Müdürü {i+1}",
                        manager_phone=project_phones[i],
                        address=project_locations[i],
                        budget=5500000,
                        is_active=True,
                    )
                    db.add(new_project)
                    results["projects"] += 1

        db.commit()

        return {
            "message": "Demo verileri başarıyla yüklendi",
            "created": {
                "users": results["users"],
                "departments": results["departments"],
                "companies": results["companies"],
                "projects": results["projects"],
            },
            "skipped": results["skipped"],
            "total": {
                "created": sum(
                    [
                        results["users"],
                        results["departments"],
                        results["companies"],
                        results["projects"],
                    ]
                ),
                "skipped": sum(results["skipped"].values()),
            },
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Demo veri yükleme hatası: {str(e)}",
        )


# ==================== COMPANY ASSIGNMENT ENDPOINTS ====================


@router.get(
    "/users/{user_id}/company-assignments", response_model=list[CompanyAssignmentOut]
)
async def list_user_company_assignments(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Personelin firma atamalarını listele"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    _ensure_user_scope(user, current_user)
    return (
        db.query(CompanyRole)
        .filter(CompanyRole.user_id == user_id, CompanyRole.is_active.is_(True))
        .all()
    )


@router.post(
    "/users/{user_id}/company-assignments",
    response_model=CompanyAssignmentOut,
    status_code=status.HTTP_201_CREATED,
)
async def add_user_company_assignment(
    user_id: int,
    data: CompanyAssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Personele firma+rol+departman ataması ekle"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    _ensure_user_scope(user, current_user)
    _ensure_company_scope(db, current_user, data.company_id)
    _ensure_role_scope(db, current_user, data.role_id)
    _ensure_department_scope(db, current_user, data.department_id)

    existing = (
        db.query(CompanyRole)
        .filter(
            CompanyRole.user_id == user_id,
            CompanyRole.company_id == data.company_id,
            CompanyRole.is_active.is_(True),
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu personel bu firmaya zaten atanmış",
        )

    company = db.query(Company).filter(Company.id == data.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Firma bulunamadı")

    role = db.query(Role).filter(Role.id == data.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Rol bulunamadı")

    dept = None
    if data.department_id:
        dept = db.query(Department).filter(Department.id == data.department_id).first()
        if not dept:
            raise HTTPException(status_code=404, detail="Departman bulunamadı")

    _ensure_company_assignment_tenant_consistency(user, company, role, dept)

    assignment = CompanyRole(
        tenant_id=user.tenant_id
        or company.tenant_id
        or role.tenant_id
        or (dept.tenant_id if dept else None),
        user_id=user_id,
        company_id=data.company_id,
        role_id=data.role_id,
        department_id=data.department_id,
        sub_items_json=json.dumps(data.sub_items, ensure_ascii=False),
        is_active=True,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.put(
    "/users/{user_id}/company-assignments/{assignment_id}",
    response_model=CompanyAssignmentOut,
)
async def update_user_company_assignment(
    user_id: int,
    assignment_id: int,
    data: CompanyAssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Personel firma atamasını güncelle (rol/departman değiştir)"""
    assignment = (
        db.query(CompanyRole)
        .filter(CompanyRole.id == assignment_id, CompanyRole.user_id == user_id)
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Atama bulunamadı")
    _ensure_user_scope(assignment.user, current_user)
    _ensure_company_scope(db, current_user, assignment.company_id)
    role = assignment.role
    department = assignment.department
    if data.role_id is not None:
        _ensure_role_scope(db, current_user, data.role_id)
        role = db.query(Role).filter(Role.id == data.role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Rol bulunamadı")
    if data.department_id is not None:
        _ensure_department_scope(db, current_user, data.department_id)
        department = None
        if data.department_id:
            department = (
                db.query(Department).filter(Department.id == data.department_id).first()
            )
            if not department:
                raise HTTPException(status_code=404, detail="Departman bulunamadı")

    _ensure_company_assignment_tenant_consistency(
        assignment.user, assignment.company, role, department
    )

    update_data = data.model_dump(exclude_unset=True)
    if "sub_items" in update_data:
        update_data["sub_items_json"] = json.dumps(
            update_data.pop("sub_items") or [], ensure_ascii=False
        )
    for field, value in update_data.items():
        setattr(assignment, field, value)
    assignment.tenant_id = (
        assignment.user.tenant_id
        or assignment.company.tenant_id
        or role.tenant_id
        or (department.tenant_id if department else None)
    )

    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/users/{user_id}/company-assignments/{assignment_id}")
async def remove_user_company_assignment(
    user_id: int,
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user),
):
    """Personelin firma atamasını kaldır"""
    assignment = (
        db.query(CompanyRole)
        .filter(CompanyRole.id == assignment_id, CompanyRole.user_id == user_id)
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Atama bulunamadı")
    _ensure_user_scope(assignment.user, current_user)
    _ensure_company_scope(db, current_user, assignment.company_id)

    db.delete(assignment)
    db.commit()
    return {"message": "Firma ataması kaldırıldı"}


# ==================== PASSWORD RESET (ADMIN) ====================


@router.post("/users/{user_id}/reset-password")
async def admin_reset_password(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Personel şifresini sıfırla (Super Admin veya reset_password iznine sahip roller)"""
    if not is_super_admin(current_user):
        has_permission = (
            db.query(Permission)
            .join(Permission.roles)
            .join(Role.company_roles)
            .filter(
                CompanyRole.user_id == current_user.id,
                Permission.name == "users.reset_password",
            )
            .first()
        )
        if not has_permission:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Şifre sıfırlama yetkiniz yok",
            )

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    _ensure_user_scope(target, current_user)

    temp_password = "Temp1234!"
    target.hashed_password = get_password_hash(temp_password)
    db.commit()

    return {
        "message": f"{target.full_name} şifresi sıfırlandı",
        "temp_password": temp_password,
    }


@router.post("/users/{user_id}/contact-email", response_model=dict)
async def send_user_contact_email(
    user_id: int,
    to_email: str = Form(...),
    subject: str = Form(...),
    body: str = Form(""),
    cc: str | None = Form(None),
    system_email_id: int | None = Form(None),
    attachments: list[UploadFile] | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    email_service=Depends(get_email_service),
):
    if not can_access_admin_surface(current_user):
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    _ensure_user_scope(target, current_user)
    email_owner_id = None if is_super_admin(current_user) else current_user.id

    payload_attachments: list[tuple[str, str, bytes]] = []
    total_size = 0
    for upload in attachments or []:
        content = await upload.read()
        total_size += len(content)
        if total_size > 20 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="Toplam ek boyutu 20MB sınırını aşamaz"
            )
        filename = (upload.filename or "ek").strip() or "ek"
        content_type = upload.content_type or "application/octet-stream"
        payload_attachments.append((filename, content_type, content))

    email_sent = email_service.send_custom_email(
        to_email=to_email,
        subject=subject,
        body=body,
        cc=cc,
        attachments=payload_attachments,
        owner_user_id=email_owner_id,
        system_email_id=system_email_id,
    )
    if not email_sent:
        raise HTTPException(status_code=500, detail="E-posta gönderilemedi")

    return {
        "status": "success",
        "message": f"{target.full_name} için e-posta gönderildi",
    }


# ---------------------------------------------------------------------------
# Platform Supplier Havuzu (super admin)
# ---------------------------------------------------------------------------


@router.get("/platform-suppliers")
async def list_platform_suppliers(
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_manager),
):
    """
    Platform genelinde tenant'a bagli olmayan (kaynak: platform_network) tedarikci havuzu.
    """
    suppliers = (
        db.query(Supplier)
        .filter(Supplier.tenant_id.is_(None), Supplier.is_active == True)
        .order_by(Supplier.company_name)
        .all()
    )
    return [
        {
            "id": s.id,
            "name": s.company_name,
            "email": s.email,
            "phone": s.phone,
            "website": s.website,
            "city": s.city,
            "is_active": s.is_active,
            "source_type": s.source_type,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in suppliers
    ]


@router.post("/platform-suppliers", status_code=201)
async def create_platform_supplier(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_tenant_governance_manager),
):
    """
    Platform genelinde kullanilabilecek (tenant'a bagli olmayan) tedarikci olustur.
    """
    name: str = (payload.get("name") or "").strip()
    email: str = (payload.get("email") or "").strip()
    phone: str = (payload.get("phone") or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="name zorunlu")
    if not email:
        raise HTTPException(status_code=400, detail="email zorunlu")
    if not phone:
        raise HTTPException(status_code=400, detail="phone zorunlu")

    existing = db.query(Supplier).filter(Supplier.email == email).first()
    if existing:
        raise HTTPException(
            status_code=409, detail="Bu e-posta ile bir tedarikci zaten kayitli"
        )

    supplier = Supplier(
        company_name=name,
        email=email,
        phone=phone,
        website=payload.get("website"),
        city=payload.get("city"),
        is_active=True,
        tenant_id=None,
        created_by_id=current_user.id,
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return {
        "id": supplier.id,
        "name": supplier.company_name,
        "email": supplier.email,
        "source_type": supplier.source_type,
    }


# ---------------------------------------------------------------------------
# Platform Analitikleri (super admin)
# ---------------------------------------------------------------------------


@router.get("/platform-analytics")
async def get_platform_analytics(
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_reader),
):
    """
    Super admin icin platform geneli ozet metrikler.
    """
    from api.services.subscription_service import build_subscription_catalog

    total_tenants = db.query(func.count(Tenant.id)).scalar() or 0
    active_tenants = (
        db.query(func.count(Tenant.id)).filter(Tenant.is_active == True).scalar() or 0
    )
    total_internal_users = (
        db.query(func.count(User.id))
        .filter(User.is_active == True, User.hidden_from_admin == False)
        .scalar()
        or 0
    )
    total_suppliers = (
        db.query(func.count(Supplier.id)).filter(Supplier.is_active == True).scalar()
        or 0
    )
    platform_suppliers = (
        db.query(func.count(Supplier.id))
        .filter(Supplier.is_active == True, Supplier.tenant_id.is_(None))
        .scalar()
        or 0
    )
    private_suppliers = (
        db.query(func.count(Supplier.id))
        .filter(Supplier.is_active == True, Supplier.tenant_id.isnot(None))
        .scalar()
        or 0
    )
    total_projects = db.query(func.count(Project.id)).scalar() or 0
    total_quotes = db.query(func.count(Quote.id)).scalar() or 0

    # Plan dagilimi
    catalog = build_subscription_catalog()
    plan_distribution = []
    for plan in catalog.plans:
        count = (
            db.query(func.count(Tenant.id))
            .filter(Tenant.subscription_plan_code == plan.code)
            .scalar()
            or 0
        )
        plan_distribution.append(
            {"plan_code": plan.code, "plan_name": plan.name, "tenant_count": count}
        )

    # Onboarding durumu dagilimi
    onboarding_rows = (
        db.query(Tenant.onboarding_status, func.count(Tenant.id))
        .group_by(Tenant.onboarding_status)
        .all()
    )
    onboarding_distribution = [
        {"status": row[0] or "unknown", "count": row[1]} for row in onboarding_rows
    ]

    return {
        "summary": {
            "total_tenants": total_tenants,
            "active_tenants": active_tenants,
            "total_internal_users": total_internal_users,
            "total_suppliers": total_suppliers,
            "platform_suppliers": platform_suppliers,
            "private_suppliers": private_suppliers,
            "total_projects": total_projects,
            "total_quotes": total_quotes,
        },
        "plan_distribution": plan_distribution,
        "onboarding_distribution": onboarding_distribution,
    }


class PublicPricingConfigOut(BaseModel):
    strategic_partner: dict
    supplier: dict


@router.get("/public-pricing-config", response_model=PublicPricingConfigOut)
async def get_public_pricing_config(
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_reader),
):
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings(app_name="ProcureFlow")
        db.add(settings)
        db.flush()

    ensure_public_pricing_json(settings)
    db.commit()
    db.refresh(settings)

    return parse_public_pricing_config(settings.public_pricing_json)


@router.put("/public-pricing-config", response_model=PublicPricingConfigOut)
async def update_public_pricing_config(
    payload: PublicPricingConfigOut,
    db: Session = Depends(get_db),
    _: User = Depends(require_tenant_governance_manager),
):
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings(app_name="ProcureFlow")
        db.add(settings)
        db.flush()

    config = payload.model_dump()
    if not config.get("strategic_partner") or not config.get("supplier"):
        raise HTTPException(
            status_code=422, detail="Strategic partner ve supplier bloklari zorunludur"
        )

    settings.public_pricing_json = serialize_public_pricing_config(config)
    db.commit()
    db.refresh(settings)
    return parse_public_pricing_config(settings.public_pricing_json)
