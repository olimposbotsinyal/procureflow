\# ProcureFlow API



FastAPI tabanlı backend servisidir.



\## 1) Gereksinimler

\- Python 3.11+ (3.14 da olur)

\- Git

\- Windows PowerShell



\## 2) Kurulum



```powershell

cd D:\\Projects\\procureflow\\api

python -m venv .venv

.\\.venv\\Scripts\\Activate.ps1

pip install -r requirements.txt



## Environment Setup

1. Copy example file:
   cp .env.example .env

2. Edit `.env` values for local development.

3. Run seed:
   python api/seed_admin.py


PowerShell:
Copy-Item .env.example .env
