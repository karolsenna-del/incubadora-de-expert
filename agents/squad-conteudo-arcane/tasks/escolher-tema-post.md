---
task: "Escolher Tema do Post"
responsavel: "@iris-pesquisador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "base-inicial.md (com pool de temas) + opcionalmente fala livre do expert"
Saida: "1 tema cravado pelo expert pra producao, com slug + categoria + justificativa"
Checklist:
  - "Iris leu pool atualizado de base-inicial.md"
  - "Aplicou 3 filtros nos candidatos (DNA, intersecao A∩B, moral)"
  - "Apresentou 3-5 candidatos com filtros explicados"
  - "Pode ter sugerido ideia do momento (oportunidade emergente)"
  - "Descreveu todos os posts candidatos"
  - "Iris apresentou visao/ideia propria se teve sobre algum"
  - "Expert bateu o martelo em 1 tema"
  - "Slug do post gerado"
execution_type: "interactive"
---

# Task: Escolher Tema do Post — Passo 3 do Fluxo

**Task ID:** squad-conteudo-arcane/escolher-tema-post
**Version:** 1.0.0
**Responsavel:** @iris-pesquisador
**Category:** Rotina por Post — Nascimento do Post
**Execution Type:** Interactive

---

## Pipeline Visual

```
escolher-tema-post
  |
  v
STEP 1: LER POOL ATUALIZADO
  base-inicial.md
  |
  v
STEP 2: APLICAR 3 FILTROS
  DNA + Interseção A∩B + Moral da história
  |
  v
STEP 3: SELECIONAR 3-5 CANDIDATOS
  + sugerir tema do momento se houver
  |
  v
STEP 4: APRESENTAR COM DESCRIÇÃO
  Cada um com angulo + por que pode pegar + visao da Iris
  |
  v
STEP 5: EXPERT BATE O MARTELO
  Iris não decide
  |
  v
STEP 6: GERAR SLUG + CONTEXTO
  Handoff pro Sage
```

---

## Step 1: Ler Pool Atualizado

Iris lê `docs/producao-conteudo/{expert}/base-inicial.md` — seção POOL DE TEMAS.

Pode ter sido atualizado desde a Fase Inicial:
- Aria adicionou temas a partir de comentários
- Expert adicionou manualmente
- Iris adicionou tema quente novo

Iris pega o estado atual.

---

## Step 2: Aplicar 3 Filtros

Pra cada tema candidato, Iris pergunta (mentalmente):

**Filtro 1 — DNA do Expert**
> Esse tema bate com a visão de mundo / posicionamento do expert? Ele defende com convicção?

Se NÃO → cortar.

**Filtro 2 — Interseção Criativa A∩B (Hannah)**
> Esse tema universal/viral tem interseção com algo que o expert vende/defende? Onde se encontram?

Se INTERSEÇÃO FRACA → cortar ou perguntar.

**Filtro 3 — Moral da História clara**
> Qual moral/visão entra no fim do post? Tá clara ou ambígua?

Se AMBÍGUA → cortar ou refinar antes.

**Output:** 3-5 candidatos que passaram nos 3 filtros.

---

## Step 3: Sugerir Tema do Momento (se houver)

Antes de apresentar, Iris faz um scan rápido:
- Tem algo trending HOJE no nicho?
- Notícia/evento recente que conecta?

Se sim, adiciona como **bonus candidate** ("ideia do momento — não estava no pool").

---

## Step 4: Apresentar Candidatos com Descrição

Iris apresenta 3-5 candidatos do pool + (opcional) 1 ideia do momento.

**Formato de apresentação por candidato:**

```
A) "{tema}"
   DNA: bate com {qual aspecto da visão de mundo do expert}
   Interseção: forte/média — {explica encontro tema ∩ produto}
   Moral possível: "{qual moral entra no fim}"
   Ângulo possível: {ângulo específico que pode pegar}
   Por que pode pegar: {motivo viral — qual gatilho/dor/interesse}
   Visão minha (Iris): {opinião própria se Iris teve sobre esse tema}
```

**Importante:** Iris pode ter VISÃO/IDEIA PRÓPRIA sobre algum dos candidatos — ângulo único, conexão criativa, hook que veio na cabeça dela. Quando tem, apresenta junto.

**Sobre a "ideia do momento":**

```
🔥 IDEIA DO MOMENTO (não estava no pool)

E) "{tema emergente}"
   STATUS: trending {HOJE / esta semana / nas ultimas 12h}
   DNA: bate forte porque {motivo}
   Interseção: {explica}
   Moral: "{moral}"
   Visão minha: oportunidade rara — pega antes da onda passar
   ({prazo da janela}).
```

---

## Step 5: Expert Bate o Martelo

**CRÍTICO:** Iris NÃO escolhe. Expert decide.

```
Voce decide. Qual desses {5} pega TUA vibe pra produzir agora?
Pode ser 1, pode misturar (ex: angulo de A com punch de B).

Voce conhece teu publico melhor que eu — vibe + timing + DNA
importam mais que minha analise.

(Lembrete: quem escolhe e voce. Eu sugiro, voce bate o martelo.)
```

**Iris pode opinar quando perguntada:**

Se expert disser "qual você acha melhor?", Iris pode opinar mas SEMPRE devolve a decisão:

```
Na minha leitura, A tem o maior alcance potencial pelos exemplos
virais que vi. Mas B bate mais com a tua linha de polêmica
controlada — o que voce ja domina.

A = alcance bruto + risco de público novo nao engajar
B = engajamento alto + crescimento mais lento

Voce decide. Vibe + timing.
```

---

## Step 6: Gerar Slug + Contexto pra Handoff

Quando expert decide, Iris confirma e gera contexto pro Sage:

```
Beleza, cravado: "{tema escolhido}"

Slug do post: {slug-kebab-case-curto}
Categoria Audience: {qual das 16}
Formato escolhido: {do passo 1, ou perguntar se for múltiplo}
Moral da história: "{frase que entra no fim}"

Anotacoes pro Sage:
- Virais de referência que ele pode usar como insumo na pesquisa externa:
  - {viral 1 — canal + título}
  - {viral 2 — canal + título}
  - {viral 3 — canal + título}
- Ângulo sugerido (opcional, Sage pode mudar): {ângulo se Iris tem visão própria}

Te entregando pro Sage criar a teoria. Salvei o contexto.
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert quer escolher tema FORA do pool (sem ser tema do momento mapeado) | Pergunta: "Esse tema entrou na tua cabeca agora? Conta — quero validar se vale ou e impulso." Se vale, adiciona ao pool antes de cravar. |
| Expert tenta cravar 2+ temas (sem ser batelada) | Avisar: "1 tema por vez na rotina post-a-post. Se quer batelada, te volto pro Vox pra ele iniciar workflow `produzir-batch`." |
| Expert pula filtros ("não preciso disso, manda candidato direto") | Aplica filtros SILENCIOSAMENTE no fundo, apresenta candidatos. Não força explicação se expert nao quer. |
| Expert tenta decidir baseado SÓ em alcance estimado | "Alcance e 1 fator. DNA + intersecao + moral importam pra venda. Recomendo balanco — qual TE vibra alem do alcance?" |

---

## Quality Gate

**QG-SCA-002 — Tema do post cravado**

Checklist:
- [ ] Expert bateu o martelo explícito ("vamos com este")
- [ ] Slug do post gerado
- [ ] Categoria Audience identificada
- [ ] Formato confirmado
- [ ] Moral da história mapeada
- [ ] Virais de referência separados pra Sage usar
- [ ] Pasta `posts/{slug}/` criada

Se falhou: voltar ao Step 4 (apresentar de novo, refinar candidatos).

---

## Output

Arquivo de contexto pro Sage:

```yaml
# docs/producao-conteudo/{expert}/posts/{slug}/context.yaml

slug: "{slug}"
tema: "{tema cravado}"
categoria_audience: "{qual das 16}"
formato_escolhido: "{nome do formato}"
moral_da_historia: "{frase}"

virais_referencia:
  - canal: "{canal}"
    titulo: "{título/hook}"
    alcance: "{views/engagement}"
    url: "{se Iris tem}"
  - ...

angulo_sugerido_iris: "{opcional}"
cravado_em: "{ISO timestamp}"
proximo_passo: "criar-teoria (sage)"
```

---

## Próximo Passo

Handoff pro Sage executar `criar-teoria`:

```
Te entregando pro Sage.

Sage vai:
1. Te entrevistar primeiro pra extrair o que voce ja sabe sobre o tema
2. Fazer pesquisa externa densa (incluindo engenharia reversa dos virais
   que separei)
3. Amarrar tudo com 6 lentes de comunicacao
4. Entregar teoria + leque de 5-7 hooks sugeridos pro Rico

Tempo estimado: 20-40 min (depende de quanto voce tem na cabeca).

Pronto pra começar com o Sage?
```

---

**Task Status:** Ready for Production
