---
task: "Build Destaques"
responsavel: "@vitrine-strategist"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Link bio fechado + nucleo completo + ativos do aluno (produto, depoimentos)"
Saida: "3 destaques FIXOS (Sobre Mim / Produto / Depoimentos) com conteudo + capa-conceito + stories produzidos se aluno aceitou"
Checklist:
  - "Destaque 1 (Sobre Mim) — conteudo estruturado + capa-conceito"
  - "Destaque 2 (Produto) — conteudo estruturado + capa-conceito OU placeholder"
  - "Destaque 3 (Depoimentos) — estrutura + capa-conceito OU placeholder"
  - "Loop por destaque (1 por vez)"
  - "Oferta de producao apos cada destaque"
  - "Stories produzidos se aluno aceitou"
  - "Aluno aprovou cada destaque explicitamente"
execution_type: "interactive"
---

# Task: Build Destaques — Items 4-6 da Vitrine

**Task ID:** posicionamento-digital/build-destaques
**Version:** 1.0.0
**Category:** Vitrine / Items 4-6

---

## Executive Summary

Items 4-6. Os 3 destaques FIXOS da Mentoria Arcane: Sobre Mim / Produto / Depoimentos. Pra cada: estrutura + capa-conceito + oferta de producao de stories.

Sem mais de 3. Sem menos de 3. Os 3 sao OBRIGATORIOS.

---

## Inputs

- Nucleo completo
- Bio + link bio fechados
- Ativos: produto pronto?, depoimentos?, foto/face/identidade visual definida?

**KB consultada:** `data/vitrine-instagram-2026.md` (secao Destaques)

---

## Outputs

- 3 destaques estruturados (conteudo + capa-conceito)
- Stories produzidos quando aluno aceitou
- Placeholders + instrucoes onde aluno nao tem ativo

---

## Step-by-Step Execution

### Step 1: Iniciar Item

```
Vitrine, items 4-6 de 9: DESTAQUES.

3 destaques fixos da Mentoria Arcane (nao mais, nao menos):
- DESTAQUE 1: Sobre Mim
- DESTAQUE 2: Produto principal
- DESTAQUE 3: Depoimentos

Vamos 1 por vez. Cada um com seu check + oferta de producao.
```

### Step 2: Destaque 1 — SOBRE MIM

#### Sub-step 2a: Apresentar Estrutura

```
═══════════════════════════════════════
DESTAQUE 1 — SOBRE MIM
═══════════════════════════════════════

Conteudo proposto (sequencia de stories):

Story 1: Apresentacao + foto
  "[Nome], [profissao/credencial]"

Story 2: O que faz / pra quem
  "Ajudo [quem ajuda] a [transformacao]"

Story 3: Por que faz isso (missao)
  "[Origem da missao — historia breve, ponto de virada]"

Story 4: Resultado/impacto (1 numero ou marco)
  "[+200 lideres / 5 anos de atuacao / etc.]"

Story 5: Como conhecer mais (CTA pra link bio)
  "Quer conhecer meu trabalho? Link na bio"

═══════════════════════════════════════
CAPA-CONCEITO:
═══════════════════════════════════════

Frase/palavra que aparece: "SOBRE" OU "QUEM EU SOU"
Elemento visual conceitual: foto sua sorrindo (face em foco)
Hierarquia: face em destaque + palavra como ancora visual

NAO DEFINO: paleta, fonte, layout (isso fica com voce / designer / IA visual)

═══════════════════════════════════════

Bate? Algo pra ajustar?
```

#### Sub-step 2b: Loop ate Check

Aluno aprova ou pede ajuste. Loop.

#### Sub-step 2c: Oferta de Producao

```
Destaque 1 aprovado.

Quer que eu PRODUZA os stories completos?
Incluindo texto frame a frame, com voz-Veridiana (vem do seu nucleo).

A) SIM, produz tudo
B) NAO, ja sei escrever
```

Se A: produz cada story com texto completo + nota visual.

### Step 3: Destaque 2 — PRODUTO

#### Sub-step 3a: Avaliar se tem Produto

```
DESTAQUE 2 — PRODUTO

Voce tem produto pronto pra apresentar AGORA?
- Lancado e disponivel pra compra: SIM
- Em construcao ou planejado mas nao vende: NAO
```

#### Sub-step 3b: Se SIM — Apresentar Estrutura

```
═══════════════════════════════════════
DESTAQUE 2 — [NOME DO PRODUTO]
═══════════════════════════════════════

Conteudo proposto (sequencia de stories):

Story 1: Capa do produto + nome
Story 2: Pra quem e (publico especifico) — usa Ponto 3 + nicho
Story 3: Qual transformacao — usa Ponto 11 (beneficios)
Story 4: Como funciona (mecanismo resumido)
Story 5: Prova (1 case OU estatistica forte)
Story 6: Oferta (preco, condicoes, urgencia se aplicavel)
Story 7: CTA com link clicavel

═══════════════════════════════════════
CAPA-CONCEITO:
═══════════════════════════════════════

Frase/palavra: "[NOME DO PRODUTO]" OU 1 beneficio chave
Elemento visual: icone do produto OU foto representativa
Hierarquia: nome do produto + beneficio principal em segunda hierarquia

═══════════════════════════════════════

Bate?
```

#### Sub-step 3c: Se NAO — Placeholder

```
═══════════════════════════════════════
DESTAQUE 2 — PRODUTO — PLACEHOLDER
═══════════════════════════════════════

Voce ainda nao tem produto pronto pra apresentar.

QUANDO TIVER, USE A ESTRUTURA:

Story 1: Capa + nome
Story 2: Pra quem e
Story 3: Transformacao
Story 4: Como funciona (mecanismo)
Story 5: Prova
Story 6: Oferta
Story 7: CTA com link

ACOES PENDENTES:
□ Lancar/definir produto principal
□ Voltar aqui pra estruturar stories do destaque

CAPA-CONCEITO RECOMENDADA:
Frase: "[NOME DO PRODUTO]"
Elemento: icone OU foto representativa
Hierarquia: nome + beneficio

═══════════════════════════════════════
```

#### Sub-step 3d: Loop + Oferta de Producao

Se tem produto, loop + oferta como Destaque 1.
Se placeholder, segue.

### Step 4: Destaque 3 — DEPOIMENTOS

#### Sub-step 4a: Avaliar se tem Depoimentos

```
DESTAQUE 3 — DEPOIMENTOS

Voce tem depoimentos coletados (texto, video, prints)?
- Tenho mais de 3: SIM
- Tenho 1-2: PARCIAL
- Nenhum: NAO
```

#### Sub-step 4b: Estrutura

```
═══════════════════════════════════════
DESTAQUE 3 — DEPOIMENTOS
═══════════════════════════════════════

Conteudo proposto:

Story 1: Capa "Depoimentos" OU "Quem fala da gente"
Stories 2-N: Cada depoimento

REGRAS:
- Variar formatos: texto, video, print, antes/depois
- Por ordem de IMPACTO (mais forte primeiro)
- SEMPRE com nome + foto se possivel (mais convincente)
- Atualizar regularmente (algoritmo prioriza atualizados)

═══════════════════════════════════════
CAPA-CONCEITO:
═══════════════════════════════════════

Frase/palavra: "DEPOIMENTOS" OU "PROVAS" OU "RESULTADOS"
Elemento visual: estrelas, coracao, ou icone de balao de fala
Hierarquia: palavra-titulo + elemento visual

═══════════════════════════════════════

Se voce tem PARCIAL ou NAO, vou listar AcoEs.
```

#### Sub-step 4c: Se PARCIAL ou NAO

```
ACOES:
□ Coletar depoimentos desde a PRIMEIRA venda
   - Print de conversa de cliente satisfeito (WhatsApp)
   - Video curto pedido apos resultado (60-90s)
   - Screenshot de transformacao mensuravel (antes/depois numero)
□ Variar formatos (texto, video, print)
□ Pedir SEMPRE nome + foto (mais convincente)
□ Voltar aqui quando tiver pelo menos 3

PLACEHOLDER ATIVO ate la — destaque vazio com a capa-conceito 
estruturada.
```

#### Sub-step 4d: Oferta de Producao

```
Se tem depoimentos: quer ajuda pra organizar a sequencia ideal?
Se nao tem: quer ajuda pra montar template de pedido de depoimento 
(o que pedir pro cliente, como abordar)?
```

### Step 5: Consolidar 3 Destaques

```
═══════════════════════════════════════
DESTAQUES — RESUMO
═══════════════════════════════════════

1. SOBRE MIM ✓
   Capa: "[conceito]"
   Stories: [produzidos / estrutura]

2. PRODUTO ✓ (ou ⚠️ placeholder)
   Capa: "[conceito]"
   Stories: [produzidos / estrutura / placeholder]

3. DEPOIMENTOS ✓ (ou ⚠️ placeholder)
   Capa: "[conceito]"
   Stories: [organizados / placeholder]

═══════════════════════════════════════

Items 4-6 de 9: ✓
```

### Step 6: Atualizar Estado

```yaml
vitrine.destaques:
  - id: "sobre-mim"
    conteudo_estrutura: [...]
    stories_produzidos: [...] | null
    capa_conceito: {frase, elemento, hierarquia}
    aluno_aprovou: true
  - id: "produto"
    conteudo_estrutura: [...]
    stories_produzidos: [...] | null
    capa_conceito: {...}
    placeholder: "..." | null
    aluno_aprovou: true
  - id: "depoimentos"
    conteudo_estrutura: [...]
    stories_produzidos: [...] | null
    capa_conceito: {...}
    placeholder: "..." | null
    aluno_aprovou: true
```

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno quer adicionar 4o, 5o destaque | Confronta: "3 e fixo. Mais dilui. Quer adicionar depois por conta — ok. Aqui sao os 3 core." |
| Aluno quer trocar 1 dos 3 fixos (ex: tirar Depoimentos) | Confronta com base na regra Arcane. Os 3 sao OBRIGATORIOS. |
| Aluno quer entregar capa-design (paleta + fonte) | "Squad nao faz design. So conceito. Design fica com voce / designer / IA visual." |
| Aluno tem 50+ depoimentos e quer destaque cheio | Recomenda curar 8-15 dos mais fortes — destaque com 50 stories perde retencao |
| Aluno e iniciante em tudo (sem produto, sem depoimento) | 2 placeholders + foco no Destaque 1 (Sobre Mim) bem feito |

---

**Task Status:** Ready for Production
