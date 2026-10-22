#!/usr/bin/env python3
"""Acelera o vídeo final mantendo o tom da voz e, se quiser, emenda um cartão final em velocidade normal depois
(para o CTA não correr).

Uso: python3 acelerar.py <entrada.mp4> <saida.mp4> <nivel|fator> [--cartao cartao.mp4]
Níveis: normal (1,0x, sem acelerar) · pouco (1,10x) · medio (1,20x) · muito (1,25x); ou um número (ex.: 1.15).
O cartão vem de uma composição à parte no mesmo projeto (ex.: npx remotion render src/index.ts Encerramento cartao.mp4).
"""
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

V = ["-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p",
     "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]


def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, **pf.UTF8)
    if r.returncode:
        sys.exit(r.stderr[-1200:])


NIVEIS = {"normal": 1.0, "sem": 1.0, "pouco": 1.10, "medio": 1.20, "médio": 1.20, "muito": 1.25}


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    ent, sai, n = sys.argv[1], sys.argv[2], sys.argv[3].strip().lower()
    k = NIVEIS[n] if n in NIVEIS else float(n.replace(",", "."))
    cartao = sys.argv[sys.argv.index("--cartao") + 1] if "--cartao" in sys.argv else None
    rapido = sai if not cartao else sai + ".rapido.mp4"
    filtro = f"[0:v]setpts=PTS/{k},fps=30[v];[0:a]atempo={k}[a]" if k != 1 else "[0:v]fps=30[v];[0:a]anull[a]"
    sh(["ffmpeg", "-v", "error", "-y", "-i", ent, "-filter_complex", filtro,
        "-map", "[v]", "-map", "[a]", *V, rapido])
    if cartao:
        sh(["ffmpeg", "-v", "error", "-y", "-i", rapido, "-i", cartao, "-filter_complex",
            "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]", "-map", "[v]", "-map", "[a]", *V, "-movflags", "+faststart", sai])
    print(f"ok: {sai} ({k}x{' + cartão' if cartao else ''})")


if __name__ == "__main__":
    main()
