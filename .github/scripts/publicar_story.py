#!/usr/bin/env python3
"""
Instagram Stories Scheduler — GitHub Actions
Publica a(s) Story(s) do dia que o Expert-Stories deixou prontas em
business/instagram/stories/fila/{slug}/story-NN.png.

Diferente do publicar.py (carrossel):
- Sem SCHEDULE fixo por data — o Expert-Stories decide o slug/conteudo no dia,
  este script so publica o que encontrar pendente na fila.
- Sem caption — Stories nao aceita esse parametro na Graph API.
- Suporta sequencia de N imagens (Day Off / live de quarta podem ter 2-4 Stories),
  publicadas em ordem, cada uma com seu proprio container -> media_publish.
- Antes de publicar a primeira imagem do lote, apaga a Story anterior ainda ativa
  (media_id guardado em ultima-story-media-id.txt) — pedido da Karol (21/08/2026):
  a Levantada de Mao (8h-10h) nao pode subir misturada com Story antiga.

Credenciais vem de GitHub Secrets (env vars) — mesmas do publicar.py.
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
META_ROOT   = "https://graph.facebook.com/v21.0"

# ── Paths ─────────────────────────────────────────────────────────────────────
FILA_DIR       = "business/instagram/stories/fila"
AGENDADOS_DIR  = "business/instagram/stories/agendados"
LOG_FILE       = "business/instagram/stories/agendamentos-stories.md"
STATE_FILE     = "business/instagram/stories/ultima-story-media-id.txt"

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

def wait_finished(container_id):
    for attempt in range(20):
        r = requests.get(
            f"{META_ROOT}/{container_id}",
            params={"fields": "status_code", "access_token": META_TOKEN},
            timeout=30
        )
        status = r.json().get("status_code", "UNKNOWN")
        if status == "FINISHED":
            return
        if status == "ERROR":
            raise RuntimeError("Container falhou com status ERROR")
        time.sleep(5)
    raise RuntimeError("Container nao ficou FINISHED apos 100s. Abortando.")

def deletar_story_anterior():
    """Apaga a ultima Story publicada (se ainda existir) antes de publicar a nova.
    Requisito da Karol (21/08): Levantada de Mao nao pode subir misturada com
    Story antiga ainda ativa. Falha aqui NAO aborta o script — so avisa —
    porque a pior consequencia e a Story antiga expirar sozinha (24h) mais tarde,
    nunca um post perdido."""
    if not os.path.isfile(STATE_FILE):
        return
    media_id = open(STATE_FILE, encoding="utf-8").read().strip()
    if not media_id:
        return
    print(f"Apagando Story anterior (media_id={media_id}) ...", end=" ", flush=True)
    r = requests.delete(
        f"{META_ROOT}/{media_id}",
        params={"access_token": META_TOKEN},
        timeout=30
    )
    data = r.json()
    if data.get("success"):
        print("ok")
    else:
        # Provavel causa: token sem permissao instagram_manage_contents (ver KB),
        # ou a Story ja tinha expirado sozinha (24h) — nenhum dos dois bloqueia o post novo.
        print(f"aviso: {data}")

# ── Checar fila ───────────────────────────────────────────────────────────────
if not os.path.isdir(FILA_DIR) or not os.listdir(FILA_DIR):
    print("Nenhuma Story pendente na fila. Nada a fazer.")
    sys.exit(0)

slug = sorted(os.listdir(FILA_DIR))[0]
pasta = os.path.join(FILA_DIR, slug)
imagens = sorted(f for f in os.listdir(pasta) if f.startswith("story-") and f.endswith(".png"))

if not imagens:
    print(f"ERRO: pasta {pasta} nao tem nenhuma story-NN.png.")
    sys.exit(1)

print(f"Slug: {slug} — {len(imagens)} Story(s) na sequencia")

# ── Apagar Story anterior ANTES de publicar a primeira da sequencia ──────────
deletar_story_anterior()

# ── Publicar cada imagem da sequencia, em ordem ───────────────────────────────
media_ids = []
for img in imagens:
    pid = f"story-{slug}-{img.replace('.png', '')}"
    print(f"  Cloudinary: {img} ...", end=" ", flush=True)
    url = upload_cloudinary(os.path.join(pasta, img), pid)
    print("ok")

    print(f"  Container STORIES ...", end=" ", flush=True)
    container_id = meta_post("media", {"media_type": "STORIES", "image_url": url})
    print(f"ok ({container_id})")

    print(f"  Aguardando FINISHED ...", end=" ", flush=True)
    wait_finished(container_id)
    print("ok")

    print(f"  Publicando ...", end=" ", flush=True)
    media_id = meta_post("media_publish", {"creation_id": container_id})
    media_ids.append(media_id)
    print(f"ok ({media_id})")

# ── Guardar o media_id da ULTIMA story publicada (e essa que precisa ser
#    apagada antes do proximo post) ────────────────────────────────────────────
os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
with open(STATE_FILE, "w", encoding="utf-8") as f:
    f.write(media_ids[-1])

# ── Log ────────────────────────────────────────────────────────────────────────
date_fmt = date.today().strftime("%d/%m/%Y")
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
if not os.path.isfile(LOG_FILE):
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("# Log de Agendamentos — Instagram Stories\n\n")
        f.write("> Historico de Stories publicadas automaticamente. Append-only.\n\n")
        f.write("---\n\n")
        f.write("| Data | Slug | Qtd Stories | Media IDs | Story anterior apagada |\n")
        f.write("|------|------|-------------|-----------|-------------------------|\n")
with open(LOG_FILE, "a", encoding="utf-8") as f:
    f.write(f"| {date_fmt} | {slug} | {len(media_ids)} | {', '.join(media_ids)} | sim (ver log de execucao) |\n")

# ── Mover pasta pra agendados ────────────────────────────────────────────────
os.makedirs(AGENDADOS_DIR, exist_ok=True)
shutil.move(pasta, os.path.join(AGENDADOS_DIR, slug))

print(f"\n=== PUBLICADO ===")
print(f"  Slug:      {slug}")
print(f"  Stories:   {len(media_ids)}")
print(f"  Media IDs: {media_ids}")
