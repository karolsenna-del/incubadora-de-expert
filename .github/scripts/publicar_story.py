#!/usr/bin/env python3
"""
Instagram Stories Scheduler — GitHub Actions
Publica a(s) Story(s) do dia que o Expert-Stories deixou prontas em
business/instagram/stories/fila/{slug}/story-NN.png.

Diferente do publicar.py (carrossel):
- Sem SCHEDULE fixo por data — o Expert-Stories decide o slug/conteudo no dia.
- Um disparo manual pode escolher exatamente um slug com STORY_SLUG.
- Um disparo agendado publica somente a pasta da data atual em America/Cuiaba.
- Sem caption — Stories nao aceita esse parametro na Graph API.
- Suporta sequencia de N imagens, publicadas em ordem.
- Antes da primeira imagem, tenta apagar a Story anterior ainda ativa.

Credenciais vem de GitHub Secrets (env vars) — mesmas do publicar.py.
"""
import hashlib
import os
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import requests

# ── Credenciais (GitHub Secrets) ─────────────────────────────────────────────
# getenv deixa o modulo importavel pelos testes sem carregar segredos.
META_TOKEN = os.environ.get("META_TOKEN")
IG_USER_ID = os.environ.get("IG_USER_ID")
CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME")
CLOUD_KEY = os.environ.get("CLOUDINARY_API_KEY")
CLOUD_SEC = os.environ.get("CLOUDINARY_API_SECRET")
META_BASE = f"https://graph.facebook.com/v21.0/{IG_USER_ID}"
META_ROOT = "https://graph.facebook.com/v21.0"

# ── Paths ─────────────────────────────────────────────────────────────────────
FILA_DIR = "business/instagram/stories/fila"
AGENDADOS_DIR = "business/instagram/stories/agendados"
LOG_FILE = "business/instagram/stories/agendamentos-stories.md"
STATE_FILE = "business/instagram/stories/ultima-story-media-id.txt"
TIMEZONE = ZoneInfo("America/Cuiaba")


def select_story_slug(fila_dir, requested_slug=None, current_date=None):
    """Seleciona com seguranca a pasta a publicar, sem acessar APIs.

    Com requested_slug, aceita apenas um diretorio filho direto e real da fila.
    Sem requested_slug, considera somente diretorios terminados na data atual.
    Retorna None quando uma execucao agendada nao tem item para hoje.
    """
    queue = Path(fila_dir).resolve()

    if requested_slug is not None and requested_slug != "":
        slug = requested_slug
        invalid = (
            not slug
            or slug != slug.strip()
            or slug in {".", ".."}
            or "/" in slug
            or "\\" in slug
            or "\0" in slug
            or Path(slug).name != slug
            or os.path.isabs(slug)
        )
        if invalid:
            raise ValueError(f"Slug invalido: {slug!r}")

        candidate = queue / slug
        resolved = candidate.resolve()
        if candidate.is_symlink() or resolved.parent != queue:
            raise ValueError(f"Slug invalido: {slug!r}")
        if not candidate.is_dir():
            raise ValueError(f"Slug {slug!r} nao existe na fila")
        return slug

    if not queue.is_dir():
        return None

    day = current_date or datetime.now(TIMEZONE).date()
    suffix = f"-{day.isoformat()}"
    candidates = sorted(
        entry.name
        for entry in queue.iterdir()
        if entry.is_dir() and not entry.is_symlink() and entry.name.endswith(suffix)
    )
    if not candidates:
        return None
    if len(candidates) > 1:
        raise ValueError(
            f"Mais de uma Story para {day.isoformat()}: {', '.join(candidates)}. "
            "Informe STORY_SLUG explicitamente; nada foi publicado."
        )
    return candidates[0]


def require_credentials():
    required = {
        "META_TOKEN": META_TOKEN,
        "IG_USER_ID": IG_USER_ID,
        "CLOUDINARY_CLOUD_NAME": CLOUD_NAME,
        "CLOUDINARY_API_KEY": CLOUD_KEY,
        "CLOUDINARY_API_SECRET": CLOUD_SEC,
    }
    missing = [name for name, value in required.items() if not value]
    if missing:
        raise RuntimeError(f"Credenciais ausentes: {', '.join(missing)}")


# ── Helpers Cloudinary ────────────────────────────────────────────────────────
def upload_cloudinary(local_path, public_id):
    ts = int(time.time())
    sig = hashlib.sha1(
        f"public_id={public_id}&timestamp={ts}{CLOUD_SEC}".encode()
    ).hexdigest()
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
    with open(local_path, "rb") as file_handle:
        response = requests.post(
            url,
            data={
                "public_id": public_id,
                "api_key": CLOUD_KEY,
                "timestamp": ts,
                "signature": sig,
            },
            files={"file": file_handle},
            timeout=60,
        )
    response.raise_for_status()
    return response.json()["secure_url"]


# ── Helpers Meta ──────────────────────────────────────────────────────────────
def meta_post(endpoint, params):
    params["access_token"] = META_TOKEN
    response = requests.post(f"{META_BASE}/{endpoint}", params=params, timeout=30)
    data = response.json()
    if "error" in data:
        raise RuntimeError(data["error"]["message"])
    return data["id"]


def wait_finished(container_id):
    for _attempt in range(20):
        response = requests.get(
            f"{META_ROOT}/{container_id}",
            params={"fields": "status_code", "access_token": META_TOKEN},
            timeout=30,
        )
        status = response.json().get("status_code", "UNKNOWN")
        if status == "FINISHED":
            return
        if status == "ERROR":
            raise RuntimeError("Container falhou com status ERROR")
        time.sleep(5)
    raise RuntimeError("Container nao ficou FINISHED apos 100s. Abortando.")


def deletar_story_anterior():
    """Tenta apagar a Story anterior sem impedir a publicacao da nova."""
    if not os.path.isfile(STATE_FILE):
        return
    with open(STATE_FILE, encoding="utf-8") as state_handle:
        media_id = state_handle.read().strip()
    if not media_id:
        return
    print(f"Apagando Story anterior (media_id={media_id}) ...", end=" ", flush=True)
    response = requests.delete(
        f"{META_ROOT}/{media_id}",
        params={"access_token": META_TOKEN},
        timeout=30,
    )
    data = response.json()
    if data.get("success"):
        print("ok")
    else:
        print(f"aviso: {data}")


def main():
    operational_date = datetime.now(TIMEZONE).date()
    try:
        slug = select_story_slug(
            FILA_DIR,
            requested_slug=os.environ.get("STORY_SLUG"),
            current_date=operational_date,
        )
    except ValueError as error:
        print(f"ERRO: {error}", file=sys.stderr)
        return 1

    if slug is None:
        print(
            f"Nenhuma Story para {operational_date.isoformat()} na fila. "
            "Backlog nao sera publicado."
        )
        return 0

    try:
        require_credentials()
    except RuntimeError as error:
        print(f"ERRO: {error}", file=sys.stderr)
        return 1

    pasta = os.path.join(FILA_DIR, slug)
    imagens = sorted(
        filename
        for filename in os.listdir(pasta)
        if filename.startswith("story-") and filename.endswith(".png")
    )
    if not imagens:
        print(f"ERRO: pasta {pasta} nao tem nenhuma story-NN.png.", file=sys.stderr)
        return 1

    print(f"Slug: {slug} — {len(imagens)} Story(s) na sequencia")
    deletar_story_anterior()

    media_ids = []
    for image in imagens:
        public_id = f"story-{slug}-{image.replace('.png', '')}"
        print(f"  Cloudinary: {image} ...", end=" ", flush=True)
        image_url = upload_cloudinary(os.path.join(pasta, image), public_id)
        print("ok")

        print("  Container STORIES ...", end=" ", flush=True)
        container_id = meta_post(
            "media", {"media_type": "STORIES", "image_url": image_url}
        )
        print(f"ok ({container_id})")

        print("  Aguardando FINISHED ...", end=" ", flush=True)
        wait_finished(container_id)
        print("ok")

        print("  Publicando ...", end=" ", flush=True)
        media_id = meta_post("media_publish", {"creation_id": container_id})
        media_ids.append(media_id)
        print(f"ok ({media_id})")

    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as state_handle:
        state_handle.write(media_ids[-1])

    date_fmt = operational_date.strftime("%d/%m/%Y")
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    if not os.path.isfile(LOG_FILE):
        with open(LOG_FILE, "w", encoding="utf-8") as log_handle:
            log_handle.write("# Log de Agendamentos — Instagram Stories\n\n")
            log_handle.write(
                "> Historico de Stories publicadas automaticamente. Append-only.\n\n"
            )
            log_handle.write("---\n\n")
            log_handle.write(
                "| Data | Slug | Qtd Stories | Media IDs | Story anterior apagada |\n"
            )
            log_handle.write(
                "|------|------|-------------|-----------|-------------------------|\n"
            )
    with open(LOG_FILE, "a", encoding="utf-8") as log_handle:
        log_handle.write(
            f"| {date_fmt} | {slug} | {len(media_ids)} | "
            f"{', '.join(media_ids)} | sim (ver log de execucao) |\n"
        )

    os.makedirs(AGENDADOS_DIR, exist_ok=True)
    shutil.move(pasta, os.path.join(AGENDADOS_DIR, slug))

    print("\n=== PUBLICADO ===")
    print(f"  Slug:      {slug}")
    print(f"  Stories:   {len(media_ids)}")
    print(f"  Media IDs: {media_ids}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
