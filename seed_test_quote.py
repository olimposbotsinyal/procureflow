#!/usr/bin/env python3
"""Create sample quote and send to supplier for testing"""

import sys

sys.path.insert(0, "d:/Projects/procureflow")

from datetime import datetime, UTC
from decimal import Decimal
from api.db.session import SessionLocal
from api.models import (
    Quote,
    QuoteItem,
    SupplierQuote,
    SupplierQuoteItem,
    Supplier,
    User,
    Project,
)

db = SessionLocal()

try:
    # Get supplier
    supplier = db.query(Supplier).filter(Supplier.id == 1).first()
    if not supplier:
        print("❌ Supplier not found")
        exit(1)

    # Get admin user
    admin = db.query(User).filter(User.role == "super_admin").first()
    if not admin:
        print("❌ Admin user not found")
        exit(1)

    # Get project
    project = db.query(Project).first()
    if not project:
        print("❌ No project found")
        exit(1)

    print(f"✅ Admin: {admin.email}")
    print(f"✅ Project: {project.name}")
    print(f"✅ Supplier: {supplier.company_name}")

    # Check if test quote already exists
    existing_quote = (
        db.query(Quote).filter(Quote.title == "TEST Quote for Supplier").first()
    )

    if existing_quote:
        print(f"ℹ️  Quote already exists: {existing_quote.id}")
        quote = existing_quote
    else:
        # Create quote
        quote = Quote(
            title="TEST Quote for Supplier",
            description="Test quote to verify supplier portal",
            project_id=project.id,
            company_name=project.name,
            company_contact_name=admin.full_name or "Admin",
            company_contact_phone="+90-555-1234",
            company_contact_email=admin.email,
            created_by_id=admin.id,
            assigned_to_id=admin.id,
            currency="TRL",
        )
        db.add(quote)
        db.flush()
        print(f"✅ Created quote: {quote.id}")

        # Add quote items
        items_data = [
            {
                "description": "Item 1",
                "quantity": 10,
                "unit": "pcs",
                "unit_price": Decimal("100.00"),
            },
            {
                "description": "Item 2",
                "quantity": 5,
                "unit": "box",
                "unit_price": Decimal("500.00"),
            },
        ]

        for item_data in items_data:
            item = QuoteItem(
                quote_id=quote.id,
                description=item_data["description"],
                quantity=item_data["quantity"],
                unit=item_data["unit"],
                unit_price=item_data["unit_price"],
                vat_rate=Decimal("18.00"),
            )
            db.add(item)

        db.commit()
        print(f"✅ Added quote items")

    # Check if supplier quote already exists
    existing_sq = (
        db.query(SupplierQuote)
        .filter(
            SupplierQuote.quote_id == quote.id, SupplierQuote.supplier_id == supplier.id
        )
        .first()
    )

    if existing_sq:
        print(f"✅ Supplier quote already exists: {existing_sq.id}")
    else:
        # Create supplier quote
        sq = SupplierQuote(
            quote_id=quote.id,
            supplier_id=supplier.id,
            total_amount=Decimal("3500.00"),
            status="gönderilen",
        )
        db.add(sq)
        db.flush()
        print(f"✅ Created supplier quote: {sq.id}")

        # Add supplier quote items
        for idx, item_data in enumerate(items_data):
            sqi = SupplierQuoteItem(
                supplier_quote_id=sq.id,
                quote_item_id=quote.items[idx].id if idx < len(quote.items) else None,
                description=item_data["description"],
                unit=item_data["unit"],
                quantity=item_data["quantity"],
                original_unit_price=item_data["unit_price"],
                supplier_unit_price=item_data["unit_price"],
                supplier_total_price=item_data["quantity"] * item_data["unit_price"],
            )
            db.add(sqi)

        db.commit()
        print(f"✅ Added supplier quote items")

    print("\n✅ Test data created successfully!")
    print(f"   Quote ID: {quote.id}")
    print(f"   Supplier: {supplier.company_name}")

finally:
    db.close()
