param(
    [string]$ProjectRoot = "D:\Projects\procureflow",
    [string]$BackupRoot = "D:\Projects\procureflow_full_backups\scheduled"
)

$ErrorActionPreference = "Stop"

$apiEnvPath = Join-Path $ProjectRoot "api\.env"
if (-not (Test-Path -LiteralPath $apiEnvPath)) {
    throw "api/.env bulunamadi: $apiEnvPath"
}

$dbUrlLine = Get-Content -LiteralPath $apiEnvPath | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
if (-not $dbUrlLine) {
    throw "DATABASE_URL satiri bulunamadi"
}

$dbUrl = $dbUrlLine.Substring("DATABASE_URL=".Length)
if ($dbUrl -notmatch '^postgresql\+psycopg://([^:]+):([^@]+)@([^:]+):(\d+)/(\w+)$') {
    throw "DATABASE_URL beklenen formatta degil"
}

$dbUser = $matches[1]
$dbPass = $matches[2]
$dbHost = $matches[3]
$dbPort = $matches[4]
$dbName = $matches[5]

if ($dbName -ne "procureflow") {
    throw "Bu script sadece procureflow veritabani icin calisir"
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$sqlBackupDir = Join-Path $BackupRoot "sql"
if (-not (Test-Path -LiteralPath $sqlBackupDir)) {
    New-Item -ItemType Directory -Path $sqlBackupDir | Out-Null
}

$outputFile = Join-Path $sqlBackupDir ("procureflow_sql_" + $timestamp + ".sql")
$env:PGPASSWORD = $dbPass

try {
    & pg_dump -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $outputFile
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump komutu basarisiz oldu (kod=$LASTEXITCODE)"
    }
}
finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

"SQL_BACKUP_OK"
"DB=$dbName"
"FILE=$outputFile"
