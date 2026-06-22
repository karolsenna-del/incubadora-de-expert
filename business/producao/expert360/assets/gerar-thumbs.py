"""
Course Publisher — Gerador de Thumbnails de Aulas
Expert360 | Incubadora de Expert
Dimensoes: 1280x720px (Hotmart Club)
"""

import os
import re
import base64
import tempfile
from playwright.sync_api import sync_playwright
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "thumbnails")
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "../../../campanhas/expert360-curso/branding/logo-preto.png")
)

with open(LOGO_PATH, "rb") as _f:
    LOGO_DATA_URL = "data:image/png;base64," + base64.b64encode(_f.read()).decode("utf-8")


def clean_title(slug):
    name = re.sub(r"^\d+[-_]", "", slug)
    name = name.replace("-", " ").replace("_", " ")
    return " ".join(w.capitalize() for w in name.split())


def lesson_number(slug):
    m = re.match(r"^(\d+)", slug)
    return m.group(1) if m else ""


MODULOS = [
    {
        "slug": "M0",
        "numero": "0",
        "nome": "Desbloqueio",
        "aulas": [
            "00-intro",
            "01-fracasso-como-prova",
            "02-historia-real",
            "03-ikigai",
            "04-encerramento",
        ],
    },
    {
        "slug": "M1",
        "numero": "1",
        "nome": "Persona e Promessa",
        "aulas": [
            "00-intro",
            "01-persona-compradora",
            "02-agente-persona",
            "03-promessa-transformadora",
            "04-agente-promessa",
            "05-posicionamento-no-mercado",
            "06-objecoes",
            "07-quem-voce-se-tornou",
        ],
    },
    {
        "slug": "M2",
        "numero": "2",
        "nome": "Metodo Autoral",
        "aulas": [
            "00-intro",
            "01-metodo-autoral",
            "02-inseguranca-inteligente",
            "03-mapeando-seu-processo",
            "04-as-3-jornadas",
            "05-agente-processo-autoral",
            "06-portfolio-estrategico",
            "07-agente-portfolio",
            "08-ecosistema-do-metodo",
            "09-quem-voce-se-tornou",
        ],
    },
    {
        "slug": "M3",
        "numero": "3",
        "nome": "Vendas Secretas",
        "aulas": [
            "00-intro",
            "01-vendas-secretas-conceito",
            "02-feito-e-melhor-que-perfeito",
            "03-oferta-de-lancamento",
            "04-agente-proposta-validada",
            "05-rastreador-de-leads",
            "06-social-selling",
            "07-lendo-seu-lead",
            "08-roteiro-de-abordagem",
            "09-roteiro-da-sessao",
            "10-pos-sessao",
            "11-escala-secreta",
            "12-quem-voce-se-tornou",
        ],
    },
    {
        "slug": "M4",
        "numero": "4",
        "nome": "Posicionamento de Autoridade",
        "aulas": [
            "00-intro",
            "01-autoridade-triplice",
            "02-agente-autoridade-triplice",
            "03-relatorio-autoridade",
            "04-montando-sua-vitrine",
            "05-linha-editorial",
            "06-roteiros-reels-carrosseis",
            "07-queimar-a-ponte",
            "08-escalando-posicionamento",
            "09-quem-voce-se-tornou",
        ],
    },
    {
        "slug": "MO",
        "numero": "",
        "nome": "Orientacoes",
        "aulas": [
            "00-intro",
        ],
    },
]


def gerar_html(modulo_slug, modulo_numero, modulo_nome, aula_slug):
    num = lesson_number(aula_slug)
    titulo = clean_title(aula_slug)
    label_modulo = f"MODULO {modulo_slug}" if modulo_slug != "MO" else "MODULO DE ORIENTACOES"

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');

    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      width: 1280px;
      height: 720px;
      background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }}

    /* Barra lateral esquerda */
    .side-bar {{
      position: absolute;
      left: 0;
      top: 0;
      width: 6px;
      height: 100%;
      background: #f85627;
    }}

    /* Barra inferior */
    .bottom-bar {{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #f85627;
    }}

    /* Numero da aula em fundo */
    .bg-number {{
      position: absolute;
      right: -10px;
      bottom: -40px;
      font-size: 400px;
      font-weight: 900;
      color: #f85627;
      opacity: 0.05;
      line-height: 1;
      user-select: none;
      letter-spacing: -10px;
    }}

    /* Logo */
    .logo {{
      position: absolute;
      top: 32px;
      right: 48px;
      width: 108px;
      opacity: 0.92;
      mix-blend-mode: screen;
    }}

    /* Conteudo principal */
    .content {{
      position: absolute;
      left: 56px;
      bottom: 60px;
      right: 80px;
    }}

    .label {{
      color: #f85627;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 6px;
      text-transform: uppercase;
      margin-bottom: 20px;
      opacity: 0.9;
    }}

    .lesson-title {{
      color: #fcfcfc;
      font-size: 72px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 0.93;
      letter-spacing: -1px;
    }}
  </style>
</head>
<body>
  <div class="side-bar"></div>
  <div class="bottom-bar"></div>
  <div class="bg-number">{num}</div>
  <img class="logo" src="{LOGO_DATA_URL}" alt="Expert360">
  <div class="content">
    <div class="label">{label_modulo} &middot; {modulo_nome.upper()}</div>
    <div class="lesson-title">{titulo}</div>
  </div>
</body>
</html>"""


def main():
    print("\n=== COURSE PUBLISHER - Gerando Thumbnails Expert360 ===\n")
    print(f"Output: {OUTPUT_DIR}\n")

    gerados = []
    erros = []
    total = sum(len(m["aulas"]) for m in MODULOS)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for modulo in MODULOS:
            slug = modulo["slug"]
            numero = modulo["numero"]
            nome = modulo["nome"]

            for aula in modulo["aulas"]:
                filename = f"{slug}-{aula}.png"
                output_path = os.path.join(OUTPUT_DIR, filename)
                titulo = clean_title(aula)
                print(f"  {slug} / {titulo[:40]}...", end=" ")

                try:
                    html = gerar_html(slug, numero, nome, aula)
                    tmp = tempfile.NamedTemporaryFile(
                        suffix=".html", delete=False, mode="w", encoding="utf-8"
                    )
                    tmp.write(html)
                    tmp.close()

                    page = browser.new_page()
                    page.set_viewport_size({"width": 1280, "height": 720})
                    page.goto(f"file:///{tmp.name.replace(os.sep, '/')}")
                    page.wait_for_timeout(1000)
                    page.screenshot(path=output_path, full_page=False)
                    page.close()
                    os.unlink(tmp.name)

                    img = Image.open(output_path)
                    size = img.size
                    img.close()
                    assert size == (1280, 720)

                    print(f"OK")
                    gerados.append(filename)

                except Exception as e:
                    print(f"ERRO: {e}")
                    erros.append((f"{slug}/{aula}", str(e)))

        browser.close()

    print(f"\n=== RELATORIO ===")
    print(f"Gerados: {len(gerados)}/{total}")
    if erros:
        print("Erros:")
        for ref, err in erros:
            print(f"  ERRO {ref}: {err}")
    print(f"\nLocal: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
