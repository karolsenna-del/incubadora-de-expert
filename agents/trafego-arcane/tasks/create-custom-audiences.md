---
task: "Create Custom Audiences"
responsavel: "@setup-operator | @scale-operator | @test-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Conta de anúncios definida + pixel ativo + página FB/IG vinculados + System User token no data/.env"
Saida: "Conjunto completo de Custom Audiences do Método Andromeda criado/validado na conta. IDs salvos pra uso nos adsets."
Checklist:
  - "2 ToS aceitos (lista de clientes + site/pixel)"
  - "Públicos QUENTES criados (IG degradê, FB degradê, Vídeo 50%, Site, Lista compradores, Lista leads)"
  - "Exclusões disponíveis (compradores via Purchase/lista, leads)"
  - "Lookalike 1% das melhores bases (opcional, após listas processarem)"
  - "IDs salvos pra uso na próxima task"
execution_type: "interactive"
quality_gate: "Audiências validadas por listagem na API (GET /customaudiences)"
version: "2.0.0"
last_updated: "2026-05-30"
changelog_2_0_0: "Reescrito como SOP completo após validação real na BM nova. CORRIGE sintaxe v21 (rule-based NÃO leva subtype). Adiciona: 2 ToS, pipeline Supabase→hash→upload, degradê completo, lookalikes, troubleshooting com erros reais."
---

# Task: Create Custom Audiences — SOP de Públicos do Método Andromeda

> **Fonte de verdade da SINTAXE de API.** O conceito de cada público (o que é, quando usar, as 5 Leis) vive em `knowledge/publicos-reference.md`. Aqui está o COMO criar via Meta Marketing API, validado na prática (v21.0, 30/05/2026).

## Por que isso roda no setup

Antes de subir campanha Andromeda, a conta precisa do **set de públicos** que alimenta:
1. **Conjunto Quente** (engajamento + site + listas combinados)
2. **Exclusões** (compradores e/ou leads em todos os conjuntos)
3. **Lookalikes** (base fria de alta qualidade)

Chamado pelo `setup-operator` (Step 8) ou direto por scale/test-operator.

---

## ⚠️ PRÉ-REQUISITO CRÍTICO: 2 ToS separados (conta nova)

Conta nova **bloqueia** criação de público até aceitar **DOIS** Termos de Serviço distintos. Aceite é **manual** (não tem via API). Abrir com `open "<url>"`:

| ToS | URL (trocar `<ID>` pelo ad account sem `act_`) | Destrava | Erro se faltar |
|-----|-----|----------|----------------|
| **Lista de clientes** | `https://business.facebook.com/ads/manage/customaudiences/tos/?act=<ID>` | subtype CUSTOM (compradores/leads) | `1870090` |
| **Site/Pixel** | `https://www.facebook.com/customaudiences/app/tos/?act=<ID>` | WEBSITE (site visitors) | `2663` |

Aceitar um NÃO destrava o outro. Engagement (IG/FB/vídeo) não exigiu ToS.

---

## 🔑 A REGRA DE OURO DA SINTAXE v21+

**Audiências rule-based (WEBSITE e ENGAGEMENT) NÃO recebem o parâmetro `subtype`.** Só `name` + `rule`. Mandar `subtype` → erro `2654` "subtipo não aceito na versão atual". (Não é versão — testado v20/v21/v22/v23.)

**Só CUSTOM (lista) usa `subtype=CUSTOM`** + `customer_file_source`.

A KB antiga mandava `subtype` em tudo e `event=PageView` no site — **errado**. Não copiar de versões anteriores.

---

## Pipeline

```
START → [Bloco 0] Conferir 2 ToS
      → [Bloco 1] Carregar credenciais (load-meta-creds.sh)
      → [Bloco 2] Extrair bases do Supabase (compradores + leads)
      → [Bloco 3] PREVIEW + aprovação humana
      → [Bloco 4] Criar públicos de regra (engajamento + site)
      → [Bloco 5] Criar listas (CUSTOM) + upload hasheado
      → [Bloco 6] Lookalike 1% (após listas processarem)
      → [Bloco 7] Verificar (GET /customaudiences)
END
```

---

## Bloco 1 — Carregar credenciais

```bash
source ./data/load-meta-creds.sh
```

Precisa: `META_TOKEN`, `META_API_VERSION` (v21.0+), `META_ACCT_MAIN`, `META_PIXEL`, `META_PAGE`, `META_IG`. Se falhar → `data/meta-api-credentials.md`.

Validar token: `curl -s "https://graph.facebook.com/${META_API_VERSION}/me?access_token=${META_TOKEN}"`

---

## Bloco 2 — Extrair bases do Supabase

Credenciais em `knowledge/supabase-data-access.md` (anon key LÊ `pessoas` e `compras`).

- **Compradores** = `pessoa_id` distinto em `compras` com status pago. **Pago = todos os status MENOS `Boleto Gerado` e `Cancelado`** (os pagos aparecem como `invoice.payment_succeeded`, `aprovado`, `NewSale`, `Paga`, `Efetivado`, `paid`).
- **PII** vem de `pessoas` (`email`, `telefone`). `compras` só tem `pessoa_id`.
- **Leads / base total** = `pessoas` com email/telefone (decidir com o Euriler: base total vs só não-compradores).

```python
# paginação PostgREST: Range 0-999, 1000-1999... (cap 1000/req)
# join: set de pessoa_id pagos → filtrar pessoas → email/telefone
# salvar /tmp/buyers.json e /tmp/allpeople.json
```

Reportar contagem ANTES de subir. Referência (30/05/2026): ~12.519 compradores únicos, ~48k base total. Match Meta esperado: leads 70-85%, compradores 40-45% (e-mail de compra antigo casa pior).

---

## Bloco 3 — Preview obrigatório

Mostrar ao usuário o que vai criar (quente degradê + listas + tamanhos reais extraídos) e os 2 ToS. **Aprovação humana antes de qualquer escrita** (Regra Cardinal).

---

## Bloco 4 — Públicos de REGRA (sem subtype, só `rule`)

Helper Python (`post()` faz POST form-encoded em `/{ACCT}/customaudiences`). `retention_seconds = dias*86400`.

### IG Engagement — degradê 30/60/90/180/365D
```python
rule = {"inclusions":{"operator":"or","rules":[{
  "event_sources":[{"type":"ig_business","id":META_IG}],
  "retention_seconds": dias*86400,
  "filter":{"operator":"and","filters":[{"field":"event","operator":"=","value":"ig_business_profile_all"}]}
}]}}
# POST name="[Q] IG Engaged {dias}D", rule=json.dumps(rule)  — SEM subtype
```
(`ig_business_profile_all` = todos que engajaram/visitaram perfil. Variante: `ig_business_profile_engaged`.)

### FB Engagement — degradê 30/180/365D
```python
# igual, mas: event_sources type="page", id=META_PAGE; event value "page_engaged"
```

### Vídeo 50% — 365D
```python
# event_sources type="page", id=META_PAGE
# filters: [{"field":"event","operator":"=","value":"video_view"},
#           {"field":"video_progress_percent","operator":">=","value":50}]
```
> Via API o vídeo pega views automaticamente (orgânico + ads) — NÃO tem a marcação manual semanal da UI.

### Site Visitors — 30/180D (precisa ToS site/pixel)
```python
rule = {"inclusions":{"operator":"or","rules":[{
  "event_sources":[{"type":"pixel","id":META_PIXEL}],
  "retention_seconds": dias*86400,
  "filter":{"operator":"and","filters":[{"field":"url","operator":"i_contains","value":""}]},
  "template":"ALL_VISITORS"
}]}}
# POST name="[Q] Site Visitors {dias}D", rule=..., prefill=true  — SEM subtype
```
> Site: `template:ALL_VISITORS` + filtro url vazio. **NÃO** usar `event=PageView` (erro 2654). Pixel novo → começa vazio, enche com tráfego.

---

## Bloco 5 — LISTAS (CUSTOM) + upload

### Criar o slot (subtype CUSTOM)
```python
post(f"{ACCT}/customaudiences", {
  "name":"Compradores — Supabase", "subtype":"CUSTOM",
  "customer_file_source":"USER_PROVIDED_ONLY", "description":"...", "access_token":TOKEN})
# → retorna id
```

### Upload hasheado (SHA256)
```python
# Normalizar ANTES do hash:
#   email: trim + lowercase
#   telefone: só dígitos, DDI 55 (prefixar se 10-11 díg; descartar fora de 12-13 díg)
# schema ["EMAIL","PHONE"]; rows [[sha256(email) ou "", sha256(phone) ou ""]]
# POST /{audience_id}/users  payload={"schema":[...],"data":[batch]}  — batches de 10.000
```
Resposta traz `num_received` e `num_invalid_entries` (validar = 0 inválidos). Lista de compradores serve dual: exclusão de aquisição + remarketing upsell.

---

## Bloco 6 — Lookalike 1% (após listas saírem de "Atualizando")

Melhor base = compradores (Lei 3). Mínimo Meta = 1.000 matched.
```python
post(f"{ACCT}/customaudiences", {
  "name":"LAL 1% Compradores BR", "subtype":"LOOKALIKE",
  "origin_audience_id": buyers_id,
  "lookalike_spec": json.dumps({"type":"similarity","country":"BR","ratio":0.01}),
  "access_token":TOKEN})
```
Ordem de qualidade da base: Compradores > Leads > Site > Engajamento. Sempre **1%** (Lei 3). Não colocar interesses no LAL.

---

## Bloco 7 — Verificação (Quality Gate QG-CA-001)

```bash
curl -s "https://graph.facebook.com/${META_API_VERSION}/${META_ACCT_MAIN}/customaudiences?fields=id,name,subtype,approximate_count_lower_bound,operation_status&limit=100&access_token=${META_TOKEN}"
```

- [ ] Públicos quentes do degradê existem
- [ ] Listas com `num_invalid_entries=0`
- [ ] IDs capturados pra setup-scale/setup-test
- [ ] Avisar: tamanho real leva ~30min-2h (status "Atualizando"); engajamento incha puxando histórico; site começa vazio (pixel novo)

---

## Troubleshooting (erros REAIS encontrados)

| Erro | Código | Causa | Fix |
|------|--------|-------|-----|
| "Termos do Público Personalizado não aceitos" | 1870090 | ToS lista não aceito | abrir `business.facebook.com/ads/manage/customaudiences/tos/?act=ID` |
| "Terms of service has not been accepted" | 2663 | ToS site/pixel não aceito | abrir `facebook.com/customaudiences/app/tos/?act=ID` |
| "subtipo não é aceito na versão atual" | 2654/1870053 | mandou `subtype` em rule-based | remover `subtype`, mandar só `rule` |
| "Nome do evento inválido" | 2654/1713151 | event value errado OU `subtype` junto | remover subtype; usar event values deste SOP |
| "Formato da regra JSON inválido" | 100/1713098 | rule sem `filter` | toda rule precisa de bloco `filter` |
| Token sem permissão | 200 | falta `ads_management` | verificar System User |

> MCP oficial Meta (`mcp__claude_ai_Meta__*`) ajuda a descobrir sintaxe, mas NÃO enxerga BMs novas (só login claude.ai). Pra conta nova = curl + System User token do `.env`.

---

## Manutenção

| Frequência | Tarefa |
|-----------|--------|
| Automático | IG/FB/Site/Vídeo (rule) atualizam sozinhos — nunca recriar |
| Quando houver novos | Re-upload de lista (compradores/leads) com delta do Supabase |
| Após nova conta na BM | Compartilhar audiências (mesmas audiências servem todas as contas da BM) |

---

**Task Status:** Ready for Production (v2.0.0 — validado em conta real)
