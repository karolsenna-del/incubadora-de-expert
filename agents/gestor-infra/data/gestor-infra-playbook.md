# Gestor de Infra Arcane — Playbook

> SOPs e procedures. Cresce a cada missao documentada.
> Consultar ANTES de iniciar qualquer missao. Se ja tem SOP, seguir.
> **Regras operacionais:** ver `gestor-infra-rules.md` (arquivo separado, carregado no start).

---

## Indice de SOPs

### Tier 1 — Recorrentes (todo ciclo de evento)
1. [SOP-008] Shift de Evento — Trocar data do proximo evento
2. [SOP-010] Auditoria Pipeline WhatsApp
3. [SOP-011] Z-API + Grupify — Disparo WhatsApp em grupo com @todos
4. [SOP-015] Disparar template Cloud API (unitario ou em massa)

### Tier 2 — Sob demanda
5. [SOP-007] Hotmart — Criar oferta alternativa
6. [SOP-005] Gerenciar Blacklist de Contatos
7. [SOP-013] Criar comunidade WhatsApp via Z-API + Grupify
8. [SOP-014] Submeter template Cloud API (criar/aprovar na Meta)
9. [SOP-016] Operar workflow n8n de dispatch (agendado ou webhook)
10. [SOP-017] Manutencao de prompt de agente Bia (trocar data, link, texto)
11. [SOP-003] Instalar Microsoft Clarity em pagina Lovable

> **Fora do escopo:** Setup inicial do pipeline (instalar n8n + Chatwoot, criar tabelas Supabase + RPCs, configurar Meta Business Manager, gerar System User Token, importar os workflows core WF-INBOUND/AGENT-CORE/OUTBOUND). Isso e responsabilidade do **agente de setup** — outro agente dedicado. Este squad so opera o pipeline ja instalado.

### Tier 3 — One-shot (executado, arquivo)
(Vazio — SOPs one-shot serao arquivados aqui conforme executados)

---

## Arvore de Decisao — Disparo WhatsApp

> Consultar ANTES de escolher qual SOP usar. O tipo de destinatario define o caminho.

```
"Disparo WhatsApp" — Pra QUEM?
│
├─ INDIVIDUO (template → 1 pessoa por vez, em massa via loop)
│  ├─ Imediato/unitario → Cloud API direto → SOP-015
│  └─ Programado em ciclo → WF-DISPATCHER → SOP-016
│
├─ GRUPO (mensagem no grupo WhatsApp inteiro)
│  └─ Via Z-API — com @todos (mencao verde) → SOP-011
│
└─ CRIAR GRUPO/COMUNIDADE
   └─ Via Z-API + Grupify → SOP-013
```

---

## Arvore de Decisao — Criar workflow n8n

> Consultar ANTES de criar workflow. O tipo de disparo define a arquitetura.

```
"Workflow n8n" — Qual TRIGGER?
│
├─ AGENDADO (cron — disparo recorrente)
│  └─ Schedule Trigger → Query base → Loop → Dispatch → Log → SOP-016
│
├─ EVENTO (compra, captura, formulario)
│  └─ Webhook → Normalize → Dispatch → Log → SOP-016
│
└─ MANUAL (usuario pede)
   └─ Script local → SOP-004 ou SOP-015
```

---

## Tier 1 — Recorrentes

### [SOP-008] Shift de Evento — Trocar data pro proximo evento
**Trigger:** Evento atual acabou (ou vai acabar) e precisa comecar a vender o proximo
**Tempo estimado:** 15-45 min
**Ferramentas:** n8n REST API, Playwright (page builder + plataforma), Editor de texto

**Pre-requisitos:**
- Data do proximo evento definida
- Acesso: n8n API (ver Vault), page builder, plataforma de produto
- Definir: evento atual ja acabou ou nao (decide se pausa onboarding)

---

**FASE 1 — Pausa do Onboarding (so se evento ainda nao acabou)**

1. Desabilitar node de dispatch de boas-vindas no workflow de compras via n8n API
   - Seta `dispatchNode.disabled = true` + PUT + cache cycling
   - Compras continuam sendo registradas no banco — so o envio do template para

---

**FASE 2 — Paginas de Vendas**

> **CRITICO:** Se existem MULTIPLOS projetos/paginas, AMBOS precisam ser atualizados.

2. Acessar page builder
3. Trocar TODAS as ocorrencias da data antiga pela nova
4. Publicar e conferir em producao

---

**FASE 3 — Plataforma de Produto (Hotmart/Kiwify)**

5. Produtos: remover/trocar data na descricao
6. Area de Membros > Cronograma — trocar data

---

**FASE 3B — Nova comunidade WhatsApp + Formularios**

7. Criar nova comunidade pro ciclo: **seguir SOP-013** (Z-API + Grupify)
8. Atualizar formularios (Tally, pagina obrigado) pra apontar pro novo redirect

---

**FASE 4 — Prompts dos agentes no n8n**

> **SO EXECUTAR QUANDO O EVENTO ATUAL JA ACABOU**

9. Trocar datas nos prompts via n8n API
   - **REGRA-012 OBRIGATORIA:** Antes do PUT, salvar codigo e rodar `node -c arquivo.js`
   - Verificar: 0 ocorrencias data antiga, N ocorrencias data nova, workflow active=true
   - Monitorar primeiras 3 execucoes

10. Atualizar arquivos locais de referencia (prompts, templates)

---

**FASE 5 — Copies de Disparos**

11. Atualizar copies de disparo:
    - Replace all datas, recalcular cronograma, resetar status pra PENDENTE

---

**FASE 6 — Reativar Onboarding + Retroativo (so se pausou)**

12. Re-habilitar node de dispatch: `disabled = false` + PUT + cache cycling
13. Rodar disparo retroativo pra quem comprou durante pausa (SOP-004)

---

**FASE 7 — Templates WhatsApp (se tiverem data hardcoded)**

14. Checar templates Meta: se tem data hardcoded, submeter novo template
15. Aprovacao Meta: 24-72h

---

**Checklist final — OBRIGATORIO a cada ciclo:**
- [ ] Paginas de vendas com data nova (conferir em producao)
- [ ] Plataforma de produto sem data antiga
- [ ] Area de membros — Cronograma com data nova
- [ ] Prompts dos agentes com data nova no n8n
- [ ] Arquivos locais atualizados
- [ ] Onboarding ativo (Dispatch enabled)
- [ ] Retroativo disparado (se houve pausa)
- [ ] Nova comunidade/grupo WhatsApp via Z-API (SOP-013)
- [ ] Redirect Grupify criado e verificado
- [ ] Formularios atualizados (Tally ou similar)
- [ ] Arquivo do ciclo criado

**Troubleshooting:**
- Page builder nao publica: Publish > Update. Se nao aparece, usar chat
- Plataforma "pagina nao encontrada": Trocar conta / Central de Colaboradores
- n8n prompt nao surtiu: Cache cycling nao foi feito
- Agente responde data antiga: Verificar cache cycling + agent_id do contato
- Template Meta rejeitado: Variavel nao pode ser primeira palavra do body

---

### [SOP-010] Auditoria Pipeline WhatsApp
**Trigger:** "confere se ta tudo funcionando", "auditoria pipeline", "como ta o agente"
**Tempo estimado:** 5-10 min
**Ferramentas:** n8n REST API, Supabase REST API

**Pre-requisitos:** Acesso n8n API e Supabase service role (ver Vault)

**Passos:**

#### 1. Recovery/Cron — ta rodando?
- Verificar cron/schedule ativo
- Checar logs recentes, sem erros
- Banco: registros distribuidos, status correto

#### 2. Boas-vindas — ta disparando?
- Banco: compras recentes do produto
- n8n: execucoes do workflow de compras — todas "success"
- Checar output do dispatch: `"sent"` pra produto principal

#### 3. Cruzamento — tem gap?
- Capturas MINUS compradores MINUS ja contatados = gap real
- Gap = 0 (ou so leads recentes no cooldown) = ok

#### 4. Pipeline n8n — erros?
- Execucoes ultimas 24h: filtrar por `status === 'error'`
- Workflows criticos ativos (ver KB)

**Troubleshooting:**
- Cron parado: verificar schedule, checar path node
- Boas-vindas "failed": Dispatch node habilitado? API key valida?
- Gap no cruzamento: Investigar (lead recorrente ou duplicata)

---

### [SOP-011] Z-API + Grupify — Disparo WhatsApp com @todos e redirect inteligente
**Trigger:** "disparo grupo/comunidade", "mandar mensagem com mencao"
**Tempo estimado:** 2-5 min por disparo
**Regras obrigatorias:** REGRA-002 (blacklist), REGRA-CRITICA (community-pai vs announcement group)

**Credenciais:** ver Vault (Z-API + Grupify)

#### Disparo imediato (script local)
```bash
node scripts/zapi-dispatch.mjs \
  --phones "ID-DO-GRUPO-group" \
  --message "Texto da mensagem"
```
- Multiplos grupos: `--phones "grupo1,grupo2,grupo3"`
- Delay entre grupos (default 3s): `--delay 5000`

#### Disparo agendado
```bash
node scripts/zapi-dispatch.mjs \
  --phones "ID-group" --message "Texto" \
  --schedule "2026-03-28T09:00:00-03:00"
```

#### Disparo via n8n (webhook)
```bash
curl -X POST {{N8N_URL}}/webhook/{{WF_ZAPI_DISPATCH_PATH}} \
  -H "Content-Type: application/json" \
  -d '{"phones": ["ID-grupo"], "message": "Texto"}'
```

#### Checklist pre-disparo
1. Confirmar phone ID — **se comunidade, usar ANNOUNCEMENT GROUP ID** (ver REGRA-CRITICA no rules.md)
2. Confirmar numero conectado (app.z-api.io > instancia > status)
3. Conferir copy com placeholders substituidos
4. Se producao: NAO testar na comunidade real (usar lab)
5. Se agendado: confirmar timezone

#### Validacao pos-disparo (OBRIGATORIO)
6. Checar mencionados no output — **se < 10 em grupo de producao, algo ta errado**
7. Pedir pro usuario confirmar no celular

---

## Tier 2 — Sob demanda

### [SOP-007] Hotmart — Criar oferta alternativa (preco fixo)
**Trigger:** Link de venda com preco diferente do base
**Tempo estimado:** 5 min

**Passos:**
1. Produto > Precificacao e ofertas > Novo preco
2. Nome descritivo + valor, **SEMPRE "Parcelado com taxas para seu cliente"**
3. Recuperador automatico: ativar + checkbox
4. Salvar > anotar codigo
5. Link: `https://pay.hotmart.com/{{CHECKOUT_ID}}?off={{CODIGO}}&checkoutMode=10`

**REGRAS CRITICAS:** Forma de pagamento imutavel. checkoutMode=10 obrigatorio pra order bumps.

---

### [SOP-005] Gerenciar Blacklist de Contatos (Opt-Out)
**Trigger:** Contato pede pra nao receber / reclamacao / LGPD
**Tempo estimado:** 2 min

**Passos:**
1. Normalizar telefone: `+55XXXXXXXXXXX`
2. Adicionar em `scripts/blacklist.json`
3. Plataforma de automacao: buscar subscriber > aplicar tag `NAO_ENVIAR`

Blacklist e cumulativa — nunca remover sem autorizacao.

---

### [SOP-013] Criar comunidade WhatsApp via Z-API + Grupify
**Trigger:** "cria comunidade", "novo grupo pro ciclo", "prepara WhatsApp pra proximo evento"
**Tempo estimado:** 10-15 min
**Ferramentas:** Z-API (API), Grupify (API + Playwright), Playwright (validacao)
**Regras obrigatorias:** REGRA-CRITICA (community-pai vs announcement group)

**Pre-requisitos:**
- Z-API instancia conectada (ver Vault)
- Grupify conta ativa (ver Vault)
- Nome e descricao da comunidade definidos
- Imagem/foto da comunidade pronta (obrigatoria — nao da pra alterar depois)

**Passos:**

#### 1. Criar comunidade via Z-API
```bash
curl -X POST "https://api.z-api.io/instances/{{INSTANCE_ID}}/token/{{TOKEN}}/communities" \
  -H "Content-Type: application/json" -H "Client-Token: {{CLIENT_TOKEN}}" \
  -d '{"name": "Nome da Comunidade", "description": "Descricao", "image": "URL_DA_FOTO"}'
```
- **FOTO OBRIGATORIA no POST** — depois de criada, NAO da pra alterar
- Anotar o `communityId` retornado

#### 2. Identificar o Announcement Group ID
```bash
curl -s "https://api.z-api.io/instances/{{INSTANCE_ID}}/token/{{TOKEN}}/groups" \
  -H "Client-Token: {{CLIENT_TOKEN}}" | python3 -c "
import json, sys
for g in json.load(sys.stdin):
    if g.get('isGroupAnnouncement'):
        print(f\"{g.get('phone')} | {g.get('name')}\")"
```
- **Anotar o phone do announcement group** — este e o ID pra disparos (NUNCA o community-pai)

#### 3. Criar redirect no Grupify
```bash
# Login
TOKEN=$(curl -s -X POST "https://www.grupify.com.br/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"{{GRUPIFY_EMAIL}}","password":"{{GRUPIFY_PASS}}"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['token'])")

# Criar redirector
curl -s -X POST "https://www.grupify.com.br/api/redirectors" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"{{EVENTO_NOME}} {{DATA}}","slug":"{{SLUG}}","maxSlots":1024,"algorithm":"RANDOM","autoUpdateParticipants":true}'
```
- URL final: `https://www.grupify.com.br/r/{{SLUG}}`

#### 4. Adicionar grupo no Grupify (via Playwright — API bugada)
- Abrir `grupify.com.br/dashboard` via Playwright
- Navegar ate o redirector criado
- Adicionar grupo: nome, link WhatsApp do announcement group, vagas

#### 5. Validar tudo
- Acessar URL do Grupify via Playwright — verificar redirect
- Testar envio pro announcement group ID via Z-API
- Anotar IDs no Vault

**Troubleshooting:**
- Comunidade sem foto: Nao da pra adicionar depois. Deletar e recriar
- Mensagem nao aparece: Provavelmente enviou pro community-pai
- Grupify retorna 500 no POST /api/groups: Bug conhecido. Usar Playwright
- Redirect nao funciona: WebFetch nao renderiza JS. Testar via Playwright

---

### [SOP-014] Submeter template Cloud API (criar/aprovar na Meta)
**Trigger:** Precisa de template novo pra WhatsApp Cloud API

**Conceito:** Template = modelo de mensagem aprovado pela Meta. Cria UMA VEZ, usa pra sempre (com variaveis).

**Passos:**

#### 1. Upload do video exemplo (se tiver midia no header)
```bash
APP_ID="{{META_APP_ID}}"
SESSION=$(curl -s -X POST "https://graph.facebook.com/v21.0/$APP_ID/uploads" \
  -H "Authorization: Bearer {{CLOUD_API_TOKEN}}" \
  -F "file_length=$(stat -f%z video.mp4)" \
  -F "file_type=video/mp4" \
  -F "file_name=video.mp4" | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")

HANDLE=$(curl -s -X POST "https://graph.facebook.com/v21.0/$SESSION" \
  -H "Authorization: OAuth {{CLOUD_API_TOKEN}}" \
  -H "file_offset: 0" \
  --data-binary @video.mp4 | grep -o '"h":"[^"]*"' | head -1 | cut -d'"' -f4)
```

#### 2. Submeter template
```bash
curl -s -X POST "https://graph.facebook.com/v21.0/{{WABA_ID}}/message_templates" \
  -H "Authorization: Bearer {{CLOUD_API_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "{{TEMPLATE_NAME}}",
    "language": "pt_BR",
    "category": "MARKETING",
    "components": [
      {"type": "HEADER", "format": "VIDEO", "example": {"header_handle": ["{{HANDLE}}"]}},
      {"type": "BODY", "text": "Texto com {{1}} variaveis {{2}}", "example": {"body_text": [["exemplo1", "exemplo2"]]}},
      {"type": "BUTTONS", "buttons": [{"type": "QUICK_REPLY", "text": "Texto do botao"}]}
    ]
  }'
```

#### 3. Aguardar aprovacao
- Templates simples: minutos. Com video: minutos a horas
- Verificar: `GET /{{WABA_ID}}/message_templates?name={{TEMPLATE_NAME}}`

**Regras Meta pra aprovacao:**
- Variaveis NAO podem estar no inicio ou fim do body
- Exemplos obrigatorios pra cada variavel
- Video header precisa do `header_handle` (Resumable Upload), NAO URL direta
- Nomes de template em quarentena 4 semanas apos deletar

---

### [SOP-015] Disparar template Cloud API (unitario ou em massa)
**Trigger:** Enviar template aprovado pra leads via Cloud API

**2 regras criticas:**
1. **SEMPRE setar `active_agent_id` no banco ANTES de enviar** (REGRA-001). Sem isso, o agente carrega prompt errado.
2. **SEMPRE usar media ID** (upload previo) pra templates com video/imagem. NUNCA URL direta.

#### 0. Setar agent_id (OBRIGATORIO)
```bash
curl -s -X PATCH "{{SUPABASE_URL}}/rest/v1/{{CONTACTS_TABLE}}?phone=eq.{{TELEFONE}}" \
  -H "apikey: {{SUPABASE_SERVICE_KEY}}" \
  -H "Authorization: Bearer {{SUPABASE_SERVICE_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"active_agent_id": "{{AGENT_ID}}"}'
```

#### 1. Upload video (se template tem midia)
```bash
MEDIA_ID=$(curl -s -X POST "https://graph.facebook.com/v21.0/{{PHONE_NUMBER_ID}}/media" \
  -H "Authorization: Bearer {{CLOUD_API_TOKEN}}" \
  -F "messaging_product=whatsapp" \
  -F "type=video/mp4" \
  -F "file=@/caminho/do/video.mp4;type=video/mp4" | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
```
- **OBRIGATORIO:** `;type=video/mp4` no campo file
- Media ID dura ~30 dias

#### 2. Enviar template
```bash
curl -s -X POST "https://graph.facebook.com/v21.0/{{PHONE_NUMBER_ID}}/messages" \
  -H "Authorization: Bearer {{CLOUD_API_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "{{TELEFONE}}",
    "type": "template",
    "template": {
      "name": "{{TEMPLATE_NAME}}",
      "language": {"code": "pt_BR"},
      "components": [
        {"type": "header", "parameters": [{"type": "video", "video": {"id": "{{MEDIA_ID}}"}}]},
        {"type": "body", "parameters": [{"type": "text", "text": "{{VAR1}}"}, {"type": "text", "text": "{{VAR2}}"}]}
      ]
    }
  }'
```

**Disparo em massa:**
```
Para cada lead na lista:
  1. PATCH agent_id no banco (por lead)
  2. Send template (mesmo media_id pra todos)
  3. Delay 1.5s entre envios (rate limit conservador)
```

**Erros comuns:**
- `Param file must be a file with one of the following types...` → Faltou `;type=video/mp4` no upload
- `header component parameter should not be empty` → Template tem header de midia mas nao enviou component header
- Template aceito mas nao entregue → media ID expirado. Re-uplodar
- Agente responde com prompt errado → Esqueceu REGRA-001 (PATCH agent_id antes do disparo)

---

### [SOP-016] Operar workflow n8n de dispatch (agendado ou webhook)
**Trigger:** "dispara a campanha", "agenda o disparo", "pausa o workflow", "muda o horario do cron", "workflow ta falhando"
**Tempo estimado:** 5-10 min
**Ferramentas:** n8n REST API, Supabase (consulta resultados)
**Regras obrigatorias:** REGRA-001 (agent_id), REGRA-002 (blacklist), REGRA-012 (validar JS em qualquer alteracao de Code node)

**Pre-requisitos:**
- Workflow de dispatch ja criado e instalado pelo agente de setup
- n8n acessivel (ver Vault — URL + API key)
- Supabase acessivel (ver Vault — URL + service_role key)

**Escopo:** Este SOP cobre **operar** workflows de dispatch que ja existem (foram instalados pelo agente de setup). Nao cobre criar workflow novo. Se precisa criar um workflow novo do zero, isso e escopo do agente de setup.

**Tipos de workflow de dispatch que o operador vai encontrar:**

| Tipo | Trigger | Uso tipico |
|------|---------|-----------|
| **Cron** | Schedule (a cada X minutos/horas) | Recovery loop, sync periodico, retry de falhas |
| **Webhook** | Evento (compra, captura, formulario) | Onboarding pos-compra, disparo on-event |
| **Dispatcher generico** | Le config de JSON no repo | Campanhas programadas (ver secao Dispatcher do KB) |

---

#### B1. Monitorar execucoes

```bash
# Ultimas 10 execucoes de um workflow
curl -s "{{N8N_URL}}/api/v1/executions?workflowId={{WF_ID}}&limit=10" \
  -H "X-N8N-API-KEY: {{N8N_API_KEY}}" | python3 -c "
import json,sys
for e in json.load(sys.stdin)['data']:
    print(f\"{e['id']} | {e['status']} | {e.get('startedAt','?')}\")"
```

**Status saudavel:** todas as ultimas 10 com `success`. Se aparecer `error`, investigar (B4).

---

#### B2. Pausar / resumir workflow

**Pausar (ex: bug em producao, disparo errado em andamento):**
```bash
curl -X POST "{{N8N_URL}}/api/v1/workflows/{{WF_ID}}/deactivate" \
  -H "X-N8N-API-KEY: {{KEY}}"
```

**Resumir:**
```bash
curl -X POST "{{N8N_URL}}/api/v1/workflows/{{WF_ID}}/activate" \
  -H "X-N8N-API-KEY: {{KEY}}"
```

**ATENCAO:** `PATCH {"active":false}` NAO funciona em workflows com webhook. Usar `/deactivate` + `/activate` com versionId (REGRA-005).

---

#### B3. Alterar parametros do workflow (schedule, template, filtro)

O operador **pode** ajustar parametros de um workflow existente — mudar horario do cron, trocar template, ajustar filtro de query — sem recriar o workflow.

**Procedimento:**
1. **GET** workflow atual:
   ```bash
   curl -s "{{N8N_URL}}/api/v1/workflows/{{WF_ID}}" \
     -H "X-N8N-API-KEY: {{KEY}}" > /tmp/wf-backup.json
   ```
2. **Salvar backup** localmente (`/tmp/wf-backup.json`) — se algo der errado, roll back
3. **Editar o JSON** com os parametros novos. Campos tipicos:
   - Schedule Trigger → `parameters.rule.interval`
   - HTTP Request → `parameters.bodyParameters` (trocar template name, phone_number_id)
   - Supabase query → `parameters.filters.conditions`
   - Code node → `parameters.jsCode` (cuidado — REGRA-012)
4. **Se alterou Code node:** salvar o jsCode em arquivo separado e rodar:
   ```bash
   node -c /tmp/codigo-novo.js
   ```
   Se der `SyntaxError` → NAO fazer PUT. Corrigir primeiro.
5. **PUT** workflow atualizado:
   ```bash
   curl -X PUT "{{N8N_URL}}/api/v1/workflows/{{WF_ID}}" \
     -H "X-N8N-API-KEY: {{KEY}}" \
     -H "Content-Type: application/json" \
     -d @/tmp/wf-editado.json
   ```
6. **Cache cycling OBRIGATORIO** (REGRA-005): deactivate → get novo versionId → activate
7. **Monitorar** primeiras 3 execucoes apos o update (B1)

**Se alteracao nao surtiu efeito:** cache cycling nao foi feito. Repetir passo 6.

---

#### B4. Diagnosticar falhas

```bash
# Detalhe de execucao com erro
curl -s "{{N8N_URL}}/api/v1/executions/{{EXEC_ID}}" \
  -H "X-N8N-API-KEY: {{KEY}}" | python3 -c "
import json,sys
data = json.load(sys.stdin)
print(f\"Status: {data['status']}\")
print(f\"Node: {data.get('data',{}).get('resultData',{}).get('lastNodeExecuted','?')}\")
print(f\"Error: {data.get('data',{}).get('resultData',{}).get('error',{}).get('message','N/A')}\")"
```

**Erros comuns em workflows de dispatch:**

| Erro | Causa provavel | Fix |
|------|---------------|-----|
| `401 Unauthorized` (Graph API) | Token Cloud API expirado | Regenerar System User Token na Meta Business Manager + atualizar credencial no n8n |
| `400 template not found` | Nome do template errado ou nao aprovado | `GET /{WABA_ID}/message_templates` — verificar nome exato + status APPROVED |
| `131047 Rate limit` | Muitos envios por minuto | Aumentar delay entre envios (min 1.5s, conservador 3s) |
| `131026 Invalid phone` | Phone em formato errado | Normalizar pra `55DDDNUMERO` so digitos (REGRA-013) |
| `SyntaxError` no Code node | JS invalido inserido via PUT | REGRA-012 — validar com `node -c` antes |
| Workflow nao executa (status idle) | Toggle Active desligado ou cache antigo | Cache cycling (REGRA-005) |
| Execucao fica eternamente em running | Loop infinito ou timeout de sub-workflow | Pausar workflow + investigar Code nodes com loops |
| Bia respondeu errado depois do dispatch | `active_agent_id` nao setado antes do envio | REGRA-001 — PATCH agent_id ANTES do POST pra Graph API |

---

#### B5. Disparo manual pontual (fora do cron/webhook)

Quando precisa disparar imediatamente sem esperar o cron, sem usar webhook — tipo "manda esse template pra esse lead agora":

**Opcao 1 — Trigger manual no n8n UI:**
1. Abrir workflow no n8n → botao "Execute Workflow"
2. Passar payload se for trigger webhook
3. Ver output nas execucoes

**Opcao 2 — Script direto (SOP-015):**
- Mais rapido pra disparos unicos ou teste
- Bypass do workflow — usa `PATCH agent_id` + `POST Graph API` direto
- Ver SOP-015 pra procedimento completo

---

**Checklist de operacao:**
- [ ] Monitorar execucoes apos qualquer disparo ou alteracao
- [ ] Backup do workflow antes de qualquer PUT
- [ ] `node -c` se alterou Code node (REGRA-012)
- [ ] Cache cycling depois de PUT (REGRA-005)
- [ ] Validar 3 primeiras execucoes pos-alteracao
- [ ] Se erro sistemico: pausar workflow + BUGLOG (REGRA-005)

---

### [SOP-017] Manutencao de prompt de agente (trocar data, link, texto)
**Trigger:** "atualiza o prompt da Bia", "troca a data do evento no prompt", "muda o link de checkout", "ajusta o tom do {agente}"
**Tempo estimado:** 10-20 min
**Ferramentas:** Editor de texto, Node.js (pra validar JS), n8n REST API
**Regras obrigatorias:** REGRA-001, REGRA-005 (cache cycle), REGRA-012 (validar JS), REGRA-015 (override data se mexeu em data de evento)

**Escopo:** Alteracao de prompts L3 dos agentes Bia que rodam no node "Configuracao do Agente" do `WF-AGENT-CORE-CLOUD` (ou nome equivalente). Cobre troca de data, link, texto, tom, regras — sem recriar o agente ou criar agente novo.

**Arquitetura importante:**
- Os prompts L3 ficam em 2 lugares:
  1. **Arquivo local** (fonte de verdade) — ex: `business/agente/bia-{agente}/prompt-l3.md`
  2. **Runtime n8n** — node "Configuracao do Agente" do WF-AGENT-CORE-CLOUD, como string JavaScript escapada dentro de um objeto `AGENT_L3`
- Toda alteracao segue o fluxo: **edita arquivo local → deploy no n8n via script → valida → cache cycle → monitora**

**Casos comuns:**

| Caso | O que mudar | Onde mexer |
|------|-------------|------------|
| Troca data do evento | Bloco `<data_evento>` (REGRA-015) | Arquivo local + todos os prompts com data |
| Troca link de checkout | URL do Hotmart (manter `&sck=bia-{agente}` — REGRA-009) | Arquivo local do agente afetado |
| Ajusta tom/estilo | Secoes de exemplo, regras de formatacao | Arquivo local do agente afetado |
| Adiciona instrucao nova | Nova regra ou bloco | Arquivo local do agente afetado |
| Remove instrucao | Secao obsoleta | Arquivo local do agente afetado |

---

#### Passo a passo

##### 1. Editar arquivo local do prompt

```bash
# Localizar o arquivo
ls business/agente/bia-*/prompt-l3*.md

# Editar
$EDITOR business/agente/bia-{agente}/prompt-l3.md
```

**Regras ao editar:**
- [ ] NUNCA mencionar preco absoluto (REGRA — preco vive no link, nao no prompt)
- [ ] Todo link de checkout com `&sck=bia-{agente}` (REGRA-009)
- [ ] Se mexeu em data de evento: bloco `<data_evento>` com override explicito (REGRA-015)
- [ ] Usar crase (backtick) ou estrutura `<tag>` pra delimitar secoes, nunca aspas simples soltas no meio do texto

##### 2. Preparar o script de deploy

Criar arquivo temporario `/tmp/update-prompt.js`:

```javascript
const fs = require('fs');
const https = require('https');

// 1. Ler prompt do arquivo local
const novoPrompt = fs.readFileSync('business/agente/bia-{agente}/prompt-l3.md', 'utf-8');

// 2. Escapar pra string JS (CRITICO — REGRA-012)
const promptEscapado = JSON.stringify(novoPrompt).slice(1, -1);
// slice(1, -1) remove as aspas externas que JSON.stringify adiciona

// 3. GET workflow atual
// 4. Localizar node "Configuracao do Agente"
// 5. Substituir AGENT_L3['bia-{agente}'] = '...' pelo promptEscapado
// 6. VALIDAR sintaxe ANTES do PUT
try {
  new Function(codigoNovoCompleto);
} catch (e) {
  throw new Error('BLOQUEADO: JS invalido - ' + e.message);
}
// 7. PUT workflow
// 8. Cache cycling (deactivate + activate)
```

**ATENCAO:** Passo 6 (validacao) e INEGOCIAVEL. Se nao compilar, NAO fazer PUT. Sem excecao.

##### 3. Executar o deploy

```bash
node /tmp/update-prompt.js
```

Se rodou sem erro → prompt atualizado no n8n.
Se deu `BLOQUEADO: JS invalido` → corrigir o arquivo local e rodar de novo.

##### 4. Cache cycling (OBRIGATORIO — REGRA-005)

```bash
# Deactivate
curl -X POST "{{N8N_URL}}/api/v1/workflows/{{WF_AGENT_CORE_ID}}/deactivate" \
  -H "X-N8N-API-KEY: {{KEY}}"
# Activate
curl -X POST "{{N8N_URL}}/api/v1/workflows/{{WF_AGENT_CORE_ID}}/activate" \
  -H "X-N8N-API-KEY: {{KEY}}"
```

Sem isso, n8n pode continuar usando o prompt cacheado (REGRA-005). Incidente real: tech-ops achou que o prompt tinha sido atualizado, mas primeira execucao usou versao antiga. Descobriu o bug 6h depois.

##### 5. Smoke test

1. Mandar msg de teste pro numero (de um contato seu em que voce setou `active_agent_id = bia-{agente}`)
2. Verificar: resposta usa o texto novo (data nova, link novo, etc.)
3. Checar execucao no n8n: deve estar `success`
4. Checar logs em `{prefixo}_quality_monitoring` se disponivel

##### 6. Monitorar primeiras 3 execucoes reais

Primeiras 3 respostas da Bia em producao apos o deploy devem ser validadas. Se alguma der erro ou resposta estranha → rollback.

**Rollback:**
1. Editar arquivo local pra versao anterior (ou `git checkout` se estava commitado)
2. Rodar script de deploy de novo
3. Cache cycling
4. Validar

---

**Erros comuns:**

| Erro | Causa | Fix |
|------|-------|-----|
| `SyntaxError` ao executar script | Prompt com aspas simples soltas, newlines mal escapados | Validacao com `new Function()` ja bloqueia. Corrigir arquivo local |
| Prompt atualizado mas Bia continua com texto antigo | Cache cycling nao foi feito | Repetir passo 4 |
| Bia falando data antiga mesmo com prompt novo | Contexto residual em `bia_agent_context` + faltou bloco `<data_evento>` override | REGRA-015 — bloco de override + limpar contexto dos leads afetados |
| Bia responde com prompt generico (`bia` triage) | `active_agent_id` nao setado no contato de teste | PATCH `active_agent_id` antes do teste (REGRA-001) |
| Workflow inteiro parou de funcionar depois do deploy | JS invalido passou a validacao (bug raro) | Rollback imediato pro backup anterior + BUGLOG (REGRA-005) |

---

**Checklist:**
- [ ] Arquivo local editado e salvo
- [ ] Regras de conteudo respeitadas (sem preco, com sck, com override de data)
- [ ] Script de deploy com `JSON.stringify` e `new Function()` validation
- [ ] PUT feito e retornou sucesso
- [ ] Cache cycling executado
- [ ] Smoke test com numero proprio
- [ ] 3 primeiras execucoes reais monitoradas
- [ ] Se mexeu em data de evento: conferiu que TODOS os agentes com data foram atualizados (REGRA-015)
- [ ] Commit do arquivo local no git (opcional mas recomendado — facilita rollback)

---

### [SOP-003] Instalar Microsoft Clarity em pagina Lovable
**Trigger:** Heatmaps/recordings numa pagina Lovable

Resumo: Clarity (clarity.microsoft.com) > criar projeto > copiar snippet > Lovable chat "adicione no head" > Publish > verificar 4 checks (clarityId, clarityMs, clarityGlobal, clskCookie). Free e ilimitado.

---

## Template de SOP

### [SOP-XXX] {Nome do Processo}
**Criado em:** {data}
**Ultima execucao:** {data}
**Trigger:** {o que dispara}
**Tempo estimado:** {quanto tempo}
**Ferramentas:** {quais}

**Pre-requisitos:**
- {o que precisa}

**Passos:**
1. {passo 1}
   - Verificar: {como saber que deu certo}

**Output esperado:** {resultado}

**Troubleshooting:**
- {problema}: {solucao}
