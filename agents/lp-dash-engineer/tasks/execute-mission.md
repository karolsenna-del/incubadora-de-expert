---
task: "Execute Mission"
responsavel: "@lp-dash-engineer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Missao descrita pelo usuario ou setup automatico"
Saida: "Dashboard instalado, configurado e deployado com URL publica"
Checklist:
  - "Pre-requisitos verificados"
  - "Template copiado"
  - "Config.js gerado"
  - "Dashboard testado"
  - "Vercel deployado"
  - "URL entregue ao usuario"
  - "Vault atualizado"
  - "Playbook atualizado"
  - "Mission Log atualizado"
execution_type: "semantic"
---

# Task: Execute Mission — Setup Completo do Dashboard

## Objetivo

Instalar, configurar e deployar o Launch Command Center no projeto do aluno. Ao final, o aluno tem uma URL publica com dashboard de metricas em tempo real.

## Trigger

`*mission` ou "instala meu dashboard" ou qualquer pedido de setup.

## Setup — 5 Fases

### FASE 0: VERIFICACAO DE PRE-REQUISITOS

**0.1 Verificar ambiente**

```bash
node --version
npm --version
```

- Se Node.js < 18: PARAR. Instruir: "Instale Node.js 18+: brew install node (Mac) ou nodejs.org"

**0.2 Verificar se banco existe**

Checar vault do Database Engineer:
- Ler `agents/database-engineer/data/database-engineer-vault.md`
- Se tem SUPABASE_URL + ANON_KEY: guardar pra usar
- Se NAO tem: verificar se o usuario tem credenciais

Se nao tem credenciais de nenhuma forma:
```
O banco Supabase precisa estar configurado antes de instalar o dashboard.
Rode /databaseEngineer primeiro pra configurar tudo.
```
PARAR aqui.

**0.3 Verificar campanha existente**

Com as credenciais do vault, testar conexao e buscar campanha:

```bash
curl -s "<SUPABASE_URL>/rest/v1/campanhas?select=nome,evento_referencia,data_inicio&order=created_at.desc&limit=5" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>"
```

- Se retorna campanhas: listar e perguntar qual usar
- Se vazio: avisar que precisa rodar Database Engineer Fase 3 primeiro

**CHECKPOINT FASE 0:** Ambiente OK + credenciais disponiveis + campanha existe.

---

### FASE 1: COPIAR TEMPLATE DO DASHBOARD

**1.1 Identificar local do template**

O template do dashboard esta em `agents/lp-dash-engineer/data/dashboard-template/`.

Se nao existir la (ex: template ainda nao foi empacotado), buscar em `packages/launch-command-center/`.

**1.2 Definir destino**

Perguntar ao usuario:
```
Onde voce quer instalar o dashboard no seu projeto?
Sugiro: dashboard/ (na raiz do projeto)
```

Se o usuario aceitar o padrao, usar `dashboard/`. Se preferir outro path, usar o que ele escolher.

**1.3 Copiar arquivos**

Criar estrutura e copiar:

```bash
mkdir -p <DESTINO>/css <DESTINO>/js
```

Copiar os arquivos:
- `index.html` → `<DESTINO>/index.html`
- `css/styles.css` → `<DESTINO>/css/styles.css`
- `js/supabase-client.js` → `<DESTINO>/js/supabase-client.js`
- `js/app.js` → `<DESTINO>/js/app.js`
- `js/metrics.js` → `<DESTINO>/js/metrics.js`
- `js/ui.js` → `<DESTINO>/js/ui.js`
- `js/criativos.js` → `<DESTINO>/js/criativos.js`
- `js/testing.js` → `<DESTINO>/js/testing.js`

NAO copiar `js/config.js` — sera gerado customizado na Fase 2.

Dizer: "Arquivos do dashboard copiados pra <DESTINO>/"

**CHECKPOINT FASE 1:** Todos os arquivos copiados. Falta so o config.

---

### FASE 2: GERAR CONFIG.JS CUSTOMIZADO

**2.1 Coletar dados necessarios**

Dos dados ja obtidos (vault + query de campanha), montar:
- `supabaseUrl` — do vault
- `supabaseAnonKey` — do vault
- `campaignRef` — do evento_referencia da campanha selecionada
- `campaignName` — do nome da campanha selecionada

Perguntar ao usuario APENAS o que falta:

```
Qual o preco do seu produto/evento? (ex: 97, 28, 497)
Isso e usado pra calcular metricas de conversao no dashboard.
```

Buscar launch slug:
```bash
curl -s "<SUPABASE_URL>/rest/v1/launches?select=slug,name&evento_referencia=eq.<CAMPAIGN_REF>&order=created_at.desc&limit=1" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>"
```

Se tem launch: usar o slug. Se nao: usar string vazia (dashboard funciona sem launch slug, usa campaignRef como fallback).

**2.2 Gerar o arquivo**

Escrever `<DESTINO>/js/config.js`:

```javascript
const CONFIG = {
  supabaseUrl: '<SUPABASE_URL>',
  supabaseAnonKey: '<ANON_KEY>',
  campaignRef: '<CAMPAIGN_REF>',
  campaignName: '<CAMPAIGN_NAME>',
  launchSlug: '<LAUNCH_SLUG>',
  defaultConversionValue: <PRECO>,
  refreshInterval: 300000
};
```

Dizer: "Config gerado com suas credenciais e campanha."

**CHECKPOINT FASE 2:** config.js gerado com todos os valores corretos.

---

### FASE 3: TESTAR LOCALMENTE

**3.1 Iniciar servidor HTTP local**

NAO usar `file://` — causa CORS e o Supabase CDN nao carrega.
Iniciar um servidor HTTP local:

```bash
cd <DESTINO> && npx serve -l 3333 &
```

Esperar 3 segundos pra subir.

**3.2 Verificar via Playwright**

Abrir o dashboard no browser pra verificar se funciona:

1. `browser_navigate` para `http://localhost:3333`
2. Esperar 3 segundos pra carregar
3. `browser_console_messages` com level "error" — verificar se tem erros
4. `browser_snapshot` — verificar se KPIs aparecem (mesmo que zerados)

**3.3 Se tem erros no console:**

Erros comuns:
- "Supabase nao configurado" → config.js nao foi carregado ou valores vazios
- "Failed to fetch" → CORS ou URL errada
- "supabase is not defined" → CDN nao carregou (problema de rede)
- "CONFIG is not defined" → config.js nao foi incluido ou path errado

Diagnosticar e corrigir antes de prosseguir.

**3.4 Se dados nao aparecem (tudo zero):**

Testar RPC diretamente:
```bash
curl -s "<SUPABASE_URL>/rest/v1/rpc/get_launch_dashboard" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"p_campaign_ref": "<CAMPAIGN_REF>"}'
```

- Se retorna dados: problema e no frontend (config.js errado?)
- Se retorna vazio: banco nao tem dados ainda (normal se acabou de configurar)

Dizer: "Dashboard carregou OK. {N} vendas, {N} leads encontrados." ou "Dashboard carregou mas o banco ainda nao tem dados — normal se voce acabou de configurar."

**3.5 Parar servidor e fechar browser**

```bash
# Matar o servidor local
kill %1 2>/dev/null || true
```

```
browser_close
```

**CHECKPOINT FASE 3:** Dashboard carrega sem erros. Dados aparecem (ou banco vazio confirmado).

---

### FASE 4: DEPLOY NO VERCEL

**4.1 Verificar Vercel CLI**

```bash
npx vercel --version 2>/dev/null
```

Se nao disponivel:
```bash
npm install -g vercel
```

**4.2 Login no Vercel**

```bash
npx vercel login
```

Se pedir autorizacao no browser:
```
Vai abrir o browser pra voce autorizar o Vercel. Clica em "Continue with..." e volta aqui.
Se nao abrir, acesse: vercel.com/login
```

Se ja esta logado, pular.

**4.3 Deploy**

Navegar pro diretorio do dashboard:

```bash
cd <DESTINO> && npx vercel --prod --yes
```

A flag `--yes` aceita defaults automaticamente.

Capturar a URL de producao do output.

Se o deploy falhar:
- Verificar se os arquivos estao completos
- Verificar logs de erro
- Tentar novamente

**4.4 Verificar deploy**

Abrir a URL deployada via Playwright:

1. `browser_navigate` para a URL do Vercel
2. Esperar 5 segundos
3. `browser_console_messages` com level "error"
4. `browser_snapshot` — verificar KPIs

Se funciona:
```
Seu dashboard ta no ar!
URL: <URL_VERCEL>

Abre no browser e salva nos favoritos.
Os dados atualizam automaticamente a cada 5 minutos.
```

5. `browser_close`

**CHECKPOINT FASE 4:** Dashboard deployado e acessivel via URL publica.

---

### VALIDACAO FINAL

**Salvar no Vault:**

Adicionar ao vault (`agents/lp-dash-engineer/data/lp-dash-engineer-vault.md`):
- URL do Vercel
- Campaign ref usada
- Data do deploy

**Relatorio final:**

```
=== LP DASH ENGINEER — DASHBOARD CONFIGURADO ===

Status: OPERACIONAL

Dashboard:
  URL: <URL_VERCEL>
  Campanha: <CAMPAIGN_NAME> (<CAMPAIGN_REF>)
  Launch: <LAUNCH_SLUG>
  Preco base: R$ <PRECO>
  Auto-refresh: a cada 5 minutos

Funcionalidades ativas:
  - Metricas de campanha (receita, vendas, ROI, gasto)
  - Recovery/follow-up (Bia Sales)
  - Scoreboard de criativos
  - Price Lab (teste de precos)
  - Page Lab (teste A/B)
  - Input manual de gasto

Meta Ads: NAO INTEGRADO
  Para metricas automaticas do Meta, rode: *meta

Proximos passos:
  1. Integrar com Meta Ads pra metricas automaticas (*meta)
  2. Registrar gasto manual diario ate integrar o Meta
  3. Pra proximo lancamento: rode *maintenance pra trocar campanha
```

---

## Missoes Avulsas (nao setup)

Para missoes que nao sao setup (ex: "muda o preco", "troca a campanha"):

### Step 1: Receber e Confirmar
1. Ler a missao
2. Se algo nao esta claro: perguntar ANTES
3. Se esta claro: confirmar e seguir

### Step 2: Checar Vault e Playbook
1. Abrir Vault — onde esta o dashboard? qual URL?
2. Abrir Playbook — tem SOP pra isso?

### Step 3: Executar
1. Executar a missao (editar config, re-deployar, etc.)
2. Testar resultado
3. Salvar mudancas no Vault

### Step 4: Reportar

```
=== RELATORIO DE MISSAO ===

Missao: {o que foi pedido}
Status: {Concluida / Parcial / Bloqueada}

O que foi feito:
  1. {passo 1}
  2. {passo 2}

Resultado: {evidencia}
URL: {se re-deployou}
Proximos passos: {se houver}
```

## Error Handling

| Cenario | Acao |
|---------|------|
| Banco nao existe | PARAR. Instruir /databaseEngineer |
| Credenciais nao no vault | Usar Playwright ou pedir ao usuario |
| Template nao encontrado | Buscar em packages/launch-command-center/ |
| Config.js com valores errados | Re-gerar com valores corretos |
| Console errors no dashboard | Diagnosticar e corrigir antes de deploy |
| Vercel login falha | Guiar login manual no browser |
| Deploy falha | Verificar erros, corrigir, re-deployar |
| URL deployada nao carrega | Verificar DNS, esperar propagacao (1-2 min) |
| Dados zerados | Verificar campaignRef, testar RPC direto |
