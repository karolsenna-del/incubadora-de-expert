#!/usr/bin/env python3
"""Gera os efeitos sonoros do zero (whoosh, pop, click, ding, rise, impacto, tecla). Uso: python3 sfx.py <pasta>"""
import sys
import wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

if __name__ == "__main__":
    pf.exigir_modulo("numpy")
import numpy as np  # noqa: E402

SR = 48000
rng = np.random.default_rng(7)


def salvar(p, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def banda_varrida(ruido, f0, f1, q=1.2):
    n = len(ruido); fc = np.geomspace(f0, f1, n); y = np.zeros(n); y1 = y2 = x1 = x2 = 0.0
    for i in range(n):
        w0 = 2 * np.pi * fc[i] / SR; al = np.sin(w0) / (2 * q)
        a0, a1, a2 = 1 + al, -2 * np.cos(w0), 1 - al
        xi = ruido[i]; yi = (al * xi - al * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, xi, y1, yi; y[i] = yi
    return y


def t(d):
    return np.arange(int(SR * d)) / SR


def main(out):
    out.mkdir(parents=True, exist_ok=True)
    n = t(0.45); salvar(out / "whoosh.wav", banda_varrida(rng.standard_normal(len(n)), 300, 4500) * np.sin(np.pi * (n / n[-1]) ** 0.6) ** 2)
    n = t(0.09); salvar(out / "pop.wav", np.sin(2 * np.pi * np.cumsum(900 * np.exp(-n * 25) + 180) / SR) * np.exp(-n * 45))
    n = t(0.05); salvar(out / "click.wav", rng.standard_normal(len(n)) * np.exp(-n * 400) + np.sin(2 * np.pi * 2400 * n) * np.exp(-n * 300) * 0.6)
    n = t(0.35); salvar(out / "ding.wav", (np.sin(2 * np.pi * 1320 * n) + 0.5 * np.sin(2 * np.pi * 1980 * n)) * np.exp(-n * 9))
    n = t(1.2); fase = 2 * np.pi * np.cumsum(np.geomspace(60, 900, len(n))) / SR
    salvar(out / "rise.wav", (np.sin(fase) * 0.4 + rng.standard_normal(len(n)) * 0.25) * np.sin(np.pi * n / n[-1]) ** 2)
    n = t(0.7); salvar(out / "impacto.wav", np.sin(2 * np.pi * np.cumsum(120 * np.exp(-n * 6) + 38) / SR) * np.exp(-n * 5) + rng.standard_normal(len(n)) * np.exp(-n * 30) * 0.5)
    n = t(0.04); salvar(out / "tecla.wav", rng.standard_normal(len(n)) * np.exp(-n * 600))
    print("ok")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
