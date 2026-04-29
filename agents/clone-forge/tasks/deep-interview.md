# Task: Entrevista Profunda

**Task ID:** clone-forge/deep-interview
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Knowledge Extraction
**Execution Type:** Interactive

---

## Executive Summary

Fase 1.5 do pipeline Clone Forge. Entrevista estruturada em 6 blocos que extrai conhecimento tacito diretamente da pessoa sendo clonada. So executa quando o sujeito esta PRESENTE e a cobertura de fontes esta abaixo de 80%. Os 6 blocos — Identidade, Voz, Pensamento, Metodo, Contradicoes, Tacito — sao desenhados para ir alem do que qualquer conteudo publicado revela. Tudo que a pessoa responde e classificado como Tier 0 (OURO MAXIMO) porque e voz direta sem filtro.

**Posicao no Workflow:** Fase 1.5 — Entre Coleta (Fase 1) e Extracao (Fase 2)
**Definicao de Sucesso:** 6 blocos de entrevista salvos com respostas profundas e classificados Tier 0
**Condicao de Execucao:** `subject_present AND source_coverage < 0.8`

---

## Purpose

Conteudo publicado mostra o que a pessoa QUER que o mundo veja. A entrevista profunda vai atras do que a pessoa nao publica: como realmente decide, onde se contradiz, o que faz diferente do que ensina, quais tensoes internas carrega, que heuristicas usa sem perceber.

Nenhum video, artigo ou post substitui sentar na frente da pessoa e perguntar: "Quando voce quebra suas proprias regras?" Esse tipo de resposta e o OURO do clone — e o que separa um clone superficial de um que realmente captura a essencia.

Esta task e CONDICIONAL:
- Se o sujeito nao esta presente (clonagem de terceiro), pula.
- Se coverage >= 0.8, pula (fontes ja sao suficientes).
- Se o sujeito esta presente E coverage < 0.8, executa obrigatoriamente.

O formato conversacional e proposital — nao e um formulario, e uma CONVERSA. As perguntas devem fluir naturalmente, cada resposta abrindo caminho para a proxima.

---

## Execution Type

**Interactive (90% Human, 10% Agent)**

- **Papel do Human (sujeito):** Responder as perguntas com honestidade e profundidade
- **Papel do Agent (@clone-forge-chief):** Conduzir a entrevista, adaptar perguntas, registrar respostas, classificar
- **Runtime Estimado:** 30-90 minutos (depende da profundidade das respostas)

---

## Inputs

### Inputs Obrigatorios

```yaml
mind_slug:
  field: "Identificador unico da mente sendo clonada"
  format: "string (snake_case)"
  required: true

manifest_path:
  field: "Caminho para o manifest.yaml da mind"
  format: "path"
  required: true

source_coverage:
  field: "Score de cobertura da Fase 1"
  format: "float (0.0 - 1.0)"
  required: true
  location: "manifest.yaml → phase_1.coverage_score"
  notes: "Se >= 0.8, esta task pode ser pulada"

subject_present:
  field: "O sujeito da clonagem esta presente nesta sessao?"
  format: "boolean"
  required: true
  notes: "Se false, pular task (nao faz sentido entrevistar quem nao esta la)"
```

### Inputs Opcionais

```yaml
sources_inventory:
  field: "Inventario de fontes para identificar gaps"
  format: "YAML"
  required: false
  location: "minds/{slug}/01-sources/sources-inventory.yaml"
  notes: "Usado para focar perguntas nas areas com menos cobertura"

previous_assessment:
  field: "Assessment formal previo (Zona Genialidade, etc)"
  format: "YAML"
  required: false
  notes: "Permite personalizar perguntas baseado no perfil ja conhecido"

interview_focus:
  field: "Areas especificas para focar na entrevista"
  format: "list of strings"
  required: false
  example: ["metodo de vendas", "historia de vida", "processo criativo"]
  notes: "Se fornecido, aprofunda nesses topicos"
```

---

## Precondicoes

Antes de iniciar esta task:

- [ ] Fase 1 completada com sources-inventory.yaml
- [ ] source_coverage calculado e registrado no manifest
- [ ] source_coverage < 0.8 (condicao de execucao)
- [ ] Sujeito presente e disponivel para conversa (subject_present = true)
- [ ] Diretorio `minds/{slug}/01-sources/interview/` existe
- [ ] Tempo minimo de 30 minutos disponivel

---

## Steps

### Step 1: Verificar Condicao de Execucao (1 min)

**Atividade do Agent:**

1. Ler manifest para obter `source_coverage` e `subject_present`
2. Avaliar condicao:

```yaml
execution_decision:
  condition_1: "subject_present == true"
  condition_2: "source_coverage < 0.8"
  result:
    both_true: "EXECUTAR entrevista completa"
    subject_absent: "PULAR — registrar skip no manifest"
    coverage_sufficient: "PULAR — registrar skip (fontes ja suficientes)"
    coverage_low_no_subject: "PULAR — registrar warning (fontes insuficientes mas sujeito ausente)"
```

3. Se pular, registrar no manifest e finalizar:

```yaml
phase_1_5:
  status: skipped
  reason: "{motivo}"
  skipped_at: "{timestamp}"
```

**Checkpoint:** Condicao verificada. Prosseguir ou pular.

---

### Step 2: Contextualizar e Explicar o Processo (2-3 min)

**Atividade do Agent:**

Explicar ao sujeito o que vai acontecer. Tom casual, sem formalidade.

```yaml
elicit: true
prompt: |
  Beleza, vou te fazer umas perguntas pra entender melhor como voce pensa,
  decide e opera. Nao e um teste — nao tem resposta certa ou errada.

  Sao 6 blocos:
  1. Identidade — quem voce e de verdade
  2. Voz — como voce fala e se comunica
  3. Pensamento — como voce decide e prioriza
  4. Metodo — seus frameworks e como ensina
  5. Contradicoes — onde voce se contradiz (todo mundo se contradiz)
  6. Tacito — o que voce faz mas nao articula

  Leva entre 30 e 90 minutos dependendo de quanto voce mergulhar.
  Quanto mais honesto e detalhado, melhor o clone.

  Pode comecar? Alguma duvida antes?
type: "confirmation"
default: "sim"
on_no: "Tirar duvidas, ajustar expectativas, tentar novamente"
```

**Checkpoint:** Sujeito entende o processo e esta pronto para comecar.

---

### Step 3: Bloco 1 — Identidade (5-15 min)

**Atividade do Agent:**
Perguntas sobre quem a pessoa e: pontos de virada, valores, rejeicoes, missao.

**Perguntas do Bloco (selecionar 5-10 conforme fluxo da conversa):**

```yaml
bloco_1_identidade:
  titulo: "Quem voce E"
  objetivo: "Capturar a essencia identitaria — nao o curriculo, mas o nucleo"
  tier: 0

  perguntas:
    abertura:
      - "Se voce tivesse que explicar quem voce e pra alguem que nunca ouviu falar de voce, sem mencionar sua profissao, o que diria?"
      - "Qual momento da sua vida dividiu tudo em 'antes' e 'depois'?"

    valores:
      - "O que te faz perder o respeito por alguem instantaneamente?"
      - "Que valor voce nao negocia nem se te pagarem 10x mais?"
      - "Se seu filho te perguntasse 'pai/mae, o que importa de verdade na vida?', o que voce responderia?"

    rejeicoes:
      - "O que voce viu no seu mercado que te deu nojo a ponto de querer fazer diferente?"
      - "Que tipo de pessoa voce se recusa a trabalhar com? Por que?"
      - "Qual conselho comum no seu mercado voce acha completamente errado?"

    missao:
      - "Se voce morresse amanha, o que ficaria inacabado que te incomodaria?"
      - "O que te move quando o dinheiro nao ta movendo?"
      - "Qual legado voce quer que seus filhos lembrem?"

  regras_de_conducao:
    - "Comecar com abertura (mais leve) e ir aprofundando"
    - "Se a resposta for superficial, pedir: 'Me fala mais sobre isso...'"
    - "Se mencionar uma historia, pedir detalhes: 'Como foi isso na pratica?'"
    - "Nao apressar — silencio apos a pergunta e permitido"
    - "Adaptar proxima pergunta baseado na resposta anterior"
    - "Maximo 10 perguntas, minimo 5"
```

**Salvar em:** `01-sources/interview/bloco-1-identidade.md`

```markdown
---
source_id: "INT-001-identidade"
type: "deep_interview"
tier: 0
block: 1
block_name: "identidade"
interview_date: "{date}"
word_count: {count}
---

# Bloco 1: Identidade

## Pergunta 1: {pergunta}
{resposta completa do sujeito}

## Pergunta 2: {pergunta}
{resposta completa do sujeito}

...
```

**Checkpoint:** Bloco 1 salvo com respostas sobre identidade, valores, rejeicoes e missao.

---

### Step 4: Bloco 2 — Voz (5-15 min)

**Atividade do Agent:**
Perguntas sobre como a pessoa fala, se expressa, que tom usa em diferentes contextos.

**Perguntas do Bloco:**

```yaml
bloco_2_voz:
  titulo: "Como voce fala"
  objetivo: "Capturar padroes de comunicacao: tom, expressoes, registro por contexto"
  tier: 0

  perguntas:
    estilo:
      - "Como seus amigos descrevem o jeito que voce fala? E seus clientes/alunos?"
      - "Tem alguma expressao ou frase que voce usa tanto que ja virou sua marca?"
      - "Quando voce ta explicando algo complexo pra alguem leigo, qual estrategia voce usa? Me da um exemplo."

    contexto:
      - "Seu tom muda quando voce ta ensinando vs quando ta vendendo vs quando ta conversando com amigo? Como?"
      - "Quando voce ta puto com algo no seu mercado, como voce expressa isso? Me da um exemplo real."
      - "Se voce fosse gravar um audio de 60 segundos motivando alguem que ta travado, o que diria? (Pode falar agora como se tivesse gravando.)"

    linguagem:
      - "Que tipo de humor voce usa? Sarcasmo? Auto-depreciativo? Analogias absurdas?"
      - "Voce fala mais por metaforas e historias ou mais por dados e logica? Me da um exemplo."
      - "Quando voce discorda de alguem publicamente, como voce faz? Direto? Diplomatico? Usa ironia?"

    antipadroes:
      - "Que tipo de linguagem te irrita quando OUTROS usam? (Corporatives, guru-speak, etc)"

  regras_de_conducao:
    - "Prestar atencao NAO so no que diz mas COMO diz — registrar expressoes usadas"
    - "Se usar metafora interessante, pedir mais: 'Voce usa muito esse tipo de comparacao?'"
    - "Se o tom mudar durante a entrevista, notar e registrar"
    - "Pedir exemplos concretos, nao descricoes abstratas"
```

**Salvar em:** `01-sources/interview/bloco-2-voz.md`

**Checkpoint:** Bloco 2 salvo com padroes de comunicacao e exemplos de tom.

---

### Step 5: Bloco 3 — Pensamento (5-15 min)

**Atividade do Agent:**
Perguntas sobre como a pessoa decide, prioriza, analisa — seus modelos mentais.

**Perguntas do Bloco:**

```yaml
bloco_3_pensamento:
  titulo: "Como voce pensa"
  objetivo: "Capturar heuristicas, modelos de decisao, vieses conscientes, prioridades"
  tier: 0

  perguntas:
    decisao:
      - "Quando voce tem que tomar uma decisao importante no negocio, qual e seu processo? Pensa sozinho? Consulta alguem? Dorme sobre?"
      - "Me conta uma decisao recente que voce tomou rapido e deu certo. E uma que voce tomou rapido e deu errado. O que diferenciou as duas?"
      - "Voce tem alguma 'regra de bolso' que usa pra decidir rapido? Tipo 'se X, entao sempre Y'?"

    prioridades:
      - "Se voce tem 10 coisas pra fazer e so pode fazer 3, como escolhe quais?"
      - "O que voce sacrifica primeiro quando o tempo aperta: qualidade, prazo, ou escopo?"
      - "Qual metrica ou indicador voce olha PRIMEIRO quando quer saber se as coisas estao indo bem?"

    modelos_mentais:
      - "Voce enxerga o mundo mais como sistema (tudo conectado, causa e efeito) ou mais como narrativa (historias, personagens, arcos)?"
      - "Quando alguem te apresenta uma ideia nova, qual e a PRIMEIRA coisa que voce avalia? Viabilidade? Originalidade? Mercado?"
      - "Voce confia mais na sua intuicao ou nos dados? Quando um contradiz o outro, quem ganha?"

    vieses:
      - "Que vies voce sabe que tem e NAO quer corrigir? (Ex: 'Sei que sou impaciente mas funciona pra mim')"
      - "O que voce acha que a maioria das pessoas pensa errado sobre o seu mercado?"

  regras_de_conducao:
    - "Perguntas de decisao devem pedir exemplos reais, nao teoricos"
    - "Se mencionar framework proprio, explorar: 'De onde veio isso? Sempre pensou assim?'"
    - "Prioridades revelam valores — aprofundar quando aparece contradicao"
    - "Nao julgar vieses — registrar com neutralidade"
```

**Salvar em:** `01-sources/interview/bloco-3-pensamento.md`

**Checkpoint:** Bloco 3 salvo com modelos de decisao, heuristicas e prioridades.

---

### Step 6: Bloco 4 — Metodo (5-15 min)

**Atividade do Agent:**
Perguntas sobre frameworks proprios, como ensina, o que funciona na pratica.

**Perguntas do Bloco:**

```yaml
bloco_4_metodo:
  titulo: "Como voce faz"
  objetivo: "Capturar frameworks proprios, metodologia de ensino, o que funciona e por que"
  tier: 0

  perguntas:
    frameworks:
      - "Se voce tivesse que resumir seu metodo em 3 passos, quais seriam?"
      - "Esse metodo sempre foi assim ou evoluiu? O que mudou e por que?"
      - "Qual parte do seu metodo e nao-negociavel — a coisa que se tirar, nao funciona?"

    ensino:
      - "Quando voce ensina alguem, qual e a primeira coisa que faz? O primeiro conceito que apresenta?"
      - "Qual a maior dificuldade que seus alunos/clientes tem pra aplicar o que voce ensina? Por que acha que trava?"
      - "Voce tem alguma analogia ou metafora que usa repetidamente pra explicar seu metodo?"

    resultados:
      - "Me conta o caso de um aluno/cliente que aplicou seu metodo e deu muito certo. O que ele fez diferente?"
      - "E um caso que nao deu certo. O que faltou?"
      - "Se voce pudesse dar UM conselho pra alguem comecando no que voce faz, qual seria?"

    diferencial:
      - "O que voce faz de diferente dos outros que ensinam coisas parecidas?"
      - "Tem algo que voce ensina que vai contra o que o mercado prega? O que?"

  regras_de_conducao:
    - "Frameworks proprios sao OURO — aprofundar cada passo"
    - "Quando mencionar caso de sucesso, pedir detalhes: numeros, timeline, contexto"
    - "Se disser 'depende', pedir: 'Depende de que? Me da 2 cenarios.'"
    - "Registrar analogias e metaforas usadas — sao voice DNA puro"
```

**Salvar em:** `01-sources/interview/bloco-4-metodo.md`

**Checkpoint:** Bloco 4 salvo com frameworks, metodo de ensino e diferenciais.

---

### Step 7: Bloco 5 — Contradicoes (5-10 min)

**Atividade do Agent:**
Perguntas sobre onde a pessoa se contradiz, tensoes internas, nuances que nao aparecem no conteudo publico.

**Perguntas do Bloco:**

```yaml
bloco_5_contradicoes:
  titulo: "Onde voce se contradiz"
  objetivo: "Capturar tensoes internas, nuances, areas de desconforto e evolucao"
  tier: 0

  contexto_para_agente: |
    Este e o bloco mais sensivel. O sujeito pode ficar desconfortavel.
    Normalizar: "todo mundo se contradiz — faz parte de ser complexo."
    NAO julgar. NAO tentar resolver. Apenas registrar com fidelidade.

  perguntas:
    abertura:
      - "Todo mundo tem areas onde o discurso e a pratica nao batem 100%. Sem julgamento — onde voce acha que isso acontece com voce?"

    tensoes:
      - "Tem algo que voce prega publicamente mas que na pratica e mais dificil do que faz parecer?"
      - "Qual opiniao sua mudou nos ultimos 2 anos? O que fez mudar?"
      - "Tem algum topico que voce evita falar em publico mesmo tendo opiniao forte? Por que?"

    evolucao:
      - "O 'voce' de 5 anos atras concordaria com o 'voce' de hoje? No que discordariam?"
      - "Que conselho voce dava antes que hoje nao daria mais?"

  regras_de_conducao:
    - "Comecar normalizando: 'Isso nao e pegadinha, e so pra capturar nuances'"
    - "Se resistir, nao forcar — registrar a resistencia como dado"
    - "Respostas curtas aqui sao normais — nao pressionar por mais"
    - "Contradicoes detectadas sao FEATURES nao bugs — registrar com fidelidade"
    - "Maximo 5 perguntas — nao prolongar alem do confortavel"
```

**Salvar em:** `01-sources/interview/bloco-5-contradicoes.md`

**Checkpoint:** Bloco 5 salvo com contradicoes e tensoes internas.

---

### Step 8: Bloco 6 — Tacito (5-10 min)

**Atividade do Agent:**
Perguntas que extraem o que a pessoa faz mas nao articula — o conhecimento tacito.

**Perguntas do Bloco:**

```yaml
bloco_6_tacito:
  titulo: "O que voce faz sem perceber"
  objetivo: "Extrair conhecimento tacito — coisas que faz automaticamente e nunca ensinou"
  tier: 0

  contexto_para_agente: |
    Conhecimento tacito e o mais dificil de extrair porque a pessoa nao sabe que sabe.
    As perguntas sao desenhadas pra provocar reflexao sobre o automatico.
    Paciencia e chave — pode precisar reformular a pergunta.

  perguntas:
    metacognicao:
      - "O que voce faz diferente do que ensina? Tem algo que funciona pra voce mas que voce nao consegue transformar em metodo?"
      - "Quando voce quebra suas proprias regras? Em que situacao o 'manual' nao se aplica?"
      - "Se alguem observasse voce trabalhando por um dia inteiro, o que essa pessoa notaria que voce mesmo nao nota?"

    intuicao:
      - "Voce ja tomou uma decisao 'errada' segundo todos os criterios logicos mas que deu certo? O que te fez ignorar a logica?"
      - "Quando voce olha pra um aluno/cliente pela primeira vez, o que voce 'saca' sobre a pessoa antes de qualquer dado?"

    automatico:
      - "O que voce faz nos primeiros 5 minutos de qualquer reuniao/aula/consultoria sem pensar? Tipo ritual inconsciente?"
      - "Se voce pudesse instalar uma 'habilidade secreta' sua na cabeca de outra pessoa, qual seria?"

  regras_de_conducao:
    - "Dar tempo para pensar — essas perguntas exigem introspecao"
    - "Se responder 'nao sei', reformular: 'Pensa no ultimo mes... teve alguma situacao onde...'"
    - "Respostas tipo 'ah, isso e so experiencia' merecem follow-up: 'Mas experiencia DE QUE especificamente?'"
    - "Registrar hesitacoes e reformulacoes — sao pistas de conhecimento tacito"
    - "Maximo 5 perguntas — qualidade > quantidade"
```

**Salvar em:** `01-sources/interview/bloco-6-tacito.md`

**Checkpoint:** Bloco 6 salvo com conhecimento tacito e insights metacognitivos.

---

### Step 9: Classificar e Indexar Respostas (3-5 min)

**Atividade do Agent:**

1. Para cada bloco salvo, atribuir Tier 0 (OURO MAXIMO)
2. Calcular word_count de cada bloco
3. Atualizar sources-inventory.yaml com as 6 novas fontes:

```yaml
interview_sources:
  - source_id: "INT-001-identidade"
    type: "deep_interview"
    tier: 0
    block: 1
    path: "01-sources/interview/bloco-1-identidade.md"
    word_count: N
    quality_notes: "Respostas {profundas/moderadas/superficiais}"

  - source_id: "INT-002-voz"
    type: "deep_interview"
    tier: 0
    block: 2
    path: "01-sources/interview/bloco-2-voz.md"
    word_count: N

  - source_id: "INT-003-pensamento"
    type: "deep_interview"
    tier: 0
    block: 3
    path: "01-sources/interview/bloco-3-pensamento.md"
    word_count: N

  - source_id: "INT-004-metodo"
    type: "deep_interview"
    tier: 0
    block: 4
    path: "01-sources/interview/bloco-4-metodo.md"
    word_count: N

  - source_id: "INT-005-contradicoes"
    type: "deep_interview"
    tier: 0
    block: 5
    path: "01-sources/interview/bloco-5-contradicoes.md"
    word_count: N

  - source_id: "INT-006-tacito"
    type: "deep_interview"
    tier: 0
    block: 6
    path: "01-sources/interview/bloco-6-tacito.md"
    word_count: N
```

3. Recalcular coverage_score com as novas fontes
4. Atualizar manifest:

```yaml
phase_1_5:
  status: completed
  completed_at: "{timestamp}"
  duration_minutes: N
  blocks_completed: 6
  total_words: XXXXX
  coverage_before: 0.XX
  coverage_after: 0.XX
  quality_notes: "Entrevista {completa/parcial}. Blocos mais ricos: {lista}"
```

**Checkpoint:** 6 blocos indexados como Tier 0. Coverage recalculado. Manifest atualizado.

---

### Step 10: Fechar Entrevista (1 min)

**Atividade do Agent:**

```yaml
elicit: false
output: |
  Entrevista concluida. Obrigado pela honestidade.

  | Bloco | Palavras | Profundidade |
  |-------|----------|-------------|
  | 1. Identidade | {N} | {alta/media/baixa} |
  | 2. Voz | {N} | {alta/media/baixa} |
  | 3. Pensamento | {N} | {alta/media/baixa} |
  | 4. Metodo | {N} | {alta/media/baixa} |
  | 5. Contradicoes | {N} | {alta/media/baixa} |
  | 6. Tacito | {N} | {alta/media/baixa} |

  Coverage: {antes} → {depois}
  Total: {XXXXX} palavras classificadas como Tier 0.

  Tudo salvo em minds/{slug}/01-sources/interview/.
  Proximo passo: Fase 2 — Extracao de MIUs.
```

**Checkpoint:** Entrevista finalizada. Sujeito informado. Pronto para Fase 2.

---

## Outputs

### Output Primario

**6 Arquivos de Entrevista**

Formato: Markdown com frontmatter YAML
Localizacao: `agents/clone-forge/minds/{slug}/01-sources/interview/`

| Arquivo | Bloco | Conteudo |
|---------|-------|---------|
| `bloco-1-identidade.md` | Identidade | Valores, pontos de virada, missao, rejeicoes |
| `bloco-2-voz.md` | Voz | Tom, expressoes, registro por contexto |
| `bloco-3-pensamento.md` | Pensamento | Heuristicas, decisoes, modelos mentais |
| `bloco-4-metodo.md` | Metodo | Frameworks, ensino, diferenciais |
| `bloco-5-contradicoes.md` | Contradicoes | Tensoes internas, evolucao, nuances |
| `bloco-6-tacito.md` | Tacito | Conhecimento nao-articulado, intuicao |

### Outputs Secundarios

1. **Sources Inventory Atualizado**
   - Formato: YAML
   - Localizacao: `minds/{slug}/01-sources/sources-inventory.yaml`
   - Conteudo: 6 novas fontes Tier 0 adicionadas

2. **Manifest Atualizado**
   - Formato: YAML
   - Localizacao: `minds/{slug}/manifest.yaml`
   - Conteudo: Status da Fase 1.5 com metricas

---

## Validacao

### Checklist

- [ ] Condicao de execucao verificada (subject_present AND coverage < 0.8)
- [ ] Sujeito entendeu o processo antes de comecar
- [ ] Bloco 1 (Identidade) salvo com pelo menos 5 perguntas respondidas
- [ ] Bloco 2 (Voz) salvo com pelo menos 5 perguntas respondidas
- [ ] Bloco 3 (Pensamento) salvo com pelo menos 5 perguntas respondidas
- [ ] Bloco 4 (Metodo) salvo com pelo menos 5 perguntas respondidas
- [ ] Bloco 5 (Contradicoes) salvo com pelo menos 3 perguntas respondidas
- [ ] Bloco 6 (Tacito) salvo com pelo menos 3 perguntas respondidas
- [ ] Todos os 6 arquivos tem frontmatter com source_id, tier: 0, block
- [ ] Sources inventory atualizado com 6 novas fontes
- [ ] Coverage recalculado e registrado no manifest
- [ ] Tom conversacional mantido (nao pareceu formulario)

### Criterios de Sucesso

**Threshold: 9/12 no checklist acima**

| Criterio | Excelente (3) | Aceitavel (2) | Fraco (1) |
|----------|--------------|----------------|---------|
| **Profundidade** | Respostas longas, historias concretas, reflexoes genuinas | Respostas adequadas, alguns exemplos | Respostas curtas, superficiais, defensivas |
| **Cobertura** | 6/6 blocos completos com profundidade | 6/6 blocos, 1-2 superficiais | Blocos pulados ou muito superficiais |
| **Tom** | Conversa fluida, sujeito confortavel, respostas espontaneas | Conversa ok, algumas respostas protocolares | Pareceu interrogatorio ou formulario |
| **Material para MIUs** | Cada bloco tem 5+ MIUs potenciais Tier 0 | Cada bloco tem 3+ MIUs potenciais | Material insuficiente para MIUs de qualidade |

---

## Error Handling

```yaml
errors:
  subject_uncomfortable:
    description: "Sujeito demonstra desconforto com uma pergunta"
    action: "Pular pergunta. Registrar: 'Pergunta X gerou desconforto — pulada por respeito.' Nao forcar."
    severity: "info"

  superficial_answers:
    description: "Sujeito respondendo com frases curtas e genericas"
    action: "Reformular pergunta. Pedir exemplo concreto. Se persistir, aceitar e seguir."
    fallback: "Registrar qualidade como 'superficial' no manifest"
    severity: "warning"

  subject_leaves_mid_interview:
    description: "Sujeito precisa sair antes de completar os 6 blocos"
    action: "Salvar blocos completados. Registrar blocos pendentes. Marcar como 'partial'."
    fallback: "Permitir retomada em sessao futura via *resume-interview"
    severity: "warning"

  time_constraint:
    description: "Menos de 30 minutos disponiveis"
    action: "Priorizar blocos 1, 3, 4 (identidade, pensamento, metodo). Pular 5 e 6."
    fallback: "Registrar como 'abbreviated' no manifest"
    severity: "warning"

  interview_in_wrong_language:
    description: "Sujeito responde em idioma diferente do esperado"
    action: "Aceitar no idioma do sujeito. Registrar idioma no frontmatter."
    severity: "info"
```

---

## Integracao

### Depende De

- **Task:** `collect-and-merge-sources` (Fase 1) — Fornece coverage_score e sources-inventory
- **Condicao:** `subject_present AND source_coverage < 0.8`

### Alimenta

- **Task:** `extract-mius` (Fase 2) — Consome blocos de entrevista como fontes Tier 0
- **MIU Extraction:** Cada bloco e uma fonte rica para extracao de MIUs de alta confianca
- **Driver Inference:** Blocos 1 e 5 alimentam diretamente a inferencia de drivers psicologicos

### Chained Tasks

```yaml
chain:
  previous: collect-and-merge-sources
  next: extract-mius
  condition: "subject_present AND source_coverage < 0.8"
  on_skip: "Prosseguir direto para extract-mius"
```

---

## Notas para o Executor

### Tom da Entrevista

Isto NAO e um formulario. E uma CONVERSA. A diferenca:

**ERRADO (formulario):**
> "Pergunta 1: Quais sao seus valores? Pergunta 2: Quais sao suas rejeicoes? Pergunta 3: Qual e sua missao?"

**CERTO (conversa):**
> "Me conta... qual foi o momento que mudou tudo pra voce? [resposta] Interessante. E o que voce sentiu naquela hora? [resposta] E hoje, olhando pra tras, o que voce tiraria daquela experiencia como valor inegociavel?"

### Quando o Sujeito e o Proprio Operador

Na maioria dos casos no Clone Forge, a pessoa sendo clonada e a mesma pessoa operando o AIOS. Isso muda a dinamica:
- Nao precisa explicar conceitos tecnicos
- Pode ser mais direto nas perguntas
- As respostas tendem a ser mais reflexivas
- A pessoa pode se sentir estranha "se entrevistando" — normalizar isso

### Blocos Mais Dificeis

Bloco 5 (Contradicoes) e Bloco 6 (Tacito) sao os mais dificeis porque exigem vulnerabilidade e introspecao. Dicas:
- Comecar SEMPRE normalizando: "todo mundo se contradiz"
- Dar exemplos proprios (ficticios) para quebrar o gelo
- Aceitar "nao sei" como resposta valida — registrar
- Nao insistir se houver resistencia genuina

---

## Historico de Revisoes

| Versao | Data | Mudanca |
|---------|------|--------|
| 1.0.0 | 2026-03-02 | Release inicial de producao |
