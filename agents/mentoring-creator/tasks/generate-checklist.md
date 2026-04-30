---
task: "Generate Checklist"
responsavel: "@mentoring-chief"
execution_type: "interactive"
gate: "QG-MC-010"
---

# Task: Checklist de Producao

## Purpose

Gerar checklist completo de TUDO que o usuario precisa produzir/fazer pra colocar o programa de mentoria no ar. O squad DESENHOU, agora lista o que FALTA FAZER.

## Steps

### Step 1: Varredura

Varrer tudo que foi desenhado nas fases anteriores e listar cada item que precisa ser PRODUZIDO ou CONFIGURADO.

### Step 2: Categorizar por Modalidade

Organizar conforme modalidade escolhida:

**MENTORIA (Individual e Grupo):**
- Assessments e ferramentas
- Templates de sessao e frameworks
- Conteudos complementares (gravar, editar, subir)
- Plataforma (area de membros, acessos)
- Comunidade e suporte async
- Onboarding e offboarding
- Comercial (pagina de vendas, checkout, agenda)

**CONSULTORIA (adicional):**
- Proposta comercial e deck
- Templates de deliverables
- Project management
- SLAs de entrega

**TRANSVERSAL (todos os modos):**
- Branding em todos os materiais
- Produto estruturado (cartao de identidade)
- Lancamento (data, comunicacao, criativos)

### Step 3: Priorizar

Pra cada item:
- **P1** — bloqueia lancamento (sem isso nao abre)
- **P2** — importante (melhora muito, mas da pra comecar sem)
- **P3** — nice to have (pode adicionar depois)

### Step 4: Gerar Checklist

```markdown
# CHECKLIST DE PRODUCAO — {Nome do Programa}

## P1 — Bloqueia Lancamento
- [ ] {item} — origem: {fase/sessao}
- [ ] {item} — origem: {fase/sessao}
...

## P2 — Importante
- [ ] {item} — origem: {fase/sessao}
...

## P3 — Nice to Have
- [ ] {item} — origem: {fase/sessao}
...

## Resumo
- Total de itens: {N}
- P1 (bloqueiam): {N}
- P2 (importantes): {N}
- P3 (nice to have): {N}
```

### Step 5: Apresentar e Aprovar

Mostrar checklist completo. Perguntar: "Falta alguma coisa? Cobre tudo?"

## Quality Gate QG-MC-010

- Checklist completo
- Categorizado
- Priorizado (P1/P2/P3)
- Cada item com referencia de origem
- **Usuario confirmou que cobre tudo**

## OUTPUT FINAL

```
=== MENTORING CREATOR — CONCLUIDO ===

Seu programa de mentoria esta:
- Estruturado (fases, sessoes, entregaveis)
- Com branding definido (nome, posicionamento)
- Empacotado (proposta de valor, preco, cartao de identidade)
- Revisado contra o PRD (zero gaps)
- Com checklist de producao (o que falta pra colocar no ar)

Proximo passo: executar o checklist P1 e lancar.
```
