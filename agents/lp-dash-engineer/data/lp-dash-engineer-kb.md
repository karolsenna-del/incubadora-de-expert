# LP Dash Engineer — Foundation KB

> Conhecimento base sobre o dashboard, Vercel, Meta Ads API e troubleshooting.
> Consultar ANTES de iniciar qualquer missao.

---

## 1. Arquitetura do Dashboard

### Stack
- **Frontend:** HTML/JS vanilla + Tailwind CSS (CDN) + Lucide Icons
- **Supabase:** JS UMD client (via CDN, nao npm)
- **Deploy:** Vercel (static site)
- **Config:** `js/config.js` — unico arquivo que muda por aluno

### Arquivos (9 total)
| Arquivo | Funcao |
|---------|--------|
| `index.html` | Pagina principal (header, tabs, panels, footer) |
| `css/styles.css` | Estilos customizados (dark mode, animacoes, responsive) |
| `js/config.js` | Credenciais e configuracao (CUSTOMIZAVEL) |
| `js/supabase-client.js` | Inicializa cliente Supabase |
| `js/app.js` | Entry point, init tabs/forms, auto-refresh 5min |
| `js/metrics.js` | Chamadas RPC e queries ao Supabase |
| `js/ui.js` | Renderizacao de KPIs, tabelas, forms, acoes |
| `js/criativos.js` | Scoreboard de performance por criativo/ad |
| `js/testing.js` | Price Lab + Page Lab (testes de preco e pagina) |

### Fluxo de Inicializacao
1. HTML carrega scripts na ordem: config → supabase-client → metrics → ui → criativos → testing → app
2. `DOMContentLoaded` → `init()` em app.js
3. Aguarda Supabase CDN (ate 20 retries, 250ms cada)
4. Inicializa client com credenciais de config.js
5. Carrega dados via RPC `get_launch_dashboard`
6. Renderiza KPIs e tabelas
7. Inicia auto-refresh (5 min)

### Config.js — Campos
```javascript
const CONFIG = {
  supabaseUrl: '',           // URL do projeto Supabase
  supabaseAnonKey: '',       // Chave anon JWT
  campaignRef: '',           // Referencia unica da campanha
  campaignName: '',          // Nome visivel no header
  launchSlug: '',            // Slug do launch (opcional)
  defaultConversionValue: 0, // Preco do produto em R$
  refreshInterval: 300000    // 5 min em ms
};
```

---

## 2. Abas do Dashboard

### Campaign (principal)
- 4 KPI cards: Receita, Gasto, ROI, Vendas
- Tabela 16 metricas: total / ontem / hoje
- Form manual de gasto (colapsavel)

### Recovery (Bia Sales)
- 4 KPI cards vendas Bia
- 4 KPI cards tracking
- Lista de leads com botoes: WhatsApp, Email, Recuperado

### Criativos (Scoreboard)
- Tabela por criativo: Vendas, Gasto, CPA, RPM, Hook%, CTR, Connect%, Conv%, LPV, CPC
- Badge "TOP" no melhor RPM

### Lab (Testes)
- **Price Lab:** Teste sequencial de precos. Periodo controle vs tratamento. 15 metricas. Confidence levels.
- **Page Lab:** Registro de testes A/B no Meta Experiments. Tracking manual de vencedor.

---

## 3. RPCs do Banco

### get_launch_dashboard(p_campaign_ref, p_launch_slug)
Retorna JSON com:
- `campaign_ref`, `launch_slug`, `updated_at`
- `total` — metricas agregadas de toda campanha
- `yesterday` — metricas de ontem
- `today` — metricas de hoje
- `recovery` — dados de recuperacao (Bia)

### get_creative_scoreboard(p_campaign_ref)
Retorna array de ads com metricas de performance.

### list_launches()
Lista todos os launches com slugs.

---

## 4. Vercel

### Deploy
```bash
cd <pasta-dashboard> && npx vercel --prod --yes
```

### Login
```bash
npx vercel login
```
Abre browser pra autorizar. Se nao abrir: acessar vercel.com/login manualmente.

### Listar deployments
```bash
npx vercel ls
```

### Vercel nao atualiza
Re-deployar com `--prod --force`:
```bash
npx vercel --prod --force --yes
```

---

## 5. Meta Ads API

### Versao atual
v21.0 (verificar se mudou via WebSearch)

### Endpoints usados
| Endpoint | O que retorna |
|----------|--------------|
| `/me/adaccounts` | Lista de ad accounts |
| `/<AD_ACCOUNT>/campaigns` | Campanhas da conta |
| `/<CAMPAIGN_ID>/insights` | Metricas da campanha (por dia ou agregado) |
| `/<CAMPAIGN_ID>/insights?level=ad` | Metricas por criativo |

### Campos de insights (top-level)
`spend, impressions, clicks, reach, actions, inline_link_clicks, frequency, cost_per_action_type`

**NOTA:** `landing_page_view` NAO e campo top-level — e um action type. Extrair de dentro do array `actions` com `action_type = 'landing_page_view'`.

### Tokens
- **Short-lived:** ~1-2 horas. Gerado via Graph API Explorer.
- **Long-lived:** ~60 dias. Trocado via endpoint oauth/access_token.
- **System user token:** Nunca expira. Requer Business Manager configurado (avancado).

### Renovacao de token
```bash
curl "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=<APP_ID>&client_secret=<APP_SECRET>&fb_exchange_token=<SHORT_TOKEN>"
```

### Erros comuns
| Erro | Causa | Solucao |
|------|-------|---------|
| OAuthException | Token expirado | Renovar token |
| (#100) Missing permissions | Permissoes nao concedidas | Re-gerar token com ads_read |
| (#17) API rate limit | Muitas chamadas | Esperar 15 min |
| Unsupported request | Campo nao existe na versao | Verificar docs da versao atual |

---

## 6. Edge Functions

### Deploy
```bash
npx supabase functions deploy <nome> --no-verify-jwt
```
`--no-verify-jwt` obrigatorio pra funcoes chamadas externamente (cron, webhooks).

### Secrets
```bash
npx supabase secrets set CHAVE='valor'
npx supabase secrets list
```

### Logs
Dashboard Supabase > Edge Functions > [nome] > Logs

---

## 7. Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Tela branca | config.js nao carrega | Verificar path e conteudo |
| "Supabase nao configurado" | Credenciais vazias no config | Re-gerar config.js |
| "Failed to fetch" | CORS ou URL errada | Verificar supabaseUrl |
| Dados zerados | campaignRef errado | Verificar evento_referencia no banco |
| Meta nao sincroniza | Token expirado | Renovar com *meta |
| Deploy falha | Vercel nao logado | `npx vercel login` |
| 404 no dashboard | URL errada | `npx vercel ls` pra ver URL correta |
| Projeto Supabase pausado | Inatividade >7 dias (free) | Reativar no dashboard Supabase |
| Edge Function falha | Secret nao configurado | `npx supabase secrets list` |
| Cron nao roda | pg_cron nao disponivel | Usar cron externo ou manual |
