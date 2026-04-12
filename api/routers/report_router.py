"""Raporlama ve Analiz API Endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from decimal import Decimal
from statistics import median

from api.database import get_db
from api.models import (
    Quote,
    SupplierQuote,
    SupplierQuoteItem,
    Supplier,
    SupplierUser,
    User,
    QuoteApproval,
)
from api.models.report import QuoteComparison, SupplierRating, PriceAnalysis, Contract
from api.schemas.report import (
    SupplierRatingCreate,
    SupplierRatingOut,
    PriceAnalysisOut,
    QuoteComparisonOut,
    QuoteComparisonMetric,
    ReportingDashboardData,
    ContractOut,
)
from api.core.deps import get_current_user
from api.core.time import utcnow

router = APIRouter(prefix="/reports", tags=["reports"])


# ============ PRICE ANALYSIS ============


@router.get("/{quote_id}/price-analysis", response_model=PriceAnalysisOut)
def get_price_analysis(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Quote için fiyat analiz raporu"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # SupplierQuote'ların final_amount'larını al
    supplier_quotes = (
        db.query(SupplierQuote)
        .filter(
            SupplierQuote.quote_id == quote_id,
            SupplierQuote.status.in_(["submitted", "yanıtlandı"]),
        )
        .all()
    )

    if not supplier_quotes:
        raise HTTPException(status_code=404, detail="Yanıt bulunamadı")

    # Fiyatları topla
    prices = [float(sq.final_amount) for sq in supplier_quotes if sq.final_amount]

    if not prices:
        raise HTTPException(status_code=400, detail="Fiyat verisi yok")

    # İstatistikler hesapla
    min_price = Decimal(str(min(prices)))
    max_price = Decimal(str(max(prices)))
    avg_price = Decimal(str(sum(prices) / len(prices)))
    median_price = Decimal(str(median(prices)))
    price_variance = ((max_price - min_price) / min_price * 100) if min_price > 0 else 0

    # En ucuz ve en pahalı tedarikçileri bul
    cheapest_sq = sorted(supplier_quotes, key=lambda x: float(x.final_amount))[0]
    most_expensive_sq = sorted(supplier_quotes, key=lambda x: float(x.final_amount))[-1]

    # Raporu kaydet veya güncelle
    analysis = (
        db.query(PriceAnalysis).filter(PriceAnalysis.quote_id == quote_id).first()
    )
    if not analysis:
        analysis = PriceAnalysis(
            quote_id=quote_id,
            min_price=min_price,
            max_price=max_price,
            avg_price=avg_price,
            median_price=median_price,
            price_variance=float(price_variance),
            cheapest_supplier_id=cheapest_sq.supplier_id,
            most_expensive_supplier_id=most_expensive_sq.supplier_id,
            total_responses=len(supplier_quotes),
            submitted_responses=len([sq for sq in supplier_quotes if sq.submitted_at]),
        )
        db.add(analysis)
    else:
        analysis.min_price = min_price
        analysis.max_price = max_price
        analysis.avg_price = avg_price
        analysis.median_price = median_price
        analysis.price_variance = float(price_variance)
        analysis.cheapest_supplier_id = cheapest_sq.supplier_id
        analysis.most_expensive_supplier_id = most_expensive_sq.supplier_id

    db.commit()
    db.refresh(analysis)
    return analysis


# ============ QUOTE COMPARISON ============


@router.get("/{quote_id}/comparison", response_model=QuoteComparisonOut)
def get_quote_comparison(
    quote_id: int,
    comparison_type: str = "price",  # price, delivery, overall
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Quote'un farklı kriterlerine göre karşılaştırması"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    supplier_quotes = (
        db.query(SupplierQuote)
        .filter(SupplierQuote.quote_id == quote_id, SupplierQuote.submitted_at != None)
        .all()
    )

    if not supplier_quotes:
        raise HTTPException(status_code=404, detail="Gönderilen yanıt yok")

    metrics = []

    if comparison_type == "price":
        # Fiyat karşılaştırması
        prices = [(sq, float(sq.final_amount)) for sq in supplier_quotes]
        prices_sorted = sorted(prices, key=lambda x: x[1])

        min_price = prices_sorted[0][1]
        max_price = prices_sorted[-1][1]
        avg_price = sum(p[1] for p in prices) / len(prices)

        metrics.append(
            QuoteComparisonMetric(
                metric_name="min_price",
                metric_value=min_price,
                supplier_id=prices_sorted[0][0].supplier_id,
                supplier_name=prices_sorted[0][0].supplier.name,
            )
        )
        metrics.append(
            QuoteComparisonMetric(
                metric_name="max_price",
                metric_value=max_price,
                supplier_id=prices_sorted[-1][0].supplier_id,
                supplier_name=prices_sorted[-1][0].supplier.name,
            )
        )
        metrics.append(
            QuoteComparisonMetric(metric_name="avg_price", metric_value=avg_price)
        )

    elif comparison_type == "delivery":
        # Teslimat süresi karşılaştırması
        deliveries = [
            (sq, int(sq.delivery_time) if sq.delivery_time else 999)
            for sq in supplier_quotes
        ]
        deliveries_sorted = sorted(deliveries, key=lambda x: x[1])

        if deliveries_sorted[0][1] != 999:
            metrics.append(
                QuoteComparisonMetric(
                    metric_name="fastest_delivery",
                    metric_value=deliveries_sorted[0][1],
                    supplier_id=deliveries_sorted[0][0].supplier_id,
                    supplier_name=deliveries_sorted[0][0].supplier.name,
                )
            )

    return QuoteComparisonOut(
        quote_id=quote_id,
        comparison_type=comparison_type,
        metrics=metrics,
        generated_at=utcnow(),
    )


# ============ SUPPLIER RATING ============


@router.post("/{quote_id}/rate-supplier", response_model=SupplierRatingOut)
def rate_supplier(
    quote_id: int,
    rating_data: SupplierRatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tedarikçiye puan ver"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Tedarikçi kontrol et
    supplier = db.query(Supplier).filter(Supplier.id == rating_data.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Tedarikçi bulunamadı")

    # Genel puanı hesapla (ortalama)
    overall_rating = (
        rating_data.price_rating
        + rating_data.delivery_rating
        + rating_data.quality_rating
        + rating_data.communication_rating
    ) / 4

    # Mevcut puanı güncelle veya oluştur
    existing_rating = (
        db.query(SupplierRating)
        .filter(
            SupplierRating.quote_id == quote_id,
            SupplierRating.supplier_id == rating_data.supplier_id,
            SupplierRating.rated_by_id == current_user.id,
        )
        .first()
    )

    if existing_rating:
        existing_rating.price_rating = rating_data.price_rating
        existing_rating.delivery_rating = rating_data.delivery_rating
        existing_rating.quality_rating = rating_data.quality_rating
        existing_rating.communication_rating = rating_data.communication_rating
        existing_rating.overall_rating = overall_rating
        existing_rating.comment = rating_data.comment
        rating = existing_rating
    else:
        rating = SupplierRating(
            supplier_id=rating_data.supplier_id,
            quote_id=quote_id,
            rated_by_id=current_user.id,
            price_rating=rating_data.price_rating,
            delivery_rating=rating_data.delivery_rating,
            quality_rating=rating_data.quality_rating,
            communication_rating=rating_data.communication_rating,
            overall_rating=overall_rating,
            comment=rating_data.comment,
        )
        db.add(rating)

    db.commit()
    db.refresh(rating)
    return rating


@router.get("/supplier/{supplier_id}/ratings", response_model=list[SupplierRatingOut])
def get_supplier_ratings(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tedarikçinin tüm puanlarını al"""
    ratings = (
        db.query(SupplierRating).filter(SupplierRating.supplier_id == supplier_id).all()
    )
    return ratings


# ============ REPORTING DASHBOARD ============


@router.get("/{quote_id}/dashboard", response_model=ReportingDashboardData)
def get_reporting_dashboard(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Raporlama dashboard'u - tüm veriler"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Tedarikçi sayısı
    supplier_quotes = (
        db.query(SupplierQuote).filter(SupplierQuote.quote_id == quote_id).all()
    )

    submitted_count = len([sq for sq in supplier_quotes if sq.submitted_at])

    # Fiyat analizi
    try:
        price_analysis_obj = (
            db.query(PriceAnalysis).filter(PriceAnalysis.quote_id == quote_id).first()
        )
    except:
        price_analysis_obj = None

    # Puanlar
    ratings = db.query(SupplierRating).filter(SupplierRating.quote_id == quote_id).all()

    avg_rating = (
        sum(r.overall_rating for r in ratings) / len(ratings) if ratings else None
    )

    # Sözleşmeler
    contracts = db.query(Contract).filter(Contract.quote_id == quote_id).all()

    return ReportingDashboardData(
        quote_id=quote_id,
        quote_title=quote.title,
        price_analysis=price_analysis_obj,
        supplier_ratings=[SupplierRatingOut.from_orm(r) for r in ratings],
        total_suppliers=len(supplier_quotes),
        submitted_responses=submitted_count,
        average_rating=avg_rating,
        contracts=[ContractOut.from_orm(c) for c in contracts],
    )
