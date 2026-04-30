---
task: "Review Finalize"
responsavel: "@mentoring-chief"
execution_type: "interactive"
gate: "QG-MC-009"
---

# Task: Revisao Final

## Purpose

Review autonomo do squad contra o PRD + aval humano final.

## Steps

### Step 1: Review Autonomo

Reler PRD e verificar contra tudo que foi produzido:

**Checklist automatico:**
- [ ] Modalidade escolhida bate com o que foi desenhado?
- [ ] Duracao bate com PRD?
- [ ] Frequencia de sessoes bate?
- [ ] Todos os entregaveis prometidos no PRD foram desenhados?
- [ ] Metodologia do expert esta refletida na estrutura?
- [ ] Branding esta consistente em todas as pecas?
- [ ] Cartao de identidade esta completo?
- [ ] Proposta de valor responde as 3 perguntas?
- [ ] Preco esta justificado?
- [ ] Onboarding esta desenhado?
- [ ] Offboarding esta desenhado?
- [ ] Assessments estao definidos?
- [ ] Comunidade/suporte esta definido?
- [ ] Nenhuma restricao do PRD foi violada?

### Step 2: Report de Gaps

Se encontrar gaps:
```
=== REVIEW AUTONOMO ===

Resultado: {X} de {Y} itens OK

GAPS ENCONTRADOS:
1. {Gap 1}: {o que falta} — referencia PRD secao {N}
2. {Gap 2}: {o que falta}
...

RECOMENDACAO: {resolver gaps antes de aprovar / gaps sao menores e podem ser aceitos}
```

Se nao encontrar gaps:
```
=== REVIEW AUTONOMO ===

Resultado: {Y} de {Y} itens OK — ZERO gaps

O programa esta completo e coerente com o PRD.
```

### Step 3: Review Humano

Apresentar report pro usuario. Debate ajustes finais. Aval explicito.

## Quality Gate QG-MC-009

- Review autonomo executado
- ZERO gaps (ou gaps resolvidos)
- **Usuario deu aval final**
