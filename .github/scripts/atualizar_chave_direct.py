"""Leva a chave do Instagram recém-renovada pela coleta de métricas pro site da área de membros
(Vercel), onde mora o Direct automático (api/webhook-instagram-dm.js).

Por quê: a chave vale 60 dias e a Meta devolve uma chave NOVA a cada renovação (conferido em
27/10/2026). A chave do Direct ficava parada na Vercel e vencia sozinha. Agora a mesma chave
(app "api", conta karolsenna._, tem permissão de métricas e de mensagens) serve aos dois, e
uma vez por semana este script troca a cópia da Vercel e republica o site.

Entrada: arquivo com a chave nova (IG_TOKEN_OUT) e VERCEL_TOKEN. Nunca imprime a chave.
"""
import os
import sys
import time

import requests

TEAM = "team_ZU8S84Vs7F9g8MNEJ7Ycv0tQ"
PROJETO = "prj_OlcoX4AuBNpemEkVXOO3gOWg8HVP"  # area-de-membros-incubadora
NOME = "area-de-membros-incubadora"
API = "https://api.vercel.com"

vercel = os.environ.get("VERCEL_TOKEN")
arquivo = os.environ.get("IG_TOKEN_OUT")
if not vercel:
    sys.exit("ERRO: falta o Secret VERCEL_TOKEN — a chave do Direct não foi atualizada.")
if not arquivo or not os.path.exists(arquivo):
    sys.exit("ERRO: a coleta não renovou a chave hoje — nada pra levar ao Direct.")
chave = open(arquivo).read().strip()

# 1. A chave nova consegue ler o Direct? Se não, não troca (mantém a que está lá).
r = requests.get("https://graph.instagram.com/v21.0/me/conversations",
                 params={"platform": "instagram", "limit": 1, "access_token": chave}, timeout=60)
if r.status_code != 200:
    sys.exit(f"ERRO: chave nova sem acesso ao Direct ({r.json().get('error', {}).get('message')})")

H = {"Authorization": f"Bearer {vercel}"}
Q = {"teamId": TEAM}

# 2. Troca a variável do Direct na Vercel.
r = requests.post(f"{API}/v10/projects/{PROJETO}/env", headers=H,
                  params={**Q, "upsert": "true"}, timeout=60,
                  json={"key": "IG_MESSAGING_TOKEN", "value": chave,
                        "type": "sensitive", "target": ["production"]})
if r.status_code >= 300:
    sys.exit(f"ERRO ao gravar a chave na Vercel: {r.status_code} {r.text[:300]}")
print("chave do Direct gravada na Vercel")

# 3. Republica a versão que está no ar, pra ela passar a usar a chave nova.
r = requests.get(f"{API}/v6/deployments", headers=H, timeout=60,
                 params={**Q, "projectId": PROJETO, "target": "production",
                         "state": "READY", "limit": 1})
atual = r.json()["deployments"][0]["uid"]
r = requests.post(f"{API}/v13/deployments", headers=H, timeout=60,
                  params={**Q, "forceNew": "1"},
                  json={"name": NOME, "deploymentId": atual, "target": "production"})
if r.status_code >= 300:
    sys.exit(f"ERRO ao republicar o site: {r.status_code} {r.text[:300]}")
novo = r.json()["id"]

for _ in range(60):
    estado = requests.get(f"{API}/v13/deployments/{novo}", headers=H, params=Q,
                          timeout=60).json().get("readyState")
    if estado == "READY":
        print("site republicado com a chave nova — Direct automático renovado")
        break
    if estado in ("ERROR", "CANCELED"):
        sys.exit(f"ERRO: republicação do site terminou em {estado}")
    time.sleep(10)
else:
    sys.exit("ERRO: republicação do site não terminou em 10 minutos")
