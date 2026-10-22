#!/usr/bin/env python3
"""Bordas dos trechos sem comer palavra.

A transcrição dá o horário em que cada palavra COMEÇA; o fim do trecho escrito no roteiro é um chute, e o chute
cortava a última palavra no meio (Euriler, 18/10/2026: "quando ia falar a última palavra, cortava o vídeo e ia para
a próxima cena", em todos os vídeos do dia). Este módulo acha a borda pelo som:
  - fim do trecho: o começo do silêncio (ou do vale mais fundo) entre a última palavra que ficou e a próxima;
  - começo do trecho: o fim do silêncio (ou do vale) entre a palavra anterior e a primeira que ficou.
O envelope de volume sai de prep/audio16k.wav (16 kHz mono), em quadros de 10 ms, sem numpy.

Uso direto (diagnóstico): python3 bordas.py <trabalho>  → lista os cortes que caem em cima de voz no vídeo já cortado.
"""
import array
import json
import math
import sys
import wave
from pathlib import Path

PASSO = 0.01  # 10 ms


def envelope(wav_path):
    """volume em dB por quadro de 10 ms + limiar de silêncio adaptado à gravação"""
    with wave.open(str(wav_path), "rb") as w:
        sr, n, larg = w.getframerate(), w.getnframes(), w.getsampwidth()
        if larg != 2 or w.getnchannels() != 1:
            raise ValueError("esperado WAV 16 bits mono (prep/audio16k.wav)")
        dados = array.array("h", w.readframes(n))
    if sys.byteorder == "big":
        dados.byteswap()
    tam = int(sr * PASSO)
    db = []
    for i in range(0, len(dados) - tam + 1, tam):
        s = 0
        for x in dados[i:i + tam]:
            s += x * x
        db.append(10 * math.log10(s / tam / 1073741824.0 + 1e-12))
    ordem = sorted(db)
    piso = ordem[int(len(ordem) * 0.10)] if ordem else -80
    voz = ordem[int(len(ordem) * 0.90)] if ordem else -20
    # silêncio = 26 dB abaixo do pico típico da voz, e pelo menos 6 dB acima do ruído da sala (medido em 6 gravações
    # de 18/10: quarto silencioso, sala com eco, loja com ruído; funciona onde o silencedetect de -38 dB não acha pausa)
    limiar = max(voz - 26.0, piso + 6.0)
    return {"db": db, "limiar": limiar, "piso": piso, "voz": voz}


def _q(t):
    return max(0, int(round(t / PASSO)))


def _corridas_baixas(env, a, b, minimo):
    """corridas de quadros abaixo do limiar dentro de [a, b], com duração mínima (s); devolve (ini, fim) em s"""
    db, lim = env["db"], env["limiar"]
    out, ini = [], None
    for i in range(_q(a), min(_q(b), len(db))):
        if db[i] < lim:
            if ini is None:
                ini = i
        elif ini is not None:
            if (i - ini) * PASSO >= minimo:
                out.append((ini * PASSO, i * PASSO))
            ini = None
    fim = min(_q(b), len(db))
    if ini is not None and (fim - ini) * PASSO >= minimo:
        out.append((ini * PASSO, fim * PASSO))
    return out


def _vale(env, a, b):
    db = env["db"]
    i0, i1 = _q(a), min(_q(b), len(db) - 1)
    if i1 <= i0:
        return a
    # média de 3 quadros para não cair num estalo isolado
    melhor = min(range(i0, i1 + 1), key=lambda i: sum(db[max(0, i - 1):i + 2]))
    return melhor * PASSO


def vol_em(env, t, janela=0.03):
    db = env["db"]
    i0, i1 = _q(t - janela), min(_q(t + janela), len(db))
    return max(db[i0:i1]) if i1 > i0 else -99


def ajustar_fim(ate, palavras, env, folga=0.07):
    """fim do trecho no começo do silêncio depois da última palavra que ficou (nunca no meio dela)"""
    dentro = [i for i, w in enumerate(palavras) if w["t0"] < ate - 0.12]
    if not dentro:
        return ate, None
    li = dentro[-1]
    ult = palavras[li]
    prox = palavras[li + 1] if li + 1 < len(palavras) else None
    hi = (prox["t0"] + 0.03) if prox else ult["t0"] + 1.6
    # a palavra ocupa pelo menos 70% do tempo que o Whisper deu a ela: não procura a pausa antes disso
    dur = max(0.0, ult.get("t1", ult["t0"]) - ult["t0"])
    lo = ult["t0"] + max(0.12, 0.7 * min(dur, 0.9))
    hi = min(hi, lo + 1.8)
    if hi - lo < 0.03:
        return round(max(hi, lo), 3), ult["w"]
    baixas = _corridas_baixas(env, lo, hi, 0.07)
    if baixas:
        # a pausa de verdade é a primeira corrida longa (as de dentro da palavra são curtas, consoantes como
        # t/p); sem corrida longa (fala emendada), a última antes da próxima palavra
        longas = [c for c in baixas if c[1] - c[0] >= 0.2 or c[1] >= hi - 0.02]
        ini = longas[0][0] if longas else baixas[-1][0]
        novo = min(ini + folga, hi)
    else:
        novo = _vale(env, lo, hi) + 0.02  # fala emendada: corta no vale entre as duas palavras
    return round(novo, 3), ult["w"]


def ajustar_inicio(de, palavras, env, folga=0.05):
    """começo do trecho no fim do silêncio antes da primeira palavra que ficou"""
    fi = next((i for i, w in enumerate(palavras) if w["t0"] >= de - 0.15), None)
    if fi is None:
        return de, None
    pri = palavras[fi]
    ant = palavras[fi - 1] if fi > 0 else None
    hi = pri["t0"] + 0.04
    # nunca recua para dentro da palavra anterior (repetia fala: "auditivo", "feia" no vídeo da Fabiana)
    if ant:
        dur_a = max(0.0, ant.get("t1", ant["t0"]) - ant["t0"])
        lo = ant["t0"] + max(0.12, 0.7 * min(dur_a, 0.9))
    else:
        lo = max(0.0, pri["t0"] - 1.2)
    lo = max(lo, hi - 1.5)
    if hi <= lo:
        return min(de, lo), pri["w"]
    baixas = _corridas_baixas(env, lo, hi, 0.05)
    if baixas:
        fim = baixas[-1][1]
        novo = max(fim - folga, lo)
        if hi - fim > 0.25:  # a corrida baixa acabou bem antes do começo marcado: a fala já começou ali
            novo = max(fim - folga, lo)
    else:
        novo = _vale(env, lo, hi) - 0.02
    return round(max(0.0, novo), 3), pri["w"]


def pausa_real(env, a, b):
    """encolhe a pausa do silencedetect até onde o volume cai abaixo do limiar desta gravação (no máx. 0,35 s de cada lado)"""
    db, lim = env["db"], env["limiar"]
    i, fim_a = _q(a), min(_q(a + 0.35), len(db))
    while i < fim_a and db[i] >= lim:
        i += 1
    j, ini_b = min(_q(b), len(db)) - 1, _q(b - 0.35)
    while j > ini_b and j >= 0 and db[j] >= lim:
        j -= 1
    return i * PASSO, (j + 1) * PASSO


def cortes_em_voz(trab):
    """confere o vídeo já cortado: cada borda de pedaço (cortes.json) com voz forte = palavra comida"""
    trab = Path(trab)
    env = envelope(trab / "prep/audio16k.wav")
    cortes = json.loads((trab / "cortes.json").read_text(encoding="utf-8"))
    lista = cortes["cortes"] if isinstance(cortes, dict) else cortes
    forte = env["limiar"] + 8.0
    ruins = []
    for c in lista:
        for lado, t in (("fim", c["ate"] - 0.015), ("início", c["de"] + 0.015)):
            v = vol_em(env, t, 0.015)
            if v > forte:
                ruins.append({"trecho": c.get("trecho"), "lado": lado, "bruto": round(t, 2), "db": round(v, 1)})
    return ruins, env


if __name__ == "__main__":
    ruins, env = cortes_em_voz(sys.argv[1])
    print(f"limiar de silêncio {env['limiar']:.1f} dB (piso {env['piso']:.1f}, voz {env['voz']:.1f})")
    for r in ruins:
        print(f"  corte em cima de voz: trecho {r['trecho']} ({r['lado']}, {r['bruto']}s do bruto, {r['db']} dB)")
    print(f"{len(ruins)} corte(s) em cima de voz")
