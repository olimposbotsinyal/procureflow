from __future__ import annotations

import json

from api.models.settings import SystemSettings


def default_public_pricing_config() -> dict:
    return {
        "strategic_partner": {
            "plans": [
                {
                    "code": "starter",
                    "name": "Baslangic",
                    "price_monthly": 14900,
                    "currency": "TRY",
                    "description": "Temel RFQ ve onay akisi",
                    "features": [
                        "RFQ ve teklif toplama",
                        "Temel onay akislari",
                        "10 aktif ic kullanici",
                    ],
                },
                {
                    "code": "growth",
                    "name": "Gelisim",
                    "price_monthly": 34900,
                    "currency": "TRY",
                    "description": "Buyuyen satin alma ekipleri",
                    "features": [
                        "Gelismis raporlar",
                        "Platform tedarikci havuzu",
                        "50 aktif ic kullanici",
                    ],
                },
                {
                    "code": "enterprise",
                    "name": "Kurumsal",
                    "price_monthly": 79900,
                    "currency": "TRY",
                    "description": "Kuruma ozel teklif ve entegrasyon",
                    "features": [
                        "Sinirsiz kullanim",
                        "ERP entegrasyonu",
                        "CSM + ozel SLA",
                    ],
                },
            ]
        },
        "supplier": {
            "plans": [
                {
                    "code": "supplier_free",
                    "name": "Tedarikci Ucretsiz",
                    "price_monthly": 0,
                    "currency": "TRY",
                    "description": "Platformda gorunurluk ve temel teklif yanitlari",
                    "features": [
                        "Tedarikci profili",
                        "Temel ihale davet yaniti",
                        "Aylik performans ozeti",
                    ],
                },
                {
                    "code": "supplier_prime",
                    "name": "Tedarikci Prime",
                    "price_monthly": 9900,
                    "currency": "TRY",
                    "description": "Kurumsal tedarikci buyume paketi",
                    "features": [
                        "Coklu kullanici",
                        "API/export imkanlari",
                        "Stratejik partnerlik workshoplari",
                    ],
                },
            ]
        },
    }


def parse_public_pricing_config(raw_json: str | None) -> dict:
    fallback = default_public_pricing_config()
    if not raw_json:
        return fallback

    try:
        data = json.loads(raw_json)
    except Exception:
        return fallback

    if not isinstance(data, dict):
        return fallback

    if "strategic_partner" not in data or "supplier" not in data:
        return fallback

    strategic = data.get("strategic_partner", {})
    supplier = data.get("supplier", {})
    strategic_plans = strategic.get("plans") if isinstance(strategic, dict) else None
    supplier_plans = supplier.get("plans") if isinstance(supplier, dict) else None

    if not isinstance(strategic_plans, list) or not isinstance(supplier_plans, list):
        return fallback

    if len(strategic_plans) == 0 and len(supplier_plans) == 0:
        return fallback

    return data


def serialize_public_pricing_config(config: dict) -> str:
    return json.dumps(config, ensure_ascii=True)


def ensure_public_pricing_json(settings: SystemSettings) -> None:
    if not getattr(settings, "public_pricing_json", None):
        settings.public_pricing_json = serialize_public_pricing_config(
            default_public_pricing_config()
        )
