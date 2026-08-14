---
task: "Conectar — Passos 5.4-5.5 e 7 do INSTALL"
responsavel: "@conector"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "QG-IB-002 validado (workflows montados, prompts injetados)"
Saida: "Webhooks Meta e Chatwoot ligados, 4 workflows ativos, 1 template aprovado — Bia plugada no mundo"
Checklist:
  - "Passo 5.4: webhook Meta (callback URL + verify token idêntico, handshake 200, campo messages inscrito)"
  - "Passo 5.4: webhook do inbox Chatwoot apontando pro n8n"
  - "Passo 5.5: 4 workflows ativados"
  - "Passo 7: 1 template aprovado (teste_pipeline_bia ou hello_world)"
execution_type: "interactive"
---

# Conectar (Passos 5.4-5.5 e 7 do INSTALL)

**Agente:** @conector · **Gate de saída:** QG-IB-003
**Material:** `data/kit/INSTALL.md` (5.4, 5.5, 7), `data/kit/02-meta-cloud.md` (seção webhook), `data/kit/06-templates.md`

> A parte mais frágil. O Conector avisa o aluno que raramente sobe de primeira — e tem o runbook pra isso.

## Passo 5.4 — As duas portas
**Lead (Meta → n8n):**
- Callback URL = `https://webhook.{{SEU_DOMINIO}}/webhook/wf-inbound-cloud`
- Verify token = a string definida pelo aluno (**idêntica** nos dois lados) · confirma handshake (200 + challenge) · inscreve o campo `messages`

**Humano (Chatwoot → n8n):**
- Webhook do inbox Chatwoot = `https://webhook.{{SEU_DOMINIO}}/webhook/wf-chatwoot-human`

## Passo 5.5 — Ativar
- Ativa os 4 workflows (ordem OUTBOUND → AGENT-CORE → INBOUND → CHATWOOT-HUMAN)

## Passo 7 — Template (~15min + espera Meta)
- Opção rápida: usa o `hello_world` (já aprovado). Opção custom: submete `teste_pipeline_bia` (UTILITY, aprova rápido)

## Se travar
Após 1-2 tentativas sem verificar o webhook, **não chutar** — usar `knowledge/runbook-ponte.md` (causas 1-5). Se persistir no smoke, é trabalho do @doutor.

## Gate QG-IB-003 → reporta ao Chief
Webhook Meta verificado (200+challenge) · `messages` inscrito · webhook Chatwoot ligado · 4 workflows ativos · template aprovado.

## Error Handling
| Cenário | Ação |
|---------|------|
| Webhook não verifica | Runbook: verify token → workflow ativo → SSL → URL responde |
| Verifica mas nada chega (botão "Test" chega, msg real não) | **App não inscrito na WABA** — `POST /{WABA_ID}/subscribed_apps` (passo 2.7.1) |
| Verifica mas nada chega (nem o "Test") | Campo `messages` não inscrito |
| Loop de erro | Parar de chutar, ir pelo runbook ponto a ponto |
