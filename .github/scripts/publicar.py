#!/usr/bin/env python3
"""
Instagram Scheduler — GitHub Actions
Publica o carrossel do dia baseado na data atual.
Credenciais vêm de GitHub Secrets (env vars).
"""
import hashlib, time, os, sys, shutil, requests
from datetime import date

# ── Credenciais (GitHub Secrets) ─────────────────────────────────────────────
META_TOKEN  = os.environ["META_TOKEN"]
IG_USER_ID  = os.environ["IG_USER_ID"]
CLOUD_NAME  = os.environ["CLOUDINARY_CLOUD_NAME"]
CLOUD_KEY   = os.environ["CLOUDINARY_API_KEY"]
CLOUD_SEC   = os.environ["CLOUDINARY_API_SECRET"]
META_BASE   = f"https://graph.facebook.com/v21.0/{IG_USER_ID}"

# ── Calendário ────────────────────────────────────────────────────────────────
SCHEDULE = {
    "2026-06-25": "cansaco-palavra-do-ano",
    "2026-06-26": "diploma-vs-vivencia",
    "2026-06-27": "duas-pos-graduacoes",
    "2026-06-28": "medo-parecer-amadora",
    "2026-06-29": "nao-precisa-seguidores",
    "2026-06-30": "sabe-demais-paralisando",
}

# ── Paths ─────────────────────────────────────────────────────────────────────
FILA_DIR      = "business/instagram/fila"
AGENDADOS_DIR = "business/instagram/agendados"
LOG_FILE      = "business/instagram/agendamentos.md"

# ── Checar data ───────────────────────────────────────────────────────────────
today = str(date.today())
slug  = SCHEDULE.get(today)

if not slug:
    print(f"Nenhum carrossel agendado para hoje ({today}). Nada a fazer.")
    sys.exit(0)

print(f"Data: {today} → publicando: {slug}")

pasta = os.path.join(FILA_DIR, slug)
if not os.path.isdir(pasta):
    print(f"ERRO: pasta {pasta} não encontrada. Já foi publicado?")
    sys.exit(1)

# ── Helpers Cloudinary ────────────────────────────────────────────────────────
def upload_cloudinary(local_path, public_id):
    ts  = int(time.time())
    sig = hashlib.sha1(
        f"public_id={public_id}&timestamp={ts}{CLOUD_SEC}".encode()
    ).hexdigest()
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
    with open(local_path, "rb") as f:
        r = requests.post(url, data={
            "public_id": public_id,
            "api_key":   CLOUD_KEY,
            "timestamp": ts,
            "signature": sig,
        }, files={"file": f}, timeout=60)
    r.raise_for_status()
    return r.json()["secure_url"]

# ── Helpers Meta ──────────────────────────────────────────────────────────────
def meta_post(endpoint, params):
    params["access_token"] = META_TOKEN
    r = requests.post(f"{META_BASE}/{endpoint}", params=params, timeout=30)
    data = r.json()
    if "error" in data:
        raise RuntimeError(data["error"]["message"])
    return data["id"]

# ── Pipeline ──────────────────────────────────────────────────────────────────
slides  = sorted(f for f in os.listdir(pasta) if f.startswith("slide-") and f.endswith(".png"))
caption = open(os.path.join(pasta, "legenda.txt"), encoding="utf-8").read().strip()

print(f"{len(slides)} slides encontrados")

# 1. Upload Cloudinary
urls = []
for s in slides:
    pid = f"{slug}-{s.replace('.png', '')}"
    print(f"  Cloudinary: {s} ...", end=" ", flush=True)
    url = upload_cloudinary(os.path.join(pasta, s), pid)
    urls.append(url)
    print("ok")

# 2. Containers de slide
print("Criando containers de slide...", end=" ", flush=True)
children = [meta_post("media", {"image_url": u, "is_carousel_item": "true"}) for u in urls]
print(f"ok ({len(children)} containers)")

# 3. Container carrossel (publicacao imediata)
print("Criando container carrossel...", end=" ", flush=True)
carousel_id = meta_post("media", {
    "media_type": "CAROUSEL",
    "children":   ",".join(children),
    "caption":    caption,
})
print(f"ok ({carousel_id})")

# 4. Publicar
print("Publicando...", end=" ", flush=True)
media_id = meta_post("media_publish", {"creation_id": carousel_id})
print(f"ok")

# 5. Log
date_fmt = date.today().strftime("%d/%m/%Y")
log_line = f"| {date_fmt} | {slug} | {date_fmt} 12h | {media_id} | publicado automaticamente |\n"
with open(LOG_FILE, "a", encoding="utf-8") as f:
    f.write(log_line)

# 6. Mover pasta
dest = os.path.join(AGENDADOS_DIR, slug)
os.makedirs(AGENDADOS_DIR, exist_ok=True)
shutil.move(pasta, dest)

print(f"\n=== PUBLICADO ===")
print(f"  Slug:     {slug}")
print(f"  Data:     {date_fmt} 12h BRT")
print(f"  Media ID: {media_id}")
