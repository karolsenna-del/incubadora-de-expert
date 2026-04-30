---
task: "Setup Test Campaign"
responsavel: "@test-operator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Contas configuradas (QG-TA-001), criativos prontos, produto, Estrela Guia"
Saida: "Campanha teste estruturada na conta teste, pronta pra ativar"
Checklist:
  - "Campanha nomeada TESTE_PRODUTO_LOTE"
  - "~6 conjuntos com nomenclatura correta"
  - "Publicos configurados (ADV_Puro + clusters + QUENTE)"
  - "Criativos subidos com nomenclatura FORMATO_ANGULO_H"
  - "URLs com UTMs em todos os anuncios"
  - "Exclusao de compradores 180d"
execution_type: "interactive"
---

# Task: Setup Test Campaign — Montar Campanha Teste

## Executive Summary

Cria a campanha de teste na conta teste. Estrutura espelhada da escala (mesma coisa: ~6 conjuntos, publicos, criativos). Diferenca: nomenclatura com TESTE_ e mentalidade experimental. Criativos NOVOS entram aqui primeiro — nunca direto na escala.

## Steps

### Step 1: Criar campanha teste

**APROVACAO HUMANA**

Via Meta API:
```
POST /act_{test_id}/campaigns
  name: "TESTE_{PRODUTO}_{LOTE}"
  objective: "OUTCOME_SALES"
  special_ad_categories: []
  buying_type: "AUCTION"
```

Nomenclatura de lote: L01, L02, L03... (cada batch de testes = novo lote).

### Step 2: Criar ~6 conjuntos ABO

**APROVACAO HUMANA**

Mesma estrutura da escala:
```
POST /act_{test_id}/adsets
  campaign_id: {campaign_id}
  name: "{TEMP}_{TIPO}"
  optimization_goal: "OFFSITE_CONVERSIONS"
  billing_event: "IMPRESSIONS"
  daily_budget: {budget}
  targeting: {audience_spec}
```

Conjuntos padrao:
1. ADV_Puro — sem sugestoes (controle)
2. ADV_Int-mkt-digital — com sugestao
3. ADV_Int-empreendedorismo — com sugestao
4. ADV_Int-ia — com sugestao
5. ADV_LAL-compradores — com lookalike
6. QUENTE_Audiencia-completa — engajadores + visitantes

### Step 3: Configurar publicos

Mesmas regras da escala:
- ADV_Puro: Advantage+ sem sugestoes
- ADV_Int-*: Advantage+ com sugestoes tematicas
- QUENTE: audiencia personalizada (engajamento 365d + visitantes 180d)
- TODOS: exclusao de compradores 180d

### Step 4: Subir criativos

**APROVACAO HUMANA**

Criativos novos entram AQUI PRIMEIRO:
```
POST /act_{test_id}/adcreatives
  name: "{FORMATO}_{ANGULO}_{H}"
  object_story_spec: {creative_spec}

POST /act_{test_id}/ads
  name: "{FORMATO}_{ANGULO}_{H}"
  adset_id: {adset_id}
  creative: {creative_id}
  tracking_specs: {utm_url}
```

Mesmos criativos em todos os conjuntos.

### Step 5: Configurar UTMs

URL padrao UTMify em TODOS os anuncios:
```
{landing_page}?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&xcod=...
```

### Step 6: Quality Gate QG-TA-002 (parte teste)

- [ ] Campanha nomeada corretamente (TESTE_PRODUTO_LOTE)
- [ ] ~6 conjuntos com nomenclatura
- [ ] Publicos configurados
- [ ] Criativos subidos
- [ ] UTMs em todos
- [ ] Exclusao de compradores

Se PASS → campanha teste pronta pra rodar experimentos.

## Error Handling

| Cenario | Acao |
|---------|------|
| Menos criativos disponiveis que o ideal | Ok — teste e mais flexivel. Subir o que tem. |
| Erro na API | Retry 1x. Se persistir, reportar. |
| Conta teste nao existe | Rotear pra onboard (chief). |
