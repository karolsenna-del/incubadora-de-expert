#!/usr/bin/env python3
"""Etapa 3 — corta o bruto conforme o roteiro e entrega a matéria-prima para o motor Remotion.

Uso: python3 cortar.py <pasta_do_trabalho> [roteiro.json] [--refaz]

roteiro.json (escrito pelo agente depois de ler prep/transcricao.txt):
{
  "formato": "vertical",                      # vertical (1080x1920) ou horizontal (1920x1080)
  "trechos": [[1.48, 5.98, "abertura"], ...],  # tempos do BRUTO, na ordem em que vão ao ar (pode reordenar)
                                              # 4º item opcional por trecho: {"folga": 0.15, "pausa_min": 0.4}
  "beats": {"squad": 18.32,                   # momentos-chave: tempo da palavra no BRUTO, ou
            "ferrari": {"palavra": "Ferrari", "perto": 214.7}},  # a palavra dita perto desse tempo (mais seguro)
  "pausa_min": 0.22,                          # pausa interna maior que isso vira corte seco
  "proteger_palavras": false,                 # true: não corta pausa que invade palavra da transcrição (vídeo fica mais longo)
  "tratar_audio": "auto",                     # opcional: auto | leve | medio | forte (scripts/tratar_audio.py); sem a chave, tratamento padrão
  "glowup": "medio",                          # opcional (scripts/glowup.py): "leve" retoque sutil | "medio" acordei e gravei |
                                              # "alto" maquiagem completa; ou {"nivel": "alto", "batom": "#hex", "sombra": "rosado"}
  "trocas": {"Cloud": "Claude"},              # correções de transcrição (palavra -> palavra)
  "crase_antes": ["Arcane"]                   # "a Arcane" -> "à Arcane" na legenda
}

Gera:
  app/public/media/full.mp4   rosto enquadrado na tela inteira (1080x1920 ou 1920x1080)
  app/public/media/half.mp4   rosto para a tela dividida (1080x960 ou 768x1080) e para o círculo
  app/public/media/voz.wav    fala cortada, com microfade em cada corte, tratada e normalizada
  app/public/media/bruto.mp4  o quadro inteiro do bruto (sem recorte), mesmo corte — base da cena "filmada"
  app/src/data.json           palavras, janelas (um por trecho), beats, cortes no tempo FINAL e o tamanho do bruto
  cortes.json                 o que ficou e o que saiu do bruto (o portão de qualidade usa)
"""
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402
import bordas  # noqa: E402

ALVOS = {"vertical": {"full": (1080, 1920), "half": (1080, 960)}, "horizontal": {"full": (1920, 1080), "half": (768, 1080)}}


def sh(cmd):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **pf.UTF8)
    if r.returncode:
        sys.exit(f"falhou: {' '.join(map(str, cmd))}\n{r.stderr[-1500:]}")


def protege_palavras(sil, palavras):
    """encolhe cada pausa para não comer palavra: o silencedetect às vezes marca como silêncio o começo
    baixo de uma palavra ("Então", "experts"); a transcrição diz onde a palavra está."""
    out = []
    for a, b in sil:
        for w in palavras:
            if w["t1"] <= a or w["t0"] >= b:
                continue
            # O Whisper costuma esticar a palavra para dentro da pausa (começo cedo demais ou fim tarde demais);
            # isso não é fala. Só protege o caso real: a palavra começa BEM depois do início da pausa
            # (começo baixo que o silencedetect confundiu com silêncio) ou está nos primeiros 0,25 s dela.
            if w["t0"] - a > 0.15:
                b = min(b, w["t0"] - 0.04)
            elif w["t0"] < a:
                a = max(a, min(w["t1"], w["t0"] + 0.25) + 0.03)
        if b - a > 0.05:
            out.append((a, b))
    return out


def fatiar(de, ate, sil, pausa_min, folga, env=None):
    partes, ini = [], de
    for a, b in sil:
        if b - a < pausa_min or b <= de or a >= ate:
            continue
        if env is not None:
            # o silencedetect (-38 dB) marca como silêncio o rabo baixo da palavra ("s", "a" final): a pausa
            # só começa onde o volume cai de verdade, no limiar medido nesta gravação
            a, b = bordas.pausa_real(env, a, b)
            if b - a < pausa_min:
                continue
        fim = max(a + folga, ini)
        if fim - ini > 0.12:
            partes.append((ini, min(fim, ate)))
        ini = max(b - folga, ini)
    if ate - ini > 0.12:
        partes.append((ini, ate))
    return partes


def rosto_mediano(rosto, de, ate):
    pts = [p for p in rosto["pontos"] if de - 0.6 <= p["t"] <= ate + 0.6] or rosto["pontos"]
    if not pts:
        return 0.5, 0.42
    xs = sorted(p["cx"] for p in pts)
    ys = sorted(p["cy"] for p in pts)
    return xs[len(xs) // 2], ys[len(ys) // 2]


def recorte(sw, sh_, aspecto, cx, cy, altura_olhos=0.36):
    if sw / sh_ > aspecto:
        ch = sh_
        cw = int(round(ch * aspecto / 2) * 2)
        x = min(max(cx * sw - cw / 2, 0), sw - cw)
        y = 0
    else:
        cw = sw
        ch = int(round(cw / aspecto / 2) * 2)
        x = 0
        y = min(max(cy * sh_ - ch * altura_olhos, 0), sh_ - ch)
    return cw, ch, int(x), int(y)


def main():
    pf.exigir_ffmpeg()
    trabalho = Path(sys.argv[1])
    roteiro = json.loads(Path(sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else trabalho / "roteiro.json").read_text(encoding="utf-8"))
    refaz = "--refaz" in sys.argv
    prep = trabalho / "prep"
    info = json.loads((prep / "prep.json").read_text(encoding="utf-8"))
    sil = json.loads((prep / "silencios.json").read_text(encoding="utf-8"))
    rosto = json.loads((prep / "rosto.json").read_text(encoding="utf-8"))
    palavras = json.loads((prep / "palavras.json").read_text(encoding="utf-8"))
    formato = roteiro.get("formato", "vertical")
    app = trabalho / "app"
    media = app / "public/media"
    media.mkdir(parents=True, exist_ok=True)
    tmp = trabalho / "tmp_cortes"
    tmp.mkdir(exist_ok=True)

    # proteção de palavra é opcional: com ela ligada o vídeo fica mais longo (o Whisper estica palavras para dentro
    # das pausas). O normal é corrigir só o trecho que picotou, com {"folga": 0.15}, depois do conferir.py final.
    if roteiro.get("proteger_palavras"):
        sil = protege_palavras(sil, palavras)
    # bordas pelo som: o fim escrito no roteiro é chute a partir do COMEÇO da última palavra e cortava a palavra
    # no meio (18/10/2026, todos os vídeos do dia); aqui o fim vai para o começo do silêncio depois dela e o começo
    # para o fim do silêncio antes da primeira. {"borda": "manual"} no trecho (ou no roteiro) desliga.
    env = bordas.envelope(prep / "audio16k.wav")
    cortes, janelas, t = [], [], 0.0
    for tr in roteiro["trechos"]:
        de, ate, nome = tr[:3]
        op = tr[3] if len(tr) > 3 else {}
        manual = op.get("borda", roteiro.get("borda", "som")) == "manual"
        if not manual:
            de2, w0 = bordas.ajustar_inicio(de, palavras, env)
            ate2, w1 = bordas.ajustar_fim(ate, palavras, env)
            # trava: o som pode corrigir o chute, não reescrever o roteiro (começo recua no máx. 0,15 s, fim avança no
            # máx. 0,8 s) e um trecho nunca invade o vizinho do bruto
            de2, ate2 = max(de2, de - 0.15), min(ate2, ate + 0.8)
            for outro in roteiro["trechos"]:
                if outro is tr:
                    continue
                # o vizinho também tem a borda achada pelo som: a fronteira entre dois trechos colados é a dele
                o0 = max(bordas.ajustar_inicio(outro[0], palavras, env)[0], outro[0] - 0.15)
                o1 = min(bordas.ajustar_fim(outro[1], palavras, env)[0], outro[1] + 0.8)
                if o1 <= de + 0.02 and o1 > de2:
                    de2 = o1
                if o0 >= ate - 0.02 and o0 < ate2:
                    ate2 = o0
            if ate2 > de2:
                if abs(de2 - de) > 0.04 or abs(ate2 - ate) > 0.04:
                    print(f"borda: {nome} {de:.2f}-{ate:.2f} → {de2:.2f}-{ate2:.2f} (começa em '{w0}', termina depois de '{w1}')")
                de, ate = de2, ate2
        ini = t
        for a, b in fatiar(de, ate, sil, op.get("pausa_min", roteiro.get("pausa_min", 0.22)), op.get("folga", roteiro.get("folga", 0.07)), None if manual else env):
            cortes.append({"de": round(a, 3), "ate": round(b, 3), "trecho": nome, "t0": round(t, 3), "t1": round(t + b - a, 3)})
            t += b - a
        janelas.append({"nome": nome, "t0": round(ini, 3), "t1": round(t, 3)})
    total = round(t, 3)
    # corte diferente do anterior = vídeo e áudio precisam ser refeitos juntos (sem isso a imagem fica no corte
    # velho e a voz no novo: legenda e boca dessincronizam)
    _ant = trabalho / "cortes.json"
    if not refaz and _ant.exists():
        try:
            if json.loads(_ant.read_text(encoding="utf-8")).get("cortes") != cortes:
                refaz = True
                print("corte mudou: refazendo vídeo e áudio")
        except ValueError:
            refaz = True

    def final(tb):
        melhor = None
        for c in cortes:
            if c["de"] - 0.08 <= tb < c["ate"]:
                return round(c["t0"] + max(tb - c["de"], 0), 3)
            d = min(abs(tb - c["de"]), abs(tb - c["ate"]))
            if melhor is None or d < melhor[0]:
                melhor = (d, c["t0"] if abs(tb - c["de"]) < abs(tb - c["ate"]) else c["t1"] - 0.05)
        return round(melhor[1], 3)

    import re as _re
    norm = lambda x: _re.sub(r"[^\wà-ú]", "", x.lower())

    def tempo_bruto(nome, v):
        if isinstance(v, dict):
            alvo = norm(v["palavra"])
            cand = [w for w in palavras if norm(w["w"]) == alvo]
            if not cand:
                sys.exit(f"beat '{nome}': a palavra '{v['palavra']}' não aparece na transcrição")
            return min(cand, key=lambda w: abs(w["t0"] - v.get("perto", w["t0"])))["t0"]
        return v

    beats = {}
    for k, v in roteiro.get("beats", {}).items():
        tb = tempo_bruto(k, v)
        dentro = any(c["de"] - 0.08 <= tb < c["ate"] for c in cortes)
        beats[k] = final(tb)
        if not dentro:
            print(f"AVISO: beat '{k}' ({tb:.2f}s no bruto) caiu numa pausa ou trecho cortado; foi para {beats[k]:.2f}s do vídeo final. Confira no quadro.", file=sys.stderr)

    trocas = roteiro.get("trocas", {})
    crase = tuple(roteiro.get("crase_antes", []))
    pal = []
    for c in cortes:
        for w in palavras:
            meio = (w["t0"] + w["t1"]) / 2
            if c["de"] <= meio < c["ate"]:
                txt = w["w"]
                nucleo = txt.strip(".,!?;:")
                if nucleo in trocas:
                    txt = txt.replace(nucleo, trocas[nucleo])
                pal.append({"t0": round(c["t0"] + max(w["t0"] - c["de"], 0), 3), "t1": round(c["t0"] + min(w["t1"], c["ate"]) - c["de"], 3), "w": txt})
    if crase:
        for i in range(1, len(pal)):
            if pal[i]["w"].startswith(crase) and pal[i - 1]["w"] == "a":
                pal[i - 1]["w"] = "à"
            elif pal[i]["w"].startswith(crase) and pal[i - 1]["w"].lower().rstrip(",").endswith(("vindo", "vinda", "vindos")):
                pal[i]["w"] = "à " + pal[i]["w"]  # o "a" colado sumiu no corte de pausa

    # a fonte convertida pela Apple pode começar alguns ms depois do bruto (0,043 s no iPhone): a imagem
    # é cortada com esse deslocamento para bater com o áudio, que vem do bruto
    def inicio(arq):
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=start_time", "-of", "csv=p=0", arq],
                           capture_output=True, text=True, **pf.UTF8)
        try:
            return float(r.stdout.strip().strip(","))
        except ValueError:
            return 0.0
    desloc = inicio(info["fonte"]) - inicio(info["bruto"])

    # vídeo: dois recortes do mesmo corte, sem mexer na cor
    sw, shh = info["w"], info["h"]
    for nome, (tw, th) in ALVOS[formato].items():
        destino = media / f"{nome}.mp4"
        if destino.exists() and not refaz:
            continue
        linhas = []
        for i, c in enumerate(cortes):
            cx, cy = rosto_mediano(rosto, c["de"], c["ate"])
            cw, ch, x, y = recorte(sw, shh, tw / th, cx, cy)
            seg = tmp / f"{nome}_{i:03d}.mp4"
            # número de quadros pelo tempo ACUMULADO (arredondar cada pedaço sozinho atrasa ~1 quadro por corte)
            nq = round(c["t1"] * 30) - round(c["t0"] * 30)
            sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{c['de'] + desloc:.3f}", "-t", f"{c['ate'] - c['de'] + 0.2:.3f}", "-i", info["fonte"], "-an",
                "-frames:v", str(nq), "-vf", f"crop={cw}:{ch}:{x}:{y},scale={tw}:{th}:flags=lanczos,setsar=1,fps=30",
                "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-pix_fmt", "yuv420p",
                "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", seg])
            linhas.append(pf.linha_concat(seg))
        (tmp / f"{nome}.txt").write_text("\n".join(linhas) + "\n", encoding="utf-8")
        sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", tmp / f"{nome}.txt", "-c", "copy", destino])

    # glowup (opcional): retoque sutil de pele nos recortes de rosto — "glowup": 0.6 no roteiro (0,3 quase nada, 1,0 forte)
    if roteiro.get("glowup") and (refaz or not (tmp / "glowup.ok").exists()):
        venv_py = pf.criar_venv()
        # importa o que o glowup.py importa: um MediaPipe instalado pela metade (sem o pillow do matplotlib) também reinstala
        if subprocess.run([venv_py, "-c", "from mediapipe.tasks.python import vision"], capture_output=True).returncode:
            print("instalando o MediaPipe 0.10.35 no ambiente da skill (uma vez só)...", flush=True)
            # o MediaPipe vai sem dependências (ele puxaria o opencv-contrib 5, que quebra o rosto); as dele vão com as
            # dependências delas: num ambiente novo o matplotlib sem o pillow derruba o glowup ("No module named 'PIL'")
            subprocess.run([venv_py, "-m", "pip", "install", "-q", "--no-deps", "mediapipe==0.10.35"], check=True)
            subprocess.run([venv_py, "-m", "pip", "install", "-q", "absl-py~=2.3", "flatbuffers~=25.9", "matplotlib", "sounddevice~=0.5", "certifi"], check=True)
        for nome in ALVOS[formato]:
            arq = media / f"{nome}.mp4"
            tmpf = tmp / f"{nome}_glow.mp4"
            g = roteiro["glowup"]
            if isinstance(g, dict):  # {"nivel": "alto", "intensidade": 0.6, "batom": "#C2737A", "sombra": "rosado"}
                opc = ["--nivel", str(g.get("nivel", "leve"))]
                for k in ("intensidade", "batom", "sombra"):
                    if k in g:
                        opc += [f"--{k}", str(g[k])]
            elif isinstance(g, str):  # "leve" | "medio" | "alto"
                opc = ["--nivel", g]
            else:  # número: intensidade do nível leve
                opc = ["--nivel", "leve", "--intensidade", str(g)]
            r = subprocess.run([venv_py, Path(__file__).with_name("glowup.py"), arq, tmpf, *opc, "--crf", "15"],
                               capture_output=True, text=True, **pf.UTF8)
            if r.returncode:
                sys.exit(f"glowup falhou em {nome}: {r.stderr[-800:]}")
            tmpf.replace(arq)
        (tmp / "glowup.ok").write_text(str(roteiro["glowup"]), encoding="utf-8")
        print(f"glowup {roteiro['glowup']} aplicado no rosto (full e half)")

    # quadro inteiro do bruto (lado maior até 1920), mesmo corte: base da cena "filmada"
    k = min(1.0, 1920 / max(sw, shh))
    bw, bh = int(round(sw * k / 2) * 2), int(round(shh * k / 2) * 2)
    destino = media / "bruto.mp4"
    if not destino.exists() or refaz:
        linhas = []
        for i, c in enumerate(cortes):
            seg = tmp / f"bruto_{i:03d}.mp4"
            nq = round(c["t1"] * 30) - round(c["t0"] * 30)
            sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{c['de'] + desloc:.3f}", "-t", f"{c['ate'] - c['de'] + 0.2:.3f}", "-i", info["fonte"], "-an",
                "-frames:v", str(nq), "-vf", f"scale={bw}:{bh}:flags=lanczos,setsar=1,fps=30", "-c:v", "libx264", "-preset", "medium", "-crf", "17",
                "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", seg])
            linhas.append(pf.linha_concat(seg))
        (tmp / "bruto.txt").write_text("\n".join(linhas) + "\n", encoding="utf-8")
        sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", tmp / "bruto.txt", "-c", "copy", destino])

    voz = media / "voz.wav"
    if not voz.exists() or refaz:
        linhas = []
        for i, c in enumerate(cortes):
            p = tmp / f"a_{i:03d}.wav"
            d = c["ate"] - c["de"]
            sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{c['de']:.3f}", "-t", f"{d:.3f}", "-i", info["bruto"], "-vn",
                "-af", f"afade=t=in:d=0.012,afade=t=out:st={max(d - 0.02, 0):.3f}:d=0.02", "-ar", "48000", "-ac", "2", p])
            linhas.append(pf.linha_concat(p))
        (tmp / "voz.txt").write_text("\n".join(linhas) + "\n", encoding="utf-8")
        if roteiro.get("tratar_audio"):
            # tratamento completo e opcional (ruído, zumbido, chiado, clipagem, volume): scripts/tratar_audio.py
            crua = tmp / "voz_crua.wav"
            sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", tmp / "voz.txt", "-ar", "48000", crua])
            r = subprocess.run([pf.python_com("numpy"), Path(__file__).with_name("tratar_audio.py"), "aplicar", crua, voz, "--nivel", str(roteiro["tratar_audio"]), "--medir", info["bruto"]],
                               capture_output=True, text=True, **pf.UTF8)
            if r.returncode:
                sys.exit(f"tratar_audio falhou: {r.stderr[-800:]}")
            print(r.stdout.strip().splitlines()[0])
        else:
            sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", tmp / "voz.txt",
                "-af", "highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=3,loudnorm=I=-15:TP=-1.5:LRA=9",
                "-ar", "48000", voz])

    # onde o rosto fica no full.mp4 (0 a 1 na largura, mediana ponderada pelo tempo): o layout "lado" do horizontal
    # centraliza o painel de vidro nele
    tw, th = ALVOS[formato]["full"]
    xs, ys = [], []
    for c in cortes:
        cx, cy = rosto_mediano(rosto, c["de"], c["ate"])
        cw, ch, x, y = recorte(sw, shh, tw / th, cx, cy)
        peso = max(1, round((c["ate"] - c["de"]) * 10))
        xs += [min(1.0, max(0.0, (cx * sw - x) / cw))] * peso
        ys += [min(1.0, max(0.0, (cy * shh - y) / ch))] * peso  # altura do rosto (o template spotlight enquadra a janela nela)
    rosto_x = round(sorted(xs)[len(xs) // 2], 3) if xs else 0.5
    rosto_y = round(sorted(ys)[len(ys) // 2], 3) if ys else 0.36
    dados = {"formato": formato, "total": total, "janelas": janelas, "beats": beats, "palavras": pal, "bruto": [bw, bh],
             "cortes": [{"t0": c["t0"], "t1": c["t1"]} for c in cortes], "rosto_x": rosto_x, "rosto_y": rosto_y}
    (app / "src").mkdir(parents=True, exist_ok=True)
    (app / "src/data.json").write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")

    # o que saiu do bruto (para o portão de qualidade aceitar os cortes de roteiro)
    mantidos = sorted((c["de"], c["ate"]) for c in cortes)
    sem_rosto = len(rosto["pontos"]) < 0.3 * max(1, info["duracao"] * 2)
    saiu, fim = [], 0.0
    for a, b in mantidos:
        if a - fim > 0.3:
            saiu.append([round(fim, 2), round(a, 2)])
        fim = max(fim, b)
    if info["duracao"] - fim > 0.3:
        saiu.append([round(fim, 2), round(info["duracao"], 2)])
    # guarda o corte anterior: o remapear_plano.py leva os tempos soltos do plano para o corte novo
    anterior = trabalho / "cortes.json"
    if anterior.exists():
        velho = anterior.read_text(encoding="utf-8")
        if json.loads(velho).get("cortes") != cortes:
            (trabalho / "cortes.anterior.json").write_text(velho, encoding="utf-8")
            print("corte mudou: rode scripts/remapear_plano.py <trabalho> para levar os tempos soltos do plano junto")
    (trabalho / "cortes.json").write_text(json.dumps({"cortes": cortes, "removidos_do_bruto": saiu, "reordenado": [j["nome"] for j in janelas]}, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"{len(cortes)} cortes, {total:.1f}s, {len(pal)} palavras na legenda")
    for j in janelas:
        print(f"  {j['t0']:6.2f}-{j['t1']:6.2f}  {j['nome']}")
    print("beats:", ", ".join(f"{k}={v}" for k, v in beats.items()))
    if sem_rosto:
        print("SEM ROSTO na maior parte do bruto: use layout 'cheia' com a cena 'filmada' (quadro inteiro do bruto) como base.")


if __name__ == "__main__":
    main()
