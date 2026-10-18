#!/usr/bin/env python3
"""
glowup.py — retoque de pele e maquiagem digital para vídeo (local, grátis, roda no Mac, no Windows e no Linux).

Três níveis (--nivel):
  leve   pele mais lisa e uniforme, leve brilho, toque de cor na bochecha e no lábio.
  medio  "acordei e gravei": pele mais uniforme (com textura), olheira disfarçada,
         viço, cor de boa noite de sono nas bochechas, lábio um pouco mais vivo,
         branco dos olhos mais limpo. Ninguém deve perceber que é filtro.
  alto   maquiagem de verdade: base, corretivo, blush definido, iluminador, batom
         (rosado/nude rosado ou --batom "#hex"), sombra degradê, delineado fino
         esfumado, cílios mais escuros e sobrancelha preenchida.

Como funciona, quadro a quadro:
  1. Acha o rosto (MediaPipe Face Landmarker, 478 pontos) e suaviza os pontos no
     tempo (filtro One Euro) para nada tremer.
  2. Máscara de PELE: classe "face-skin" do segmentador MediaPipe num recorte do
     rosto, limitada ao contorno do rosto, menos olhos, sobrancelhas, boca e narinas.
     Cada "produto" (blush, batom, sombra...) tem a sua máscara, desenhada pelos
     478 pontos, com bordas suaves.
  3. Pele: alisa com filtro guiado e devolve o detalhe fino (poros), uniformiza o tom
     em Lab, dá luminosidade. Maquiagem: camadas em Lab e multiplicação (como
     produto de verdade: escurece/colore sem apagar a textura).
  4. Fora das máscaras os pixels são copiados do original (o resto não muda).
  5. Áudio copiado sem recodificar.

Uso:
  ~/.cache/edicao-euriliana/venv/bin/python glowup.py entrada.mp4 saida.mp4 \
      [--nivel leve|medio|alto] [--intensidade 0.6] [--batom "#B96A66"] [--sombra marrom|rosado] \
      [--sem-blush] [--inicio 10 --duracao 6] [--mascara debug.mp4]
  (no Windows o Python do ambiente é ~/.cache/edicao-euriliana/venv/Scripts/python.exe)

  --intensidade é o ajuste fino dentro do nível: 0.6 é o padrão de cada nível;
  0.3 = metade, 1.0 = ~1,7x (limitado para não passar do ponto).

Requisitos (venv da skill): numpy, opencv-python-headless<5 e mediapipe==0.10.35
  (pip install --no-deps mediapipe==0.10.35 e depois, com dependências, pip install absl-py~=2.3 flatbuffers~=25.9
  matplotlib sounddevice~=0.5 certifi; o cortar.py faz os dois).
  NÃO usar mediapipe 1.0.x: o detector de rosto trava no Mac (bug #6356). O --no-deps evita
  que ele puxe opencv-contrib 5.x por cima do opencv-headless 4.x da skill.
Modelos (baixados sozinhos na 1a vez) em ~/.cache/edicao-euriliana/modelos/.
"""
import argparse
import json
import os
import subprocess
import sys
import time
import urllib.request

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import plataforma  # noqa: E402,F401  (saída em UTF-8 e ffmpeg no PATH, no Windows também)

os.environ.setdefault("GLOG_minloglevel", "2")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")

import mediapipe as mp  # noqa: E402
from mediapipe.tasks.python import vision  # noqa: E402
from mediapipe.tasks.python.core import base_options as mp_base  # noqa: E402

MODELOS_DIR = os.path.expanduser("~/.cache/edicao-euriliana/modelos")
MODELOS = {
    "face_landmarker.task": "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    "selfie_multiclass_256x256.tflite": "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
}

# ----------------------------------------------------------------------------- malha facial
FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377,
             152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
OLHO_E = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466]
OLHO_D = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
SOBR_E = [276, 283, 282, 295, 285, 336, 296, 334, 293, 300]
SOBR_D = [46, 53, 52, 65, 55, 107, 66, 105, 63, 70]
LABIOS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185]
BOCA_DENTRO = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191]
NARINAS = [(79, 166, 75, 60, 20, 238, 239), (309, 392, 305, 290, 250, 458, 459)]
BOCHECHAS = [50, 280]  # centro aproximado das maçãs do rosto
DORSO_NARIZ = [168, 6, 197, 195, 5]

# anéis em volta de cada olho, sempre do canto de FORA para o de DENTRO
OLHOS = {
    "D": dict(up0=[33, 246, 161, 160, 159, 158, 157, 173, 133], up1=[130, 247, 30, 29, 27, 28, 56, 190, 243],
              up2=[226, 113, 225, 224, 223, 222, 221, 189, 244], lo0=[33, 7, 163, 144, 145, 153, 154, 155, 133],
              lo1=[130, 25, 110, 24, 23, 22, 26, 112, 243], lo2=[226, 31, 228, 229, 230, 231, 232, 233, 244],
              lo3=[143, 111, 117, 118, 119, 120, 121, 128, 245], sobr=SOBR_D, maca=50, tempora=127,
              osso=(117, 118, 143)),
    "E": dict(up0=[263, 466, 388, 387, 386, 385, 384, 398, 362], up1=[359, 467, 260, 259, 257, 258, 286, 414, 463],
              up2=[446, 342, 445, 444, 443, 442, 441, 413, 464], lo0=[263, 249, 390, 373, 374, 380, 381, 382, 362],
              lo1=[359, 255, 339, 254, 253, 252, 256, 341, 463], lo2=[446, 261, 448, 449, 450, 451, 452, 453, 464],
              lo3=[372, 340, 346, 347, 348, 349, 350, 357, 465], sobr=SOBR_E, maca=280, tempora=356,
              osso=(346, 347, 372)),
}
IRIS = [(468, [469, 470, 471, 472]), (473, [474, 475, 476, 477])]

# ----------------------------------------------------------------------------- níveis
# valores calibrados para --intensidade 0.6 (no leve, k = a própria intensidade, como na v1)
NIVEIS = {
    "leve": dict(k=None, blush_a=4.0, blush_b=1.0, blush_l=0.6, boch_r=0.10, lip_on=True, lip_sat_a=0.16,
                 lip_a=1.5, lip_sat_b=0.06, glow=0.045, warm=0.6, bloom=0.06, base=0.0,
                 olheira=0.0, esclera=0.0, blush_def=0.0, ilum=0.0, batom=0.0, sombra=0.0, liner=0.0,
                 cilios=0.0, sobr=0.0),
    "medio": dict(k=0.75, blush_a=6.0, blush_b=0.4, blush_l=0.8, boch_r=0.12, lip_on=True, lip_sat_a=0.30,
                  lip_a=3.0, lip_sat_b=0.04, glow=0.07, warm=1.0, bloom=0.09, base=0.0,
                  olheira=0.65, esclera=0.5, blush_def=0.0, ilum=0.0, batom=0.0, sombra=0.0, liner=0.0,
                  cilios=0.0, sobr=0.0),
    "alto": dict(k=0.85, blush_a=0.0, blush_b=0.0, blush_l=0.0, boch_r=0.10, lip_on=False, lip_sat_a=0.0,
                 lip_a=0.0, lip_sat_b=0.0, glow=0.055, warm=0.8, bloom=0.07, base=0.15,
                 olheira=0.9, esclera=0.4, blush_def=1.0, ilum=1.0, batom=1.0, sombra=1.0, liner=1.0,
                 cilios=1.0, sobr=1.0),
}
BATOM_PADRAO = "#B96A66"   # nude rosado
SOMBRAS = {"marrom": (0.80, 0.66, 0.58), "rosado": (0.86, 0.64, 0.62)}  # multiplicador RGB


# ----------------------------------------------------------------------------- util

def garantir_modelos():
    os.makedirs(MODELOS_DIR, exist_ok=True)
    for nome, url in MODELOS.items():
        p = os.path.join(MODELOS_DIR, nome)
        if not os.path.exists(p):
            print(f"baixando modelo {nome}...", file=sys.stderr)
            urllib.request.urlretrieve(url, p)
    return {k: os.path.join(MODELOS_DIR, k) for k in MODELOS}


def _opcoes_modelo(caminho):
    """caminho com acento (C:\\Users\\João\\...) quebra o MediaPipe no Windows: aí o modelo vai pela memória"""
    if caminho.isascii():
        return mp_base.BaseOptions(model_asset_path=caminho, delegate=mp_base.BaseOptions.Delegate.CPU)
    with open(caminho, "rb") as f:
        return mp_base.BaseOptions(model_asset_buffer=f.read(), delegate=mp_base.BaseOptions.Delegate.CPU)


def sondar(caminho):
    out = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams",
                          "-show_format", caminho], capture_output=True, text=True, encoding="utf-8", errors="replace",
                         check=True).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    tem_audio = any(s["codec_type"] == "audio" for s in info["streams"])
    w, h = int(v["width"]), int(v["height"])
    rot = 0
    for sd in v.get("side_data_list", []) or []:
        if "rotation" in sd:
            rot = int(float(sd["rotation"]))
    if abs(rot) in (90, 270):
        w, h = h, w
    fr = v.get("avg_frame_rate") or v.get("r_frame_rate")
    if not fr or fr == "0/0":
        fr = v.get("r_frame_rate", "30/1")
    return w, h, fr, tem_audio, float(info["format"].get("duration", 0))


def hex_lab(hexcor):
    h = hexcor.lstrip("#")
    rgb = np.array([[[int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16)]]], np.float32) / 255.0  # BGR
    return cv2.cvtColor(rgb, cv2.COLOR_BGR2LAB)[0, 0]


def guided_self(I, r, eps):
    """Filtro guiado com a própria imagem como guia (por canal). I float32 [0,1]."""
    k = (2 * r + 1, 2 * r + 1)
    mean_I = cv2.boxFilter(I, -1, k)
    mean_II = cv2.boxFilter(I * I, -1, k)
    var_I = mean_II - mean_I * mean_I
    a = var_I / (var_I + eps)
    b = mean_I - a * mean_I
    return cv2.boxFilter(a, -1, k) * I + cv2.boxFilter(b, -1, k)


class OneEuro:
    """Filtro One Euro vetorizado (suaviza tremedeira sem atrasar movimento rápido)."""

    def __init__(self, fps, min_cutoff=1.2, beta=0.04, d_cutoff=1.0):
        self.dt = 1.0 / fps
        self.min_cutoff, self.beta, self.d_cutoff = min_cutoff, beta, d_cutoff
        self.x = None
        self.dx = None

    @staticmethod
    def _alpha(cutoff, dt):
        tau = 1.0 / (2 * np.pi * cutoff)
        return 1.0 / (1.0 + tau / dt)

    def __call__(self, x):
        if self.x is None or self.x.shape != x.shape:
            self.x, self.dx = x.copy(), np.zeros_like(x)
            return x
        dx = (x - self.x) / self.dt
        a_d = self._alpha(self.d_cutoff, self.dt)
        self.dx = a_d * dx + (1 - a_d) * self.dx
        cutoff = self.min_cutoff + self.beta * np.abs(self.dx)
        a = self._alpha(cutoff, self.dt)
        self.x = a * x + (1 - a) * self.x
        return self.x


def poly(mask, pts, idx, val=1.0):
    cv2.fillPoly(mask, [np.round(pts[idx]).astype(np.int32)], val, lineType=cv2.LINE_AA)


def poly_sub(mask, pts, idx, val=1.0):
    """Como poly, mas com precisão de 1/4 de pixel (contorno não 'pula' de um quadro para o outro)."""
    poly_xy(mask, pts[idx], val)


def poly_xy(mask, xy, val=1.0):
    cv2.fillPoly(mask, [np.round(np.asarray(xy) * 4).astype(np.int32)], val, lineType=cv2.LINE_AA, shift=2)


def feather(m, sigma):
    """Desfoque gaussiano; para sigma grande, faz em resolução menor (mesmo resultado visual, bem mais rápido)."""
    if sigma <= 0.3:
        return m
    if sigma < 4:
        return cv2.GaussianBlur(m, (0, 0), sigma)
    f = sigma / 2.0
    h, w = m.shape[:2]
    pw, ph = max(4, int(round(w / f))), max(4, int(round(h / f)))
    small = cv2.resize(m, (pw, ph), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), sigma * pw / w)
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_LINEAR)


def dilatar(m, d):
    """Engorda a máscara em ~d px (feito em 1/4 da resolução)."""
    if d < 2:
        return m
    h, w = m.shape[:2]
    s = 4 if d >= 8 else 1
    small = cv2.resize(m, (max(2, w // s), max(2, h // s)), interpolation=cv2.INTER_AREA) if s > 1 else m
    k = int(d / s) | 1
    small = cv2.dilate(small, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_LINEAR) if s > 1 else small


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def faixa(curva, cima, esp_dentro, esp_fora, base=0.0, extra=0.0):
    """Polígono de uma faixa ao longo de uma curva (canto de fora -> dentro).
    cima: vetor unitário 'para cima' (para fora do olho). Espessura varia de fora para dentro.
    base: quanto a faixa desce além da curva (fração da espessura). extra: prolonga o canto de fora."""
    c = np.asarray(curva, np.float32)
    n = len(c)
    u = np.linspace(1.0, 0.0, n)  # 1 no canto de fora
    esp = esp_dentro + (esp_fora - esp_dentro) * u
    # normal local, orientada para 'cima'
    tang = np.gradient(c, axis=0)
    nor = np.stack([-tang[:, 1], tang[:, 0]], 1)
    nor /= np.linalg.norm(nor, axis=1, keepdims=True) + 1e-6
    nor *= np.sign((nor @ cima)[:, None] + 1e-6)
    topo = c + nor * esp[:, None]
    fundo = c - nor * (esp * base)[:, None]
    pts_topo, pts_fundo = list(topo), list(fundo)
    if extra > 0:
        d = c[0] - c[1]
        d /= np.linalg.norm(d) + 1e-6
        ponta = c[0] + d * extra + cima * extra * 0.35
        return np.array([ponta] + pts_topo + pts_fundo[::-1], np.float32)
    return np.array(pts_topo + pts_fundo[::-1], np.float32)


# ----------------------------------------------------------------------------- núcleo

class Glowup:
    def __init__(self, fps, intensidade=0.6, blush=True, max_rostos=2, nivel="leve",
                 batom=BATOM_PADRAO, sombra="marrom"):
        mods = garantir_modelos()
        if nivel not in NIVEIS:
            raise ValueError(f"nível inválido: {nivel}")
        self.nivel = nivel
        self.intensidade = float(np.clip(intensidade, 0.0, 1.0))
        P = dict(NIVEIS[nivel])
        if nivel == "leve":
            P["k"] = self.intensidade
            self.s = 1.0
        else:
            self.s = float(np.clip(self.intensidade / 0.6, 0.0, 1.7))
            P["k"] = float(np.clip(P["k"] * self.s, 0.0, 1.0))
            for key in ("olheira", "esclera", "blush_def", "ilum", "batom", "sombra", "liner", "cilios",
                        "sobr", "base"):
                P[key] = P[key] * self.s
            for key in ("blush_a", "blush_b", "blush_l", "lip_sat_a", "lip_a", "lip_sat_b", "glow", "warm",
                        "bloom"):
                P[key] = P[key] * (0.5 + 0.5 * self.s)
        if not blush:
            P.update(blush_def=0.0, batom=0.0, lip_on=False)
        self.P = P
        self.k = P["k"]
        self.blush = blush
        self.batom_lab = hex_lab(batom)
        self.sombra_mult = np.array(SOMBRAS.get(sombra, SOMBRAS["marrom"])[::-1], np.float32)  # BGR
        self.fps = fps
        self.lm = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(
            base_options=_opcoes_modelo(mods["face_landmarker.task"]),
            running_mode=vision.RunningMode.VIDEO, num_faces=max_rostos,
            min_face_detection_confidence=0.5, min_face_presence_confidence=0.5,
            min_tracking_confidence=0.5))
        self.seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
            base_options=_opcoes_modelo(mods["selfie_multiclass_256x256.tflite"]),
            running_mode=vision.RunningMode.IMAGE, output_confidence_masks=True,
            output_category_mask=False))
        self.filtros = {}       # um One Euro por rosto (por ordem)
        self.prev_pts = {}
        self.mask_prev = {}     # máscaras do quadro anterior (as que têm média no tempo)
        self.ref_prev = {}      # cores de referência (lábio, sobrancelha) com média no tempo
        self.n = 0
        self.maq = any(P[k] > 0 for k in ("olheira", "esclera", "blush_def", "ilum", "batom", "sombra",
                                          "liner", "cilios", "sobr"))

    # -- máscaras de um rosto, no recorte
    def _mascaras_rosto(self, rgb, pts, box):
        x0, y0, x1, y1 = box
        p = pts - np.array([x0, y0], np.float32)
        hh, ww = y1 - y0, x1 - x0
        fw = float(np.linalg.norm(pts[454] - pts[234]))  # largura do rosto em px
        P = self.P
        Z = lambda: np.zeros((hh, ww), np.float32)  # noqa: E731
        M = {}

        # segmentador no recorte (só a classe face-skin)
        crop = np.ascontiguousarray(rgb[y0:y1, x0:x1])
        res = self.seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=crop))
        pele = res.confidence_masks[3].numpy_view().astype(np.float32)
        if pele.shape != (hh, ww):
            pele = cv2.resize(pele, (ww, hh), interpolation=cv2.INTER_LINEAR)
        pele = np.clip((pele - 0.15) / 0.7, 0, 1)  # endurece um pouco a confiança

        # região permitida: contorno do rosto dilatado (testa vai além da malha)
        oval = Z()
        poly(oval, p, FACE_OVAL)
        oval = dilatar(oval, fw * 0.16)
        oval = feather(oval, fw * 0.03)

        # exclusões: olhos (com cílios), sobrancelhas, boca, narinas
        excl = Z()
        for idx in (OLHO_E, OLHO_D, SOBR_E, SOBR_D, LABIOS):
            poly(excl, p, idx)
        for idx in NARINAS:
            poly(excl, p, list(idx))
        excl = dilatar(excl, fw * 0.045)
        excl = feather(excl, fw * 0.02)

        m_pele = feather(pele, fw * 0.012) * oval * (1 - excl)
        M["pele"] = m_pele

        # lábios (sem o interior da boca: dentes e língua ficam como estão)
        lab = Z()
        poly(lab, p, LABIOS)
        dentro = Z()
        poly(dentro, p, BOCA_DENTRO)
        dentro = cv2.dilate(dentro, np.ones((3, 3), np.uint8))
        M["lab"] = feather(np.clip(lab - dentro, 0, 1), fw * 0.01)
        if P["batom"] > 0:
            # o batom não confia só na malha (que às vezes escorrega quando a cabeça vira):
            # região um pouco maior que o lábio + cor de referência do lábio e da pele em volta;
            # dentro da região, pinta só o que tem cor de lábio
            dentro_d = dilatar(dentro, fw * 0.01) if fw * 0.01 >= 2 else dentro
            M["lab_regiao"] = feather(dilatar(lab, fw * 0.08), fw * 0.012)
            M["ref_dentro"] = feather(dentro_d, 1.0)
            nuc = cv2.erode(np.clip(lab - dentro_d, 0, 1), np.ones((3, 3), np.uint8), iterations=max(1, int(fw * 0.008)))
            M["ref_labnucleo"] = nuc
            anel = np.clip(dilatar(lab, fw * 0.14) - dilatar(lab, fw * 0.09), 0, 1)
            M["ref_bocapele"] = anel * (m_pele > 0.5)

        # bochechas: manchas suaves e redondas nas maçãs
        m_boch = Z()
        for i in BOCHECHAS:
            c = p[i] + (p[i] - p[1]) * 0.12  # um pouco para fora, longe do nariz
            cv2.circle(m_boch, (int(c[0]), int(c[1])), max(2, int(fw * P["boch_r"])), 1.0, -1, cv2.LINE_AA)
        M["boch"] = feather(m_boch, fw * 0.08) * m_pele

        if not self.maq:
            return M, fw

        olho_aberto = {}
        yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
        cima_face = p[10] - p[152]
        cima_face /= np.linalg.norm(cima_face) + 1e-6
        for lado, O in OLHOS.items():
            olho = Z()
            poly_xy(olho, list(p[O["up0"]]) + list(p[O["lo0"]][::-1]))
            olho_aberto[lado] = olho
            fora, dentro_c = p[O["up0"][0]], p[O["up0"][-1]]
            larg = float(np.linalg.norm(fora - dentro_c)) + 1e-6
            altura = float(np.linalg.norm(p[O["up0"][4]] - p[O["lo0"][4]]))
            abertura = smooth(altura / larg, 0.08, 0.2)  # 0 = olho fechado (piscada)

            # peso "canto de fora" (0 dentro -> 1 fora), para sombra e delineado
            eixo = (fora - dentro_c) / larg
            t = ((xx - dentro_c[0]) * eixo[0] + (yy - dentro_c[1]) * eixo[1]) / larg
            peso_fora = np.clip(t, 0, 1)

            olho_f = feather(dilatar(olho, 2) if fw * 0.01 >= 2 else cv2.dilate(olho, np.ones((3, 3), np.uint8)),
                             0.8)

            if P["olheira"] > 0:
                m = Z()
                poly_xy(m, list(p[O["lo1"]]) + list(p[O["lo3"]][::-1]), 0.55)
                m2 = Z()
                poly_xy(m2, list(p[O["lo0"]]) + list(p[O["lo2"]][::-1]), 1.0)
                m = np.maximum(m, m2)
                m = feather(m, fw * 0.03) * (1 - olho_f)
                m *= (1.0 - 0.35 * peso_fora)  # olheira pesa mais no canto de dentro
                M[f"olh_{lado}"] = m * np.clip(pele * 1.3, 0, 1)
                # referência de cor: pele da maçã logo abaixo
                ref = Z()
                desce = -cima_face * fw * 0.10
                poly_xy(ref, list(p[O["lo3"]][1:-2]) + list((p[O["lo3"]][1:-2] + desce)[::-1]))
                M[f"ref_{lado}"] = ref * m_pele

            if P["esclera"] > 0:
                esc = cv2.erode(olho, np.ones((3, 3), np.uint8))
                for c_i, anel in IRIS:
                    c = p[c_i]
                    if np.linalg.norm(c - (fora + dentro_c) / 2) < larg * 0.6:
                        r = float(np.mean([np.linalg.norm(p[j] - c) for j in anel]))
                        cv2.circle(esc, (int(round(c[0] * 4)), int(round(c[1] * 4))), int(r * 1.12 * 4), 0.0,
                                   -1, cv2.LINE_AA, shift=2)
                M[f"esc_{lado}"] = feather(esc, 0.7) * abertura

            if P["sombra"] > 0:
                s1 = Z()
                poly_xy(s1, list(p[O["up0"]]) + list(p[O["up1"]][::-1]), 1.0)
                s2 = Z()
                poly_xy(s2, list(p[O["up0"]]) + list(p[O["up2"]][::-1]), 0.5)
                s = feather(np.maximum(s1, s2), fw * 0.022)
                sob = Z()
                poly_sub(sob, p, O["sobr"])
                s *= (1 - feather(dilatar(sob, fw * 0.02), fw * 0.02)) * (1 - olho_f)
                M[f"sombra_{lado}"] = s * (0.55 + 0.45 * peso_fora)

            if P["liner"] > 0 or P["cilios"] > 0:
                curva = p[O["up0"]]
                liner = Z()
                poly_xy(liner, faixa(curva, cima_face, fw * 0.004, fw * 0.009, base=0.35, extra=fw * 0.028))
                smoky = Z()
                poly_xy(smoky, faixa(curva, cima_face, fw * 0.008, fw * 0.022, base=0.2, extra=fw * 0.04))
                M[f"liner_{lado}"] = np.maximum(feather(liner, max(0.6, fw * 0.004)),
                                                0.4 * feather(smoky, fw * 0.012))
                cil = Z()
                poly_xy(cil, faixa(curva, cima_face, fw * 0.012, fw * 0.022, base=0.0))
                cil_inf = Z()
                n_inf = len(O["lo0"])
                poly_xy(cil_inf, faixa(p[O["lo0"]][: n_inf // 2 + 1], -cima_face, fw * 0.003, fw * 0.006, base=0.3))
                M[f"cil_{lado}"] = np.maximum(feather(cil, fw * 0.006), 0.5 * feather(cil_inf, fw * 0.004))

            if P["sobr"] > 0:
                sob = Z()
                poly_sub(sob, p, O["sobr"])
                M[f"sobr_{lado}"] = feather(sob, fw * 0.010)

            if P["blush_def"] > 0:
                m = Z()
                maca = p[O["maca"]] + (p[O["maca"]] - p[1]) * 0.10
                temp = p[O["tempora"]]
                c = maca * 0.72 + temp * 0.28
                d = temp - maca
                ang = float(np.degrees(np.arctan2(d[1], d[0])))
                cv2.ellipse(m, (int(c[0]), int(c[1])), (int(fw * 0.15), int(fw * 0.075)), ang, 0, 360, 1.0, -1,
                            cv2.LINE_AA)
                M[f"bdef_{lado}"] = feather(m, fw * 0.06) * m_pele

            if P["ilum"] > 0:
                m = Z()
                c = np.mean([p[i] for i in O["osso"]], 0)
                temp = p[O["tempora"]]
                c = c * 0.75 + temp * 0.25 + cima_face * fw * 0.01
                d = temp - c
                ang = float(np.degrees(np.arctan2(d[1], d[0])))
                cv2.ellipse(m, (int(c[0]), int(c[1])), (int(fw * 0.09), int(fw * 0.03)), ang, 0, 360, 1.0, -1,
                            cv2.LINE_AA)
                M[f"ilum_{lado}"] = feather(m, fw * 0.03) * m_pele

        if P["ilum"] > 0:
            m = Z()
            cv2.polylines(m, [np.round(p[DORSO_NARIZ] * 4).astype(np.int32)], False, 1.0,
                          max(1, int(fw * 0.03)) * 4, cv2.LINE_AA, shift=2)
            M["ilum_nariz"] = feather(m, fw * 0.02) * m_pele * 0.8
        return M, fw

    # -- pele (a v1, parametrizada pelo nível)
    def _retocar(self, I, M, fw):
        P = self.P
        k = P["k"]
        m_pele, m_lab, m_boch = M["pele"], M["lab"], M["boch"]
        # 1) alisar mantendo contorno + devolver o poro
        r = max(2, int(round(fw / 24)))
        eps = (0.018 + 0.03 * k) ** 2
        S = guided_self(I, r, eps)
        s_fino = max(0.6, fw / 260)
        fino = I - cv2.GaussianBlur(I, (0, 0), s_fino)
        S_fino = S - cv2.GaussianBlur(S, (0, 0), s_fino)
        R = S + (fino - S_fino) * 0.75   # textura fina volta quase toda

        # 2) uniformizar tom em Lab
        lab = cv2.cvtColor(R, cv2.COLOR_BGR2LAB)
        L, A, B = cv2.split(lab)
        sig = fw / 10
        A_loc, B_loc, L_loc = cv2.split(feather(cv2.merge([A, B, L]), sig))
        dA = A - A_loc
        # vermelhidão (dA>0) é puxada mais forte que o resto
        A = A_loc + np.where(dA > 0, dA * (1 - 0.65 * k), dA * (1 - 0.35 * k))
        B = B_loc + (B - B_loc) * (1 - 0.35 * k)
        dL = L - L_loc
        # manchas escuras (olheira, mancha) clareiam; não achata o volume do rosto
        L = L_loc + np.where(dL < 0, dL * (1 - 0.30 * k), dL * (1 - P["base"]))

        # 3) glow: leve luminosidade nos meios-tons + calor discreto
        L = L + (100 - L) * (P["glow"] * k) * (L / 100) * 2
        B = B + P["warm"] * k

        # 4) bochechas
        if self.blush and P["blush_a"] > 0:
            A = A + m_boch * P["blush_a"] * k
            B = B + m_boch * P["blush_b"] * k
            L = L - m_boch * P["blush_l"] * k
        R = cv2.cvtColor(cv2.merge([L, A, B]), cv2.COLOR_LAB2BGR)

        # bloom suave (brilho de pele saudável) só no claro
        bl = feather(R, fw / 18)
        R = 1 - (1 - R) * (1 - bl * P["bloom"] * k)

        # lábios: um pouco mais de cor, sem virar batom
        lip = self.blush and P["lip_on"]
        if lip:
            lab2 = cv2.cvtColor(I, cv2.COLOR_BGR2LAB)
            L2, A2, B2 = cv2.split(lab2)
            A2 = A2 * (1 + P["lip_sat_a"] * k) + P["lip_a"] * k
            B2 = B2 * (1 + P["lip_sat_b"] * k)
            Rl = cv2.cvtColor(cv2.merge([L2, A2, B2]), cv2.COLOR_LAB2BGR)
        else:
            Rl = I

        peso = 0.55 + 0.45 * k          # quanto do retoque entra
        mp_ = (m_pele * peso)[..., None]
        ml = (m_lab * (1 - m_pele) * (0.9 if lip else 0))[..., None]
        out = I * (1 - mp_ - ml) + R * mp_ + Rl * ml
        return np.clip(out, 0, 1)

    def _ref(self, nome, valor, a=0.25):
        """Média no tempo de uma cor de referência (evita a cor 'pulsar')."""
        v = self.ref_prev.get(nome)
        v = valor if v is None else (a * valor + (1 - a) * v)
        self.ref_prev[nome] = v
        return v

    # -- maquiagem (médio e alto)
    def _maquiar(self, X, M, fw):
        P = self.P
        lab = cv2.cvtColor(X, cv2.COLOR_BGR2LAB)
        L, A, B = cv2.split(lab)
        Lb = Ab = Bb = None

        # corretivo / disfarce de olheira: puxa o tom (só a parte "lisa", sem tirar textura)
        # para a cor da pele da maçã logo abaixo; nunca clareia além dela
        if P["olheira"] > 0:
            Lb, Ab, Bb = cv2.split(feather(cv2.merge([L, A, B]), fw * 0.03))
            for lado in ("D", "E"):
                m, ref = M.get(f"olh_{lado}"), M.get(f"ref_{lado}")
                if m is None or ref is None or ref.sum() < 5:
                    continue
                w = ref / ref.sum()
                rL = self._ref(f"olhL{lado}", float((L * w).sum()))
                rA = self._ref(f"olhA{lado}", float((A * w).sum()))
                rB = self._ref(f"olhB{lado}", float((B * w).sum()))
                o = np.clip(m * P["olheira"], 0, 1)
                L += np.clip(rL - Lb, 0, 18) * o * 0.85
                A += (rA - Ab) * o * 0.6
                B += (rB - Bb) * o * 0.6

        # blush definido na maçã, puxando para a têmpora
        if P["blush_def"] > 0:
            for lado in ("D", "E"):
                m = M.get(f"bdef_{lado}")
                if m is None:
                    continue
                o = m * P["blush_def"]
                A += o * 9.0
                B += o * 1.5
                L -= o * 1.2

        # iluminador: alto da maçã e dorso do nariz (brilho acetinado, sem mancha branca)
        if P["ilum"] > 0:
            for nome in ("ilum_D", "ilum_E", "ilum_nariz"):
                m = M.get(nome)
                if m is None:
                    continue
                o = m * P["ilum"]
                L += (100 - L) * o * 0.14
                A -= A * o * 0.06
                B -= B * o * 0.10

        # branco dos olhos mais limpo: tira amarelo/vermelho e clareia um tico, só nos pixels claros
        if P["esclera"] > 0:
            for lado in ("D", "E"):
                m = M.get(f"esc_{lado}")
                if m is None:
                    continue
                o = m * smooth(L, 40, 70) * P["esclera"]
                A -= A * o * 0.5
                B -= (B - 1.0) * o * 0.5
                L += (96 - L) * o * 0.10

        # batom: leva a cor média do lábio até a cor escolhida mantendo luz, sombra e brilho
        if P["batom"] > 0 and M["lab"].sum() > 5:
            m = M["lab"]
            nuc = M.get("ref_labnucleo")
            nuc = m if nuc is None or nuc.sum() < 5 else nuc
            w = nuc / nuc.sum()
            Lm = self._ref("labL", float((L * w).sum()))
            Am = self._ref("labA", float((A * w).sum()))
            Bm = self._ref("labB", float((B * w).sum()))
            Lt, At, Bt = (float(v) for v in self.batom_lab)
            reg = M.get("lab_regiao", m)
            pel = M.get("ref_bocapele")
            if pel is not None and pel.sum() > 20:
                wp = pel / pel.sum()
                As = self._ref("pelA", float((A * wp).sum()))
                Bs = self._ref("pelB", float((B * wp).sum()))
                vx, vy = Am - As, Bm - Bs
                n2 = vx * vx + vy * vy
            else:
                n2 = 0.0
            if n2 > 36:  # lábio tem cor diferente da pele em volta: segmenta pela cor
                tcor = ((A - As) * vx + (B - Bs) * vy) / n2
                labio = feather(smooth(tcor, 0.3, 0.75).astype(np.float32), 1.2)
                # dentro da boca (pela malha) só pinta o que for MUITO cor de lábio: a malha às vezes põe
                # o "dentro da boca" em cima do lábio; língua e dente não passam nesse teste
                dentro = M.get("ref_dentro", 0.0)
                labio = labio * (1 - dentro * (1 - smooth(tcor, 0.8, 1.0)))
                o = reg * labio
                # quando a malha está bem no lábio (o miolo dela tem cor de lábio), confia nela também:
                # cobre o reflexo do lábio, que tem cor parecida com a da pele
                nucf = feather(nuc, max(1.0, fw * 0.008))
                acerto = float((nuc * labio).sum() / max(nuc.sum(), 1e-6))
                confia = float(smooth(np.float32(acerto), 0.45, 0.7))
                o = np.maximum(o, nucf * confia)
            else:        # cores parecidas demais: fica com o contorno da malha
                o = m
            o = np.clip(o, 0, 1) * 0.85 * P["batom"] * smooth(L, 22, 42)  # canto/sombra escura: quase não pinta
            brilho = smooth(L - Lm, 6, 18)          # reflexo: preserva
            L += (Lt - Lm) * 0.6 * o * (1 - 0.75 * brilho)
            # cor vai para a do batom guardando só 30% da variação original; na sombra a cor
            # perde força junto com a luz (senão a parte escura do lábio fica roxa)
            r = np.clip(L / max(Lm, 1.0), 0.55, 1.1)
            A += (At * r + (A - Am) * 0.3 - A) * o
            B += (Bt * r + (B - Bm) * 0.3 - B) * o

        Y = cv2.cvtColor(cv2.merge([L, A, B]), cv2.COLOR_LAB2BGR)

        # produtos "por cima" (multiplicação = colore sem apagar a textura)
        if P["sombra"] > 0:
            for lado in ("D", "E"):
                m = M.get(f"sombra_{lado}")
                if m is None:
                    continue
                o = np.clip(m * 0.75 * P["sombra"], 0, 1)[..., None]
                Y = Y * (1 - o * (1 - self.sombra_mult))

        if P["sobr"] > 0:
            for lado in ("D", "E"):
                m = M.get(f"sobr_{lado}")
                if m is None or (m > 0.5).sum() < 5:
                    continue
                pix = Y[m > 0.5]
                cor = np.percentile(pix, 20, axis=0).astype(np.float32)
                cor = self._ref(f"sobr{lado}", cor, 0.2)
                alvo = np.minimum(Y, cor * 1.05)          # escurece só o que é mais claro que o pelo (falhas)
                o = np.clip(m * 0.55 * P["sobr"], 0, 1)[..., None]
                Y = Y + (alvo - Y) * o

        if P["cilios"] > 0:
            for lado in ("D", "E"):
                m = M.get(f"cil_{lado}")
                if m is None:
                    continue
                o = np.clip(m * 0.30 * P["cilios"], 0, 1)[..., None]
                Y = Y * (1 - o)

        if P["liner"] > 0:
            escuro = np.array([0.05, 0.06, 0.08], np.float32)  # marrom bem escuro (BGR)
            for lado in ("D", "E"):
                m = M.get(f"liner_{lado}")
                if m is None:
                    continue
                o = np.clip(m * 0.62 * P["liner"], 0, 1)[..., None]
                Y = Y + (np.minimum(Y, escuro + Y * 0.25) - Y) * o

        return np.clip(Y, 0, 1)

    # -- quadro inteiro
    def _alpha(self, nome, a_global, a_labios):
        if nome in ("pele", "boch") or nome.startswith(("olh_", "sobr_", "bdef_", "ilum")):
            return a_global
        if nome == "lab":
            return a_global if self.nivel == "leve" else None  # médio/alto: segue a boca sem atraso
        return None  # olhos (sombra, delineado, cílios, esclera) e referências: sem média, seguem a piscada

    def processar(self, bgr, t_ms, debug=False):
        H, W = bgr.shape[:2]
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        res = self.lm.detect_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb), int(t_ms))
        rostos = res.face_landmarks or []
        # ordena por posição x para manter o mesmo filtro em cada rosto
        lista = []
        for lms in rostos:
            pts = np.array([[l.x * W, l.y * H] for l in lms], np.float32)
            lista.append(pts)
        lista.sort(key=lambda a: a[:, 0].mean())

        full = {}
        info = []
        movimento = 0.0
        mov_labios = 0.0
        idx_lab = LABIOS + BOCA_DENTRO
        for i, pts in enumerate(lista):
            # médio/alto: filtro mais rápido (maquiagem não pode ficar para trás quando a cabeça vira)
            f = self.filtros.setdefault(i, OneEuro(self.fps, beta=0.04 if self.nivel == "leve" else 0.15))
            pts = f(pts)
            fw = float(np.linalg.norm(pts[454] - pts[234]))
            if i in self.prev_pts and self.prev_pts[i].shape == pts.shape:
                movimento = max(movimento, float(np.abs(pts - self.prev_pts[i]).mean()) / max(fw, 1))
                mov_labios = max(mov_labios, float(np.abs(pts[idx_lab] - self.prev_pts[i][idx_lab]).mean())
                                 / max(fw, 1))
            self.prev_pts[i] = pts
            if fw < 24:
                continue  # rosto pequeno demais: não mexe
            x0, y0 = pts.min(0)
            x1, y1 = pts.max(0)
            pad = 0.35 * (x1 - x0)
            box = (int(max(0, x0 - pad)), int(max(0, y0 - pad * 1.3)),
                   int(min(W, x1 + pad)), int(min(H, y1 + pad * 0.6)))
            if box[2] - box[0] < 16 or box[3] - box[1] < 16:
                continue
            M, fw = self._mascaras_rosto(rgb, pts, box)
            bx0, by0, bx1, by1 = box
            for nome, m in M.items():
                if nome not in full:
                    full[nome] = np.zeros((H, W), np.float32)
                full[nome][by0:by1, bx0:bx1] = np.maximum(full[nome][by0:by1, bx0:bx1], m)
            info.append((box, fw))

        # média no tempo, mais forte quando o rosto está parado (sem rastro no movimento)
        a = float(np.clip(0.45 + movimento * 25, 0.45, 1.0))
        a_lab = float(np.clip(0.6 + mov_labios * 80, 0.6, 1.0))
        novo_prev = {}
        for nome in set(full) | set(self.mask_prev):
            atual = full.get(nome)
            antes = self.mask_prev.get(nome)
            al = self._alpha(nome, a, a_lab)
            if atual is None:
                atual = np.zeros((H, W), np.float32)
            if al is None:
                full[nome] = atual
                continue
            if antes is not None:
                atual = al * atual + (1 - al) * antes
            novo_prev[nome] = atual
            full[nome] = atual
        self.mask_prev = novo_prev
        self.n += 1

        def uniao():
            u = np.zeros((H, W), np.float32)
            for nome, m in full.items():
                if nome.startswith("ref_"):
                    continue
                if nome == "lab" and not (self.blush and (self.P["lip_on"] or self.P["batom"] > 0)):
                    continue
                if nome == "boch" and not (self.blush and self.P["blush_a"] > 0):
                    continue
                u = np.maximum(u, m)
            return u

        if not info:
            return (bgr, uniao()) if debug else bgr

        out = bgr.copy()
        # uma região que cobre todos os rostos (pode ter 2)
        X0 = min(b[0] for b, _ in info); Y0 = min(b[1] for b, _ in info)
        X1 = max(b[2] for b, _ in info); Y1 = max(b[3] for b, _ in info)
        fw = max(f for _, f in info)
        I = bgr[Y0:Y1, X0:X1].astype(np.float32) / 255.0
        Mc = {nome: m[Y0:Y1, X0:X1] for nome, m in full.items()}
        R = self._retocar(I, Mc, fw)
        if self.maq:
            R2 = self._maquiar(R, Mc, fw)
            # só onde há algum produto; o resto fica exatamente como a pele retocada
            alg = np.zeros(R.shape[:2], bool)
            for nome, m in Mc.items():
                if not nome.startswith(("ref_", "pele", "boch")) and not (nome == "lab" and self.P["batom"] <= 0):
                    alg |= m > 1e-4
            R = np.where(alg[..., None], R2, R)
        out[Y0:Y1, X0:X1] = np.clip(R * 255.0 + 0.5, 0, 255).astype(np.uint8)
        return (out, uniao()) if debug else out


# ----------------------------------------------------------------------------- vídeo

def main():
    ap = argparse.ArgumentParser(description="Retoque de pele e maquiagem digital (glowup) para vídeo.")
    ap.add_argument("entrada")
    ap.add_argument("saida")
    ap.add_argument("--nivel", choices=list(NIVEIS), default="leve",
                    help="leve (retoque sutil), medio ('acordei e gravei'), alto (maquiagem completa)")
    ap.add_argument("--intensidade", type=float, default=0.6,
                    help="ajuste fino dentro do nível: 0.3 (metade) a 1.0 (mais forte). Padrão 0.6")
    ap.add_argument("--batom", default=BATOM_PADRAO, help=f"cor do batom no nível alto (padrão {BATOM_PADRAO}, nude rosado)")
    ap.add_argument("--sombra", choices=list(SOMBRAS), default="marrom", help="tom da sombra no nível alto")
    ap.add_argument("--sem-blush", action="store_true", help="não mexe em bochecha nem lábio")
    ap.add_argument("--inicio", type=float, default=None, help="segundo inicial (para testar um trecho)")
    ap.add_argument("--duracao", type=float, default=None, help="duração do trecho em segundos")
    ap.add_argument("--crf", type=int, default=15, help="qualidade do H.264 (menor = melhor). Padrão 15")
    ap.add_argument("--mascara", default=None, help="salva também um vídeo da máscara (onde mexe), para conferência")
    args = ap.parse_args()

    W, H, fr, tem_audio, dur = sondar(args.entrada)
    num, den = (int(x) for x in fr.split("/"))
    fps = num / den if den else 30.0

    trecho = []
    if args.inicio is not None:
        trecho += ["-ss", f"{args.inicio}"]
    if args.duracao is not None:
        trecho += ["-t", f"{args.duracao}"]

    g = Glowup(fps, args.intensidade, blush=not args.sem_blush, nivel=args.nivel, batom=args.batom,
               sombra=args.sombra)

    dec = subprocess.Popen(["ffmpeg", "-v", "error", *trecho, "-i", args.entrada,
                            "-map", "0:v:0", "-vf", f"fps={fr}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                           stdout=subprocess.PIPE, bufsize=W * H * 3 * 4)
    enc_cmd = ["ffmpeg", "-v", "error", "-y",
               "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", fr, "-i", "-"]
    if tem_audio:
        enc_cmd += [*trecho, "-i", args.entrada, "-map", "0:v", "-map", "1:a:0", "-c:a", "copy", "-shortest"]
    enc_cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", str(args.crf), "-pix_fmt", "yuv420p",
                "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                "-movflags", "+faststart", args.saida]
    enc = subprocess.Popen(enc_cmd, stdin=subprocess.PIPE)
    menc = None
    if args.mascara:
        menc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray",
                                 "-s", f"{W}x{H}", "-r", fr, "-i", "-", "-c:v", "libx264", "-crf", "18",
                                 "-pix_fmt", "yuv420p", args.mascara], stdin=subprocess.PIPE)

    tam = W * H * 3
    t0 = time.time()
    n = 0
    t_proc = 0.0
    while True:
        buf = dec.stdout.read(tam)
        if len(buf) < tam:
            break
        frame = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        tp = time.time()
        r = g.processar(frame, n * 1000.0 / fps, debug=menc is not None)
        t_proc += time.time() - tp
        if menc is not None:
            out, m = r
            menc.stdin.write((np.clip(m, 0, 1) * 255).astype(np.uint8).tobytes())
        else:
            out = r
        enc.stdin.write(out.tobytes())
        n += 1
        if n % 60 == 0:
            el = time.time() - t0
            print(f"  {n} quadros ({n / fps:.1f}s de vídeo) em {el:.1f}s", file=sys.stderr)
    enc.stdin.close()
    if menc is not None:
        menc.stdin.close(); menc.wait()
    dec.wait(); enc.wait()
    el = time.time() - t0
    seg_video = n / fps if fps else 0
    print(json.dumps({"quadros": n, "segundos_video": round(seg_video, 2), "tempo_total_s": round(el, 2),
                      "s_por_s_video": round(el / max(seg_video, 1e-6), 2),
                      "s_por_s_video_so_retoque": round(t_proc / max(seg_video, 1e-6), 2),
                      "nivel": g.nivel, "intensidade": g.intensidade, "blush": g.blush, "saida": args.saida},
                     ensure_ascii=False))
    if enc.returncode != 0:
        sys.exit("ffmpeg falhou ao gravar a saída")


if __name__ == "__main__":
    main()
