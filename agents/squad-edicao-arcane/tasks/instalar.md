---
task: "Instalar"
responsavel: "@installer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pedido de setup inicial (UC1)"
Saida: "Ambiente completo + QG-SEA-001 PASS"
execution_type: "deterministic"
---

# Task: Instalar — Setup inicial do ambiente

Roda na 1a vez que o expert recebe o squad. Idempotente.

## Pre-flight

```bash
test -f {SQUAD_DIR}/install.py || { echo "install.py nao encontrado"; exit 1; }
```

## Execucao

```bash
# Mac/Linux:
python3 {SQUAD_DIR}/install.py      # (ou o shim: bash install.sh)
# Windows:
py {SQUAD_DIR}\install.py           # (ou o shim: powershell -ExecutionPolicy Bypass -File install.ps1)
```

O `install.py` detecta o OS e faz:
1. Detecta o sistema (macOS / Windows / Linux) e a versao do Python
2. Instala `ffmpeg` com drawtext+sidechaincompress — brew (Mac) / winget Gyan.FFmpeg (Windows)
3. Instala `whisper-cli` — brew whisper-cpp (Mac) / release do whisper.cpp em `<squad>/bin/` (Windows)
4. Baixa `ggml-medium.bin` (~1.5GB) — layout do brew (Mac) ou `<squad>/models/` (Windows)
5. Cria venv local (`.venv/bin` no Mac, `.venv\Scripts` no Windows), escolhendo um Python compativel com torch (evita 3.14). No Windows, se so achar Python >= 3.14, **instala o Python 3.13 via winget sozinho** e cria o venv com ele
6. Instala `silero-vad`, `torch`, `torchaudio`, `scipy`, `numpy`, `fonttools`, `pyyaml`, `opencv-python-headless` no venv
7. Fontes: no Mac copia pra `~/Library/Fonts/` + `fc-cache` (pro `font=`); no Windows/Linux nada a instalar (a legenda usa o `.ttf` embarcado via `fontfile=`)
8. Registra o wrapper do slash command em `<projeto>/.claude/commands/`
9. Roda `doctor.py` no fim — health check

## Quality gate

**QG-SEA-001 — Ambiente passa em todas as checagens**

Apos `install.py`, o `doctor.py` reporta cada componente como `[ OK ]` ou `[FAIL]`. Se tudo OK: QG PASS. Se algum FAIL: identificar e tratar.

### Erros comuns

| Erro | Causa | Acao |
|---|---|---|
| Homebrew ausente (Mac) | Mac novo | Instalar: https://brew.sh, rodar de novo |
| winget ausente (Windows) | Windows sem App Installer | Instalar ffmpeg full (gyan.dev) e Python 3.13 (python.org) na mao, rodar de novo |
| `pip install` falha no torch | Python 3.14 (sem wheel de torch) | **Automatico com winget:** o install instala o Python 3.13 sozinho. Sem winget: instalar Python 3.13 na mao e rodar de novo |
| Modelo nao baixou / truncado | Conexao instavel | Rodar de novo — o download **retoma** de onde parou e valida o tamanho exato (idempotente) |
| whisper-cli ausente (Windows) | Download do release falhou | Baixar `whisper-bin-x64.zip` de github.com/ggml-org/whisper.cpp/releases/download/v1.9.1/ e por `whisper-cli.exe` em `<squad>/bin/` |
| Legenda cai pra Verdana (Mac) | Fonte nao instalada | `fc-cache -fv ~/Library/Fonts/` |

## Report

```
✅ Setup completo
- ffmpeg: <versao>
- whisper-cli: presente
- modelo medium: 1.5GB
- venv: silero-vad + torch + scipy
- fonte Bebas Neue: instalada
```

Pra editar video: `/auroq-squad-edicao-arcane` ou "edita esse video: <path>"
