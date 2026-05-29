# Slide Forge v2

> **Versão 2.0.0** — release 2026-05-08. Major rebuild via squad-forge `*rebuild`: profundidade obrigatória nos agentes (Output Examples + Immune System), autocontido (zero refs externas), story-driven (PRD + 7 phase stories + tracker).

Pipeline de produção de conteúdo de apresentação. Da definição do tema → teoria robusta validada cabo a rabo → slides aprovados bloco a bloco → briefing visual cinemático pronto pro Manus.

Funciona pra: workshop, palestra, aula, treinamento.

---

## Ativação

```
/slideForgeV2          # comando explícito da v2
/slideForge            # alias backward-compat (aponta pro mesmo squad v2)
```

Aluno que tinha v1 instalada e atualizou: ambos os comandos chamam a v2 agora. Greeting do squad mostra "SLIDE FORGE v2" pra confirmar que a versão correta está rodando.

---

## Migrando da v1 → v2

Se você tem squad slide-forge antigo (v1.0.0) instalado:

1. Pull/sync do repo atualizado
2. Rode `/slideForgeV2` — vai abrir greeting confirmando v2
3. Pipeline funciona igual — você não precisa reaprender nada
4. **Diferenças invisíveis pra você**, visíveis no resultado:
   - Agentes com profundidade real (3 Output Examples + 10 Immune triggers cada)
   - Squad funciona zipado em qualquer máquina (REGRA AUTOCONTIDO)
   - Bugs estruturais corrigidos (workflow YAML, paths)

Se o greeting ainda mostrar versão antiga, atualiza o repo e tenta de novo.

---

## Agentes

| Agente | Tier | Role |
|--------|------|------|
| `@slide-forge-chief` | Orchestrator | Conduz o pipeline. Captura despejo, debate teoria, transpõe slides, gerencia loop de aprovação por bloco (Fases 0-6) |
| `@visual-briefer` | Tier 1 | Captura direção visual (vibe + refs + design system), monta style prefix, escreve briefing cinemático slide a slide pro Manus (Ponte 6→7 + Fase 7) |

---

## Pipeline (7 fases)

```
0. SETUP                    /slideForge
1. DEFINIÇÃO DO EVENTO      tema · audiência · tempo · função
2. MAPEAR FONTES + DESPEJO  pergunta usuário onde está material
2.5. ESQUELETO MACRO        lista de blocos do evento
                            ✋ QG-1: esqueleto aprovado
3. APROFUNDAR TEORIA        loop por bloco — debate profundo
                            ↳ imersão → debate → A/B/C pontual
                              → síntese organizada → aprovação → salva
4. VALIDAÇÃO CABO A RABO    apresenta teoria inteira pro usuário validar
                            ✋ QG-2 (CRÍTICO): teoria validada
5-6. PRODUÇÃO DE SLIDES     loop por bloco — transpõe + revisa + aprova
                            ✋ QG-3 (por bloco) + QG-4 (consolidador)
6→7. DIREÇÃO VISUAL         vibe + refs + design system + negativos
                            ✋ QG-5: direção capturada
7. BRIEFING MANUS           style prefix + briefing slide a slide
                            ✋ QG-6: briefing entregue
```

---

## Outputs

3 arquivos por evento:

| Arquivo | O que tem |
|---|---|
| `event-definition.md` + `sources-map.md` + `skeleton.md` + dump files + **doc de construção** | Cérebro do evento: teoria robusta + decisões + raciocínio |
| **Doc de slides** (path apontado pelo usuário) | Conteúdo enxuto dos slides aprovado bloco a bloco |
| **Briefing Manus** (workspace path + cópia em local fácil acesso) | Briefing visual cinemático pra colar no Manus + Nano Banana Pro produzir |

---

## Knowledge Base

8 arquivos em `data/`:

**Pré-existentes (cópias de referência):**
- `slides-content-reference.md` — 167 slides do workshop NDF original como benchmark técnico
- `manus-rules.md` — processo de briefing pro Manus (cópia do `business/processos/manus-slides-processo.md`)
- `briefing-examples/` — 6 briefings completos (workshop NDF + pitch Arcane)

**Construídos:**
- `cardinal-rules.md` — 17 regras inegociáveis do squad
- `debate-protocol.md` — como conduzir o debate profundo da Fase 3
- `synthesis-template.md` — formato de apresentação de síntese
- `visual-direction-template.md` — template do doc de direção visual
- `enxutar-rules.md` — princípios de densidade e corte 40%

---

## Quality Gates

| Gate | Quando | Critério |
|---|---|---|
| QG-SF-01 | Após Fase 2.5 | Esqueleto macro aprovado |
| **QG-SF-02** | Após Fase 4 | **Teoria inteira validada (CRÍTICO)** |
| QG-SF-03 | Por bloco na Fase 5-6 | Slides do bloco N aprovados |
| QG-SF-04 | Após todos blocos | Todos slides aprovados |
| QG-SF-05 | Após Ponte 6→7 | Direção visual capturada |
| QG-SF-06 | Após Fase 7 | Briefing entregue |

---

## Comandos

| Comando | Descrição |
|---|---|
| `/slideForge` | Ativar squad |
| `*start` | Iniciar pipeline novo |
| `*status` | Mostrar estado atual |
| `*despejar` | Ativar modo despejo bruto |
| `*revise-theory` | Voltar pra debate profundo |
| `*resume` | Retomar pipeline pausado |
| `*help` | Listar comandos |
| `*exit` | Sair |

---

## Filosofia

**Não invento, não chuto.** Se não tem fonte, paro e pergunto.

**Despejo do usuário é fonte primária.** Captura íntegra. Sem filtro/resumo/tradução.

**Debate antes de síntese.** Fase 3 não é entrevista A/B/C. É diálogo profundo. A/B/C é ferramenta dentro do debate.

**Validação cabo a rabo é gate crítico.** Sem teoria inteira validada, slides não saem.

**Slides traduzem a teoria com fidelidade.** Não simplificam genericamente. Não inventam ângulo novo.

**Estilo aula/apresentação inteligente.** Nem TEDx (raso), nem palestra-livro (denso).

**Estética visual é do usuário do evento.** Style prefix é construído da direção visual capturada — nunca template fixo.

**Reconhece mancada e corrige rápido.** Sem defender, sem enrolar.

---

## Origem

Squad criado em **2026-04-29** via Squad Forge a partir de pré-extração das conversas com Euriler durante a produção do workshop NDF 25-26/04/2026 (10+ blocos de teoria + 167 slides + 4 briefings produzidos).

54 PUs extraídos · 7 rounds de extração · 8/8 lentes cobertas.

Versão: 1.0.0
