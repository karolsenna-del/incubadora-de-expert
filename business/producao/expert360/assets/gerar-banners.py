"""
Course Publisher — Gerador de Banners da Vitrine
Expert360 | Incubadora de Expert
Desktop: 1920x800px | Mobile: 720x960px (Hotmart Club)
"""

import os
import base64
import tempfile
from playwright.sync_api import sync_playwright
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "banners")
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "../../../campanhas/expert360-curso/branding/logo-preto.png")
)

with open(LOGO_PATH, "rb") as _f:
    LOGO_DATA_URL = "data:image/png;base64," + base64.b64encode(_f.read()).decode("utf-8")


def html_desktop():
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      width: 1920px;
      height: 800px;
      background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }}

    .side-bar {{
      position: absolute;
      left: 0; top: 0;
      width: 8px; height: 100%;
      background: #f85627;
    }}

    .bottom-bar {{
      position: absolute;
      bottom: 0; left: 0;
      width: 100%; height: 5px;
      background: #f85627;
    }}

    /* "360" fantasma no fundo */
    .bg-deco {{
      position: absolute;
      right: -40px;
      top: -60px;
      font-size: 700px;
      font-weight: 900;
      color: #f85627;
      opacity: 0.04;
      line-height: 1;
      user-select: none;
      letter-spacing: -30px;
    }}

    .logo {{
      position: absolute;
      top: 48px; right: 72px;
      width: 150px;
      opacity: 0.92;
      mix-blend-mode: screen;
    }}

    .content {{
      position: absolute;
      left: 96px;
      top: 50%;
      transform: translateY(-50%);
    }}

    .line1 {{
      color: #ddddde;
      font-size: 72px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.05;
      letter-spacing: -1px;
    }}

    .line2 {{
      color: #fcfcfc;
      font-size: 96px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 1.0;
      letter-spacing: -2px;
      margin-top: 8px;
    }}

    .line2 .highlight {{
      color: #f85627;
    }}

    .course-label {{
      margin-top: 40px;
      color: #f85627;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 8px;
      text-transform: uppercase;
      opacity: 0.9;
    }}
  </style>
</head>
<body>
  <div class="side-bar"></div>
  <div class="bottom-bar"></div>
  <div class="bg-deco">360</div>
  <img class="logo" src="{LOGO_DATA_URL}" alt="Expert360">
  <div class="content">
    <div class="line1">Diploma &eacute; o que voc&ecirc; estudou.</div>
    <div class="line2">M&eacute;todo &eacute; o que voc&ecirc; <span class="highlight">viveu.</span></div>
    <div class="course-label">Expert360&deg; &mdash; Incubadora de Expert</div>
  </div>
</body>
</html>"""


def html_mobile():
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      width: 720px;
      height: 960px;
      background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }}

    .top-bar {{
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 6px;
      background: #f85627;
    }}

    .bottom-bar {{
      position: absolute;
      bottom: 0; left: 0;
      width: 100%; height: 5px;
      background: #f85627;
    }}

    .side-bar {{
      position: absolute;
      left: 0; top: 0;
      width: 6px; height: 100%;
      background: #f85627;
    }}

    /* "360" fantasma no fundo */
    .bg-deco {{
      position: absolute;
      right: -20px;
      bottom: 80px;
      font-size: 480px;
      font-weight: 900;
      color: #f85627;
      opacity: 0.05;
      line-height: 1;
      user-select: none;
      letter-spacing: -20px;
    }}

    .logo {{
      position: absolute;
      top: 48px; right: 48px;
      width: 110px;
      opacity: 0.92;
      mix-blend-mode: screen;
    }}

    .content {{
      position: absolute;
      left: 56px;
      right: 48px;
      top: 50%;
      transform: translateY(-55%);
    }}

    .line1 {{
      color: #ddddde;
      font-size: 46px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.1;
      letter-spacing: -0.5px;
    }}

    .line2 {{
      color: #fcfcfc;
      font-size: 62px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 1.0;
      letter-spacing: -1px;
      margin-top: 12px;
    }}

    .line2 .highlight {{
      color: #f85627;
    }}

    .course-label {{
      margin-top: 36px;
      color: #f85627;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 6px;
      text-transform: uppercase;
      opacity: 0.9;
    }}
  </style>
</head>
<body>
  <div class="side-bar"></div>
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="bg-deco">360</div>
  <img class="logo" src="{LOGO_DATA_URL}" alt="Expert360">
  <div class="content">
    <div class="line1">Diploma &eacute; o que<br>voc&ecirc; estudou.</div>
    <div class="line2">M&eacute;todo &eacute; o que<br>voc&ecirc; <span class="highlight">viveu.</span></div>
    <div class="course-label">Expert360&deg; &mdash; Incubadora de Expert</div>
  </div>
</body>
</html>"""


def render(html_content, output_path, width, height):
    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html_content)
    tmp.close()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": width, "height": height})
        page.goto(f"file:///{tmp.name.replace(os.sep, '/')}")
        page.wait_for_timeout(1200)
        page.screenshot(path=output_path, full_page=False)
        browser.close()

    os.unlink(tmp.name)
    img = Image.open(output_path)
    assert img.size == (width, height), f"Dimensao errada: {img.size}"
    img.close()


def main():
    print("\n=== COURSE PUBLISHER - Gerando Banners Expert360 ===\n")

    banners = [
        {
            "nome": "banner-desktop.png",
            "width": 1920,
            "height": 800,
            "html_fn": html_desktop,
        },
        {
            "nome": "banner-mobile.png",
            "width": 720,
            "height": 960,
            "html_fn": html_mobile,
        },
    ]

    for b in banners:
        output_path = os.path.join(OUTPUT_DIR, b["nome"])
        print(f"  Gerando {b['nome']} ({b['width']}x{b['height']})...", end=" ")
        try:
            render(b["html_fn"](), output_path, b["width"], b["height"])
            print("OK")
        except Exception as e:
            print(f"ERRO: {e}")

    print(f"\nLocal: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
