# Release Window Cikti Seti - 2026-04-16

Bu dokuman, Batch C kapanisinda release penceresi icin toplanan audit ve hedefli test ciktilarini tek formatta ozetler.

Son yenileme: 2026-04-16 (Batch C evidence refresh)

## 1) Audit Artefaktlari

- approval-transition-audit-2026-04-16.json
- approval-transition-audit-2026-04-16.csv
- audit-quote-rfq-legacy-cleanup.json
- audit-quote-rfq-legacy-cleanup.csv
- audit-billing-reconciliation.json
- audit-billing-reconciliation.csv

## 2) Audit Ozeti

- Approval transition: total_quote_approvals = 6, quote_approvals_with_issues = 0
- Quote/RFQ legacy cleanup: quotes.total_rows = 23, supplier_quotes.total_rows = 20, issue_counts bos
- Billing reconciliation: section_count = 3, problem_rows = 0, issue_counts = 0

## 3) Hedefli Test Ozeti

- Backend: tests/test_tenant_governance_authz.py -k "billing_webhook_retry_requires_super_admin or super_admin_can_retry_failed_billing_webhook_event" -> 2 passed
- Frontend: src/test/admin-page-tenant-governance.test.tsx -> 49 passed

## 4) Batch C Cikis Karari

- Legacy drop preflight checklist hazirlandi.
- Operasyon runbook hazirlandi.
- Release penceresi cikti seti bu dokumanda sabitlendi.

Karar: migration penceresi icin GO/NO-GO degerlendirmesi preflight kapisina gore verilir.

## 5) Komut Kaniti (Yeniden Calistirilan)

- D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_role_system_role_consistency.py --output-json approval-transition-audit-2026-04-16.json --output-csv approval-transition-audit-2026-04-16.csv
- D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_quote_rfq_legacy_cleanup.py --json-output audit-quote-rfq-legacy-cleanup.json --csv-output audit-quote-rfq-legacy-cleanup.csv
- D:/Projects/procureflow/api/.venv/Scripts/python.exe api/scripts/audit_billing_reconciliation.py --json-out audit-billing-reconciliation.json --csv-out audit-billing-reconciliation.csv
- D:/Projects/procureflow/api/.venv/Scripts/python.exe -m pytest tests/test_tenant_governance_authz.py -k "billing_webhook_retry_requires_super_admin or super_admin_can_retry_failed_billing_webhook_event"
- npm --prefix web run test:run -- src/test/admin-page-tenant-governance.test.tsx
