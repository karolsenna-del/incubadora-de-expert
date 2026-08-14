---
task: "Diagnosticar — Passo 8 do INSTALL (smoke test)"
responsavel: "@doutor"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "QG-IB-003 validado (webhooks ligados, 4 workflows ativos, template aprovado)"
Saida: "Bia viva — 4 cenários do smoke test passando, handoff funcionando"
Checklist:
  - "Cenário 1 (pipeline base): número no allowlist dev → mensagem → Bia responde no modo bia"
  - "Cenário 2 (troca agent_id): seta outro active_agent_id → Bia responde no modo especial"
  - "Cenário 3 (opt-out 'Sair'): vai pra blacklist → próximos disparos pulam"
  - "Cenário 4 (handoff Chatwoot): humano digita no painel → chega no WhatsApp → Bia se cala"
  - "Zero {{var}} literal nas respostas"
execution_type: "interactive"
---

# Diagnosticar (Passo 8 do INSTALL — smoke test)

**Agente:** @doutor · **Gate de saída:** QG-IB-004 (Bia viva)
**Material:** `data/kit/INSTALL.md` (passo 8), `data/kit/07-smoke.md`, `knowledge/runbook-ponte.md`, `data/kit/regras.md`

## Passo 8 — Smoke test e2e (~30min)
1. **Pipeline base:** adiciona o número no allowlist Development da WABA → manda template → responde no WhatsApp → Bia responde no modo `bia`
2. **Troca de agent_id:** PATCH `active_agent_id=bia-recovery` no Supabase → manda msg → Bia no modo especial
3. **Opt-out:** escreve "Sair" → vai pra blacklist → próximos disparos pulam
4. **Handoff Chatwoot:** digita no painel Chatwoot → chega no WhatsApp do lead → Bia se cala (`is_human_takeover=true`)

## Diagnóstico (quando um cenário falha — normal na 1ª vez)
Isolar **onde** quebrou (árvore do `runbook-ponte.md`): a mensagem entrou no n8n? processou? saiu?
- Não gerou execução → ponte Meta (fase Conectar) → devolve pro Conector com diagnóstico
- Entrou e falhou (vermelho) → credential ou `{{var}}` → devolve pro Construtor
- Processou mas não saiu → envio (token/phone ID)
Identifica causa raiz → conserta (ou aponta a estação) → **re-roda o cenário**.

## Gate QG-IB-004 → reporta ao Chief
4 cenários passam · handoff funciona · zero `{{var}}` literal = **Bia viva**.

## Error Handling
| Cenário | Ação |
|---------|------|
| Quer marcar pronto com cenário faltando | Bloquear — só viva com 4/4 |
| Tentação de chutar | Isolar primeiro (entrou? processou? saiu?) |
| Bia responde `{{var}}` literal | Causa na fase Construir → Construtor |
| Erro intermitente | Checar contato duplicado (8/9 dígitos) |
