#!/usr/bin/env python3
"""
Seed script for Onboarding SaaS Transformation
Tenant Types, Subscription Tiers, Premium Features
"""

from datetime import datetime, timedelta
from api.database import SessionLocal
from api.models.onboarding_saas import (
    TenantType,
    SubscriptionPlanTier,
    PremiumFeature,
)


def seed_onboarding_saas():
    db = SessionLocal()
    try:
        # ============================================================================
        # 1) TENANT TYPES
        # ============================================================================

        # Check if already exists
        existing_types = db.query(TenantType).count()
        if existing_types > 0:
            print(f"✓ Tenant types already exist ({existing_types}). Skipping...")
            db.close()
            return

        print("📋 Creating Tenant Types...")

        # Stratejik Ortaklık
        strategic_partner = TenantType(
            code="strategic_partner",
            name="Stratejik Ortaklık (Strategic Partner)",
            description="B2B Platform - Tedarikçiler yönetin, teklif alın",
            trial_days=15,
            card_verification_amount=10.00,
            is_active=True,
        )
        db.add(strategic_partner)
        db.flush()
        print(f"  ✓ Stratejik Ortaklık (id={strategic_partner.id})")

        # Tedarikçi
        supplier = TenantType(
            code="supplier",
            name="Tedarikçi (Supplier)",
            description="Teklif verin, müşteri bulun",
            trial_days=7,
            card_verification_amount=10.00,
            is_active=True,
        )
        db.add(supplier)
        db.flush()
        print(f"  ✓ Tedarikçi (id={supplier.id})")

        # İş Ortağı
        business_partner = TenantType(
            code="business_partner",
            name="İş Ortağı (Channel Partner)",
            description="Müşteri getir, komisyon kazan",
            trial_days=0,  # No trial for business partners
            card_verification_amount=0.00,
            is_active=True,
        )
        db.add(business_partner)
        db.flush()
        print(f"  ✓ İş Ortağı (id={business_partner.id})")

        # ============================================================================
        # 2) SUBSCRIPTION PLAN TIERS
        # ============================================================================

        print("\n💰 Creating Subscription Plan Tiers...")

        # --- STRATEJIK ORTAKLIQ ---

        # Başlangıç (15 gün ücretsiz)
        tier_sp_starter = SubscriptionPlanTier(
            tenant_type_id=strategic_partner.id,
            tier_code="baslangic",
            tier_name="Başlangıç",
            description="15 gün ücretsiz deneme - Sınırlı tedarikçi, proje ve kullanıcı",
            trial_days=15,
            trial_daily_price=0.00,
            post_trial_monthly_price=29.99,
            post_trial_annual_price=299.90,
            trial_supplier_limit=10,
            trial_project_limit=5,
            trial_user_limit=3,
            trial_transaction_limit=100,
            post_trial_supplier_limit=100,
            post_trial_project_limit=50,
            post_trial_user_limit=15,
            post_trial_transaction_limit=1000,
            display_order=1,
            is_active=True,
        )
        db.add(tier_sp_starter)
        db.flush()
        print(f"  ✓ Stratejik Ortaklık - Başlangıç (id={tier_sp_starter.id})")

        # Gelişim
        tier_sp_professional = SubscriptionPlanTier(
            tenant_type_id=strategic_partner.id,
            tier_code="gelisim",
            tier_name="Gelişim",
            description="Orta ölçekli işletmeler için - Daha fazla tedarikçi ve kullanıcı",
            trial_days=15,
            trial_daily_price=0.00,
            post_trial_monthly_price=99.99,
            post_trial_annual_price=999.90,
            trial_supplier_limit=50,
            trial_project_limit=20,
            trial_user_limit=10,
            trial_transaction_limit=500,
            post_trial_supplier_limit=500,
            post_trial_project_limit=200,
            post_trial_user_limit=50,
            post_trial_transaction_limit=10000,
            display_order=2,
            is_active=True,
        )
        db.add(tier_sp_professional)
        db.flush()
        print(f"  ✓ Stratejik Ortaklık - Gelişim (id={tier_sp_professional.id})")

        # Kurumsal
        tier_sp_enterprise = SubscriptionPlanTier(
            tenant_type_id=strategic_partner.id,
            tier_code="kurumsal",
            tier_name="Kurumsal",
            description="Büyük ölçekli işletmeler - Sınırsız tedarikçi, proje, kullanıcı",
            trial_days=15,
            trial_daily_price=0.00,
            post_trial_monthly_price=299.99,
            post_trial_annual_price=2999.90,
            trial_supplier_limit=200,
            trial_project_limit=100,
            trial_user_limit=50,
            trial_transaction_limit=5000,
            post_trial_supplier_limit=None,  # Unlimited
            post_trial_project_limit=None,
            post_trial_user_limit=None,
            post_trial_transaction_limit=None,
            display_order=3,
            is_active=True,
        )
        db.add(tier_sp_enterprise)
        db.flush()
        print(f"  ✓ Stratejik Ortaklık - Kurumsal (id={tier_sp_enterprise.id})")

        # --- TEDARIKÇI ---

        # Başlangıç
        tier_sup_starter = SubscriptionPlanTier(
            tenant_type_id=supplier.id,
            tier_code="baslangic",
            tier_name="Başlangıç",
            description="7 gün ücretsiz deneme - 10 teklif/ay",
            trial_days=7,
            trial_daily_price=0.00,
            post_trial_monthly_price=19.99,
            post_trial_annual_price=199.90,
            trial_supplier_limit=None,
            trial_project_limit=None,
            trial_user_limit=1,
            trial_transaction_limit=10,
            post_trial_supplier_limit=None,
            post_trial_project_limit=None,
            post_trial_user_limit=1,
            post_trial_transaction_limit=50,
            display_order=1,
            is_active=True,
        )
        db.add(tier_sup_starter)
        db.flush()
        print(f"  ✓ Tedarikçi - Başlangıç (id={tier_sup_starter.id})")

        # Profesyonel
        tier_sup_professional = SubscriptionPlanTier(
            tenant_type_id=supplier.id,
            tier_code="profesyonel",
            tier_name="Profesyonel",
            description="Aktif tedarikçiler - 500 teklif/ay",
            trial_days=7,
            trial_daily_price=0.00,
            post_trial_monthly_price=79.99,
            post_trial_annual_price=799.90,
            trial_supplier_limit=None,
            trial_project_limit=None,
            trial_user_limit=5,
            trial_transaction_limit=50,
            post_trial_supplier_limit=None,
            post_trial_project_limit=None,
            post_trial_user_limit=5,
            post_trial_transaction_limit=500,
            display_order=2,
            is_active=True,
        )
        db.add(tier_sup_professional)
        db.flush()
        print(f"  ✓ Tedarikçi - Profesyonel (id={tier_sup_professional.id})")

        # ============================================================================
        # 3) PREMIUM FEATURES
        # ============================================================================

        print("\n🎁 Creating Premium Features...")

        premium_features = [
            {
                "code": "dwg_import",
                "name": "DWG Keşif Listesi Hazırlama",
                "description": "DWG formatından keşif listesi otomatik hazırlama",
                "available_for_tenant_types": '["strategic_partner"]',
                "monthly_price": 49.99,
                "annual_price": 499.90,
            },
            {
                "code": "exclusive_suppliers",
                "name": "Özel Tedarikçi Havuzu",
                "description": "Seçilmiş tedarikçilerle çalışma",
                "available_for_tenant_types": '["strategic_partner"]',
                "monthly_price": 99.99,
                "annual_price": 999.90,
            },
            {
                "code": "special_listing",
                "name": "Özel Teklifler Listeleme",
                "description": "Seçilmiş müşterilere özel teklifler göster",
                "available_for_tenant_types": '["strategic_partner", "supplier"]',
                "monthly_price": 29.99,
                "annual_price": 299.90,
            },
            {
                "code": "advanced_analytics",
                "name": "Gelişmiş Analitik",
                "description": "Detaylı raporlar, trend analizi, performans metrikleri",
                "available_for_tenant_types": '["strategic_partner", "supplier"]',
                "monthly_price": 49.99,
                "annual_price": 499.90,
            },
            {
                "code": "api_access",
                "name": "API Entegrasyonu",
                "description": "REST API access, webhook'lar",
                "available_for_tenant_types": '["strategic_partner"]',
                "monthly_price": 199.99,
                "annual_price": 1999.90,
            },
            {
                "code": "priority_support",
                "name": "Öncelikli Destek",
                "description": "7/24 canlı destek, öncelikli taşınım",
                "available_for_tenant_types": '["strategic_partner", "supplier"]',
                "monthly_price": 149.99,
                "annual_price": 1499.90,
            },
        ]

        for i, feature_data in enumerate(premium_features, start=1):
            feature = PremiumFeature(
                code=feature_data["code"],
                name=feature_data["name"],
                description=feature_data["description"],
                available_for_tenant_types=feature_data["available_for_tenant_types"],
                monthly_price=feature_data["monthly_price"],
                annual_price=feature_data["annual_price"],
                display_order=i,
                is_active=True,
            )
            db.add(feature)
            db.flush()
            print(f"  ✓ {feature_data['name']} (id={feature.id})")

        db.commit()
        print("\n✅ Seed successful!")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Seed failed: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_onboarding_saas()
