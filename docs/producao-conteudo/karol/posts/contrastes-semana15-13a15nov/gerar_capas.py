#!/usr/bin/env python3
"""Ilustrações editoriais autorais, locais e sem API. Python 3 + Pillow."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont
OUT = Path(__file__).resolve().parent
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
BLACK, WHITE, ORANGE = '#090909', '#FFFFFF', '#FF6B1A'
SPECS = [
 ('sex-13-11','SEX 13/11 · 20H',['QUEM ESPERA','TER PÚBLICO'],['QUEM VENDE','SEM AUDIÊNCIA'],'Auditório vazio versus conversa direta e acordo individual.'),
 ('sab-14-11','SÁB 14/11 · 20H',['SERVIDOR','QUE ESPERA'],['SERVIDOR','QUE CONSTRÓI'],'Relógio e espera institucional versus maquete de projeto próprio.'),
 ('dom-15-11','DOM 15/11 · 20H',['QUEM ACUMULA','CONTEÚDO'],['QUEM COLOCA','EM ORDEM','PARA VENDER'],'Pilhas de notas soltas versus sete etapas conectadas até a venda.'),
]
def font(n): return ImageFont.truetype(FONT,n)
def line(d,xy,fill,width=5): d.line(xy,fill=fill,width=width,joint='curve')
def poly(d,pts,fill,outline=None): d.polygon(pts,fill=fill); line(d,pts+[pts[0]],outline or fill,4)
def text(d,s,x,y,size,color):
    f=font(size); b=d.textbbox((0,0),s,font=f)
    assert x+b[0]>=40 and x+b[2]<=1040, (s,b)
    assert y+b[3]-b[1]<=1310
    d.text((x,y-b[1]),s,font=f,fill=color)
def sheet(d,x,y,w,h,fg,bg):
    d.rectangle((x,y,x+w,y+h),fill=bg,outline=fg,width=5)
    for k in range(3): line(d,[(x+18,y+24+k*21),(x+w-18,y+24+k*21)],fg,4)
def person(d,x,y,fg):
    d.ellipse((x-26,y-26,x+26,y+26),fill=fg)
    d.rounded_rectangle((x-43,y+38,x+43,y+150),radius=26,fill=fg)
def friday(d):
    # Empty theatre in perspective: curtain, stage, six rows of vacant seats.
    poly(d,[(48,540),(492,540),(492,690),(48,690)],WHITE)
    d.rectangle((76,557,464,646),fill=BLACK)
    for x in (65,450):
        for k in range(3): line(d,[(x+k*9,550),(x+k*9,641)],ORANGE,5)
    for row in range(5):
        y=725+row*89
        for col in range(4):
            x=64+col*111
            d.rounded_rectangle((x,y,x+77,y+49),radius=14,outline=WHITE,width=5)
            line(d,[(x-5,y+54),(x+83,y+54)],WHITE,6)
            line(d,[(x+5,y+54),(x+5,y+68)],WHITE,5)
            line(d,[(x+71,y+54),(x+71,y+68)],WHITE,5)
    # Two people, face to face, one table and one signed agreement.
    person(d,653,755,BLACK); person(d,948,755,BLACK)
    d.rounded_rectangle((594,551,813,659),radius=22,outline=BLACK,width=6)
    poly(d,[(637,659),(651,686),(673,659)],BLACK)
    d.rounded_rectangle((838,614,1009,701),radius=22,fill=ORANGE)
    poly(d,[(915,701),(934,722),(949,701)],ORANGE)
    line(d,[(620,590),(782,590)],BLACK,6); line(d,[(620,617),(746,617)],BLACK,6)
    line(d,[(870,657),(892,676),(972,635)],BLACK,8)
    poly(d,[(614,965),(960,965),(1006,1017),(576,1017)],BLACK)
    for x in (611,969): line(d,[(x,1017),(x,1170)],BLACK,10)
    poly(d,[(736,952),(844,952),(869,996),(752,996)],WHITE,BLACK)
    line(d,[(766,974),(791,983),(835,964)],ORANGE,5)
    line(d,[(682,839),(740,907),(794,931)],BLACK,17)
    line(d,[(919,839),(858,907),(808,931)],BLACK,17)
    d.ellipse((785,917,819,945),fill=ORANGE)
def saturday(d):
    # Waiting room beneath a large clock; daytime project model on the right.
    d.ellipse((126,542,414,830),outline=WHITE,width=9)
    for a,b in [((270,559),(270,582)),((270,791),(270,814)),((142,686),(165,686)),((375,686),(398,686))]: line(d,[a,b],WHITE,6)
    line(d,[(270,600),(270,686),(340,710)],ORANGE,12)
    for x in (67,225,383):
        d.rectangle((x,920,x+91,1004),outline=WHITE,width=6)
        line(d,[(x-5,1015),(x+98,1015)],WHITE,8)
        for leg in (x+9,x+81): line(d,[(leg,1015),(leg,1105)],WHITE,7)
    line(d,[(50,1166),(490,1166)],WHITE,5)
    # Architectural blueprint, solid foundations, rising beams, no exhausted worker.
    poly(d,[(588,1082),(866,1165),(1010,1052),(734,969)],BLACK)
    poly(d,[(588,1082),(588,1114),(866,1198),(866,1165)],ORANGE)
    poly(d,[(866,1165),(1010,1052),(1010,1085),(866,1198)],BLACK)
    for x,y in [(661,1028),(808,1073),(943,1000)]:
        poly(d,[(x,y),(x+28,y+8),(x+28,y-207),(x,y-215)],ORANGE)
    line(d,[(673,822),(821,868),(956,794)],BLACK,18)
    line(d,[(673,822),(807,745),(956,794)],BLACK,12)
    sheet(d,601,548,160,164,BLACK,WHITE)
    line(d,[(630,679),(630,636),(706,636),(706,679),(630,679)],ORANGE,5)
    d.arc((800,550,993,743),180,345,fill=BLACK,width=6)
    poly(d,[(989,638),(1006,676),(970,667)],ORANGE)
def sunday(d):
    # Overlapping physical sheets and loose notes, deliberately tangled.
    for x,y,w,h in [(64,558,180,235),(257,601,194,257),(102,786,205,245),(275,900,194,262),(53,1039,184,144)]:
        sheet(d,x,y,w,h,WHITE,BLACK)
    for pts in [[(57,901),(173,877),(343,785),(467,850)],[(89,1176),(355,1083),(196,726),(453,565)]]: line(d,pts,ORANGE,7)
    # Seven numbered sheets on a single legible route; final document = sale.
    route=[(646,577),(896,577),(896,751),(646,751),(646,925),(896,925),(896,1110)]
    line(d,[(x+51,y+48) for x,y in route],BLACK,7)
    for k,(x,y) in enumerate(route,1):
        d.rectangle((x,y,x+104,y+103),fill=WHITE,outline=BLACK,width=5)
        d.rectangle((x+11,y+12,x+43,y+45),fill=ORANGE)
        d.text((x+19,y+13),str(k),font=font(25),fill=BLACK)
        for dy in (63,80): line(d,[(x+14,y+dy),(x+86,y+dy)],BLACK,4)
    d.rectangle((577,1096,805,1200),fill=ORANGE)
    text(d,'VENDA',604,1129,37,BLACK)
    line(d,[(894,1160),(822,1160)],BLACK,6)
    poly(d,[(822,1160),(838,1148),(838,1172)],BLACK)

def main():
    manifest=[]
    for i,(slug,date,left,right,concept) in enumerate(SPECS):
        # Composição vetorial desenhada diretamente na resolução final.
        im=Image.new('RGB',(1080,1350),BLACK); d=ImageDraw.Draw(im)
        d.rectangle((540,0,1079,1349),fill=WHITE)
        text(d,date,48,51,26,ORANGE)
        if i==2: text(d,'AS 7 LISTAS DA SEMANA',580,54,26,BLACK)
        for x,words,color in [(48,left,WHITE),(580,right,BLACK)]:
            size=57
            while max(d.textbbox((0,0),s,font=font(size))[2] for s in words)>450: size-=1
            for j,s in enumerate(words): text(d,s,x,155+j*76,size,color)
        d.rectangle((491,390,589,494),fill=ORANGE)
        text(d,'X',509,401,85,BLACK)
        [friday,saturday,sunday][i](d)
        # Dedicated image area y=530..1220 = 51.1% of the total canvas.
        d.rectangle((0,1240,1079,1349),fill=BLACK)
        text(d,'KAROL SENNA · INCUBADORA DE EXPERT',180,1286,26,WHITE)
        path=OUT/f'capa-{slug}.png'; im.save(path)
        manifest.append(dict(arquivo=path.name,headline=' '.join(left)+' X '+' '.join(right),conceito=concept,apoio='AS 7 LISTAS DA SEMANA' if i==2 else '',uso=date,dimensoes=[1080,1350],modo=im.mode,area_visual_percentual=51.1,fonte_visual='Ilustração autoral desenhada no gerador; sem foto, rede ou API.'))
    preview=Image.new('RGB',(1080,450),BLACK)
    for i,m in enumerate(manifest):
        with Image.open(OUT/m['arquivo']) as im:
            assert im.size==(1080,1350) and im.mode in ('RGB','RGBA')
            im.load()
            preview.paste(im.resize((360,450),Image.Resampling.LANCZOS),(360*i,0))
    preview.save(OUT/'preview-contato.png')
    (OUT/'manifesto.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print('OK: 3 capas RGB 1080x1350; textos dentro das margens; preview 1080x450; manifesto.')
if __name__=='__main__': main()
