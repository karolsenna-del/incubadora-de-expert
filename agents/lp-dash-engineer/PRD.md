# PRD — LP Dash Engineer

**Versao:** 1.0
**Data:** 2026-03-24
**Autor:** Euriler Jube
**Status:** Draft

---

## 1. Problema

O aluno do Auroq OS ja tem o banco de dados configurado (via Database Engineer), mas nao tem como VISUALIZAR seus dados de lancamento. Precisa de um dashboard em tempo real que mostre receita, vendas, ROI, leads, performance de criativos e recuperacao de vendas — sem saber programar.

Alem disso, precisa integrar com Meta Ads pra puxar metricas automaticamente, e isso exige acoes manuais no Meta Business Suite que so o usuario pode fazer (criar app, pegar token, autorizar).

---

## 2. Solucao

Um worker chamado **LP Dash Engineer** que:
1. Instala e configura o dashboard de lancamento pago no projeto do aluno
2. Deploya no Vercel (aluno recebe URL publica)
3. Guia o aluno na integracao com Meta Ads (passo a passo)
4. Faz manutencao, corrige bugs e diagnostica problemas

---

## 3. Nomenclatura

| Item | Valor |
|------|-------|
| Nome | LP Dash Engineer |
| Slug | `lp-dash-engineer` |
| Path | `agents/lp-dash-engineer/` |
| Ativacao | `/lpDashEngineer` |
| Tipo | Worker |
| Forged by | Worker Forge |

---

## 4. Pre-requisitos

- Auroq OS rodando no Claude Code
- Database Engineer ja executado (banco Supabase operacional com 7 tabelas, 2 views, 2 RPCs)
- Credenciais Supabase disponiveis (no vault do Database Engineer ou coletadas na hora)
- Conta Vercel (ou criar durante o setup)

---

## 5. Dashboard — O que o Aluno Recebe

### 5.1 Aba Campaign (principal)
- 4 KPI cards: Receita total, Gasto total, ROI (multiplicador), Total de vendas
- Tabela de 16 metricas com colunas Total / Ontem / Hoje
- Input manual de gasto diario (pra quem nao tem Meta integrado)
- Auto-refresh a cada 5 minutos

### 5.2 Aba Recovery (Bia Sales)
- 4 KPI cards de vendas da Bia (assistente de recuperacao)
- 4 KPI cards de tracking de follow-up
- Lista de leads com botoes de acao: WhatsApp, Email, Marcar como recuperado
- Status tracking por lead (nao contatado → contatado → recuperado)

### 5.3 Aba Criativos (Scoreboard de Ads)
- Tabela de performance por criativo/anuncio
- Metricas: Vendas, Gasto, CPA, RPM, Hook%, CTR, Connect%, Conv%, LPV, CPC
- Badge "TOP" no criativo com melhor RPM
- Destaque verde/vermelho por metrica

### 5.4 Aba Lab (Testes)
- **Price Lab:** Teste sequencial de precos com periodo controle vs tratamento, 15 metricas calculadas automaticamente, niveis de confianca, metrica decisora RPM
- **Page Lab:** Registro de testes A/B de pagina rodando no Meta Ads Experiments, tracking de vencedor

---

## 6. Modos de Operacao

### 6.1 Modo Setup (missao principal)

**Trigger:** `/lpDashEngineer` ou "instala meu dashboard"

**Fases:**

#### Fase 0: Verificacao de Pre-requisitos
- Verificar se Database Engineer ja rodou (banco existe, tabelas existem)
- Verificar se tem credenciais no vault
- Se banco nao existe: instruir a rodar `/databaseEngineer` primeiro
- Verificar Node.js e npm

#### Fase 1: Copiar Arquivos do Dashboard
- Copiar o template do dashboard pro projeto do aluno
- Arquivos: index.html, css/styles.css, js/*.js (7 arquivos)
- Criar estrutura de pastas se nao existir

#### Fase 2: Configurar Credenciais
- Pegar credenciais do vault do Database Engineer (SUPABASE_URL, ANON_KEY)
- Pegar campaign_ref e launch_slug do banco (query nas tabelas campanhas e launches)
- Pegar preco do produto (defaultConversionValue) — perguntar ao usuario
- Gerar `config.js` customizado:

```javascript
const CONFIG = {
  supabaseUrl: '[URL_DO_ALUNO]',
  supabaseAnonKey: '[KEY_DO_ALUNO]',
  campaignRef: '[REF_DA_CAMPANHA]',
  campaignName: '[NOME_DA_CAMPANHA]',
  launchSlug: '[SLUG_DO_LAUNCH]',
  defaultConversionValue: [PRECO],
  refreshInterval: 300000
};
```

#### Fase 3: Testar Localmente
- Abrir o dashboard via Playwright (file:// ou http-server)
- Verificar se carrega sem erros no console
- Verificar se KPIs aparecem (mesmo que zerados)
- Se erro: diagnosticar e corrigir antes de deployar

#### Fase 4: Deploy no Vercel
- Verificar se Vercel CLI existe: `npx vercel --version`
- Se nao: `npm install -g vercel`
- Login: `npx vercel login` (guiar o usuario se precisar de autorizacao)
- Deploy: `npx vercel --prod`
- Capturar URL de producao
- Entregar URL ao usuario: "Seu dashboard ta no ar: https://xxx.vercel.app"

**Checkpoint:** Dashboard online, carregando dados do Supabase, KPIs visiveis.

---

### 6.2 Modo Integracao Meta Ads

**Trigger:** "conecta com Meta Ads" ou "quero metricas automaticas"

**Contexto:** O dashboard ja tem a infraestrutura pra receber dados do Meta (tabela ad_metrics com campo source='meta_api', creative scoreboard via RPC). O que falta e o "encanamento" — um sync automatico que puxa dados do Meta e alimenta o banco.

#### Fase 1: Guiar Criacao do Meta App

O usuario precisa fazer isso no Meta Business Suite (o agente NAO pode fazer por ele):

```
Vou te guiar passo a passo pra conectar o Meta Ads ao seu dashboard.
Primeiro, precisamos criar um App no Meta pra ter acesso a API.

1. Acesse: developers.facebook.com
2. Clique em "Meus Apps" (canto superior direito)
3. Clique em "Criar App"
4. Selecione "Business" como tipo
5. Nome do app: "Dashboard [nome do seu negocio]"
6. Email de contato: seu email
7. Clique em "Criar App"
8. Na tela de produtos, clique em "Configurar" no "Marketing API"

Me avisa quando tiver criado.
```

#### Fase 2: Obter Access Token

```
Agora vamos pegar o token de acesso:

1. No seu App, va em: Ferramentas > Graph API Explorer
2. Em "Meta App": selecione o app que acabou de criar
3. Em "Permissions": adicione:
   - ads_read
   - ads_management
   - read_insights
4. Clique em "Generate Access Token"
5. Autorize quando pedir
6. Copie o token que apareceu (comeca com "EAA...")

IMPORTANTE: Esse token expira em 1-2 horas. Vamos trocar por um de longa duracao.
Me manda o token que apareceu.
```

#### Fase 3: Trocar por Token de Longa Duracao

Com o token curto, o agente executa:

```bash
curl -s "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=<APP_ID>&client_secret=<APP_SECRET>&fb_exchange_token=<SHORT_TOKEN>"
```

Salvar token longo no vault + como secret do Supabase:

```bash
npx supabase secrets set META_ACCESS_TOKEN='<LONG_TOKEN>'
npx supabase secrets set META_APP_ID='<APP_ID>'
```

#### Fase 4: Identificar Ad Account e Campaign

```bash
curl -s "https://graph.facebook.com/v19.0/me/adaccounts?access_token=<TOKEN>&fields=name,account_id"
```

- Listar ad accounts
- Perguntar qual usar
- Listar campanhas da ad account selecionada
- Confirmar qual campanha monitorar
- Salvar ad_account_id e campaign_id

#### Fase 5: Criar Edge Function de Sync

Criar `supabase/functions/meta-ads-sync/index.ts`:
- Puxa metricas diarias da Meta Insights API (spend, impressions, clicks, reach, link_clicks, landing_page_views, frequency)
- Puxa metricas por criativo (ad-level insights)
- Upsert na tabela ad_metrics
- Roda como cron (a cada 15 min ou sob demanda)

Deploy:
```bash
npx supabase functions deploy meta-ads-sync --no-verify-jwt
```

#### Fase 6: Configurar Cron (Sync Automatico)

Opcao A — Supabase Cron (pg_cron):
```sql
SELECT cron.schedule('meta-ads-sync', '*/15 * * * *', $$
  SELECT net.http_get('https://<PROJECT_REF>.supabase.co/functions/v1/meta-ads-sync');
$$);
```

Opcao B — GitHub Actions (cron externo):
- Workflow que chama a Edge Function a cada 15 min

#### Fase 7: Testar Integracao

- Chamar a Edge Function manualmente
- Verificar se dados apareceram em ad_metrics (source='meta_api')
- Verificar se aba Criativos do dashboard mostra dados
- Confirmar com usuario

**Checkpoint:** Meta Ads sincronizando a cada 15 min, dashboard mostrando metricas reais.

---

### 6.3 Modo Manutencao

**Trigger:** "atualiza meu dashboard", "adiciona X", "muda o preco"

O que o agente pode fazer:
- Atualizar config.js (trocar campanha, preco, slug)
- Atualizar arquivos do dashboard (se tiver versao nova)
- Re-deployar no Vercel
- Renovar token do Meta (tokens longos expiram em ~60 dias)
- Trocar de campanha monitorada
- Criar novo launch (novo ciclo de lancamento)
- Limpar dados de teste

---

### 6.4 Modo Diagnostico

**Trigger:** "dashboard nao carrega", "dados nao aparecem", "ta dando erro"

Checklist de diagnostico:

| Problema | Investigacao |
|----------|-------------|
| Dashboard nao carrega | Verificar Vercel (URL acessivel?), console errors |
| Dados zerados | Verificar config.js (campaignRef correto?), testar RPC direto |
| Metricas do Meta nao aparecem | Verificar token (expirado?), Edge Function (logs?), cron (rodando?) |
| Erro de conexao Supabase | Verificar URL e key, testar curl REST |
| KPIs errados | Verificar dados nas tabelas, comparar com RPC output |
| Deploy falhou | Verificar Vercel CLI, login, limites do plano |
| Recovery nao funciona | Verificar view v_recovery_dashboard, RLS policies |
| Criativos nao mostram | Verificar RPC get_creative_scoreboard, dados em ad_metrics |

Usar Playwright pra abrir o dashboard e verificar console errors quando possivel.

---

## 7. Ferramentas

| Ferramenta | Uso |
|-----------|-----|
| Bash | CLI Supabase, Vercel CLI, curl |
| Read/Write/Edit | Manipular config.js e arquivos do dashboard |
| Playwright | Abrir dashboard pra testar, verificar console, extrair dados visuais |
| WebSearch | Pesquisar docs Meta API, Supabase, Vercel |
| curl | Testar API REST, Meta Graph API |

---

## 8. Dependencias

| Dependencia | Obrigatoria | Fornecida por |
|-------------|-------------|---------------|
| Banco Supabase configurado | Sim | Database Engineer |
| Credenciais Supabase | Sim | Vault do Database Engineer |
| Campanha + launch criados | Sim | Database Engineer (Fase 3) |
| Conta Vercel | Sim | Usuario (agente guia criacao) |
| Meta App + Token | Nao (so pra integracao Meta) | Usuario (agente guia passo a passo) |
| Meta Ad Account ID | Nao (so pra integracao Meta) | Meta Graph API |

---

## 9. Arquivos do Dashboard (template)

```
index.html              — pagina principal
css/styles.css          — estilos customizados
js/config.js            — credenciais e configuracao (CUSTOMIZAVEL)
js/supabase-client.js   — conexao com Supabase
js/app.js               — inicializacao e auto-refresh
js/metrics.js           — chamadas ao banco (RPCs, queries)
js/ui.js                — renderizacao visual (KPIs, tabelas, forms)
js/criativos.js         — scoreboard de criativos/ads
js/testing.js           — Price Lab + Page Lab
```

**Unico arquivo que muda por aluno:** `js/config.js`

---

## 10. Entregaveis pro Aluno

1. **URL do dashboard** — ex: `meu-lancamento.vercel.app`
2. **Dashboard funcionando** — KPIs, metricas, recovery, criativos, lab
3. **Meta Ads integrado** (opcional) — sync automatico a cada 15 min
4. **Autonomia** — aluno sabe onde ver dados, como registrar gasto manual, como usar Price Lab

---

## 11. Distribuicao

Mesmo modelo do Database Engineer:
- Arquivo .zip com o squad completo
- Aluno baixa, abre Claude Code na pasta do Auroq OS, chama `/ops`, arrasta o .zip
- O /ops instala e configura
- Aluno chama `/lpDashEngineer` pra rodar

---

## 12. Aba no Guia Arcane

Nova aba na sidebar do `guia-arcane.html`:
- **Titulo:** "Dashboard de Lancamento"
- **Icone:** grafico ou tela
- **Categoria:** Setup
- **Conteudo:** passos similares ao "Banco de Dados Unificado" — pre-requisitos, download, instalacao, execucao, verificacao, troubleshooting

---

## 13. Metricas de Sucesso

| Metrica | Meta |
|---------|------|
| Dashboard online apos setup | 100% dos alunos |
| Tempo de setup (sem Meta) | < 10 min |
| Tempo de setup (com Meta) | < 25 min |
| Zero erros de configuracao | config.js gerado automaticamente |
| Token Meta configurado na primeira tentativa | > 80% |
