---
task: "Review and Finalize"
responsavel: "@course-chief"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Produto completo e empacotado (QG-CC-008 aprovado) + PRD como referencia"
Saida: "Produto revisado contra PRD, gaps identificados, expert deu aval final"
Checklist:
  - "Review autonomo contra PRD executado"
  - "Report de review gerado (checks passed, gaps, inconsistencias)"
  - "Report apresentado ao expert"
  - "Debate realizado ate satisfeito"
  - "Expert deu aval final explicito"
execution_type: "interactive"
---

# Task: Review and Finalize — Fase 8: Revisao Final

**Task ID:** course-creator/review-finalize
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Updated:** 2026-04-08
**Category:** Review
**Execution Type:** Interactive

---

## Executive Summary

Fase 8 do pipeline. Revisao em 2 estagios: primeiro o squad faz um review AUTONOMO contra o PRD (checklist automatico de tudo que foi prometido vs entregue), depois apresenta o report pro expert e debate ajustes finais. So avanca com aval final explicito.

**Gate:** QG-CC-009 — Review Final Aprovado

---

## Step-by-Step Execution

### ESTAGIO 1: Review Autonomo Contra PRD

O Chief faz uma varredura completa, verificando se cada compromisso do PRD foi entregue.

#### Step 1: Carregar PRD + Todos os Artefatos

Ler:
- PRD (v2 com metodologia)
- Estrutura macro do curso (Fase 3)
- Estrutura de cada modulo (Fase 4)
- Roteiros de cada aula (Fase 5)
- Branding aprovado (Fase 6)
- Cartao de identidade do produto (Fase 7)

#### Step 2: Checklist Contra PRD

Para CADA secao do PRD, verificar:

**Secao 1 — Visao Geral:**
- [ ] Nome do curso definido (pode ter mudado na Fase 6 — branding)
- [ ] Publico-alvo mantido consistente em todas as fases
- [ ] Transformacao A→B e entregue pela jornada do curso

**Secao 2 — Contexto de Mercado:**
- [ ] Posicionamento definido na Fase 1 esta refletido no branding (Fase 6)
- [ ] Diferenciais planejados foram incorporados

**Secao 3 — Parametros:**
- [ ] Duracao estimada bate com numero real de aulas/modulos
- [ ] Formato de entrega consistente

**Secao 4 — Entregaveis Comprometidos:**
- [ ] Cada entregavel listado no PRD existe no produto final
- [ ] Nenhum entregavel prometido ficou de fora
- [ ] Nenhum entregavel foi adicionado sem justificativa

**Secao 5 — Metodologia:**
- [ ] Metodologia mapeada na Fase 2 esta incorporada na estrutura do curso
- [ ] Naming da metodologia esta consistente (se definido na Fase 6)

**Secao 6 — Criterios de Qualidade:**
- [ ] Todos os quality gates anteriores (001-008) passaram

**Secao 7 — Restricoes:**
- [ ] Nenhuma restricao foi violada
- [ ] Decisoes registradas durante o processo foram respeitadas

**Cross-check adicional:**
- [ ] Branding (Fase 6) consistente com cartao de identidade (Fase 7)
- [ ] Proposta de valor (Fase 7) alinhada com posicionamento (Fase 6)
- [ ] Pricing (Fase 7) coerente com benchmark (Fase 1)

#### Step 3: Gerar Review Report

```
=== REVIEW AUTONOMO — {Nome do Curso} ===

CHECKS PASSED: {X de Y}

✅ APROVADOS:
- {check 1}
- {check 2}
...

⚠️ GAPS ENCONTRADOS:
- {gap 1}: {descricao + onde esta o problema}
- {gap 2}: ...

❌ INCONSISTENCIAS:
- {inconsistencia 1}: {o que o PRD diz vs o que foi entregue}

RECOMENDACOES:
- {acao 1 pra resolver gap/inconsistencia}
- {acao 2}
```

---

### ESTAGIO 2: Review Humano

#### Step 4: Apresentar Report ao Expert

Mostrar o review report completo em formato legivel.

Se ZERO gaps e ZERO inconsistencias:
```
Review autonomo passou 100%. Tudo que o PRD prometeu foi entregue.
Quer revisar algo manualmente antes de dar o aval final?
```

Se tem gaps ou inconsistencias:
```
Encontrei {N} gaps e {M} inconsistencias. Vamos debater cada um?
```

#### Step 5: Debate de Ajustes

Para cada gap/inconsistencia:
- Apresentar o problema
- Debater com expert: resolver, aceitar como esta, ou ajustar PRD
- Registrar decisao

Opcoes por gap:
1. **Resolver** — voltar pra fase correspondente e fazer o ajuste
2. **Aceitar** — registrar decisao ("expert aceitou que X nao sera entregue porque Y")
3. **Ajustar PRD** — se o PRD mudou durante o processo, atualizar

#### Step 6: Revisao Macro da Jornada

Mesmo com review autonomo OK, fazer a revisao macro:
- Apresentar jornada completa (modulos em sequencia com resumo)
- Verificar: A→B e clara? Modulos conectam? Aluno sempre sabe onde esta?
- Expert avalia

#### Step 7: Quality Gate QG-CC-009

Protocolo de 5 passos:

1. **APRESENTAR** review report + status de gaps resolvidos + visao macro
2. **PERGUNTAR** "Satisfeito com o produto como um todo?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito
4. **APROVACAO EXPLICITA** — expert diz "aprovado" / "aval final"
5. **HANDOFF** — passar pra Fase 9 (generate-checklist)

---

## Veto Conditions

- VETO se pular o review autonomo contra PRD (Estagio 1 obrigatorio)
- VETO se gaps foram encontrados mas nao debatidos com expert
- VETO se declarar QG-CC-009 PASS sem aval final explicito do expert
- VETO se iniciar revisao com qualquer fase anterior incompleta

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Review encontra gap critico | Debater com expert. Se precisa voltar pra fase anterior, voltar |
| Expert quer mudar algo ja aprovado | Normal. Marcar como re-work, ajustar, re-aprovar |
| Expert quer adicionar modulo/aula | Voltar pra fase correspondente. Re-executar review depois |
| Expert discorda do review autonomo | Debater. Se expert justifica, aceitar e registrar decisao |
| Muitos gaps | Priorizar. Resolver criticos primeiro. Expert decide o que pode ficar pra depois |

---

**Task Status:** Ready for Production
