# Análise Qualitativa de Comentários

**Aplicação:** Aria executa quando há dump de comentários disponível.
**Princípio:** métricas dizem ONDE quebrou. Comentários dizem POR QUÊ.

---

## Por Que Comentários Importam

Métricas (quantitativas):
- Taxa após 3s
- Tempo médio
- Interação

**Limitação:** dizem PADRÃO de comportamento, não MOTIVO.

Comentários (qualitativos):
- Mostram o que público sentiu
- Revelam dúvidas reais
- Apontam polêmica gerada
- Sinalizam demanda por mais

**Comentários transformam dado em INSIGHT ESTRATÉGICO.**

---

## Dimensões da Análise

### 1. SENTIMENTO GERAL

Classifica os comentários em 3 buckets:

- **Positivo:** concordância, elogios, agradecimentos, "amei", "salvei", "manda pra galera"
- **Negativo:** discordância, defensiva, crítica, "tá errado", "discordo"
- **Neutro:** dúvidas técnicas, pedidos, observações sem opinião

**Saída:**

```
Sentimento Geral ({N} comentários):
- {X}% positivo
- {Y}% negativo
- {Z}% neutro

Tipo de discussão: {polarizada / consensual / dispersa}
```

**Interpretação:**

- **>70% positivo:** conteúdo ressoou. Mas pode ser eco chamber (público já alinhado).
- **50/50 polarizado:** polêmica boa. Algoritmo amplifica (engajamento alto).
- **>30% negativo:** ou polêmica forte intencional, ou conteúdo mal posicionado.
- **Muito neutro:** conteúdo educacional puro, sem polarização — não viraliza sem polêmica.

---

### 2. DÚVIDAS RECORRENTES

Cada dúvida que aparece em múltiplos comentários = **TEMA POTENCIAL NOVO**.

**Como identificar:**

- Lê todos os comentários
- Agrupa por "tópico" (sobre o quê a pessoa pergunta)
- Conta menções
- Top 5-10 mais citados = oportunidades

**Saída:**

```
Top Dúvidas Recorrentes:
1. "Como começar a mudar quando voce herdou problema?" ({N} menções)
   → TEMA POTENCIAL: "Cultura herdada — 5 passos pra reset"

2. "Como confrontar senior já estabelecido?" ({N} menções)
   → TEMA POTENCIAL: "Confrontar quem chegou antes de você"

3. ...
```

**Aplicação:** envia pra Iris atualizar pool de temas.

---

### 3. PONTOS QUE RESSOARAM

Frases/ideias do post que aparecem REPETIDAS nos comentários.

**Por que importa:**

- O que ressoou = o que TOCOU forte
- Pode ser aprofundado em próximos posts
- Sinaliza ângulo emocional certo

**Como identificar:**

- Procura comentários que CITAM o post
- Encontra trechos repetidos: "frase X", "ideia Y"
- Conta repetições

**Saída:**

```
Pontos que Ressoaram Forte:
- "{trecho/ideia 1}" — citado {N} vezes
- "{trecho/ideia 2}" — citado {N} vezes
- "{frase do expert}" — repetido em {N} comentários
```

**Aplicação:** Rico pode usar como hook ou ideia central em próximos posts.

---

### 4. POLÊMICA / DISCORDÂNCIA

Análise das reações negativas — pode ser ouro pra próximos posts.

**Tipos de discordância:**

**A) Defensiva irônica** — "comigo não, eu sou diferente" (ironicamente confirma o que o post criticou)

Exemplo: post critica "CEOs autoritários", comentários defensivos vêm de CEOs autoritários defendendo seus métodos.

→ **Gancho potencial:** "Como saber se VOCE é o lider toxico — 4 sinais que voce vai negar"

**B) Discordância sincera** — argumento válido contrário

Exemplo: post diz "demitir cedo", comentário traz contexto onde demitir cedo seria errado.

→ **Gancho potencial:** "Quando NÃO demitir — exceções à regra"

**C) Discordância superficial** — "tá errado" sem argumento

Ignora ou usa como sinal de polarização saudável.

**Saída:**

```
Polêmica Detectada:
Padrão de discordância: "{tipo}"
Exemplos:
- "{comentário 1}"
- "{comentário 2}"

Análise: {padrão — defensiva irônica / sincera / superficial}

Gancho Potencial: "{tema novo que confronta a reação negativa}"
```

---

### 5. DEMANDA POR CONTINUIDADE

Comentários pedindo:
- "Faz parte 2"
- "Aprofunda nesse tema"
- "Como aplicar em [contexto X]?"
- "E pra quem [situação Y]?"

**Quando detecta múltiplas demandas:** tema engatou. Vale SERIALIZAR.

**Saída:**

```
Demanda Por Continuidade:
{N} comentários pediram:
- "Faz parte 2" ({N} vezes)
- "Aprofunda em [Y]" ({N} vezes)
- "Como aplicar em [contexto Z]" ({N} vezes)

Recomendação: serializar tema. Próximos posts sugeridos:
1. {ideia derivada da demanda 1}
2. {ideia derivada da demanda 2}
3. {ideia derivada da demanda 3}
```

---

## Insights Pra Outros Agentes

Após análise, Aria organiza insights:

### Pra IRIS (atualizar pool de temas)

- Top dúvidas → novos temas
- Polêmica → ângulo contra-intuitivo pra novo post
- Demanda → temas serializáveis

### Pra RICO (próximos roteiros)

- Pontos que ressoaram → usar como hook ou ideia central
- Padrão de discordância → gancho de disrupção
- Frases que o público repetiu → bordões em potencial

---

## Volumes Recomendados

Pra análise qualitativa fazer sentido:

- **Mínimo:** 30+ comentários
- **Ideal:** 100+ comentários
- **Excelente:** 500+ comentários

Abaixo de 30, análise vira impressão (não padrão).

---

## Processo de Coleta

Aria precisa do dump de comentários. Opções:

**Opção A — Copy-paste manual:**
- Expert seleciona comentários no Instagram
- Cola no chat
- Aria processa

**Opção B — Apify:**
- Apify scrapeia comentários automaticamente
- Retorna JSON
- Aria lê JSON

**Opção C — Filtros (se >100):**
- Pega top 50 mais curtidos
- Mais alguns aleatórios
- Análise representativa

---

## Sinais De Atenção (Read Between The Lines)

Comentários ÚTEIS pra ler:
- Os mais CURTIDOS (validados pela própria audiência)
- Os mais LONGOS (engajamento profundo)
- Os com SUB-RESPOSTAS (geraram debate)
- Os que CITAM o post diretamente

Comentários a IGNORAR ou pesar menos:
- Spam ("amei seu trabalho 🔥🔥🔥")
- Bots
- Off-topic completo
- Trolls óbvios

---

## Aplicação no Squad

Tarefa: `analisar-comentarios.md`

Aria gera seção qualitativa do relatório:

```markdown
## Análise Qualitativa dos Comentários

[Sentimento geral]
[Top dúvidas recorrentes]
[Pontos que ressoaram]
[Polêmica detectada]
[Demanda por continuidade]

## Insights Pra Outros Agentes

Pra IRIS: [temas novos]
Pra RICO: [hooks/ângulos]
```
