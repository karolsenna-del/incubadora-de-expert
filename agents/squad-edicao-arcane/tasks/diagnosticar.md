---
task: "Diagnosticar"
responsavel: "@installer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Algo nao roda OU pre-flight antes de cada edicao"
Saida: "Health check report + acao corretiva se necessario"
execution_type: "deterministic"
---

# Task: Diagnosticar — Health check do ambiente

Roda automaticamente antes de cada edicao (pre-flight) OU sob demanda quando expert reporta erro.

## Execucao

```bash
python {SQUAD_DIR}/scripts/doctor.py   # 'py' no Windows, 'python3' no Mac/Linux
DOCTOR_EXIT=$?
```

## Quality gate

**QG-SEA-001 — Ambiente OK**

- Exit 0: PASS. Continua pro pipeline.
- Exit 1: FAIL. Lista o que faltou.

## Acao em caso de FAIL

1. Lista os `[FAIL]` pro expert
2. Pergunta: "Quer que eu rode `install.py` pra corrigir? (idempotente, nao quebra nada)"
3. Se sim: roda `instalar.md` e re-valida
4. Se nao: bloqueia pipeline ate consertar

## Erros conhecidos (ver knowledge/04-troubleshooting.md)

| Sintoma | Causa provavel |
|---|---|
| `whisper-cli` FAIL | brew nao instalou (Mac) OU download do release falhou (Windows) — ver `<squad>/bin/` |
| `ModuleNotFoundError: cv2` | Rodou com python puro em vez do venv (`.venv\Scripts\python.exe` / `.venv/bin/python3`) |
| venv FAIL apos install | Python 3.14 sem wheel de torch — usar Python 3.12/3.13 |
| Modelo ausente | Download foi interrompido — rodar install de novo |
| Legenda em Verdana (Mac) | fc-cache nao rodou apos instalar fonte |
| Legenda "Fontconfig error" (Windows) | path da fonte com acento/espaco e short-path 8.3 desabilitado — por o squad num path so-ASCII |
| Video output 10-bit (nao abre) | Script sem `-pix_fmt yuv420p` (nao deveria — scripts ja forcam) |

## Report

```
=== Health check ===
✓ ffmpeg
✓ whisper-cli
❌ modelo whisper medium  ← FALTA
✓ venv
...

Resultado: FAIL (1 item)

Pra corrigir: rode `install.py` (vai baixar so o que falta)
```
