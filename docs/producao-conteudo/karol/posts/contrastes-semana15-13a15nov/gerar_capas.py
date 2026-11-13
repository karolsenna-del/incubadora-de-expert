#!/usr/bin/env python3
"""Capas locais: Python 3 + Pillow. Execute de qualquer pasta."""
from pathlib import Path
import json
from PIL import Image, ImageOps, ImageDraw, ImageFont
OUT = Path(__file__).resolve().parent
ROOT = next(p for p in OUT.parents if (p / 'business').is_dir())
PHOTO = 'business/campanhas/lp-diagnostico-expert/karol.jpg'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
ORANGE = '#FF6B1A'
SPECS = [
 ('sex-13-11', 'SEX 13/11 · 20H', 'QUEM ESPERA TER PÚBLICO', 'QUEM VENDE SEM AUDIÊNCIA', ['QUEM','ESPERA','TER PÚBLICO'], ['QUEM VENDE','SEM','AUDIÊNCIA']),
 ('sab-14-11', 'SÁB 14/11 · 20H', 'SERVIDOR QUE ESPERA', 'SERVIDOR QUE CONSTRÓI', ['SERVIDOR','QUE','ESPERA'], ['SERVIDOR','QUE','CONSTRÓI']),
 ('dom-15-11', 'DOM 15/11 · 20H', 'QUEM ACUMULA CONTEÚDO', 'QUEM COLOCA EM ORDEM PARA VENDER', ['QUEM','ACUMULA','CONTEÚDO'], ['QUEM','COLOCA','EM ORDEM','PARA VENDER']),
]
def font(n): return ImageFont.truetype(FONT,n)
def lines(draw, words, x, y, width, size, fill):
    f=font(size)
    while max(draw.textbbox((0,0),s,font=f)[2] for s in words)>width:
        size-=1; f=font(size)
    for s in words:
        box=draw.textbbox((0,0),s,font=f)
        assert x+box[2] <= 1036 and x >= 40
        draw.text((x,y-box[1]),s,font=f,fill=fill)
        y+=size*1.12
    return size
manifest=[]
for i,(slug,date,a,b,la,lb) in enumerate(SPECS):
    im=Image.new('RGB',(1080,1350),'#090909'); d=ImageDraw.Draw(im)
    source=ImageOps.exif_transpose(Image.open(ROOT/PHOTO)).convert('RGB')
    if i<2:
        # Full-height photographic column: 43.5% of the canvas, face unobscured.
        px=610 if i==0 else 0
        photo=ImageOps.fit(source,(470,1350),centering=(.43 if i==0 else .55,.45))
        im.paste(photo,(px,0)); tx=44 if i==0 else 514
        d=ImageDraw.Draw(im)
        d.text((tx,55),date,font=font(24),fill=ORANGE)
        lines(d,la,tx,175,522,85,'white')
        d.line((tx,622,tx+520,622),fill='#454545',width=2)
        d.text((tx+220,575),'X',font=font(96),fill=ORANGE)
        d.rectangle((tx-4,710,tx+526,1130),fill='white')
        lines(d,lb,tx+17,760,486,86,'#090909')
        lines(d,['KAROL SENNA ·','INCUBADORA DE EXPERT'],tx,1240,520,22,'white')
    else:
        # Wide close portrait, 44.4% of canvas; editorial blocks beneath.
        photo=source.crop((90,90,750,457)).resize((1080,600),Image.Resampling.LANCZOS)
        im.paste(photo,(0,0)); d=ImageDraw.Draw(im)
        d.rectangle((0,600,1080,652),fill=ORANGE)
        d.text((44,612),'AS 7 LISTAS DA SEMANA',font=font(25),fill='#090909')
        d.text((800,614),'DOM 15/11',font=font(22),fill='#090909')
        d.rectangle((554,652,1080,1255),fill='white')
        lines(d,la,44,770,460,86,'white')
        lines(d,lb,592,770,440,78,'#090909')
        d.rectangle((494,1000,588,1115),fill=ORANGE)
        d.text((508,1004),'X',font=font(93),fill='#090909')
        d.text((44,1293),'KAROL SENNA · INCUBADORA DE EXPERT',font=font(23),fill='white')
    path=OUT/f'capa-{slug}.png'; im.save(path)
    manifest.append({'arquivo':path.name,'headline':f'{a} X {b}','foto':PHOTO,'uso':date,'apoio':'AS 7 LISTAS DA SEMANA' if i==2 else '', 'dimensoes':[1080,1350], 'modo':im.mode})
preview=Image.new('RGB',(1080,450),'#090909')
for i,m in enumerate(manifest):
    with Image.open(OUT/m['arquivo']) as im: preview.paste(im.resize((360,450),Image.Resampling.LANCZOS),(360*i,0))
preview.save(OUT/'preview-contato.png')
(OUT/'manifesto.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for m in manifest:
    p=OUT/m['arquivo']
    with Image.open(p) as im:
        assert im.size==(1080,1350) and im.mode in ('RGB','RGBA') and p.stat().st_size>10000
print('OK: 3 capas RGB 1080x1350 + preview + manifesto')
