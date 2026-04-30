---
task: "Integrate Meta Ads"
responsavel: "@lp-dash-engineer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Usuario quer integrar Meta Ads ao dashboard"
Saida: "Meta Ads sincronizando automaticamente com dashboard"
Checklist:
  - "Meta App criado pelo usuario"
  - "Access token obtido"
  - "Token trocado por long-lived"
  - "Ad account e campaign identificados"
  - "Edge Function criada e deployada"
  - "Cron configurado"
  - "Teste end-to-end OK"
  - "Vault atualizado"
execution_type: "interactive"
---

# Task: Integrate Meta Ads — Sync Automatico de Metricas

## Objetivo

Conectar o dashboard do aluno com a Meta Ads API pra que metricas de anuncios (gasto, impressoes, cliques, alcance, LPVs) sincronizem automaticamente a cada 15 minutos — sem o aluno precisar inserir dados manualmente.

## Trigger

`*meta` ou "conecta com Meta Ads" ou "quero metricas automaticas"

## Pre-requisitos

- Dashboard ja instalado e funcionando (execute-mission completo)
- Supabase CLI linkado (do Database Engineer)
- Aluno tem conta no Meta Business Suite com campanhas ativas
- Aluno tem acesso de administrador a conta de anuncios

## Integracao — 7 Fases

### FASE 1: CRIAR META APP

O usuario PRECISA fazer isso manualmente. O agente guia passo a passo.

```
Vou te guiar pra conectar o Meta Ads ao seu dashboard.
Primeiro, precisamos criar um App no Meta pra ter acesso a API de metricas.

Siga esses passos (demora uns 3 minutos):

1. Acesse: developers.facebook.com
2. Clique no seu perfil (canto superior direito) e depois "Meus Apps"
3. Clique no botao "Criar App" (azul)
4. Em tipo de app, selecione "Outro" (ou "Business" se aparecer)
5. Em nome: coloque "Dashboard [nome do seu negocio]"
   Exemplo: "Dashboard Arka"
6. Email de contato: coloque o seu email
7. Clique em "Criar App"
8. Pode pedir pra resolver um captcha — resolve e continua
9. Na tela de produtos, procure "Marketing API" e clique em "Configurar"

Me avisa quando tiver criado o app.
```

Esperar o usuario confirmar.

**Verificacao:** Pedir o App ID:
```
Perfeito. Agora preciso do App ID e do App Secret:
1. App ID: aparece no topo da pagina do app (numero grande)
2. App Secret: va em Configuracoes > Basico > Chave Secreta do App (clique em "Mostrar")

Me manda os dois.
```

Salvar App ID e App Secret no vault IMEDIATAMENTE.

**CHECKPOINT FASE 1:** Meta App criado. App ID e App Secret salvos.

---

### FASE 2: OBTER ACCESS TOKEN

```
Agora vamos pegar o token de acesso pra API.

1. No seu app Meta, va em: Ferramentas > Graph API Explorer
   (ou acesse direto: developers.facebook.com/tools/explorer)
2. No campo "Meta App" (dropdown no topo): selecione o app que acabou de criar
3. Clique em "Generate Access Token" (botao azul)
4. Vai pedir pra autorizar — clique em "Continuar como [seu nome]"
5. Nas permissoes, marque:
   - ads_read
   - read_insights
   IMPORTANTE: essas duas permissoes sao OBRIGATORIAS. Se nao aparecem pra marcar,
   va em App Review > Permissions and Features e solicite ads_read e read_insights.
6. Copie o token que apareceu no campo "Access Token"
   (comeca com "EAA..." e e bem longo)

Me manda o token.
```

Validar: token comeca com "EAA" e tem pelo menos 100 caracteres.

**CHECKPOINT FASE 2:** Token curto obtido.

---

### FASE 3: TROCAR POR TOKEN DE LONGA DURACAO

Token curto expira em ~1-2 horas. Trocar por long-lived (~60 dias):

```bash
curl -s "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=<APP_ID>&client_secret=<APP_SECRET>&fb_exchange_token=<SHORT_TOKEN>" | python3 -m json.tool
```

Resposta esperada:
```json
{
  "access_token": "EAA...(token longo)...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

Se `expires_in` = 5184000 (~60 dias): token longo OK.

Se erro:
- "Invalid OAuth access token" → token curto ja expirou, pedir novo
- "Error validating application" → App ID ou Secret errado

Salvar token longo no vault IMEDIATAMENTE.

Dizer:
```
Token de longa duracao gerado (valido por ~60 dias).
Quando expirar, e so rodar *meta novamente pra renovar.
```

**CHECKPOINT FASE 3:** Token long-lived salvo no vault.

---

### FASE 4: IDENTIFICAR AD ACCOUNT E CAMPAIGN

**4.1 Listar ad accounts**

```bash
curl -s "https://graph.facebook.com/v21.0/me/adaccounts?access_token=<LONG_TOKEN>&fields=name,account_id,account_status" | python3 -m json.tool
```

Se retorna mais de 1 conta:
```
Encontrei essas contas de anuncios:
1. [nome] (ID: act_xxxxx)
2. [nome] (ID: act_xxxxx)

Qual e a conta que voce usa pra esse lancamento?
```

Se retorna 1: usar automaticamente.

**4.2 Listar campanhas da conta**

```bash
curl -s "https://graph.facebook.com/v21.0/<AD_ACCOUNT_ID>/campaigns?access_token=<LONG_TOKEN>&fields=name,status,objective&limit=20" | python3 -m json.tool
```

Filtrar campanhas ACTIVE:
```
Campanhas ativas na sua conta:
1. [nome] (ID: xxxxx) — Objetivo: CONVERSIONS
2. [nome] (ID: xxxxx) — Objetivo: TRAFFIC

Qual campanha voce quer monitorar no dashboard?
(pode ser mais de uma — me diz os numeros)
```

Salvar ad_account_id e campaign_ids no vault.

**4.3 Vincular campanhas Meta ao banco**

Pra cada campanha Meta selecionada, atualizar a tabela `campanhas` no banco com o `meta_campaign_id`:

```bash
curl -X PATCH "<SUPABASE_URL>/rest/v1/campanhas?evento_referencia=eq.<CAMPAIGN_REF>" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"meta_campaign_id": "<META_CAMPAIGN_ID>"}'
```

Se o aluno tem MULTIPLAS campanhas Meta pra uma mesma campanha no banco, vincular a principal.
Se tem campanhas Meta pra campanhas DIFERENTES no banco, repetir pra cada uma.

Verificar:
```bash
curl -s "<SUPABASE_URL>/rest/v1/campanhas?select=id,nome,evento_referencia,meta_campaign_id&meta_campaign_id=not.is.null" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>"
```

Se retorna os IDs corretos: vinculo OK.
Se nao: o `meta_campaign_id` nao foi salvo — verificar permissao de UPDATE.

**CHECKPOINT FASE 4:** Ad account e campaigns identificados, salvos no vault E vinculados no banco.

---

### FASE 5: CRIAR EDGE FUNCTION DE SYNC

**5.1 Verificar ambiente Supabase CLI**

Verificar se pasta supabase/ ja existe (Database Engineer geralmente ja criou):

```bash
ls supabase/config.toml 2>/dev/null
```

Se nao existe:
```bash
npx supabase init
```

Verificar se o projeto esta linkado:

```bash
npx supabase status 2>/dev/null
```

Se nao esta linkado (retorna erro ou "not linked"):
```
Preciso linkar o Supabase CLI ao seu projeto.
Me passa o Project Ref do Supabase (aquele ID que aparece na URL do dashboard, tipo "abcdefghijklmnop").
```

Depois:
```bash
npx supabase link --project-ref <PROJECT_REF>
```

Vai pedir a senha do banco — o usuario precisa fornecer.

**5.2 Criar a funcao**

```bash
npx supabase functions new meta-ads-sync
```

**5.3 Escrever o codigo**

Escrever em `supabase/functions/meta-ads-sync/index.ts`:

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const META_TOKEN = Deno.env.get('META_ACCESS_TOKEN')
    const META_CAMPAIGN_IDS = Deno.env.get('META_CAMPAIGN_IDS') // comma-separated
    const CAMPAIGN_REF = Deno.env.get('CAMPAIGN_REF')

    if (!META_TOKEN || !META_CAMPAIGN_IDS) {
      return new Response(
        JSON.stringify({ error: 'META_ACCESS_TOKEN ou META_CAMPAIGN_IDS nao configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const metaCampaignIds = META_CAMPAIGN_IDS.split(',').map(id => id.trim())
    const results: any[] = []

    // Buscar UUID das campanhas no banco (campaign_id e uuid FK, nao string Meta)
    const campaignUuidMap: Record<string, string> = {}
    for (const metaId of metaCampaignIds) {
      const { data: campRow } = await supabase
        .from('campanhas')
        .select('id')
        .eq('meta_campaign_id', metaId)
        .single()

      if (campRow) {
        campaignUuidMap[metaId] = campRow.id
      } else {
        console.warn(`Campanha Meta ${metaId} nao encontrada no banco. Pulando.`)
        results.push({ meta_campaign_id: metaId, error: 'Campanha nao encontrada no banco' })
      }
    }

    // CAMPAIGN-LEVEL: insights dos ultimos 7 dias, por dia
    for (const metaId of Object.keys(campaignUuidMap)) {
      const dbCampaignId = campaignUuidMap[metaId]

      const url = `https://graph.facebook.com/v21.0/${metaId}/insights?` +
        `access_token=${META_TOKEN}&` +
        `fields=spend,impressions,clicks,reach,actions,cost_per_action_type,` +
        `inline_link_clicks,frequency&` +
        `time_range={"since":"${getDateDaysAgo(7)}","until":"${getToday()}"}&` +
        `time_increment=1&` +
        `level=campaign`

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        console.error(`Erro na campanha ${metaId}:`, data.error.message)
        results.push({ meta_campaign_id: metaId, error: data.error.message })
        continue
      }

      if (!data.data || data.data.length === 0) {
        results.push({ meta_campaign_id: metaId, rows: 0 })
        continue
      }

      for (const row of data.data) {
        const linkClicks = parseInt(row.inline_link_clicks || '0')
        const lpv = extractAction(row.actions, 'landing_page_view')

        const { error } = await supabase
          .from('ad_metrics')
          .upsert({
            date: row.date_start,
            campaign_id: dbCampaignId,
            spend: parseFloat(row.spend || '0'),
            impressions: parseInt(row.impressions || '0'),
            clicks: parseInt(row.clicks || '0'),
            reach: parseInt(row.reach || '0'),
            link_clicks: linkClicks,
            landing_page_views: lpv,
            frequency: parseFloat(row.frequency || '0'),
            source: 'meta_api',
          }, { onConflict: 'date,campaign_id' })

        if (error) {
          console.error(`Erro upsert ${row.date_start}:`, error.message)
        }
      }

      results.push({ meta_campaign_id: metaId, rows: data.data.length })
    }

    // AD-LEVEL: insights por criativo → tabela ad_creative_metrics (separada)
    for (const metaId of Object.keys(campaignUuidMap)) {
      const dbCampaignId = campaignUuidMap[metaId]

      const adUrl = `https://graph.facebook.com/v21.0/${metaId}/insights?` +
        `access_token=${META_TOKEN}&` +
        `fields=ad_id,ad_name,spend,impressions,clicks,reach,actions,` +
        `inline_link_clicks&` +
        `time_range={"since":"${getDateDaysAgo(7)}","until":"${getToday()}"}&` +
        `level=ad&limit=100`

      const response = await fetch(adUrl)
      const data = await response.json()

      if (data.data) {
        for (const ad of data.data) {
          const { error } = await supabase
            .from('ad_creative_metrics')
            .upsert({
              date: ad.date_start || getToday(),
              campaign_id: dbCampaignId,
              ad_id: ad.ad_id,
              ad_name: ad.ad_name,
              spend: parseFloat(ad.spend || '0'),
              impressions: parseInt(ad.impressions || '0'),
              clicks: parseInt(ad.clicks || '0'),
              reach: parseInt(ad.reach || '0'),
              link_clicks: parseInt(ad.inline_link_clicks || '0'),
              landing_page_views: extractAction(ad.actions, 'landing_page_view'),
              source: 'meta_api',
            }, { onConflict: 'date,ad_id' })

          if (error) console.error(`Erro upsert ad ${ad.ad_name}:`, error.message)
        }
      }
    }

    console.log('Meta Ads sync completo:', JSON.stringify(results))

    return new Response(
      JSON.stringify({ success: true, synced_at: new Date().toISOString(), results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({ error: 'Sync failed', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getDateDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function extractAction(actions: any[], type: string): number {
  if (!actions) return 0
  const action = actions.find((a: any) => a.action_type === type)
  return action ? parseInt(action.value) : 0
}
```

**NOTA:** Esse codigo pode precisar de ajustes dependendo da versao da API do Meta e dos campos disponiveis. Se der erro em algum campo, remover e seguir com os disponiveis.

**5.4 Deploy**

```bash
npx supabase functions deploy meta-ads-sync --no-verify-jwt
```

Dizer: "Edge Function deployada."

**5.5 Configurar secrets**

```bash
npx supabase secrets set META_ACCESS_TOKEN='<LONG_TOKEN>'
npx supabase secrets set META_CAMPAIGN_IDS='<ID1>,<ID2>'
npx supabase secrets set CAMPAIGN_REF='<CAMPAIGN_REF>'
```

**SALVAR TUDO NO VAULT IMEDIATAMENTE.**

**CHECKPOINT FASE 5:** Edge Function deployada + secrets configurados.

---

### FASE 6: CONFIGURAR SYNC AUTOMATICO (CRON)

Opcao A — pg_cron (via Supabase):

Verificar se pg_cron e pg_net estao disponiveis (pg_net e necessario pra chamar HTTP):
```bash
npx supabase db execute --command "SELECT extname FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net');"
```

Se AMBOS disponiveis (2 linhas retornadas):
```bash
npx supabase db execute --command "
  SELECT cron.schedule(
    'meta-ads-sync-15min',
    '*/15 * * * *',
    \$\$
    SELECT net.http_get(
      url := 'https://<PROJECT_REF>.supabase.co/functions/v1/meta-ads-sync',
      headers := '{\"Authorization\": \"Bearer <ANON_KEY>\"}'::jsonb
    );
    \$\$
  );
"
```

Se NAO disponivel (plano free nao tem pg_cron):
```
O plano gratuito do Supabase nao tem cron automatico.
Opcoes:
1. Fazer upgrade pro plano Pro (~$25/mes) pra ter cron nativo
2. Rodar o sync manualmente quando quiser (te dou o comando)
3. Usar um cron externo gratuito (ex: cron-job.org)

Qual voce prefere?
```

Se opcao 2 (manual):
```
Pra sincronizar manualmente, rode esse comando no terminal:
curl -s "https://<PROJECT_REF>.supabase.co/functions/v1/meta-ads-sync" -H "Authorization: Bearer <ANON_KEY>"

Ou abra essa URL no browser que ele sincroniza na hora.
```

Se opcao 3 (cron externo):
```
Cria uma conta em cron-job.org (gratuito) e configure:
- URL: https://<PROJECT_REF>.supabase.co/functions/v1/meta-ads-sync
- Frequencia: a cada 15 minutos
- Metodo: GET
- Header: Authorization: Bearer <ANON_KEY>
```

**CHECKPOINT FASE 6:** Sync automatico configurado (ou manual documentado).

---

### FASE 7: TESTAR INTEGRACAO END-TO-END

**7.1 Chamar sync manualmente**

```bash
curl -s "https://<PROJECT_REF>.supabase.co/functions/v1/meta-ads-sync" \
  -H "Authorization: Bearer <ANON_KEY>" | python3 -m json.tool
```

Verificar resposta:
- `success: true` → OK
- `results` com contagem de linhas por campanha → dados chegaram
- Se erro: verificar logs da Edge Function

**7.2 Verificar dados no banco**

```bash
npx supabase db execute --command "SELECT date, campaign_id, spend, impressions, clicks, source FROM ad_metrics WHERE source = 'meta_api' ORDER BY date DESC LIMIT 5;"
```

Se retorna dados: "Meta Ads sincronizou! Dados de metricas no banco."

**7.3 Verificar no dashboard**

Abrir o dashboard via Playwright:
1. `browser_navigate` para a URL do Vercel
2. Esperar 5 segundos
3. Clicar na aba "Criativos" se existir
4. `browser_snapshot` — verificar se metricas do Meta aparecem
5. `browser_close`

Se tudo OK:
```
Integracao Meta Ads funcionando!
Suas metricas de anuncios vao sincronizar automaticamente a cada 15 minutos.

No dashboard voce ve:
- Gasto real (nao precisa mais inserir manualmente)
- Impressoes, cliques, alcance
- Performance por criativo na aba "Criativos"
- ROI calculado com gasto real

IMPORTANTE: O token do Meta expira em ~60 dias.
Quando expirar, rode *meta novamente pra renovar.
Vou te avisar quando estiver perto de expirar.
```

**CHECKPOINT FASE 7:** Sync rodando + dados no banco + dashboard mostrando metricas reais.

---

## Relatorio Final

```
=== LP DASH ENGINEER — META ADS INTEGRADO ===

Status: OPERACIONAL

Meta Ads:
  App: Dashboard [nome] (ID: <APP_ID>)
  Ad Account: <AD_ACCOUNT_ID>
  Campanhas monitoradas: <CAMPAIGN_IDS>
  Token: long-lived (expira em ~60 dias: <DATA_EXPIRACAO>)
  Sync: a cada 15 minutos via <METODO>
  Edge Function: meta-ads-sync

Dados sincronizados:
  Periodo: ultimos 7 dias
  Metricas: spend, impressions, clicks, reach, link_clicks, LPVs
  Criativos: performance por ad (gasto, CPA, RPM, Hook%, CTR)
  Source: meta_api

Dashboard URL: <URL_VERCEL>

Proximos passos:
  1. Acompanhar metricas no dashboard diariamente
  2. Token expira em ~60 dias — renovar com *meta
  3. Se adicionar nova campanha: rodar *meta pra incluir
```

## Error Handling

| Cenario | Acao |
|---------|------|
| Token curto expirou | Pedir novo token (Graph API Explorer) |
| Token longo expirou (~60 dias) | Repetir fases 2-3 |
| "Invalid OAuth" | App ID/Secret errado ou token invalido |
| "Unsupported request" | Versao da API mudou — pesquisar nova versao |
| "User does not have permission" | Aluno nao e admin da conta de anuncios |
| Sem campanhas ativas | Verificar se tem campanhas rodando no Meta |
| pg_cron nao disponivel | Oferecer alternativas (manual ou cron externo) |
| Edge Function timeout | Reduzir periodo de sync (3 dias em vez de 7) |
| Campos da API diferentes | Adaptar codigo pra campos disponiveis |
| Dashboard nao mostra metricas Meta | Verificar source='meta_api' nos dados, checar RPC |
