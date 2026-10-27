#!/usr/bin/env python3
"""
Instagram Métricas — GitHub Actions
Coleta diária de métricas da conta e dos posts via Instagram Login API.
Salva snapshot em business/instagram/metricas/YYYY-MM-DD.md
e acumula histórico da conta em business/instagram/metricas/historico-conta.csv
Comentários (texto) de cada post vão em business/instagram/metricas/comentarios/YYYY-MM-DD.json
— input pronto pra Aria (squad-conteudo-arcane) analisar.

Credencial: IG_INSIGHTS_TOKEN (GitHub Secret) — token da API
"Instagram API com login do Instagram" com instagram_business_manage_insights.
Comentários e métricas de retenção de Reels (reels_skip_rate, ig_reels_avg_watch_time)
podem exigir escopo adicional (instagram_manage_comments) — se faltar, o script avisa
e segue sem quebrar o resto da coleta.
"""
import os, sys, csv, json, requests
from datetime import date, datetime, timezone, timedelta

BASE  = "https://graph.instagram.com/v21.0"


def escolher_token():
    """Usa o token renovado guardado pelo próprio workflow (IG_INSIGHTS_TOKEN_SALVO) ou o do
    GitHub Secret (IG_INSIGHTS_TOKEN), o que estiver valendo. Assim um token novo colado
    no Secret à mão passa a valer sem precisar mexer no arquivo guardado."""
    candidatos = [os.environ.get("IG_INSIGHTS_TOKEN_SALVO"), os.environ.get("IG_INSIGHTS_TOKEN")]
    for t in [c.strip() for c in candidatos if c and c.strip()]:
        r = requests.get(f"{BASE}/me", params={"fields": "id", "access_token": t}, timeout=60)
        if "error" not in r.json():
            return t
    sys.exit("ERRO: nenhum token do Instagram valido (vencido ou revogado). "
             "Gerar um novo no painel da Meta (app api > Instagram > Gerar token) "
             "e salvar no Secret IG_INSIGHTS_TOKEN.")


TOKEN = escolher_token()
TOKEN_OUT = os.environ.get("IG_TOKEN_OUT")  # arquivo onde o workflow guarda o token renovado

OUT_DIR       = "business/instagram/metricas"
COMENT_DIR    = f"{OUT_DIR}/comentarios"
HIST_CSV      = f"{OUT_DIR}/historico-conta.csv"
JANELA_DIAS   = 10          # janela de dias pra acompanhar (era: últimos 25 posts, fixo)
N_COMENTARIOS = 50          # limite de comentarios buscados por post
BRT           = timezone(timedelta(hours=-3))

hoje  = date.today().isoformat()
agora = datetime.now(BRT).strftime("%d/%m/%Y %H:%M BRT")


def get(path, **params):
    params["access_token"] = TOKEN
    r = requests.get(f"{BASE}/{path}", params=params, timeout=60)
    data = r.json()
    if "error" in data:
        raise RuntimeError(f"{path}: {data['error'].get('message')}")
    return data


def insights_do_post(media_id, tipo):
    """Métricas lifetime de um post. Retorna dict {metric: value}."""
    resultado = {}
    try:
        data = get(f"{media_id}/insights",
                   metric="reach,saved,shares,views,total_interactions")
        resultado.update({m["name"]: m["values"][0]["value"] for m in data["data"]})
    except RuntimeError as e:
        print(f"  aviso: sem insights base para {media_id} ({e})")

    # Retenção só existe pra Reels — chamada separada pra não derrubar as métricas base
    if tipo == "REELS":
        try:
            data = get(f"{media_id}/insights",
                       metric="reels_skip_rate,ig_reels_avg_watch_time")
            resultado.update({m["name"]: m["values"][0]["value"] for m in data["data"]})
        except RuntimeError as e:
            print(f"  aviso: sem metricas de retencao para {media_id} ({e})")

    return resultado


def media_da_conta(dias):
    """Busca posts recentes paginando até passar da janela de `dias` (em vez de contagem fixa de posts).
    Para assim que encontra um post mais velho que a janela, ou quando as páginas acabam
    (com um teto de segurança pra não paginar sem fim se algo vier fora de ordem)."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=dias)
    coletados = []
    url = f"{BASE}/me/media"
    params = {
        "fields": "id,caption,media_type,media_product_type,timestamp,"
                  "like_count,comments_count,permalink",
        "limit": 50,
        "access_token": TOKEN,
    }
    pagina = 0
    while url and pagina < 10:  # teto de seguranca: 10 paginas (ate ~500 posts)
        r = requests.get(url, params=params, timeout=60)
        data = r.json()
        if "error" in data:
            raise RuntimeError(f"me/media: {data['error'].get('message')}")
        for m in data.get("data", []):
            ts = datetime.fromisoformat(m["timestamp"].replace("+0000", "+00:00"))
            if ts < cutoff:
                return coletados  # ja passou da janela, encerra sem seguir paginando
            coletados.append(m)
        url = (data.get("paging") or {}).get("next")
        params = None  # a URL de "next" ja vem com querystring completa
        pagina += 1
    return coletados


def comentarios_do_post(media_id):
    """Comentários (texto) de um post. Retorna lista de dicts."""
    try:
        data = get(f"{media_id}/comments",
                   fields="id,text,username,timestamp", limit=N_COMENTARIOS)
        return data.get("data", [])
    except RuntimeError as e:
        print(f"  aviso: sem acesso a comentarios de {media_id} ({e})")
        return None  # None = falha de permissao, diferente de [] = post sem comentarios


def renovar_token():
    """Renova o token long-lived (vale 60 dias a partir da renovação). Sem isso ele vence
    sozinho, como em 23/10/2026. A Meta só aceita renovar token com mais de 24h de vida —
    se recusar, segue com o atual. Retorna a data de vencimento (ou None)."""
    global TOKEN
    r = requests.get("https://graph.instagram.com/refresh_access_token",
                     params={"grant_type": "ig_refresh_token", "access_token": TOKEN},
                     timeout=60)
    data = r.json()
    if "access_token" not in data:
        print(f"aviso: token nao renovado ({(data.get('error') or {}).get('message')})")
        return None
    TOKEN = data["access_token"]
    if TOKEN_OUT:
        with open(TOKEN_OUT, "w") as f:
            f.write(TOKEN)
    vence = date.today() + timedelta(seconds=data.get("expires_in", 0))
    print(f"token renovado, vence em {vence.isoformat()}")
    return vence


def insights_conta_do_dia(dia):
    """Alcance e visitas ao perfil de um dia fechado (BRT). Usado pra preencher dias
    em que a coleta não rodou."""
    inicio = int(datetime(dia.year, dia.month, dia.day, tzinfo=BRT).timestamp())
    ins = get("me/insights", metric="reach,profile_views", period="day",
              metric_type="total_value", since=inicio, until=inicio + 86400)
    vals = {m["name"]: m["total_value"]["value"] for m in ins["data"]}
    return vals.get("reach", ""), vals.get("profile_views", "")


def dias_sem_coleta():
    """Dias entre a última linha do histórico e hoje (exclusive) que ficaram sem coleta."""
    if not os.path.exists(HIST_CSV):
        return []
    with open(HIST_CSV, encoding="utf-8") as f:
        datas = [l.split(",")[0] for l in f.read().splitlines()[1:] if l]
    if not datas:
        return []
    ultimo = date.fromisoformat(max(datas))
    return [ultimo + timedelta(days=i) for i in range(1, (date.today() - ultimo).days)]


token_vence = renovar_token()

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

# ── 2. Posts recentes (janela de dias, não contagem fixa) ─────────────────────
midia = media_da_conta(JANELA_DIAS)

posts = []
comentarios_por_post = []
comentarios_indisponivel = False

for m in midia:
    tipo = m.get("media_product_type") or m.get("media_type", "")
    ins = insights_do_post(m["id"], tipo)
    caption = (m.get("caption") or "").replace("\n", " ").replace("|", "/")
    dt = datetime.fromisoformat(m["timestamp"].replace("+0000", "+00:00"))
    posts.append({
        "data":         dt.astimezone(BRT).strftime("%d/%m %H:%M"),
        "tipo":         tipo,
        "hook":         caption[:70] + ("…" if len(caption) > 70 else ""),
        "alcance":      ins.get("reach", ""),
        "views":        ins.get("views", ""),
        "curtidas":     m.get("like_count", ""),
        "comentarios":  m.get("comments_count", ""),
        "saves":        ins.get("saved", ""),
        "shares":       ins.get("shares", ""),
        "interacoes":   ins.get("total_interactions", ""),
        "skip_rate":    ins.get("reels_skip_rate", ""),
        "tempo_medio":  ins.get("ig_reels_avg_watch_time", ""),
        "link":         m.get("permalink", ""),
    })

    coments = comentarios_do_post(m["id"])
    if coments is None:
        comentarios_indisponivel = True
    elif coments:
        comentarios_por_post.append({
            "media_id":  m["id"],
            "tipo":      tipo,
            "permalink": m.get("permalink", ""),
            "caption":   m.get("caption") or "",
            "timestamp": m["timestamp"],
            "comentarios": [
                {"id": c.get("id"), "texto": c.get("text"),
                 "autor": c.get("username"), "data": c.get("timestamp")}
                for c in coments
            ],
        })

# ── 3. Snapshot markdown do dia ───────────────────────────────────────────────
os.makedirs(OUT_DIR, exist_ok=True)
faltando = dias_sem_coleta()

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
    f"- **Chave de acesso vence em:** {token_vence.strftime('%d/%m/%Y') if token_vence else 'não renovada hoje'}",
    "",
] + ([
    f"> Dias sem coleta preenchidos no histórico (alcance e visitas do dia fechado, "
    f"seguidores em branco): {', '.join(d.strftime('%d/%m') for d in faltando)}. "
    f"Os posts desses dias estão na tabela abaixo, com métricas de hoje.",
    "",
] if faltando else []) + [
    f"## Posts dos últimos {JANELA_DIAS} dias — {len(posts)} peças (métricas lifetime)",
    "",
    "> Skip rate e tempo médio só existem pra Reels (métrica em desenvolvimento na API da Meta — pode vir vazia às vezes).",
    "",
    "| Data | Tipo | Início da legenda | Alcance | Views | Curtidas | Comentários | Saves | Shares | Interações | Skip rate (3s) | Tempo médio | Link |",
    "|------|------|-------------------|---------|-------|----------|-------------|-------|--------|------------|-----------------|-------------|------|",
]
for p in posts:
    linhas.append(
        f"| {p['data']} | {p['tipo']} | {p['hook']} | {p['alcance']} | {p['views']} "
        f"| {p['curtidas']} | {p['comentarios']} | {p['saves']} | {p['shares']} "
        f"| {p['interacoes']} | {p['skip_rate']} | {p['tempo_medio']} | {p['link']} |")

if comentarios_indisponivel:
    linhas += [
        "",
        "> ⚠️ O token atual não teve permissão pra ler comentários em pelo menos 1 post "
        "(escopo `instagram_manage_comments` pode estar faltando). Comentários coletados "
        "abaixo podem estar incompletos.",
    ]

with open(f"{OUT_DIR}/{hoje}.md", "w", encoding="utf-8") as f:
    f.write("\n".join(linhas) + "\n")

# ── 4. Histórico acumulado da conta (1 linha por dia) ─────────────────────────
# Dias que ficaram sem coleta entram com alcance/visitas do dia fechado; seguidores
# fica vazio porque a API não devolve o total de seguidores de um dia passado.
novo = not os.path.exists(HIST_CSV)
if not novo:  # rodou mais de uma vez no dia: a linha de hoje é substituída, não duplicada
    with open(HIST_CSV, encoding="utf-8") as f:
        linhas_hist = f.read().splitlines()
    with open(HIST_CSV, "w", newline="", encoding="utf-8") as f:
        f.write("\n".join(l for l in linhas_hist if not l.startswith(f"{hoje},")) + "\n")
with open(HIST_CSV, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    if novo:
        w.writerow(["data", "seguidores", "alcance_dia", "visitas_perfil_dia"])
    for dia in faltando:
        try:
            r_dia, v_dia = insights_conta_do_dia(dia)
        except RuntimeError as e:
            print(f"aviso: sem insights de {dia} ({e})")
            r_dia = v_dia = ""
        w.writerow([dia.isoformat(), "", r_dia, v_dia])
        print(f"preenchido dia sem coleta: {dia} (alcance {r_dia}, visitas {v_dia})")
    w.writerow([hoje, seguidores, reach_dia, visitas_dia])

# ── 5. Comentários do dia (texto completo, pronto pra Aria analisar) ──────────
os.makedirs(COMENT_DIR, exist_ok=True)
with open(f"{COMENT_DIR}/{hoje}.json", "w", encoding="utf-8") as f:
    json.dump({
        "data": hoje,
        "username": username,
        "total_posts_com_comentarios": len(comentarios_por_post),
        "posts": comentarios_por_post,
    }, f, ensure_ascii=False, indent=2)

print(f"OK: {OUT_DIR}/{hoje}.md gerado ({len(posts)} posts) + histórico atualizado "
      f"+ {COMENT_DIR}/{hoje}.json ({len(comentarios_por_post)} posts com comentários).")
if comentarios_indisponivel:
    print("AVISO: permissao de comentarios ausente/parcial no token atual.")
