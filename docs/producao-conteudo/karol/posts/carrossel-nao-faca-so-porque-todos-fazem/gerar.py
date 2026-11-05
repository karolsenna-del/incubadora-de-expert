#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import hashlib, json

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'output'; PREVIEW=ROOT/'preview'; ASSETS=ROOT/'assets'
OUT.mkdir(parents=True,exist_ok=True); PREVIEW.mkdir(parents=True,exist_ok=True)
W,H=1080,1350
WHITE='#FFFFFF'; BLACK='#0B0B0C'; ORANGE='#FF6B1A'; GREY='#666666'; LINE='#DEDEDE'
regular=ASSETS/'Sora-SemiBold.ttf'; heavy=ASSETS/'Sora-ExtraBold.ttf'
slides=[
 ('ANTES DE SEGUIR A TENDÊNCIA',['Não faça isso','só porque','todo mundo faz.'],[2]),
 ('O CORO',['“Todo mundo está','lançando.”'],[1]),
 ('POPULAR NÃO É PESSOAL',['“Isso não prova','que serve pra','você.”'],[2]),
 ('O CUSTO REAL',['“Lançamento pede','audiência, verba','e estômago pra','exposição.”'],[1,2]),
 ('EXISTE OUTRO COMEÇO',['“Se você ainda','não tem os três,','existe outro','começo.”'],[3]),
 ('A ORDEM',['“Primeiro uma conversa.','Depois uma venda.','Depois o resto.”'],[0,1]),
 ('PASSE ADIANTE',['“Manda pra quem','está prestes a','lançar sem estar','pronto.”'],[2,3]),
]
exact=[
 'Não faça isso só porque todo mundo faz.',
 '“Todo mundo está lançando.”',
 '“Isso não prova que serve pra você.”',
 '“Lançamento pede audiência, verba e estômago pra exposição.”',
 '“Se você ainda não tem os três, existe outro começo.”',
 '“Primeiro uma conversa. Depois uma venda. Depois o resto.”',
 '“Manda pra quem está prestes a lançar sem estar pronto.”',
]
manifest=json.loads((ROOT/'slides.json').read_text(encoding='utf-8'))
assert manifest['slides']==exact
for idx,(eye,lines,accent) in enumerate(slides,1):
 im=Image.new('RGB',(W,H),WHITE); d=ImageDraw.Draw(im)
 d.rectangle((0,0,18,H),fill=ORANGE)
 d.line((82,106,1004,106),fill=BLACK,width=2); d.rectangle((82,103,176,110),fill=ORANGE)
 f18=ImageFont.truetype(str(regular),18); f22=ImageFont.truetype(str(regular),22)
 d.text((82,55),'KAROL',font=f18,fill=BLACK); d.text((151,55),'SENNA',font=f18,fill=ORANGE)
 d.text((906,55),f'{idx:02d} / 07',font=f18,fill=GREY)
 d.text((82,250 if idx==1 else 325),eye,font=f22,fill=ORANGE)
 sizes=[94,92,78,68,70,67,66]; fs=ImageFont.truetype(str(heavy),sizes[idx-1])
 leading=int(sizes[idx-1]*1.22); total=len(lines)*leading-leading+sizes[idx-1]
 y=(690 if idx==1 else (H-total)//2)+(-20 if idx in (4,5,6,7) else 0)
 if idx==1:y=600
 if idx==7:
  d.rounded_rectangle((58,290,1022,1085),radius=20,outline=BLACK,width=3)
  d.rectangle((58,290,73,1085),fill=ORANGE)
  x=122
 else:x=82
 for j,line in enumerate(lines):
  d.text((x,y+j*leading),line,font=fs,fill=ORANGE if j in accent else BLACK)
 d.text((82,1274),'@karolsenna._',font=f18,fill=BLACK)
 d.text((970,1265),'●' if idx==7 else '→',font=ImageFont.truetype(str(heavy),28),fill=ORANGE)
 im.save(OUT/f'slide-{idx:02d}.png',optimize=True)
# folha de contato fora de output
thumbs=[]
for f in sorted(OUT.glob('slide-*.png')):
 with Image.open(f) as im: thumbs.append(ImageOps.fit(im,(324,405)))
sheet=Image.new('RGB',(1080,1395),'#111111')
for i,im in enumerate(thumbs):
 x=42+(i%3)*348; y=45+(i//3)*435; sheet.paste(im,(x,y))
sheet.save(PREVIEW/'contato.jpg',quality=92)
# validação
files=sorted(OUT.glob('slide-*.png')); assert len(files)==7
hashes=set()
for f in files:
 with Image.open(f) as im:
  assert im.size==(1080,1350); im.verify()
 hashes.add(hashlib.sha256(f.read_bytes()).hexdigest())
assert len(hashes)==7
print('OK: 7 slides únicos, íntegros, 1080x1350; preview gerado fora de output.')
