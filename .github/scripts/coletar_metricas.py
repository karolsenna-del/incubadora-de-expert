#!/usr/bin/env python3
"""
Instagram Métricas — GitHub Actions
Coleta diária de métricas da conta e dos posts via Instagram Login API.
Salva snapshot em business/instagram/metricas/YYYY-MM-DD.md
e acumula histórico da conta em business/instagram/metricas/historico-conta.csv

Credencial: IG_INSIGHTS_TOKEN (GitHub Secret) — token da API
"Instagram API com login do Instagram" com instagram_business_manage_insights.
"""
import os, sys, csv, requests
from datetime import date, datetime, timezone, timedelta

TOKEN = os.environ["IG_INSIGHTS_TOKEN"]
BASE  = "https://graph.instagram.com/v21.0"

OUT_DIR   = "business/instagram/metricas"
HIST_CSV  = f"{OUT_DIR}/historico-conta.csv"
N_POSTS   = 25          # quantos posts recentes acompanhar
BRT       = timezone(timedelta(hours=-3))

hoje  = date.today().isoformat()
agora = datetime.now(BRT).strftime("%d/%m/%Y %H:%M BRT")


def get(path, **params):
    params["access_token"] = TOKEN
    r = requests.get(f"{BASE}/{path}", params=params, timeout=60)
    data = r.json()
    if "error" in data:
        raise RuntimeError(f"{path}: {data['error'].get('message')}")
    return data


def insights_do_post(media_id):
    """Métricas lifetime de um post. Retorna dict {metric: value}."""
    try:
        data = get(f"{media_id}/insights",
                   metric="reach,saved,shares,views,total_interactions")
        return {m["name"]: m["values"][0]["value"] for m in data["data"]}
    except RuntimeError as e:
        print(f"  aviso: sem insights para {media_id} ({e})")
        return {}


# ── 1. Conta ──────────────────────────────────────────────────────────────────
conta = get("me", fields="username,followers_count,media_count")
username   = conta["username"]
seguidores = conta["followers_count"]

reach_dia = visitas_dia = ""
try:
    ins = get("me/insights", metric="reach,profile_views",
              period="day", metric_type="total_value")
    vals = {m["name"]: m["total_value"]["value"] for m in ins["data"]}
    reach_dia   = vals.get("reach", "")
    visitas_dia = vals.get("profile_views", "")
except RuntimeError as e:
    print(f"aviso: insights da conta indisponíveis ({e})")

# ── 2. Posts recentes ─────────────────────────────────────────────────────────
midia = get("me/media",
            fields="id,caption,media_type,media_product_type,timestamp,"
                   "like_count,comments_count,permalink",
            limit=N_POSTS)["data"]

posts = []
for m in midia:
    ins = insights_do_post(m["id"])
    caption = (m.get("caption") or "").replace("\n", " ").replace("|", "/")
    dt = datetime.fromisoformat(m["timestamp"].replace("+0000", "+00:00"))
    posts.append({
        "data":        dt.astimezone(BRT).strftime("%d/%m %H:%M"),
        "tipo":        m.get("media_product_type") or m.get("media_type", ""),
        "hook":        caption[:70] + ("…" if len(caption) > 70 else ""),
        "alcance":     ins.get("reach", ""),
        "views":       ins.get("views", ""),
        "curtidas":    m.get("like_count", ""),
        "comentarios": m.get("comments_count", ""),
        "saves":       ins.get("saved", ""),
        "shares":      ins.get("shares", ""),
        "interacoes":  ins.get("total_interactions", ""),
        "link":        m.get("permalink", ""),
    })

# ── 3. Snapshot markdown do dia ───────────────────────────────────────────────
os.makedirs(OUT_DIR, exist_ok=True)

linhas = [
    f"# Métricas Instagram — @{username} — {hoje}",
    "",
    f"> Coletado automaticamente em {agora} pelo workflow instagram-metricas.",
    "",
    "## Conta",
    "",
    f"- **Seguidores:** {seguidores}",
    f"- **Alcance (hoje):** {reach_dia}",
    f"- **Visitas ao perfil (hoje):** {visitas_dia}",
    "",
    f"## Últimos {len(posts)} posts (métricas lifetime)",
    "",
    "| Data | Tipo | Início da legenda | Alcance | Views | Curtidas | Comentários | Saves | Shares | Interações | Link |",
    "|------|------|-------------------|---------|-------|----------|-------------|-------|--------|------------|------|",
]
for p in posts:
    linhas.append(
        f"| {p['data']} | {p['tipo']} | {p['hook']} | {p['alcance']} | {p['views']} "
        f"| {p['curtidas']} | {p['comentarios']} | {p['saves']} | {p['shares']} "
        f"| {p['interacoes']} | {p['link']} |")

with open(f"{OUT_DIR}/{hoje}.md", "w", encoding="utf-8") as f:
    f.write("\n".join(linhas) + "\n")

# ── 4. Histórico acumulado da conta (1 linha por dia) ─────────────────────────
novo = not os.path.exists(HIST_CSV)
with open(HIST_CSV, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    if novo:
        w.writerow(["data", "seguidores", "alcance_dia", "visitas_perfil_dia"])
    w.writerow([hoje, seguidores, reach_dia, visitas_dia])

print(f"OK: {OUT_DIR}/{hoje}.md gerado ({len(posts)} posts) + histórico atualizado.")
