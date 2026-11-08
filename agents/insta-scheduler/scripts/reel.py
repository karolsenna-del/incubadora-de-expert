#!/usr/bin/env python3
"""
reel.py — Reels no Postador (criado 06/11/2026).

O .mp4 não vai pro GitHub (.gitignore), então o vídeo sobe do PC pro Cloudinary e o
workflow agendado só recebe o link, igual aos carrosséis (post-*.yml).

uso (na raiz do repo; credenciais em env: META_TOKEN, IG_USER_ID, CLOUDINARY_*):
  reel.py subir   <pasta>                 sobe video.mp4 pro Cloudinary, grava video_url.txt
  reel.py testar  <pasta>                 cria o container REELS e espera FINISHED, SEM publicar
  reel.py agendar <pasta> <AAAA-MM-DD> <HH:MM>   gera .github/workflows/reel-<slug>.yml
                                          (horário de Cuiabá, UTC-4)
<pasta> = business/instagram/fila-reels/<slug>/ com video.mp4 + legenda.txt
"""
import hashlib, os, sys, time, json
from datetime import datetime, timedelta
import requests

BASE = "https://graph.facebook.com/v21.0"


def env(n):
    v = os.environ.get(n)
    if not v:
        sys.exit(f"ERRO: credencial {n} ausente")
    return v


def subir(pasta):
    slug = os.path.basename(os.path.normpath(pasta))
    cloud, key, sec = env("CLOUDINARY_CLOUD_NAME"), env("CLOUDINARY_API_KEY"), env("CLOUDINARY_API_SECRET")
    public_id = f"instagram-reels/{slug}"
    ts = int(time.time())
    # invalidate: ao refazer um vídeo já agendado, o link antigo passa a entregar o novo (07/11)
    sig = hashlib.sha1(f"invalidate=true&overwrite=true&public_id={public_id}&timestamp={ts}{sec}".encode()).hexdigest()
    with open(os.path.join(pasta, "video.mp4"), "rb") as f:
        r = requests.post(f"https://api.cloudinary.com/v1_1/{cloud}/video/upload",
                          data={"public_id": public_id, "overwrite": "true", "invalidate": "true", "api_key": key,
                                "timestamp": ts, "signature": sig},
                          files={"file": f}, timeout=600)
    if r.status_code != 200:
        sys.exit(f"ERRO Cloudinary {r.status_code}: {r.text[:300]}")
    url = r.json()["secure_url"]
    with open(os.path.join(pasta, "video_url.txt"), "w", encoding="utf-8") as f:
        f.write(url + "\n")
    print(f"subiu: {slug} -> {url}")


def criar_container(video_url, caption, token, ig):
    r = requests.post(f"{BASE}/{ig}/media", params={"access_token": token},
                      data={"media_type": "REELS", "video_url": video_url, "caption": caption,
                            "share_to_feed": "true"}, timeout=60)
    d = r.json()
    if "error" in d:
        sys.exit(f"ERRO Meta: {d['error'].get('message')}")
    return d["id"]


def esperar(cid, token):
    # vídeo demora a processar: até 10 min
    for _ in range(60):
        d = requests.get(f"{BASE}/{cid}", params={"fields": "status_code,status", "access_token": token},
                         timeout=30).json()
        st = d.get("status_code")
        if st == "FINISHED":
            return
        if st == "ERROR":
            sys.exit(f"ERRO: container falhou: {d.get('status')}")
        time.sleep(10)
    sys.exit("ERRO: container não ficou FINISHED em 10 min")


def ler(pasta):
    with open(os.path.join(pasta, "video_url.txt"), encoding="utf-8") as f:
        url = f.read().strip()
    with open(os.path.join(pasta, "legenda.txt"), encoding="utf-8-sig") as f:
        cap = f.read().strip()
    return url, cap


def testar(pasta):
    url, cap = ler(pasta)
    token, ig = env("META_TOKEN"), env("IG_USER_ID")
    cid = criar_container(url, cap, token, ig)
    print(f"container {cid} criado, processando...")
    esperar(cid, token)
    print("FINISHED: o Instagram aceitou o vídeo. Nada foi publicado (container expira em 24h).")


WF = """name: Reel {slug}

on:
  schedule:
    - cron: '{cron}'   # {quando} (Cuiabá)
  workflow_dispatch:

jobs:
  publicar:
    runs-on: ubuntu-latest
    steps:
      - name: Publicar Reel via Meta Graph API
        env:
          META_TOKEN: ${{{{ secrets.META_TOKEN }}}}
          IG_USER_ID: "{ig}"
          VIDEO_URL: "{url}"
          CAPTION: |
{caption}
        run: |
          python3 - <<'EOF'
          import os, time, requests
          T, IG, B = os.environ["META_TOKEN"], os.environ["IG_USER_ID"], "https://graph.facebook.com/v21.0"
          r = requests.post(f"{{B}}/{{IG}}/media", params={{"access_token": T}}, data={{
              "media_type": "REELS", "video_url": os.environ["VIDEO_URL"],
              "caption": os.environ["CAPTION"].strip(), "share_to_feed": "true"}}, timeout=60)
          print("container:", r.status_code, r.text[:200]); r.raise_for_status()
          cid = r.json()["id"]
          for i in range(60):
              d = requests.get(f"{{B}}/{{cid}}", params={{"fields": "status_code,status", "access_token": T}}, timeout=30).json()
              if d.get("status_code") == "FINISHED":
                  break
              if d.get("status_code") == "ERROR":
                  raise RuntimeError(f"container ERROR: {{d}}")
              time.sleep(10)
          else:
              raise RuntimeError("container não ficou FINISHED em 10 min")
          r = requests.post(f"{{B}}/{{IG}}/media_publish", params={{"access_token": T}}, data={{"creation_id": cid}}, timeout=60)
          print("publish:", r.status_code, r.text[:200]); r.raise_for_status()
          print("PUBLICADO:", r.json())
          EOF
"""


def agendar(pasta, dia, hora):
    slug = os.path.basename(os.path.normpath(pasta))
    url, cap = ler(pasta)
    local = datetime.strptime(f"{dia} {hora}", "%Y-%m-%d %H:%M")
    utc = local + timedelta(hours=4)  # Cuiabá = UTC-4
    cron = f"{utc.minute} {utc.hour} {utc.day} {utc.month} *"
    caption = "\n".join(("            " + l) if l.strip() else "" for l in cap.splitlines())
    out = os.path.join(".github", "workflows", f"reel-{slug}.yml")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write(WF.format(slug=slug, cron=cron, quando=local.strftime("%d/%m %H:%M"),
                          ig=env("IG_USER_ID"), url=url, caption=caption))
    print(f"agendado: {out} -> {local:%d/%m %H:%M} Cuiabá (cron {cron} UTC)")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cmd, pasta = sys.argv[1], sys.argv[2]
    {"subir": lambda: subir(pasta), "testar": lambda: testar(pasta),
     "agendar": lambda: agendar(pasta, sys.argv[3], sys.argv[4])}[cmd]()
