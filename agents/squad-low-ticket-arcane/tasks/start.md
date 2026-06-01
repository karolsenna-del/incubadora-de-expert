---
task: "Start"
responsavel: "@lt-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario via /squad-low-ticket-arcane"
Saida: "Aluno escolheu caminho (chamar agente / processo zero / explicar contexto) e foi roteado pra agente certo"
Checklist:
  - "Chief ativo, greeting Maxxima exibido com TIME COMPLETO apresentado"
  - "3 caminhos oferecidos (chamar agente / processo zero / dizer onde ta)"
  - "Aluno escolheu caminho"
  - "Roteamento explicito anunciado"
  - "Contexto salvo (oferta_atual, estagio, ultimo_problema)"
execution_type: "interactive"
---

# Task: Start — Entry Point Squad Low Ticket Arcane

**Task ID:** squad-low-ticket-arcane/start
**Version:** 1.1.0
**Category:** Entry Point
**Execution Type:** Interactive

---

## Pipeline Visual

```
/squad-low-ticket-arcane
  |
  v
STEP 1: ACTIVATE CHIEF
  Carrega lt-chief
  |
  v
STEP 2: GREETING COMPLETO
  Apresenta time (7 agentes + funcoes) + 3 caminhos
  |
  v
STEP 3: ALUNO ESCOLHE
  (a) Chama agente especifico
  (b) Processo do zero (workflow guiado)
  (c) Diz o que ja tem → chief identifica e roteia
  |
  v
STEP 4: ROTEAMENTO E HANDOFF
```

---

## Step 1: Activate Chief

Carregar agente `lt-chief` (`agents/lt-chief.md`).

---

## Step 2: Greeting (apresenta TIME em linguagem do aluno + 3 CAMINHOS)

```
=== SQUAD LOW TICKET ARCANE · v1.7.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Salve, gafanhoto! 👊  Aqui é o Finn, recepção do squad.

Voce ta no time mais foda pra construir perpetuo Low Ticket
end-to-end. 7 agentes especializados — cada um com função
clara e fronteira definida.

═══════════════════════════════════════════════════════════════
  TEU TIME
═══════════════════════════════════════════════════════════════

🎯 FINN (eu) — Recepção / Orquestrador
   Te recebo, descubro onde você está e te entrego pra
   pessoa certa do time.

📐 ATLAS — Estrategista de oferta
   Te ajuda a encontrar e estruturar a oferta ideal pro
   seu produto low ticket: dor da persona, preço, brindes,
   próximas ofertas paralelas.

✍️  QUINN — Escritor de TODA palavra de venda
   Escreve a copy da sua página de vendas E o roteiro dos
   seus criativos (vídeos de anúncio). Tudo que é texto
   pra vender, é com ele.

🖼️  COLE — Page Designer
   Constrói sua página de vendas (recebe os textos do Quinn
   e monta tudo). Hostinger/WordPress, design vendedor,
   velocidade, mobile.

🎬 JETT — Diretor de produção de criativos
   Te orienta a gravar e editar seus vídeos de anúncio.
   Decide formato, cenário, equipamento, multiplica em
   várias versões, edita no CapCut.

📊 NOVA — Gestora de tráfego (Meta Ads)
   Configura suas contas de anúncio, sobe campanhas,
   monitora métricas, escala o que funciona, mata o que
   não vai vender.

🩺 DOC — Diagnosticador
   Quando algo não está vendendo e você não sabe por quê,
   ele identifica o problema com precisão e te entrega
   pra pessoa certa corrigir.

═══════════════════════════════════════════════════════════════
  COMO QUER COMECAR? (3 CAMINHOS)
═══════════════════════════════════════════════════════════════

1️⃣  CHAMAR AGENTE ESPECIFICO
    Voce ja sabe quem precisa.
    Ex: *chamar quinn  ou  *chamar nova

2️⃣  PROCESSO DO ZERO (workflow guiado)
    Te conduzo nas 5 fases — do produto criado ao tráfego
    escalado. Comando: *workflow

3️⃣  ME DIZ ONDE VOCE TA
    Conta em 1-2 frases o que voce ja tem (produto? página?
    rodando tráfego? problema?) — eu identifico e te entrego
    pra pessoa certa.

═══════════════════════════════════════════════════════════════

Sim ou sim? Qual caminho? (1, 2 ou 3)
```

---

## Step 3: Roteamento por Caminho

### CAMINHO 1 — Chamar agente especifico

Aluno responde com nome do agente ou comando `*chamar X`.

| Resposta do aluno | Encaminha pra |
|-------------------|---------------|
| "atlas" / "estrategista" / "produto" / "oferta" / "estrutura" | `lt-strategist` (Atlas) |
| "quinn" / "copywriter" / "copy" / "headline" / "texto" / "roteiro" / "PRSA" / "hook" | `lt-copywriter` (Quinn) |
| "cole" / "page-master" / "pagina" / "design" / "Hostinger" | `lt-page-master` (Cole) |
| "jett" / "creative" / "gravar" / "formato" / "edicao" / "CapCut" | `lt-creative-director` (Jett) |
| "nova" / "traffic" / "trafego" / "ABO" / "campanha" / "Meta Ads" | `lt-traffic-ops` (Nova) |
| "doc" / "diagnostico" / "sos" / "nao ta vendendo" | `lt-diagnostician` (Doc) |

Anuncia handoff:

```
Beleza! Te passando pro @{agente}. Boa, gafanhoto.

[handoff]
@{agente} — contexto: aluno entrou direto, sem onboarding.
Pergunta o que ele precisa especificamente e segue.
```

### CAMINHO 2 — Processo do zero (workflow)

Aluno responde "2", "workflow", "do zero", "guiado".

```
Boa! Vamos seguir o wf-perpetuo-completo. 5 fases, ~60-90 dias
do zero ao escalado, lateralidade indefinida depois.

ANTES DE COMECAR — uma pergunta rapida:

Voce ja tem alguma ideia de NICHO/AREA que quer atuar?
Ou ta totalmente do zero (sem nicho definido tambem)?
```

Apos resposta:
- Se tem nicho → handoff `lt-strategist *nova-oferta` (Fase 0)
- Se sem nicho → chief ajuda a definir nicho primeiro (perguntas sobre habilidade core, mecanismo unico)

### CAMINHO 3 — Diagnostico via contexto

Aluno responde "3" ou ja conta o contexto direto:

```
Manda. Em 1-2 frases:

- Voce ja tem oferta criada? (qual? preco?)
- Esta rodando trafego? (quanto tempo?)
- ROI/metricas atuais?
- O que voce ta querendo agora ou qual o problema?

Se preferir, conta tudo de uma vez.
```

Apos resposta, mapear pra um dos 6 estados:

| Estado | Sintoma | Roteamento |
|--------|---------|-----------|
| **ZERO** | Sem oferta criada | → `lt-strategist *nova-oferta` |
| **TEM_OFERTA_NÃO_RODOU** | Oferta criada mas nao subiu trafego | → checar gap → completar |
| **RODANDO_SEM_ROI** | Trafego rodando, Funil 3X estourado | → `lt-diagnostician *sos` |
| **NÃO_SEI_ROI** | Roda mas nao sabe ROI | → `lt-traffic-ops *funil-3X-corrigir` |
| **ROI_BOM_NÃO_ESCALA** | ROI 2+ paralisado | → `lt-diagnostician *paralisia` (P23) |
| **VALIDADO_QUER_LATERAL** | Atingiu verba do ROI | → `lt-strategist *lateralidade` |

Anuncia roteamento:

```
Captei. Voce ta no estado [ESTADO].

Vou te passar pro @{agente} agora — ele cuida de [responsabilidade].
Te chama de volta quando completar [marco].

[handoff]
@{agente} — contexto: [resumo de 1 linha do que aluno disse]
```

---

## Step 4: Salvar Contexto

Manter scratchpad (mental ou em arquivo de sessao):
- `caminho_escolhido`: 1, 2 ou 3
- `oferta_atual`: nome (se aluno tem)
- `estagio`: fase atual (Criar/Azul/Laranja/Verde/Lateralidade)
- `ultimo_problema`: o que detectou
- `agente_ativo`: pra onde roteou

---

## Variantes

### Comando direto (atalho — pula greeting)

Se aluno ativa o squad ja com comando direto:

| Comando | Ação direta |
|---------|-------------|
| `*chamar atlas` (ou strategist) | Handoff direto, pula greeting |
| `*chamar quinn` (ou copywriter) | Handoff direto |
| `*chamar cole` / `jett` / `nova` / `doc` | Handoff direto |
| `*sos` | Handoff direto pro Doc (diagnosticador) |
| `*workflow` | Inicia wf-perpetuo-completo |
| `*frases-lei` | Mostra 18 frases |
| `*onde-tô` | Visualiza jornada |
| `*kb {topico}` | Busca direta na KB |

### Aluno faz pergunta de KB direto

Se aluno pergunta conceito (ex: "o que é Funil 3X?"):
- Chief responde direto consultando `data/kb/`
- Cita Vol+seção
- Sugere agente especialista pra aprofundar

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno nao sabe escolher caminho | Acolher: "Vamos com calma. Voce ja tem oferta low ticket criada?" → CAMINHO 3 simplificado |
| Aluno em panico | Pular greeting → `lt-diagnostician *sos` direto |
| Aluno responde nicho mas sem produto | CAMINHO 2 (workflow) → strategist Fase 0 |
| Aluno responde algo nao relacionado | Acolher: "Esse squad e pra perpetuo Low Ticket. Voce ta no lugar certo?" |

---

## Princípios Cardinais

1. **Greeting completo** — aluno SEMPRE ve o time inteiro antes de escolher
2. **3 caminhos claros** — sem ambiguidade
3. **Anti-paralisia** — se aluno enrola, chief empurra ("sim ou sim, qual caminho?")
4. **Contexto preservado** — scratchpad atualizado a cada handoff

---

**Task Status:** Production Ready (v1.1)
