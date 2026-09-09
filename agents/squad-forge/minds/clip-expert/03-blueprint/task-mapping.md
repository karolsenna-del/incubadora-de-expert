# Task Mapping — PU → Task

| PU-ID | Tipo | Task | Agente |
|-------|------|------|--------|
| PU-clip-expert-001 | STEP | (fora do squad — live acontece) | — |
| PU-clip-expert-002 | DEPENDENCY | detectar-live-nova (checa pré-condição) | garimpeiro |
| PU-clip-expert-003 | STEP | detectar-live-nova | garimpeiro |
| PU-clip-expert-004 | INPUT | transcrever-se-necessario (checa se ja existe) | garimpeiro |
| PU-clip-expert-005 | DECISION | transcrever-se-necessario (decision point) | garimpeiro |
| PU-clip-expert-006 | OUTPUT | pontuar-trechos (define quantidade alvo) | garimpeiro |
| PU-clip-expert-007 | DEPENDENCY | pontuar-trechos (usa criterios do Expert Viral) | garimpeiro |
| PU-clip-expert-008 | QUALITY_GATE | pontuar-trechos (QG-CE-01) | garimpeiro |
| PU-clip-expert-009 | EXCEPTION | pontuar-trechos (error handling) | garimpeiro |
| PU-clip-expert-010 | OUTPUT | cortar-e-legendar + entregar-e-notificar | cortador |
| PU-clip-expert-011 | OUTPUT | entregar-e-notificar | cortador |
| PU-clip-expert-012 | INPUT | detectar-live-nova (fonte do video) | garimpeiro |
| PU-clip-expert-013 | STEP | revisar-e-aprovar | clip-chief |
| PU-clip-expert-014 | DEPENDENCY | revisar-e-aprovar (QG-CE-02 + handoff Postador) | clip-chief |
| PU-clip-expert-015 | DECISION | cortar-e-legendar (decision point) | cortador |
| PU-clip-expert-016 | TACIT | STRICT RULES do garimpeiro + Regra Cardinal na KB | garimpeiro |

Todos os PU-STEP têm exatamente 1 task responsável. Nenhum PU órfão. Sem dependência circular (fluxo estritamente sequencial: detectar → transcrever → pontuar → cortar → entregar → revisar).
