"""Approval Workflow Endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, UTC
from enum import Enum
from pydantic import BaseModel

from api.database import get_db
from api.models import Quote, QuoteApproval, User, Role
from api.core.deps import get_current_user
from api.schemas.quote import QuoteApprovalCreate, QuoteApprovalOut
from api.services.email_service import get_email_service

router = APIRouter(prefix="/approvals", tags=["approvals"])


# ============ SCHEMAS ============


class ApprovalAction(str, Enum):
    """Onay aksiyonları"""

    APPROVE = "onay"
    REJECT = "red"


class ApprovalCommentRequest(BaseModel):
    """Onay işlemi - yorum"""

    comment: str | None = None


class ApprovalRejectRequest(BaseModel):
    """Red işlemi - zorunlu yorum"""

    comment: str


# ============ ENDPOINTS ============


@router.get("/user/pending")
def get_user_pending_approvals(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Kullanıcının onaylaması gereken teklifleri getir"""

    user_role = current_user.role if current_user.role else None

    if not user_role:
        return []

    # Bu role ait beklemede onaylar
    pending_approvals = (
        db.query(QuoteApproval)
        .filter(
            QuoteApproval.required_role == user_role,
            QuoteApproval.status == "beklemede",
        )
        .all()
    )

    result = []
    for approval in pending_approvals:
        quote = approval.quote
        result.append(
            {
                "approval_id": approval.id,
                "quote_id": quote.id,
                "quote_title": quote.title,
                "quote_status": quote.status,
                "total_amount": float(quote.total_amount or 0),
                "company_name": quote.company_name,
                "approval_level": approval.approval_level,
                "requested_at": approval.requested_at,
                "created_at": quote.created_at,
            }
        )

    return result


@router.post("/{quote_id}/request-approvals")
def request_approvals(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    email_service=Depends(get_email_service),
):
    """Teklif için onay isteklerini oluştur (Quote gönderilirken çağrılır)"""

    # Quote'u al
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Sadece creator tarafından istek açılabilir
    if quote.created_by_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Sadece oluşturan kişi onay talep edebilir"
        )

    try:
        # Yönetici rol ID'sini bulunacak
        yonetici_role = db.query(Role).filter(Role.name == "Yönetici").first()
        direktor_role = db.query(Role).filter(Role.name == "Direktör").first()

        if not yonetici_role or not direktor_role:
            raise HTTPException(
                status_code=500, detail="Sistem rolleri yapılandırılmamış"
            )

        # Mevcut onayları temizle (varsa)
        existing = (
            db.query(QuoteApproval).filter(QuoteApproval.quote_id == quote_id).all()
        )
        for app in existing:
            if app.status == "beklemede":
                db.delete(app)

        # Level 1: Yönetici Onayı
        approval_level1 = QuoteApproval(
            quote_id=quote_id,
            approval_level=1,
            required_role="Yönetici",
            status="beklemede",
            requested_at=datetime.now(UTC),
        )
        db.add(approval_level1)
        db.flush()

        # Level 2: Direktör Onayı
        approval_level2 = QuoteApproval(
            quote_id=quote_id,
            approval_level=2,
            required_role="Direktör",
            status="beklemede",
            requested_at=datetime.now(UTC),
        )
        db.add(approval_level2)
        db.commit()

        # Email gönder - Yöneticilere
        yonetici_users = (
            db.query(User)
            .join(User.role_obj)
            .filter(User.role_obj.has(Role.name == "Yönetici"))
            .all()
        )

        for yonetici in yonetici_users:
            if yonetici.email:
                email_service.send_approval_request(
                    to_email=yonetici.email,
                    approver_name=yonetici.full_name or yonetici.email,
                    quote_title=quote.title,
                    total_amount=float(quote.total_amount or 0),
                    approval_level="Yönetici Onayı",
                    approval_url=f"http://localhost:5177/approvals?quote_id={quote.id}",
                    company_name="ProcureFlow",
                )

        return {
            "status": "success",
            "message": "Onay istekleri oluşturuldu",
            "approvals": 2,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{quote_id}/pending")
def get_pending_approvals(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Teklif için beklemede olan onayları getir"""

    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    approvals = (
        db.query(QuoteApproval)
        .filter(QuoteApproval.quote_id == quote_id)
        .order_by(QuoteApproval.approval_level)
        .all()
    )

    return [
        {
            "id": a.id,
            "level": a.approval_level,
            "required_role": a.required_role,
            "status": a.status,
            "requested_at": a.requested_at,
            "completed_at": a.completed_at,
            "approver_name": a.approved_by.full_name if a.approved_by else None,
            "comment": a.comment,
        }
        for a in approvals
    ]


@router.post("/{quote_id}/approve")
def approve_quote(
    quote_id: int,
    request: ApprovalCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    email_service=Depends(get_email_service),
):
    """Teklifi onayla"""

    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Kullanıcının rolü belirle
    user_role = current_user.role_obj.name if current_user.role_obj else None

    # Beklemede olan onay bul
    pending_approval = (
        db.query(QuoteApproval)
        .filter(QuoteApproval.quote_id == quote_id, QuoteApproval.status == "beklemede")
        .order_by(QuoteApproval.approval_level)
        .first()
    )

    if not pending_approval:
        raise HTTPException(
            status_code=400, detail="Bu teklif için beklemede onay bulunmamaktadır"
        )

    # Kullanıcının yetki kontrolü
    if pending_approval.required_role not in ["*", user_role]:
        raise HTTPException(
            status_code=403,
            detail=f"Sadece {pending_approval.required_role} bu onayı yapabilir",
        )

    try:
        # Onayı tamamla
        pending_approval.approved_by_id = current_user.id
        pending_approval.status = "onaylandı"
        pending_approval.completed_at = datetime.now(UTC)
        pending_approval.comment = request.comment

        # Bir sonraki onay var mı kontrol et
        next_approval = (
            db.query(QuoteApproval)
            .filter(
                QuoteApproval.quote_id == quote_id,
                QuoteApproval.approval_level == pending_approval.approval_level + 1,
            )
            .first()
        )

        if next_approval:
            # Sonraki seviyeye git
            quote.status = "PENDING"  # Hala beklemede

            # Email gönder - Sonraki seviye onaylayana
            if next_approval.required_role == "Direktör":
                direktor_users = (
                    db.query(User)
                    .join(User.role_obj)
                    .filter(User.role_obj.has(Role.name == "Direktör"))
                    .all()
                )

                for direktor in direktor_users:
                    if direktor.email:
                        email_service.send_approval_request(
                            to_email=direktor.email,
                            approver_name=direktor.full_name or direktor.email,
                            quote_title=quote.title,
                            total_amount=float(quote.total_amount or 0),
                            approval_level="Direktör Onayı",
                            approval_url=f"http://localhost:5177/approvals?quote_id={quote.id}",
                            company_name="ProcureFlow",
                        )
        else:
            # Tüm onaylar tamamlandı
            quote.status = "APPROVED"

            # Email gönder - Teklifin onaylandı bilgisi
            if quote.created_by.email:
                email_service._send_smtp(
                    to_email=quote.created_by.email,
                    subject=f"✅ {quote.title} - Teklif Onaylandı",
                    html_content=f"""
                    <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2>Teklif Onaylandı</h2>
                            <p><strong>{quote.title}</strong> teklifini tüm seviyelerde onaylayan kişiler tarafından onaylandı.</p>
                            <p><strong>Toplam Tutar:</strong> ₺{float(quote.total_amount or 0):,.2f}</p>
                            <p>Tedarikçilere gönderme işlemini başlatabilirsiniz.</p>
                        </body>
                    </html>
                    """,
                )

        db.commit()

        return {
            "status": "success",
            "message": "Teklif onaylandı",
            "next_step": "Direktöre gönderiliyor"
            if next_approval
            else "Onay tamamlandı",
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{quote_id}/reject")
def reject_quote(
    quote_id: int,
    request: ApprovalRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    email_service=Depends(get_email_service),
):
    """Teklifi reddet"""

    if not request.comment:
        raise HTTPException(status_code=400, detail="Red nedeni yazmanız gerekir")

    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Kullanıcının rolü
    user_role = current_user.role_obj.name if current_user.role_obj else None

    # Beklemede olan onay bul
    pending_approval = (
        db.query(QuoteApproval)
        .filter(QuoteApproval.quote_id == quote_id, QuoteApproval.status == "beklemede")
        .order_by(QuoteApproval.approval_level)
        .first()
    )

    if not pending_approval:
        raise HTTPException(
            status_code=400, detail="Bu teklif için beklemede onay bulunmamaktadır"
        )

    # Yetki kontrolü
    if pending_approval.required_role not in ["*", user_role]:
        raise HTTPException(
            status_code=403,
            detail=f"Sadece {pending_approval.required_role} bu kararı verebilir",
        )

    try:
        # Onayı reddet
        pending_approval.approved_by_id = current_user.id
        pending_approval.status = "reddedildi"
        pending_approval.completed_at = datetime.now(UTC)
        pending_approval.comment = request.comment

        # Tüm diğer onayları iptal et
        other_approvals = (
            db.query(QuoteApproval)
            .filter(
                QuoteApproval.quote_id == quote_id,
                QuoteApproval.id != pending_approval.id,
            )
            .all()
        )

        for other in other_approvals:
            if other.status == "beklemede":
                other.status = "iptal"

        # Quote'u reddet
        quote.status = "REJECTED"

        # Email gönder - Oluşturucuya
        if quote.created_by.email:
            email_service._send_smtp(
                to_email=quote.created_by.email,
                subject=f"❌ {quote.title} - Teklif Reddedildi",
                html_content=f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Teklif Reddedildi</h2>
                        <p><strong>{quote.title}</strong> teklifini {current_user.full_name or 'Yönetici'} tarafından reddedildi.</p>
                        
                        <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <strong>Red Nedeni:</strong><br>
                            {request.comment}
                        </div>
                        
                        <p>Teklifi düzenleyerek tekrar gönderebilirsiniz.</p>
                    </body>
                </html>
                """,
            )

        db.commit()

        return {
            "status": "success",
            "message": "Teklif reddedildi",
            "reason": request.comment,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
