#!/usr/bin/env python3
"""Leva os tempos soltos do plano.json para o corte novo, depois de rodar o cortar.py de novo.

Os momentos-chave (beats) se acertam sozinhos, mas número solto no plano ("de": 4.94, "ate": 41.65, headline,
momentos de legenda, sfx, tremores) é tempo do vídeo final ANTIGO. Este script converte cada um:
tempo final antigo → tempo do bruto (pelo cortes.anterior.json) → tempo final novo (pelo cortes.json).
Borda de trecho vai para a mesma borda no corte novo; depois do fim da fala (cartão final, cauda) anda junto com o total.

Uso: python3 remapear_plano.py <trabalho> [--simular]
O cortar.py guarda o corte anterior em cortes.anterior.json sozinho. O plano antigo fica em app/src/plano.antes-remap.json.
"""
import json
import shutil
import sys
from pathlib import Path


def carregar(p):
    d = json.loads(Path(p).read_text(encoding="utf-8"))
    return d["cortes"] if isinstance(d, dict) else d


def janelas(cortes):
    js = {}
    for c in cortes:
        j = js.setdefault(c["trecho"], [c["t0"], c["t1"]])
        j[0], j[1] = min(j[0], c["t0"]), max(j[1], c["t1"])
    return js


def main():
    trab = Path(sys.argv[1])
    simular = "--simular" in sys.argv
    ant, nov = carregar(trab / "cortes.anterior.json"), carregar(trab / "cortes.json")
    tot_a, tot_n = ant[-1]["t1"], nov[-1]["t1"]
    ja, jn = janelas(ant), janelas(nov)
    bordas = []  # (tempo antigo, tempo novo) das bordas de cada trecho
    for nome, (a0, a1) in ja.items():
        if nome in jn:
            bordas += [(a0, jn[nome][0]), (a1, jn[nome][1])]

    def novo(t):
        if not isinstance(t, (int, float)) or isinstance(t, bool):
            return t
        if t >= tot_a - 0.03:
            return round(tot_n + (t - tot_a), 3)
        for a, n in bordas:
            if abs(t - a) <= 0.04:
                return round(n, 3)
        c = next((c for c in ant if c["t0"] <= t < c["t1"]), None)
        if c is None:
            return t
        tb = c["de"] + (t - c["t0"])
        alvo = next((x for x in nov if x["de"] - 0.02 <= tb < x["ate"] + 0.02), None)
        if alvo is None:  # caiu num pedaço que saiu: vai para a borda mais perto do mesmo trecho
            mesmos = [x for x in nov if x["trecho"] == c["trecho"]] or nov
            alvo = min(mesmos, key=lambda x: min(abs(tb - x["de"]), abs(tb - x["ate"])))
            return round(alvo["t0"] if abs(tb - alvo["de"]) < abs(tb - alvo["ate"]) else alvo["t1"], 3)
        return round(alvo["t0"] + max(0.0, tb - alvo["de"]), 3)

    pp = trab / "app/src/plano.json"
    plano = json.loads(pp.read_text(encoding="utf-8"))
    mud = []

    def troca(obj, chave, onde):
        if isinstance(obj, dict) and chave in obj:
            v = obj[chave]
            n = novo(v)
            if n != v:
                mud.append(f"{onde}.{chave}: {v} → {n}")
                obj[chave] = n

    for i, c in enumerate(plano.get("cenas", [])):
        troca(c, "de", f"cenas[{i}]")
        troca(c, "ate", f"cenas[{i}]")
    troca(plano.get("headline"), "ate", "headline")
    for i, m in enumerate((plano.get("legenda") or {}).get("momentos", [])):
        troca(m, "de", f"legenda.momentos[{i}]")
        troca(m, "ate", f"legenda.momentos[{i}]")
    for i, s in enumerate(plano.get("sfx", [])):
        troca(s, "em", f"sfx[{i}]")
    for chave in ("tremores",):
        if isinstance(plano.get(chave), list):
            plano[chave] = [novo(x) for x in plano[chave]]
    rosto = plano.get("rosto") or {}
    for chave in ("socos", "aproximar"):
        if isinstance(rosto.get(chave), list):
            rosto[chave] = [novo(x) for x in rosto[chave]]

    print(f"total {tot_a:.2f}s → {tot_n:.2f}s · {len(mud)} tempo(s) convertido(s)")
    for m in mud:
        print("  " + m)
    if not simular:
        shutil.copy(pp, pp.with_name("plano.antes-remap.json"))
        pp.write_text(json.dumps(plano, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
