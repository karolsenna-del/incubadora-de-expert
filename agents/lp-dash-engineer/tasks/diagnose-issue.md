---
task: "Diagnose Issue"
responsavel: "@lp-dash-engineer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Problema reportado pelo usuario"
Saida: "Diagnostico + solucao aplicada ou proposta"
Checklist:
  - "Sintomas coletados"
  - "Categoria identificada"
  - "Causa raiz encontrada"
  - "Solucao aplicada ou proposta"
  - "Verificado que funciona"
execution_type: "semantic"
---

# Task: Diagnose Issue — Troubleshooting do Dashboard

## Objetivo

Investigar e resolver qualquer problema com o dashboard, conexoes, dados ou integracao Meta.

## Trigger

`*diagnose` ou qualquer relato de problema.

## Protocolo de Diagnostico

### Step 1: Coletar Sintomas

Perguntar:
```
Me descreve o problema:
1. O que voce esperava ver?
2. O que esta aparecendo (ou nao aparecendo)?
3. Desde quando comecou?
```

### Step 2: Categorizar

| Categoria | Sintomas tipicos |
|-----------|-----------------|
| **Dashboard nao carrega** | Tela branca, erro 404, loading infinito |
| **Dados zerados** | KPIs todos em zero, tabela vazia |
| **Dados errados** | Numeros nao batem, metricas inconsistentes |
| **Meta nao sincroniza** | Gasto manual OK mas Meta nao aparece |
| **Erro visual** | Layout quebrado, botoes nao funcionam |
| **Conexao** | "Supabase nao configurado", timeout |
| **Deploy** | Vercel nao atualiza, URL nao funciona |

### Step 3: Investigar por Categoria

**DASHBOARD NAO CARREGA:**

1. Verificar URL:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" "<URL_VERCEL>"
   ```
   - 200: site existe, problema e no JS
   - 404: URL errada ou deploy falhou
   - 500+: erro no Vercel

2. Abrir via Playwright e checar console:
   ```
   browser_navigate → URL
   browser_console_messages level="error"
   browser_snapshot
   ```

3. Erros comuns:
   - "CONFIG is not defined" → config.js nao existe ou path errado
   - "supabase is not defined" → CDN nao carregou
   - "Failed to fetch" → CORS ou Supabase fora do ar

**DADOS ZERADOS:**

1. Verificar config.js:
   ```bash
   cat <DESTINO>/js/config.js
   ```
   - campaignRef correto?
   - supabaseUrl e supabaseAnonKey preenchidos?

2. Testar RPC direto:
   ```bash
   curl -s "<SUPABASE_URL>/rest/v1/rpc/get_launch_dashboard" \
     -H "apikey: <ANON_KEY>" \
     -H "Authorization: Bearer <ANON_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"p_campaign_ref": "<CAMPAIGN_REF>"}'
   ```
   - Se retorna dados: problema no frontend
   - Se retorna vazio: banco sem dados OU campaignRef errado

3. Verificar se campanha existe:
   ```bash
   curl -s "<SUPABASE_URL>/rest/v1/campanhas?select=*&evento_referencia=eq.<REF>" \
     -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
   ```

**META NAO SINCRONIZA:**

1. Verificar se Edge Function existe:
   ```bash
   npx supabase functions list
   ```

2. Chamar manualmente:
   ```bash
   curl -s "https://<PROJECT_REF>.supabase.co/functions/v1/meta-ads-sync" \
     -H "Authorization: Bearer <ANON_KEY>"
   ```

3. Se erro de token:
   ```bash
   curl -s "https://graph.facebook.com/v21.0/me?access_token=<TOKEN>"
   ```
   - Se "OAuthException": token expirou → renovar com *meta

4. Verificar logs:
   ```
   Abra: supabase.com/dashboard > seu projeto > Edge Functions > meta-ads-sync > Logs
   ```

5. Verificar cron:
   ```bash
   npx supabase db execute --command "SELECT * FROM cron.job WHERE jobname = 'meta-ads-sync-15min';"
   ```

**CONEXAO SUPABASE:**

1. Testar REST:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" "<SUPABASE_URL>/rest/v1/" -H "apikey: <ANON_KEY>"
   ```
   - 200: OK
   - 401: key errada
   - Timeout: projeto pausado

2. Se projeto pausado: "Seu projeto Supabase pode estar pausado (plano free pausa apos 7 dias de inatividade). Acesse supabase.com/dashboard e reative."

**DEPLOY VERCEL:**

1. Verificar status:
   ```bash
   npx vercel ls
   ```

2. Re-deployar:
   ```bash
   cd <DESTINO> && npx vercel --prod --yes
   ```

3. Verificar nova URL funciona.

### Step 4: Aplicar Solucao

Corrigir o que foi identificado. Se precisa de acao do usuario, guiar passo a passo.

### Step 5: Verificar

Abrir dashboard via Playwright e confirmar que funciona:
```
browser_navigate → URL
browser_console_messages level="error" (deve ser vazio)
browser_snapshot (deve mostrar KPIs)
browser_close
```

### Step 6: Documentar

Se o problema era novo, adicionar ao troubleshooting da KB.

## Error Handling

| Cenario | Acao |
|---------|------|
| Nao consegue reproduzir | Pedir screenshot ou mais detalhes |
| Problema fora do escopo | "Isso nao e do dashboard. Pra {X}, use {agente}." |
| Nao sabe a causa | Pesquisar via WebSearch + analisar logs |
