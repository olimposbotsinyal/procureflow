from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from api.models.project import Project
from api.models.supplier import Supplier
from api.models.tenant import Tenant
from api.models.user import User
from api.schemas.subscription import (
    SubscriptionCatalogOut,
    SubscriptionCatalogSnapshotOut,
    SubscriptionTenantUsageMetricOut,
    SubscriptionTenantUsageOut,
)

DEFAULT_SUBSCRIPTION_PLAN_CODE = "starter"


def build_subscription_catalog() -> SubscriptionCatalogOut:
    return SubscriptionCatalogOut(
        plans=[
            {
                "code": "starter",
                "name": "Başlangıç",
                "description": "Küçük ekipler için temel RFQ, onay ve tedarikçi operasyon paketi.",
                "audience": "strategic_partner",
                "is_default": True,
                "modules": [
                    {
                        "code": "rfq_core",
                        "name": "RFQ Core",
                        "description": "RFQ olusturma, gonderim ve karsilastirma akislarini acik tutar.",
                        "enabled": True,
                    },
                    {
                        "code": "supplier_portal",
                        "name": "Tedarikci Portali",
                        "description": "Tedarikci daveti ve cevap toplama akislarini acik tutar.",
                        "enabled": True,
                    },
                    {
                        "code": "project_limit",
                        "name": "Proje Limiti",
                        "description": "Ayni anda yonetilebilecek aktif proje adedini sinirlar.",
                        "enabled": True,
                        "limit_key": "active_projects",
                        "limit_value": 5,
                        "unit": "proje",
                    },
                    {
                        "code": "user_limit",
                        "name": "Kullanici Limiti",
                        "description": "Aktif ic kullanici sayisini kontrollu baslangic hacminde tutar.",
                        "enabled": True,
                        "limit_key": "active_internal_users",
                        "limit_value": 10,
                        "unit": "kullanici",
                    },
                ],
            },
            {
                "code": "growth",
                "name": "Büyüme",
                "description": "Büyüyen satın alma ekipleri için daha yüksek limitler ve raporlama modülleri.",
                "audience": "strategic_partner",
                "modules": [
                    {
                        "code": "advanced_reports",
                        "name": "Gelismis Raporlar",
                        "description": "Detayli karsilastirma, performans ve audit raporlarini acar.",
                        "enabled": True,
                    },
                    {
                        "code": "approval_automation",
                        "name": "Onay Otomasyonu",
                        "description": "Cok seviyeli approval akislari ve role bazli routing saglar.",
                        "enabled": True,
                    },
                    {
                        "code": "supplier_limit",
                        "name": "Tedarikci Limiti",
                        "description": "Aktif ozel tedarikci portfoyunu buyutmek icin ust limit saglar.",
                        "enabled": True,
                        "limit_key": "active_private_suppliers",
                        "limit_value": 250,
                        "unit": "tedarikci",
                    },
                    {
                        "code": "user_limit",
                        "name": "Kullanici Limiti",
                        "description": "Aktif ic kullanici kapasitesini buyuyen ekipler icin genisletir.",
                        "enabled": True,
                        "limit_key": "active_internal_users",
                        "limit_value": 50,
                        "unit": "kullanici",
                    },
                ],
            },
            {
                "code": "enterprise",
                "name": "Kurumsal",
                "description": "Büyük organizasyonlar için sınırsız hacim, entegrasyon ve destek katmanı.",
                "audience": "strategic_partner",
                "modules": [
                    {
                        "code": "api_access",
                        "name": "API ve Entegrasyon",
                        "description": "ERP, muhasebe ve veri ambarina entegrasyon noktalarini acar.",
                        "enabled": True,
                    },
                    {
                        "code": "tenant_branding",
                        "name": "Tenant Branding",
                        "description": "Custom domain, tema ve e-posta gonderici marka katmanini acar.",
                        "enabled": True,
                    },
                    {
                        "code": "workflow_limit",
                        "name": "Onay Akisi Limiti",
                        "description": "Tenant basina aktif approval workflow sayisini buyutur.",
                        "enabled": True,
                        "limit_key": "active_approval_workflows",
                        "limit_value": 999,
                        "unit": "akis",
                    },
                ],
            },
            {
                "code": "supplier_free",
                "name": "Tedarikçi Ücretsiz",
                "description": "Alıcılarla buluşmak ve teklif sunmak için ücretsiz tedarikçi hesabı.",
                "audience": "supplier",
                "is_default": True,
                "modules": [
                    {
                        "code": "rfq_response",
                        "name": "Teklif Yanıtlama",
                        "description": "Alıcılardan gelen ihale davetlerine teklif gönderebilirsiniz.",
                        "enabled": True,
                    },
                    {
                        "code": "supplier_profile",
                        "name": "Tedarikçi Profili",
                        "description": "Firma profili, kategori ve belgelerinizi yönetin.",
                        "enabled": True,
                    },
                    {
                        "code": "quote_limit",
                        "name": "Aylık Teklif Limiti",
                        "description": "Aylık ücretsiz teklif gönderim hakkı.",
                        "enabled": True,
                        "limit_key": "monthly_quotes",
                        "limit_value": 10,
                        "unit": "teklif",
                    },
                ],
            },
            {
                "code": "supplier_prime",
                "name": "Tedarikçi Prime",
                "description": "Öncelikli ihale daveti, öncü rozet ve sınırsız teklif ile büyüyün.",
                "audience": "supplier",
                "modules": [
                    {
                        "code": "priority_rfq",
                        "name": "Öncelikli İhale Daveti",
                        "description": "Yeni ihalelerde öncelikli bildirim ve erken teklif hakkı.",
                        "enabled": True,
                    },
                    {
                        "code": "prime_badge",
                        "name": "Prime Rozeti",
                        "description": "Alıcıların aramasında öne çıkın ve güven etiketini kullanın.",
                        "enabled": True,
                    },
                    {
                        "code": "quote_limit",
                        "name": "Sınırsız Teklif",
                        "description": "Aylık teklif limiti yok.",
                        "enabled": True,
                        "limit_key": "monthly_quotes",
                        "limit_value": 9999,
                        "unit": "teklif",
                    },
                ],
            },
            {
                "code": "business_partner_free",
                "name": "Is Ortagi Programi",
                "description": "Referans bazli komisyon modeli ile ucretsiz is ortagi kaydi.",
                "audience": "business_partner",
                "is_default": True,
                "modules": [
                    {
                        "code": "referral_tracking",
                        "name": "Referans Takibi",
                        "description": "Getirilen musteri ve islem akisini panelden takip edin.",
                        "enabled": True,
                    },
                    {
                        "code": "commission_ledger",
                        "name": "Komisyon Defteri",
                        "description": "Komisyon hareketleri, hak edis ve odeme kayitlarini izleyin.",
                        "enabled": True,
                    },
                ],
            },
        ]
    )


def _plan_name_map() -> dict[str, str]:
    return {plan.code: plan.name for plan in build_subscription_catalog().plans}


def normalize_subscription_plan_code(plan_code: str | None) -> str:
    normalized = (plan_code or DEFAULT_SUBSCRIPTION_PLAN_CODE).strip().lower()
    return normalized or DEFAULT_SUBSCRIPTION_PLAN_CODE


def validate_subscription_plan_code(plan_code: str | None) -> str:
    normalized = normalize_subscription_plan_code(plan_code)
    valid_codes = {plan.code for plan in build_subscription_catalog().plans}
    if normalized not in valid_codes:
        raise ValueError("Gecersiz subscription_plan_code")
    return normalized


def get_plan_limit(plan_code: str | None, limit_key: str) -> int | None:
    normalized = normalize_subscription_plan_code(plan_code)
    for plan in build_subscription_catalog().plans:
        if plan.code != normalized:
            continue
        for module in plan.modules:
            if module.enabled and module.limit_key == limit_key:
                return module.limit_value
        return None
    return None


def build_subscription_catalog_snapshot(db: Session) -> SubscriptionCatalogSnapshotOut:
    catalog = build_subscription_catalog()
    plan_name_map = _plan_name_map()
    tenant_rows = (
        db.query(Tenant).order_by(Tenant.created_at.desc(), Tenant.id.desc()).all()
    )
    tenant_usage: list[SubscriptionTenantUsageOut] = []

    for tenant in tenant_rows:
        normalized_plan_code = normalize_subscription_plan_code(
            tenant.subscription_plan_code
        )
        tenant_usage.append(
            SubscriptionTenantUsageOut(
                tenant_id=tenant.id,
                tenant_name=tenant.brand_name or tenant.legal_name,
                plan_code=normalized_plan_code,
                plan_name=plan_name_map.get(normalized_plan_code, normalized_plan_code),
                status=tenant.status,
                is_active=tenant.is_active,
                metrics=[
                    SubscriptionTenantUsageMetricOut(
                        key="active_projects",
                        label="Aktif Proje",
                        used=(
                            db.query(Project)
                            .filter(
                                Project.tenant_id == tenant.id,
                                Project.is_active.is_(True),
                            )
                            .count()
                        ),
                        limit=get_plan_limit(normalized_plan_code, "active_projects"),
                        unit="proje",
                    ),
                    SubscriptionTenantUsageMetricOut(
                        key="active_internal_users",
                        label="Aktif Kullanici",
                        used=(
                            db.query(User)
                            .filter(
                                User.tenant_id == tenant.id,
                                User.is_active.is_(True),
                                User.hidden_from_admin.is_(False),
                                User.system_role != "supplier_user",
                            )
                            .count()
                        ),
                        limit=get_plan_limit(
                            normalized_plan_code, "active_internal_users"
                        ),
                        unit="kullanici",
                    ),
                    SubscriptionTenantUsageMetricOut(
                        key="active_private_suppliers",
                        label="Aktif Ozel Tedarikci",
                        used=(
                            db.query(Supplier)
                            .filter(
                                Supplier.tenant_id == tenant.id,
                                Supplier.is_active.is_(True),
                            )
                            .count()
                        ),
                        limit=get_plan_limit(
                            normalized_plan_code, "active_private_suppliers"
                        ),
                        unit="tedarikci",
                    ),
                ],
            )
        )

    return SubscriptionCatalogSnapshotOut(catalog=catalog, tenant_usage=tenant_usage)


def enforce_active_project_limit(db: Session, tenant: Tenant | None) -> None:
    if tenant is None or not tenant.subscription_plan_code:
        return

    limit_value = get_plan_limit(tenant.subscription_plan_code, "active_projects")
    if limit_value is None:
        return

    active_project_count = (
        db.query(Project)
        .filter(Project.tenant_id == tenant.id, Project.is_active.is_(True))
        .count()
    )
    if active_project_count >= limit_value:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Aktif proje limiti asildi. "
                f"Mevcut plan: {normalize_subscription_plan_code(tenant.subscription_plan_code)}. "
                f"Limit: {limit_value} aktif proje."
            ),
        )


def enforce_active_internal_user_limit(db: Session, tenant: Tenant | None) -> None:
    if tenant is None or not tenant.subscription_plan_code:
        return

    limit_value = get_plan_limit(tenant.subscription_plan_code, "active_internal_users")
    if limit_value is None:
        return

    active_user_count = (
        db.query(User)
        .filter(
            User.tenant_id == tenant.id,
            User.is_active.is_(True),
            User.hidden_from_admin.is_(False),
            User.system_role != "supplier_user",
        )
        .count()
    )
    if active_user_count >= limit_value:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Aktif kullanici limiti asildi. "
                f"Mevcut plan: {normalize_subscription_plan_code(tenant.subscription_plan_code)}. "
                f"Limit: {limit_value} aktif kullanici."
            ),
        )


def enforce_active_private_supplier_limit(db: Session, tenant: Tenant | None) -> None:
    if tenant is None or not tenant.subscription_plan_code:
        return

    limit_value = get_plan_limit(
        tenant.subscription_plan_code, "active_private_suppliers"
    )
    if limit_value is None:
        return

    active_supplier_count = (
        db.query(Supplier)
        .filter(
            Supplier.tenant_id == tenant.id,
            Supplier.is_active.is_(True),
        )
        .count()
    )
    if active_supplier_count >= limit_value:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Aktif tedarikci limiti asildi. "
                f"Mevcut plan: {normalize_subscription_plan_code(tenant.subscription_plan_code)}. "
                f"Limit: {limit_value} aktif tedarikci."
            ),
        )
