"""Quote ve Teklif İsteği (RFQ) API Endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from io import BytesIO
import openpyxl
import pandas as pd
from decimal import Decimal

from api.database import get_db
from api.models import (
    Quote,
    QuoteItem,
    Supplier,
    SupplierUser,
    SupplierQuote,
    SupplierQuoteItem,
    User,
    Project,
    QuoteStatus,
    QuoteApproval,
)
from api.schemas.quote import (
    QuoteCreate,
    QuoteOut,
    QuoteUpdate,
    QuoteItemCreate,
    QuoteItemOut,
)
from api.schemas.supplier import SupplierCreate, SupplierOut, SupplierQuoteOut
from api.core.deps import get_current_user
from api.core.time import utcnow
from api.services.user_department_service import resolve_effective_department_id
from api.services.email_service import get_email_service

router = APIRouter(prefix="/quotes", tags=["quotes"])


def _to_float(value):
    if value is None:
        return None
    if isinstance(value, (int, float, Decimal)):
        return float(value)
    text = (
        str(value)
        .replace("TL", "")
        .replace("₺", "")
        .replace(".", "")
        .replace(",", ".")
        .strip()
    )
    if not text:
        return None
    try:
        return float(text)
    except Exception:
        return None


# ============ QUOTE CRUDS ============


@router.post("", response_model=QuoteOut)
def create_quote(
    quote_data: QuoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Yeni teklif isteği (RFQ) oluştur"""
    # Proje var mı kontrol et
    project = db.query(Project).filter(Project.id == quote_data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    quote = Quote(
        project_id=quote_data.project_id,
        created_by_id=current_user.id,
        title=quote_data.title,
        description=quote_data.description,
        company_name=quote_data.company_name,
        company_contact_name=quote_data.company_contact_name,
        company_contact_phone=quote_data.company_contact_phone,
        company_contact_email=quote_data.company_contact_email,
        status=QuoteStatus.DRAFT,
    )

    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


@router.get("")
def list_quotes(
    page: int = 1,
    size: int = 10,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Kullanıcının tekliflerini listele"""
    query = db.query(Quote).filter(
        Quote.created_by_id == current_user.id, Quote.is_active == True
    )

    if status_filter:
        query = query.filter(Quote.status == status_filter.upper())

    total = query.count()
    quotes = (
        query.order_by(Quote.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    # Pydantic modelle serialize et
    from api.schemas.quote import QuoteOut

    return {
        "items": [QuoteOut.model_validate(q) for q in quotes],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/{quote_id}", response_model=QuoteOut)
def get_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklif detayını getir"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")
    return quote


@router.get("/project/{project_id}", response_model=list[QuoteOut])
def get_project_quotes(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Proje tekliflerini listele"""
    quotes = (
        db.query(Quote)
        .filter(
            Quote.project_id == project_id,
            Quote.is_active == True,
            Quote.deleted_at.is_(None),
        )
        .order_by(Quote.created_at.desc())
        .all()
    )
    return quotes


@router.put("/{quote_id}", response_model=QuoteOut)
def update_quote(
    quote_id: int,
    quote_data: QuoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklifi güncelle (taslak durumda)"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    if quote.status != QuoteStatus.DRAFT:
        raise HTTPException(
            status_code=400, detail="Sadece taslak teklifler güncellenebilir"
        )

    if quote.created_by_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Sadece oluşturan kişi güncelleyebilir"
        )

    for field, value in quote_data.dict(exclude_unset=True).items():
        if hasattr(quote, field):
            setattr(quote, field, value)

    quote.updated_at = utcnow()
    db.commit()
    db.refresh(quote)
    return quote


# ============ QUOTE ITEM CRUD ============


@router.post("/{quote_id}/items", response_model=QuoteItemOut)
def add_quote_item(
    quote_id: int,
    item_data: QuoteItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklif kalemleri ekle"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    if quote.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Yetkisiz")

    item = QuoteItem(quote_id=quote_id, **item_data.model_dump())

    # Total price hesapla
    if item.unit_price and item.quantity:
        item.total_price = float(item.unit_price) * float(item.quantity)

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/{quote_id}/items", response_model=list[QuoteItemOut])
def get_quote_items(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklifin kalemlerini getir"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    items = (
        db.query(QuoteItem)
        .filter(QuoteItem.quote_id == quote_id)
        .order_by(QuoteItem.sequence)
        .all()
    )
    return items


# ============ EXCEL IMPORT ============


@router.post("/import/excel/{project_id}")
def import_quote_from_excel(
    project_id: int,
    file: UploadFile = File(...),
    company_name: str = Form(...),
    company_contact_name: str = Form(...),
    company_contact_phone: str = Form(...),
    company_contact_email: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Excel dosyasından teklif oluştur
    Dosya PİZZAMAX_TEKLİF_ formatında olmalı
    """
    if not file.filename.endswith((".xlsx", ".xlsm")):
        raise HTTPException(
            status_code=400, detail="Sadece Excel dosyaları yükleneebilir"
        )

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    effective_department_id = current_user.department_id
    if current_user.role not in {"admin", "super_admin"}:
        effective_department_id = resolve_effective_department_id(db, current_user)

    if (
        current_user.role not in {"admin", "super_admin"}
        and effective_department_id is None
    ):
        raise HTTPException(status_code=422, detail="Kullaniciya departman atanmamis")

    try:
        # Excel dosyasını oku
        excel_data = file.file.read()
        wb = openpyxl.load_workbook(BytesIO(excel_data))
        ws = wb.active

        # Quote oluştur
        quote = Quote(
            project_id=project_id,
            created_by_id=current_user.id,
            title=f"{project.name} - Teklif İsteği",
            company_name=company_name,
            company_contact_name=company_contact_name,
            company_contact_phone=company_contact_phone,
            company_contact_email=company_contact_email,
            status=QuoteStatus.DRAFT,
            department_id=effective_department_id,
            assigned_to_id=current_user.id,
        )

        db.add(quote)
        db.flush()  # ID'sini almak için

        # Excel'den kalemler oku
        sequence = 0
        total_amount = 0

        # Veri başlangıç satırı (8. satır header satırı)
        for row_idx, row in enumerate(
            ws.iter_rows(min_row=9, values_only=False), start=9
        ):
            # Boş satırları atla
            if not row[1].value:
                continue

            # Kategori başlığı satırlarını atla (number, None, None, açıklama...)
            try:
                # SIRA NO (Column B = index 1)
                line_number = row[1].value
                if line_number is None:
                    continue

                # POZ (Column C = index 2)
                category_code = row[2].value or ""

                # YAPILACAK İŞLER (Columns D-H = indices 3-7)
                description = row[4].value or ""  # Column E

                # BRM (Column I = index 8)
                unit = row[8].value or "adet"

                # MİKTAR (Column J = index 9)
                quantity = row[9].value

                # BİRİM FİYAT (Column K = index 10) - RFQ aşamasında tedarikçi doldurur
                unit_price = 0

                # Grup başlığı satırı (ör: 1 ALÇIPAN İŞLERİ ... toplam)
                line_as_text = str(line_number)
                if "." not in line_as_text:
                    if description:
                        group_item = QuoteItem(
                            quote_id=quote.id,
                            line_number=line_as_text,
                            category_code="",
                            category_name="",
                            description=str(description),
                            unit="",
                            quantity=0,
                            unit_price=None,
                            vat_rate=20,
                            group_key=line_as_text,
                            is_group_header=True,
                            total_price=None,
                            sequence=sequence,
                        )
                        db.add(group_item)
                        sequence += 1
                    continue

                if quantity is None:
                    continue

                item = QuoteItem(
                    quote_id=quote.id,
                    line_number=str(line_number),
                    category_code="",
                    category_name="",
                    description=str(description),
                    unit=str(unit),
                    quantity=float(quantity),
                    unit_price=0,
                    vat_rate=20,
                    group_key=str(line_number).split(".")[0]
                    if "." in str(line_number)
                    else str(line_number),
                    is_group_header=False,
                    sequence=sequence,
                )

                # Total price hesapla
                item.total_price = 0

                db.add(item)
                sequence += 1

            except (ValueError, AttributeError, TypeError):
                # Veri dönüşüm hatalarını atla
                continue

        quote.total_amount = total_amount
        db.commit()
        db.refresh(quote)

        return {
            "status": "success",
            "quote_id": quote.id,
            "items_count": sequence,
            "total_amount": total_amount,
            "message": f"{sequence} kalem başarıyla yüklendi",
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Excel yükleme hatası: {str(e)}")


# ============ SEND TO SUPPLIERS ============


@router.post("/{quote_id}/send-to-suppliers")
def send_quote_to_supplier(
    quote_id: int,
    supplier_ids: list[int],
    deadline_days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    email_service=Depends(get_email_service),
):
    """Teklifi tedarikçilere gönder"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    if quote.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Yetkisiz")

    if not quote.items:
        raise HTTPException(
            status_code=400, detail="Gönderim için teklifte en az bir kalem olmalıdır"
        )

    try:
        created_count = 0

        for supplier_id in supplier_ids:
            supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
            if not supplier:
                continue

            existing_supplier_quote = (
                db.query(SupplierQuote)
                .filter(
                    SupplierQuote.quote_id == quote_id,
                    SupplierQuote.supplier_id == supplier_id,
                    SupplierQuote.is_revised_version == False,
                )
                .first()
            )
            if existing_supplier_quote:
                continue

            supplier_quote = SupplierQuote(
                quote_id=quote_id,
                supplier_id=supplier_id,
                status="gönderilen",
                total_amount=0,
                final_amount=0,
                revision_number=0,
                is_revised_version=False,
            )
            db.add(supplier_quote)
            db.flush()

            for item in quote.items:
                db.add(
                    SupplierQuoteItem(
                        supplier_quote_id=supplier_quote.id,
                        quote_item_id=item.id,
                        unit_price=0,
                        total_price=0,
                        revision_number=0,
                    )
                )

            created_count += 1

        quote.status = QuoteStatus.SENT
        quote.sent_at = utcnow()
        quote.deadline = utcnow() + timedelta(days=deadline_days)

        db.commit()

        # Tedarikçilere email bildirimi gönder
        workspace_url = email_service.app_url + "/supplier/workspace"
        for supplier_id in supplier_ids:
            supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
            if not supplier:
                continue
            # Tedarikçiye bağlı tüm aktif kullanıcılara mail gönder
            supplier_users = (
                db.query(SupplierUser)
                .filter(
                    SupplierUser.supplier_id == supplier_id,
                    SupplierUser.is_active == True,
                )
                .all()
            )
            for su in supplier_users:
                try:
                    email_service.send_new_quote_to_supplier(
                        to_email=su.email,
                        supplier_name=supplier.company_name,
                        quote_title=quote.title,
                        deadline_days=deadline_days,
                        workspace_url=workspace_url,
                    )
                except Exception:
                    pass  # Email hatası işlemi durdurmaz

        return {
            "status": "success",
            "message": f"Teklif {created_count} tedarikçiye gönderilmiştir",
            "deadline": quote.deadline,
        }
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Tedarikçiye gönderim sırasında hata oluştu: {str(exc)}",
        )


# ============ SELECT SUPPLIER & CREATE PO ============


@router.post("/{quote_id}/select-supplier")
def select_supplier(
    quote_id: int,
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tedarikçi seçimi yap ve satın alma emri oluştur"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    if quote.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Yetkisiz")

    # Seçili tedarikçinin yanıtını bul
    supplier_quote = (
        db.query(SupplierQuote)
        .filter(
            SupplierQuote.quote_id == quote_id, SupplierQuote.supplier_id == supplier_id
        )
        .first()
    )

    if not supplier_quote:
        raise HTTPException(status_code=404, detail="Tedarikçi yanıtı bulunamadı")

    # Quote'un statusunu güncelle
    quote.status = QuoteStatus.APPROVED
    quote.selected_supplier_id = supplier_id
    quote.approved_at = utcnow()

    # Diğer tedarikçilerin yanıtlarını red et (opsiyonel)
    other_quotes = (
        db.query(SupplierQuote)
        .filter(
            SupplierQuote.quote_id == quote_id, SupplierQuote.supplier_id != supplier_id
        )
        .all()
    )

    for other_quote in other_quotes:
        other_quote.status = "kapatıldı_yüksek_fiyat"

    db.commit()

    return {
        "status": "success",
        "message": f"Tedarikçi başarıyla seçildi",
        "supplier_id": supplier_id,
        "supplier_name": supplier_quote.supplier.name,
        "final_amount": supplier_quote.final_amount,
        "order_date": utcnow().isoformat(),
    }


# ============ QUOTE HISTORY ============


@router.get("/{quote_id}/history")
def get_quote_history(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklifin geçmiş ve durum değişikliklerini al"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Quote history
    history = {
        "quote_id": quote.id,
        "title": quote.title,
        "created_at": quote.created_at.isoformat() if quote.created_at else None,
        "timeline": [
            {
                "event": "Teklif Oluşturuldu",
                "timestamp": quote.created_at.isoformat() if quote.created_at else None,
                "details": f"Tarafından: {quote.created_by.full_name if quote.created_by else 'Sistem'}",
            }
        ],
    }

    # Gönderme tarihi
    if quote.sent_at:
        history["timeline"].append(
            {
                "event": "Tedarikçilere Gönderildi",
                "timestamp": quote.sent_at.isoformat(),
                "details": f"Deadline: {quote.deadline.isoformat() if quote.deadline else 'Belirlenmemiş'}",
            }
        )

    # Onay geçmişi
    approvals = (
        db.query(QuoteApproval)
        .filter(QuoteApproval.quote_id == quote_id)
        .order_by(QuoteApproval.created_at)
        .all()
    )

    for approval in approvals:
        if approval.approved_at:
            history["timeline"].append(
                {
                    "event": f"Onaylama: {approval.approval_level}",
                    "status": "Onaylandı",
                    "timestamp": approval.approved_at.isoformat(),
                    "details": f"Tarafından: {approval.approver.full_name if approval.approver else 'Sistem'}",
                    "comment": approval.comment,
                }
            )
        elif approval.rejected_at:
            history["timeline"].append(
                {
                    "event": f"Onaylanmadı: {approval.approval_level}",
                    "status": "Reddedildi",
                    "timestamp": approval.rejected_at.isoformat(),
                    "details": f"Tarafından: {approval.approver.full_name if approval.approver else 'Sistem'}",
                    "reason": approval.rejection_reason,
                }
            )
        else:
            history["timeline"].append(
                {
                    "event": f"Onay Bekleniyor: {approval.approval_level}",
                    "status": "Beklemede",
                    "timestamp": approval.created_at.isoformat(),
                    "details": f"Sorumlu: {approval.approver.full_name if approval.approver else 'Atanmadı'}",
                }
            )

    # Tedarikçi yanıtları
    supplier_quotes = (
        db.query(SupplierQuote).filter(SupplierQuote.quote_id == quote_id).all()
    )

    for sq in supplier_quotes:
        if sq.submitted_at:
            history["timeline"].append(
                {
                    "event": "Tedarikçi Yanıtı Alındı",
                    "timestamp": sq.submitted_at.isoformat(),
                    "details": f"Tedarikçi: {sq.supplier.name}",
                    "amount": float(sq.final_amount),
                    "status": "Gönderildi",
                }
            )
        else:
            history["timeline"].append(
                {
                    "event": "Tedarikçi Yanıtı Bekleniyor",
                    "timestamp": sq.created_at.isoformat(),
                    "details": f"Tedarikçi: {sq.supplier.name}",
                    "status": "Beklemede",
                }
            )

    # Seçim tarihi
    if quote.approved_at:
        history["timeline"].append(
            {
                "event": "Tedarikçi Seçildi",
                "timestamp": quote.approved_at.isoformat(),
                "details": f"Seçilen Tedarikçi: {quote.selected_supplier.name if quote.selected_supplier else 'Silinmiş'}",
            }
        )

    # Timeline'ı sırala (en yeni en sonda)
    history["timeline"].sort(key=lambda x: x["timestamp"] or "")
    history["current_status"] = quote.status.value

    return history
