# Mind Forge

Funde o conhecimento de N experts em uma unica mente sintetica ou consultor de dominio. Output: agente AIOS pronto com KB rica e modos de operacao.

## Ativacao

```
/mindForge
```

## Agentes

| Agente | Funcao |
|--------|--------|
| @forge-chief | Orquestrador do pipeline, state management |
| @knowledge-miner | Ingestao + analise profunda + voice profiling |
| @mind-smith | Construtor de agent + KB + tasks |

## Pipeline

```
Fase 0: Setup → Fase 1: Ingestao → Fase 2: Analise
→ Fase 3: Playback → Fase 4: Forja → Fase 5: Validacao + Install
```

### Modos

| Modo | Descricao |
|------|-----------|
| Mente Sintetica | Fusao N experts → 1 agente por dominio |
| Consultor | Deep-dive em 1 assunto/metodologia |

## Quality Gates

- QG-MF-001: Ingestion Validity (fontes validas e classificadas)
- QG-MF-002: Analysis Completeness (KFs extraidos com profundidade)
- QG-MF-003: User Validation (playback aprovado)
- QG-MF-004: Mind Quality (KB + agent + immune system coerentes)
- QG-MF-005: Operational Readiness (4 smoke tests + Context Death Test)

## Output

Mente completa em `minds/{slug}/`:

```
minds/{slug}/
├── 01-ingestion/   — Fontes ingeridas e classificadas
├── 02-analysis/    — KFs extraidos (7 tipos + pareto zone)
├── 03-playback/    — Validacao com o usuario
├── 04-forged/      — Agente pronto (agent.md + KB + tasks + config)
└── 05-validation/  — Smoke tests + validation report
```

## Instalacao

Automatica no final do pipeline (Fase 5):
1. Output copiado de `04-forged/` para `agents/{slug}/`
2. Skill registrada em `.claude/commands/{slashPrefix}.md`
3. Ativacao imediata via `/{slashPrefix}`

## Dependencias

- **ETLmaker** (recomendado) — KBs pre-processadas aumentam qualidade
- **Fontes locais** (obrigatorio) — docs, KBs, transcricoes como input
