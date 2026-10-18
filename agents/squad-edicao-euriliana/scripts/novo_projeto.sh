#!/bin/bash
# Etapa 2 — cria o projeto Remotion do vídeo em <trabalho>/app a partir do template da skill.
# Uso: bash novo_projeto.sh <pasta_do_trabalho> [trilha.mp3]
# Mantido por compatibilidade: quem faz o trabalho é o novo_projeto.py (roda também no Windows, sem bash nem rsync).
PY="$(command -v python3 || command -v python)"
[ -z "$PY" ] && { echo "não achei o Python 3 (python3 ou python)"; exit 2; }
exec "$PY" "$(dirname "$0")/novo_projeto.py" "$@"
