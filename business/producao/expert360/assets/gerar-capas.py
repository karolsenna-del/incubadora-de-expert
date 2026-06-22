"""
Course Publisher — Gerador de Capas de Modulo
Expert360º | Incubadora de Expert
Dimensoes: 1920x1080px (Hotmart Club)
"""

import os
import base64
import tempfile
from playwright.sync_api import sync_playwright
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "capas-modulos")
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "../../../campanhas/expert360-curso/branding/logo-preto.png"
    )
)

# Embebe a logo como data URL para evitar bloqueio de arquivo local no Chromium
with open(LOGO_PATH, "rb") as _f:
    LOGO_DATA_URL = "data:image/png;base64," + base64.b64encode(_f.read()).decode("utf-8")

MODULOS = [
    {
        "slug": "M0",
        "numero": "0",
        "nome": "Desbloqueio",
        "subtitulo": "Sua história é seu método",
        "arquivo": "M0-desbloqueio.png",
    },
    {
        "slug": "M1",
        "numero": "1",
        "nome": "Persona e<br>Promessa",
        "subtitulo": "Para de vender pra todo mundo",
        "arquivo": "M1-persona-promessa.png",
    },
    {
        "slug": "M2",
        "numero": "2",
        "nome": "Método<br>Autoral",
        "subtitulo": "Incopiável. Com nome próprio.",
        "arquivo": "M2-metodo-autoral.png",
    },
    {
        "slug": "M3",
        "numero": "3",
        "nome": "Vendas<br>Secretas",
        "subtitulo": "3 vendas reais antes de aparecer",
        "arquivo": "M3-vendas-secretas.png",
    },
    {
        "slug": "M4",
        "numero": "4",
        "nome": "Posicionamento<br>de Autoridade",
        "subtitulo": "Presença que vende sem precisar pedir",
        "arquivo": "M4-posicionamento-autoridade.png",
    },
    {
        "slug": "MO",
        "numero": "✦",
        "nome": "Módulo de<br>Orientações",
        "subtitulo": "Como aproveitar cada etapa do curso",
        "arquivo": "MO-orientacoes.png",
    },
]


def gerar_html(modulo, logo_data_url=LOGO_DATA_URL):
    numero = modulo["numero"]
    nome = modulo["nome"]
    subtitulo = modulo["subtitulo"]
    slug = modulo["slug"]
    logo_src = logo_data_url

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');

    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      width: 1920px;
      height: 1080px;
      background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }}

    /* Numero grande de fundo */
    .bg-number {{
      position: absolute;
      right: -20px;
      top: -60px;
      font-size: 600px;
      font-weight: 900;
      color: #f85627;
      opacity: 0.06;
      line-height: 1;
      user-select: none;
      letter-spacing: -20px;
    }}

    /* Linha vertical laranja lateral esquerda */
    .side-bar {{
      position: absolute;
      left: 0;
      top: 0;
      width: 8px;
      height: 100%;
      background: #f85627;
    }}

    /* Conteudo principal */
    .content {{
      position: absolute;
      left: 80px;
      bottom: 90px;
      right: 120px;
    }}

    .label {{
      color: #f85627;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 8px;
      text-transform: uppercase;
      margin-bottom: 28px;
      opacity: 0.9;
    }}

    .module-name {{
      color: #fcfcfc;
      font-size: 108px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 0.92;
      margin-bottom: 32px;
      letter-spacing: -2px;
    }}

    .subtitle {{
      color: #ddddde;
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 1px;
      opacity: 0.75;
    }}

    /* Barra laranja inferior */
    .bottom-bar {{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: #f85627;
    }}

    /* Logo no canto superior direito */
    .logo {{
      position: absolute;
      top: 48px;
      right: 72px;
      width: 160px;
      opacity: 0.92;
      mix-blend-mode: screen;
    }}
  </style>
</head>
<body>
  <div class="side-bar"></div>
  <div class="bg-number">{numero}</div>
  <img class="logo" src="{logo_src}" alt="Expert360">
  <div class="content">
    <div class="label">Módulo {slug if slug != "MO" else "de Orientações"}</div>
    <div class="module-name">{nome}</div>
    <div class="subtitle">{subtitulo}</div>
  </div>
  <div class="bottom-bar"></div>
</body>
</html>"""


def render_html_to_png(html_content, output_path, width=1920, height=1080):
    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html_content)
    tmp.close()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": width, "height": height})
        page.goto(f"file:///{tmp.name.replace(os.sep, '/')}")
        page.wait_for_timeout(1200)  # aguarda fonte web
        page.screenshot(path=output_path, full_page=False)
        browser.close()

    os.unlink(tmp.name)

    # Verificar dimensoes
    img = Image.open(output_path)
    assert img.size == (width, height), f"ERRO dimensao: {img.size} esperado {width}x{height}"
    img.close()
    return True


def main():
    print(f"\n=== COURSE PUBLISHER — Gerando Capas Expert360º ===\n")
    print(f"Output: {OUTPUT_DIR}\n")

    gerados = []
    erros = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for mod in MODULOS:
            output_path = os.path.join(OUTPUT_DIR, mod["arquivo"])
            print(f"Gerando {mod['slug']} — {mod['nome'].replace('<br>', ' ')}...", end=" ")

            try:
                html = gerar_html(mod)
                tmp = tempfile.NamedTemporaryFile(
                    suffix=".html", delete=False, mode="w", encoding="utf-8"
                )
                tmp.write(html)
                tmp.close()

                page = browser.new_page()
                page.set_viewport_size({"width": 1920, "height": 1080})
                page.goto(f"file:///{tmp.name.replace(os.sep, '/')}")
                page.wait_for_timeout(1200)
                page.screenshot(path=output_path, full_page=False)
                page.close()
                os.unlink(tmp.name)

                img = Image.open(output_path)
                size = img.size
                img.close()
                assert size == (1920, 1080)

                print(f"OK — {size[0]}x{size[1]}px")
                gerados.append(mod["arquivo"])

            except Exception as e:
                print(f"ERRO: {e}")
                erros.append((mod["slug"], str(e)))

        browser.close()

    print(f"\n=== RELATORIO ===")
    print(f"Gerados: {len(gerados)}/{len(MODULOS)}")
    for f in gerados:
        print(f"  ✓ {f}")
    if erros:
        print(f"Erros:")
        for slug, err in erros:
            print(f"  ✗ {slug}: {err}")
    print(f"\nLocal: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
