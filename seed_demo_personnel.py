#!/usr/bin/env python3
"""
Demo personel seed scripti.
Her iş rolü için birer kullanıcı oluşturur.
Şifre: Aa123!!
"""

import sys

sys.path.insert(0, "d:/Projects/procureflow")

from api.db.session import SessionLocal
from api.models.user import User
from api.core.security import get_password_hash

PASSWORD = "Aa123!!"

DEMO_USERS = [
    {
        "email": "super_admin@demo.procureflow.com",
        "full_name": "Platform Süper Admin",
        "role": "super_admin",
        "system_role": "super_admin",
        "approval_limit": 9999999,
    },
    {
        "email": "tenant_admin@demo.procureflow.com",
        "full_name": "Tenant Yöneticisi",
        "role": "admin",
        "system_role": "tenant_admin",
        "approval_limit": 5000000,
    },
    {
        "email": "tenant_uye@demo.procureflow.com",
        "full_name": "Tenant Üye",
        "role": "satinalmaci",
        "system_role": "tenant_member",
        "approval_limit": 50000,
    },
    {
        "email": "direktoru@demo.procureflow.com",
        "full_name": "Ahmet Direktör",
        "role": "satinalma_direktoru",
        "system_role": "tenant_member",
        "approval_limit": 2000000,
    },
    {
        "email": "yoneticisi@demo.procureflow.com",
        "full_name": "Fatma Yöneticisi",
        "role": "satinalma_yoneticisi",
        "system_role": "tenant_member",
        "approval_limit": 500000,
    },
    {
        "email": "uzman@demo.procureflow.com",
        "full_name": "Mehmet Uzman",
        "role": "satinalma_uzmani",
        "system_role": "tenant_member",
        "approval_limit": 100000,
    },
    {
        "email": "satinalmaci@demo.procureflow.com",
        "full_name": "Ayşe Satınalmacı",
        "role": "satinalmaci",
        "system_role": "tenant_member",
        "approval_limit": 25000,
    },
    {
        "email": "platform_support@demo.procureflow.com",
        "full_name": "Platform Destek",
        "role": "admin",
        "system_role": "platform_support",
        "approval_limit": 0,
    },
    {
        "email": "platform_operator@demo.procureflow.com",
        "full_name": "Platform Operator",
        "role": "admin",
        "system_role": "platform_operator",
        "approval_limit": 0,
    },
    {
        "email": "tenant_owner@demo.procureflow.com",
        "full_name": "Tenant Owner",
        "role": "admin",
        "system_role": "tenant_owner",
        "approval_limit": 7000000,
    },
    {
        "email": "supplier_user@demo.procureflow.com",
        "full_name": "Supplier User",
        "role": "supplier_user",
        "system_role": "supplier_user",
        "approval_limit": 0,
    },
    {
        "email": "channel_owner@demo.procureflow.com",
        "full_name": "Channel Account Owner",
        "role": "admin",
        "system_role": "tenant_member",
        "scope_type": "channel",
        "role_profile_code": "channel.account_owner",
        "approval_limit": 0,
    },
]

db = SessionLocal()
hashed = get_password_hash(PASSWORD)

created = []
skipped = []

try:
    for u in DEMO_USERS:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if existing:
            skipped.append(u["email"])
            continue
        user = User(
            email=u["email"],
            full_name=u["full_name"],
            hashed_password=hashed,
            role=u["role"],
            system_role=u["system_role"],
            scope_type=u.get("scope_type"),
            role_profile_code=u.get("role_profile_code"),
            approval_limit=u["approval_limit"],
            is_active=True,
        )
        db.add(user)
        created.append(u["email"])

    db.commit()

    print("\n✅ Demo Personel Seed Tamamlandı\n")
    print(f"{'E-posta':<45} {'Şifre':<12} {'İş Rolü':<30} {'Sistem Rolü'}")
    print("-" * 120)
    for u in DEMO_USERS:
        status = "YENİ" if u["email"] in created else "VAR"
        print(
            f"[{status}] {u['email']:<43} {PASSWORD:<12} {u['role']:<30} {u['system_role']}"
        )

    if skipped:
        print(f"\nℹ️  Zaten mevcut olduğu için atlananlar: {', '.join(skipped)}")

finally:
    db.close()
