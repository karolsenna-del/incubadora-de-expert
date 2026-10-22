#!/usr/bin/env python3
"""Etapa 1 — prepara o bruto para edição.

Uso: python3 preparar.py <video_bruto> <pasta_do_trabalho> [--alvo SEG]

  --alvo SEG   vídeo com mais de uma pessoa (Meet, entrevista, palco): diga um segundo do bruto em que SÓ a
               pessoa principal aparece. O rosto dela vira a referência e as detecções de outras pessoas saem.
               Pode rodar de novo só com --alvo depois do preparo (refaz só o filtro do rosto).

Faz, e grava em <trabalho>/prep/:
  fonte.mp4           vídeo com a cor original (HDR do iPhone vira SDR pela conversão nativa da Apple no Mac;
                      fora do Mac, pelo zscale ou libplacebo do ffmpeg; nada de LUT ou correção de cor)
  audio16k.wav        áudio para transcrever
  palavras.json       transcrição palavra por palavra com tempo (Whisper large-v3-turbo: mlx-whisper no Mac Apple
                      Silicon; faster-whisper no Windows, no Linux e no Mac Intel, com openai-whisper de reserva)
  transcricao.txt     a mesma transcrição em linhas legíveis: "[12.3] palavra@12.30 ..." — é por ela que
                      o roteiro visual é escrito
  rosto.json          posição do rosto a cada 0,5 s (para o recorte seguir a pessoa)
  silencios.json      pausas acima de 0,22 s
  prep.json           resumo (tamanho, duração, fps, HDR, orientação)

Roda dentro de um ambiente Python próprio (~/.cache/edicao-euriliana/venv) que o script cria sozinho
na primeira vez (mlx-whisper no Mac Apple Silicon; faster-whisper nos outros; opencv 4.x). O que muda entre Mac,
Windows e Linux fica em plataforma.py (EDICAO_PLATAFORMA=windows|linux força o caminho de fora do Mac para testar).
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

VENV = pf.VENV
MAC_ARM = pf.MAC_ARM


def garantir_venv():
    if pf.no_venv():
        return
    pf.rodar_no_venv()


def sh(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **pf.UTF8, **kw)
    if r.returncode:
        raise RuntimeError(f"falhou: {' '.join(map(str, cmd))}\n{r.stderr[-1500:]}")
    return r.stdout


def sondar(v):
    j = json.loads(sh(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", v]))
    vs = next(s for s in j["streams"] if s["codec_type"] == "video")
    rot = 0
    for sd in vs.get("side_data_list", []):
        if "rotation" in sd:
            rot = int(sd["rotation"])
    w, h = vs["width"], vs["height"]
    if abs(rot) == 90:
        w, h = h, w
    num, den = map(int, vs.get("r_frame_rate", "30/1").split("/"))
    return {
        "w": w, "h": h, "rotacao": rot, "duracao": float(j["format"]["duration"]), "fps": round(num / den, 3),
        "hdr": vs.get("color_transfer") in ("arib-std-b67", "smpte2084"), "transfer": vs.get("color_transfer"),
        "tem_audio": any(s["codec_type"] == "audio" for s in j["streams"]),
    }


def _mesmo_arquivo(a, b):
    try:
        return os.path.samefile(a, b)
    except OSError:
        return False


def converter_cor(bruto, info, prep):
    """HDR do iPhone -> SDR igual ao que o iPhone mostra. Sem HDR: usa o bruto como está."""
    destino = prep / "fonte.mp4"
    if destino.exists() or destino.is_symlink():
        # HDR que ficou sem conversão numa rodada anterior (ffmpeg sem zscale) e agora tem conversor: refaz
        if not (info["hdr"] and _mesmo_arquivo(destino, bruto) and tem_conversor_hdr()):
            return destino
        destino.unlink()
    if not info["hdr"]:
        pf.ligar(bruto, destino)
        return destino
    if pf.MAC and shutil.which("avconvert"):
        # o avconvert falha perto do fim de arquivos longos do iPhone; em pedaços de 60 s ele não falha
        preset = "Preset3840x2160" if max(info["w"], info["h"]) > 1920 else "Preset1920x1080"
        pedacos = prep / "sdr"
        pedacos.mkdir(exist_ok=True)
        lista = []
        s = 0.0
        while s < info["duracao"] - 0.05:
            p = pedacos / f"p{int(s):05d}.mov"
            dur = min(60.0, info["duracao"] - s)
            sh(["avconvert", "-s", bruto, "-p", preset, "-o", p, "--start", f"{s:.3f}", "--duration", f"{dur:.3f}", "--replace"])
            lista.append(pf.linha_concat(p))
            s += 60.0
        (pedacos / "lista.txt").write_text("\n".join(lista) + "\n", encoding="utf-8")
        sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", pedacos / "lista.txt", "-map", "0:v:0",
            "-c", "copy", destino])
        return destino
    # fora do Mac: tonemap do ffmpeg, pelo zscale (ou libplacebo); sem nenhum, avisa como conseguir e segue com o HDR
    filtros = pf.filtros_ffmpeg()
    tentativas = []
    if " zscale " in filtros:
        tentativas.append(("zscale", "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=mobius:desat=0,"
                                     "zscale=t=bt709:m=bt709:r=tv,format=yuv420p"))
    if " libplacebo " in filtros:
        tentativas.append(("libplacebo", "libplacebo=tonemapping=auto:colorspace=bt709:color_primaries=bt709:color_trc=bt709:"
                                         "range=tv:format=yuv420p"))
    for nome, vf in tentativas:
        try:
            print(f"convertendo HDR para SDR com o {nome} do ffmpeg...", flush=True)
            sh(["ffmpeg", "-v", "error", "-y", "-i", bruto, "-an", "-vf", vf,
                "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p",
                "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", destino])
            return destino
        except RuntimeError as e:
            print(f"  o {nome} falhou: {str(e).splitlines()[-1][:200]}", flush=True)
            if destino.exists():
                destino.unlink()
    print("AVISO: vídeo HDR e sem conversor (avconvert/zscale/libplacebo). A cor pode sair lavada.\n"
          f"  Para converter: {pf.COMO_FFMPEG[pf.SISTEMA]}\n"
          "  Depois rode o preparar.py de novo: ele refaz só a conversão de cor.", flush=True)
    pf.ligar(bruto, destino)
    return destino


def tem_conversor_hdr():
    if pf.MAC and shutil.which("avconvert"):
        return True
    f = pf.filtros_ffmpeg()
    return " zscale " in f or " libplacebo " in f


def transcrever(prep):
    wav = prep / "audio16k.wav"
    saida = prep / "palavras.json"
    if saida.exists():
        return json.loads(saida.read_text(encoding="utf-8"))
    palavras = []
    for s in pf.transcrever_whisper(wav, "pt"):
        for w in s.get("words", []):
            txt = w["word"].strip()
            if not txt:
                continue
            if palavras and txt.startswith("-"):  # "bem" + "-vindo"
                palavras[-1]["w"] += txt
                palavras[-1]["t1"] = round(w["end"], 3)
                continue
            palavras.append({"t0": round(w["start"], 3), "t1": round(w["end"], 3), "w": txt})
    # alucinação típica do Whisper no fim do arquivo: palavras repetidas de duração zero
    palavras = [p for p in palavras if p["t1"] - p["t0"] > 0.005]
    saida.write_text(json.dumps(palavras, ensure_ascii=False), encoding="utf-8")
    linhas, atual, ini = [], [], None
    for i, p in enumerate(palavras):
        if ini is None:
            ini = p["t0"]
        atual.append(f"{p['w']}@{p['t0']:.2f}")
        prox = palavras[i + 1] if i + 1 < len(palavras) else None
        if not prox or prox["t0"] - p["t1"] > 0.6 or len(atual) >= 16 or p["w"][-1:] in ".?!":
            linhas.append(f"[{ini:7.2f} | {int(ini // 60):02d}:{int(ini % 60):02d}] " + " ".join(atual))
            atual, ini = [], None
    (prep / "transcricao.txt").write_text("\n".join(linhas) + "\n", encoding="utf-8")
    return palavras


def rostos(fonte, prep, info):
    saida = prep / "rosto.json"
    if saida.exists():
        return
    import cv2
    import numpy as np
    passo = 0.5
    if info["w"] >= info["h"]:
        W, H = 640, int(round(640 * info["h"] / info["w"] / 2) * 2)
    else:
        W, H = int(round(640 * info["w"] / info["h"] / 2) * 2), 640
    proc = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(fonte), "-vf", f"fps={1/passo},scale={W}:{H},format=gray",
                             "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    xml = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    casc = cv2.CascadeClassifier(xml)
    if casc.empty():  # OpenCV no Windows não abre caminho com acento (C:\Users\João\...): carrega pela memória
        fs = cv2.FileStorage(Path(xml).read_text(encoding="utf-8"), cv2.FILE_STORAGE_READ | cv2.FILE_STORAGE_MEMORY)
        casc = cv2.CascadeClassifier()
        casc.read(fs.getFirstTopLevelNode())
    out, i = [], 0
    while True:
        buf = proc.stdout.read(W * H)
        if len(buf) < W * H:
            break
        img = np.frombuffer(buf, np.uint8).reshape(H, W)
        faces = casc.detectMultiScale(img, 1.1, 6, minSize=(40, 40))
        if len(faces):
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            out.append({"t": round(i * passo, 2), "cx": (x + w / 2) / W, "cy": (y + h / 2) / H, "h": h / H})
        i += 1
    proc.wait()
    saida.write_text(json.dumps({"caixa": [W, H], "pontos": out}), encoding="utf-8")
    print(f"rosto: {len(out)}/{i} quadros", flush=True)


def filtrar_alvo(prep, alvo):
    """mantém só o rosto parecido com o do segundo 'alvo' (posição e tamanho); guarda tudo em rosto_todos.json"""
    todos_p = prep / "rosto_todos.json"
    base = json.loads((todos_p if todos_p.exists() else prep / "rosto.json").read_text(encoding="utf-8"))
    todos_p.write_text(json.dumps(base), encoding="utf-8")
    pts = base["pontos"]
    if not pts:
        return
    ref = min(pts, key=lambda p: abs(p["t"] - alvo))
    ok = [p for p in pts if abs(p["cx"] - ref["cx"]) < 0.12 and abs(p["cy"] - ref["cy"]) < 0.15 and 0.6 < p["h"] / ref["h"] < 1.6]
    (prep / "rosto.json").write_text(json.dumps({"caixa": base["caixa"], "pontos": ok, "alvo": ref}), encoding="utf-8")
    print(f"rosto-alvo em {ref['t']}s: ficaram {len(ok)}/{len(pts)} detecções", flush=True)


def avisar_saltos(prep):
    pts = json.loads((prep / "rosto.json").read_text(encoding="utf-8"))["pontos"]
    if len(pts) > 10:
        import statistics
        if statistics.pstdev(p["cx"] for p in pts) > 0.15:
            print("AVISO: o rosto detectado pula de lugar (mais de uma pessoa ou troca de câmera). "
                  "Rode de novo com --alvo <segundo em que só a pessoa principal aparece>.", flush=True)


def silencios(prep):
    saida = prep / "silencios.json"
    if saida.exists():
        return
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(prep / "audio16k.wav"), "-af", "silencedetect=noise=-38dB:d=0.22", "-f", "null", "-"],
                         capture_output=True, text=True, **pf.UTF8).stderr
    ini, out = None, []
    for linha in err.splitlines():
        if "silence_start:" in linha:
            ini = float(linha.split("silence_start:")[1].split()[0])
        elif "silence_end:" in linha and ini is not None:
            out.append([round(ini, 3), round(float(linha.split("silence_end:")[1].split()[0]), 3)])
            ini = None
    saida.write_text(json.dumps(out), encoding="utf-8")


def main():
    pf.exigir_ffmpeg()
    garantir_venv()
    bruto, trabalho = sys.argv[1], Path(sys.argv[2])
    alvo = float(sys.argv[sys.argv.index("--alvo") + 1]) if "--alvo" in sys.argv else None
    prep = trabalho / "prep"
    prep.mkdir(parents=True, exist_ok=True)
    info = sondar(bruto)
    info["bruto"] = str(Path(bruto).resolve())
    print(f"bruto: {info['w']}x{info['h']} {info['duracao']:.1f}s {'HDR' if info['hdr'] else 'SDR'}", flush=True)
    fonte = converter_cor(bruto, info, prep)
    info["fonte"] = str(fonte.resolve()) if not fonte.is_symlink() else str(fonte)
    if not (prep / "audio16k.wav").exists():
        sh(["ffmpeg", "-v", "error", "-y", "-i", bruto, "-vn", "-ac", "1", "-ar", "16000", prep / "audio16k.wav"])
    palavras = transcrever(prep)
    rostos(fonte, prep, info)
    if alvo is not None:
        filtrar_alvo(prep, alvo)
    else:
        avisar_saltos(prep)
    silencios(prep)
    (prep / "prep.json").write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"pronto: {len(palavras)} palavras. Leia {prep / 'transcricao.txt'}", flush=True)


if __name__ == "__main__":
    main()
