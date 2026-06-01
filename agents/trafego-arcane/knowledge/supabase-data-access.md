# Acesso a Dados Reais — Supabase API

INSTRUCAO CRITICA: Sempre que precisar de metricas reais da campanha (vendas, leads, spend, CPA, criativos, etc.), consulte o Supabase usando os comandos abaixo. NAO dependa apenas do Gerenciador Meta — os dados do Supabase sao mais confiaveis para contagem de vendas porque vem do Hotmart (fonte de verdade).

---

## Credenciais

```
SUPABASE_URL=https://tzvfkdqzdkftcqfourom.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM
CAMPAIGN_REF=NDF0326
# Launch slug do ciclo ativo (atualizar a cada shift):
LAUNCH_SLUG=ndf-2026-03-28
```

## Dashboard Visual

https://launch-command-center.vercel.app

---

## Como Puxar Dados

### 1. Dashboard Completo (total / ontem / hoje)

```bash
curl -s -X POST 'https://tzvfkdqzdkftcqfourom.supabase.co/rest/v1/rpc/get_launch_dashboard' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' \
  -H 'Content-Type: application/json' \
  -d '{"p_campaign_ref": "NDF0326"}' | python3 -m json.tool
```

**Retorna (por periodo: total, yesterday, today):**
- `sales` — vendas do produto principal (exclui OBs)
- `revenue` — receita total (principal + OBs)
- `spend` — gasto em ads (Meta)
- `leads` — leads unicos
- `cost_per_sale` — CPA real (spend / sales)
- `avg_ticket` — ticket medio
- `page_conversion` — vendas / LPV (%)
- `checkout_conversion` — vendas / leads (%)
- `landing_page_views` — visualizacoes de pagina
- `link_clicks` — cliques no link
- `connect_rate` — LPV / link_clicks (%)
- `cpm`, `ctr` — metricas de ads
- `ob_total_pct`, `ob_apostila_pct`, `ob_gravacao_pct` — conversao de order bumps
- `roi` — revenue / spend
- `bump1_count`, `bump2_count` — quantidade de OBs vendidos

### 2. Scoreboard de Criativos

```bash
curl -s -X POST 'https://tzvfkdqzdkftcqfourom.supabase.co/rest/v1/rpc/get_creative_scoreboard' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' \
  -H 'Content-Type: application/json' \
  -d '{"p_campaign_ref": "NDF0326"}' | python3 -m json.tool
```

**Retorna (1 linha por criativo, ordenado por vendas desc):**
- `ad_name` — nome do criativo (normalizado, sem sufixo de conjunto _C1/_C2/_C3)
- `sales` — vendas atribuidas a esse criativo
- `revenue` — receita atribuida
- `spend` — gasto total nesse criativo (todos os conjuntos somados)
- `cost_per_sale` — CPA do criativo
- `rpm` — receita por 1000 page views (metrica principal de qualidade)
- `hook_rate` — % de views de 3s / impressoes (so pra video)
- `ctr` — click-through rate
- `connect_rate` — LPV / link_clicks
- `page_conversion` — vendas / LPV
- `lpv` — landing page views
- `cpc` — custo por clique
- `impressions`, `clicks`, `link_clicks`, `reach`, `video_views`

### 3. Vendas por Dia

```bash
curl -s 'https://tzvfkdqzdkftcqfourom.supabase.co/rest/v1/v_campaign_sales?campaign_ref=eq.NDF0326&order=sale_date.asc' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' | python3 -m json.tool
```

### 4. Leads por Dia

```bash
curl -s 'https://tzvfkdqzdkftcqfourom.supabase.co/rest/v1/v_campaign_leads?campaign_ref=eq.NDF0326&order=lead_date.asc' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM' | python3 -m json.tool
```

---

## Quando Usar Cada Fonte

| Preciso de... | Fonte | Comando |
|---------------|-------|---------|
| Visao geral rapida (CPA, vendas, ROI) | Dashboard RPC | get_launch_dashboard |
| Qual criativo ta vendendo mais | Creative Scoreboard | get_creative_scoreboard |
| Tendencia diaria de vendas | v_campaign_sales | GET view |
| Tendencia diaria de leads | v_campaign_leads | GET view |
| Decisao de pausar/escalar criativo | Creative Scoreboard | RPM + CPA + hook_rate |
| Diagnostico CPA alto | Dashboard RPC | Cruzar CTR, CPM, connect_rate, page_conversion |

## Diferenca Supabase vs Gerenciador Meta

| Dado | Supabase | Gerenciador Meta |
|------|----------|-----------------|
| Vendas | Hotmart (webhook) — FONTE DE VERDADE | Pixel/CAPI — delay 24-48h, atribuicao diferente |
| Leads | Hotmart (webhook) | Pixel — pode divergir 10-15% |
| Spend | Meta API (sync a cada 15min) | Tempo real |
| CPA | Calculado: spend / vendas_hotmart | Calculado: spend / purchases_pixel |
| Criativos | Agregado por nome base (ignora conjunto) | Por anuncio individual |

**REGRA:** Para decisoes de escala/pausa, SEMPRE priorizar CPA do Supabase (vendas reais) sobre CPA do gerenciador (eventos de pixel).

## Sync Automatico

Os dados do Meta Ads sao sincronizados a cada 15 minutos pela Edge Function `sync-meta-ads`. Os dados de vendas/leads chegam em tempo real via webhook do Hotmart.
