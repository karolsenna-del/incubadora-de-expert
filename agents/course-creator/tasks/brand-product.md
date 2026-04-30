---
task: "Brand Product"
responsavel: "@brand-architect"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Curso completo (QG-CC-006 aprovado) + PRD + benchmarking"
Saida: "Branding aprovado: naming, posicionamento, identidade verbal"
Checklist:
  - "Naming do programa testado nos 7 criterios"
  - "Naming de metodologia/fases avaliado"
  - "Onlyness Statement completa e validada"
  - "Identidade verbal definida"
  - "Charismatic Brand Test rodado (score /25)"
  - "Expert aprovou branding"
execution_type: "interactive"
---

# Task: Brand Product — Fase 6

**Task ID:** course-creator/brand-product
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-04-08
**Category:** Post-Production
**Execution Type:** Interactive

---

## Executive Summary

O Brand Architect trabalha o branding VERBAL e ESTRATEGICO do produto. Naming do programa, naming da metodologia (se nao tem), posicionamento via Onlyness Statement, identidade verbal e check de consistencia.

**Gate:** QG-CC-007 — Branding Aprovado

---

## Step-by-Step Execution

### Step 1: Carregar KB + Contexto

- Carregar `data/branding-kb.md`
- Ler PRD (especialmente secao 2: Contexto de Mercado e secao 5: Metodologia)
- Revisar estrutura do curso das fases anteriores

### Step 2: Naming do Programa

Se o nome e provisorio ou generico:
1. Gerar 5-10 opcoes baseadas na essencia do curso
2. Testar cada uma nos 7 criterios (score /35)
3. Testar nos 4 testes rapidos
4. Apresentar top 3 com scores:

```
=== NAMING — TOP 3 ===

1. {Nome A} — Score: {X}/35
   Forte em: {criterios}. Fraco em: {criterios}.

2. {Nome B} — Score: {X}/35
   ...

3. {Nome C} — Score: {X}/35
   ...

Qual te pega? Quer explorar mais opcoes?
```

Se o expert ja tem nome e gosta:
- Testar nos 7 criterios
- Se >= 25: validar e seguir
- Se < 25: mostrar gaps, sugerir ajustes

### Step 3: Naming de Metodologia e Fases

Revisar o mapa da metodologia (PRD secao 5):
- Se ja tem nomes: avaliar e sugerir melhorias se score baixo
- Se nao tem: gerar opcoes seguindo regras (3-7 passos, memoravel, visual antes de texto)
- Escolher pattern visual (piramide, ciclo, funil, escada, etc.)

### Step 4: Onlyness Statement

Construir com o expert:

```
Vamos completar a formula:

"Nosso {oferta} e o UNICO {categoria} que {diferencial}."

Com base no benchmarking (Fase 1) e na sua metodologia:
- Oferta: {sugestao}
- Categoria: {sugestao}
- Diferencial: {sugestao}

Isso faz sentido? Vamos ajustar ate ficar verdadeiro, relevante,
defensavel e motivador.
```

Validar com 4 perguntas. Se falha → iterar.

### Step 5: Identidade Verbal

Definir com o expert:
- Tom de comunicacao do produto (alinhado com marca do expert)
- Vocabulario caracteristico (palavras que o produto usa e nao usa)
- Hierarquia de comunicacao:
  - Headline (1 frase)
  - Descricao expandida (1 paragrafo)
  - Detalhamento (estrutura completa)

### Step 6: Check de Consistencia

Rodar Charismatic Brand Test (5 dimensoes, score /25):

```
=== CHARISMATIC BRAND TEST ===

| Dimensao | Score | Observacao |
|----------|-------|------------|
| Clareza | /5 | ... |
| Diferenciacao | /5 | ... |
| Autenticidade | /5 | ... |
| Relevancia | /5 | ... |
| Coerencia | /5 | ... |
| TOTAL | /25 | {interpretacao} |
```

Se < 15: identificar dimensoes fracas, propor melhorias.

### Step 7: Quality Gate QG-CC-007

Protocolo de 5 passos:

1. **APRESENTAR** resumo completo do branding (naming + posicionamento + identidade + score)
2. **PERGUNTAR** "Isso bate? O que ajustaria?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito
4. **APROVACAO EXPLICITA** — expert diz "fechou"
5. **HANDOFF** — passar pra Fase 7 (package-product)

---

## Veto Conditions

- VETO se nome aprovado sem testar nos 7 criterios
- VETO se nao tem Onlyness Statement
- VETO se Charismatic Brand Test nao foi rodado
- VETO se expert nao aprovou explicitamente

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert ama o nome provisorio | Testar nos 7 criterios. Se score >= 25, validar. Se nao, mostrar gaps |
| Expert rejeita todas as opcoes | Entender o que nao funcionou. Gerar nova rodada |
| Onlyness Statement nao funciona | Diferencial pode nao estar claro. Voltar pro PRD e debater |
| Score do Charismatic Brand Test baixo | Identificar dimensoes fracas. Propor melhorias especificas |

---

**Task Status:** Ready for Production
