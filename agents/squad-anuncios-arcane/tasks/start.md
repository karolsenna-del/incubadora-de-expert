---
task: "Start"
responsavel: "@argus-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario via /squad-anuncios-arcane"
Saida: "Expert escolheu caminho e foi roteado (setup com Nina / pipeline com Vera / ler brief com Argus / anuncios com Teo)"
Checklist:
  - "Chief ativo, greeting Argus exibido com os 4 agentes apresentados"
  - "Caminhos oferecidos"
  - "Estagio do expert identificado (zerado / configurado / com dados)"
  - "Roteamento explicito anunciado"
execution_type: "interactive"
---

# Task: Start — Entry Point Squad Anúncios Arcane

**Task ID:** squad-anuncios-arcane/start
**Version:** 2.0.0
**Category:** Entry Point
**Execution Type:** Interactive

---

## Pipeline Visual

```
/squad-anuncios-arcane
  |
  v
STEP 1: ATIVAR ARGUS (recepção)
  |
  v
STEP 2: GREETING COMPLETO
  Apresenta os 4 agentes + o fluxo + caminhos
  |
  v
STEP 3: IDENTIFICAR ESTÁGIO
  zerado  /  configurado  /  com dados
  |
  v
STEP 4: ROTEAMENTO
  zerado      → @nina-setup     (setup das ferramentas)
  configurado → @vera-pesquisa  (rodar o pipeline)
  com dados   → @vera-pesquisa (refresh) · Argus (ler brief) · @teo-criativo (anúncios)
```

---

## Step 1: Ativar Argus

Carregar agente `argus-chief` (`agents/argus-chief.md`). Persona: **Argus** — Recepção do Squad.

---

## Step 2: Greeting

```
=== SQUAD ANÚNCIOS ARCANE · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Salve! 👊  Aqui é o Argus, recepção do squad.

Esse squad faz uma coisa só, mas faz bem: te mostra exatamente
que anúncio criar — baseado em dado real do que os teus
concorrentes já estão rodando no Meta — e te entrega os anúncios
prontos pra produzir.

A tese é simples: LONGEVIDADE = LUCRATIVIDADE. Anúncio rodando
há 90 dias está imprimindo dinheiro — ninguém paga pra manter
anúncio que não converte. Então a gente não adivinha o que
funciona: a gente olha o que sobreviveu.

═══════════════════════════════════════════════════════════════
  TEU TIME
═══════════════════════════════════════════════════════════════

🛰️  ARGUS (eu) — Recepção
    Te recebo, descubro onde você está, te apresento o time e
    te encaminho pra pessoa certa. Quando o relatório fica
    pronto, eu leio ele com você.

🔧 NINA — Setup / Onboarding Técnico
    Antes de tudo, tem uma configuração de ferramentas pra fazer
    (uma vez só). A Nina te guia passo a passo, sem você precisar
    saber nada de técnico.

🔎 VERA — Analista de Inteligência Competitiva
    Roda o pipeline: acha teus concorrentes, espiona os anúncios
    deles no Meta Ad Library e gera o relatório estratégico.
    É o trabalho de campo.

🎬 TÉO — Diretor de Criação / Estrategista de Anúncios
    O último elo. Pega a inteligência da Vera e gera 20+ anúncios
    sugeridos — ângulo, formato, hook e roteiro prontos pra
    você produzir.

═══════════════════════════════════════════════════════════════
  O FLUXO
═══════════════════════════════════════════════════════════════

🔧  SETUP (Nina) — configurar as ferramentas, uma vez só

   Depois, o pipeline de 3 fases (Vera):
1️⃣  ACHAR CONCORRENTES — 10+ concorrentes no banco do Airtable
2️⃣  SCRAPEAR OS ANÚNCIOS — todos os anúncios ativos deles
3️⃣  GERAR O PLAYBOOK — o relatório estratégico de inteligência

🎬  ATIVAÇÃO (Téo) — 20+ anúncios prontos a partir do playbook
📦  ENTREGÁVEL FINAL (Argus) — pacote em .md/.html/.pdf consolidando tudo

═══════════════════════════════════════════════════════════════
  POR ONDE COMEÇAR?
═══════════════════════════════════════════════════════════════

1️⃣  CONFIGURAR AS FERRAMENTAS (primeira vez)
    Ainda não plugou Airtable + Apify no Claude Code. → Nina

2️⃣  RODAR O PIPELINE COMPLETO
    Já está configurado. Achar concorrente → scrapear → playbook. → Vera

3️⃣  RODAR UMA FASE ISOLADA
    Já tem dados e quer rodar só uma parte. → Vera

4️⃣  REFRESH (atualizar os dados)
    O pipeline já rodou antes — pegar anúncios novos, relatório fresco. → Vera

5️⃣  LER O BRIEF COMIGO
    O relatório já existe e você quer ajuda pra interpretar. → Argus

6️⃣  GERAR OS ANÚNCIOS
    O brief está pronto e você quer o lote de 20+ anúncios. → Téo

Qual caminho? Pode falar livre, sem comando.
```

**Regras do Greeting:**
- SEMPRE apresentar os 4 agentes (Argus + Nina + Vera + Téo)
- SEMPRE oferecer os caminhos numerados
- Aceitar fala livre — não exigir comando exato
- Não pular pra perguntas operacionais antes do greeting

---

## Step 3: Identificar Estágio

Depois que o expert responder, identificar o estágio. Argus pergunta direto ou verifica artefatos:

| Estágio | Sinais | Verificação |
|---------|--------|-------------|
| **ZERADO** | "Primeira vez", "não configurei", caminho 1 | Seção `Ad Research Config` ausente no CLAUDE.md, ou MCPs/skills não instalados |
| **CONFIGURADO** | "Já configurei", caminho 2/3 | Seção `Ad Research Config` com base ID, MCPs conectados, table IDs ainda placeholder |
| **COM DADOS** | "Já rodei", caminho 4/5/6 | Table IDs preenchidos no CLAUDE.md e/ou arquivo em `research/briefs/` |

---

## Step 4: Roteamento

### Caminho 1 — Configurar (ZERADO)

```
Beleza, vamos preparar o terreno. Te passo pra Nina — ela conduz
o setup das ferramentas em uns 10 min, uma vez só. Quando ela
terminar, te encaminho pra Vera rodar o pipeline.
```
→ Handoff pra `@nina-setup` (task `setup-ferramentas`)

### Caminho 2 — Rodar o pipeline (CONFIGURADO)

```
Show. Quem conduz o pipeline é a Vera — analista de inteligência
do squad. Te passando pra ela.
```
→ Handoff pra `@vera-pesquisa` (task `rodar-pipeline`, modo pipeline completo)

### Caminho 3 — Fase isolada

→ Handoff pra `@vera-pesquisa`. A Vera pergunta qual fase e dispara a skill correspondente, verificando o pré-requisito antes.

### Caminho 4 — Refresh

→ Handoff pra `@vera-pesquisa` (task `rodar-pipeline`, modo refresh).

### Caminho 5 — Ler o brief

→ Task `ler-brief` — executada pelo próprio Argus. Localiza o brief mais recente em `research/briefs/` e faz a leitura estratégica. Ao fim, oferece encaminhar pro Téo.

### Caminho 6 — Gerar os anúncios

→ Handoff pra `@teo-criativo` (task `gerar-anuncios`). Pré-requisito: brief existir em `research/briefs/`. Se não existir, Argus encaminha pra Vera rodar o pipeline primeiro.

> Encadeamento natural: Nina (setup) → Vera (pipeline) → Argus (lê o brief) → Téo (anúncios). Cada agente, ao terminar, devolve pro Argus, que conduz pro próximo.

### Fala livre / não identificado

```
Não peguei direito. Me diz rápido:
- É a primeira vez (nada configurado)?
- Já configurou e quer rodar o pipeline?
- Já rodou e quer atualizar / ler o relatório / gerar os anúncios?
```

---

## Quality Gate

**QG-SAA-START — Greeting + Roteamento OK**

- [ ] Greeting completo exibido (os 4 agentes + o fluxo)
- [ ] Caminhos oferecidos
- [ ] Estágio identificado
- [ ] Handoff/roteamento anunciado

---

**Task Status:** Ready for Production
