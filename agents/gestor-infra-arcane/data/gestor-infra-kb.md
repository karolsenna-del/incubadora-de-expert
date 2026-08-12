# Gestor de Infra Arcane — Foundation KB

> Base de conhecimento operacional. Organizada por DOMINIO DE OPERACAO.
> Ferramentas fora do stack ativo foram removidas. Se precisar de algo nao listado, usar Modo Pesquisa.

---

## 1. Pipeline de Vendas (Hotmart + Supabase + N8N)

### 1.1 Hotmart

**O que e:** Plataforma brasileira de produtos digitais — hospeda cursos, e-books, mentorias. Gerencia checkout, pagamento, area de membros, afiliados e entrega automatica.

**Features core para operacao:**

| Feature | O que faz | Onde acessar |
|---------|-----------|-------------|
| Criar produto | Cadastro de infoproduto (curso, ebook, mentoria) | Painel > Produtos |
| Checkout | Pagina de pagamento customizavel (PIX, cartao, boleto) | Produto > Checkout |
| Cupons | Desconto fixo ou percentual, validade, uso limitado | Produto > Cupons |
| Webhooks | Notificacoes HTTP automaticas por evento | Ferramentas > Webhooks |
| Pixel | Meta Pixel, Google Ads, TikTok Pixel na pagina de checkout/obrigado | Produto > Rastreamento |
| Area de membros | Hotmart Club — modulos, aulas, materiais complementares | Produto > Area de membros |
| Subir/tirar aulas | Upload de video, PDF, reordenacao, publicar/despublicar | Area de membros > Modulos |

**Webhooks — eventos disponiveis:**

| Evento | Quando dispara |
|--------|---------------|
| `PURCHASE_APPROVED` | Pagamento confirmado |
| `PURCHASE_COMPLETE` | Compra finalizada |
| `PURCHASE_CANCELED` | Compra cancelada |
| `PURCHASE_REFUNDED` | Reembolso processado |
| `PURCHASE_DELAYED` | Pagamento atrasado |
| `PURCHASE_EXPIRED` | Pagamento expirado |
| `PURCHASE_CHARGEBACK` | Chargeback recebido |
| `PURCHASE_BILLET_PRINTED` | Boleto gerado |
| `REFUND_REQUESTED` | Pedido de reembolso |
| `SUBSCRIPTION_CANCELLATION` | Assinatura cancelada |
| `CART_ABANDONMENT` | Carrinho abandonado |

**Status de compra possiveis:** `approved`, `canceled`, `billet_printed`, `refunded`, `dispute`, `completed`, `blocked`, `chargeback`, `delayed`, `expired`

**Status de assinatura possiveis:** `active`, `canceled`, `past_due`, `expired`, `started`, `inactive`

**API:**
- Base URL: `https://developers.hotmart.com/payments/api/v1/`
- Autenticacao: Bearer Token (OAuth2 — client_credentials)
- Endpoints principais: `/sales/history`, `/sales/summary`, `/sales/commissions`, `/subscriptions`
- Rate limit: ~60 req/min (estimado)
- Doc oficial: https://developers.hotmart.com/docs/

**Payload webhook (exemplo simplificado):**
```json
{
  "event": "PURCHASE_APPROVED",
  "data": {
    "product": { "id": 123456, "name": "Curso X" },
    "buyer": { "email": "comprador@email.com", "name": "Fulano" },
    "purchase": {
      "transaction": "HP12345678",
      "status": "approved",
      "price": { "value": 997.00, "currency_code": "BRL" }
    },
    "subscription": { "status": "active", "plan": { "name": "Mensal" } }
  }
}
```

**Criacao de Ofertas — Regras:**

| Regra | Detalhe |
|-------|---------|
| Forma de pagamento PADRAO | **Parcelado com taxas para seu cliente** |
| NUNCA usar | "Parcelado sem taxas" — produtor absorve taxas |
| Imutavel apos criacao | Forma de pagamento NAO pode ser editada. Se errou, deletar e recriar |
| checkoutMode=10 OBRIGATORIO | Ofertas `?off=` NAO herdam order bumps. Precisa de `&checkoutMode=10` no link |
| Diferenca oferta vs cupom | Oferta (`?off=CODIGO`) = preco fixo. Cupom (`?offDiscount=CUPOM`) = desconto sobre base |

**Troubleshooting:**

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Webhook nao chega | URL incorreta ou servidor fora | Testar URL com webhook.site primeiro |
| Webhook duplicado | Retry automatico da Hotmart | Implementar idempotencia via `transaction` ID |
| Pixel nao dispara | Bloqueador de anuncios ou erro no ID | Testar com Meta Pixel Helper |
| Checkout nao converte | Muitos campos, sem PIX habilitado | Simplificar, habilitar PIX e cartao |
| Nao acha o produto | Conta e colaboradora | Central de Colaboradores > trocar conta |

---

### 1.2 Kiwify (alternativa)

Plataforma alternativa ao Hotmart. Mesma funcao — produtos digitais, checkout, area de membros. Checkout mais limpo, taxas competitivas (~13% vs ~20% Hotmart). Webhooks: `compra_aprovada`, `compra_recusada`, `compra_reembolsada`, `chargeback`, etc. API: `https://public-api.kiwify.com/v1/`, Bearer Token + `x-kiwify-account-id`. Usar quando taxa importa ou checkout precisa ser mais limpo. Hotmart e o padrao.

---

### 1.3 Voomp (Voomp Creators / Voomp Play)

**O que e:** Plataforma brasileira de produtos digitais (concorrente Hotmart/Kiwify) — checkout (Voomp Pay) + area de membros (Voomp Play). E onde o Expert360º roda hoje (curso, migrado do Hotmart em 01/07). Video nao fica hospedado na Voomp — o padrao adotado (course-publisher) e YouTube nao-listado + Voomp Tube so embeda.

**Duas APIs distintas — nao confundir:**

| API | Uso | Autenticacao | Publica/documentada? |
|-----|-----|--------------|----------------------|
| `api.voompplay.com.br` | Gestao de curso/aula (upload de video/thumb, modulos, status published/draft) | Header `authorization` = token de sessao logada (capturada via app, nao developer portal) | Nao — interna do app, usada via engenharia reversa (ver `agents/course-publisher/scripts/`) |
| Webhook de vendas (Voomp Creators) | Notificar sistema externo quando ocorre evento de venda | URL de callback configurada na UI (produto > **Entregas**) | Sim — documentada na Central de Ajuda |

**Webhook de vendas — CONFIRMADO que existe (pesquisa 11/08/2026):**
- Configuracao: editar produto > aba **Entregas** > escolher evento(s) > colar Webhook URL > "Criar Liberacao"
- Eventos disponiveis: **Vendas** (compra avulsa/valor unico), **Assinatura** (mensal/trimestral/semestral/anual), **Checkout** (lead que preencheu nome/email/telefone e NAO finalizou — equivalente a abandono de carrinho)
- Confirmado suporte a integracao via Zapier/Make (categoria E-commerce) e via ferramentas BR (Notazz, Notificacoes Inteligentes, SellFlux, ActiveCampaign) — mesmo mecanismo de webhook por baixo
- **Nao verificado ainda:** formato exato do payload (schema JSON), se tem retry/idempotencia como a Hotmart, rate limits. Fazer teste real (webhook.site) antes de integrar em producao
- Doc oficial: https://faq.voompcreators.com.br/integracao-de-produtos/como-integrar-com-webhook-voomp-creators/

**Implicacao pratica:** da pra manter o checkout na Voomp Pay (ja em producao, sem risco de mexer em pagamento) enquanto a liberacao de acesso aponta pra uma plataforma de entrega propria — webhook de venda -> endpoint (n8n ou Edge Function) -> grava em `compras`/`crm_leads` no Supabase -> libera acesso na plataforma nova. Mesmo desenho que o Bootstrap 3 Fase 2 ja tinha deixado pausado pra Hotmart, so trocando a origem do webhook.

**Gap a fechar antes de implementar de verdade:** disparar uma venda de teste (ou usar webhook.site) pra capturar o payload real e confirmar o schema — a doc da central de ajuda descreve a configuracao, nao o JSON exato.

---

## 2. Pipeline WhatsApp (Cloud API + Z-API + Dispatcher)

**Stack padrao:** WhatsApp Cloud API (Meta) pra mensageria 1-a-1 via n8n + Z-API pra grupos/comunidades + Dispatcher pra disparos programados em campanhas.

**WhatsApp Business Platform — regras Meta (2025+):**
- **Janela de 24h:** Apos ultima mensagem do lead, resposta livre por 24h
- **Fora da janela:** Somente Templates pre-aprovados pelo Meta
- **Cobranca (jul/2025+):** Por mensagem entregue (marketing templates)
- **Tiers:** Tier 1 (1.000/dia), Tier 2 (10.000/dia), Tier 3 (100.000/dia)

---

### 2.1 WhatsApp Cloud API (Meta)

**O que e:** API oficial do Meta pra WhatsApp Business. Sem intermediario — seu servidor (n8n) conversa direto com Graph API.

**Setup minimo:**
1. **Meta Business Manager** com WhatsApp Business Account (WABA) verificada
2. **Phone Number ID** vinculado ao numero do atendimento
3. **System User Token** (permanente, diferente do token temporario de dev)
4. **Webhook** configurado no Meta pro endpoint do n8n (ex: `https://webhook.{dominio}/webhook/wf-inbound-cloud`)
5. **Templates** aprovados pela Meta (criados via Meta Business Suite ou Graph API)

**Endpoints principais (Graph API v21.0):**

| Endpoint | Metodo | Usar pra |
|----------|--------|----------|
| `/{phone_number_id}/messages` | POST | Enviar mensagem (texto, template, midia) |
| `/{phone_number_id}/media` | POST | Upload de midia (imagem, video, audio, doc) |
| `/{waba_id}/message_templates` | GET | Listar templates aprovados |
| `/{waba_id}/message_templates` | POST | Submeter novo template pra aprovacao |

**Enviar template:**
```bash
curl -X POST "https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer {SYSTEM_USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "55DDDNUMERO",
    "type": "template",
    "template": {
      "name": "nome_template",
      "language": { "code": "pt_BR" },
      "components": [
        { "type": "body", "parameters": [
          { "type": "text", "text": "Valor variavel 1" }
        ]}
      ]
    }
  }'
```

**Webhook recebendo mensagem:**
O Meta envia POST pro seu webhook com payload estruturado:
```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "55DDDNUMERO",
          "id": "wamid.XXX",
          "timestamp": "1234567890",
          "type": "text",
          "text": { "body": "mensagem do lead" }
        }]
      }
    }]
  }]
}
```

**Regras criticas ao subir pipeline Cloud API no n8n:**
- Webhook precisa responder 200 em <5s (Meta reenvia se timeout)
- Validar `hub.verify_token` no GET inicial do webhook
- Normalizar phone pra `55DDDNUMERO` antes de qualquer operacao (REGRA-013)
- Setar `active_agent_id` no contato ANTES de enviar template (REGRA-001)
- Fallback 8/9 digitos: celular BR pode vir com ou sem o 9 — lookup sempre com alternativo (REGRA-013)

**Troubleshooting:**

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Mensagem nao entrega | Fora da janela 24h sem template | Usar template aprovado |
| Template rejeitado | Variavel no inicio/fim do body, conteudo fora das politicas | Body fixo no inicio + revisar guidelines |
| `#131026` invalid phone | Phone em formato errado | Normalizar pra `55DDDNUMERO` so digitos |
| `#132000` template not found | Nome errado ou nao APPROVED | Listar `/message_templates`, verificar status |
| `#131031` account limit reached | Atingiu tier limit | Aguardar 24h ou subir tier |
| Agente responde errado | `active_agent_id` nao setado antes do envio | REGRA-001 — PATCH antes do POST |

---

### 2.2 Z-API

**O que e:** API para WhatsApp — gestao de grupos, comunidades, mensagens, mencoes. Usada pra disparos em comunidades/grupos com @todos.

**Endpoints principais:**

| Endpoint | Metodo | O que faz |
|----------|--------|-----------|
| `/send-text` | POST | Enviar mensagem de texto |
| `/communities` | POST | Criar comunidade |
| `/communities/link` | POST | Vincular grupo existente a comunidade |
| `/create-group` | POST | Criar grupo |
| `/group-metadata/{id}` | GET | Dados do grupo (participantes, etc.) |
| `/groups` | GET | Listar todos os grupos |

**Mencao @todos (@ verde na notificacao):**
- Usar `mentioned` array com todos os phones — **NAO usar `mentionsEveryOne: true`**
- `mentionsEveryOne: true` NAO gera o icone verde do @
- `mentioned: [array de phones]` gera o icone verde (confirmado)
- Buscar participantes via `/group-metadata/{id}` antes de enviar

**Limitacoes conhecidas:**
- Promover admin na comunidade via API nao funciona (so via app WhatsApp)
- Foto da comunidade so pode ser setada NO MOMENTO DA CRIACAO. Depois, NAO da pra alterar. SEMPRE incluir foto no POST
- Agendamento nativo nao existe (usar script com --schedule ou n8n cron)
- Spintax nao existe (implementar no script/n8n antes de enviar)

**Credenciais:** ver Vault

---

### 2.3 Grupify

**O que e:** Redirecionador inteligente pra grupos WhatsApp. Link unico que distribui entre grupos. Quando um lota, redireciona pro proximo.

**Plano atual:** Gratis (ate 2.500 cliques/mes)

**Algoritmos:** Aleatorio (gratis), Preencher Primeiro (plano essencial R$67)

**API REST:**

| Endpoint | Metodo | Status |
|----------|--------|--------|
| `/api/auth/login` | POST | OK — retorna JWT |
| `/api/redirectors` | GET | OK — lista redirectors |
| `/api/redirectors` | POST | OK — cria redirector |
| `/api/redirectors/{id}` | PUT | OK — atualiza |
| `/api/redirectors/{id}` | DELETE | OK — deleta |
| `/api/groups` | POST | **BUG 500** — nao funciona |

**Limitacao critica:** Criar grupo via API nao funciona (bug 500). Fazer via Playwright.

**WebFetch nao funciona:** Pagina publica usa JS pra renderizar. Usar Playwright pra verificar links.

**Credenciais:** ver Vault

---

### 2.4 Tally (Formularios)

**O que e:** Criador de formularios (NPS, pesquisa, pagina obrigado). Free, simples, API REST.

**Integracao com banco de dados:**
- Tally webhook → n8n workflow → banco de dados (normaliza + salva)
- Dedup via submission_id UNIQUE

**Pra adicionar form novo:** criar webhook via API Tally (`POST /webhooks` com formId + eventTypes + url do n8n) e registrar no banco.

**Credenciais:** ver Vault

---

### 2.5 Pipeline n8n + Cloud API — contexto pra operador

> **Escopo:** Este squad **opera** o pipeline, nao instala. A instalacao (subir n8n, criar tabelas Supabase, configurar Meta Business Manager, importar workflows, gerar System User Token) e responsabilidade de um agente de setup dedicado. Quando voce ativar este squad, assuma que o pipeline **ja esta rodando**.

**O que voce encontra ja pronto:**

```
Lead manda msg → Meta → webhook n8n
  ↓
WF-INBOUND (recepcao + pre-processamento)
  ↓
WF-AGENT-CORE (IA gera resposta usando prompts L3 por agent_id)
  ↓
WF-OUTBOUND (envia resposta humanizada via Graph API)
```

**Workflows core (instalados pelo agente de setup — voce nao mexe na logica, so opera):**

| Workflow | Funcao | Voce mexe quando |
|----------|--------|------------------|
| **WF-INBOUND** | Recebe msgs do Meta, agrupa em buffer, processa midia (audio/imagem/texto), enriquece com perfil do lead | Nunca — so monitora execucoes |
| **WF-AGENT-CORE** | Roda a IA. Tem um node `Configuracao do Agente` com os prompts L3 | **Pra manutencao de prompt** (SOP-017) |
| **WF-OUTBOUND** | Envia a resposta chunk por chunk com delays humanizados | Nunca — so monitora execucoes |
| **WF-COMPRAS** | Webhook Hotmart/Kiwify → registra compra → dispara boas-vindas | Raramente — se webhook mudar ou template boas-vindas trocar |
| **WF-RECOVERY-CRON** | Cron de recovery de abandonos | Operar start/stop, ajustar horario |
| **WF-DISPATCHER** | Cron que le config JSON de campanhas e dispara | **Editar JSONs de campanha** (ver secao 2.6) |
| **WF-CHATWOOT-HUMAN** | Sync handoff humano via Chatwoot | Raramente — so se integracao quebrar |

**Workflows que voce pode criar e operar (fora dos core):**
- Workflows de dispatch one-shot pra campanha especifica
- Workflows de sync entre sistemas (ex: Supabase → planilha, ActiveCampaign → Supabase)
- Automacoes pontuais (ex: notificar Slack quando algo acontece)

**Tabelas Supabase que voce vai consultar:**

| Tabela | Quando usar |
|--------|------------|
| `{prefixo}_whatsapp_contacts` | Setar `active_agent_id` antes de disparo (REGRA-001), adicionar flag de handoff, debugar por que lead recebeu resposta errada |
| `{prefixo}_agent_context` | Debugar por que Bia ta repetindo coisas, limpar historico de conversa residual |
| `{prefixo}_purchases` | Conferir atribuicao de vendas (sck vs active_agent_id — REGRA-009) |
| `{prefixo}_quality_monitoring` | Logs de execucao pra analise semanal de conversas |

**Handoff humano (como opera):**
- Campo `handoff_status` (ou equivalente) em `{prefixo}_whatsapp_contacts` sinaliza "humano atendendo"
- Workflow WF-AGENT-CORE respeita esse campo e nao responde
- Atendente resolve no Chatwoot → fecha conversa → campo e limpo → Bia volta a responder
- Pra disparo informativo sem Bia (ex: aviso de acesso): setar flag ANTES do envio pra nao dar loop

**Regras criticas ao operar qualquer workflow n8n:**
- **Cache cycling obrigatorio apos PUT** (REGRA-005 do rules.md) — sem isso, alteracao nao surte efeito
- **Validar JS antes de PUT** (REGRA-012) — prompt mal escapado derruba o workflow inteiro
- **Never** usar `staticData` pra estado entre execucoes — sempre Supabase com lock atomico (padrao ja e esse nos workflows core)
- **Cada PUT deve ter backup** — fazer GET antes, salvar local, pra rollback rapido

---

### 2.6 Dispatcher — como operar campanhas programadas

**O que e:** Workflow n8n (`WF-DISPATCHER`) que le config de arquivos JSON no repo e dispara templates automaticamente. Instalado pelo agente de setup. Voce opera editando os JSONs.

**Principio:** **Config no JSON, logica no codigo.** Pra mudar copy/horario/filtros de uma campanha, voce edita o JSON + commit + push. Nunca mexe no codigo do workflow.

**Estrutura do repo:**
```
business/campanhas/
├─ _active-campaigns.json     (registry — quais campanhas estao ativas)
└─ {slug-da-campanha}/
   ├─ active.json              (config do ciclo atual)
   └─ arquivo/
      └─ {ciclo-ref-antigo}.json   (historico de ciclos anteriores)
```

**Como operar (o dia-a-dia do tech-ops):**

| Acao | O que fazer |
|------|-------------|
| **Criar campanha nova** | mkdir da pasta, copiar template de `active.json`, adicionar entrada no `_active-campaigns.json` com `active: false` |
| **Abrir ciclo** (preparar disparos do proximo evento) | Preencher `active.json` com `data_evento`, `vars`, `audience`, `dispatches[]` → setar `active: true` → commit + push |
| **Pausar campanha** | Setar `active: false` no registry → commit + push |
| **Trocar copy de um disparo** | Editar o dispatch dentro de `active.json` → validar JSON → commit + push |
| **Renovar ciclo** (evento acabou, vem outro) | Arquivar `active.json` em `arquivo/{ciclo-ref}.json`, sobrescrever com novo ciclo, push |
| **Disparo nao saiu / erro** | Ver execucoes do WF-DISPATCHER no n8n, consultar tabela de log (`dispatches_log` ou equivalente) |

**Anatomia de um dispatch:**
- `id` — tag unica (ex: `#1`, `#7`) — serve de idempotencia
- `tipo` — `api` (Cloud API individual) ou `grupo` (Z-API)
- `when` — ISO 8601 com timezone (ex: `2026-04-26T09:30:00-03:00`)
- Pra `api`: `template`, `components` (estrutura Cloud API), filtros de audience
- Pra `grupo`: `message` (array de strings)
- `enabled: false` pra dispatches TODO/pendentes (workflow ignora)

**Validacao OBRIGATORIA antes de commit:**
```bash
python3 -m json.tool business/campanhas/{slug}/active.json > /dev/null && echo OK
python3 -m json.tool business/campanhas/_active-campaigns.json > /dev/null && echo OK
```
JSON invalido = workflow crasha na proxima execucao. Sem excecao.

**Beneficios dessa arquitetura:**
- Tech-ops nao mexe em codigo — so JSON
- Historico completo por ciclo
- Idempotencia (log garante nao disparar 2x)
- Rollback facil (git revert)
- Multi-campanha em paralelo

---

---

## 3. Tracking & Analytics (UTMify + GTM + GA4 + Meta Pixel/CAPI)

### 3.1 UTMify

**O que e:** Rastreamento de vendas via UTM. Cruza parametro UTM do anuncio com venda na plataforma.

**Como funciona:**
1. UTMs nos links dos anuncios capturam a origem
2. UTMify intercepta a venda (Hotmart, etc.) via integracao
3. Cruza UTM com venda = sabe qual anuncio gerou a venda
4. Dashboard mostra CPA, ROI, ROAS real por campanha

**Parametros UTM padrao:**
```
?utm_source=facebook&utm_medium=cpc&utm_campaign=lancamento&utm_content=criativo-01&utm_term=interesse
```

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| Venda nao aparece | Reconectar plataforma no UTMify |
| UTM nao rastreia | Verificar se URL tem UTMs completos |
| Dados divergem do Ads Manager | Janelas de atribuicao diferentes (UTMify usa last-click) |

---

### 3.2 Google Tag Manager (GTM)

**O que e:** Container intermediario entre site e ferramentas de tracking. Instala uma vez, gerencia tudo pelo painel.

**Conceito fundamental — Data Layer:**
```javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'purchase',
  'transaction_id': 'T12345',
  'value': 997.00,
  'currency': 'BRL'
});
```

**Tags mais comuns:** GA4 Configuration, GA4 Event, Meta Pixel, Meta Custom Event, Google Ads Conversion/Remarketing

**Triggers mais comuns:** Page View, Click (All Elements / Just Links), Form Submission, Custom Event, Scroll Depth

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| Tag nao dispara | Preview mode > verificar trigger |
| Tag dispara 2x | GTM instalado duplicado |
| Preview nao funciona | Desativar extensoes, permitir popups |

---

### 3.3 Google Analytics 4 (GA4)

**O que e:** Analytics baseado em eventos. Rastreia comportamento de usuarios.

**Terminologia (2025+):** "Key Event" = acao importante (antigo "conversao" no GA4). Marcar no GA4 + importar como Conversao no Google Ads.

**Eventos recomendados para infoproduto:**

| Evento | Quando | Parametros |
|--------|--------|------------|
| `page_view` | Automatico | page_title, page_location |
| `generate_lead` | Captura de lead | method, value |
| `begin_checkout` | Inicia checkout | currency, value, items |
| `purchase` | Compra confirmada | transaction_id, value, currency, items |

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| Dados nao aparecem | GTM Preview + GA4 DebugView |
| Key Event nao no Google Ads | Re-importar conversoes |
| Dados atrasados | Normal (24-48h). Usar Realtime pra validar |

---

### 3.4 Meta Pixel / CAPI

**O que e:** Tracking do Meta. Pixel = browser-side. CAPI = server-side. Ambos juntos.

**Por que CAPI e essencial (2025+):** iOS 14.5+ e ad blockers bloqueiam Pixel. Pixel sozinho perde 40-60% das conversoes. CAPI envia server-to-server.

**Eventos padrao:**

| Evento | Quando |
|--------|--------|
| `PageView` | Toda pagina |
| `ViewContent` | Pagina de vendas |
| `InitiateCheckout` | Inicia checkout |
| `Purchase` | Compra confirmada |
| `Lead` | Captura de lead |

**Deduplicacao (CRITICO):** Pixel e CAPI enviam o MESMO evento. Precisa de `event_id` identico nos dois pra deduplicar.

```javascript
// Pixel (browser)
fbq('track', 'Purchase', {value: 997, currency: 'BRL'}, {eventID: 'evt_123'});

// CAPI (server) — mesmo event_id
{ "event_name": "Purchase", "event_id": "evt_123", ... }
```

**Setup CAPI via N8N:** Hotmart webhook > N8N > POST para `https://graph.facebook.com/v18.0/{pixel_id}/events`

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| Pixel nao dispara | Meta Pixel Helper (extensao Chrome) |
| CAPI duplica | Garantir mesmo event_id nos dois |
| Match rate baixo | Enviar mais user_data (email, phone) |

---

## 4. Infraestrutura (VPS + EasyPanel + DNS)

### 4.1 VPS (Contabo/Hetzner/DigitalOcean)

**O que e:** Servidor virtual privado. Servidores unmanaged.

**Acesso SSH:**
```bash
ssh root@IP_DO_SERVIDOR
ssh -i ~/.ssh/minha_chave root@IP_DO_SERVIDOR
scp arquivo.txt root@IP_DO_SERVIDOR:/destino/
```

**Setup inicial recomendado:** Criar usuario nao-root, SSH key, desativar login root por senha, firewall basico (ufw: 22, 80, 443).

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| SSH connection refused | Rescue System > verificar sshd + firewall |
| Servidor lento | `htop` pra diagnostico |
| Disco cheio | `df -h`, `du -sh /*`, limpar logs |
| Servidor inacessivel | Rescue System via painel do provedor |

---

### 4.2 EasyPanel

**O que e:** Painel de controle moderno baseado em Docker. Deploy de apps, bancos, SSL, tudo via interface web.

**Instalacao:** `curl -sSL https://get.easypanel.io | sh` → acessar `http://IP:3000`

**Templates uteis:** N8N, WordPress, Supabase, Uptime Kuma, Portainer, Minio

**Operacoes comuns:** Deploy app, conectar dominio + SSL (automatico Let's Encrypt), logs em tempo real, shell no browser.

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| SSL nao gera | Verificar A record no DNS |
| Container reinicia em loop | Verificar logs (OOM, erro fatal) |
| EasyPanel inacessivel | `ufw allow 3000` |

---

### 4.3 DNS

**Tipos de registro:**

| Tipo | Funcao | Exemplo |
|------|--------|---------|
| **A** | Dominio → IP | `exemplo.com.br → 123.45.67.89` |
| **CNAME** | Alias para outro dominio | `www → exemplo.com.br` |
| **MX** | Servidor de email | `mail → mx1.provider.com` |
| **TXT** | SPF, DKIM, verificacao | `v=spf1 include:...` |

**Registros para email (obrigatorios):**
- **SPF:** `v=spf1 include:_spf.google.com include:sendgrid.net ~all`
- **DKIM:** selector._domainkey → chave fornecida pelo provedor
- **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@dominio.com`

**Propagacao:** 15 min a 48h. Antes de mudar: reduzir TTL pra 300s 24h antes.

**Verificar:** `dig +short dominio.com` ou https://www.whatsmydns.net/

**SSL/TLS:** Let's Encrypt via EasyPanel (automatico, renova a cada 90 dias).

---

## 5. Banco de Dados (Supabase)

### 5.1 Supabase

**O que e:** Backend-as-a-Service open-source. PostgreSQL + Auth + Storage + Edge Functions + Realtime.

**RLS — conceito fundamental:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id);
```

**API automatica (PostgREST):**
```bash
GET /rest/v1/tabela?coluna=eq.valor       # Filtrar
POST /rest/v1/tabela                       # Inserir
PATCH /rest/v1/tabela?id=eq.123            # Atualizar
DELETE /rest/v1/tabela?id=eq.123           # Deletar
Headers: apikey: ANON_KEY, Authorization: Bearer TOKEN
```

**CLI essencial:**
```bash
supabase init                              # Inicializar
supabase link --project-ref REF            # Link remoto
supabase migration new nome                # Criar migration
supabase db push                           # Aplicar migrations
supabase migration list                    # Status
supabase functions deploy nome             # Deploy edge function
supabase gen types typescript --linked > types/supabase.ts  # Types
```

**Auth:** Login social, email/senha, magic link, OTP. Redirect URLs em Settings > Auth.

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| API retorna [] vazio | RLS bloqueando. Usar service_role key pra debug |
| Auth nao funciona | Verificar Redirect URLs |
| Migration falha | Testar SQL no Studio primeiro |
| Realtime nao funciona | `ALTER TABLE x REPLICA IDENTITY FULL` |
| `infinite recursion detected in policy for relation "x"` (42P17) | Policy de RLS faz `EXISTS (select ... from x ...)` na MESMA tabela que ela protege — a subquery reavalia a propria RLS, que reavalia a subquery, infinito. Achado na area-de-membros (12/08, tabela `materiais_consultoria`, policy de reciprocidade "só vê compartilhado de outro se também compartilhou o próprio"). Fix: extrair a subquery pra uma function `security definer` (roda fora do contexto de RLS de quem chamou, quebra o ciclo) e a policy chama a function em vez do EXISTS direto: `create function f() returns boolean language sql security definer set search_path = public as $$ select exists (...) $$; grant execute on function f() to authenticated;` — depois `create policy ... using (f())`. Sempre testar policy self-referencing com uma chamada real (clique na UI, nao só o SQL isolado) antes de dar como pronta — o SQL da migration sozinho nao aciona a recursao, só aparece quando o Postgres avalia a policy dentro de uma query real |

### 5.2 Padrao — App estatico com login (Supabase Auth magic link + Vercel)

**O que e:** Padrao pra construir uma area logada (dashboard, area de membros) sem framework/build step — mesmo espirito do Launch Command Center (`agents/lp-dash-engineer/data/dashboard-template/`), acrescentando autenticacao real.

**Estrutura de arquivos:**
```
site/
  index.html        # login (magic link)
  app.html           # area logada
  css/styles.css
  js/config.js        # supabaseUrl + supabaseAnonKey (anon key e publica por design, RLS protege dado)
  js/supabase-client.js  # initSupabase()/getSupabase() via window.supabase.createClient (CDN UMD)
  js/auth.js          # signInWithOtp (magic link) na pagina de login
  js/app.js           # getSession() como guard; se nao tem sessao, redireciona pro login
```

**Login sem senha (magic link):**
```js
await sb.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: window.location.origin + '/app.html' }
});
```
Supabase manda o e-mail, o link volta com `#access_token=...` na URL — o client detecta sozinho (`detectSessionInUrl`, default `true` no supabase-js v2) e cria a sessao. Nao precisa de backend nem de tabela nova — usa `auth.users`, que ja vem provisionado em qualquer projeto Supabase.

**Regra:** login/auth NAO conta como "mudar schema" (Nivel 7 — Delegate na Delegation Map). Criar TABELA nova (matricula, progresso, etc.) conta como Nivel 3 — Consult, precisa propor e esperar aprovacao antes de rodar a migration.

**QA local antes de deploy:** `python -m http.server {porta}` na pasta do site + Playwright pra screenshot de cada tela (login, app, estados de overlay/modal). Pra testar telas que exigem sessao sem mandar e-mail de verdade: gate temporario via `localStorage.getItem('preview_mode')` no guard de auth, **removido antes de qualquer integracao real de dado** — documentar isso claramente no codigo (comentario) pra nao esquecer de tirar.

**CUIDADO — QA local pode ser visto pelo usuario:** se o Playwright estiver controlando um browser real/visivel (nao headless isolado), o usuario pode literalmente estar olhando pra mesma janela que voce testa, achando que e o site publicado. Sinal de alerta: usuario reporta bug com print mostrando `localhost:PORTA` na barra de enderecos, ou bug que voce nao consegue reproduzir de jeito nenhum no ambiente publicado. Nesse caso, a missao inclui checar o print antes de qualquer outra investigacao, e orientar o usuario a testar sempre na URL publicada (Vercel), nunca no localhost da sessao de QA.

**Armadilha de CSS Grid — `overflow`/`max-height` que nao funciona dentro de coluna de grid:** um item de `display:grid` tem `min-height: auto` implicito (nao `0`), que IGNORA `max-height` + `overflow-y:auto` se o conteudo interno for mais alto — o item cresce mesmo assim, empurrando a pagina e criando scroll quebrado/duplo (a coluna "devia" rolar sozinha mas nao rola, ou rola errado). Sintoma tipico reportado pelo usuario: "nao consigo descer pra ver/clicar em algo". Fix rapido: `min-height: 0` no item de grid. Fix mais robusto (usado aqui): nem tentar scroll independente por coluna — deixar a pagina inteira rolar como uma unica area (`align-items:start` no grid, sem `max-height`/`overflow` nas colunas), com o header fixo via `position: sticky; top:0`. Mais simples, zero calculo de `100vh - Npx`, funciona em qualquer altura de tela.

**Usado em:** `business/campanhas/area-de-membros/` (11/08/2026) — ver tracker do projeto.

### 5.3 Logo/imagem de marca sem versao dark — como aplicar sem gambiarra

**Contexto:** Marca fornece PNG opaco (fundo branco, so vezes com elemento de design que nao e "fundo removivel" — ex.: um semi-circulo cinza-claro que faz parte da composicao). Precisa aparecer numa superficie escura.

**NAO fazer:** chroma-key generico (remover branco por threshold) quando a arte tem cores proximas do branco fazendo parte do desenho — fica com halo/artefato visivel.

**Fazer:** colocar a logo original (opaca, fiel) dentro de um badge/card com fundo branco (`border-radius` + padding), plantado sobre a superficie escura. Look intencional, zero risco de artefato, nao depende de editar a arte.

**Quando a marca já manda a variante certa** (ex.: "logo preto" = fundo escuro, "logo branco" = fundo claro/transparente): usar direto, sem tratamento.

### 5.4 Capa de produto gerada em SVG (sem foto/IA externa)

**Contexto:** Precisa de capa "premium" pra card de produto (tipo vitrine de plataforma de curso) mas nao tem foto/asset pronto, e nao ha credencial de gerador de imagem (Freepik/Kling/Magnific/DALL-E) no vault.

**Padrao:** gerar a capa em SVG puro, no cliente (sem chamada de API): fundo escuro em gradiente + motivo geometrico reaproveitado da propria identidade visual (ex.: arcos concentricos ecoando um logo que já usa arco/orbita) + tipografia grande e quase invisivel (opacidade ~0.05) como textura editorial + 1 elemento de destaque (ponto com glow via `radialGradient`). Variação sistemática entre produtos: 1 campo numerico simples (ex. "intensidade" 1-7 = tier/preço) controla quantos elementos aparecem — mais caro, composição mais "funda" — sem precisar desenhar cada capa a mao.

**Vantagem sobre gradiente CSS flat:** gradiente colorido chapado (laranja→preto diagonal) lê como "template generico". Fundo majoritariamente escuro com POUCO elemento de cor de destaque le como editorial/premium — mesma logica de moodboard usada em plataformas premium (fundo escuro + luz pontual, nao preenchimento colorido total).

**Implementacao:** funcao JS que monta a string SVG (`<svg viewBox="0 0 400 225">...`) via template literal, injetada direto no `innerHTML` do card (nao precisa de arquivo de imagem, nao precisa de asset build). Seed deterministico por `slug` (hash simples da string) pra cada produto ter variação própria e estável entre reloads, sem aleatoriedade real.

**Usado em:** `business/campanhas/area-de-membros/site/js/covers.js` (11/08/2026).

---

## 6. Email & CRM (ActiveCampaign)

### 6.1 ActiveCampaign

**O que e:** Email marketing + CRM + automacao. A mais robusta pra automacoes baseadas em comportamento.

**API (v3 — REST):**
- Base: `https://{conta}.api-us1.com/api/3/`
- Header: `Api-Token: SUA_API_KEY`
- Endpoints: `/contacts` (CRUD), `/contactTags` (add/remove tag), `/tags` (listar)

**Integracoes comuns:** Hotmart webhook > N8N > AC API (tag na compra), Formulario > AC, Automacao WhatsApp > AC via API.

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| Email vai pra spam | SPF + DKIM + DMARC |
| API retorna 403 | Regenerar key com permissoes |
| Contato duplicado | Usar "Add or Update" (upsert) |
| Taxa abertura baixa | Melhorar assunto + autenticacao dominio |

### 6.2 Padroes Gerais de Email

**Autenticacao obrigatoria (2025+):** SPF + DKIM + DMARC. Sem os 3: spam (Google/Yahoo exigem desde fev/2024).

**Email Warming:** Dominio novo: 2-3 semanas. Comecar 100-500/dia. Aumentar 15-20%/semana. Reclamacao < 0.1%.

**Metricas saudaveis:**

| Metrica | Bom | Critico |
|---------|-----|---------|
| Open rate | > 20% | < 10% |
| Click rate | > 2% | < 1% |
| Bounce rate | < 2% | > 5% |
| Spam complaint | < 0.05% | > 0.1% |

---

## 7. Paginas (Lovable)

### 7.1 Lovable

**O que e:** Builder AI-first. Descreve em linguagem natural, gera app web completo (React + Tailwind + Supabase).

**Stack gerado:** React, TypeScript, Tailwind CSS, Supabase (backend)

**Operacoes comuns:**
1. Alterar pagina: descrever mudanca no chat
2. Deploy: Publish > Update
3. Conectar dominio: Settings > Custom Domain > CNAME
4. Exportar codigo: GitHub integration

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| Build falha | Pedir pro Lovable corrigir no chat |
| Deploy nao atualiza | Hard refresh (Cmd+Shift+R) |
| Dominio nao funciona | Verificar CNAME, esperar propagacao |
| Clicks timeout via Playwright | `page.evaluate('(el) => el.click()')` — Radix UI bloqueia clicks normais |
| Publish dropdown nao abre | `dispatchEvent('click')` no botao de publish |

### 7.2 WordPress (secundario)

CMS + Elementor page builder. Usado pontualmente. REST API: `https://site/wp-json/wp/v2/`. WooCommerce API: `/wp-json/wc/v3/` (consumer key + secret). Plugins essenciais: Elementor Pro, WooCommerce, Yoast/RankMath, WP Rocket, Wordfence. Troubleshooting: WSOD = desativar plugins via FTP; site lento = cache + comprimir imagens.

---

## 8. Pagamento (Stripe — secundario)

API-first. Products, Prices, Checkout Sessions, Subscriptions, Webhooks. Base: `https://api.stripe.com/v1/`, Bearer Token. Webhooks principais: `checkout.session.completed`, `payment_intent.succeeded`, `customer.subscription.created/deleted`, `charge.refunded`. SEMPRE validar webhook signature. Idempotencia via event ID.

**Boas praticas gateway:** Validar signature, idempotencia, retry handling, sandbox pra testes, nunca armazenar dados de cartao.

---

## 9. Automacoes (N8N)

### 9.1 N8N

**O que e:** Automacao open-source, self-hosted. Workflows visuais. O mais poderoso e flexivel.

**Features core:**

| Feature | O que faz |
|---------|-----------|
| Webhooks | Trigger por HTTP request |
| 400+ nodes | Integracoes nativas |
| AI nodes | 70+ nodes de IA (LLMs, embeddings, vectors) |
| Code node | JavaScript/Python customizado |
| Error handling | Try/catch, retry, fallback |
| Self-hosted | Sem limite de execucao |

**Webhook node:** URL de producao ativa apos toggle "Active". URLs de teste vs producao sao diferentes.

**Nodes mais usados:**

| Node | Uso |
|------|-----|
| Webhook | Receber dados de Hotmart, Kiwify, Stripe |
| HTTP Request | Chamar APIs externas |
| IF / Switch | Condicional e roteamento |
| Set | Transformar/mapear dados |
| Code | JavaScript customizado |
| Supabase | CRUD no banco |
| Schedule | Cron job |

### 9.2 n8n REST API — Operacao de Workflows

**O que e:** API REST do n8n para criar, atualizar, ativar e monitorar workflows programaticamente.

**Base URL:** `{{N8N_URL}}/api/v1/`
**Autenticacao:** Header `X-N8N-API-KEY: {{N8N_API_KEY}}`

**Endpoints principais:**

| Endpoint | Metodo | O que faz |
|----------|--------|-----------|
| `/workflows` | GET | Listar todos os workflows |
| `/workflows` | POST | Criar workflow novo |
| `/workflows/{id}` | GET | Ler workflow especifico |
| `/workflows/{id}` | PUT | Atualizar workflow |
| `/workflows/{id}/activate` | POST | Ativar workflow |
| `/workflows/{id}/deactivate` | POST | Desativar workflow |
| `/executions` | GET | Listar execucoes |
| `/executions/{id}` | GET | Detalhe de execucao |

**Cache cycling (OBRIGATORIO apos PUT):**
```bash
# 1. Desativar
curl -X POST "{{N8N_URL}}/api/v1/workflows/{id}/deactivate" -H "X-N8N-API-KEY: {{KEY}}"
# 2. Reativar (com versionId do PUT)
curl -X POST "{{N8N_URL}}/api/v1/workflows/{id}/activate" -H "X-N8N-API-KEY: {{KEY}}"
```
Sem isso, n8n pode usar versao cacheada do workflow.

**Criar workflow via API:**
```bash
curl -X POST "{{N8N_URL}}/api/v1/workflows" \
  -H "X-N8N-API-KEY: {{KEY}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome do Workflow",
    "nodes": [...],
    "connections": {...},
    "settings": {"executionOrder": "v1"}
  }'
```

**ATENCAO:** Workflows com webhook criados via API NAO registram o webhook automaticamente. Criar via UI ou ativar/desativar para registrar.

**n8n Code node sandbox:** Sem fetch, sem URL, sem $http — usar `require('https')` nativo.

### 9.3 Patterns de Workflow para Dispatch

**Pattern: Dispatch agendado (cron → Cloud API)**
```
Schedule Trigger (cron) → Query Supabase (leads pendentes) →
  Loop cada lead → Set agent_id → Send Template (Cloud API) →
    Log resultado → Mark as sent
```

**Pattern: Dispatch via webhook (evento → Cloud API)**
```
Webhook (compra/captura) → Normalize payload →
  Check blacklist → Set agent_id → Send Template → Log
```

**Pattern: Dispatch em grupo (cron → Z-API)**
```
Schedule Trigger → Fetch group metadata (Z-API) →
  Build mentioned array → Send with @todos → Log
```

**Troubleshooting:**

| Problema | Solucao |
|----------|---------|
| Webhook nao recebe | Ativar toggle "Active" |
| URL diferente teste vs prod | Usar Production URL |
| Credencial falha | Recriar, verificar scopes |
| Workflow trava | Loop infinito ou payload grande |
| Code node bloqueado | Task runner sandbox (v2.0) — usar HTTP Request ou require() |

---

## 10. Integracoes Cross-Platform

### 10.1 Fluxos mais comuns

**Venda > Entrega > CRM:**
```
Hotmart webhook (PURCHASE_APPROVED)
  → N8N → ActiveCampaign (tag "comprador")
       → WhatsApp (flow boas-vindas)
       → Supabase (salvar dados)
```

**Captura de Lead:**
```
Landing Page → Form submit → N8N
  → ActiveCampaign (tag "lead")
  → WhatsApp (sequencia)
  → Meta CAPI (evento Lead)
```

**Tracking completo lancamento:**
```
Anuncio Meta (UTMs) → LP (Pixel + GTM)
  → Checkout Hotmart → PURCHASE_APPROVED
    → N8N → Meta CAPI (Purchase + event_id)
         → UTMify (venda com UTM)
         → ActiveCampaign (tag + automacao)
         → Supabase (dashboard)
```

### 10.2 Padroes de webhook

**Hotmart → N8N:** URL do N8N (production). Verificar hottok no header.
**Stripe → N8N:** SEMPRE validar stripe-signature. Event object com type + data.
**N8N → ActiveCampaign:** HTTP Request, `Api-Token` header, POST `/api/3/contacts`.
**N8N → WhatsApp Cloud API:** HTTP Request, Bearer Token (System User), POST `graph.facebook.com/v21.0/{phone_number_id}/messages`.
**N8N → Meta CAPI:** HTTP Request, Bearer Token, POST `graph.facebook.com/v18.0/{pixel_id}/events`.

---

## 11. Decision Trees

### 11.1 Playwright vs MCP vs API direta

```
API documentada? → SIM → API direta (mais rapida, mais confiavel)
                → NAO → Interface web? → SIM → Playwright
                                       → NAO → MCP server
```

**Regra:** API > MCP > Playwright. Sempre preferir a camada mais estavel.

### 11.2 Webhook vs API polling

```
Plataforma suporta webhooks? → SIM → Webhook (tempo real)
                             → NAO → Polling (schedule N8N)
Webhook pode falhar? → SIM → Polling como fallback (reconciliacao)
```

### 11.3 Qual canal de disparo WhatsApp usar

```
"Disparo WhatsApp" — Pra QUEM?
│
├─ INDIVIDUO (template → 1 pessoa por vez, em massa via loop)
│  ├─ Imediato/unitario → Cloud API direto (Graph API)
│  └─ Programado em ciclo de campanha → Dispatcher (JSON config + WF-DISPATCHER)
│
├─ GRUPO (mensagem no grupo WhatsApp inteiro)
│  ├─ Imediato/unitario → Z-API com @todos (mencao verde)
│  └─ Programado em ciclo de campanha → Dispatcher (tipo=grupo)
│
└─ CRIAR GRUPO/COMUNIDADE
   └─ Via Z-API (+ Grupify opcional pra redirect inteligente)
```

---

## 12. Transcricao (MacWhisper)

**REGRA: SEMPRE usar MacWhisper app, NUNCA whisper CLI.**

```bash
# Transcrever
open -a MacWhisper arquivo1.mp3 arquivo2.m4a

# Extrair resultado
DB="$HOME/Library/Application Support/MacWhisper/Database/main.sqlite"
sqlite3 "$DB" "SELECT fullText FROM session WHERE originalFilename LIKE '%nome%' ORDER BY createdAt DESC LIMIT 1;"
```

---

## 13. Troubleshooting Geral

### 13.1 Webhook Failures

| Sintoma | Solucao |
|---------|---------|
| Nao chega | Testar com webhook.site, verificar URL |
| Chega atrasado | Normal ate 5 min (fila de retry) |
| Duplicado | Idempotencia (guardar ID, ignorar repetido) |
| Dados errados | Docs mudaram — re-mapear |
| Timeout | Responder 200 imediatamente, processar async |

**Boas praticas:** Responder 2xx rapido, idempotencia via event ID, validar signature, logar tudo, polling como fallback.

### 13.2 API Rate Limits

| Plataforma | Limite | Estrategia |
|-----------|--------|-----------|
| Meta Graph API | 200/user/hour | Batch, cache |
| ActiveCampaign | 5 req/s | Queue + delay |
| WhatsApp Cloud API | ~80 msg/s (respeita tier diario) | Respeitar 429 + backoff |
| Hotmart | ~60 req/min | Queue + delay |
| Supabase | Free: 500 req/min | Otimizar queries |

**Estrategia 429:** Detectar → Ler Retry-After → Esperar + jitter → Retry exponential backoff (1s, 2s, 4s...) → Max 3-5 tentativas.

### 13.3 DNS / SSL / Email

**DNS nao resolve:** whatsmydns.net + verificar registros. Flush local: `sudo dscacheutil -flushcache`.
**SSL invalido:** Renovar cert (EasyPanel renova automatico). Verificar DNS aponta pro servidor.
**Email spam:** SPF + DKIM + DMARC. Diagnostico: https://www.mail-tester.com/
**CORS:** Adicionar headers no servidor. `Access-Control-Allow-Origin: *` pra Edge Functions.

---

## 14. Scripts & Automacao

### 14.1 Blacklist de Contatos (Opt-Out)

**Arquivo:** `scripts/blacklist.json` — array de telefones normalizados no formato `55DDDNUMERO`

**Fonte unica de verdade.** Todo script/workflow de disparo carrega esse arquivo e checa por lead antes de enviar.

**Checagem no codigo:**
```javascript
import { readFileSync } from "fs";
const bl = JSON.parse(readFileSync("scripts/blacklist.json", "utf-8"));
const BLACKLIST = new Set(bl.phones || []);
if (BLACKLIST.has(phone)) { /* bloquear */ }
```

**Blacklist e cumulativa** — nunca remover sem autorizacao explicita.

### 14.2 Batch Operations (N8N pattern)

```
Trigger → Google Sheets (ler lista) → Split In Batches (50) → HTTP Request → Wait (1s) → Log
```

### 14.3 Health Checks

**Uptime Kuma (via EasyPanel):** Monitora sites, APIs, servidores. Alertas por email/Slack/webhook.

**Health check basico N8N:** Schedule (5 min) → GET site → IF status != 200 → Notificar.

**Monitorar SSL:** `echo | openssl s_client -connect dominio.com:443 2>/dev/null | openssl x509 -noout -dates`

### 14.4 Cron

| Expressao | Quando |
|-----------|--------|
| `*/5 * * * *` | A cada 5 min |
| `*/30 * * * *` | A cada 30 min |
| `0 9 * * *` | Todo dia 9h |
| `0 3 * * *` | Todo dia 3h AM (backup) |

**N8N:** Schedule Trigger node. **Supabase:** pg_cron extension.

---

*Gestor de Infra Arcane — Foundation KB v1.0 — Pronta para instalacao*
