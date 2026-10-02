"""
Course Publisher — Thumbnails das aulas publicadas na Área de Membros (YouTube)
Expert360 | Incubadora de Expert
Dimensoes: 1280x720px (miniatura personalizada do YouTube)

Mesmo design do gerar-thumbs.py, mas o título vem do site (js/data.js) —
com acento e no nome atual da aula — em vez do slug do arquivo.
Só gera aulas que já têm youtube_id. Saída: thumbnails/youtube/{MOD}-{NN}-{youtube_id}.png
Também grava thumbnails/youtube/manifest.json (arquivo → youtube_id → título).
"""

import os
import re
import json
import base64
import tempfile
from playwright.sync_api import sync_playwright
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(BASE_DIR, "../../../.."))
DATA_JS = os.path.join(REPO, "business/campanhas/area-de-membros/site/js/data.js")
OUTPUT_DIR = os.path.join(BASE_DIR, "thumbnails", "youtube")
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "../../../campanhas/expert360-curso/branding/logo-preto.png")
)
with open(LOGO_PATH, "rb") as _f:
    LOGO_DATA_URL = "data:image/png;base64," + base64.b64encode(_f.read()).decode("utf-8")

# Rótulo de cada módulo (com acento) — id do data.js → (sigla, nome)
MODULOS = {
    "orientacoes": ("MO", "Módulo de Orientações", None),
    "m0": ("M0", "Módulo M0", "Desbloqueio"),
    "m1": ("M1", "Módulo M1", "Persona e Promessa"),
    "m2": ("M2", "Módulo M2", "Método Autoral"),
    "m3": ("M3", "Módulo M3", "Vendas Secretas"),
    "m4": ("M4", "Módulo M4", "Autoridade Digital"),
}


def ler_aulas():
    """Extrai (modulo_id, ordem, titulo, youtube_id) do ROTEIRO_EXPERT360 em data.js."""
    src = open(DATA_JS, encoding="utf-8").read()
    src = src.split("TRILHA_MENTORIA")[0] if "TRILHA_MENTORIA" in src else src.split("id: 'mentoria'")[0]
    aulas = []
    mod_atual, ordem = None, 0
    for linha in src.splitlines():
        m = re.search(r"id: '([a-z0-9-]+)', numero:", linha)
        if m:
            mod_atual, ordem = m.group(1), 0
            continue
        a = re.search(r"titulo: '((?:[^'\\]|\\.)*)'.*?youtube_id: '([^']+)'", linha)
        if a and mod_atual in MODULOS:
            aulas.append((mod_atual, ordem, a.group(1).replace("\\'", "'"), a.group(2)))
            ordem += 1
        elif re.search(r"\{ titulo: '", linha) and mod_atual in MODULOS:
            ordem += 1
    return aulas


def separar_prefixo(titulo, ordem):
    """'A6 — Social Selling' → (6, 'Social Selling'). Sem prefixo, usa a posição na lista."""
    m = re.match(r"^A(\d+)\s*—\s*(.+)$", titulo)
    if m:
        return int(m.group(1)), m.group(2)
    return ordem, titulo


def gerar_html(rotulo, nome_mod, num, titulo):
    label = rotulo if not nome_mod else f"{rotulo} &middot; {nome_mod}"
    tamanho = 72 if len(titulo) <= 32 else (60 if len(titulo) <= 48 else 52)
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{ width: 1280px; height: 720px; background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', Arial, sans-serif; overflow: hidden; position: relative; }}
    .side-bar {{ position: absolute; left: 0; top: 0; width: 6px; height: 100%; background: #f85627; }}
    .bottom-bar {{ position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: #f85627; }}
    .bg-number {{ position: absolute; right: -10px; bottom: -40px; font-size: 400px; font-weight: 900;
      color: #f85627; opacity: 0.05; line-height: 1; letter-spacing: -10px; }}
    .logo {{ position: absolute; top: 32px; right: 48px; width: 108px; opacity: 0.92; mix-blend-mode: screen; }}
    .content {{ position: absolute; left: 56px; bottom: 60px; right: 80px; }}
    .label {{ color: #f85627; font-size: 14px; font-weight: 700; letter-spacing: 6px;
      text-transform: uppercase; margin-bottom: 20px; opacity: 0.9; }}
    .lesson-title {{ color: #fcfcfc; font-size: {tamanho}px; font-weight: 900; text-transform: uppercase;
      line-height: 0.98; letter-spacing: -1px; max-width: 1000px; }}
  </style>
</head>
<body>
  <div class="side-bar"></div>
  <div class="bottom-bar"></div>
  <div class="bg-number">{num:02d}</div>
  <img class="logo" src="{LOGO_DATA_URL}" alt="Expert360">
  <div class="content">
    <div class="label">{label}</div>
    <div class="lesson-title">{titulo}</div>
  </div>
</body>
</html>"""


def main():
    aulas = ler_aulas()
    manifest = []
    print(f"\n=== Thumbnails YouTube — {len(aulas)} aulas publicadas ===\n")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for mod_id, ordem, titulo_site, yt in aulas:
            sigla, rotulo, nome_mod = MODULOS[mod_id]
            num, titulo = separar_prefixo(titulo_site, ordem)
            arquivo = f"{sigla}-{num:02d}-{yt}.png"
            saida = os.path.join(OUTPUT_DIR, arquivo)
            tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
            tmp.write(gerar_html(rotulo, nome_mod, num, titulo))
            tmp.close()
            page = browser.new_page(viewport={"width": 1280, "height": 720})
            page.goto(f"file:///{tmp.name.replace(os.sep, '/')}")
            page.wait_for_timeout(800)
            page.screenshot(path=saida, full_page=False)
            page.close()
            os.unlink(tmp.name)
            with Image.open(saida) as img:
                assert img.size == (1280, 720), img.size
            manifest.append({"arquivo": arquivo, "youtube_id": yt, "modulo": sigla, "titulo": titulo_site})
            print(f"  OK  {arquivo}  {titulo_site}")
        browser.close()
    with open(os.path.join(OUTPUT_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"\nGerados: {len(manifest)} → {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
