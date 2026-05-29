---
task: "EDI Completo"
responsavel: "@lt-copywriter (com input do strategist)"
atomic_layer: "task"
Entrada: "Persona definida, nicho identificado, dor latente apontada"
Saida: "10-20 ruminacoes brutas → 6 ruminacoes Score 4-5"
execution_type: "interactive"
---

# Task: EDI Completo — Estudo de Diálogo Interno

**Task ID:** squad-low-ticket-arcane/edi-completo
**Owner:** lt-copywriter

---

## Conceito

EDI substitui estudo de persona tradicional. Mais resumido, mais direto, focado em achar UMA dor/desejo PRONTA pra ser resolvida. Pesquisa de **palavras EXATAS** que o publico usa pra ruminar.

> "A gente nao vende pra pessoa, vende pro dialogo interno dela."

---

## As 3 Perguntas

### Pergunta 1 — Pensamentos Negativos

**Comando ChatGPT:**

```
Mulheres que sofrem com {DOR}, quais sao os pensamentos que ela esta
repetindo no dialogo interno dela com o comportamento cognitivo de
ruminacao mental? Lista abaixo as principais e mais frequentes.

[ADICIONAR SEMPRE NO FINAL DE QUALQUER PROMPT:]
Escreva exatamente as frases do dialogo interno dela, frases que
brasileiros falam sem formalidade, que era a frase popular com girias
e palavroes e expressoes reais.
```

### Pergunta 2 — Pior Cenário

```
Mulheres que sofrem com {DOR}, qual seria o pior cenario que ela fica
desenhando na cabeca dela? Comportamento cognitivo, ruminacao mental.

[Comando linguagem popular]
```

### Pergunta 3 — Conversas com Confiança

```
Mulheres que sofrem com {DOR}, quais sao as frases que ela conversa
com pessoas da sua confianca? As principais queixas que ela faz com
relacao a situacao.

[Comando linguagem popular]
```

---

## Workflow Completo (3-4 horas)

### Step 1 — Coleta Bruta (1h)

Rodar as 3 perguntas no ChatGPT.

**Filtragem:**
- ChatGPT pode sugerir "metodo", "formula", "segredo" → DESCARTAR
- "Tipo ChatGPT" (genérico) → DESCARTAR

### Step 2 — Validação na Fonte (1h)

Buscar as ruminacoes brutas em fontes reais.

**Hierarquia de fontes (do mais forte ao mais fraco):**

| Fonte | Score máximo possível | Marcar como |
|-------|------------------------|-------------|
| Áudio/mensagem real de aluna | 5 | Real |
| Comentários YouTube/TikTok no tema | 5 | Real |
| Votação Stories Instagram (pergunta aberta) | 4-5 | Real |
| Pergunta direta pro aluno ("o que sua persona pensa quando...") | 3-4 | Real (mediado) |
| Inferência do copywriter ou ChatGPT | 2-3 | **HIPÓTESE** |
| Brainstorm sem fonte | 0-2 | DESCARTA |

**Regra inegociável:** Se a ruminação não veio de fonte real, marca como **HIPÓTESE** e **valida com o aluno antes de usar em copy de batch grande**.

Anotar frases LITERAIS — não traduzir, não interpretar.

### Step 3 — Score 0-5 (1h)

Pontuar cada frase:

| Score | Classificação | Exemplo |
|-------|---------------|---------|
| 0-2 | Genérica | "Preciso emagrecer" → DESCARTA |
| 3 | Próxima | "Quero perder peso" → REFINA |
| 4-5 | Literal, íntima | "Tô parecendo grávida, tanto que essa barriga ta grande" → USA |

**Teste de qualidade:** Se ninguem "levantasse a mao" pra essa frase, é Score baixo.

### Step 4 — Filtrar Top 6 (30min)

Selecionar 4-6 ruminacoes Score 4-5 (max na pagina).

**Diversidade desejada:**
- Pelo menos 1 ruminacao ATIVA (sweet spot LT)
- Cobrir angulos diferentes da dor
- Linguagem popular consistente

---

## Exemplos por Nicho (Vol 7)

| Nicho | Ruminação Score 4-5 |
|-------|---------------------|
| Loja virtual | "Meu direct ta morto" |
| Loja física | "Estou quase fechando a loja e nao sei mais o que fazer" |
| Mau hálito | "Sera que estao comentando de mim?" |
| Cachorro (xixi) | "Pensado melhor antes de pegar esse cachorro" |
| Insônia | "Sera que vou ter que tomar remedio pra dormir?" |
| Tatuador | "Fala a verdade, voce rala o mes inteiro mas no final nao ve o dinheiro sobrar" |
| Prestador | "Parece que voce esta enganando o cliente" (quem cobra barato) |

---

## Anti-Padrões

| Anti-padrão | Antídoto |
|-------------|----------|
| **Genérico ChatGPT** ("preciso emagrecer") | Filtrar com comando linguagem popular |
| **Aspiracional** ("quero ser fitness") | Substituir por dor latente |
| **Bater na transformação** | Ruminação fala de DOR, não promessa |
| **Múltiplas ruminações por produto** | UMA por produto |
| **Termo técnico** ("déficit calórico") | Linguagem popular ("redução de caloria") |
| **Score 3 forçado** | Se duvida, descarta — não usa |

---

## Output Esperado

```yaml
edi_completo:
  persona: "{descricao}"
  dor_latente: "{frase}"
  ruminacoes_brutas_total: 18
  ruminacoes_score_4_5: 6
  ruminacoes:
    - score: 5
      frase: "{frase literal}"
      angulo: "{aspect}"
      fonte: "youtube_comentario | tiktok_viral | audio_aluna | votacao_stories | aluno_direto"
      tipo: "real"
    - score: 4
      frase: "{frase}"
      angulo: "{aspect}"
      fonte: "chatgpt | inferencia_copywriter"
      tipo: "HIPOTESE"  # PRECISA VALIDAR COM ALUNO ANTES DE USAR EM BATCH GRANDE
    - score: 5
      frase: "..."
  ruminacao_principal: "{a mais forte — vai virar headline}"
  palavra_chave: "{substantivo central}"
  hipoteses_a_validar: 2  # quantas precisam confirmação do aluno
```

---

## Handoff

→ `lt-strategist` pra refinar oferta
→ Continua com `tasks/headline-3-partes.md` (esse mesmo agente)

---

**Task Status:** Production Ready
