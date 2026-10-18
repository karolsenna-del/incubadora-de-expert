#!/usr/bin/env python3
"""Tratar áudio (padrão ouro) — diagnostica e trata a fala: isola a voz com IA, tira ruído de fundo, zumbido, chiado
de "s", estalo de clipagem, e deixa a voz com cara de estúdio e no volume certo.

  python3 tratar_audio.py analisar <audio_ou_video>
      Mede e explica em português: volume (LUFS), pico, ruído de fundo nas pausas, zumbido de tomada (60/50 Hz),
      chiado de "s" (sibilância), clipagem e variação de volume. Termina com o nível recomendado e a DECISÃO:
      tratar (tem problema claro: trate sem perguntar e conte na entrega), perguntar (dá para melhorar, mas é
      escolha da pessoa) ou limpo (só o tratamento padrão do corte).

  python3 tratar_audio.py aplicar <entrada> <saida.wav> [--nivel auto|leve|medio|forte] [--sem-isolar] [--medir <bruto>]
      1) limpa a base (passa-alta, tira zumbido e estalo); 2) ISOLA A VOZ com o DeepFilterNet (rede neural que roda
      no computador; baixado e conferido na primeira vez, ver plataforma.isolador_de_voz), mais forte a cada nível;
      3) polimento de voz (graves embolados, presença, brilho, "s"), compressão e volume de rede social.
      Sem o isolador (sem internet na primeira vez), cai para a redução de ruído do ffmpeg. Grava o antes/depois em
      <saida>.relatorio.txt. Fala natural acima de tudo: nada de voz de robô, nada de "som de lata".
      --medir: diagnostica por outro arquivo (o cortar.py passa o bruto, que tem as pausas; a voz já cortada quase não
      tem pausa e o ruído medido nela engana).

No fluxo da skill: ponha "tratar_audio": "auto" (ou leve/medio/forte) no roteiro.json e o cortar.py usa este
tratamento na voz em vez do tratamento padrão (passa-alta + compressão + volume).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

if __name__ == "__main__":
    pf.exigir_modulo("numpy")  # sem numpy no Python do sistema (Windows recém-instalado): roda no ambiente da skill
import numpy as np  # noqa: E402

SR = 16000


def sh(cmd):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **pf.UTF8)
    if r.returncode:
        sys.exit(f"falhou: {' '.join(map(str, cmd))}\n{r.stderr[-1200:]}")
    return r


def carregar(arq):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(arq), "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True).stdout
    return np.frombuffer(raw, np.float32)


def db(x):
    return 20 * np.log10(max(float(x), 1e-9))


def medir(arq):
    x = carregar(arq)
    if len(x) < SR:
        sys.exit("áudio curto demais para medir")
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(arq), "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True, **pf.UTF8).stderr
    lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])
    lra = float(re.findall(r"LRA:\s+(-?[\d.]+) LU", err)[-1])
    pico = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", err)[-1])
    # janelas de 50 ms: as 10% mais baixas são "pausa" (ruído de fundo), as 40% mais altas são "fala"
    n = SR // 20
    jan = x[: len(x) // n * n].reshape(-1, n)
    rms = np.sqrt((jan ** 2).mean(1) + 1e-12)
    ordem = np.argsort(rms)
    pausa = jan[ordem[: max(5, len(ordem) // 10)]]
    fala = jan[ordem[-max(5, len(ordem) * 4 // 10):]]
    ruido = db(np.sqrt((pausa ** 2).mean()))
    voz = db(np.sqrt((fala ** 2).mean()))
    # zumbido: energia em 60/120/180 Hz (ou 50/100/150) contra a vizinhança, nas pausas
    seg = pausa.reshape(-1)
    esp = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))
    fr = np.fft.rfftfreq(len(seg), 1 / SR)

    def pico_em(f0):
        alvo = esp[(fr > f0 - 2) & (fr < f0 + 2)].max(initial=0)
        viz = np.median(esp[((fr > f0 - 25) & (fr < f0 - 6)) | ((fr > f0 + 6) & (fr < f0 + 25))])
        return db(alvo) - db(viz)
    hum60 = np.mean([pico_em(f) for f in (60, 120, 180)])
    hum50 = np.mean([pico_em(f) for f in (50, 100, 150)])
    if ruido < -75:  # pausa em silêncio digital (áudio de Meet, gravador com portão): não tem zumbido para medir
        hum60 = hum50 = 0.0
    # sibilância: energia 5–8 kHz contra 300 Hz–4 kHz, na fala
    sf = fala.reshape(-1)
    e = np.abs(np.fft.rfft(sf * np.hanning(len(sf)))) ** 2
    f2 = np.fft.rfftfreq(len(sf), 1 / SR)
    sib = db(np.sqrt(e[(f2 > 5000) & (f2 < 7900)].sum())) - db(np.sqrt(e[(f2 > 300) & (f2 < 4000)].sum()))
    clip = int((np.abs(x) > 0.985).sum())
    return {"lufs": lufs, "lra": lra, "pico_dbfs": pico, "ruido_dbfs": round(ruido, 1), "voz_dbfs": round(voz, 1),
            "snr_db": round(voz - ruido, 1), "zumbido_60": round(hum60, 1), "zumbido_50": round(hum50, 1),
            "sibilancia_db": round(sib, 1), "amostras_clipadas": clip, "duracao_s": round(len(x) / SR, 1)}


def diagnostico(m):
    achados, pontos = [], 0
    if m["snr_db"] < 25:
        achados.append(f"ruído de fundo alto (a voz fica só {m['snr_db']:.0f} dB acima do ruído; bom é 35+)"); pontos += 2
    elif m["snr_db"] < 35:
        achados.append(f"ruído de fundo perceptível (voz {m['snr_db']:.0f} dB acima do ruído)"); pontos += 1
    zum = max(m["zumbido_60"], m["zumbido_50"])
    rede = 60 if m["zumbido_60"] >= m["zumbido_50"] else 50
    if zum > 12:
        achados.append(f"zumbido de tomada em {rede} Hz"); pontos += 1
    if m["sibilancia_db"] > -14:
        achados.append("chiado forte nos \"s\" e \"x\""); pontos += 1
    if m["amostras_clipadas"] > 20:
        achados.append(f"clipagem (o som estourou em {m['amostras_clipadas']} pontos)"); pontos += 1
    if m["lra"] > 12:
        achados.append(f"volume variando muito entre frases ({m['lra']:.0f} LU)"); pontos += 1
    if m["lufs"] < -22:
        achados.append(f"volume geral baixo ({m['lufs']:.0f} LUFS)")
    nivel = "leve" if pontos <= 1 else "medio" if pontos <= 3 else "forte"
    # decisão (pedido do Euriler, 07/10): problema claro → trata sozinho; dá para melhorar → pergunta; limpo → padrão
    claro = m["snr_db"] < 25 or zum > 12 or m["amostras_clipadas"] > 20 or pontos >= 2
    decisao = "tratar" if claro else "perguntar" if (pontos == 1 or m["snr_db"] < 35) else "limpo"
    return achados, nivel, rede, zum > 12, decisao


# quanto o isolador pode tirar de ruído, por nível (dB): leve mantém o ar da sala, forte tira tudo que não é voz
ATENUA = {"leve": 20, "medio": 40, "forte": 100}


def base(m, rede, tem_zum):
    """antes do isolador: passa-alta, zumbido de tomada e estalo de clipagem"""
    f = ["highpass=f=70"]
    if tem_zum:
        f += [f"bandreject=f={rede * k}:width_type=q:w=12" for k in (1, 2, 3)]
    if m["amostras_clipadas"] > 20:
        f.append("adeclip")
    return f


def cadeia(m, nivel, isolada=False):
    """depois da base (e do isolador, se houve): o polimento da voz"""
    achados, auto, rede, tem_zum, _ = diagnostico(m)
    if nivel == "auto":
        nivel = auto
    f = ["lowpass=f=16000"]
    if not isolada:
        # sem isolador: redução de ruído do ffmpeg e portão suave nas pausas (o caminho antigo)
        nr = {"leve": 6, "medio": 12, "forte": 18}[nivel]
        nf = max(-80, min(-25, m["ruido_dbfs"] + 3))
        f.append(f"afftdn=nr={nr}:nf={nf:.0f}:tn=1")
        limiar = 10 ** ((m["ruido_dbfs"] + 12) / 20)
        faixa = {"leve": 0.32, "medio": 0.2, "forte": 0.125}[nivel]
        f.append(f"agate=threshold={limiar:.5f}:ratio=2:range={faixa}:attack=10:release=250")
    # voz de estúdio: tira o embolado dos graves, dá presença e um pouco de brilho (mais a cada nível)
    k = {"leve": 0.6, "medio": 1.0, "forte": 1.2}[nivel]
    f += [f"equalizer=f=280:t=q:w=1.2:g={-2 * k:.1f}", f"equalizer=f=3200:t=q:w=1.0:g={1.8 * k:.1f}",
          f"treble=g={1.5 * k:.1f}:f=10000"]
    if m["sibilancia_db"] > -14 or nivel == "forte":
        f.append("deesser=i=0.4:m=0.5:f=0.5")
    f.append({"leve": "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=150:makeup=1",
              "medio": "acompressor=threshold=-22dB:ratio=3:attack=6:release=130:makeup=1",
              "forte": "acompressor=threshold=-24dB:ratio=3.5:attack=5:release=110:makeup=1"}[nivel])
    f.append("loudnorm=I=-15:TP=-1.5:LRA=9")
    f.append("alimiter=limit=0.89")
    return ",".join(f), nivel, achados


DECISAO = {"tratar": "tratar: o áudio tem problema claro; trate sem perguntar (\"tratar_audio\": \"auto\") e conte na entrega",
           "perguntar": "perguntar: dá para melhorar; pergunte se a pessoa quer tratar o áudio (isolar a voz, tirar ruído, melhorar a voz), recomendando que sim",
           "limpo": "limpo: o tratamento padrão do corte já basta (trate só se a pessoa pedir)"}


def explicar(m):
    achados, nivel, _, _, decisao = diagnostico(m)
    print(f"volume {m['lufs']:.1f} LUFS · pico {m['pico_dbfs']:.1f} dBFS · ruído de fundo {m['ruido_dbfs']:.0f} dBFS · "
          f"voz {m['snr_db']:.0f} dB acima do ruído · variação {m['lra']:.0f} LU")
    if achados:
        print("o que ouvi: " + "; ".join(achados))
    else:
        print("o que ouvi: áudio limpo, só precisa do tratamento padrão")
    print(f"recomendação: nível {nivel}")
    print("decisão: " + DECISAO[decisao])
    return nivel


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    modo = sys.argv[1]
    if modo == "analisar":
        m = medir(sys.argv[2])
        explicar(m)
        print(json.dumps(m, ensure_ascii=False))
    elif modo == "aplicar":
        ent, sai = sys.argv[2], Path(sys.argv[3])
        nivel = sys.argv[sys.argv.index("--nivel") + 1] if "--nivel" in sys.argv else "auto"
        antes = medir(ent)
        ref = medir(sys.argv[sys.argv.index("--medir") + 1]) if "--medir" in sys.argv else antes
        achados, auto, rede, tem_zum, _ = diagnostico(ref)
        nv = auto if nivel == "auto" else nivel
        import tempfile
        tmp = Path(tempfile.mkdtemp(prefix="tratar_audio_"))
        limpo = tmp / "base.wav"
        sh(["ffmpeg", "-v", "error", "-y", "-i", ent, "-vn", "-af", ",".join(base(ref, rede, tem_zum)), "-ar", "48000", "-ac", "1", limpo])
        isolador = None if "--sem-isolar" in sys.argv else pf.isolador_de_voz()
        isolada = False
        if isolador:
            r = subprocess.run([str(isolador), "-D", "-a", str(ATENUA[nv]), *(["--pf"] if nv == "forte" else []), "-o", str(tmp / "iso"), str(limpo)],
                               capture_output=True, text=True, **pf.UTF8)
            if r.returncode == 0 and (tmp / "iso" / "base.wav").is_file():
                limpo, isolada = tmp / "iso" / "base.wav", True
            else:
                print(f"isolador de voz falhou ({(r.stderr or '').strip()[-200:]}); sigo com os filtros do ffmpeg")
        filtro, nivel, achados = cadeia(ref, nv, isolada)
        # o isolador come ~30 ms da cauda: completa com silêncio para a voz ter a mesma duração da entrada (sincronia)
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ent)],
                                   capture_output=True, text=True, **pf.UTF8).stdout.strip() or 0)
        # (o loudnorm também come o fim do quadro dele, então o silêncio entra numa segunda passada, sem filtro)
        pronto = tmp / "pronto.wav"
        sh(["ffmpeg", "-v", "error", "-y", "-i", limpo, "-af", filtro, "-ar", "48000", "-ac", "2", pronto])
        sh(["ffmpeg", "-v", "error", "-y", "-i", pronto, *(["-af", "apad=pad_dur=1", "-t", f"{dur:.3f}"] if dur else []), sai])
        depois = medir(sai)
        import shutil as _sh
        _sh.rmtree(tmp, ignore_errors=True)
        rel = (f"nível: {nivel}\nisolador de voz (DeepFilterNet): {'sim, até ' + str(ATENUA[nivel]) + ' dB' if isolada else 'não'}\n"
               f"achados: {'; '.join(achados) or 'nenhum'}\nfiltro: {filtro}\n"
               f"antes:  {json.dumps(antes, ensure_ascii=False)}\ndepois: {json.dumps(depois, ensure_ascii=False)}\n")
        Path(str(sai) + ".relatorio.txt").write_text(rel, encoding="utf-8")
        print(f"tratado (nível {nivel}{', voz isolada com IA' if isolada else ''}): ruído {antes['ruido_dbfs']:.0f} → {depois['ruido_dbfs']:.0f} dBFS, "
              f"voz/ruído {antes['snr_db']:.0f} → {depois['snr_db']:.0f} dB, volume {antes['lufs']:.1f} → {depois['lufs']:.1f} LUFS")
        print("ouça o resultado: se a voz ficou abafada ou metálica, desça um nível")
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
