# Passo 5 — Prompts L1+L2+L3+L4 (Customizar com Seus Dados)

> Tempo estimado: 60-90 minutos
> O que entrega: Prompts L2+L3+L4 customizados pra você, injetados no n8n via API, validados sem erro de JS.

> **Nota sobre os 4 agent_ids (bia, bia-recovery, bia-boas-vindas, bia-convite):** o node "Configuracao do Agente" do WF-AGENT-CORE-CLOUD carrega TODOS os 4 prompts L3 no objeto `AGENT_L3`. Mesmo que neste kit você só vá usar `bia` (triage default) — porque os outros agent_ids são ativados por workflows de negócio (kit-compras, kit-recovery, kit-dispatcher) que você ainda não instalou — **vale a pena customizar todos os 4 agora**. Quando você instalar os kits depois, os prompts já estão prontos.
>
> Se quer fazer só o mínimo agora: customize `prompts-template/L3-triage.tmpl.md` (que é o `bia` default) + L1-L2 + L4. Os outros 3 ficam com placeholders e você atualiza quando precisar.

---

## A anatomia das 4 camadas (resumo)

```
+-----------------------+
| L4 — CAMPANHA         |  ← Dados específicos: produto, datas, links, valores
+-----------------------+    Vive em: bia_campaign_data (Supabase)
| L3 — OBJETIVO         |  ← Missão do agente: metodologia de venda/recovery/onboarding
+-----------------------+    Vive em: AGENT_L3[agent_id] dentro do node "Configuracao do Agente" no WF-AGENT-CORE-CLOUD
| L2 — PERSONA          |  ← Quem é seu agente: nome, personalidade, valores
+-----------------------+    Vive em: hardcoded no início do prompt no node "Configuracao do Agente"
| L1 — PLATAFORMA       |  ← Regras WhatsApp: formato, anti-IA, segurança
+-----------------------+    Vive em: hardcoded antes da L2. Quase nunca muda.
```

| Camada | Pra você (aluno) | Onde fica fisicamente |
|--------|-------------------|------------------------|
| L1 | **Copia direto** + troca 2 placeholders ({{WHATSAPP_SUPORTE}}, {{EMAIL_SUPORTE}}) | n8n: WF-AGENT-CORE-CLOUD > node "Configuracao do Agente" |
| L2 | **Customiza pesado** — nome do agente, personalidade, valores | n8n: mesmo node |
| L3 | **Customiza médio** — metodologia universal, troca placeholders e exemplos | n8n: mesmo node, dentro de `AGENT_L3[agent_id]` |
| L4 | **Customiza tudo** — produto, datas, links, etc. Usa placeholders `{{data_full_text}}` etc | Supabase: `bia_campaign_data` |

---

## 5.1 — Preparar os arquivos locais (templates preenchidos)

Você vai trabalhar em 5 arquivos locais que vão na pasta `prompts-template/`. Os arquivos estão lá com placeholders `{{NOME_AGENTE}}`, `{{NOME_EXPERT}}`, etc. **Preencha cada um** e salve.

Sugestão de fluxo:

1. Copie `prompts-template/L1-L2-base.md` pra um local de trabalho (ex: `~/meu-bia/prompts/L1-L2.md`)
2. Substitua todos `{{PLACEHOLDERS}}` pelos seus valores
3. Faça o mesmo pra `L3-recovery.tmpl.md`, `L3-boas-vindas.tmpl.md`, `L3-convite.tmpl.md`, `L4-campanha.tmpl.md`
4. Antes de injetar no n8n, valide JS (próxima seção)

### Placeholders globais que vão aparecer em vários arquivos

Faça uma tabela do seu lado com os valores:

```
{{NOME_AGENTE}}            = ex: "Bia", "Sofia", "Lia" — nome feminino curto
{{NOME_EXPERT}}            = ex: "Euriler", "Tati Mota" — pessoa que ensina/vende
{{NOME_EMPRESA}}           = ex: "Arka", "Estúdio X"
{{INSTAGRAM_EXPERT}}       = ex: "@euriler"
{{WHATSAPP_SUPORTE}}       = ex: "11 99999-9999"
{{EMAIL_SUPORTE}}          = ex: "suporte@suamarca.com"
{{NOME_PRODUTO}}           = ex: "Workshop Negócio Digital do Futuro", "Imersão Vendas Inteligentes"
{{NOME_PRODUTO_CURTO}}     = versão sem "Workshop" — ex: "Negócio Digital do Futuro"
{{LINK_DESCONTO_RECOVERY}} = ex: https://pay.hotmart.com/SEU?off=XXX&sck=bia-recovery
{{LINK_DESCONTO_CONVITE}}  = ex: https://pay.hotmart.com/SEU?off=XXX&sck=bia-convite
{{LINK_CHECKOUT_NORMAL}}   = checkout sem desconto
{{LINK_GRUPO_WHATSAPP}}    = link do grupo oficial do evento
{{PROMESSA_PRODUTO}}       = 1 frase — ex: "Construir um sistema de IA pra teu negócio em 2 dias"
{{MECANISMO_PRODUTO}}      = 1 frase — ex: "Sistema Operacional de IA"
{{PUBLICO_ALVO_RESUMO}}    = 1 frase — ex: "Experts e profissionais liberais 35-54"
{{FORMAS_PAGAMENTO}}       = ex: "Cartão ou Pix"
{{POLITICA_GARANTIA}}      = ex: "Reembolso integral em 7 dias se não gostar"
```

---

## 5.2 — Validar JS antes de injetar no n8n (REGRA-012)

> **REGRA-012:** o node "Configuracao do Agente" no n8n armazena prompts como strings JavaScript single-quoted com `\n` escapado. **Texto com newlines reais = SyntaxError = workflow morto silenciosamente.**
>
> Histórico: BUG-015 (14/03/2026) — Bia morta por 2 dias por causa disso. BUG-019 (16/03) — mesma coisa. Por isso esta seção existe.

### Procedimento obrigatório:

1. **Escreva o prompt em texto normal** (markdown, com newlines reais)
2. **Converta pra string JS escapada** usando `JSON.stringify()`:

```bash
# Salva texto em arquivo
cat > /tmp/L3-recovery-raw.txt <<'EOF'
SEU TEXTO L3 RECOVERY COMPLETO AQUI

COM MÚLTIPLAS LINHAS

E COISAS COMO ASPAS "TIPO ISSO" E ALL.
EOF

# Converte pra JS string (com \n escapados)
node -e "console.log(JSON.stringify(require('fs').readFileSync('/tmp/L3-recovery-raw.txt', 'utf8')))" > /tmp/L3-recovery-escaped.txt

# Validar que é JS válido
node -e "const s = $(cat /tmp/L3-recovery-escaped.txt); console.log('OK', s.length, 'chars')"
# Se imprime "OK <numero> chars": tá válido
# Se dá SyntaxError: tá quebrado, refaz
```

3. **Cole a string escapada** dentro do objeto `AGENT_L3` no node:

```javascript
const AGENT_L3 = {
  'bia-recovery': "<conteúdo escapado aqui — com \\n>",
  'bia-boas-vindas': "...",
  'bia-convite': "...",
  'bia': "..."
};
```

4. **Valide o JS inteiro do node ANTES de mandar pra n8n:**

```bash
# Salva o código do node todo num arquivo
cat > /tmp/agent-config-node.js <<'EOF'
// Cole aqui o JS COMPLETO do node "Configuracao do Agente"
const AGENT_L3 = {
  'bia-recovery': "...",
  ...
};

// (resto do código do node)
EOF

# Validar
node -c /tmp/agent-config-node.js
# Se silencioso: JS válido, pode subir
# Se imprime SyntaxError: pegou o bug ANTES de quebrar produção
```

---

## 5.3 — Injetar no n8n via API

Você tem 2 opções:

### Opção A — UI do n8n (manual, mais simples pra primeira vez)

1. n8n editor > WF-AGENT-CORE-CLOUD > abre node "Configuracao do Agente"
2. Cola o JS completo (com `AGENT_L3` preenchido com seus prompts escapados)
3. Save
4. **Cache cycle obrigatório** (REGRA-006) — deactivate + activate via API (ver `03-workflows.md` seção 4.5)

### Opção B — Via API n8n (mais rápido se você for iterar muito)

```bash
# 1. Pega workflow atual
curl -s "$N8N_URL/api/v1/workflows/$AGENT_CORE_ID" \
  -H "X-N8N-API-KEY: $N8N_KEY" > /tmp/wf-agent-core.json

# 2. Edita o node "Configuracao do Agente":
#    - Localiza no JSON: .nodes[] | select(.name == "Configuracao do Agente")
#    - Substitui o campo .parameters.jsCode com seu código novo (já escapado)
#    Use seu editor preferido (jq, código Node.js, etc).

# 3. Sobe via PUT
curl -s -X PUT "$N8N_URL/api/v1/workflows/$AGENT_CORE_ID" \
  -H "X-N8N-API-KEY: $N8N_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/wf-agent-core-modified.json

# 4. Cache cycle (deactivate + activate)
```

---

## 5.4 — Injetar L4 (`bia_campaign_data` no Supabase)

> A camada L4 não vai pro n8n. Vai pra tabela `bia_campaign_data` no Supabase. O WF-AGENT-CORE-CLOUD lê via RPC `get_campaign_data` em runtime.

Você já criou 1 linha esqueleto no passo 1.4. Agora vai SUBSTITUIR pelo conteúdo real, usando o template `prompts-template/L4-campanha.tmpl.md` preenchido.

```bash
# Salva o L4 customizado num arquivo
# (depois de preencher todos placeholders no L4-campanha.tmpl.md)

L4_TEXT=$(cat /caminho/pro/seu/L4-campanha-preenchido.md)

# UPDATE na tabela
curl -s -X PATCH "$SUPA_URL/rest/v1/bia_campaign_data?agent_id=eq.bia" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg t "$L4_TEXT" '{campaign_text: $t}')"
```

> **Atenção aos placeholders dinâmicos no L4:** se você usar `{{data_full_text}}`, `{{duracao}}`, `{{end_signup_text}}`, etc. dentro do texto L4, eles SÃO substituídos em runtime pelo Context Manager — você NÃO precisa atualizar manualmente cada vez que mudar data do evento. Apenas atualize `workshop_config` via `scripts/workshop-cycle.mjs shift`.
>
> Mas se você escreveu data hardcoded ("dia 15 de julho de 2026") no L4, vai ter que UPDATE manual a cada ciclo. **Recomendado: use os placeholders.**

---

## 5.5 — REGRA-009 — Preços nunca no L3 (exceto via placeholder L4)

O L3 NUNCA deve ter preço hardcoded. Em vez de "o ingresso custa R$ 297", o L3 fala "o ingresso está no lote atual" e o L4 fornece o preço via prova social/objeção.

Por quê: preços mudam por lote, oferta, cupom. Se hardcoded no L3, ficam desatualizados sem você perceber.

Prática: o agente trabalha com "desconto especial" e links que já têm o desconto aplicado. Se lead perguntar valor normal, direciona pra página de checkout normal.

---

## 5.6 — REGRA-014 — Todo link de checkout tem `&sck=bia-{agente}`

Cada link que o agente envia deve ter UTM `sck` pra atribuição de venda:

| Agente | UTM |
|--------|-----|
| bia-recovery | `&sck=bia-recovery` |
| bia-boas-vindas | `&sck=bia-boasvindas` |
| bia-convite | `&sck=bia-convite` |

Sem isso, atribuição quebra (campo `active_agent_id` é "zumbi" — nunca expira, atribui errado).

No checkout, o sck cai no parâmetro `src` do webhook Hotmart. O workflow COMPRAS totais lê isso e atribui à Bia.

---

## 5.7 — Checklist final

- [ ] Tabela de placeholders globais preenchida com seus valores
- [ ] L1-L2-base.md customizado (só 2 placeholders) e validado
- [ ] L3-triage.tmpl.md customizado
- [ ] L3-recovery.tmpl.md customizado (atenção ao MODO ESPECIAL e ao desconto da Fase 3)
- [ ] L3-boas-vindas.tmpl.md customizado (links de upsell, formato aulas, etc)
- [ ] L3-convite.tmpl.md customizado
- [ ] Tudo passou em `node -c` sem erro de sintaxe JS
- [ ] Conteúdo injetado no node "Configuracao do Agente" do WF-AGENT-CORE-CLOUD
- [ ] Cache cycle executado (deactivate + activate)
- [ ] L4 customizado e UPDATE feito em `bia_campaign_data`
- [ ] Todos links têm `&sck=bia-{agente}` correspondente
- [ ] Zero preços hardcoded no L3

---

**Próximo passo:** [`06-templates.md`](./06-templates.md) — submeter templates Cloud API (boas-vindas, convite, recovery T1-T6) pra Meta aprovar.
