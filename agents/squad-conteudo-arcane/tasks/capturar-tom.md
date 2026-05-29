---
task: "Capturar Tom de Voz"
responsavel: "@rico-roteirista"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nada obrigatorio. Idealmente: doc de tom do expert OU conteudos existentes dele"
Saida: "perfil-tom-de-voz.md salvo na pasta do expert (1x — reuso eterno)"
Checklist:
  - "Rico verificou se existe perfil-tom-de-voz.md ja"
  - "Se NAO existe: aplicou hierarquia A→B→C"
  - "A: leu doc de tom de voz se expert tem"
  - "B: entrevistou expert se ele consegue descrever"
  - "C: pediu 3-5 conteudos existentes e extraiu padroes"
  - "Devolveu perfil pra expert validar"
  - "Salvou em perfil-tom-de-voz.md"
execution_type: "interactive"
---

# Task: Capturar Tom de Voz — Pré-Roteiro (1x)

**Task ID:** squad-conteudo-arcane/capturar-tom
**Version:** 1.0.0
**Responsavel:** @rico-roteirista
**Category:** Setup do Roteirista
**Execution Type:** Interactive

---

## Pipeline Visual

```
capturar-tom
  |
  v
STEP 1: VERIFICAR SE JA EXISTE PERFIL
  |
  +→ JA EXISTE → carregar e usar (FIM)
  |
  +→ NAO EXISTE → hierarquia A→B→C
  |
  v
STEP 2: HIERARQUIA DE CAPTAÇÃO
  A) tem doc? → ler
  B) sabe descrever? → entrevistar
  C) nao sabe? → pedir conteudos, extrair
  |
  v
STEP 3: DEVOLVER ESTRUTURADO
  Expert valida
  |
  v
STEP 4: SALVAR perfil-tom-de-voz.md
```

---

## Step 1: Verificar Se Já Existe Perfil

Antes de capturar do zero, Rico verifica:

```bash
test -f docs/producao-conteudo/{expert}/perfil-tom-de-voz.md
```

Se existe: lê e usa. Pula pro próximo passo (roteirização).

Se não existe: vai pro Step 2.

---

## Step 2: Hierarquia A → B → C

### Opção A — Expert tem documento de tom de voz

Rico pergunta:

```
Antes de eu sair escrevendo, deixa eu capturar teu TOM DE VOZ —
sem isso o roteiro vira generico ou nao soa como voce.

Voce tem algum doc de tom de voz / guia de comunicacao /
brand voice / Voice DNA? Pode ser:
- Documento formal
- Anotacao tua sobre como voce escreve
- Brand book
- Qualquer descrição existente

Se sim, me passa o caminho/conteudo. Eu absorvo.
```

**Se expert entrega doc:** Rico lê, extrai e estrutura no formato padrão (próximo Step). Confirma com expert.

**Se expert não tem:** vai pra Opção B.

### Opção B — Expert sabe descrever (entrevista)

Rico entrevista com 6 perguntas-chave:

```
Sem doc, mas voce sabe descrever? Vou fazer 6 perguntas. Pode
responder solto.

1. CASUAL ou FORMAL?
   (escala 1-10 — 1 = "mano, tipo" / 10 = "prezados, conforme")

2. DIRETO ou EXPLICATIVO?
   (vai direto ao ponto ou contextualiza muito?)

3. CONFRONTA ou ACOLHE?
   (provoca/questiona ou conforta/valida?)

4. USA GÍRIAS? Quais?
   (palavras informais que tu usa)

5. PALAVRAS QUE VOCE AMA E ODEIA?
   (tem palavra que voce sempre usa? E que NUNCA usa?)

6. RITMO — frases curtas ou longas?
   (punch curto ou texto fluido?)
```

**Rico captura, organiza, devolve no Step 3.**

### Opção C — Expert não sabe descrever (extração)

Rico pede amostras:

```
Sem stress. Manda 3-5 conteudos teus que representam bem como
voce se comunica:
- Posts (carrossel ou stories)
- Reels gravados (transcricao)
- Audios transcritos
- Artigo/blog
- Qualquer coisa que voce produziu e ACHA que e "tu falando"

Eu absorvo, extraio padroes (vocabulario, ritmo, postura,
marcadores), e devolvo perfil estruturado pra voce validar.
```

**Expert entrega 3-5 conteúdos.**

Rico analisa:
- **Vocabulário recorrente** (palavras/expressões que aparecem em múltiplos textos)
- **Ritmo** (frases curtas vs longas, % de cada)
- **Postura** (confronta? acolhe? provoca? ensina?)
- **Marcadores** (frases de transição, bordões, fechamentos)
- **Estilo de prova** (cita estudo? caso pessoal? autoridade externa? convicção direta?)

---

## Step 3: Devolver Estruturado pra Validação

Rico monta o perfil e apresenta:

```
Extraí. Teu tom de voz é:

═══════════════════════════════════════════════════════════════
PERFIL DE TOM DE VOZ
═══════════════════════════════════════════════════════════════

REGISTRO: {casual/formal — com nota explicativa}
DIRECIONALIDADE: {direto/explicativo — com explicação}
POSTURA: {confronta/acolhe — com nuance}

VOCABULÁRIO TÍPICO:
- {palavra 1}
- {palavra 2}
- {expressão 3}
- {gíria 4}
[5-15 itens]

PALAVRAS/EXPRESSÕES QUE EVITA:
- {item 1} — porque {motivo}
- {item 2} — porque {motivo}

RITMO:
- {X}% frases curtas (punch)
- {Y}% frases médias (explicação)
- {Z}% frases longas (rara)

MARCADORES / BORDÕES:
- "{bordão 1}"
- "{frase de transição}"
- "{fechamento típico}"

ESTILO DE PROVA:
- Prefere: {estudo / caso pessoal / autoridade / convicção direta}

═══════════════════════════════════════════════════════════════

Bate? Quer ajustar algo? Se aprovar, salvo e reuso em TODO
roteiro daqui pra frente.
```

**Loop de feedback** até expert aprovar.

---

## Step 4: Salvar perfil-tom-de-voz.md

Salva arquivo em `docs/producao-conteudo/{expert}/perfil-tom-de-voz.md`:

```markdown
# Perfil de Tom de Voz — {Expert}

**Capturado em:** {data}
**Captação método:** {A doc / B entrevista / C extração de amostras}

## Registro
{casual/formal — com nota}

## Direcionalidade
{direto/explicativo}

## Postura
{confronta/acolhe — com nuance}

## Vocabulário Típico
- Lista

## Palavras/Expressões Que Evita
- Item 1 — motivo
- ...

## Ritmo
- X% punch
- Y% médias
- Z% longas

## Marcadores / Bordões
- "{bordão 1}"
- ...

## Estilo de Prova
- Prefere: {tipo}

## Exemplos do Tom em Uso

> {trecho real de conteúdo do expert que exemplifica}

> {outro trecho}

---

## Como Aplicar Este Perfil

Em cada roteiro novo:
1. Rico carrega este perfil ANTES de escrever
2. Vocabulário e ritmo seguem este padrão
3. Bordões podem ser usados quando couber
4. Evitações são respeitadas

## Revisão Periódica

Este perfil pode evoluir. Revisar a cada 3-6 meses ou quando expert
sentir que mudou registro/posicionamento.
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert insiste em pular captação | "Tom genérico = post genérico. 5 min pra captar e reuso eternamente. Vale demais. Tenta a Opção mais leve (entrevista — 5 perguntas)." |
| Expert não tem 5 conteúdos pra mandar (Opção C) | "OK, manda os que tens. 2-3 também serve pra extrair padrão básico — vamos refinando ao longo dos roteiros." |
| Perfil extraído não soa como expert | "Onde tá errado? Posso ajustar registro / vocabulário / postura. Manda feedback específico." |
| Expert quer múltiplos perfis (1 sério, 1 descontraído) | OK — salva 2 perfis. Pergunta antes de cada roteiro qual usar. |

---

## Quality Gate

**QG-Tom — Perfil de tom capturado**

Checklist:
- [ ] Hierarquia A→B→C aplicada
- [ ] Perfil estruturado nos 6 campos (registro, direcionalidade, postura, vocabulário, ritmo, marcadores)
- [ ] Expert validou
- [ ] Salvo em perfil-tom-de-voz.md
- [ ] Pelo menos 2 exemplos reais incluídos no perfil

Se falhou: voltar à captação correspondente.

---

## Reuso

**Este perfil é capturado 1 vez e REUSADO em todos os roteiros futuros.**

Rico abre `perfil-tom-de-voz.md` antes de cada novo roteiro. Não precisa repassar.

Expert pode atualizar a qualquer momento.

---

**Task Status:** Ready for Production
