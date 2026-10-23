#!/usr/bin/env python3
"""Nivela a voz por trecho: cada janela do vídeo (app/src/data.json) fica no mesmo volume.

Quando há duas vozes em volumes diferentes (a pessoa e um agente de IA respondendo pela caixa de som, ligação no
viva-voz, entrevistado longe do microfone), o loudnorm do corte acerta só a média e a voz baixa some debaixo da
trilha (vídeo do Tigre, 20/10/2026: a voz do agente chegava 6 a 8 dB abaixo da do Euriler, "tá baixo a voz do
tigre"). Aqui cada janela vai ao mesmo alvo (padrão -16 LUFS), com no máximo +8 dB e -6 dB; janela sem fala
(pausa, tela sem som) fica como está. A emenda entre janelas tem rampa de 30 ms e um limitador segura os picos.

Rode depois do cortar.py e antes do trilhas.py balanco (o balanço mede a voz já nivelada). Guarda a voz anterior em
tmp_cortes/voz_sem_nivel.wav. Uso: python3 nivela_voz.py <trabalho> [alvo_lufs]
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

if __name__ == "__main__":
    pf.exigir_modulo("numpy")
import numpy as np  # noqa: E402


def lufs(wav, a, b):
    r = subprocess.run([pf.FFMPEG, "-nostdin", "-v", "info", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", str(wav), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True, **pf.UTF8)
    v = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(v[-1]) if v else None


def nivelar(trab, alvo=-16.0):
    trab = Path(trab)
    wav = trab / "app/public/media/voz.wav"
    d = json.loads((trab / "app/src/data.json").read_text(encoding="utf-8"))
    (trab / "tmp_cortes").mkdir(exist_ok=True)
    shutil.copy(wav, trab / "tmp_cortes/voz_sem_nivel.wav")
    info = subprocess.run([pf.FFPROBE, "-v", "error", "-show_entries", "stream=sample_rate,channels", "-of", "csv=p=0", str(wav)],
                          capture_output=True, text=True, **pf.UTF8).stdout.strip().split(",")
    sr, ch = int(info[0]), int(info[1])
    raw = subprocess.run([pf.FFMPEG, "-nostdin", "-v", "error", "-i", str(wav), "-f", "f32le", "-acodec", "pcm_f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, ch)
    g = np.ones(len(x), dtype=np.float32)
    for j in d["janelas"]:
        L = lufs(wav, j["t0"], j["t1"])
        ganho = 0.0 if L is None or L < -38 else max(-6.0, min(8.0, alvo - L))
        g[int(j["t0"] * sr):int(j["t1"] * sr)] = 10 ** (ganho / 20)
        print(f"{j['nome']:18s} {L if L is not None else float('nan'):6.1f} LUFS  {ganho:+5.1f} dB")
    k = max(1, int(0.03 * sr))
    g = np.convolve(g, np.ones(k, dtype=np.float32) / k, mode="same")
    y = (x * g[:, None]).astype(np.float32)
    subprocess.run([pf.FFMPEG, "-nostdin", "-v", "error", "-y", "-f", "f32le", "-ar", str(sr), "-ac", str(ch), "-i", "-",
                    "-af", "alimiter=limit=0.84:level=false", "-c:a", "pcm_s16le", str(wav)], input=y.tobytes(), check=True)
    print(f"voz nivelada: {lufs(wav, 0, d['total'])} LUFS no total (antes em tmp_cortes/voz_sem_nivel.wav)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    pf.exigir_ffmpeg()
    nivelar(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else -16.0)
