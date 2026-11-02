#!/usr/bin/env sh
# Aplica sql/uso-agentes.sql no Supabase da área de membros (rodar da pasta area-de-membros).
python -c "import json;print(json.dumps({'query':open('sql/uso-agentes.sql',encoding='utf-8').read()}))" > "${TEMP:-/tmp}/uso-agentes.json"
curl -s -X POST "https://api.supabase.com/v1/projects/pxnbcbhgoewrwyreohki/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H "Content-Type: application/json" \
  --data-binary @"${TEMP:-/tmp}/uso-agentes.json"
echo
