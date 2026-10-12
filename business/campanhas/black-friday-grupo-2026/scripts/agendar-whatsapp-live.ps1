# Agenda no Windows os envios individuais (API do WhatsApp) do dia 14 da Black Expert.
# Horários no relógio do PC (Cuiabá). Brasília = Cuiabá + 1h.
# Uso: powershell -ExecutionPolicy Bypass -File agendar-whatsapp-live.ps1 -Oferta "15:40"
#   -Oferta = horário de BRASÍLIA em que a Karol abre a oferta na live (ponto alto)
# O PC precisa estar ligado e com a Karol logada nos horários. Log: business/vault/black-expert-2026/envios-agendados.log
param(
  [Parameter(Mandatory = $true)][string]$Oferta,
  [string]$DiaLive = "10:00",    # Brasília — convite da manhã (black_expert_dia_live)
  [string]$CadeVoce = "15:07"    # Brasília — "cadê você?" (5-10 min depois do "estamos ao vivo")
)
$ErrorActionPreference = "Stop"
$pyw = Join-Path (Split-Path (Get-Command python).Source) "pythonw.exe"
$launcher = Join-Path $PSScriptRoot "envio-agendado.pyw"
$dia = [datetime]"2026-10-14"

function Agendar($nome, $mensagem, $hBrasilia) {
  $quando = $dia.Add([timespan]::Parse($hBrasilia)).AddHours(-1)   # Brasília -> Cuiabá
  $acao = New-ScheduledTaskAction -Execute $pyw -Argument "`"$launcher`" --mensagem $mensagem --enviar --confirmo BLACK-EXPERT" -WorkingDirectory $PSScriptRoot
  $gatilho = New-ScheduledTaskTrigger -Once -At $quando
  $config = New-ScheduledTaskSettingsSet -StartWhenAvailable:$false -ExecutionTimeLimit (New-TimeSpan -Minutes 30) -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries
  Register-ScheduledTask -TaskName "BlackExpert-$nome" -Action $acao -Trigger $gatilho -Settings $config -Force | Out-Null
  "{0,-22} {1:dd/MM HH:mm} Cuiabá ({2} Brasília)" -f "BlackExpert-$nome", $quando, $hBrasilia
}

Agendar "1-dia-live" "dia_live" $DiaLive
Agendar "2-cade-voce" "live_cade_voce" $CadeVoce
Agendar "3-oferta" "live_oferta" $Oferta
