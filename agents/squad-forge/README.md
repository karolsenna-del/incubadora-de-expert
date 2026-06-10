# Squad Forge

Extrai processos complexos da sua cabeca e transforma em squads Auroq funcionais com profundidade real. Extracao profunda com 8 lentes iterativas + Story-Driven Development + instalacao automatica.

## Ativacao

```
/squadForge
```

## Modos

| Modo | Comando | O que faz |
|------|---------|-----------|
| Criar | `*start` | Pipeline completo: extracao → playback → arquitetura → montagem → instalacao |
| Atualizar | `*update {squad}` | Modificacao cirurgica preservando profundidade |
| Consertar | `*fix {squad}` | Audit + auto-fix + lista de fixes manuais |
| Refazer | `*rebuild {squad}` | Reverse-extract + reconstrucao com profundidade nova |
| Auto-test | `*self-test` | Audita o proprio squad-forge |

## Agentes

| Agente | Funcao |
|--------|--------|
| @forge-chief | Orquestrador do pipeline, playback validation, modo selector |
| @process-archaeologist | Especialista em extracao profunda de processos (8 lentes) |
| @forge-smith | Construtor Auroq, PRD/Stories, hard gates de profundidade |

## Pipeline (modo Criar)

```
Fase 0: Setup → Fase 1: Extracao → Fase 2: Playback
→ Fase 3: Arquitetura + PRD + Stories + Tracker
→ Fase 4: Montagem com profundidade obrigatoria
→ Fase 5: Validacao + Instalacao Automatica
```

## Quality Gates

- **QG-SF-001:** Extraction Completeness — >=15 PUs, 6/8 lentes, confianca >=0.7
- **QG-SF-002:** User Validation — playback aprovado pelo dono
- **QG-SF-003:** Architecture Coherence — agentes coerentes + PRD + Stories + Tracker
- **QG-SF-004:** Nuclear Structure + Profundidade — squad-validator PASS + self-audit (agentes >=250 linhas, 3+ Output Examples, 3+ Immune triggers, KB rica)
- **QG-SF-005:** Squad Operational — smoke tests + aprovacao + instalacao automatica

## Squad Autocontido (NON-NEGOTIABLE)

Squad gerado e SELF-CONTAINED. Funciona zipado e enviado pra qualquer maquina.

- **PROIBIDO:** ref a `docs/knowledge/...`, `squads/etlmaker/kbs/...`, `business/...`, `~/euriler-brain/`, absolute paths `/Users/...` em runtime
- **PERMITIDO:** refs internas (`squads/{this-squad}/`), framework Auroq (`.auroq-core/`), URLs/APIs externas
- **Build-time:** fontes externas sao LIDAS, ADAPTADAS e ESCRITAS como conteudo proprio em `squads/{name}/data/`
- **Hard gate:** QG-SF-004 falha se grep encontra ref externa proibida

Razao: squads sao distribuidos pra alunos da Mentoria Arcane. Refs externas quebram fora do ambiente original.

## Profundidade obrigatoria (hard gates)

Cada agente gerado deve ter:
- >=250 linhas
- >=3 OUTPUT EXAMPLES concretos do processo
- >=3 IMMUNE SYSTEM triggers rastreaveis a PUs
- >=5 Frases-Chave (Voice DNA)
- >=5 regras NUNCA + >=5 regras SEMPRE

KB minimum por tipo:
- Operacional: >=800 linhas
- Analitico/Criativo: >=600 linhas
- Dev/Tecnico: >=400 linhas

Thresholds em `data/quality-thresholds.yaml`.

## Story-Driven Development (Article III Constitution)

Cada squad gerado vem com:
- `docs/prd/squad-{slug}.md` — PRD com FRs/NFRs/CONs/SCs rastreaveis aos PUs
- `docs/stories/squad-forge/{slug}/` — 1 epic story (5 ACs = 5 QGs) + 1 story por fase
- `business/campanhas/squad-{slug}/tracker.md` — Project Tracker Protocol

## Instalacao automatica (Fase 5)

Apos QG-SF-005 PASS:
1. Backup automatico do squad anterior em `squads/_archive/`
2. Cópia `minds/{slug}/04-squad/` → `squads/{name}/`
3. Skill registrada em `.claude/commands/{slashPrefix}.md`
4. MEMORY.md atualizado em "Squads Instalados"
5. Tracker do squad atualizado com LOG
6. Validacao pos-instalacao + rollback se falhar

Squad fica imediatamente disponivel via `/{slashPrefix}`.

## Output

Squad completo em `squads/{name}/`:

```
{name}/
├── agents/      — Agentes do squad (>=250 linhas cada, com Output Examples + Immune System)
├── tasks/       — Tasks executaveis (8 campos TASK-FORMAT-SPEC-V1)
├── workflows/   — Pipeline do squad
├── data/        — KB rica (Regras Cardinais, Decision Trees, Tabelas de Referencia)
├── checklists/  — Validacoes
├── squad.yaml   — Configuracao
└── README.md    — Documentacao
```

## Dependencias

- Opcional: ETLmaker (para incorporar conhecimento existente em squads operacionais)
- Opcional: `squad-validator.js` em `.auroq-core/development/scripts/squad/` (fallback pra checklist nuclear)
