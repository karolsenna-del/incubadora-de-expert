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
bash {SQUAD_DIR}/scripts/doctor.sh
DOCTOR_EXIT=$?
```

## Quality gate

**QG-SEA-001 — Ambiente OK**

- Exit 0: PASS. Continua pro pipeline.
- Exit 1: FAIL. Lista o que faltou.

## Acao em caso de FAIL

1. Lista os ❌ pro expert
2. Pergunta: "Quer que eu rode `install.sh` pra corrigir? (idempotente, nao quebra nada)"
3. Se sim: roda `instalar.md` e re-valida
4. Se nao: bloqueia pipeline ate consertar

## Erros conhecidos (ver knowledge/04-troubleshooting.md)

| Sintoma | Causa provavel |
|---|---|
| `whisper-cli not found` | brew nao instalou ou path errado |
| `ModuleNotFoundError: cv2` | Rodou com python3 puro em vez do venv |
| Modelo ausente | Download foi interrompido |
| `fc-match` retorna "Verdana" | fc-cache nao rodou apos instalar fonte |
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

Pra corrigir: rode `install.sh` (vai baixar so o que falta)
```
