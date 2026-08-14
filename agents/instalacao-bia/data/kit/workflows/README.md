# Workflows do Kit Aluno (Bia)

> Snapshots **sanitizados** dos 4 workflows da Bia, exportados do n8n de origem em 14/05/2026.
> Todos os IDs/URLs/credentials específicos de origem foram substituídos por `{{PLACEHOLDERS}}`.

---

## Arquivos

| Arquivo | Nodes | Função |
|---------|-------|--------|
| `wf-inbound-cloud.json` | 33 | Recepção: webhook Meta → buffer → mídia → consulta Supabase → AGENT-CORE |
| `wf-agent-core-cloud.json` | 19 | Motor IA: prompt L1-L4 → Claude → fallback GPT → save context → OUTBOUND |
| `wf-outbound-cloud.json` | 10 | Envio: chunker → typing → Graph API → sync Chatwoot |
| `wf-chatwoot-human.json` | 6 | Caminho de volta humano: Chatwoot webhook → Graph API → seta `is_human_takeover` |

---

## Placeholders que você vai substituir ANTES de importar

> Veja `../SUBSTITUICOES.md` pra checklist consolidado.

| Placeholder | O que é | De onde tirar |
|-------------|---------|---------------|
| `{{SUPABASE_PROJECT_REF}}` | Subdomínio do seu projeto Supabase | URL do dashboard — ex: `abcdefghijklmnop` em `https://abcdefghijklmnop.supabase.co` |
| `{{PHONE_NUMBER_ID}}` | ID do número da Cloud API | Meta Business Manager > WABA > Phone Numbers |
| `{{WABA_ID}}` | ID da WABA | Meta Business Manager > WhatsApp Accounts |
| `{{APP_ID}}` | ID do Meta App | developers.facebook.com > seu App > Settings > Basic |
| `{{WHATSAPP_SUPORTE}}` | Número WhatsApp do suporte humano | seu | (formato: `55DDDXXXXXXXX`) |
| `{{EMAIL_SUPORTE}}` | Email do suporte | seu |
| `{{INSTAGRAM_EXPERT}}` | @ do expert no Instagram | seu (sem o @) |
| `{{SEU_DOMINIO}}` | Domínio do seu n8n | ex: `seudominio.com` |
| `{{WF_INBOUND_ID}}` | ID NOVO do WF-INBOUND-CLOUD após importar | URL do editor após import |
| `{{WF_AGENT_CORE_ID}}` | ID NOVO do WF-AGENT-CORE-CLOUD | idem |
| `{{WF_OUTBOUND_ID}}` | ID NOVO do WF-OUTBOUND-CLOUD | idem |
| `{{WF_CHATWOOT_HUMAN_ID}}` | ID NOVO do WF-CHATWOOT-HUMAN | idem |
| `{{CRED_ID_ANTHROPIC}}` | ID da credential Anthropic no SEU n8n | criada no passo 3 |
| `{{CRED_ID_META}}` | ID da credential Meta Cloud API | idem |
| `{{CRED_ID_OPENAI}}` | ID da credential OpenAI | idem |
| `{{N8N_PROJECT_ID}}` | ID do project n8n | irrelevante — pode deixar como tá ou apagar |
| `{{N8N_USER_ID}}` | ID do seu user n8n | idem |
| `{{N8N_USER_EMAIL}}` | email da conta n8n | idem |
| `{{N8N_PROJECT_NAME}}` | nome do project | idem |
| `{{NEW_WORKFLOW_ID}}` | ID novo do workflow | n8n gera automaticamente no import |

---

## 2 estratégias de import

### Estratégia A — Substituir placeholders ANTES de importar (recomendado)

1. Copia os 4 JSONs pra um local temporário
2. Abre cada um num editor + faz Find & Replace pra cada placeholder
3. Importa via UI ou API do n8n
4. Anota os 4 workflow IDs novos
5. Volta nos JSONs e faz Find & Replace dos `{{WF_*_ID}}` pelos IDs reais
6. Re-importa OU edita direto no editor n8n

**Trabalhoso mas seguro.** Aluno tem controle de tudo.

### Estratégia B — Importar com placeholders, ajustar na UI do n8n

1. Importa os 4 JSONs como estão (com placeholders)
2. Anota os 4 IDs novos
3. Abre cada workflow no editor e ajusta:
   - Nodes que têm `{{SUPABASE_PROJECT_REF}}` na URL → trocar pelo seu
   - Execute Workflow nodes com `{{WF_*_ID}}` → selecionar workflow correto pelo nome no dropdown
   - HTTP nodes com `{{PHONE_NUMBER_ID}}` → trocar
   - Credentials marcadas como missing → atribuir as suas

**Menos trabalho upfront** mas precisa atenção pra não esquecer nenhum.

---

## Ordem de import recomendada

Importa nesta ordem (cada um depende do anterior estar disponível pra cross-reference):

1. **WF-OUTBOUND-CLOUD** primeiro (não chama ninguém via executeWorkflow)
2. **WF-AGENT-CORE-CLOUD** (chama OUTBOUND)
3. **WF-INBOUND-CLOUD** (chama AGENT-CORE)
4. **WF-CHATWOOT-HUMAN** (paralelo — não chama os outros)

Ative na mesma ordem (de baixo pra cima na cadeia).

---

## Sobre o script `_sanitize.sh`

É o script que usei pra gerar esses templates a partir dos JSONs de origem. **Você não precisa dele** — está aqui só por transparência. Ele permite refazer o processo se um dia tiver os workflows atualizados.

---

## Caveats conhecidos

### Prompt do AGENT-CORE vem genérico (com placeholders)

O node `Configuracao do Agente` já vem com os **prompts-template genéricos** (L1+L2 + os 4 L3 de cada modo), usando placeholders tipo `{{NOME_AGENTE}}`, `{{NOME_EXPERT}}`, `{{LINK_*}}` — **sem** dados, persona ou links de venda de ninguém. Você personaliza no passo 5 (`../05-prompts.md`) preenchendo os placeholders com os seus dados.

**Mesmo se esquecer de preencher,** a Bia no máximo responde com placeholders literais — nunca com produto/checkout de outra pessoa.

### Nodes `Sync Inbound → Chatwoot` e `Sync Humano → Chatwoot` (no INBOUND)

Esses nodes têm URLs de chatwoot hardcoded no formato `{{SUPABASE_PROJECT_REF}}` errado — porque o sanitizador trata Chatwoot como variável ainda. **Verifique manualmente:** o seu Chatwoot está em `chatwoot.SEUDOMINIO.com` (ou similar). Ajuste no editor n8n após import.

### Logging (no OUTBOUND)

Este kit já vem **sem** os nodes de logging externo (`Call WF-LOGGER`, `Prepare Logger Payload`) — dependiam de um sistema de monitoramento fora do escopo do kit. A chain do OUTBOUND termina em `Sender Cloud API → Log Interacao` (log local em console, sem dependência externa). Nada a fazer.
