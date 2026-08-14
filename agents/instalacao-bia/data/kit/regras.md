# Regras Inegociáveis da Bia — Versão Operacional pra Aluno

> **Cada regra nasceu de um incidente real.** Cada uma tem sangue no chão. **Não pule, não interprete.** Leia 1x antes de operar de verdade, e revisita toda vez que algo der errado.
>
> Esta é a referência operacional embarcada no kit. Em caso de dúvida, releia e peça apoio no canal da mentoria.

---

## REGRA-001 — `active_agent_id` OBRIGATÓRIO antes de QUALQUER disparo

**Por quê:** o INBOUND-CLOUD pega o `active_agent_id` do contato no Supabase pra decidir qual prompt L3 carregar. Se você dispara um template (boas-vindas, convite, recovery) sem setar `active_agent_id` antes, o INBOUND carrega o agent anterior (ou default `bia`) e a Bia responde como triagem genérica. **Lead pensa que tá falando com a Bia certa, mas tá falando com a errada.**

**Histórico de violação:** 10/03/2026 — 19 de 23 leads receberam resposta errada. 05/04 + 06/04 + 08/04 — reincidências Cloud API.

**Procedimento obrigatório, NO PEDIDO:**

```bash
# 1. PRIMEIRO: setar agent_id
curl -s -X PATCH "$SUPA_URL/rest/v1/bia_whatsapp_contacts?phone=eq.55DDDNUMERO" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active_agent_id": "AGENT_CORRETO"}'

# 2. SEGUNDO: enviar template
curl -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/messages" ...
```

**Mapa template → agent_id:**

| Template | agent_id |
|----------|----------|
| `boas_vindas_*` | `bia-boas-vindas` |
| `convite_*` | `bia-convite` |
| `recovery_*` | `bia-recovery` |
| `lembrete_*`, `aviso_*`, `link_acesso_*` | `bia` (informativo — combina com REGRA-013) |

---

## REGRA-002 — Blacklist OBRIGATÓRIA antes de qualquer disparo

**Por quê:** proteção LGPD + respeito a opt-out + evitar reclamação na Meta (que mata sua WABA).

**Antes de QUALQUER disparo proativo** (script de massa, recovery, boas-vindas, qualquer outbound), o workflow/script PRECISA checar:

```sql
SELECT 1 FROM blacklist_api WHERE phone = '55DDDNUMERO'
```

Se retornar row → **PULAR esse contato**, logar como "BLACKLIST", não enviar.

Blacklist é cumulativa. **Nunca remover sem autorização explícita do dono do número.**

---

## REGRA-003 — Phone SEMPRE `55DDDNUMERO` + fallback 8/9 dígitos

**Por quê:** o campo `phone` em `bia_whatsapp_contacts` usa formato internacional só dígitos: `55DDDNUMERO` (ex: `5511986148815`).

Outras tabelas (`pessoas.telefone`, `capturas`) podem ter formato livre `(11) 98614-8815`. **Normalizar SEMPRE antes de operar no `bia_whatsapp_contacts`.**

```javascript
// Normalização
function normalizePhone(raw) {
  let phone = raw.replace(/\D/g, ''); // só dígitos
  if (phone.length === 10 || phone.length === 11) phone = '55' + phone;
  return phone;
}
```

**Fallback 8/9 dígitos (problema celular BR):**

Celulares BR podem vir com 13 dígitos (`5511986148815`, com nono dígito) OU 12 dígitos (`551186148815`, sem nono). WhatsApp Cloud API manda qualquer um.

Quando você não acha o phone exato no banco, tenta a variante alternativa (adiciona/remove o 9 após o DDD). Se acha com alt, **corrija o registro** pra ter um phone canônico.

**Histórico:** 06/04 — 488 registros com phone formatado quebraram match. 08/04 — Carolina Kling criou 55 duplicados. 20/04 (BUG-026) — dispatch criava contato novo duplicado com agent_id correto, mas Resolve Contact merge no contato antigo com agent_id errado: lead recebia template certo mas Bia respondia com prompt errado.

---

## REGRA-004 — NUNCA `$('Execute Workflow Trigger')` em Code nodes

**Por quê:** em Code v2 do n8n, referenciar trigger nodes via `$('NodeName')` não funciona confiavelmente. Retorna dado na execução mas Code node não consegue ler.

**Regra:** sempre usar `$input` chain + garantir que cada node passa dados adiante (passthrough).

---

## REGRA-005 — Cache cycle obrigatório após PATCH via API

**Por quê:** n8n cacheia workflows em memória. PATCH atualiza o storage (DB) mas NÃO a instância ativa.

Sempre que editar workflow via API:

```bash
# 1. Get versionId
VID=$(curl -s "$N8N_URL/api/v1/workflows/$WF_ID" -H "X-N8N-API-KEY: $N8N_KEY" | jq -r '.versionId')

# 2. Deactivate
curl -X POST "$N8N_URL/rest/workflows/$WF_ID/deactivate" \
  -H "X-N8N-API-KEY: $N8N_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"$VID\"}"

# 3. Get NOVO versionId
VID2=$(curl -s "$N8N_URL/api/v1/workflows/$WF_ID" -H "X-N8N-API-KEY: $N8N_KEY" | jq -r '.versionId')

# 4. Reactivate
curl -X POST "$N8N_URL/rest/workflows/$WF_ID/activate" \
  -H "X-N8N-API-KEY: $N8N_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"$VID2\"}"
```

**ATENÇÃO:** `PATCH {"active":false}` NÃO funciona em workflows com webhook — sempre retorna `active:true`. Usar endpoints `/deactivate` e `/activate` com `versionId`.

---

## REGRA-006 — BUGLOG-first

**Por quê:** quase todo bug que dá pra acontecer já aconteceu uma vez. Antes de tentar consertar do zero, ver se já existe diagnóstico documentado.

Antes de debugar do zero:
1. Olhar `bia-cloud/BUGLOG-CLOUD.md` no material de referência — bugs documentados com root cause + fix
2. Olhar `bia-ops-manual.md` seção "Bugs históricos" — bugs maiores
3. Só DEPOIS começar diagnóstico do zero

---

## REGRA-007 — `JSON.stringify` + validação antes de PUT

**Por quê:** quando vai editar workflow via API com texto que tem newlines/aspas/etc, JSON malformado quebra silenciosamente.

Procedimento:
1. Construir objeto JS in-memory
2. `JSON.stringify(obj)` pra serializar
3. Validar com `node -e "JSON.parse('$(cat file.json)')"` antes de PUT
4. PUT
5. Verificar com GET que voltou igual

---

## REGRA-009 — Prompts L3 NUNCA com preços absolutos

**Por quê:** preços mudam por lote, oferta, cupom. Hardcoded no L3 → fica desatualizado silenciosamente.

A Bia trabalha com "desconto especial" e links que **já têm o desconto aplicado** na URL. Se lead perguntar valor normal, direciona pra página de checkout normal (que mostra o preço atual atualizado).

❌ "O ingresso custa R$ 297"
✅ "Tá no lote atual" + envia link de checkout

---

## REGRA-010 — Data de evento DEVE vir de `workshop_config` via placeholders

**Por quê:** se você hardcoda data no prompt L3, vai esquecer de atualizar quando shiftar ciclo. A Bia vai falar data antiga pra leads novos.

Use placeholders no L3/L4: `{{data_full_text}}`, `{{duracao}}`, `{{end_signup_text}}`, `{{data_template_var}}`, etc.

O Context Manager do WF-AGENT-CORE-CLOUD substitui em runtime lendo da `workshop_config`.

Pra shiftar ciclo: rode `node scripts/workshop-cycle.mjs shift --slug NOVO --event-date-start YYYY-MM-DD ...`. Tudo se propaga sem editar prompt.

---

## REGRA-012 — Nunca editar prompts L3 com texto cru (sem JSON.stringify)

**Por quê:** o node "Configuracao do Agente" armazena prompts L3 como strings JavaScript single-quoted com `\n` escapado. **Texto com newlines reais = SyntaxError = workflow morto silenciosamente** (crash <100ms, sem `lastNodeExecuted` no log).

**Histórico:**
- BUG-015 (14/03/2026): Bia morta 2 dias. Prompt bia-evento com newlines reais.
- BUG-019 (16/03/2026): Bia morta ~11h. Prompt default 'bia' com MESMO erro.

**Procedimento:**

```bash
# 1. Escreva o prompt em txt normal
cat > /tmp/L3.txt <<'EOF'
TEXTO
COM
QUEBRAS DE LINHA
EOF

# 2. JSON.stringify pra escapar
node -e "console.log(JSON.stringify(require('fs').readFileSync('/tmp/L3.txt','utf8')))" > /tmp/L3-escaped.txt

# 3. Validar a string escapada é JS válido
node -e "const s = $(cat /tmp/L3-escaped.txt); console.log('OK', s.length, 'chars')"

# 4. Colar no node + PUT via API

# 5. Validar o JS INTEIRO do node ANTES de cache cycle
node -c arquivo-do-node.js

# 6. Cache cycle (REGRA-005)

# 7. Monitorar primeiras 3 execuções — TODAS com sucesso
```

**Checklist absoluto pra qualquer alteração no WF-AGENT-CORE:**
- [ ] Prompt escapado (sem newlines reais em strings)
- [ ] `node -c` passa sem erro
- [ ] PUT executado
- [ ] Cache cycle executado
- [ ] 3 execuções monitoradas — sem crash <100ms

---

## REGRA-013 — Disparo informativo: agent_id = 'bia' + is_human_takeover = true

**Por quê:** alguns templates são notificações puras (lembrete, link de acesso, aviso de mudança). Você quer que cheguem, mas NÃO quer que a Bia tente conversar quando o lead responder.

Procedimento:
1. PATCH `active_agent_id = 'bia'` (default, que respeita takeover)
2. PATCH `is_human_takeover = true`
3. Enviar template
4. Se lead responder: WF-AGENT-CORE-CLOUD vê `is_human_takeover=true` e não invoca o LLM. Lead fica no vácuo (ou um humano vê e responde no Chatwoot).

---

## REGRA-014 — Atribuição de venda por `sck` (link rastreado)

**Por quê:** quando lead clica em link da Bia e compra, você quer saber QUE AGENTE gerou. O Hotmart manda o `sck` no webhook, e o COMPRAS totais usa pra atribuir.

**Sem `sck`:** atribuição cai no fallback do `active_agent_id` do contato — que é "zumbi" (nunca expira). Lead que falou com bia-recovery há 6 meses e agora comprou via Instagram → atribuído à bia-recovery erroneamente.

Todo link de checkout que a Bia envia **DEVE** ter:

| Agente | `sck` |
|--------|-------|
| bia-recovery | `&sck=bia-recovery` |
| bia-boas-vindas | `&sck=bia-boasvindas` |
| bia-convite | `&sck=bia-convite` |
| bia-fechamento (T6) | `&sck=bia-fechamento` |

---

## REGRA-015 — 1Password (ou cofre equivalente) pra credenciais

**Por quê:** credentials hardcoded no repo, no Slack, em txt no Desktop — vazamento garantido.

Use cofre criptografado: 1Password, Bitwarden, ou pelo menos `pass` (Unix). NUNCA copie/cole token em chat público ou commit.

Quando passar credencial pra n8n, prefira:
- Variável de ambiente do docker-compose (lê do shell)
- Credential do n8n (criptografada com encryption_key)
- Nunca: hardcoded no JSON do workflow commitado

---

## Resumo — checklist antes de QUALQUER operação de disparo

- [ ] Phone normalizado em formato `55DDDNUMERO`
- [ ] PATCH `active_agent_id` feito (REGRA-001)
- [ ] Blacklist checada (REGRA-002)
- [ ] Link de checkout tem `&sck=bia-{agente}` (REGRA-014)
- [ ] Se editou prompt: validou JS (REGRA-012) + cache cycle (REGRA-005)
- [ ] Se mudou ciclo: rodou `workshop-cycle.mjs shift` (REGRA-010)
- [ ] Rate limit respeitado (min 1.5s entre envios em massa)
- [ ] Testado e2e com SEU número antes da base toda

---

## Quando algo dá errado

**80% dos bugs são violação de regra acima.** Antes de procurar bug novo:

1. Re-leia REGRA-001 (agent_id setado?)
2. Re-leia REGRA-005 (cache cycle feito?)
3. Re-leia REGRA-012 (JS válido?)
4. Re-leia REGRA-003 (phone normalizado?)

Se realmente não foi regra, vá pro **`bia-ops-manual.md`** seção "Bugs históricos" no material de referência.
