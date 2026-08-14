# install.ps1 — bootstrap fino (Windows). A logica cross-platform vive em install.py.
# Uso:  powershell -ExecutionPolicy Bypass -File install.ps1
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Have($n) { [bool](Get-Command $n -ErrorAction SilentlyContinue) }

$py = $null
if (Have "py") { $py = "py" }
elseif (Have "python") { $py = "python" }

if (-not $py) {
  if (Have "winget") {
    Write-Host "Python nao encontrado — instalando Python 3.12 via winget (compativel com torch)..."
    winget install --id Python.Python.3.12 -e --accept-source-agreements --accept-package-agreements
    Write-Host "Feito. ABRA UM NOVO terminal e rode de novo: powershell -ExecutionPolicy Bypass -File install.ps1"
    exit 1
  } else {
    Write-Host "Python nao encontrado e winget ausente. Instale Python 3.12 em https://python.org e rode de novo."
    exit 1
  }
}

& $py (Join-Path $dir "install.py") @args
exit $LASTEXITCODE
