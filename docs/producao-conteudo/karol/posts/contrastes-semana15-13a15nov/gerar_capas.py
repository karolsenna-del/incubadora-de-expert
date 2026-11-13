#!/usr/bin/env python3
"""Capas fotográficas editoriais. Pillow, assets locais; sem rede ou API."""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter, ImageEnhance

OUT = Path(__file__).resolve().parent
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
BLACK, WHITE, ORANGE = '#090909', '#FFFFFF', '#FF6B1A'
# A composição usa dois quadros fotográficos, sem texto dentro das fotos.
# Corte quadrado dos horizontais: mantém ambos os interlocutores no acordo.
PHOTO_TOP, PHOTO_BOTTOM = 470, 1240
SPECS = [
    ('sex-13-11', 'SEX 13/11 · 20H',
     ['QUEM ESPERA', 'TER PÚBLICO'], ['QUEM VENDE', 'SEM AUDIÊNCIA'],
     ['01-espera-publico.jpg', '02-venda-direta.jpg']),
    ('sab-14-11', 'SÁB 14/11 · 20H',
     ['SERVIDOR', 'QUE ESPERA'], ['SERVIDOR', 'QUE CONSTRÓI'],
     ['03-espera-rotina.jpg', '04-construcao-propria.jpg']),
    ('dom-15-11', 'DOM 15/11 · 20H',
     ['QUEM ACUMULA', 'CONTEÚDO'], ['QUEM COLOCA', 'EM ORDEM', 'PARA VENDER'],
     ['05-conteudo-caotico.jpg', '06-organizacao-venda.jpg']),
]


def font(size):
    return ImageFont.truetype(FONT, size)


def text(draw, value, x, y, size, color, right=1032):
    """Coordenadas pelo topo visível e limites de segurança verificáveis."""
    f = font(size)
    b = draw.textbbox((0, 0), value, font=f)
    box = (x, y, x + b[2] - b[0], y + b[3] - b[1])
    assert 40 <= box[0] and box[2] <= right, (value, box)
    assert 40 <= box[1] and box[3] <= 1310, (value, box)
    draw.text((x - b[0], y - b[1]), value, font=f, fill=color)
    return box


def photo_panel(path):
    """Recorte editorial quadrado em paisagens, sobre contexto fotográfico suave.

    A extensão desfocada usa a própria foto, sem inventar pessoas. Retratos
    preservam a postura completa; o título fica fora da área fotográfica.
    """
    with Image.open(path) as source:
        source = ImageOps.exif_transpose(source).convert('RGB')
        if source.width > source.height:
            square = ImageOps.fit(source, (540, 540), centering=(0.5, 0.5))
            panel = ImageOps.fit(source, (540, 770)).filter(ImageFilter.GaussianBlur(32))
            panel = ImageEnhance.Brightness(panel).enhance(0.42)
            panel.paste(square, (0, 115))
        else:
            panel = ImageOps.fit(source, (540, 770), centering=(0.5, 0.65))
        return panel


def main():
    sources = json.loads((OUT / 'assets-fotos' / 'creditos.json').read_text())
    manifest, hashes = [], set()
    for i, (slug, date, left, right, filenames) in enumerate(SPECS):
        im = Image.new('RGB', (1080, 1350), BLACK)
        d = ImageDraw.Draw(im)
        d.rectangle((540, 0, 1079, PHOTO_TOP - 1), fill=WHITE)
        text(d, date, 48, 48, 25, ORANGE)
        if i == 2:
            text(d, 'AS 7 LISTAS DA SEMANA', 578, 50, 27, BLACK)
        boxes = []
        for x, words, color, limit in [(48, left, WHITE, 498), (578, right, BLACK, 1032)]:
            size = 62
            while max(d.textlength(s, font=font(size)) for s in words) > limit - x:
                size -= 1
            for j, word in enumerate(words):
                boxes.append(text(d, word, x, 162 + j * 73, size, color, limit))
        for side, filename in enumerate(filenames):
            path = OUT / 'assets-fotos' / filename
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            assert digest not in hashes, 'Foto repetida'
            hashes.add(digest)
            im.paste(photo_panel(path), (side * 540, PHOTO_TOP))
        # O pivô termina antes das fotos; nenhum texto cruza olhos/boca.
        d = ImageDraw.Draw(im)
        d.rectangle((537, PHOTO_TOP, 542, PHOTO_BOTTOM - 1), fill=ORANGE)
        d.rectangle((492, 363, 588, 459), fill=BLACK, outline=ORANGE, width=3)
        text(d, 'X', 511, 376, 70, ORANGE)
        d.rectangle((0, PHOTO_BOTTOM, 1079, 1349), fill=BLACK)
        text(d, 'KAROL SENNA · INCUBADORA DE EXPERT', 203, 1287, 25, WHITE)
        assert all(b[3] < 350 for b in boxes)
        file = f'capa-{slug}.png'
        im.save(OUT / file)
        photos = []
        for side, name in zip(['esquerda', 'direita'], filenames):
            record = dict(sources[name], arquivo=f'assets-fotos/{name}', lado=side)
            record['sha256'] = hashlib.sha256((OUT / record['arquivo']).read_bytes()).hexdigest()
            photos.append(record)
        manifest.append(dict(
            arquivo=file, headline=' '.join(left) + ' X ' + ' '.join(right),
            apoio='AS 7 LISTAS DA SEMANA' if i == 2 else '', uso=date,
            dimensoes=[1080, 1350], modo='RGB',
            area_paineis_fotograficos_percentual=round(100 * (PHOTO_BOTTOM - PHOTO_TOP) / 1350, 2),
            tratamento='Fotos locais, sem distorção; retratos com corte mínimo; paisagens em quadrado com fundo da mesma foto desfocado e escurecido. Texto separado das fotos.',
            fotos=photos, caixas_headline=boxes,
        ))
    assert len(hashes) == 6
    preview = Image.new('RGB', (1080, 450), BLACK)
    for i, item in enumerate(manifest):
        with Image.open(OUT / item['arquivo']) as im:
            im.load()
            assert im.size == (1080, 1350) and im.mode in ('RGB', 'RGBA')
            preview.paste(im.resize((360, 450), Image.Resampling.LANCZOS), (360 * i, 0))
    preview.save(OUT / 'preview-contato.png')
    (OUT / 'manifesto.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print('OK: 3 capas RGB 1080x1350; 6 fotos distintas; margens e títulos validados; preview 1080x450.')


if __name__ == '__main__':
    main()
