# Tenant SaaS Final Migration Runbook

Tarih: 2026-04-16
Kapsam: Paket 4 final migration penceresi (apply, rollback, verification).

## 1) Hazirlik

- Veritabani yedegi alin.
- Preflight checklist (docs/release/tenant-saas-final-migration-preflight.md) tamamlanmis olmali.
- Uygulama yazma trafigi dusuk pencereye alinmali.

## 2) Apply Sirasi

PowerShell (repo kokunden):

```powershell
# 1) Approval compatibility cleanup
D:/Projects/procureflow/api/.venv/Scripts/python.exe -m alembic -c api/alembic.ini upgrade head

# Not:
# Bu repo akisi SQL migration dosyalarini release penceresinde hedefli olarak kullanir.
# Gerekirse onayli migration dosyalari DBA proseduruyle sirali uygulanir:
# - migrations/2026_04_15_finalize_quote_approval_required_role_compat_cleanup.sql
# - migrations/2026_04_15_finalize_quote_rfq_legacy_drop.sql
```

## 3) Rollback Yaklasimi

- Her migration adimi oncesi DB snapshot alin.
- Hata durumunda snapshot restore et.
- Restore sonrasi dogrulama auditlerini tekrar calistir.

Ornek geri donus akisi:

```powershell
# Ortama ozel backup/restore proseduru kullanilir.
# Restore sonrasi audit ve hedefli testler tekrar kosulur.
D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_role_system_role_consistency.py --output-json approval-transition-audit-2026-04-16.json --output-csv approval-transition-audit-2026-04-16.csv
D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_quote_rfq_legacy_cleanup.py --output-json audit-quote-rfq-legacy-cleanup.json --output-csv audit-quote-rfq-legacy-cleanup.csv
```

## 4) Dogrulama Sirasi

Apply sonrasi zorunlu adimlar:

```powershell
D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_role_system_role_consistency.py --output-json approval-transition-audit-2026-04-16.json --output-csv approval-transition-audit-2026-04-16.csv
D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_quote_rfq_legacy_cleanup.py --output-json audit-quote-rfq-legacy-cleanup.json --output-csv audit-quote-rfq-legacy-cleanup.csv
D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_billing_reconciliation.py --output-json audit-billing-reconciliation.json --output-csv audit-billing-reconciliation.csv
D:/Projects/procureflow/api/.venv/Scripts/python.exe -m pytest tests/test_tenant_governance_authz.py -k "billing_webhook_retry_requires_super_admin or super_admin_can_retry_failed_billing_webhook_event"
npm --prefix web run test:run -- src/test/admin-page-tenant-governance.test.tsx
```

## 5) Beklenen Sonuc

- Audit issue sayaci: 0
- Backend hedefli retry authz testleri: yesil
- Frontend admin governance test paketi: yesil
- Release notu dokumani guncellenmis

## 6) Artefaktlar

- approval-transition-audit-2026-04-16.json
- approval-transition-audit-2026-04-16.csv
- audit-quote-rfq-legacy-cleanup.json
- audit-quote-rfq-legacy-cleanup.csv
- audit-billing-reconciliation.json
- audit-billing-reconciliation.csv
- docs/release/release-window-2026-04-16.md
