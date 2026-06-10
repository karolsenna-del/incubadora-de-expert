#!/usr/bin/env bash
# install.sh — setup inicial do Squad Edicao Arcane
# Roda na 1a vez no Mac do aluno. Idempotente — pode rodar de novo sem quebrar.
set -euo pipefail

SQUAD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SQUAD_DIR/.venv"
MODEL_PATH="/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin"
MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin"
FONTS_DIR="$HOME/Library/Fonts"

echo "═══════════════════════════════════════════════════"
echo "  Squad Edicao Arcane — Setup Inicial"
echo "═══════════════════════════════════════════════════"
echo ""

# ─── 0. Pre-checks (Claude Code + projeto Auroq) ─────────
# O squad e usado dentro do Claude Code via slash command.
# Sem Claude Code o aluno nao consegue ativar /auroq-squad-edicao-arcane.
# Sem projeto Auroq o registro do slash command nao acontece (so falla).
MISSING_PREREQ=false

if ! command -v claude >/dev/null 2>&1; then
  echo "⚠️  Claude Code nao detectado no PATH."
  echo "   Esse squad e usado DENTRO do Claude Code via slash command."
  echo "   Instale antes: https://claude.ai/code"
  echo ""
  MISSING_PREREQ=true
fi

# procura projeto Auroq subindo na hierarquia
find_auroq_root_early() {
  local dir="$1"
  while [[ "$dir" != "/" && "$dir" != "$HOME" ]]; do
    if [[ -d "$dir/.auroq-core" ]]; then echo "$dir"; return 0; fi
    dir="$(dirname "$dir")"
  done
  return 1
}

if [[ -z "$(find_auroq_root_early "$SQUAD_DIR" 2>/dev/null || true)" ]]; then
  echo "⚠️  Projeto Auroq nao encontrado na hierarquia."
  echo "   Esse squad vive DENTRO de um projeto Auroq (em agents/)."
  echo "   Se voce ainda nao tem: rode 'npx auroq-os init' numa pasta sua,"
  echo "   depois mova esse squad pra <projeto>/agents/squad-edicao-arcane/"
  echo ""
  MISSING_PREREQ=true
fi

if $MISSING_PREREQ; then
  read -p "Continuar instalando ambiente mesmo assim? [s/N] " ans
  if [[ ! "$ans" =~ ^[sS]$ ]]; then
    echo "Abortado. Resolva os pre-requisitos e rode de novo."
    exit 1
  fi
  echo ""
fi

# ─── 1. macOS check ──────────────────────────────────────
if [[ "$(uname)" != "Darwin" ]]; then
  echo "❌ Esse squad foi feito pra macOS. Outros sistemas precisam adaptacao."
  exit 1
fi
echo "✓ macOS detectado"

# ─── 2. Command Line Tools (pre-pre-req do brew) ─────────
if ! xcode-select -p >/dev/null 2>&1; then
  echo "⏳ Instalando Xcode Command Line Tools (vai abrir um popup do macOS)..."
  xcode-select --install
  echo ""
  echo "⚠️  Aguarde a instalacao do popup terminar e rode esse install.sh de novo."
  exit 0
fi
echo "✓ Xcode Command Line Tools presente"

# ─── 3. Homebrew ─────────────────────────────────────────
if ! command -v brew >/dev/null 2>&1; then
  echo "⏳ Instalando Homebrew (vai pedir senha do Mac)..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # adiciona brew ao PATH pra essa sessao (caminho varia entre Intel/ARM)
  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -x /usr/local/bin/brew ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
fi
echo "✓ Homebrew presente ($(brew --version | head -1))"

# ─── 4. ffmpeg (com drawtext — obrigatorio pra legenda queimada) ─
# Nao basta o binario existir: a legenda usa o filtro `drawtext`, que depende de
# libfreetype/libfontconfig compilados no ffmpeg. O bottle oficial do Homebrew JA
# inclui drawtext — nao precisa compilar nada. O problema comum: ter OUTRO ffmpeg
# na frente do PATH (conda/Anaconda, build estatico) SEM drawtext. Por isso aqui
# checamos a CAPACIDADE (drawtext), nao so a presenca do binario.
tem_drawtext() {
  local out
  out="$("$1" -hide_banner -filters 2>/dev/null)" || true
  [[ "$out" == *drawtext* ]]
}

BREW_PREFIX="$(brew --prefix 2>/dev/null || echo /opt/homebrew)"
BREW_FFMPEG="$BREW_PREFIX/bin/ffmpeg"

if [[ ! -x "$BREW_FFMPEG" ]]; then
  echo "⏳ Instalando ffmpeg via Homebrew (bottle pre-compilado, ja vem com drawtext)..."
  brew install ffmpeg
fi

if [[ -x "$BREW_FFMPEG" ]] && ! tem_drawtext "$BREW_FFMPEG"; then
  echo "⏳ ffmpeg do Homebrew sem drawtext (raro) — reinstalando o bottle..."
  brew reinstall ffmpeg
fi

if [[ -x "$BREW_FFMPEG" ]] && tem_drawtext "$BREW_FFMPEG"; then
  echo "✓ ffmpeg com drawtext OK ($BREW_FFMPEG)"
  PATH_FFMPEG="$(command -v ffmpeg || true)"
  if [[ -n "$PATH_FFMPEG" && "$PATH_FFMPEG" != "$BREW_FFMPEG" ]] && ! tem_drawtext "$PATH_FFMPEG"; then
    echo "  ⚠️  Teu PATH resolve outro ffmpeg SEM drawtext ($PATH_FFMPEG) —"
    echo "      provavel conda/Anaconda ou build estatico na frente do PATH."
    echo "      Tudo bem: os scripts deste squad usam o ffmpeg do Homebrew direto,"
    echo "      nao dependem do PATH. Nao precisa mexer em nada nem compilar ffmpeg."
  fi
else
  echo "❌ Nao consegui um ffmpeg com drawtext. Rode manualmente: brew reinstall ffmpeg"
fi

# ─── 5. whisper-cpp ──────────────────────────────────────
if ! command -v whisper-cli >/dev/null 2>&1; then
  echo "⏳ Instalando whisper-cpp via Homebrew..."
  brew install whisper-cpp
else
  echo "✓ whisper-cli ja instalado"
fi

# ─── 6. Modelo whisper medium (1.5GB) ───────────────────
if [[ ! -f "$MODEL_PATH" ]]; then
  echo "⏳ Baixando modelo whisper medium (1.5GB, demora alguns minutos)..."
  mkdir -p "$(dirname "$MODEL_PATH")"
  curl -L --fail -o "$MODEL_PATH" "$MODEL_URL"
else
  echo "✓ modelo whisper medium ja presente"
fi

# ─── 7. Venv local + pip packages ───────────────────────
if [[ ! -d "$VENV_DIR" ]]; then
  echo "⏳ Criando venv local em $VENV_DIR ..."
  python3 -m venv "$VENV_DIR"
fi

echo "⏳ Instalando pacotes Python no venv (silero-vad, torch, opencv, etc)..."
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --quiet \
  silero-vad torch torchaudio scipy numpy fonttools pyyaml opencv-python-headless

# Valida imports
"$VENV_DIR/bin/python3" -c "
import torch, silero_vad, scipy, numpy, fontTools, yaml, cv2
print('✓ venv OK — torch', torch.__version__, '| opencv', cv2.__version__)
"

# ─── 8. Fontes (Bebas Neue + Montserrat + Poppins) ────────
mkdir -p "$FONTS_DIR"
INSTALLED_ANY=false
for fontfile in "$SQUAD_DIR"/data/fontes/*.ttf; do
  fontname=$(basename "$fontfile")
  if [[ ! -f "$FONTS_DIR/$fontname" ]]; then
    cp "$fontfile" "$FONTS_DIR/"
    INSTALLED_ANY=true
  fi
done
if $INSTALLED_ANY; then
  echo "⏳ Atualizando cache de fontes..."
  fc-cache -f "$FONTS_DIR" 2>/dev/null || true
fi

for f in "Bebas Neue" "Montserrat" "Poppins"; do
  if fc-match "$f" 2>/dev/null | grep -qi "${f%% *}"; then
    echo "✓ fonte $f resolvida"
  else
    echo "⚠️  fonte $f nao resolve — rode: fc-cache -fv"
  fi
done

# ─── 9. Registro no projeto Auroq (pra ativar /auroq-squad-edicao-arcane) ──
# Auroq do aluno vive numa pasta criada por `npx auroq-os init` (ex: ~/auroq-os/).
# Squads vivem em <projeto>/agents/<nome>/. Slash command registra em
# <projeto>/.claude/commands/auroq-<nome>.md (wrapper que aponta pro chief).
#
# Procura o projeto Auroq subindo na hierarquia ate achar `.auroq-core/`.

find_auroq_root() {
  local dir="$1"
  while [[ "$dir" != "/" && "$dir" != "$HOME" ]]; do
    if [[ -d "$dir/.auroq-core" ]]; then echo "$dir"; return 0; fi
    dir="$(dirname "$dir")"
  done
  return 1
}

AUROQ_ROOT="$(find_auroq_root "$SQUAD_DIR")"

if [[ -z "$AUROQ_ROOT" ]]; then
  echo "⚠️  Projeto Auroq nao encontrado na hierarquia."
  echo "   O squad foi extraido fora de um projeto Auroq."
  echo ""
  echo "   Pra ativar o slash command /auroq-squad-edicao-arcane no Claude Code,"
  echo "   mova essa pasta pra dentro do teu projeto Auroq:"
  echo ""
  echo "     mv \"$SQUAD_DIR\" <SEU-PROJETO-AUROQ>/agents/squad-edicao-arcane/"
  echo ""
  echo "   Se voce ainda nao tem projeto Auroq, crie um:"
  echo "     npx auroq-os init"
  echo ""
  echo "   Depois rode esse install.sh de novo de dentro do novo path."
  echo "   (Os scripts e ambiente ja estao instalados — esse e so o registro)"
else
  echo "✓ projeto Auroq detectado: $AUROQ_ROOT"
  TARGET_AGENTS="$AUROQ_ROOT/agents/squad-edicao-arcane"
  TARGET_CMD="$AUROQ_ROOT/.claude/commands/auroq-squad-edicao-arcane.md"

  # se o squad ainda nao esta em agents/, symlinka
  if [[ "$SQUAD_DIR" == "$TARGET_AGENTS" ]]; then
    echo "✓ squad ja esta em agents/squad-edicao-arcane/"
  elif [[ -L "$TARGET_AGENTS" || -d "$TARGET_AGENTS" ]]; then
    echo "✓ ja existe symlink/pasta em $TARGET_AGENTS"
  else
    mkdir -p "$AUROQ_ROOT/agents"
    ln -s "$SQUAD_DIR" "$TARGET_AGENTS"
    echo "⏳ Symlink criado: $TARGET_AGENTS -> $SQUAD_DIR"
  fi

  # cria wrapper do slash command (padrao auroq-<nome>.md)
  mkdir -p "$AUROQ_ROOT/.claude/commands"
  cat > "$TARGET_CMD" <<'EOF'
# squad-edicao-arcane

Edita video bruto talking-head pra Reels/Shorts: corte por fala (Silero VAD), aceleracao 1.2x mantendo pitch, zoom dinamico no rosto, legenda Bebas Neue e trilha de fundo com ducking balanceado. 7 agents com quality gates entre handoffs.

CRITICAL: First, read and adopt the persona defined in `agents/squad-edicao-arcane/agents/chief.md`.
Then, read and execute the task defined in `agents/squad-edicao-arcane/tasks/start.md`.
Follow ALL instructions exactly as written. Those files are your single source of truth.
EOF
  echo "✓ wrapper de slash command criado: $TARGET_CMD"
  echo "  -> slash command vai ativar: /auroq-squad-edicao-arcane"
fi

# ─── 10. Health check final ───────────────────────────────
echo ""
echo "⏳ Rodando health check (doctor.sh)..."
bash "$SQUAD_DIR/scripts/doctor.sh"
DOCTOR_EXIT=$?

echo ""
if [[ $DOCTOR_EXIT -eq 0 ]]; then
  echo "═══════════════════════════════════════════════════"
  echo "  ✅ Setup completo. Squad pronto pra editar videos."
  echo "═══════════════════════════════════════════════════"
  echo ""
  echo "Pra editar um video: ativa o squad com /auroq-squad-edicao-arcane"
  echo "(ou diz pro Claude: 'edita esse video: <path>')"
else
  echo "═══════════════════════════════════════════════════"
  echo "  ⚠️  Setup terminou com avisos. Veja acima."
  echo "═══════════════════════════════════════════════════"
fi
