"""
Course Publisher — Gerador de Avatar do Produto
Expert360 | Incubadora de Expert
Dimensoes: 600x600px (Hotmart Club)
"""

import os
import base64
import tempfile
from playwright.sync_api import sync_playwright
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "avatar")
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "../../../campanhas/expert360-curso/branding/logo-preto.png")
)

with open(LOGO_PATH, "rb") as _f:
    LOGO_DATA_URL = "data:image/png;base64," + base64.b64encode(_f.read()).decode("utf-8")


def html_avatar():
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      width: 600px;
      height: 600px;
      background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }}

    /* Borda laranja (frame) */
    .frame {{
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      border: 6px solid #f85627;
      box-sizing: border-box;
    }}

    /* "360" fantasma no fundo */
    .bg-deco {{
      position: absolute;
      right: -20px;
      bottom: -30px;
      font-size: 340px;
      font-weight: 900;
      color: #f85627;
      opacity: 0.06;
      line-height: 1;
      user-select: none;
      letter-spacing: -10px;
    }}

    /* Logo centralizada */
    .logo {{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -55%);
      width: 320px;
      mix-blend-mode: screen;
    }}

    /* Label abaixo da logo */
    .label {{
      position: absolute;
      bottom: 48px;
      left: 0; right: 0;
      text-align: center;
      color: #f85627;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 5px;
      text-transform: uppercase;
      opacity: 0.85;
    }}
  </style>
</head>
<body>
  <div class="frame"></div>
  <div class="bg-deco">360</div>
  <img class="logo" src="{LOGO_DATA_URL}" alt="Expert360">
  <div class="label">Incubadora de Expert</div>
</body>
</html>"""


def main():
    print("\n=== COURSE PUBLISHER - Gerando Avatar Expert360 ===\n")

    output_path = os.path.join(OUTPUT_DIR, "avatar-produto.png")
    print("  Gerando avatar-produto.png (600x600)...", end=" ")

    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html_avatar())
    tmp.close()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 600, "height": 600})
        page.goto(f"file:///{tmp.name.replace(os.sep, '/')}")
        page.wait_for_timeout(1200)
        page.screenshot(path=output_path, full_page=False)
        browser.close()

    os.unlink(tmp.name)

    img = Image.open(output_path)
    assert img.size == (600, 600)
    img.close()

    print("OK")
    print(f"\nLocal: {output_path}")


if __name__ == "__main__":
    main()
