"""Raporlama ve Analiz Schemas"""

from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
from decimal import Decimal


# ============ SUPPLIER RATING SCHEMAS ============


class SupplierRatingCreate(BaseModel):
    supplier_id: int
    quote_id: int
    price_rating: int = Field(..., ge=1, le=5)
    delivery_rating: int = Field(..., ge=1, le=5)
    quality_rating: int = Field(..., ge=1, le=5)
    communication_rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class SupplierRatingOut(BaseModel):
    id: int
    supplier_id: int
    quote_id: int
    price_rating: int
    delivery_rating: int
    quality_rating: int
    communication_rating: int
    overall_rating: float
    comment: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============ PRICE ANALYSIS SCHEMAS ============


class PriceAnalysisOut(BaseModel):
    id: int
    quote_id: int
    min_price: Decimal
    max_price: Decimal
    avg_price: Decimal
    median_price: Decimal
    price_variance: float
    cheapest_supplier_id: Optional[int]
    most_expensive_supplier_id: Optional[int]
    total_responses: int
    submitted_responses: int
    analysis_date: datetime

    model_config = ConfigDict(from_attributes=True)


class QuoteComparisonMetric(BaseModel):
    metric_name: str  # min_price, max_price, avg_price, best_delivery, etc
    metric_value: float
    supplier_id: Optional[int] = None
    supplier_name: Optional[str] = None


class QuoteComparisonOut(BaseModel):
    quote_id: int
    comparison_type: str
    metrics: list[QuoteComparisonMetric]
    generated_at: datetime


# ============ CONTRACT SCHEMAS ============


class ContractCreate(BaseModel):
    supplier_quote_id: int
    contract_type: str = "standard"  # standard, custom
    payment_terms: Optional[str] = None
    delivery_date: Optional[datetime] = None
    warranty_period: Optional[str] = None
    notes: Optional[str] = None


class ContractOut(BaseModel):
    id: int
    quote_id: int
    supplier_id: int
    contract_number: str
    total_amount: Decimal
    final_amount: Decimal
    status: str
    payment_terms: Optional[str]
    delivery_date: Optional[datetime]
    warranty_period: Optional[str]
    pdf_file_path: Optional[str]
    signed_at: Optional[datetime]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ContractSign(BaseModel):
    contract_id: int
    signed_by_user_id: int


# ============ REPORTING DASHBOARD ============


class ReportingDashboardData(BaseModel):
    """Raporlama dashboard'u için tüm veriler"""

    quote_id: int
    quote_title: str

    # Price Analysis
    price_analysis: Optional[PriceAnalysisOut] = None

    # Supplier Ratings
    supplier_ratings: list[SupplierRatingOut] = []

    # Comparisons
    comparisons: list[QuoteComparisonOut] = []

    # Contracts
    contracts: list[ContractOut] = []

    # Statistics
    total_suppliers: int
    submitted_responses: int
    average_rating: Optional[float] = None
    best_price: Optional[Decimal] = None
    best_delivery: Optional[str] = None
