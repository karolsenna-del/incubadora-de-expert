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
test -f {SQUAD_DIR}/install.sh || { echo "install.sh nao encontrado"; exit 1; }
```

## Execucao

```bash
bash {SQUAD_DIR}/install.sh
```

O `install.sh` faz:
1. Detecta macOS
2. Verifica Homebrew
3. Instala `ffmpeg` (se faltar)
4. Instala `whisper-cpp` (se faltar)
5. Baixa `ggml-medium.bin` (~1.5GB, demora alguns minutos)
6. Cria venv local em `{SQUAD_DIR}/.venv/`
7. Instala `silero-vad`, `torch`, `torchaudio`, `scipy`, `numpy`, `fonttools` no venv
8. Copia `data/fontes/BebasNeue-Regular.ttf` pra `~/Library/Fonts/`
9. Roda `fc-cache`
10. Roda `doctor.sh` no fim — health check

## Quality gate

**QG-SEA-001 — Ambiente passa em todas as checagens**

Apos `install.sh`, o `doctor.sh` reporta cada componente como ✓ ou ❌. Se tudo ✓: QG PASS. Se algum ❌: identificar e tratar.

### Erros comuns

| Erro | Causa | Acao |
|---|---|---|
| Homebrew ausente | Mac novo | Mandar expert instalar: https://brew.sh, rodar de novo |
| Modelo nao baixou | Conexao instavel | Tentar de novo (idempotente) |
| `pip install` falhou | PEP 668 (Homebrew Python) | venv local resolve — verifica que `{SQUAD_DIR}/.venv/` foi criado |
| `fc-match "Bebas Neue"` nao resolve | Cache antigo | `fc-cache -fv ~/Library/Fonts/` |

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
