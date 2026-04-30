---
task: "Benchmark Market + PRD"
responsavel: "@course-creator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Curso definido (QG-CC-001 aprovado)"
Saida: "PRD v1 do produto — documento fonte de verdade pra todo o pipeline"
Checklist:
  - "Conhecimento do expert sobre o mercado coletado"
  - "Mercado BR pesquisado (concorrentes, precos, formatos)"
  - "Mercado gringo pesquisado"
  - "Debate realizado ate consenso"
  - "PRD gerado e aprovado pelo expert"
execution_type: "interactive"
---

# Task: Benchmark Market + Generate PRD — Fase 1

**Task ID:** course-creator/benchmark-market
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-04-08
**Category:** Pre-Production
**Execution Type:** Interactive

---

## Executive Summary

Pesquisa de mercado (BR + gringo) sobre o tema do curso + geracao do PRD (Product Requirement Document) que sera a fonte de verdade pra todo o pipeline. O PRD centraliza tudo: quem e o produto, pra quem, contra quem, com que parametros.

**Gate:** QG-CC-002 — PRD Aprovado

**Dependencia:** WebSearch (necessario pra pesquisa de mercado)

---

## Step-by-Step Execution

### Step 1: Carregar KB + Contexto

- Carregar `data/course-creation-kb.md`
- Ler informacoes da Fase 0 (nome, objetivo, publico, transformacao)

### Step 2: Coletar Conhecimento do Expert

Perguntar:

```
Antes de pesquisar o mercado, me conta o que voce ja sabe:

1. Quem sao seus concorrentes diretos? (nomes, precos, formatos)
2. Tem algum curso gringo que voce admira nesse tema?
3. O que existe no mercado que voce acha bom? E ruim?
4. Qual lacuna voce ve que o seu curso pode preencher?
5. Ja tem ideia de preco?

Se nao sabe alguma dessas, tranquilo — vou pesquisar.
```

### Step 3: Pesquisa de Mercado BR

Usando WebSearch, pesquisar:
- Cursos no mesmo tema no mercado brasileiro
- Precos praticados
- Formatos de entrega (gravado, ao vivo, hibrido)
- Plataformas usadas
- Promessas e posicionamento dos concorrentes
- Pontos fortes e fracos visiveis

Registrar tudo em formato estruturado.

### Step 4: Pesquisa de Mercado Gringo

Usando WebSearch, pesquisar:
- Cursos no mesmo tema no mercado internacional (EN principalmente)
- Precos praticados (converter pra R$ como referencia)
- Formatos e tendencias
- Players de referencia

### Step 5: Debate ate Consenso

Apresentar achados pro expert:

```
=== BENCHMARKING — {tema do curso} ===

MERCADO BR:
1. {Concorrente 1} — R${preco}, {formato}, {promessa}
2. {Concorrente 2} — ...

MERCADO GRINGO:
1. {Referencia 1} — US${preco}, {formato}, {promessa}
2. ...

GAPS IDENTIFICADOS:
- {gap 1}
- {gap 2}

POSICIONAMENTO SUGERIDO:
{onde este curso pode se encaixar}

Isso bate com o que voce ve? O que ajustaria?
```

Debater ate chegar em consenso sobre:
- Quem sao os concorrentes reais
- Onde tem gap de mercado
- Como o curso vai se posicionar

### Step 6: Gerar PRD

Compilar tudo num documento PRD:

```markdown
# PRD — {Nome do Curso}

## 1. Visao Geral
- Nome: {nome do curso, pode ser provisorio}
- Publico-alvo: {quem, nivel, dor principal}
- Transformacao: {ponto A} → {ponto B} (especifica e mensuravel)

## 2. Contexto de Mercado
- Concorrentes mapeados: {quem, preco, formato, entrega}
- Gaps de mercado identificados
- Posicionamento escolhido: {onde este produto se encaixa}
- Diferenciais planejados vs mercado

## 3. Parametros do Programa
- Duracao total estimada
- Formato de entrega: {online, presencial, hibrido}
- Faixa de preco definida (ou range)

## 4. Entregaveis Comprometidos
(checklist que o review final vai verificar)
- [ ] Aulas gravadas (qtd estimada)
- [ ] Materiais de apoio
- [ ] Comunidade/grupo (se houver)
- [ ] Ferramentas/templates
- [ ] (outros definidos no debate)

## 5. Metodologia
(preenchido na Fase 2 — ingestao de docs locais)
- [A ser completado]

## 6. Criterios de Qualidade
- O que define "produto pronto"
- Criterios especificos do formato escolhido

## 7. Restricoes e Decisoes
- O que NAO faz parte do curso
- Decisoes tomadas durante o benchmarking (com justificativa)
- Limites de escopo
```

Salvar PRD no diretorio do projeto (path definido pelo Chief).

### Step 7: Quality Gate QG-CC-002

Protocolo de 5 passos:

1. **APRESENTAR** o PRD completo pro expert
2. **PERGUNTAR** "Isso bate? O que ajustaria?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito (sem limite de rounds)
4. **APROVACAO EXPLICITA** — expert diz "fechou"/"aprovado"
5. **HANDOFF** — passar pra Fase 2 (ingest-methodology)

---

## Veto Conditions

- VETO se pular pesquisa de mercado e ir direto pro PRD
- VETO se PRD nao tiver contexto de mercado (pelo menos 3 concorrentes mapeados)
- VETO se expert nao aprovou explicitamente
- VETO se WebSearch nao estiver disponivel (benchmark sem pesquisa = achismo)

---

## Error Handling

| Cenario | Acao |
|---------|------|
| WebSearch indisponivel | Informar expert. Coletar TODO o conhecimento dele sobre o mercado. Gerar PRD com dados do expert + disclaimer "benchmark pendente" |
| Mercado muito nichado, poucos concorrentes | Normal. Documentar o que encontrou. Buscar adjacentes |
| Expert ja tem benchmarking proprio | Otimo. Validar, complementar com pesquisa, integrar no PRD |
| Expert discorda do posicionamento sugerido | Debater. A decisao final e do expert — registrar justificativa |

---

**Task Status:** Ready for Production
