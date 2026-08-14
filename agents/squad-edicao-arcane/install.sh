#!/usr/bin/env bash
# install.sh — bootstrap fino (macOS/Linux). A logica cross-platform vive em
# install.py; este shim existe so pra o comando "bash install.sh" seguir valendo.
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if command -v python3 >/dev/null 2>&1; then
  exec python3 "$DIR/install.py" "$@"
elif command -v python >/dev/null 2>&1; then
  exec python "$DIR/install.py" "$@"
else
  echo "Python 3 nao encontrado. Instale e rode de novo."
  echo "  Mac: brew install python   |   Linux: sudo apt install python3"
  exit 1
fi
