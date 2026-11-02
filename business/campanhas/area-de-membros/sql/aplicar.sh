#!/usr/bin/env sh
# Aplica um arquivo .sql no Supabase da área de membros. Uso (da pasta area-de-membros): sh sql/aplicar.sh sql/arquivo.sql
[ -f "$1" ] || { echo "arquivo não encontrado: $1"; exit 1; }
python -c "import json,sys;print(json.dumps({'query':open(sys.argv[1],encoding='utf-8').read()}))" "$1" > "${TEMP:-/tmp}/aplicar-sql.json"
curl -s -X POST "https://api.supabase.com/v1/projects/pxnbcbhgoewrwyreohki/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H "Content-Type: application/json" \
  --data-binary @"${TEMP:-/tmp}/aplicar-sql.json"
echo
