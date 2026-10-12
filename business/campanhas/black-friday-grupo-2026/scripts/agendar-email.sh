#!/usr/bin/env bash
# Agenda um e-mail da Black Expert no Resend (SOP-024 do Gestor de Infra).
# Uso:  bash agendar-email.sh NN AAAA-MM-DDTHH:MM:SSZ [teste]
#   NN = número do e-mail (lê emails/email-NN.html; assunto = <title>)
#   horário em UTC (Cuiabá = UTC-4 → 9h Cuiabá = 13:00:00Z)
#   "teste" = manda agora só pro segmento "Teste Karol", com [TESTE] no assunto
set -euo pipefail
cd "$(dirname "$0")/../emails"
N="$1"; QUANDO="$2"; MODO="${3:-real}"
K=$(op read "op://Claude/Resend Full/password")
REAL="93dd5353-3501-4554-85e2-9377ee9bc1ed"   # Black Expert 2026
TESTE="a1d0da6d-4ed2-41c3-be08-b2b747c01acf"  # Teste Karol
TMP=$(mktemp)
python - "$N" "$MODO" "$REAL" "$TESTE" "$TMP" <<'EOF'
import json, re, sys
n, modo, real, teste, out = sys.argv[1:]
h = open(f"email-{n}.html", encoding="utf-8").read()
subj = re.search("<title>(.*?)</title>", h).group(1)
t = modo == "teste"
json.dump({
    "segment_id": teste if t else real,
    "from": "Karol Senna <karol@incubadoradeexpert.com.br>",
    "reply_to": "karolsenna@incubadoradeexpert.com.br",
    "subject": ("[TESTE] " if t else "") + subj,
    "html": h,
    "name": ("TESTE — " if t else "Black Expert — ") + f"Disparo #{n.lstrip('0')}",
}, open(out, "w", encoding="utf-8"), ensure_ascii=False)
EOF
ID=$(curl -s -X POST https://api.resend.com/broadcasts -H "Authorization: Bearer $K" \
  -H "Content-Type: application/json" --data-binary @"$TMP" | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
if [ "$MODO" = "teste" ]; then BODY='{}'; else BODY="{\"scheduled_at\":\"$QUANDO\"}"; fi
curl -s -X POST "https://api.resend.com/broadcasts/$ID/send" -H "Authorization: Bearer $K" \
  -H "Content-Type: application/json" -d "$BODY" >/dev/null
curl -s "https://api.resend.com/broadcasts/$ID" -H "Authorization: Bearer $K" | python -c "
import sys,json;b=json.load(sys.stdin);print('e-mail', '$N', '->', b.get('status'), b.get('scheduled_at') or b.get('sent_at'), '| id', b['id'][:8])"
rm -f "$TMP"
