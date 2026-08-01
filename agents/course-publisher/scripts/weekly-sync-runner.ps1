# Course Publisher — Runner da automacao semanal (Meet -> Hotmart)
# Disparado pela tarefa agendada do Windows "AuroqOS-CoursePublisher-WeeklySync".
# Roda o Claude Code sem interacao, executando a task weekly-sync.md.

$ErrorActionPreference = "Stop"
$ProjectDir = "C:\Users\karol\OneDrive\Documentos\Incubadora-de-expert"
$LogDir = Join-Path $ProjectDir "agents\course-publisher\data\logs"
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }

$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogFile = Join-Path $LogDir "weekly-sync-$Timestamp.log"

Set-Location $ProjectDir

$prompt = "Ative o course-publisher (leia agents/course-publisher/agents/course-publisher.md) e execute a task agents/course-publisher/tasks/weekly-sync.md do inicio ao fim, sem pedir nada pra Karol (missao autonoma, REGRA-015). Ao terminar, garanta que o Mission Log (course-publisher-missions.md) e o weekly-sync-state.yaml foram atualizados."

& claude -p $prompt --permission-mode bypassPermissions --output-format text *>&1 | Tee-Object -FilePath $LogFile

# manter so os ultimos 20 logs
Get-ChildItem $LogDir -Filter "weekly-sync-*.log" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 20 | Remove-Item -Force -ErrorAction SilentlyContinue
