# Clone Forge

Pipeline de clonagem cognitiva que transforma qualquer expert em um agente AIOS de alta fidelidade — voz, heuristicas, estilo de decisao preservados.

## Ativacao

```
/cloneForge
```

## Agentes

| Agente | Funcao |
|--------|--------|
| @clone-forge-chief | Orquestrador do pipeline |
| @innerlens | Extrator semantico (MIUs) |
| @cognitive-motor | Motor psicologico (drivers + psicometria) |

## Pipeline

```
Fase 0: Ingestao → Fase 1: Coleta → Fase 1.5: Entrevista (condicional)
→ Fase 2: MIUs → Fase 3: DNA → Fase 4: Drivers → Fase 5: Psicometria
→ Fase 6: Perfil → Fase 6.5: Gap Analysis (condicional)
→ Fase 7: Validacao → Fase 8: Geracao + Install
```

### Modos

| Modo | Comando | Fases |
|------|---------|-------|
| Completo | `*clone-forge {nome} --domain "{area}"` | 11 fases |
| Rapido | `*clone-forge {nome} --domain "{area}" --quick` | 5 fases |

## Quality Gates

- QG-CF-001: Source Validation (fontes suficientes e classificadas)
- QG-CF-002: MIU Quality (extracoes validas e representativas)
- QG-CF-003: DNA Fidelity (voz e pensamento fieis a fonte)
- QG-CF-004: Profile Completeness (perfil 360 graus agregado)
- QG-CF-005: Clone Operational (smoke tests + blind test)

## Output

Cada clone produz 30+ arquivos em `minds/{slug}/`:

```
minds/{slug}/
├── 01-sources/      — Fontes classificadas + transcricoes
├── 02-extraction/   — MIUs validados
├── 03-dna/          — Voice DNA + Thinking DNA
├── 04-drivers/      — Drivers psicologicos com evidencia
├── 05-psychometric/ — MBTI, Enneagram, DISC, Big Five
├── 06-profile/      — POC completo (6 modulos)
├── 07-validation/   — Smoke tests + fidelidade
└── 08-agent/        — Agente pronto (agent.md + KB + tasks + skill)
```

## Instalacao

Automatica no final do pipeline (Fase 8):
1. Output copiado para `agents/{slug}/`
2. Skill registrada em `.claude/commands/{slashPrefix}.md`
3. Ativacao imediata via `/{slashPrefix}`

## Dependencias

- **Squad Creator Premium** (obrigatorio) — base de Voice/Thinking DNA
- **Zona Genialidade** (opcional) — assessments psicometricos formais
