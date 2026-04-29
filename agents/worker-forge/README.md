# Worker Forge

Cria workers operacionais — agentes autonomos especializados em tarefas repetitivas e operacionais. Diferente de squads (pipeline) e minds (pensamento).

## Ativacao

```
/workerForge
```

## Agentes

| Agente | Funcao |
|--------|--------|
| @worker-chief | Orquestrador do pipeline |
| @role-designer | Define papel, responsabilidades e limites do worker |
| @knowledge-curator | Pesquisa e organiza conhecimento de dominio |
| @worker-smith | Construtor do agente + tasks + KB |

## Pipeline

```
Fase 0: Setup → Fase 1: Descoberta → Fase 2: Pesquisa
→ Fase 3: Proposta → Fase 4: Montagem → Fase 5: Validacao + Install
```

## Quality Gates

- QG-WF-001: Needs Validated (necessidade real confirmada)
- QG-WF-002: Domain Researched (conhecimento suficiente coletado)
- QG-WF-003: Proposal Approved (usuario aprovou design do worker)
- QG-WF-004: Worker Assembled (agent + tasks + KB estruturados)
- QG-WF-005: Worker Operational (4 smoke tests passam)

## Output

Worker completo em `output/{slug}/`:

```
output/{slug}/
├── agents/      — Agente do worker
├── tasks/       — Missoes executaveis
├── knowledge/   — KB do dominio
├── config.yaml  — Configuracao
└── README.md    — Documentacao
```

## Instalacao

Automatica no final do pipeline (Fase 5):
1. Output movido de `output/{slug}/` para `agents/{slug}/`
2. Skill registrada em `.claude/commands/{slashPrefix}.md`
3. Ativacao imediata via `/{slashPrefix}`

## Dependencias

- **Squad Forge** (opcional) — processos ja extraidos podem alimentar o design
- **Pesquisa web** (recomendado) — WebSearch pra enriquecer KB do dominio
