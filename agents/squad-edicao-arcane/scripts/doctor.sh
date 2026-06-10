#!/usr/bin/env bash
# doctor.sh — health check do ambiente do Squad Edicao Arcane
# uso: bash doctor.sh
# exit 0 = tudo OK, exit 1 = falta algo
# NAO usar 'pipefail': checks com 'grep -q' fecham o pipe cedo (SIGPIPE no
# comando da esquerda) e pipefail transformaria isso em falso negativo.
set -u

SQUAD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="$SQUAD_DIR/.venv"
MODEL_PATH="/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin"

# binarios do Homebrew (MESMO criterio dos scripts do squad): o pipeline usa o
# ffmpeg do Homebrew (bottle tem drawtext), nao o que estiver na frente do PATH.
# Checar aqui o que NAO eh usado em runtime daria falso negativo (ex: aluno com
# conda ffmpeg no PATH, mas o squad rodando com o ffmpeg do brew).
_bin(){ for b in /opt/homebrew/bin /usr/local/bin; do [ -x "$b/$1" ] && { echo "$b/$1"; return; }; done; command -v "$1" 2>/dev/null || echo "$1"; }
FFMPEG="$(_bin ffmpeg)"; FFPROBE="$(_bin ffprobe)"; WHISPER="$(_bin whisper-cli)"

ERRORS=0
WARNINGS=0

check() {
  local name="$1"; local cmd="$2"
  if eval "$cmd" >/dev/null 2>&1; then
    echo "✓ $name"
  else
    echo "❌ $name"
    ERRORS=$((ERRORS+1))
  fi
}

warn() {
  local name="$1"; local cmd="$2"
  if eval "$cmd" >/dev/null 2>&1; then
    echo "✓ $name"
  else
    echo "⚠️  $name (opcional — pipeline default ainda roda)"
    WARNINGS=$((WARNINGS+1))
  fi
}

echo "=== Squad Edicao Arcane — Doctor ==="
echo ""

# ─── Binarios (os mesmos que o pipeline usa: Homebrew) ───
check "ffmpeg ($FFMPEG)"      "test -x '$FFMPEG'"
check "ffprobe"               "test -x '$FFPROBE'"
check "whisper-cli"           "test -x '$WHISPER'"

# ─── Filtros ffmpeg (no ffmpeg que o squad realmente usa) ─
check "ffmpeg drawtext (legenda)"         "'$FFMPEG' -filters 2>/dev/null | grep -q drawtext"
check "ffmpeg sidechaincompress (trilha)" "'$FFMPEG' -filters 2>/dev/null | grep -q sidechaincompress"
check "ffmpeg libfontconfig"              "'$FFMPEG' -version 2>&1 | grep -q libfontconfig"

# ─── Modelo whisper ──────────────────────────────────────
check "modelo ggml-medium.bin" "test -f '$MODEL_PATH'"

# ─── Venv local ──────────────────────────────────────────
check "venv local ($VENV_DIR)" "test -x '$VENV_DIR/bin/python3'"

if [[ -x "$VENV_DIR/bin/python3" ]]; then
  check "venv: silero-vad"    "'$VENV_DIR/bin/python3' -c 'import silero_vad'"
  check "venv: torch"         "'$VENV_DIR/bin/python3' -c 'import torch'"
  check "venv: scipy"         "'$VENV_DIR/bin/python3' -c 'import scipy'"
  check "venv: numpy"         "'$VENV_DIR/bin/python3' -c 'import numpy'"
  check "venv: pyyaml"        "'$VENV_DIR/bin/python3' -c 'import yaml'"
  check "venv: cv2 (zoom)"    "'$VENV_DIR/bin/python3' -c 'import cv2'"
fi

# ─── Fontes (Bebas obrigatoria, outras opcionais) ────────
check "fonte BebasNeue arquivo"     "test -f '$HOME/Library/Fonts/BebasNeue-Regular.ttf'"
check "fonte BebasNeue resolvivel"  "fc-match 'Bebas Neue' 2>/dev/null | grep -qi bebas"
warn  "fonte Montserrat (estilo viral)" "fc-match 'Montserrat' 2>/dev/null | grep -qi montserrat"
warn  "fonte Poppins (estilo clean)"    "fc-match 'Poppins' 2>/dev/null | grep -qi poppins"

# ─── Scripts ─────────────────────────────────────────────
check "video-speech-cut.py"   "test -f '$SQUAD_DIR/scripts/video-speech-cut.py'"
check "video-speed-up.sh"     "test -f '$SQUAD_DIR/scripts/video-speed-up.sh'"
check "video-transcribe.sh"   "test -f '$SQUAD_DIR/scripts/video-transcribe.sh'"
check "video-captions.py"     "test -f '$SQUAD_DIR/scripts/video-captions.py'"
check "video-produce-zoom.py" "test -f '$SQUAD_DIR/scripts/video-produce-zoom.py'"
check "video-add-music.sh"    "test -f '$SQUAD_DIR/scripts/video-add-music.sh'"

# ─── Data (estilos + trilha) ─────────────────────────────
check "data/estilo-ativo.yaml"     "test -f '$SQUAD_DIR/data/estilo-ativo.yaml'"
check "data/estilos/neutro.yaml"   "test -f '$SQUAD_DIR/data/estilos/neutro.yaml'"
check "data/trilhas/default.mp3"   "test -f '$SQUAD_DIR/data/trilhas/default.mp3'"

# ─── Diagnostico especifico: drawtext (causa #1 da legenda nao ir) ───
if ! "$FFMPEG" -filters 2>/dev/null | grep -q drawtext; then
  echo ""
  echo "⚠️  O ffmpeg usado ($FFMPEG) NAO tem 'drawtext' — a legenda queimada nao renderiza."
  echo "   NAO precisa compilar ffmpeg (gasta ~30min de CPU a toa, e nao e necessario)."
  echo "   O bottle do Homebrew JA vem com drawtext. Pra resolver:"
  echo "     brew install ffmpeg     # (ou: brew reinstall ffmpeg)"
  PATH_FF="$(command -v ffmpeg 2>/dev/null || true)"
  if [ -n "$PATH_FF" ] && [ "$PATH_FF" != "$FFMPEG" ]; then
    echo "   Obs: teu PATH resolve outro ffmpeg ($PATH_FF) — provavel conda/Anaconda."
    echo "        Os scripts do squad ja usam o do Homebrew, entao isso nao atrapalha."
  fi
fi

echo ""
echo "─────────────────────────────────────"
if [[ $ERRORS -eq 0 ]]; then
  echo "✅ Tudo OK ($WARNINGS avisos)"
  exit 0
else
  echo "❌ $ERRORS problemas detectados ($WARNINGS avisos)"
  echo ""
  echo "Pra corrigir: rode o install.sh do squad"
  echo "  bash $SQUAD_DIR/install.sh"
  exit 1
fi
