#!/usr/bin/env python3
"""Conferência — o olho do editor, em duas horas diferentes.

  python3 conferir.py quadros <trabalho> [--escala 0.35]
      Antes do render: tira um quadro no meio de cada cena e em cada momento-chave usado no plano e monta
      <trabalho>/qa/folha_NN.jpg (com o tempo escrito em cada quadro). Abra as folhas e olhe de verdade.

  python3 conferir.py ritmo <trabalho>
      Mede a cadência visual do plano: maior trecho sem nada novo na tela. Acima de 3 s em vídeo curto é
      sinal de trecho parado (a não ser que seja intencional: momento emocional, pausa dramática).

  python3 conferir.py final <trabalho> <video.mp4>
      Depois do render: formato, duração, volume (LUFS), legenda x fala (re-transcreve o final e mede o
      atraso da legenda) e, se existir no Mac, roda o portão de entrega da casa (video-qa-entrega.py).
"""
import json
import os
import re
import shutil
import statistics
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

# Portão de entrega da casa: no Mac do Euriler, o repositório; no aluno, o Squad Edição Arcane preparado pelo MCP
# ao lado desta pasta (agents/squad-edicao-arcane). O primeiro que existir; sem nenhum, o passo final segue sem ele.
PORTAO = next((p for p in (Path.home() / "arkaeducation/arka1/squads/squad-edicao-arcane/scripts/video-qa-entrega.py",
                           Path(__file__).resolve().parent.parent.parent / "squad-edicao-arcane/scripts/video-qa-entrega.py")
               if p.is_file()),
              Path.home() / "arkaeducation/arka1/squads/squad-edicao-arcane/scripts/video-qa-entrega.py")
VENV = pf.VENV


def sh(cmd, check=True):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **pf.UTF8)
    if check and r.returncode:
        sys.exit(f"falhou: {' '.join(map(str, cmd))}\n{r.stderr[-1500:]}")
    return r


def carregar(trab):
    app = trab / "app/src"
    return json.loads((app / "data.json").read_text(encoding="utf-8")), json.loads((app / "plano.json").read_text(encoding="utf-8"))


def tempo(ref, beats, base=0.0):
    if isinstance(ref, (int, float)):
        return base + ref
    m = re.match(r"^(.+?)([+-]\d+(?:\.\d+)?)?$", str(ref).strip())
    return beats[m.group(1)] + (float(m.group(2)) if m.group(2) else 0)


def cenas_resolvidas(data, plano):
    jan = {j["nome"]: j for j in data["janelas"]}
    out = []
    for c in plano.get("cenas", []):
        js = c.get("janela")
        js = [js] if isinstance(js, str) else (js or [])
        t0 = jan[js[0]]["t0"] if js else 0
        t1 = jan[js[-1]]["t1"] if js else data["total"]
        t0 = tempo(c["de"], data["beats"]) if "de" in c else t0
        t1 = tempo(c["ate"], data["beats"]) if "ate" in c else t1
        out.append({**c, "t0": t0, "t1": t1})
    return out


def refs(obj):
    """todas as referências de tempo dentro das props (em, clique, zoom_ate, ...)"""
    chaves = {"em", "clique", "zoom_ate", "zoom_de", "direita_em", "botao_em", "brilho_em"}
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in chaves and isinstance(v, (str, int, float)):
                yield v
            else:
                yield from refs(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from refs(v)


def momentos(data, plano):
    cenas = cenas_resolvidas(data, plano)
    ts = {0.0, data["total"]}
    for c in cenas:
        ts |= {c["t0"], c["t1"]}
        for r in refs(c.get("props", {})):
            try:
                ts.add(tempo(r, data["beats"], c["t0"]))
            except Exception:
                pass
    return sorted(t for t in ts if 0 <= t <= data["total"]), cenas


def checar_assets(trab, plano):
    """proteção contra genérico: o plano só pode usar imagem/take gerado que foi aprovado (nota >= 8)"""
    reg = trab / "assets.json"
    if not reg.exists():
        return 0
    lista = json.loads(reg.read_text(encoding="utf-8"))
    usados = set(re.findall(r'"((?:assets|media)/[^"]+)"', json.dumps(plano, ensure_ascii=False)))
    aprovados = {e.get("final") for e in lista if e.get("aprovado")}
    gerados = {e.get("arquivo") for e in lista if e.get("arquivo")} | {f"assets/{e['nome']}" for e in lista if e.get("nome") and not e.get("base")}
    ruins = 0
    for u in sorted(usados):
        if "/_candidatos/" in u:
            print(f"  AVISO: o plano usa um CANDIDATO não aprovado: {u} — aprove com gerar.py aprovar (nota >= 8) ou troque"); ruins += 1
        elif u in gerados and u not in aprovados:
            print(f"  AVISO: {u} foi gerado e não passou pela régua (gerar.py aprovar/reprovar)"); ruins += 1
    if usados & aprovados:
        print(f"imagens/takes gerados aprovados na régua: {len(usados & aprovados)}")
    return ruins


def ritmo(trab):
    data, plano = carregar(trab)
    ts, cenas = momentos(data, plano)
    ts = sorted(set(ts) | {c["t0"] for c in data["cortes"]})
    # conta só eventos (troca de cena, elemento entrando, corte); zoom/rolagem contínua não entra na conta.
    # 3-6 s pode ser ok se a cena tem movimento contínuo; acima de 6 s quase sempre é trecho parado.
    buracos = [(a, b) for a, b in zip(ts, ts[1:]) if b - a > 3.0]
    maior = max((b - a for a, b in zip(ts, ts[1:])), default=0)
    print(f"cenas: {len(cenas)} · momentos visuais: {len(ts)} · média {data['total'] / max(len(ts) - 1, 1):.2f}s por troca · maior trecho parado {maior:.1f}s")
    for a, b in buracos:
        print(f"  {'ATENÇÃO ' if b - a > 6 else ''}sem evento novo por {b - a:.1f}s entre {a:.1f}s e {b:.1f}s{'' if b - a > 6 else ' (ok se a cena tem movimento contínuo)'}")
    cob = sum(c["t1"] - c["t0"] for c in cenas if c.get("tipo")) / data["total"]
    print(f"cobertura de camada visual (cenas com tipo): {cob:.0%} do vídeo")
    checar_assets(trab, plano)
    # meta do nível de pirotecnia (references/pirotecnia.md)
    nivel = plano.get("pirotecnia")
    metas = {1: (5.0, 0.30), 2: (3.0, 0.50), 3: (1.8, 0.75)}
    if nivel in metas:
        media = data["total"] / max(len(ts) - 1, 1)
        alvo_t, alvo_c = metas[nivel]
        ok_t, ok_c = media <= alvo_t, cob >= alvo_c
        print(f"nível {nivel}: troca média {media:.2f}s (meta ≤ {alvo_t}s) {'OK' if ok_t else 'ABAIXO'} · "
              f"cobertura {cob:.0%} (meta ≥ {alvo_c:.0%}) {'OK' if ok_c else 'ABAIXO'}")
        if nivel == 1 and media < 2.0:
            print("  aviso: nível 1 com troca rápida demais — quem está aprendendo cansa")
    return maior


def quadros(trab, escala):
    data, plano = carregar(trab)
    ts, cenas = momentos(data, plano)
    alvo = set()
    for c in cenas:
        alvo.add(round((c["t0"] + c["t1"]) / 2, 2))
        alvo.add(round(min(c["t0"] + 0.4, c["t1"] - 0.05), 2))
    for t in ts:
        if 0 < t < data["total"]:
            alvo.add(round(min(t + 0.35, data["total"] - 0.05), 2))
    alvo = sorted(alvo)
    qa = trab / "qa"
    pasta = qa / "quadros"
    if pasta.exists():
        for p in pasta.glob("*.jpg"):
            p.unlink()
    r = subprocess.run([*pf.comando("node"), "scripts/quadros.mjs", str(pasta.resolve()), str(escala), *map(str, alvo)], cwd=trab / "app",
                       capture_output=True, text=True, **pf.UTF8)
    if r.returncode:
        sys.exit(r.stderr[-3000:])
    fotos = sorted(pasta.glob("q_*.jpg"))
    folhas = []
    # no Windows o drawtext do ffmpeg não acha fonte sozinho: aponta a Arial do sistema
    arial = Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts/arial.ttf"
    fonte = (":fontfile='" + arial.as_posix().replace(":", "\\:") + "'") if pf.NT and arial.exists() else ""
    for n in range(0, len(fotos), 8):
        grupo = fotos[n:n + 8]
        ins, filtros = [], []
        for i, p in enumerate(grupo):
            seg = float(p.stem[2:])
            ins += ["-i", str(p)]
            filtros.append(f"[{i}]drawtext=text='{seg:.1f}s'{fonte}:x=12:y=12:fontsize=34:fontcolor=white:box=1:boxcolor=black@0.6[v{i}]")
        while len(grupo) % 4:
            ins += ["-f", "lavfi", "-i", "color=black:s=16x16"]
            filtros.append(f"[{len(grupo)}]scale=iw:ih[v{len(grupo)}]")
            grupo = grupo + [None]
        k = len(grupo)
        filtros.append("".join(f"[v{i}]" for i in range(k)) + f"xstack=inputs={k}:grid=4x{k // 4}:fill=black[o]")
        folha = qa / f"folha_{n // 8 + 1:02d}.jpg"
        r = subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(filtros), "-map", "[o]", "-frames:v", "1", str(folha)],
                           capture_output=True, text=True, **pf.UTF8)
        if r.returncode:  # tamanhos diferentes (preenchimento): cai para hstack simples
            subprocess.run(["ffmpeg", "-v", "error", "-y", *sum([["-i", str(p)] for p in fotos[n:n + 8]], []), "-filter_complex",
                            f"hstack=inputs={len(fotos[n:n + 8])}", str(folha)])
        folhas.append(folha)
    print(f"{len(fotos)} quadros em {len(folhas)} folhas:")
    for fo in folhas:
        print(" ", fo)


def final(trab, video):
    data, plano = carregar(trab)
    if checar_assets(trab, plano):
        print("  (resolva os avisos de imagem/take acima antes de entregar)")
    info = json.loads(sh(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", video]).stdout)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    dur = float(info["format"]["duration"])
    print(f"arquivo: {v['width']}x{v['height']} {v['codec_name']} {dur:.1f}s (esperado {data['total']:.1f}s)")
    err = sh(["ffmpeg", "-hide_banner", "-i", video, "-af", "ebur128", "-f", "null", "-"], check=False).stderr
    lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", err)
    print(f"volume integrado: {lufs[-1] if lufs else '?'} LUFS (bom para rede social: -16 a -13)")
    # legenda x fala
    wav = trab / "qa/final16k.wav"
    wav.parent.mkdir(exist_ok=True)
    sh(["ffmpeg", "-v", "error", "-y", "-i", video, "-vn", "-ac", "1", "-ar", "16000", wav])
    py = pf.criar_venv()
    # mesmo transcritor do preparar.py (plataforma.py): mlx-whisper no Mac Apple Silicon, faster-whisper fora dele
    cod = (
        "import json,sys\n"
        "sys.path.insert(0,sys.argv[2])\n"
        "from plataforma import transcrever_whisper\n"
        "segs=transcrever_whisper(sys.argv[1],'pt')\n"
        "print(json.dumps([{'w':x['word'].strip(),'t0':x['start']} for s in segs for x in s.get('words',[])]))\n"
    )
    ouvidas = json.loads(sh([py, "-c", cod, wav, Path(__file__).resolve().parent]).stdout.strip().splitlines()[-1])
    norm = lambda s: re.sub(r"[^\wà-ú]", "", s.lower())
    leg = [(norm(p["w"]), p["t0"]) for p in data["palavras"]]
    dif = []
    for o in ouvidas:
        cand = [t for w, t in leg if w == norm(o["w"]) and abs(t - o["t0"]) < 2.0]
        if cand:
            dif.append(min((c - o["t0"] for c in cand), key=abs))
    if dif:
        print(f"legenda x fala: atraso mediano {statistics.median(dif):+.3f}s em {len(dif)} palavras (bom: entre -0,15 e +0,15)")
    txt = " ".join(o["w"] for o in ouvidas)
    (trab / "qa/fala_final.txt").write_text(txt, encoding="utf-8")
    # fala esperada (o que o roteiro manda ter, na ordem do vídeo) x fala ouvida no final
    import difflib
    esperado = [(norm(p["w"]), p["t0"], p["w"]) for p in data["palavras"] if norm(p["w"])]
    ouvido = [norm(o["w"]) for o in ouvidas if norm(o["w"])]
    sm = difflib.SequenceMatcher(None, [e[0] for e in esperado], ouvido, autojunk=False)
    faltas = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("delete", "replace"):
            trecho = esperado[i1:i2]
            if any(len(e[0]) >= 4 for e in trecho) and (tag == "delete" or (i2 - i1) > (j2 - j1) + 1):
                faltas.append((trecho[0][1], " ".join(e[2] for e in trecho)))
    print(f"fala esperada x ouvida: {sm.ratio():.0%} igual; {len(faltas)} trecho(s) para conferir de ouvido")
    for t0, w in faltas[:20]:
        print(f"  ~{t0:.1f}s: \"{w}\" (pode ser só o Whisper errando nome; ouça o trecho)")
    print(f"fala do vídeo final salva em qa/fala_final.txt ({len(ouvidas)} palavras)")
    # palavra comida na borda: corte que cai com a voz ainda forte (o erro de 18/10/2026 em todos os vídeos do dia)
    try:
        import bordas
        ruins, _env = bordas.cortes_em_voz(trab)
        if ruins:
            print(f"REPROVADO corte-em-voz: {len(ruins)} corte(s) caem no meio da fala (palavra comida):")
            for r in ruins[:12]:
                print(f"  trecho {r['trecho']}: {r['lado']} em {r['bruto']}s do bruto ({r['db']} dB)")
            print("  rode o cortar.py de novo (bordas pelo som ligadas) e o remapear_plano.py; não entregue assim")
        else:
            print("  ok  corte-em-voz: nenhum corte no meio de palavra")
    except Exception as e:  # noqa: BLE001
        print(f"  ?   corte-em-voz: não deu para medir ({e})")
    # texto que aparece na tela (para o portão checar acento e travessão)
    visiveis = {"texto", "titulo", "etiqueta", "subtitulo", "destaque", "rotulo", "depois", "rodape", "sub", "mes", "autor", "centro", "botao", "linhas", "itens"}
    achados = []
    def colhe(o, chave=None):
        if isinstance(o, dict):
            for k, v in o.items():
                colhe(v, k)
        elif isinstance(o, list):
            for v in o:
                colhe(v, chave)
        elif isinstance(o, str) and chave in visiveis:
            achados.append(o)
    colhe(plano.get("cenas", []))
    if plano.get("headline"):
        colhe(plano["headline"], "texto")
    tela = trab / "qa/texto_tela.txt"
    tela.write_text("\n".join(achados + [p["w"] for p in data["palavras"]]) + "\n", encoding="utf-8")
    if PORTAO.exists():
        cortes = json.loads((trab / "cortes.json").read_text(encoding="utf-8"))
        prep = json.loads((trab / "prep/prep.json").read_text(encoding="utf-8"))
        args = ["python3" if shutil.which("python3") else sys.executable, PORTAO, video, "--perfil", "cena", "--ia", "nao", "--pasta-qa", trab / "qa/portao", "--texto-tela", tela]
        # referência para o portão: os trechos do roteiro, inteiros e na ordem em que vão ao ar.
        # Assim ele compara palavra a palavra mesmo com trechos reordenados, e os cortes internos
        # (pausas) ficam descritos no --plano para ele saber que ali só saiu silêncio.
        roteiro = json.loads((trab / "roteiro.json").read_text(encoding="utf-8"))
        partes, mantidos, off = [], [], 0.0
        for de, ate, nome, *_ in roteiro["trechos"]:
            # a referência é o trecho com as bordas que o cortar.py achou pelo som (não as do roteiro): senão o
            # portão acusa como "fala removida" o respiro entre o fim chutado e o fim real
            dele = [c for c in cortes["cortes"] if c["trecho"] == nome]
            if dele:
                de, ate = min(c["de"] for c in dele), max(c["ate"] for c in dele)
            p = trab / f"qa/ref_{len(partes):03d}.wav"
            sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{de:.3f}", "-t", f"{ate - de:.3f}", "-i", prep["bruto"], "-vn", "-ar", "48000", "-ac", "1", p])
            partes.append(pf.linha_concat(p))
            for c in cortes["cortes"]:
                if c["trecho"] == nome:
                    mantidos.append([round(off + c["de"] - de, 3), round(off + c["ate"] - de, 3)])
            off += ate - de
        (trab / "qa/ref.txt").write_text("\n".join(partes) + "\n", encoding="utf-8")
        ref = trab / "qa/bruto_na_ordem.wav"
        sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", trab / "qa/ref.txt", "-c", "copy", ref])
        (trab / "qa/plano_portao.json").write_text(json.dumps({"mantidos": mantidos}), encoding="utf-8")
        args += ["--bruto", ref, "--plano", trab / "qa/plano_portao.json"]
        r = sh(args, check=False)
        print("\n--- portão de entrega da casa ---")
        print("\n".join((r.stdout + r.stderr).strip().splitlines()[-25:]))
        if "FALTA_OLHO" in r.stdout + r.stderr:
            print(f"\nDepois de olhar as folhas do portão, registre:\n  python3 {PORTAO} --confirmar-olho {trab / 'qa/portao'} --visto \"o que você conferiu nas imagens\"")
    else:
        print("(portão de entrega da casa não encontrado neste computador; conferência acima é a mínima)")


if __name__ == "__main__":
    modo, trab = sys.argv[1], Path(sys.argv[2])
    if modo == "quadros":
        esc = sys.argv[sys.argv.index("--escala") + 1] if "--escala" in sys.argv else "0.35"
        quadros(trab, esc)
    elif modo == "ritmo":
        ritmo(trab)
    elif modo == "final":
        final(trab, sys.argv[3])
    else:
        sys.exit(__doc__)
