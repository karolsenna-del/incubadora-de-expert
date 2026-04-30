# Gestor de Infra Arcane — Regras Operacionais

> Sistema imunologico do Gestor de Infra Arcane. Cada regra nasceu de um incidente real.
> Carregar SEMPRE antes de qualquer missao. Sem excecao.

---

## REGRA-001: active_agent_id OBRIGATORIO antes de qualquer disparo

**Contexto:** Todo disparo de template WhatsApp Cloud API (unitario ou em massa) DEVE setar `active_agent_id` com o agent_id correto no registro do contato em Supabase (tabela de contatos WhatsApp) **ANTES** do envio via Graph API.

**Motivo:** Sem isso, quando o lead responder, o workflow de inbound pega o agent_id anterior (ou default generico) e carrega o prompt errado. Incidentes reais: leads recebendo resposta com prompt de outro agente ou prompt de triage generico.

**Procedimento (Cloud API):**
```
1. PATCH {supabase_url}/rest/v1/{tabela_contatos}?phone=eq.{55DDDNUMERO}
   Body: {"active_agent_id": "{AGENT_ID_CORRETO}"}

2. POST graph.facebook.com/v21.0/{phone_number_id}/messages
   Body: { template Cloud API com variaveis }
```

**Checklist pra qualquer disparo:**
- [ ] Phone normalizado pra `55DDDNUMERO` (REGRA-013)
- [ ] PATCH `active_agent_id` feito **por lead** antes do envio
- [ ] Blacklist carregada (REGRA-002)
- [ ] Rate limit respeitado (min 1.5s entre envios, conservador)
- [ ] Testado end-to-end com numero proprio antes da base toda

---

## REGRA-002: Blacklist OBRIGATORIA antes de qualquer disparo

**Contexto:** TODO script ou workflow que envia mensagem proativa (campanha, recovery, boas-vindas, qualquer outbound) DEVE checar a blacklist ANTES de enviar.

**Fonte unica:** arquivo `scripts/blacklist.json` (ou equivalente local) — checar no script/workflow.

**Checklist pra qualquer novo script/workflow de disparo:**
- [ ] Script/workflow carrega blacklist e checa por lead antes de enviar
- [ ] Contato bloqueado aparece no log/resumo como "BLACKLIST"
- [ ] Novos opt-outs sao adicionados imediatamente em `scripts/blacklist.json`
- [ ] Blacklist e cumulativa — nunca remover sem autorizacao explicita

---

## REGRA-003: Configuracao padrao de disparos em grupo via Z-API

**Contexto:** Todo disparo de mensagem em grupo/comunidade WhatsApp via Z-API DEVE seguir essas configuracoes padrao. Sem excecao.

**Configuracoes obrigatorias:**
- **Mencao @todos:** Usar array `mentioned` com todos os phones do grupo — NUNCA usar `mentionsEveryOne: true` (nao gera icone verde)
- **Buscar participantes antes:** GET `/group-metadata/{id}` pra montar o array de mentioned
- **Usar Announcement Group ID:** NUNCA enviar pro Community ID (pai) — ver REGRA-CRITICA

**Motivo:** Sem mencao @todos via array `mentioned`, a mensagem vai pro grupo mas ninguem recebe notificacao push — grande parte dos participantes nao ve.

---

## REGRA-005: BUGLOG-first pra manutencao de agentes WhatsApp

**Contexto:** Qualquer manutencao, debug ou fix que envolva agentes WhatsApp (templates, flows, workflows) segue este fluxo:

1. **BUGLOG primeiro** — Registrar com Sintoma → Diagnostico → Causa Raiz → Fix → Status
2. **Manual ops depois** — So atualizar manual a partir do BUGLOG (consolidacao)
3. **Nunca pula pro manual direto** — O BUGLOG e o registro bruto em tempo real

---

## REGRA-006: Disparo em massa SEMPRE via script controlado

**Contexto:** Todo disparo de template em massa (unitario via Cloud API) DEVE ser feito por script Node.js controlado — NUNCA via broadcast nativo de nenhuma plataforma.

**Regra:**
- **Unitario (Cloud API):** script Node.js → loop de leads → PATCH active_agent_id → POST Graph API → delay 1.5s
- **Grupo WhatsApp:** script ou workflow Z-API com announcement group ID (REGRA-003 + REGRA-CRITICA)

**Por que script controlado:**
- Seta `active_agent_id` antes do envio (REGRA-001)
- Checa blacklist local (REGRA-002)
- Normaliza phone (REGRA-013)
- Deduplicacao por tag/flag antes do envio
- Dry-run pra validar antes de disparar
- Log granular por lead (sent/skipped/error/blacklisted)
- Rate limit controlado (min 1.5s entre envios)
- Multi-agente (cada disparo pode usar template e agent_id diferentes)

---

## REGRA-012: Validar sintaxe JS ANTES de PUT no n8n

**Contexto:** Qualquer alteracao no jsCode de nodes n8n (via API PUT) DEVE ser validada com `node -c arquivo.js` ANTES de enviar.

**Motivo:** Incidente real — script inseriu prompt com newlines reais em string JS → SyntaxError → agente morto por 2 dias, dezenas de leads sem resposta.

**Procedimento:**
1. Salvar jsCode localmente em arquivo temporario
2. Rodar `node -c arquivo.js`
3. Se SyntaxError → NAO fazer PUT. Corrigir primeiro
4. Se ok → PUT + cache cycling (deactivate → activate com versionId)
5. Monitorar primeiras 3 execucoes apos update

**Complemento:** SEMPRE salvar backup do jsCode original ANTES de qualquer alteracao.

---

## REGRA-CRITICA: Comunidade-pai ≠ Grupo de anuncios (Z-API)

**Contexto:** Comunidades WhatsApp tem 2 IDs diferentes na Z-API:

| Tipo | O que e | Usar pra disparo? |
|------|---------|-------------------|
| Community ID (pai) | Shell da comunidade — so admins, ~2 pessoas | **NUNCA** |
| Announcement Group ID | Grupo visivel com todos os membros | **SEMPRE** |

- O endpoint `/communities` retorna o **ID-pai**
- O endpoint `/groups` retorna os **sub-grupos**, incluindo o announcement group (flag `isGroupAnnouncement`)
- Enviar pro ID-pai "funciona" (retorna messageId) mas a mensagem NAO aparece pros membros

**Como descobrir o ID correto:**
```bash
curl -s ".../groups" -H "Client-Token: {{ZAPI_CLIENT_TOKEN}}" | python3 -c "
import json, sys
for g in json.load(sys.stdin):
    if g.get('isGroupAnnouncement'):
        print(f\"{g.get('phone')} | {g.get('name')}\")"
```

---

## REGRA-013: Normalizar phone SEMPRE antes de operar contatos WhatsApp

**Contexto:** Diferentes tabelas e sistemas armazenam telefones em formatos diferentes. WhatsApp usa formato internacional so digitos: `55DDDNUMERO` (ex: `558599967696`). Outras tabelas podem armazenar formatado: `(85) 99996-7696`.

**Procedimento de normalizacao:**
1. Remover tudo que nao e digito
2. Se 10-11 digitos (sem country code): adicionar `55` no inicio
3. Resultado final: 12-13 digitos, so numeros, comecando com `55`

**NUNCA usar telefone formatado direto em queries/upserts na tabela de contatos WhatsApp.** Sempre normalizar primeiro.

**PROBLEMA 8/9 DIGITOS (celular BR):**
Celulares brasileiros podem aparecer com 13 digitos (com nono digito) ou 12 digitos (sem nono digito) dependendo da fonte. Isso causa contatos duplicados e agent_id errado.

**Solucao:** Antes de upsert, SEMPRE checar se ja existe contato com formato alternativo (8 ou 9 digitos). Funcao `getAltPhone`: 13dig → remove 3o digito apos DDD; 12dig → adiciona 9 apos DDD.

---

## REGRA-014: Mission Log obrigatorio ao final de cada trabalho/sessao + revisao mensal

**Contexto:** Todo trabalho concluido (missao individual ou sessao multi-tarefa) DEVE ser registrado no Mission Log (`data/gestor-infra-missions.md`). Sem excecao. O Mission Log e a memoria operacional do agente — sem ele, nao ha rastro, nao ha auditoria, nao ha extracao de padroes.

**Regra absoluta:**
- **Ao final de cada missao concluida:** registrar automaticamente entrada no Mission Log
- **Ao final de uma sessao de trabalho (varias missoes):** se por algum motivo nao registrou missao-a-missao, registrar bloco consolidado ANTES de encerrar a sessao
- **Se o usuario encerrar a sessao sem ter registrado:** sugerir explicitamente: "Quer que eu registre o que fiz hoje no Mission Log antes de fechar?"

**Nunca encerrar sessao sem pelo menos perguntar.** Registro pode ser simples ("1 linha por missao"), mas tem que existir.

**Formato de entrada:**
```
| N | YYYY-MM-DD | Missao (resumo curto) | Resultado (ok/parcial/falhou) | Sim/Nao | Observacoes |
```

---

### Revisao mensal obrigatoria

**Contexto:** Mission Log cresce rapido. Sem revisao periodica, vira lixeira de historia e perde utilidade. A revisao serve pra: extrair padroes, consolidar aprendizados em SOPs, arquivar ou deletar entradas velhas irrelevantes.

**Procedimento automatico:**
- Mission Log tem no topo um campo `Last Review: YYYY-MM-DD`
- A cada inicio de sessao, o Gestor de Infra Arcane DEVE checar esse campo
- Se passou mais de 30 dias desde `Last Review`: lembrar o usuario explicitamente

**Formato da lembranca:**
> "Opa, faz mais de 30 dias que a gente nao revisa o Mission Log. Quer que eu ajude a olhar pra ver o que da pra limpar, arquivar ou virar SOP? Assim nao fica acumulando eternamente."

**Pos-revisao:** atualizar o campo `Last Review` pra data de hoje e registrar uma linha no proprio Mission Log tipo: `| — | YYYY-MM-DD | Revisao mensal do Mission Log | X entradas arquivadas, Y viraram SOP | — | — |`

**Por que:** Mission Log sem revisao vira dump. Revisao mensal mantem ele vivo e util — cada entrada velha que sobrou e entrada que ainda tem valor operacional.

---

## Registro de Incidentes

| # | O que aconteceu | Fix | Regra criada |
|---|----------------|-----|-------------|
| 1 | Leads com prompt errado por agent_id nao setado antes do envio | Setar agent_id ANTES do disparo (PATCH contato) | REGRA-001 |
| 2 | Agente morto por 2 dias (SyntaxError no n8n) | Validar sintaxe JS antes de PUT | REGRA-012 |
| 3 | Disparo pro community-pai, ninguem recebeu | Usar announcement group ID | REGRA-CRITICA |
| 4 | Registros com phone formatado, leads com prompt errado | Normalizar phone, refazer upsert | REGRA-013 |
| 5 | Contatos duplicados por 8/9 digitos (celular BR) | Merge duplicados + fallback alternativo | REGRA-013 |
| 6 | Trabalho sem rastro — sem Mission Log, sem auditoria e historico perdendo valor | Registro obrigatorio ao final de cada missao/sessao + revisao mensal | REGRA-014 |
