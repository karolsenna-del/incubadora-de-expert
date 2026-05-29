---
task: "Sugerir Tema do Momento"
responsavel: "@iris-pesquisador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nicho do expert + (opcional) noticia/evento atual"
Saida: "Tema do momento avaliado + recomendacao (entrar ou nao)"
Checklist:
  - "Identificou tema trending atual"
  - "Avaliou se bate com nicho/DNA"
  - "Avaliou janela temporal (saturacao iminente?)"
  - "Recomendou entrar ou nao com justificativa"
execution_type: "interactive"
---

# Task: Sugerir Tema do Momento — Apoio Rápido

**Task ID:** squad-conteudo-arcane/sugerir-tema-do-momento
**Version:** 1.0.0
**Responsavel:** @iris-pesquisador
**Category:** Apoio Passo 3
**Execution Type:** Interactive

---

## Propósito

Diferente do tema viral (do pool), o tema do momento é HYPE PASSAGEIRO — notícia, evento, polêmica que aparece e some.

Iris avalia se vale entrar.

---

## Pipeline

```
sugerir-tema-do-momento
  |
  v
STEP 1: IDENTIFICAR TEMA TRENDING ATUAL
  Expert traz OU Iris detecta
  |
  v
STEP 2: 4 CRITERIOS DE AVALIACAO
  |
  v
STEP 3: RECOMENDAR ENTRAR OU NAO
```

---

## Step 1: Identificar Tema Trending

Iris detecta via:
- Notícias do nicho
- Eventos públicos com ressonância
- Polêmicas em redes sociais
- Crises/escândalos relevantes

OU expert traz pra avaliar.

---

## Step 2: 4 Critérios de Avaliação

**Critério 1 — Está em alta AGORA?**
- Sim → segue avaliando
- Já passou → não vale (janela fechou)

**Critério 2 — Bate com nicho/DNA do expert?**
- Bate → segue
- Não bate → cortar (forçado = inautêntico)

**Critério 3 — Expert consegue sustentar com visão única?**
- Tem opinião própria forte → segue
- Não tem o que dizer de novo → cortar

**Critério 4 — Vale pegar antes de saturar?**
- Janela aberta (1-7 dias) → vale
- Mercado já saturou → não vale (post fica "mais um")

---

## Step 3: Recomendar

Se passou nos 4 critérios:

```
🔥 TEMA DO MOMENTO: "{tema}"

STATUS: trending HOJE / esta semana
DNA: bate ({como})
VISÃO ÚNICA: você tem ({qual angulo})
JANELA: {prazo estimado — ex: "próximos 2-4 dias"}

RECOMENDAÇÃO: ENTRAR.

Vale ir direto pro Sage criar teoria — velocidade importa aqui.
```

Se não passou:

```
TEMA "{tema}"

NÃO RECOMENDO ENTRAR porque:
- {critério que falhou}

Foco no pool — temas perenes performam melhor a longo prazo.
```

---

**Task Status:** Ready for Production
