#!/usr/bin/env python3
"""Create test supplier user and sample quotes for testing"""

import sys

sys.path.insert(0, "d:/Projects/procureflow")

from datetime import datetime, UTC
from api.db.session import SessionLocal
from api.models import (
    Supplier,
    SupplierUser,
    Quote,
    QuoteItem,
    SupplierQuote,
    SupplierQuoteItem,
    Project,
    User,
)
from api.core.security import get_password_hash

db = SessionLocal()

try:
    # Get or create supplier
    supplier = db.query(Supplier).filter(Supplier.id == 1).first()
    if not supplier:
        print("❌ Supplier 1 not found")
        exit(1)

    print(f"✅ Found supplier: {supplier.company_name}")

    # Check if supplier user exists
    sup_user = (
        db.query(SupplierUser).filter(SupplierUser.supplier_id == supplier.id).first()
    )

    if not sup_user:
        # Create supplier user
        sup_user = SupplierUser(
            supplier_id=supplier.id,
            email="supplier1@example.com",
            name="Supplier One",
            hashed_password=get_password_hash("password123"),
            is_active=True,
            password_set=True,
        )
        db.add(sup_user)
        db.commit()
        print(f"✅ Created supplier user: {sup_user.email}")
    else:
        print(f"✅ Supplier user exists: {sup_user.email}")

    # Check if there are supplier quotes
    existing_quotes = (
        db.query(SupplierQuote).filter(SupplierQuote.supplier_id == supplier.id).all()
    )

    if existing_quotes:
        print(f"✅ Found {len(existing_quotes)} existing quotes")
        for sq in existing_quotes:
            items = (
                db.query(SupplierQuoteItem)
                .filter(SupplierQuoteItem.supplier_quote_id == sq.id)
                .all()
            )
            print(f"   - Quote {sq.id}: {len(items)} items")
    else:
        print("ℹ️  No supplier quotes found - this is OK for testing")

    print("\n✅ Seed complete!")

finally:
    db.close()
