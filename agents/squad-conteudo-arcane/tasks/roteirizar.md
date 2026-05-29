---
task: "Roteirizar"
responsavel: "@rico-roteirista"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "teoria.md (do Sage) + perfil-tom-de-voz.md (do expert) + formato escolhido"
Saida: "roteiro.md aprovado pelo expert"
Checklist:
  - "Perfil de tom carregado (ou capturado se nao existir)"
  - "Coleta pre-roteiro feita (frases, padroes, evitacoes, crenca, posicionamento)"
  - "Consulta KB embarcada (templates/swipe files) antes de criar do zero"
  - "Hook escolhido com gatilhos identificados (verbal + visual + textual)"
  - "Intro forte que abre 1o looping"
  - "Conteudo com 3-5 elementos notaveis aplicados"
  - "Loopings abertos/fechados em cadeia"
  - "Construcao de raciocinio crescente"
  - "Variacao emocional ao longo"
  - "CTA contextual de reconhecimento (DEPOIS da entrega)"
  - "Fechamento com posicionamento/crenca"
  - "Adaptado ao formato (carrossel: slides / reels: fala+cena+corte)"
  - "Anotacoes pro Mack incluidas"
  - "Analise tecnica (loopings, elementos, retencao previstos)"
  - "Loop iterativo ate expert aprovar"
  - "roteiro.md salvo"
execution_type: "interactive"
---

# Task: Roteirizar — Passo 5 do Fluxo (master)

**Task ID:** squad-conteudo-arcane/roteirizar
**Version:** 1.0.0
**Responsavel:** @rico-roteirista
**Category:** Rotina por Post — Escrita
**Execution Type:** Interactive

---

## Pipeline Visual

```
roteirizar
  |
  v
STEP 0: VERIFICAR PERFIL DE TOM
  Se nao existe → executar capturar-tom.md primeiro
  |
  v
STEP 1: COLETA PRE-ROTEIRO
  Frases/padroes/evitacoes/crenca/posicionamento
  |
  v
STEP 2: CONSULTAR KB EMBARCADA
  Templates de hook + swipe files
  |
  v
STEP 3: ESCREVER ROTEIRO (estrutura macro)
  Hook → Intro Forte → Conteudo → CTA + Posicionamento
  |
  v
STEP 4: ADAPTAR AO FORMATO
  Carrossel (slide a slide) ou Reels (fala+cena)
  |
  v
STEP 5: ANOTAR PRO MACK
  Direcao de producao + variacao emocional
  |
  v
STEP 6: ANALISE TECNICA
  Loopings, elementos, retencao prevista
  |
  v
STEP 7: APRESENTAR V1 + LOOP ITERATIVO
  Expert revisa, Rico ajusta, loop ate aprovar
  Task: refinar-roteiro.md (se precisar)
  |
  v
STEP 8: SALVAR roteiro.md
```

---

## Step 0: Verificar Perfil de Tom

```bash
test -f docs/producao-conteudo/{expert}/perfil-tom-de-voz.md
```

Se existe: carrega e usa.

Se não existe: executar `capturar-tom.md` primeiro (não pula).

---

## Step 1: Coleta Pré-Roteiro

Rico pergunta ao expert antes de escrever:

```
Beleza, teoria do Sage carregada. Antes de escrever, 3-5 perguntas
rapidas pra calibrar:

1. Tem alguma FRASE/EXPRESSAO tua que voce quer que entre nesse
   post especifico? (algo que ja te marca)

2. Padrao pessoal que voce SEMPRE faz e quer manter aqui?
   (ex: "sempre fecho com uma pergunta", "sempre cito X")

3. Algo que voce NAO quer fazer/dizer nesse post?
   (ex: "evita citar Y", "nao fala de Z")

4. Qual visao de mundo / CRENÇA FORTE voce quer que esse post
   construa? (a teoria ja tem moral — quero confirmar)

5. Qual opiniao FORTE / posicionamento entra aqui?
   (tom: educacional + provocativo? só educacional? confronta?)
```

Expert responde (pode ser bem rápido se for direto). Rico anota.

---

## Step 2: Consultar KB Embarcada

Antes de criar do zero, Rico consulta:

- `knowledge/templates/hooks/` — estruturas de hook
- `knowledge/swipe-files/hooks-virais/` — biblioteca de hooks reais virais
- `knowledge/swipe-files/conteudos-virais/` — roteiros completos virais
- `knowledge/41-templates-audience.md` — 41 templates Método Audience

Se KB tem item relevante: adapta. Se não tem (vazio): cria do zero seguindo princípios.

---

## Step 3: Escrever Roteiro — Estrutura Macro

**Estrutura inegociável:**

```
HOOK (3s) → INTRO FORTE → CONTEÚDO → CTA + POSICIONAMENTO/CRENÇA
```

### 3.A — Hook (3 primeiros segundos)

Antes consulta leque de hooks do Sage (teoria.md).

Decide:
- Pega 1 do leque OU adapta OU cria próprio
- Combina 1-3 dos 7 gatilhos: Recompensa, Mistério, Popularidade, Reputação, Crença, Disrupção, Reconhecimento
- Define 3 camadas:
  - **Verbal:** "{frase falada}"
  - **Visual:** "{o que mostra na tela}"
  - **Textual:** "{texto na tela}"

### 3.B — Intro Forte (5-8s)

Logo após hook:
- Sustenta a curiosidade
- Abre 1º looping (promessa do que vem)
- Contexto suficiente sem entregar tudo
- Pode usar identificação ou prova rápida

### 3.C — Conteúdo (corpo)

Aplica:
- **3-5 dos 8 elementos notáveis** (Audience): info nova, valor prático, identificação, prova, fato curioso, história, contra-intuitivo, polêmica
- **Sequência de loopings:** fecha um, abre outro
- **Construção de raciocínio crescente:** cada parte sustenta a próxima
- **Variação emocional** ao longo (raiva, curiosidade, alívio, medo, alegria)
- **Estrutura micro Hannah** (quando couber): Conflito → Jeito Errado → Virada → Jeito Certo → Mudança

### 3.D — CTA Contextual + Posicionamento

CTA:
- DEPOIS da entrega top, NUNCA no começo
- Específico de reconhecimento: "compartilhe com [tipo específico de pessoa]"
- NUNCA genérico ("curte/comenta/segue")

Fechamento + Posicionamento:
- Amarra com a crença/visão de mundo
- Moral da história puxa pro produto/visão
- Sutil mas firme

---

## Step 4: Adaptar ao Formato Escolhido

### Se CARROSSEL

Divide em 8-15 slides:

- **Slide 1 (Capa):** Hook visual + Hook textual em destaque
- **Slide 2 (Reforço):** reforça o hook caso pessoa não pegou o 1º (regra Audience: slide 2 reaparece)
- **Slides intermediários:** 1 ideia por slide + elementos notáveis + loopings
- **Slide CTA:** CTA específico + assinatura

Pra cada slide marca:
- Conteúdo escrito
- Sugestão visual

### Se REELS

Roteiro literal de fala + indicações:

- Cena (cenário, posição)
- Corte/movimento de câmera
- Sugestão de trilha/áudio (se aplicável)
- Tempo estimado por seção
- Variação emocional

---

## Step 5: Anotações pro Mack (Passo 6)

Rico anota no fim do roteiro:

```
ANOTAÇÕES PRO MACK (Passo 6 — Produção)
- Cenário sugerido: {...}
- Direção de gravação: {1 take / múltiplos cortes / câmera fixa / movimento}
- Trilha/áudio sugerido: {...}
- Para CARROSSEL: layout slide a slide já está acima
- Variação emocional ao longo do vídeo (mapa):
  - 0-Xs: {emoção}
  - X-Ys: {emoção}
  - ...
```

---

## Step 6: Análise Técnica

Rico autoanalisa o roteiro:

```
ANÁLISE TÉCNICA DO ROTEIRO

LOOPINGS:
- L1 aberto em {Xs}: "{descrição}"
- L1 fechado em {Xs}: "{descrição}"
- L2 aberto em {Xs}: ...
- L2 fechado em {Xs}: ...
- (mínimo 2 loopings, ideal 3)

ELEMENTOS NOTÁVEIS APLICADOS (X dos 8):
✓ Informação nova: {onde}
✓ Prova/argumentação poderosa: {onde}
✓ Identificação: {onde}
✓ {outros que entraram}

PONTOS DE RETENÇÃO PREVISTOS:
- {Xs}: {motivo}
- {Xs}: {motivo}

RISCO DE SKIP:
- {Xs}: {por que pode perder pessoa}
- {Xs}: {idem}
```

---

## Step 7: Apresentar V1 + Loop Iterativo

Rico entrega versão 1 + abre loop:

```
Roteiro v1 pronto. Olha com calma e me diz:

- Bate com tua vibe?
- Algum trecho ta fraco / forte demais / fora do tom?
- Quer ajustar hook, intro, conteúdo, CTA ou fechamento?

Se aprovar, te entrego pro Mack pra orientacao de producao.
Se nao, mando o que ajustar (sem limite de iteracoes — loop ate
ficar ideal).
```

**Loop iterativo:** expert dá feedback → Rico executa `refinar-roteiro.md` → nova versão → expert revisa.

Critério de pronto = expert aprova explicitamente.

---

## Step 8: Salvar roteiro.md

Salva em `docs/producao-conteudo/{expert}/posts/{slug}/roteiro.md` no formato completo (ver agent `rico-roteirista.md` seção "Output do Roteiro").

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert quer pular Coleta Pré-Roteiro | "Coleta e 3-5 perguntas rapidas. Sem ela, roteiro vira genérico. Bora." |
| Expert quer CTA tipo "curte/comenta/segue" | "Genérico mata interação. Vou fazer específico de reconhecimento." |
| Expert quer CTA logo no inicio | "CTA no inicio destroi entrega. Vai DEPOIS — Elias testou exaustivamente." |
| Expert chega sem teoria pronta | "Sem teoria, vira raso. Te volto pro Sage criar teoria primeiro." |
| Expert quer roteirizar antes de capturar tom | "Captura tom (5 min) primeiro. Reuso em todos os proximos. Vale demais." |
| Versão depois de 5+ iterações sem expert aprovar | Pergunta: "O que especificamente ainda nao bate? Refazer do zero ou refinar parte?" Se não sabe descrever, sugere pause + voltar amanhã com cabeca fresca. |

---

## Quality Gate

**QG-SCA-004 — Roteiro aprovado pelo expert**

Checklist:
- [ ] Perfil de tom carregado/usado
- [ ] Coleta pré-roteiro feita
- [ ] Estrutura macro completa (Hook + Intro + Conteúdo + CTA + Posicionamento)
- [ ] Hook tem 3 camadas (verbal + visual + textual)
- [ ] Pelo menos 3 elementos notáveis aplicados
- [ ] Pelo menos 2 loopings abertos/fechados
- [ ] CTA específico de reconhecimento (não genérico)
- [ ] Adaptado ao formato (carrossel ou reels)
- [ ] Anotações pro Mack incluídas
- [ ] Análise técnica preenchida
- [ ] Expert disse explicitamente "pode produzir" ou similar
- [ ] Salvo em roteiro.md

Se falhou: voltar ao Step apropriado.

---

## Próximo Passo

Após aprovação:

```
Roteiro aprovado. Te entregando pro Mack — ele vai te orientar
na producao.

Carrossel: ele te entrega laminas mastigadas (texto + ideia de
imagem GPT por slide) + orienta Canva.

Reels: ele orienta setup ideal (iPhone Pro 13+, modo cinema,
microfone, luz) + direção de gravação.

Bora pro Mack?
```

→ Handoff pra @mack-produtor.

---

**Task Status:** Ready for Production
