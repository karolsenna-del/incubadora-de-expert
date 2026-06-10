#!/bin/bash
# log-action.sh — Registra UMA ação no histórico de trabalho do Tráfego Arcane.
#
# Por que existe: o squad faz coisas (sobe campanha, muda budget, mata criativo,
# decide não escalar) e PRECISA lembrar entre chats. Este helper grava 1 linha
# por operação no `data/historico-acoes.md` (append-only, gitignored), com
# timestamp automático e formato consistente — sem o agente formatar na mão.
#
# REGRA (QG-LOG-001): nenhuma escrita no Meta está concluída até estar registrada aqui.
#
# Uso:
#   bash data/log-action.sh \
#     --agent andromeda-chief \
#     --account CA05 \
#     --action "BUDGET +30%" \
#     --summary "24 conjuntos R\$35->R\$45,50 (840->1092/dia)" \
#     --result "24/24 ok" \
#     --ref NDF \
#     [--kind write|decision]   # default: write
#
# Campos obrigatórios: --agent, --account, --action, --result
# (para --kind decision, --result pode ser a conclusão da decisão)

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" >/dev/null 2>&1 && pwd)"
LOG="${SCRIPT_DIR}/historico-acoes.md"

AGENT="" ACCOUNT="" ACTION="" SUMMARY="" RESULT="" REF="" KIND="write"
while [ $# -gt 0 ]; do
  case "$1" in
    --agent)   AGENT="$2"; shift 2;;
    --account) ACCOUNT="$2"; shift 2;;
    --action)  ACTION="$2"; shift 2;;
    --summary) SUMMARY="$2"; shift 2;;
    --result)  RESULT="$2"; shift 2;;
    --ref)     REF="$2"; shift 2;;
    --kind)    KIND="$2"; shift 2;;
    *) echo "log-action: flag desconhecida: $1" >&2; exit 1;;
  esac
done

# Validar obrigatórios
miss=""
[ -z "$AGENT" ]   && miss="$miss --agent"
[ -z "$ACCOUNT" ] && miss="$miss --account"
[ -z "$ACTION" ]  && miss="$miss --action"
[ -z "$RESULT" ]  && miss="$miss --result"
if [ -n "$miss" ]; then
  echo "log-action: faltam campos obrigatórios:$miss" >&2
  exit 1
fi

# Timestamp BRT
TS="$(TZ='America/Sao_Paulo' date '+%Y-%m-%d %H:%M')"

# Normalizar KIND -> tag
case "$KIND" in
  decision|DECISION|decisao) TAG="DECISION";;
  *) TAG="WRITE";;
esac

# Criar arquivo com header na 1ª vez
if [ ! -f "$LOG" ]; then
  cat > "$LOG" <<'HDR'
# Histórico de Ações — Tráfego Arcane

> Memória de trabalho append-only. 1 linha por OPERAÇÃO executada ([WRITE]) ou DECISÃO-chave ([DECISION]).
> Escrito por `log-action.sh` após cada escrita no Meta. Lido na ativação (anti-amnésia) e no `*status`.
> Gitignored (dados operacionais reais). Mais recente embaixo (append).
> Formato: `- {data} BRT · @{agente} · {conta} · [{TIPO}] {ação} · {resumo} · {resultado} · ref:{produto}`

---

HDR
fi

# Montar a linha (campos opcionais entram só se presentes)
LINE="- ${TS} BRT · @${AGENT} · ${ACCOUNT} · [${TAG}] ${ACTION}"
[ -n "$SUMMARY" ] && LINE="${LINE} · ${SUMMARY}"
LINE="${LINE} · ${RESULT}"
[ -n "$REF" ] && LINE="${LINE} · ref:${REF}"

printf '%s\n' "$LINE" >> "$LOG"
echo "✓ registrado no histórico: ${ACTION} (${ACCOUNT})"
