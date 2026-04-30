# LP Dash Engineer — Playbook

> SOPs e procedures. Cresce a cada missao documentada.
> Consultar ANTES de iniciar qualquer missao. Se ja tem SOP, seguir.

---

## Indice de SOPs

1. [SOP-001] Setup Completo — Dashboard do Zero ate Online
2. [SOP-002] Integracao Meta Ads — Sync Automatico de Metricas
3. [SOP-003] Renovacao de Token Meta

---

### [SOP-001] Setup Completo — Dashboard do Zero ate Online
**Criado em:** 2026-03-24
**Ultima execucao:** —
**Trigger:** `/lpDashEngineer` ou "instala meu dashboard"
**Tempo estimado:** 5-10 min
**Ferramentas:** Vercel CLI, Playwright, Bash

**Pre-requisitos:**
- Database Engineer ja executado (banco operacional)
- Credenciais Supabase disponiveis (vault ou coletar)

**Passos:**
1. Verificar ambiente (Node.js 18+)
2. Verificar credenciais no vault do Database Engineer
3. Verificar campanha existente no banco
4. Copiar template do dashboard pro projeto do aluno
5. Gerar config.js customizado (URL, key, campaignRef, preco)
6. Testar localmente via Playwright (console errors + KPIs)
7. Deploy no Vercel (`npx vercel --prod --yes`)
8. Verificar URL deployada via Playwright
9. Salvar URL no vault
10. Entregar URL ao usuario

**Output esperado:** Dashboard online com URL publica, dados carregando.

**Troubleshooting:**
- Template nao encontrado: buscar em `packages/launch-command-center/`
- Console errors: verificar config.js e paths dos scripts
- Vercel nao loga: `npx vercel login` no browser
- Dados zerados: verificar campaignRef e testar RPC direto

---

### [SOP-002] Integracao Meta Ads — Sync Automatico de Metricas
**Criado em:** 2026-03-24
**Ultima execucao:** —
**Trigger:** `*meta` ou "conecta com Meta Ads"
**Tempo estimado:** 15-25 min (depende do usuario nos passos manuais)
**Ferramentas:** Supabase CLI, curl, Bash

**Pre-requisitos:**
- Dashboard ja instalado (SOP-001 completo)
- Usuario com conta Meta Business Suite
- Usuario com acesso admin a conta de anuncios

**Passos:**
1. Guiar criacao do Meta App (usuario faz manualmente)
2. Coletar App ID e App Secret
3. Guiar obtencao de access token (Graph API Explorer)
4. Trocar token curto por long-lived (~60 dias)
5. Listar ad accounts e campanhas via Graph API
6. Confirmar quais campanhas monitorar
7. Criar Edge Function `meta-ads-sync`
8. Deploy: `npx supabase functions deploy meta-ads-sync --no-verify-jwt`
9. Configurar secrets (META_ACCESS_TOKEN, META_CAMPAIGN_IDS)
10. Configurar cron (pg_cron, externo ou manual)
11. Testar sync end-to-end
12. Verificar dados no dashboard

**Output esperado:** Metricas do Meta sincronizando automaticamente no dashboard.

---

### [SOP-003] Renovacao de Token Meta
**Criado em:** 2026-03-24
**Ultima execucao:** —
**Trigger:** Token expirado (~60 dias) ou erro "OAuthException"
**Tempo estimado:** 5 min

**Passos:**
1. Usuario gera novo token curto no Graph API Explorer
2. Trocar por long-lived via curl
3. Atualizar secret: `npx supabase secrets set META_ACCESS_TOKEN='<NOVO_TOKEN>'`
4. Testar sync
5. Atualizar vault com novo token e data de expiracao
