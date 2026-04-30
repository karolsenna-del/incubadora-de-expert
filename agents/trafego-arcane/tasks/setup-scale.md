---
task: "Setup Scale Campaign"
responsavel: "@scale-operator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Contas configuradas (QG-TA-001), criativos prontos, produto, Estrela Guia"
Saida: "Campanha Andromeda estruturada na conta escala, pronta pra ativar"
Checklist:
  - "Campanha nomeada ANDRO_PRODUTO"
  - "~6 conjuntos com nomenclatura correta"
  - "Publicos configurados (ADV_Puro + clusters + QUENTE)"
  - "9+ criativos subidos com nomenclatura FORMATO_ANGULO_H"
  - "URLs com UTMs em todos os anuncios"
  - "Exclusao de compradores 180d"
execution_type: "interactive"
---

# Task: Setup Scale Campaign — Montar Campanha Escala

## Executive Summary

Cria a campanha Andromeda principal na conta escala. Estrutura completa com ~6 conjuntos, publicos Advantage+, criativos com nomenclatura, UTMs. Toda acao via Meta API com aprovacao humana.

## Steps

### Step 1: Criar campanha

**APROVACAO HUMANA**

Via Meta API:
```
POST /act_{scale_id}/campaigns
  name: "ANDRO_{PRODUTO}"
  objective: "OUTCOME_SALES"
  special_ad_categories: []
  buying_type: "AUCTION"
```

### Step 2: Criar ~6 conjuntos ABO

**APROVACAO HUMANA**

Para cada conjunto:
```
POST /act_{scale_id}/adsets
  campaign_id: {campaign_id}
  name: "{TEMP}_{TIPO}"
  optimization_goal: "OFFSITE_CONVERSIONS"
  billing_event: "IMPRESSIONS"
  daily_budget: {budget}
  targeting: {audience_spec}
```

Conjuntos padrao Andromeda:
1. ADV_Puro — sem sugestoes (controle)
2. ADV_Int-mkt-digital — com sugestao
3. ADV_Int-empreendedorismo — com sugestao
4. ADV_Int-ia — com sugestao
5. ADV_LAL-compradores — com lookalike
6. QUENTE_Audiencia-completa — engajadores + visitantes

### Step 3: Configurar publicos

Cada conjunto com targeting especifico:
- ADV_Puro: Advantage+ sem sugestoes
- ADV_Int-*: Advantage+ com sugestoes tematicas (guardrails)
- QUENTE: audiencia personalizada (engajamento 365d + visitantes 180d)
- TODOS: exclusao de compradores 180d

### Step 4: Subir criativos

**APROVACAO HUMANA**

Para cada criativo (min 9 = 3 C1 + 3 C2 + 3 C3):
```
POST /act_{scale_id}/adcreatives
  name: "{FORMATO}_{ANGULO}_{H}"
  object_story_spec: {creative_spec}

POST /act_{scale_id}/ads
  name: "{FORMATO}_{ANGULO}_{H}"
  adset_id: {adset_id}
  creative: {creative_id}
  tracking_specs: {utm_url}
```

Mesmos criativos em todos os conjuntos (padrao Andromeda).

### Step 5: Configurar UTMs

URL padrao do UTMify em TODOS os anuncios:
```
{landing_page}?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&xcod=...
```

### Step 6: Quality Gate QG-TA-002

- [ ] Campanha nomeada corretamente
- [ ] ~6 conjuntos com nomenclatura
- [ ] Publicos configurados
- [ ] 9+ criativos subidos
- [ ] UTMs em todos
- [ ] Exclusao de compradores

Se PASS → campanha pronta pra ativar em operate-scale.

## Error Handling

| Cenario | Acao |
|---------|------|
| Menos de 9 criativos disponiveis | Avisar traffic-strategist. Subir o que tem, pedir mais ao squad externo. |
| Erro na API | Retry 1x. Se persistir, reportar. |
