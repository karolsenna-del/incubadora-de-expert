#!/usr/bin/env python3
"""Biblioteca de trilhas por emoção: listar, ouvir uma amostra e pôr a escolhida no projeto.

A biblioteca é uma pasta com uma subpasta por emoção (a pasta é o catálogo). Fica FORA da skill e de qualquer
repositório (música de terceiro não vai para o Git nem para o pacote do aluno):
  TRILHAS_DIR, se existir; senão ~/Music/biblioteca-trilhas
Arquivo com `livre__` no começo do nome = liberado para anúncio pago; o resto é só para orgânico (ver
references/trilhas.md).

Duas listas prontas vêm com a skill (references/): `livres.json` (músicas liberadas, inclusive para anúncio, que
cada máquina baixa da fonte com `baixar`) e `virais.json` (músicas virais conhecidas, que não se baixa: a pessoa
põe pelo app do Instagram/TikTok na hora de postar).

Uso: python3 trilhas.py pastas                                   cria as pastas das emoções
     python3 trilhas.py baixar [emocao]                          baixa as liberadas da lista para a biblioteca
     python3 trilhas.py listar [emocao]                          lista numerada (o número vale no `usar`) + as virais
     python3 trilhas.py virais [emocao]                          só as virais (para pôr pelo app)
     python3 trilhas.py pagina [--copiar <pasta>] [--abrir]      página para ouvir tudo por emoção e marcar o que cortar
     python3 trilhas.py analisar                                 acha em que segundo cada música "fica boa" (parte forte)
     python3 trilhas.py marcar <numero> <segundo>                corrige à mão a parte forte de uma música
     python3 trilhas.py buscar "<termos em inglês>" [--emocao e] [--quantos 6] [--baixar]
                                                                 busca na internet (catálogo do Kevin MacLeod, uso livre com crédito)
     python3 trilhas.py balanco <trabalho> [--aplicar]           mede voz x trilha e acerta o volume no plano.json
     python3 trilhas.py favorita <numero|emocao/arquivo> [...]   marca as preferidas (★ na lista; o squad escolhe entre elas primeiro)
     python3 trilhas.py cortar <numero|emocao/arquivo> [...]     tira da biblioteca (vai para _cortadas/, não baixa de novo)
A música fica inteira na biblioteca; a parte forte é uma marca (marcas.json). No `usar`, sem pedir nada a música já
entra 2 s antes da parte forte; `--inicio 0` usa do começo; `--forte-em <t>` faz a parte forte cair no segundo <t>
do vídeo (a virada, o gancho).
     python3 trilhas.py amostra <emocao|todas> [--seg 10] [--abrir]   um mp3 com um trecho de cada, na ordem da lista
     python3 trilhas.py usar <trabalho> <numero|emocao/arquivo|caminho> [--inicio s]
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

REF = Path(__file__).resolve().parent.parent / "references"
BIB = Path(os.environ.get("TRILHAS_DIR") or (Path.home() / "Music/biblioteca-trilhas")).expanduser()
EXT = {".mp3", ".m4a", ".wav", ".aac", ".ogg", ".flac"}
EMOCOES = {
    "emocionante": "história pessoal, superação, família, virada de vida (piano, cordas que crescem)",
    "inspirador": "motivação, conquista, visão de futuro, 'você consegue' (épico, build-up)",
    "tensao": "polêmica, alerta, mistério, 'ninguém te conta', erro caro (pulso grave, suspense)",
    "energia": "lista rápida, hype, trend, antes e depois rápido (phonk, funk, eletrônico)",
    "confiante": "autoridade, resultado, dinheiro, bastidor de quem chegou lá (trap, hip-hop)",
    "leve": "tutorial, aula, conversa, rotina, bastidor tranquilo (lo-fi, acústico)",
    "divertido": "humor, ironia, meme, erro engraçado",
    "nostalgico": "lembrança, começo da jornada, antes de tudo",
    "fe": "devocional, gratidão, propósito (worship, piano suave)",
}


def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, **pf.UTF8)
    if r.returncode:
        sys.exit(r.stderr[-1200:])
    return r.stdout


def duracao(f):
    try:
        return float(sh([pf.FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]).strip())
    except ValueError:
        return 0.0


def catalogo(emocao=None):
    """[(numero, emocao, arquivo)] na ordem fixa das emoções; numeração global, igual em listar/amostra/usar."""
    itens, n = [], 0
    pastas = list(EMOCOES) + sorted(p.name for p in BIB.iterdir() if p.is_dir() and p.name not in EMOCOES
                                    and not p.name.startswith("_")) if BIB.is_dir() else []
    for e in pastas:
        for f in sorted((BIB / e).iterdir()) if (BIB / e).is_dir() else []:
            if f.suffix.lower() in EXT:
                n += 1
                if emocao in (None, "todas", e):
                    itens.append((n, e, f))
    return itens


def nome(f):
    import re
    return re.sub(r"-\d{5,}$", "", f.stem.replace("livre__", "")).replace("_", " ").replace("-", " ")


def livre(f):
    return f.name.startswith("livre__")


def lista_ref(nome, emocao=None):
    f = REF / nome
    itens = json.loads(f.read_text(encoding="utf-8")) if f.is_file() else []
    return [x for x in itens if emocao in (None, "todas", x.get("emocao"))]


def slug(t):
    import re
    import unicodedata
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:60]


def baixar(emocao=None):
    itens = lista_ref("livres.json", emocao)
    if not itens:
        sys.exit("lista de liberadas vazia (references/livres.json)")
    creditos = BIB / "fontes.json"
    reg = json.loads(creditos.read_text(encoding="utf-8")) if creditos.is_file() else {}
    novos = 0
    for x in itens:
        destino = BIB / x["emocao"] / f"livre__{slug(x['nome'] + '-' + x.get('autor', ''))}-{x['pagina'].rstrip('/').rsplit('-', 1)[-1]}.mp3"
        destino.parent.mkdir(parents=True, exist_ok=True)
        if marcas().get(str(destino.relative_to(BIB)), {}).get("cortada"):
            continue
        if not destino.is_file():
            req = urllib.request.Request(x["mp3"], headers={"User-Agent": "Mozilla/5.0"})
            try:
                with urllib.request.urlopen(req, timeout=120) as r, open(destino, "wb") as o:
                    shutil.copyfileobj(r, o)
                novos += 1
            except Exception as e:  # fonte fora do ar não derruba o resto
                print(f"falhou: {x['nome']} ({e})")
                continue
        if x.get("forte_em") is not None:
            mm = marcas()
            k = str(destino.relative_to(BIB))
            if not mm.get(k, {}).get("manual"):
                mm.setdefault(k, {}).update({"forte_em": x["forte_em"], **({"manual": True} if x.get("forte_manual") else {})})
            if x.get("top"):
                mm.setdefault(k, {})["top"] = True
            gravar_marcas(mm)
        reg[str(destino.relative_to(BIB))] = {k: x.get(k) for k in ("nome", "autor", "pagina", "licenca", "lembra", "credito") if x.get(k)}
    creditos.write_text(json.dumps(reg, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"ok: {novos} baixada(s), {len(itens)} na lista; biblioteca em {BIB}")


def virais(emocao=None):
    itens = lista_ref("virais.json", emocao)
    if not itens:
        return
    print("\nVIRAIS (não vão no arquivo: ponha pelo app do Instagram/TikTok na hora de postar)")
    atual = None
    for x in sorted(itens, key=lambda v: list(EMOCOES).index(v["emocao"]) if v.get("emocao") in EMOCOES else 99):
        if x.get("emocao") != atual:
            atual = x.get("emocao")
            print(f"  {atual}:")
        trecho = f" · {x['trecho']}" if x.get("trecho") else ""
        print(f"    - {x['musica']} — {x['artista']}{trecho}  ({x.get('por_que', '')})")


def marcas():
    f = BIB / "marcas.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.is_file() else {}


def gravar_marcas(m):
    (BIB / "marcas.json").write_text(json.dumps(m, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")


def parte_forte(f):
    """Segundo em que a música passa a ficar cheia: volume médio (janela de 8 s) a até 5 dB do patamar alto, por 10 s."""
    import math
    r = subprocess.run([pf.FFMPEG, "-v", "error", "-i", str(f), "-af",
                        "aresample=8000,asetnsamples=8000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
                        "-ac", "1", "-f", "null", "-"], capture_output=True, text=True, **pf.UTF8)
    v = [(-90.0 if "inf" in l else max(-90.0, float(l.split("=")[1]))) for l in r.stdout.splitlines() if "RMS_level" in l]
    if len(v) < 20:
        return 0
    pot = [10 ** (x / 10) for x in v]
    sv = []
    for i in range(len(pot)):
        j = pot[max(0, i - 4): i + 5]
        sv.append(10 * math.log10(sum(j) / len(j) + 1e-12))
    topo = sorted(sv)[int(len(sv) * 0.9)]
    for i in range(len(sv) - 10):
        if all(x >= topo - 5 for x in sv[i:i + 10]):
            return i if i >= 4 else 0
    return 0


def analisar(tudo=False):
    pf.exigir_ffmpeg()
    m, n = marcas(), 0
    for _, e, f in catalogo():
        k = str(f.relative_to(BIB))
        if k in m and not tudo:
            continue
        m.setdefault(k, {})["forte_em"] = parte_forte(f)
        n += 1
    gravar_marcas(m)
    print(f"ok: {n} música(s) analisada(s); marcas em {BIB / 'marcas.json'}")


def marcar(numero, segundo):
    f = next((x for n, e, x in catalogo() if n == int(numero)), None)
    if not f:
        sys.exit(f"não achei a trilha {numero}")
    m = marcas()
    m.setdefault(str(f.relative_to(BIB)), {}).update({"forte_em": float(segundo), "manual": True})
    gravar_marcas(m)
    print(f"ok: {nome(f)} fica boa em {float(segundo):.0f} s (marcado à mão)")


def achar(escolha):
    if escolha.isdigit():
        return next((x for n, e, x in catalogo() if n == int(escolha)), None)
    return BIB / escolha if (BIB / escolha).is_file() else None


def favorita(escolhas):
    m = marcas()
    for c in escolhas:
        f = achar(c)
        if not f:
            print(f"não achei: {c}")
            continue
        m.setdefault(str(f.relative_to(BIB)), {})["favorita"] = True
        print(f"★ {nome(f)}")
    gravar_marcas(m)


def cortar(escolhas):
    arqs = [(c, achar(c)) for c in escolhas]  # resolve tudo antes: tirar um arquivo muda a numeração
    m = marcas()
    for c, f in arqs:
        if not f:
            print(f"não achei: {c}")
            continue
        k = str(f.relative_to(BIB))
        (BIB / "_cortadas" / f.parent.name).mkdir(parents=True, exist_ok=True)
        shutil.move(str(f), str(BIB / "_cortadas" / k))
        m.setdefault(k, {})["cortada"] = True
        print(f"cortada: {nome(f)}")
    gravar_marcas(m)


def forte_de(f):
    k = str(f.relative_to(BIB)) if f.is_relative_to(BIB) else None
    m = marcas()
    if k and k in m:
        return float(m[k].get("forte_em", 0))
    return float(parte_forte(f))


def creditos():
    f = BIB / "fontes.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.is_file() else {}


ROTULOS = {"emocionante": "Emocionante", "inspirador": "Inspirador", "tensao": "Tensão", "energia": "Energia", "confiante": "Confiante",
           "leve": "Leve", "divertido": "Divertido", "nostalgico": "Nostálgico", "fe": "Fé"}


def pagina(copiar=None, abrir=False):
    """Página para ouvir tudo por emoção, com play em cada faixa e caixinha de cortar. Sem `--copiar`, fica na biblioteca."""
    import html
    import urllib.parse
    dest = Path(copiar).expanduser() if copiar else BIB
    dest.mkdir(parents=True, exist_ok=True)
    reg, cat, vir, sec, mar = creditos(), catalogo(), lista_ref("virais.json"), [], marcas()
    for e in list(EMOCOES) + sorted({x[1] for x in cat} - set(EMOCOES)):
        linhas = []
        for n, em, f in cat:
            if em != e:
                continue
            if copiar:
                (dest / e).mkdir(exist_ok=True)
                shutil.copy(f, dest / e / f.name)
            info = reg.get(str(f.relative_to(BIB)), {})
            tags = (f'<span class="lembra">lembra: {html.escape(info["lembra"])}</span>' if info.get("lembra") else "") + \
                   ('<span class="cred">pede crédito na legenda</span>' if info.get("credito") else "")
            fo = int(mar.get(str(f.relative_to(BIB)), {}).get("forte_em", 0))
            tags += f'<button class="boa" data-t="{fo}">▶ parte boa em {fo // 60}:{fo % 60:02d}</button>' if fo >= 5 else '<span class="boa0">boa desde o começo</span>'
            linhas.append(f'<div class="faixa{" tem-lembra" if info.get("lembra") else ""}"><div class="topo"><span class="num">{n}</span><div class="nome">{html.escape(info.get("nome") or nome(f))}'
                          f'<small>{html.escape(info.get("autor") or "")} · {duracao(f):.0f} s</small>{tags}</div>'
                          f'<button class="fav" data-n="{n}" data-f="{html.escape(e + "/" + f.name)}" data-ja="{1 if mar.get(str(f.relative_to(BIB)), {}).get("favorita") else 0}">☆ favorita</button>'
                          f'<label class="corta"><input type="checkbox" data-n="{n}" data-f="{html.escape(e + "/" + f.name)}"> cortar</label></div>'
                          f'<audio controls preload="none" src="{e}/{urllib.parse.quote(f.name)}"></audio></div>')
        vs = []
        for v in [x for x in vir if x.get("emocao") == e]:
            q = urllib.parse.quote(f'{v["musica"]} {v["artista"]}')
            vs.append(f'<li><a href="https://www.youtube.com/results?search_query={q}" target="_blank">{html.escape(v["musica"])}</a> — {html.escape(v["artista"])}'
                      f'{" <em>sem voz</em>" if v.get("instrumental") else ""}<small>{html.escape(v.get("por_que", ""))}'
                      f'{" · " + html.escape(v["trecho"]) if v.get("trecho") else ""}</small></li>')
        if not linhas and not vs:
            continue
        sec.append(f'<section id="{e}"><h2>{ROTULOS.get(e, e)} <small>{html.escape(EMOCOES.get(e, ""))}</small></h2>'
                   f'<h3>Liberadas (vão dentro do vídeo, inclusive anúncio)</h3>{"".join(linhas) or "<p>Nenhuma ainda.</p>"}'
                   + (f'<details class="vd"><summary>Ver as virais desta emoção ({len(vs)}): não vão no arquivo, só pelo app do Instagram</summary><ul class="virais">{"".join(vs)}</ul></details>' if vs else "")
                   + '</section>')
    nav = "".join(f'<a href="#{e}">{ROTULOS.get(e, e)}</a>' for e in EMOCOES)
    css = """body{margin:0;background:#0A0E1A;color:#F0F4F8;font:17px/1.5 -apple-system,Inter,sans-serif}
header{position:sticky;top:0;background:#0A0E1Aee;backdrop-filter:blur(8px);padding:14px 24px;border-bottom:1px solid #1E293B;z-index:5}
h1{margin:0 0 8px;font-size:22px}nav a{color:#94A3B8;margin-right:14px;text-decoration:none;font-size:15px}nav a:hover{color:#3B82F6}
main{max-width:860px;margin:0 auto;padding:10px 24px 140px}section{padding-top:70px;margin-top:-40px}
h2{font-size:28px;margin:30px 0 4px;color:#3B82F6}h2 small{display:block;font-size:15px;color:#94A3B8;font-weight:400}
h3{font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#94A3B8;margin:22px 0 10px}
.faixa{background:#0D1B2A;border:1px solid #1E293B;border-radius:14px;padding:12px 14px;margin-bottom:10px}.faixa.fora{opacity:.4;border-color:#EF4444}
.topo{display:flex;align-items:center;gap:12px;margin-bottom:8px}.num{font-weight:700;color:#06B6D4;min-width:30px;font-size:20px}
.nome{flex:1;font-weight:600}.nome small,.virais small{display:block;font-weight:400;color:#94A3B8;font-size:14px}
.lembra,.cred{display:inline-block;font-size:13px;font-weight:600;border-radius:8px;padding:2px 8px;margin:4px 6px 0 0}.lembra{background:#06B6D422;color:#06B6D4}.cred{background:#FFE50022;color:#FFE500}
.filtro{color:#06B6D4!important;font-weight:600}body.so-lembra .faixa:not(.tem-lembra),body.so-lembra .virais,body.so-lembra h3{display:none}
.vd summary{cursor:pointer;color:#94A3B8;font-size:14px;margin:18px 0 8px}body.so-lembra .vd{display:none}
.boa{background:#22C55E22;color:#22C55E;border:1px solid #22C55E55;font-size:13px;padding:2px 10px;border-radius:8px;margin-top:4px}.boa0{font-size:13px;color:#94A3B8;margin-top:4px;display:inline-block}
.fav{background:none;border:1px solid #FFE50066;color:#FFE500;font-size:14px;padding:4px 10px;white-space:nowrap}.fav.on{background:#FFE500;color:#0A0E1A}.faixa.favorita{border-color:#FFE500}
.corta{color:#EF4444;font-size:15px;cursor:pointer;white-space:nowrap}audio{width:100%;height:36px}
.virais{padding-left:20px}.virais li{margin-bottom:10px}.virais a{color:#F0F4F8;font-weight:600}em{color:#22C55E;font-style:normal;font-size:13px;margin-left:6px}
footer{position:fixed;bottom:0;left:0;right:0;background:#0D1B2A;border-top:1px solid #1E293B;padding:12px 24px;display:flex;gap:14px;align-items:center}
footer span{flex:1;font-size:15px}button{background:#3B82F6;color:#fff;border:0;border-radius:10px;padding:10px 18px;font-size:16px;font-weight:600;cursor:pointer}"""
    js = """const cx=[...document.querySelectorAll('input[type=checkbox]')],salvo=JSON.parse(localStorage.getItem('cortes-arquivo')||'[]');
const fv=[...document.querySelectorAll('.fav')],fsalvo=JSON.parse(localStorage.getItem('favoritas-arquivo')||'null');
fv.forEach(b=>{if(fsalvo?fsalvo.includes(b.dataset.f):b.dataset.ja==='1')b.classList.add('on');});
const atual=()=>cx.filter(c=>c.checked),favs=()=>fv.filter(b=>b.classList.contains('on'));
const pinta=()=>{cx.forEach(c=>c.closest('.faixa').classList.toggle('fora',c.checked));fv.forEach(b=>{const on=b.classList.contains('on');b.textContent=on?'★ favorita':'☆ favorita';b.closest('.faixa').classList.toggle('favorita',on);});const a=atual(),f=favs();localStorage.setItem('cortes-arquivo',JSON.stringify(a.map(c=>c.dataset.f)));localStorage.setItem('favoritas-arquivo',JSON.stringify(f.map(b=>b.dataset.f)));document.getElementById('resumo').textContent=(f.length?'Favoritas: '+f.map(b=>b.dataset.n).join(', '):'Nenhuma favorita.')+'  ·  '+(a.length?'Cortar: '+a.map(c=>c.dataset.n).join(', '):'Nenhuma cortada.');};
cx.forEach(c=>{c.checked=salvo.includes(c.dataset.f);c.onchange=pinta;});fv.forEach(b=>b.onclick=()=>{b.classList.toggle('on');pinta();});pinta();
document.getElementById('copiar').onclick=()=>{const a=atual();const f=favs();navigator.clipboard.writeText('Favoritas:\\n'+(f.map(b=>b.dataset.f).join('\\n')||'(nenhuma)')+'\\n\\nCortar:\\n'+(a.map(c=>c.dataset.f).join('\\n')||'(nenhuma)'));document.getElementById('copiar').textContent='Copiado';};
document.getElementById('filtro').onclick=(e)=>{e.preventDefault();const on=document.body.classList.toggle('so-lembra');e.target.textContent=on?'Ver todas':'Ver só as que lembram virais';};
document.querySelectorAll('.boa').forEach(b=>b.onclick=()=>{const a=b.closest('.faixa').querySelector('audio');const ir=()=>{a.currentTime=Math.max(0,+b.dataset.t-2);a.play();};a.readyState>0?ir():(a.addEventListener('loadedmetadata',ir,{once:true}),a.load());});
document.addEventListener('play',e=>{document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause();});},true);"""
    pg = (f'<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Trilhas</title><style>{css}</style>'
          f'<header><h1>Trilhas por emoção</h1><nav>{nav}<a href="#" id="filtro" class="filtro">Ver só as que lembram virais</a></nav></header><main><p>Dê play, marque <b style="color:#FFE500">favorita</b> nas que você mais gosta e <b style="color:#EF4444">cortar</b> nas que não servem. '
          f'No fim, clique em “Copiar favoritas e cortes” e cole na conversa.</p>{"".join(sec)}</main>'
          f'<footer><span id="resumo">Nenhuma cortada.</span><button id="copiar">Copiar favoritas e cortes</button></footer><script>{js}</script></html>')
    saida = dest / "ouvir.html"
    saida.write_text(pg, encoding="utf-8")
    print(f"página: {saida} ({len(cat)} faixas, {len(vir)} virais)")
    if abrir:
        subprocess.run([sys.executable, str(Path(__file__).parent / "plataforma.py"), "abrir", str(saida)])


def pastas():
    for e in EMOCOES:
        (BIB / e).mkdir(parents=True, exist_ok=True)
    print(f"biblioteca: {BIB}")
    for e, d in EMOCOES.items():
        print(f"  {e}/  {d}")


def listar(emocao=None):
    itens = catalogo(emocao)
    if not itens:
        print(f"nada em {BIB}{'/' + emocao if emocao and emocao != 'todas' else ''} (biblioteca vazia nessa emoção;"
              " `trilhas.py baixar` traz as liberadas da lista)")
        virais(emocao)
        return
    atual = None
    for n, e, f in itens:
        if e != atual:
            atual = e
            print(f"\n{e.upper()} — {EMOCOES.get(e, '')}")
        info = creditos().get(str(f.relative_to(BIB)), {})
        extra = (f"; lembra: {info['lembra']}" if info.get("lembra") else "") + ("; pede crédito na legenda" if info.get("credito") else "")
        mk = marcas().get(str(f.relative_to(BIB)), {})
        estrela = "★ " if mk.get("favorita") else ("☆ top da casa · " if mk.get("top") else "")
        print(f"  {n:>3}. {estrela}{info.get('nome') or nome(f)}  ({duracao(f):.0f} s{', liberada para anúncio' if livre(f) else ''}{extra})")
    virais(emocao)


def amostra(emocao, seg=10.0, abrir=False):
    itens = catalogo(emocao)
    if not itens:
        sys.exit(f"nada para ouvir em {emocao} (biblioteca vazia nessa emoção)")
    pf.exigir_ffmpeg()
    saida = BIB / "_amostras" / f"{emocao}.mp3"
    saida.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        partes, t, mapa = [], 0.0, []
        for i, (n, e, f) in enumerate(itens):
            d = duracao(f)
            ini = max(0.0, min(d * 0.35, d - seg))  # ~35% da música costuma cair no refrão/drop
            p = Path(tmp) / f"{i:03d}.wav"
            sh([pf.FFMPEG, "-v", "error", "-y", "-ss", f"{ini:.2f}", "-t", f"{seg}", "-i", str(f), "-af",
                f"afade=t=in:d=0.4,afade=t=out:st={seg - 0.8}:d=0.8,aresample=44100", "-ac", "2", str(p)])
            partes.append(p)
            mapa.append(f"  {int(t // 60)}:{int(t % 60):02d}  {n}. {nome(f)} ({e})")
            t += seg + 0.6
        silencio = Path(tmp) / "pausa.wav"
        sh([pf.FFMPEG, "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", "0.6", str(silencio)])
        lista = Path(tmp) / "lista.txt"
        lista.write_text("".join(f"file '{p.as_posix()}'\nfile '{silencio.as_posix()}'\n" for p in partes), encoding="utf-8")
        sh([pf.FFMPEG, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lista), "-c:a", "libmp3lame",
            "-q:a", "3", str(saida)])
    print(f"amostra: {saida}\n" + "\n".join(mapa))
    if abrir:
        subprocess.run([sys.executable, str(Path(__file__).parent / "plataforma.py"), "abrir", str(saida)])


def usar(trab, escolha, inicio=None, forte_no_video=None):
    trab = Path(trab)
    f = None
    if escolha.isdigit():
        f = next((x for n, e, x in catalogo() if n == int(escolha)), None)
    elif (BIB / escolha).is_file():
        f = BIB / escolha
    elif Path(escolha).expanduser().is_file():
        f = Path(escolha).expanduser()
    if not f:
        sys.exit(f"não achei a trilha '{escolha}' (veja: trilhas.py listar)")
    pf.exigir_ffmpeg()
    destino = trab / "app/public/media/trilha.mp3"
    destino.parent.mkdir(parents=True, exist_ok=True)
    forte, atraso = forte_de(f), 0.0
    if inicio is None:
        # sem pedido: entra 2 s antes da parte forte; com --forte-em, a parte forte cai naquele segundo do vídeo
        alvo = 2.0 if forte_no_video is None else forte_no_video
        inicio, atraso = max(0.0, forte - alvo), max(0.0, alvo - forte) if forte_no_video is not None and forte > 0 else 0.0
        # parte forte pedida bem depois da que a música tem: atrasar deixava o vídeo sem trilha por todo esse tempo
        # (anúncio de 19/10 ficou 72 s sem música). Começa do início e avisa; para levar a virada mais longe, --inicio.
        if atraso > 2.0:
            print(f"aviso: a parte forte está em {forte:.0f} s da música; para cair em {alvo:.0f} s do vídeo a trilha ficaria muda por "
                  f"{atraso:.0f} s. Começando do início (a parte forte cai em {forte:.0f} s); escolha outro trecho com --inicio")
            inicio, atraso = 0.0, 0.0
    # aformat: sem ele o libmp3lame recusa alguns MP3 cortados com -ss ("inadequate AVFrame plane padding")
    # loudnorm: toda trilha sai no mesmo volume de referência (-16 LUFS), senão uma música vem 15 dB mais alta que outra
    filtro = "aresample=44100,aformat=sample_fmts=s16p:channel_layouts=stereo,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100,afade=t=in:d=0.5" + (f",adelay={int(atraso * 1000)}:all=1" if atraso > 0 else "")
    sh([pf.FFMPEG, "-v", "error", "-y", "-ss", f"{inicio}", "-i", str(f), "-af", filtro, "-vn",
        "-c:a", "libmp3lame", "-q:a", "2", str(destino)])
    emocao = f.parent.name if f.parent.parent == BIB else "fora da biblioteca"
    info = {"trilha": nome(f), "arquivo": str(f), "emocao": emocao, "inicio_s": inicio, "parte_forte_na_musica_s": forte,
            "parte_forte_no_video_s": round(forte - inicio + atraso, 1), "liberada_anuncio": livre(f)}
    (trab / "trilha.json").write_text(json.dumps(info, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"ok: {nome(f)} ({emocao}) em {destino}, começando em {inicio:.1f} s da música; a parte forte cai em {forte - inicio + atraso:.1f} s do vídeo"
          + ("" if livre(f) else "\naviso: não liberada para anúncio pago; vale para orgânico (ver references/trilhas.md)"))
    cred = creditos().get(str(f.relative_to(BIB)) if f.is_relative_to(BIB) else "", {}).get("credito")
    if cred:
        print(f"crédito para a legenda: {cred}")
    if (trab / "app/public/media/voz.wav").is_file():
        balanco(trab, aplicar=True)


def lufs(f):
    r = subprocess.run([pf.FFMPEG, "-v", "info", "-nostats", "-i", str(f), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True, **pf.UTF8)
    import re
    v = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(v[-1]) if v else None


# quantos dB a trilha fica abaixo da voz (fala) e nas cenas cheias, por pirotecnia
FOLGA = {1: (24, 14), 2: (21, 12), 3: (18, 10)}


def balanco(trab, aplicar=False):
    """Mede o volume da voz e da trilha e calcula o volume da trilha no plano para ela ficar X dB abaixo da fala."""
    trab = Path(trab)
    voz, tri, plano = trab / "app/public/media/voz.wav", trab / "app/public/media/trilha.mp3", trab / "app/src/plano.json"
    if not (voz.is_file() and tri.is_file()):
        print("balanço: falta voz.wav ou trilha.mp3 no projeto")
        return
    lv, lt = lufs(voz), lufs(tri)
    if lv is None or lt is None:
        print("balanço: não consegui medir o volume")
        return
    pl = json.loads(plano.read_text(encoding="utf-8")) if plano.is_file() else {}
    fala, cheia = FOLGA.get(int(pl.get("pirotecnia", 2) or 2), FOLGA[2])
    vol = round(min(0.6, 10 ** ((lv - fala - lt) / 20)), 3)
    vol_cheia = round(min(0.9, 10 ** ((lv - cheia - lt) / 20)), 3)
    print(f"balanço: voz {lv:.1f} LUFS, trilha {lt:.1f} LUFS → volume {vol} sob a fala ({fala} dB abaixo) e {vol_cheia} nas cenas cheias")
    if aplicar and plano.is_file():
        t = pl.get("trilha") or {}
        t.update({"src": t.get("src", "media/trilha.mp3"), "volume": vol, "volume_cheia": vol_cheia})
        pl["trilha"] = t
        plano.write_text(json.dumps(pl, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"balanço: gravado em {plano}")


KM = "https://incompetech.com/music/royalty-free/"


def buscar(termos, emocao=None, quantos=6, baixar_=False):
    """Busca no catálogo do Kevin MacLeod (1.400+ músicas, Creative Commons BY: uso livre, até em anúncio, com crédito)."""
    cache = BIB / "_cache" / "incompetech.json"
    cache.parent.mkdir(parents=True, exist_ok=True)
    if not cache.is_file():
        req = urllib.request.Request(KM + "pieces.json", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            cache.write_bytes(r.read())
    pecas = json.loads(cache.read_text(encoding="utf-8"))
    ts = [t.lower() for t in termos.split() if len(t) > 2]

    def nota(x):
        campos = {"title": 3, "feel": 3, "genre": 2, "instruments": 2, "description": 1}
        return sum(p for c, p in campos.items() for t in ts if t in str(x.get(c) or "").lower())

    def seg(x):
        try:
            h, m, s_ = (str(x.get("length") or "0:0:0").split(":") + ["0", "0"])[:3]
            return int(h) * 3600 + int(m) * 60 + int(s_)
        except ValueError:
            return 0
    achadas = sorted([x for x in pecas if nota(x) and seg(x) >= 45], key=lambda x: -nota(x))[:quantos]
    if not achadas:
        print(f"nada para '{termos}' no catálogo; tente outras palavras (em inglês) ou gere uma sob medida")
        return
    destino_dir = BIB / (emocao or "internet")
    reg = creditos()
    for x in achadas:
        linha = f"- {x['title']} ({x.get('length')}) · clima: {x.get('feel')} · instrumentos: {x.get('instruments')}"
        if baixar_:
            destino_dir.mkdir(parents=True, exist_ok=True)
            arq = destino_dir / f"livre__{slug(x['title'])}-kevin-macleod.mp3"
            if not arq.is_file():
                req = urllib.request.Request(KM + "mp3-royaltyfree/" + urllib.request.quote(x["filename"]), headers={"User-Agent": "Mozilla/5.0"})
                try:
                    with urllib.request.urlopen(req, timeout=120) as r, open(arq, "wb") as o:
                        shutil.copyfileobj(r, o)
                except Exception as e:
                    print(f"{linha}\n  falhou o download ({e})")
                    continue
            reg[str(arq.relative_to(BIB))] = {"nome": x["title"], "autor": "Kevin MacLeod", "pagina": "https://incompetech.com",
                                              "licenca": "Creative Commons BY 4.0 (uso livre, inclusive comercial, com crédito)",
                                              "credito": f'"{x["title"]}" Kevin MacLeod (incompetech.com), licença Creative Commons Atribuição 4.0'}
            linha += f"\n  baixada: {arq.relative_to(BIB)}"
        print(linha)
    if baixar_:
        (BIB / "fontes.json").write_text(json.dumps(reg, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    opc = lambda k, pad: float(a[a.index(k) + 1]) if k in a else pad  # noqa: E731
    if a[0] == "pastas":
        pastas()
    elif a[0] == "baixar":
        baixar(a[1] if len(a) > 1 else None)
    elif a[0] == "pagina":
        pagina(a[a.index("--copiar") + 1] if "--copiar" in a else None, "--abrir" in a)
    elif a[0] == "virais":
        virais(a[1] if len(a) > 1 else None)
    elif a[0] == "listar":
        listar(a[1] if len(a) > 1 else None)
    elif a[0] == "amostra" and len(a) > 1:
        amostra(a[1], opc("--seg", 10.0), "--abrir" in a)
    elif a[0] == "usar" and len(a) > 2:
        usar(a[1], a[2], opc("--inicio", None), opc("--forte-em", None))
    elif a[0] == "buscar" and len(a) > 1:
        buscar(a[1], a[a.index("--emocao") + 1] if "--emocao" in a else None, int(opc("--quantos", 6)), "--baixar" in a)
    elif a[0] == "balanco" and len(a) > 1:
        balanco(a[1], "--aplicar" in a)
    elif a[0] == "analisar":
        analisar("--tudo" in a)
    elif a[0] == "favorita" and len(a) > 1:
        favorita(a[1:])
    elif a[0] == "cortar" and len(a) > 1:
        cortar(a[1:])
    elif a[0] == "marcar" and len(a) > 2:
        marcar(a[1], a[2])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
