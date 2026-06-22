"""
Course Publisher — Gerador de Certificado
Expert360 | Incubadora de Expert
Dimensoes: 2480x3508px — A4 portrait (Hotmart Club)
"""

import os
import base64
import tempfile
from playwright.sync_api import sync_playwright
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "certificado")
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "../../../campanhas/expert360-curso/branding/logo-preto.png")
)

with open(LOGO_PATH, "rb") as _f:
    LOGO_DATA_URL = "data:image/png;base64," + base64.b64encode(_f.read()).decode("utf-8")


def html_certificado():
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&display=swap');
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      width: 2480px;
      height: 3508px;
      background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}

    /* Borda laranja superior */
    .top-bar {{
      width: 100%; height: 16px;
      background: #f85627;
      flex-shrink: 0;
    }}

    /* Borda laranja inferior */
    .bottom-bar {{
      position: absolute;
      bottom: 0; left: 0;
      width: 100%; height: 16px;
      background: #f85627;
    }}

    /* Bordas laterais */
    .left-bar {{
      position: absolute;
      left: 0; top: 0;
      width: 16px; height: 100%;
      background: #f85627;
    }}
    .right-bar {{
      position: absolute;
      right: 0; top: 0;
      width: 16px; height: 100%;
      background: #f85627;
    }}

    /* Frame interno decorativo */
    .inner-frame {{
      position: absolute;
      top: 60px; left: 60px;
      right: 60px; bottom: 60px;
      border: 2px solid rgba(248, 86, 39, 0.2);
    }}

    /* Cantos decorativos */
    .corner {{
      position: absolute;
      width: 80px; height: 80px;
      border-color: #f85627;
      border-style: solid;
      opacity: 0.6;
    }}
    .corner.tl {{ top: 100px; left: 100px; border-width: 3px 0 0 3px; }}
    .corner.tr {{ top: 100px; right: 100px; border-width: 3px 3px 0 0; }}
    .corner.bl {{ bottom: 100px; left: 100px; border-width: 0 0 3px 3px; }}
    .corner.br {{ bottom: 100px; right: 100px; border-width: 0 3px 3px 0; }}

    /* Decoracao de fundo */
    .bg-deco {{
      position: absolute;
      bottom: 200px;
      right: 50px;
      font-size: 1200px;
      font-weight: 900;
      color: #f85627;
      opacity: 0.03;
      line-height: 1;
      user-select: none;
      letter-spacing: -40px;
    }}

    /* Conteudo principal */
    .main {{
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 240px;
    }}

    .logo {{
      width: 420px;
      mix-blend-mode: screen;
      margin-bottom: 80px;
    }}

    .cert-label {{
      color: #f85627;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 14px;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 60px;
    }}

    .divider {{
      width: 240px;
      height: 3px;
      background: linear-gradient(to right, transparent, #f85627, transparent);
      margin-bottom: 140px;
    }}

    .intro-text {{
      color: #ddddde;
      font-size: 48px;
      font-weight: 300;
      font-style: italic;
      text-align: center;
      margin-bottom: 40px;
      opacity: 0.8;
    }}

    /* Area do nome do aluno — Hotmart preenche aqui */
    .name-area {{
      width: 100%;
      text-align: center;
      border-bottom: 3px solid rgba(248, 86, 39, 0.5);
      padding-bottom: 24px;
      margin-bottom: 60px;
    }}

    .name-placeholder {{
      color: #fcfcfc;
      font-size: 108px;
      font-weight: 900;
      letter-spacing: -2px;
      opacity: 0.12;
      text-transform: uppercase;
    }}

    .completion-text {{
      color: #ddddde;
      font-size: 48px;
      font-weight: 300;
      text-align: center;
      line-height: 1.6;
      margin-bottom: 80px;
      opacity: 0.85;
    }}

    .course-name {{
      color: #fcfcfc;
      font-size: 100px;
      font-weight: 900;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: -2px;
      line-height: 0.95;
      margin-bottom: 20px;
    }}

    .course-sub {{
      color: #f85627;
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 6px;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 160px;
      opacity: 0.85;
    }}

    /* Linha de assinatura */
    .signature-block {{
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 200px;
      margin-bottom: 40px;
    }}

    .sig-item {{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }}

    .sig-line {{
      width: 360px;
      height: 2px;
      background: rgba(221, 221, 222, 0.35);
    }}

    .sig-name {{
      color: #fcfcfc;
      font-size: 38px;
      font-weight: 700;
      text-align: center;
      letter-spacing: 1px;
    }}

    .sig-title {{
      color: #ddddde;
      font-size: 28px;
      font-weight: 300;
      text-align: center;
      opacity: 0.7;
    }}

    /* Rodape */
    .footer {{
      position: absolute;
      bottom: 80px;
      left: 0; right: 0;
      text-align: center;
      color: rgba(221, 221, 222, 0.3);
      font-size: 24px;
      letter-spacing: 4px;
      text-transform: uppercase;
    }}
  </style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="left-bar"></div>
  <div class="right-bar"></div>
  <div class="inner-frame"></div>
  <div class="corner tl"></div>
  <div class="corner tr"></div>
  <div class="corner bl"></div>
  <div class="corner br"></div>
  <div class="bg-deco">360</div>

  <div class="main">
    <img class="logo" src="{LOGO_DATA_URL}" alt="Expert360">

    <div class="cert-label">Certificado de Conclus&atilde;o</div>
    <div class="divider"></div>

    <div class="intro-text">Este certificado &eacute; conferido a</div>

    <div class="name-area">
      <div class="name-placeholder">Nome da Aluna</div>
    </div>

    <div class="completion-text">
      que concluiu com &ecirc;xito o programa
    </div>

    <div class="course-name">Expert360&deg;</div>
    <div class="course-sub">Incubadora de Expert</div>

    <div class="signature-block">
      <div class="sig-item">
        <div class="sig-line"></div>
        <div class="sig-name">Karol Senna</div>
        <div class="sig-title">Criadora &amp; Mentora</div>
      </div>
    </div>
  </div>

  <div class="footer">incubadoradeexpert.com.br &nbsp;&middot;&nbsp; expert360&deg;</div>
</body>
</html>"""


def main():
    print("\n=== COURSE PUBLISHER - Gerando Certificado Expert360 ===\n")
    output_path = os.path.join(OUTPUT_DIR, "certificado.png")
    print("  Gerando certificado.png (2480x3508)...", end=" ")

    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html_certificado())
    tmp.close()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 2480, "height": 3508})
        page.goto(f"file:///{tmp.name.replace(os.sep, '/')}")
        page.wait_for_timeout(1500)
        page.screenshot(path=output_path, full_page=False)
        browser.close()

    os.unlink(tmp.name)

    img = Image.open(output_path)
    size = img.size
    img.close()
    print(f"OK — {size[0]}x{size[1]}px")
    print(f"\nLocal: {output_path}")


if __name__ == "__main__":
    main()
