#!/usr/bin/env python3
"""Legenda atrás (estilo 19): recorta a pessoa do vídeo uma vez só e mede onde cabe o texto na parede.

Uso: python3 mascara_pessoa.py <pasta_do_trabalho> [--modelo resnet50|mobilenetv3] [--escala 0.5] [--margem 0.05]
     (rode depois do cortar.py, e de novo sempre que rodar o cortar.py)

Não troca o fundo nem recorta a pessoa para fora do vídeo: o recorte (RobustVideoMatting) vira só a máscara
que esconde o texto onde a pessoa está. O motor desenha a palavra na parede e aplica a máscara, que é a conta
do guia: saída = quadro + (texto - quadro) × alfa_texto × (1 - alfa_pessoa). O fundo é o original, então fio
de cabelo mal recortado só deixa passar parede de verdade por cima da letra (sem halo).

Gera:
  app/public/mascara/q_00001.png ...  um PNG por quadro do media/full.mp4 (30 fps): transparente onde a pessoa
                                      está, opaco na parede. É a máscara salva: ajustar texto, cor e animação
                                      não pede recorte de novo (o recorte é a parte cara).
  app/src/atras.json                  topo da cabeça e centro da cabeça por quadro (px do vídeo), luz da parede,
                                      cor do texto sugerida, se cabe texto acima da cabeça e as trocas de nome
                                      próprio do glossário da casa.
Sem espaço acima da cabeça (enquadramento colado no topo), grava "cabe": false e avisa: o motor cai para a
legenda padrão em vez de forçar. Nunca desça nem encolha a pessoa para abrir espaço.

Roda no processador (sem placa de vídeo): a escala 0.5 recorta em 540x960 e o navegador amplia a máscara.
O ambiente Python da skill ganha o torch na primeira vez (versão de processador fora do Mac).
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

SKILL = Path(__file__).resolve().parent.parent
# erros de nome próprio que o Whisper já cometeu na casa (o glossário do squad soma os dele)
TROCAS_CASA = {"arkane": "Arcane", "arkeime": "Arcane", "arquem": "Arcane", "auroc": "Auroq"}
# palavras que costumam ser nome próprio mal ouvido: só avisa (pode ser a palavra mesmo)
SUSPEITAS = {"cloud": "Claude?", "cloud's": "Claude?", "arcanjo": "Arcane?", "euriller": "Euriler?", "eurile": "Euriler?"}


def garantir_torch():
    # o recorte (RobustVideoMatting pelo torch.hub) precisa do torch E do torchvision: Python com só o torch quebrava
    if pf.tem_modulo("torch") and pf.tem_modulo("torchvision"):
        return
    if not pf.no_venv():
        pf.criar_venv()
        pf.rodar_no_venv()
    print("instalando o torch no ambiente da skill (uma vez só)...", flush=True)
    extra = [] if pf.MAC or shutil.which("nvidia-smi") else ["--index-url", "https://download.pytorch.org/whl/cpu"]
    if not pf.pip_instalar("torch", "torchvision", *extra) or not pf.pip_instalar("pillow"):
        sys.exit("não consegui instalar o torch: rode de novo com internet")


def glossario():
    """trocas errado -> certo do glossário do squad de edição (nomes-proprios.yaml), sem depender de yaml"""
    trocas = dict(TROCAS_CASA)
    for base in [SKILL, *SKILL.parents]:
        y = base / "squads/squad-edicao-arcane/data/nomes-proprios.yaml"
        if y.is_file():
            errado = None
            for linha in y.read_text(encoding="utf-8").splitlines():
                m = re.match(r'\s*-?\s*(errado|correto):\s*"([^"]+)"', linha)
                if not m:
                    continue
                if m[1] == "errado":
                    errado = m[2].strip()
                elif errado and " " not in errado:
                    trocas[errado.lower()] = m[2].strip()
                    errado = None
            break
    return trocas


def mediana_movel(v, janela):
    import numpy as np
    a = np.asarray(v, dtype=float)
    h = janela // 2
    p = np.pad(a, h, mode="edge")
    return [float(np.median(p[i:i + janela])) for i in range(len(a))]


def medir(p, escala, lar_cabeca):
    """topo da cabeça (px do vídeo) e centro dela. Linha com cabeça = pessoa em mais de 12% da largura (mão levantada
    acima da cabeça, separada dela, não conta: a mão passa na frente do texto, e tudo bem); dali sobe pelos cachos."""
    import numpy as np
    h, w = p.shape
    por_linha = (p > 0.5).sum(1)
    linhas = np.nonzero(por_linha > lar_cabeca)[0]
    tp = int(linhas[0]) if len(linhas) else h
    # cabelo cacheado: sobe pelos cachos (linhas com um pouco de pessoa, sem buraco) até o fio de cima
    while tp > 0 and por_linha[tp - 1] > max(2, lar_cabeca // 6):
        tp -= 1
    faixa = p[tp:min(h, tp + int(0.12 * h))] > 0.5
    xs = np.nonzero(faixa)[1]
    return tp, tp / escala, (float(xs.mean()) if len(xs) else w / 2) / escala


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("trabalho")
    ap.add_argument("--modelo", default="resnet50", choices=["resnet50", "mobilenetv3"],
                    help="resnet50 recorta melhor o cabelo; mobilenetv3 é mais leve e mais rápido")
    ap.add_argument("--escala", type=float, default=0.5, help="resolução da máscara em relação ao vídeo (1 = cheia)")
    ap.add_argument("--margem", type=float, default=0.05, help="faixa do topo da tela que o texto não usa (fração da altura)")
    ap.add_argument("--so-medir", action="store_true", help="não recorta de novo: remede topo, centro e parede pelos PNGs já salvos")
    a = ap.parse_args()
    pf.exigir_modulo("numpy")
    garantir_torch()
    os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")  # Mac: operação que a placa não tem roda no processador
    import numpy as np
    import torch
    from PIL import Image

    trab = Path(a.trabalho)
    app = trab / "app"
    video = app / "public/media/full.mp4"
    if not video.is_file():
        sys.exit(f"não achei {video}: rode antes o cortar.py")
    st = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries",
                                    "stream=width,height,nb_read_packets", "-of", "json", str(video)],
                                   capture_output=True, text=True, **pf.UTF8).stdout)["streams"][0]
    W, H, N = st["width"], st["height"], int(st["nb_read_packets"])
    w, h = int(round(W * a.escala / 2) * 2), int(round(H * a.escala / 2) * 2)
    pasta = app / "public/mascara"
    if a.so_medir:
        if not (pasta / "q_00001.png").is_file():
            sys.exit("--so-medir precisa da máscara já salva em app/public/mascara (rode sem ele uma vez)")
        w, h = Image.open(pasta / "q_00001.png").size  # a escala é a da máscara salva
        a.escala = w / W
    else:
        if pasta.exists():
            shutil.rmtree(pasta)
        pasta.mkdir(parents=True)

    topo, centro, luz = [], [], []
    marg = int(a.margem * h)
    lar_cabeca = int(0.12 * w)

    def anota(q, p, n):
        tp, topo_px, cx = medir(p, a.escala, lar_cabeca)
        topo.append(topo_px)
        centro.append(cx)
        if n % 10 == 1 and tp > marg + 4:  # luz da parede onde o texto mora: entre a margem e o topo da cabeça
            zona, viz = q[marg:tp].astype(np.float32) / 255, p[marg:tp] < 0.1
            if viz.sum() > 500:
                lum = 0.2126 * zona[..., 0] + 0.7152 * zona[..., 1] + 0.0722 * zona[..., 2]
                luz.append(float(np.median(lum[viz])))

    dec = subprocess.Popen([*pf.comando("ffmpeg"), "-v", "error", "-i", str(video), "-vf", f"scale={w}:{h}:flags=area",
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    n, t0 = 0, time.time()
    if a.so_medir:
        while True:
            buf = dec.stdout.read(w * h * 3)
            if len(buf) < w * h * 3 or not (pasta / f"q_{n + 1:05d}.png").is_file():
                break
            n += 1
            p = 1 - np.asarray(Image.open(pasta / f"q_{n:05d}.png").split()[-1], np.float32) / 255
            anota(np.frombuffer(buf, np.uint8).reshape(h, w, 3), p, n)
        modelo = json.loads((app / "src/atras.json").read_text(encoding="utf-8")).get("modelo", a.modelo) if (app / "src/atras.json").is_file() else a.modelo
    else:
        torch.set_num_threads(os.cpu_count() or 4)
        dev = "cuda" if torch.cuda.is_available() else "mps" if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available() else "cpu"
        print(f"recortando a pessoa ({a.modelo}, {dev}, máscara {w}x{h}, {N} quadros)...", flush=True)
        rvm = torch.hub.load("PeterL1n/RobustVideoMatting", a.modelo, trust_repo=True, verbose=False).to(dev).eval()
        ds = min(1.0, 512 / max(w, h))  # o miolo do RVM enxerga ~512 px no lado maior; o refinador devolve na resolução da máscara
        rec = [None] * 4
        branco = np.full((h, w), 255, np.uint8)
        modelo = a.modelo
        with torch.no_grad():
            while True:
                buf = dec.stdout.read(w * h * 3)
                if len(buf) < w * h * 3:
                    break
                q = np.frombuffer(buf, np.uint8).reshape(h, w, 3)
                x = torch.from_numpy(q.copy()).permute(2, 0, 1).float().div(255).unsqueeze(0).to(dev)
                _, pha, *rec = rvm(x, *rec, downsample_ratio=ds)
                p = pha[0, 0].clamp(0, 1).cpu().numpy()
                n += 1
                Image.fromarray(np.dstack([branco, ((1 - p) * 255 + 0.5).astype(np.uint8)]), "LA").save(pasta / f"q_{n:05d}.png", compress_level=3)
                anota(q, p, n)
                if n % 60 == 0:
                    print(f"  {n}/{N} quadros ({(time.time() - t0) / n:.2f} s por quadro)", flush=True)
    dec.stdout.close()
    dec.wait()
    gasto = time.time() - t0
    if a.so_medir:
        anterior = json.loads((app / "src/atras.json").read_text(encoding="utf-8")) if (app / "src/atras.json").is_file() else {}
        gasto = anterior.get("segundos_recorte", 0)

    topo_s = [int(round(v)) for v in mediana_movel(topo, 15)]
    centro_s = [int(round(v)) for v in mediana_movel(centro, 9)]
    topo_med = float(np.median(topo_s))
    espaco = topo_med - a.margem * H
    # sem pessoa no quadro (gravação de tela, vídeo sem rosto): o "topo da cabeça" fica no pé da tela e o texto ia
    # para a borda de baixo, cortado
    sem_pessoa = topo_med >= 0.97 * H
    cabe = espaco >= 0.075 * H and not sem_pessoa
    lum = float(np.median(luz)) if luz else 0.5
    aviso = "" if cabe else ("não achei pessoa no vídeo: a legenda atrás precisa de alguém na frente da parede e o motor cai "
                             "para a legenda padrão") if sem_pessoa else (f"sem espaço acima da cabeça (topo da cabeça em {topo_med:.0f}px de {H}, sobra {max(0, espaco):.0f}px): "
                             "a legenda atrás não serve para este vídeo e o motor cai para a legenda padrão")

    trocas, suspeitas = glossario(), []
    dados = json.loads((app / "src/data.json").read_text(encoding="utf-8"))
    for pw in dados.get("palavras", []):
        k = re.sub(r"[.,!?;:\"“”]", "", pw["w"]).lower()
        if k in SUSPEITAS:
            suspeitas.append(f"{pw['w']} em {pw['t0']:.1f}s ({SUSPEITAS[k]})")
    usadas = {k: v for k, v in trocas.items()
              if any(re.sub(r"[.,!?;:\"“”]", "", pw["w"]).lower() == k for pw in dados.get("palavras", []))}

    saida = {
        "versao": 1, "video": "media/full.mp4", "largura": W, "altura": H, "quadros": n, "fps": 30, "escala": a.escala,
        "modelo": modelo, "segundos_recorte": round(gasto, 1), "margem": a.margem,
        "topo_mediana": round(topo_med), "cabe": bool(cabe), "aviso": aviso,
        "parede": {"luz": round(lum, 3), "cor_texto": "#0E1116" if lum > 0.55 else "#FFFFFF"},
        "trocas": usadas, "topo": topo_s, "centro": centro_s,
    }
    (app / "src/atras.json").write_text(json.dumps(saida, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    dur = n / 30
    if a.so_medir:
        print(f"medidas refeitas pelos {n} quadros salvos em {pasta} (sem recortar de novo)")
    else:
        print(f"máscara pronta: {n} quadros em {pasta} ({gasto:.0f} s de recorte, {gasto / max(dur, 0.1):.1f} s por segundo de vídeo)")
    print(f"topo da cabeça ~{topo_med:.0f}px, parede {'clara' if lum > 0.55 else 'escura'} (luz {lum:.2f}) -> texto {saida['parede']['cor_texto']}")
    if n != N:
        print(f"AVISO: o vídeo tem {N} quadros e a máscara {n}")
    if aviso:
        print("AVISO: " + aviso)
    if usadas:
        print("nomes próprios corrigidos na legenda atrás: " + ", ".join(f"{k} -> {v}" for k, v in usadas.items())
              + " (ponha também em 'trocas' do roteiro.json para as outras legendas)")
    if suspeitas:
        print("CONFIRA (pode ser nome próprio mal ouvido; corrija em 'trocas' do roteiro.json): " + "; ".join(suspeitas))


if __name__ == "__main__":
    main()
