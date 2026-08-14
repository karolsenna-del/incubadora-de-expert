# Kit Aluno — Instalar a Bia em Cima da Sua Infra

> Playbook linear pra instalar a Bia (agente WhatsApp IA via Cloud API) no seu n8n + Supabase + Chatwoot.
> Estimativa: **4-5 horas** de execução, dividido em 8 passos.
> Pré-requisito: você já tem servidor + n8n + Supabase + Chatwoot rodando (foi feito no step anterior da mentoria).

> 🚀 **Quer começar agora?** Abra [`INSTALL.md`](./INSTALL.md) — passo a passo cronológico do zero ao smoke test. Este README é o "manual" de fundo; o INSTALL é a "receita" pra executar.

---

## O que você vai construir

Uma agente IA chamada **{{NOME_AGENTE}}** (você escolhe o nome) que:

- Recebe mensagens de WhatsApp via Meta Cloud API direto (sem ManyChat, sem intermediário)
- Conversa de forma humanizada (chunks com delay, espelhamento, persona definida)
- Tem **5 modos especializados** (triagem, recovery, boas-vindas, convite, evento) — você ativa o modo certo via `active_agent_id` no Supabase
- Lembra do histórico de cada lead (Supabase `bia_agent_context`)
- Faz handoff automático pra humano quando não sabe responder (Chatwoot)
- **Você (ou aluno) monitora tudo pelo Chatwoot** em tempo real
- Aceita opt-out (lead escreve "Sair" → vai pra blacklist, nunca mais recebe)

---

## Escopo deste kit: **4 workflows essenciais** (pipeline + monitoramento)

A Bia em si é só **3 workflows** (pipeline de mensagem). Adicionamos **1 workflow** pra você responder pelo Chatwoot (caminho de volta humano → Cloud API).

| # | Workflow | Função |
|---|----------|--------|
| 1 | **WF-INBOUND-CLOUD** | Recebe webhook Meta → buffer 9s → consulta perfil → chama AGENT-CORE |
| 2 | **WF-AGENT-CORE-CLOUD** | Motor IA — prompt (L1+L2+L3+L4 + histórico) → Claude → fallback GPT |
| 3 | **WF-OUTBOUND-CLOUD** | Chunker humanizado → envia via Graph API → sync Chatwoot |
| 4 | **WF-CHATWOOT-HUMAN** | Humano digita no Chatwoot → manda pro WhatsApp do lead via Cloud API |

> **Por que esses 4 e não mais?** A Bia em si conversa com 3. O 4 é o caminho de volta pra você responder manual pelo Chatwoot. Tudo o que está fora disso (recovery automático, boas-vindas auto via Hotmart, dashboard de qualidade, edição de campanha via webhook) **NÃO É BIA** — são workflows de negócio que CLIENTAM a Bia. Eles ficam pra outros kits.

### Workflows de negócio fora deste kit (instalação separada quando você quiser):

| Feature | Kit futuro |
|---------|-----------|
| Boas-vindas automática pós-compra Hotmart | kit-compras-hotmart |
| Recovery automático (6 toques T1-T6) | kit-recovery |
| Disparo em massa pra base (convite, lembrete) | kit-dispatcher |
| Edição de campanha via webhook | kit-kb-manager (opcional — edita pelo Supabase Studio mesmo) |

---

## Pré-requisitos (o que você precisa ter ANTES)

| Item | Verificação |
|------|-------------|
| n8n rodando + API key | `curl -s "$N8N_URL/api/v1/workflows" -H "X-N8N-API-KEY: $KEY"` retorna JSON |
| Supabase project + service_role key | `curl -s "$SUPA_URL/rest/v1/" -H "apikey: $SUPA_KEY"` retorna OpenAPI |
| **Chatwoot rodando + API token + 1 inbox API/Cloud API criado** | `https://chatwoot.seudominio.com` acessível, você consegue criar contato manual |
| Hetzner com domínio + SSL | `https://webhook.seudominio.com` acessível |
| Conta Anthropic + API key (Claude) | Crédito ativo, ~$3-30/mês dependendo do volume |
| Conta OpenAI + API key (GPT fallback + Whisper + Vision) | Crédito ativo, ~$1-10/mês |
| Conta Meta Business Manager | Vazia ou existente, com acesso admin |
| Número de telefone disponível pra registrar na WABA | Não pode estar registrado em outra conta WhatsApp Business |

Se faltar qualquer item, pare e resolva antes de continuar. **A Bia não roda sem todos eles.**

---

## Ordem dos 7 passos

| # | Etapa | Tempo | Arquivo |
|---|-------|-------|---------|
| 1 | Supabase — aplicar migrations + popular tabelas | 30min | [`01-supabase.md`](./01-supabase.md) |
| 2 | Meta Cloud API — WABA + número + token + webhook | 60-90min | [`02-meta-cloud.md`](./02-meta-cloud.md) |
| 3 | n8n — credentials (Anthropic, OpenAI, Supabase, Meta, **Chatwoot**) | 20min | [`04-credentials.md`](./04-credentials.md) |
| 4 | n8n — importar 4 workflows + ajustes obrigatórios em cada | 45-60min | [`03-workflows.md`](./03-workflows.md) |
| 5 | Prompts — customizar L1+L2+L3+L4 com seus dados | 60-90min | [`05-prompts.md`](./05-prompts.md) + `prompts-template/` |
| 6 | Templates Cloud API — submeter 1 template de teste | 15min | [`06-templates.md`](./06-templates.md) |
| 7 | Smoke test e2e — validar que tudo funciona | 30min | [`07-smoke.md`](./07-smoke.md) |

**Total: ~3-4 horas trabalhadas.**

---

## Antes de começar — abra estes arquivos lado a lado

- [`regras.md`](./regras.md) — REGRAS INEGOCIÁVEIS. Cada uma nasceu de um incidente real. Leia ANTES do passo 4 (workflows) e do passo 5 (prompts).

---

## Após instalar — o que você precisa saber pra operar

1. **A Bia só responde** — ela não inicia conversa fora da janela 24h. Pra disparar template em massa ou pra ativar recovery automático, você precisa instalar os kits de negócio (kit-compras-hotmart, kit-recovery, kit-dispatcher) depois.

2. **Monitorar pelo Chatwoot** — toda conversa aparece em tempo real. Você intervém clicando em "Open" e digitando. WF-CHATWOOT-HUMAN cuida do resto.

3. **Quando responder manual no Chatwoot:** a Bia desativa automaticamente pra esse contato (`is_human_takeover=true`). Pra devolver pra Bia: limpar a flag no Supabase.

4. **Editou prompt L3 e a Bia parou de responder:** 99% é JS inválido. REGRA-012: sempre `node -c arquivo.js` antes de PUT, e usar `JSON.stringify()` em qualquer texto que tenha newlines.

5. **Quando importar workflow alterado via API n8n:** cache não atualiza automaticamente. Sempre fazer cache cycle (deactivate → activate com versionId). REGRA-005/006.

6. **Backups:** faça `git commit` semanal do estado dos workflows (export via API) + snapshot do `bia_campaign_data`.

---

## Convenções deste kit

- **{{PLACEHOLDERS}}** com `{{` `}}` → substituir pelo seu valor
- **{TOKEN}** com `{` `}` → variável de comando (substituir no shell)
- **`código`** → comando ou path real
- **REGRA-XXX** → regra inegociável (ver `regras.md`)

---

## Se algo der errado

1. Antes de tudo: re-leia `regras.md` — 80% dos bugs são violação de regra.
2. Veja `07-smoke.md` (diagnóstico de falhas) — quase todo sintoma comum já está mapeado com o fix.
3. Verifique no n8n se o workflow tá ativo e teve execução recente.
4. Verifique no Supabase se o contato existe em `bia_whatsapp_contacts` e `active_agent_id` está certo.
5. Se nada disso resolver: pede ajuda no canal da mentoria com print da execução do n8n + query do Supabase.

---

## Status: pronto pra começar?

Confirme antes de seguir pro passo 1:

- [ ] Você tem todos os pré-requisitos acima (incluindo Chatwoot rodando)
- [ ] Leu este README inteiro
- [ ] Reservou meio dia (3-4h focadas) pra fazer tudo de uma vez
- [ ] Tem onde guardar credenciais (1Password, Bitwarden, ou pelo menos cofre local)

Se todos os ✅, abre [`01-supabase.md`](./01-supabase.md) e começa.
