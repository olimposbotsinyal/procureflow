# ProcureFlow API

FastAPI tabanlı backend servisidir.

## 1) Gereksinimler

- Python 3.11+ (3.14 da olur)
- Git
- Windows PowerShell

## 2) Kurulum

```powershell
cd D:\Projects\procureflow\api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

## Tenant Bootstrap

Mevcut admin kayitlarindan tenant omurgasi olusturmak icin:

```powershell
cd D:\Projects\procureflow
api\.venv\Scripts\python.exe api\scripts\apply_runtime_foundation_columns.py
api\.venv\Scripts\python.exe -m api.scripts.bootstrap_tenants --dry-run
api\.venv\Scripts\python.exe -m api.scripts.bootstrap_tenants --apply
```

Canli veritabani eski tek-tenant veriyle calisiyorsa ve bootstrap sirasinda
kalan tenant_id bosluklarini ayni akista kapatmak istiyorsaniz:

```powershell
cd D:\Projects\procureflow
api\.venv\Scripts\python.exe -m api.scripts.bootstrap_tenants --dry-run --backfill-single-tenant
api\.venv\Scripts\python.exe -m api.scripts.bootstrap_tenants --apply --backfill-single-tenant
```

Not:
- `apply_runtime_foundation_columns.py`, canli DB'de tenant/system_role kolonlari ve tenant tablolarinin eksik oldugu durumlar icin idempotent hazirlik adimidir.
- `bootstrap_tenants.py --backfill-single-tenant` sadece veritabaninda tam olarak 1 tenant varsa backfill uygular; cok tenantli ortamlarda bilerek atlar.
- `backfill_single_tenant_scope.py` ayri operasyon ihtiyaci icin korunur, ama onerilen akıs bootstrap uzerinden ilerlemektir.

## Role/System Role Audit

Gecis donemindeki role ve system_role tutarliligini denetlemek icin:

```powershell
cd D:\Projects\procureflow
api\.venv\Scripts\python.exe api\scripts\audit_role_system_role_consistency.py --output-json audit-report.json --output-csv audit-report.csv
```

Guvenli auto-fix adaylarini dry-run olarak gormek icin:

```powershell
cd D:\Projects\procureflow
api\.venv\Scripts\python.exe api\scripts\audit_role_system_role_consistency.py --fix --output-json audit-fix-preview.json --output-csv audit-fix-preview.csv
```

Bu preview ciktisi artik `summary` blogu da icerir:
- hedeflenen `system_role` dagilimi
- uygulanacak fix tipi dagilimi
- etkilenecek toplam kayit sayisi

Acik ve guvenli system_role eslestirmelerini veritabanina uygulamak icin:

```powershell
cd D:\Projects\procureflow
api\.venv\Scripts\python.exe api\scripts\audit_role_system_role_consistency.py --fix --apply --output-json audit-fix-applied.json --output-csv audit-fix-applied.csv
```

Quote approval alanlarindaki `required_role` / `required_business_role` hizasini sadece dry-run olarak gormek icin:

```powershell
cd D:\Projects\procureflow
api\.venv\Scripts\python.exe api\scripts\audit_role_system_role_consistency.py --fix-approvals --output-json approval-fix-preview.json --output-csv approval-fix-preview.csv
```

Quote approval mirror hizasini veritabanina uygulamak icin:

```powershell
cd D:\Projects\procureflow
api\.venv\Scripts\python.exe api\scripts\audit_role_system_role_consistency.py --fix-approvals --apply --output-json approval-fix-applied.json --output-csv approval-fix-applied.csv
```

## Quote Approval Final Faz Sirasi

Quote approval business-role gecisini sikilastirmadan once onerilen sira:

1. Role/system role genel raporunu alin.
2. Quote approval preview raporunu alin.
3. Gerekirse `--fix-approvals` dry-run sonucunu inceleyin.
4. Onaylandiginda `--fix-approvals --apply` ile mirror alanlarini hizalayin.
5. Ardindan `migrations/2026_04_14_finalize_quote_approval_business_role_transition.sql` migration'ini calistirin.

Bu final fazdan sonra:
- `required_business_role` ana kaynak olur.
- `required_role` nullable compatibility mirror olarak kalir.
- 2026-04-15 audit sonucu: `approval-transition-audit.json` raporunda `total_quote_approvals=6`, `quote_approvals_with_issues=0` ve `repair_preview.preview_rows=0` dogrulandi.

Ek not:
- `api/services/quote_approval_service.py` yeni approval kayitlarinda artik `required_role` yazmiyor; write-path canonical olarak `required_business_role` alanina daraltildi.
- Approval endpoint response'lari gecis boyunca hem `required_business_role` hem de compatibility icin `required_role_mirror` dondurur. Yeni istemciler `required_business_role` ve `required_business_role_label` alanlarini birincil kaynak olarak kullanmalidir.
- `migrations/2026_04_15_finalize_quote_approval_required_role_compat_cleanup.sql` DB icindeki `required_role` mirror alanini null'a cekerek bu alanı compatibility seviyesine indirir; API `required_role` degerini response'ta `required_business_role` uzerinden sentezlemeye devam eder.

## Quote/RFQ Legacy Cleanup Final Faz

Quote -> RFQ gecisinin adapter ve scope refactorlari tamamlandiktan sonra son
legacy kolon temizligi icin referans plan dosyasi:

- `migrations/2026_04_15_quote_rfq_legacy_cleanup_plan.sql`

Bu plan dosyasi su sirayla kullanilmalidir:

1. Preflight sorgulari calistir ve `quotes.user_id`, `quotes.amount` ve supplier quote tenant zincirinde drift olmadigini dogrula.
2. Gerekirse mirror alignment update bloklarini uygula.
3. Uygulama katmaninda `created_by_id` ve `total_amount` tek canonical kaynak olarak kaldigindan emin ol.
4. Bu kontrollerden sonra `migrations/2026_04_15_finalize_quote_rfq_legacy_drop.sql` migration'ini uygula.

Not:
- `company_*` alanlari bu asamada drop adayi degil; RFQ snapshot alanlari olarak korunur.
- `created_by`, `updated_by`, `deleted_by` integer alanlari ayri audit sadeleştirme fazinda ele alinmalidir.
- `api/routers/quotes.py` artik create/update/items write akislarinda dogrudan `user_id` ve `amount` yazmiyor; canonical write source `created_by_id` ve `total_amount` olarak daraltildi.
- 2026-04-15 audit sonucu: `audit-quote-rfq-legacy-cleanup.json` raporunda `quotes=23`, `supplier_quotes=20`, `issue_counts={}` ve `repair_preview.preview_rows=0` dogrulandi.

## Canli DB Toparlama Sirasi

14 Nisan 2026 itibariyla canli veritabani uzerinde dogrulanan guvenli toparlama sirasi:

1. `api\scripts\apply_runtime_foundation_columns.py` ile eksik tenant/system_role kolonlarini ve tenant tablolarini olustur.
2. `audit_role_system_role_consistency.py --fix` ile system_role preview al.
3. Preview temizse `--fix --apply` ile acik ve guvenli system_role eslestirmelerini uygula.
4. `bootstrap_tenants.py --dry-run` ve sonra `--apply` ile aktif admin zincirinden tenant omurgasini kur.
5. Ortam tek tenantli legacy veri ise `bootstrap_tenants.py --backfill-single-tenant` ile kalan tenant_id alanlarini ayni akista doldur.
6. `audit_role_system_role_consistency.py --output-json audit-report-final.json --output-csv audit-report-final.csv` ile son dogrulamayi al.

Beklenen final durum:
- `users_with_issues = 0`
- `quote_approvals_with_issues = 0`

## Auth Payload Sozlesmesi

Tenant-SaaS gecisinde auth cevaplarinda rol alanlari asagidaki anlamla tasinir:

- `system_role`: platform ve tenant erisim sinirlarinin ana kaynagi.
- `business_role`: satin alma ve onay akislarindaki operasyonel rolun ana kaynagi.
- `role`: geriye uyumluluk icin korunan compatibility mirror.
  Mevcut istemciler ve eski token akislarini kirmaz.

Onerilen istemci onceligi:

1. Yetkilendirme ve ana workspace yonlendirmesi icin `system_role`
2. Operasyonel UI ve approval semantigi icin `business_role`
3. Sadece gecis uyumlulugu gerekiyorsa `role`

Ornek `POST /api/v1/auth/login` veya `GET /api/v1/auth/me` user payload'i:

```json
{
  "id": 1,
  "email": "admin@procureflow.dev",
  "role": "admin",
  "business_role": "admin",
  "system_role": "tenant_admin",
  "full_name": "Admin User",
  "department_id": 1,
  "organization_name": "ProcureFlow Test Company",
  "organization_logo_url": null,
  "workspace_label": "ProcureFlow Test Company Calisma Alani",
  "platform_name": "Buyera Asistans",
  "platform_domain": "buyerasistans.com.tr"
}
```
