# L4 — Campanha (template)

> **Onde vive:** tabela `bia_campaign_data` no Supabase, coluna `campaign_text`, linha com `agent_id='bia'` (mesmo texto pra todos os agents).
> **Quando muda:** a cada novo ciclo/campanha. Atualiza via UPDATE no Supabase (não no n8n).
> **Como usa:** o WF-AGENT-CORE-CLOUD lê via RPC `get_campaign_data(p_agent_id)`, injeta como `<campanha>...</campanha>` no system prompt.

> **Placeholders dinâmicos que VOCÊ NÃO preenche aqui** — são substituídos em runtime pelo Context Manager lendo do `workshop_config`:
> - `{{data_full_text}}` — ex: "Sábado e Domingo, 15 e 16 de julho de 2026, das 10h às 19h"
> - `{{data_short_text}}` — ex: "15 e 16/07"
> - `{{data_event_range}}` — ex: "15-16/07/2026"
> - `{{data_template_var}}` — versão sem ano
> - `{{event_time_start}}` / `{{event_time_end}}` — ex: "10h" / "19h"
> - `{{duracao}}` — ex: "2 dias"
> - `{{end_signup_text}}` — ex: "terça 14/07/2026"
>
> **Use esses placeholders no texto** — assim quando você fizer shift de ciclo (`workshop-cycle.mjs`), a Bia já fala data nova sem editar nada.

> **Placeholders que VOCÊ preenche** (substituir manualmente neste arquivo):
> - `{{NOME_AGENTE}}`, `{{NOME_EXPERT}}`, `{{INSTAGRAM_EXPERT}}`
> - `{{NOME_PRODUTO}}`, `{{NOME_PRODUTO_CURTO}}`
> - `{{LINK_DESCONTO_RECOVERY}}`, `{{LINK_DESCONTO_CONVITE}}`, `{{LINK_CHECKOUT_NORMAL}}`
> - `{{FORMAS_PAGAMENTO}}` (ex: "Cartão ou Pix")
> - `{{POLITICA_GARANTIA}}` (ex: "Se assistir os 2 dias e não gostar, reembolso integral em 7 dias")
> - `{{PROMESSA_PRODUTO}}`, `{{MECANISMO_PRODUTO}}`, `{{PARA_QUEM}}`, `{{NAO_PRECISA}}`
> - `{{TOPICOS_CONTEUDO}}` (lista de 4-8 bullets do que o lead vai aprender)
> - `{{OBJECOES_E_RESPOSTAS}}`
> - `{{PROVA_SOCIAL}}` (lista de 3-5 itens — números, clientes famosos, resultados)
> - `{{VALORES_EXPERT}}` (lista de 6-10 valores que você defende)
> - `{{NAO_TOLERA}}` (lista de 3-5 coisas que você NÃO acredita)
> - `{{POSICIONAMENTO_EXPERT}}` (5-6 linhas — problema central, causa, promessa, mecanismo, tom, inimigos)
> - `{{PERSONAS_PUBLICO}}` (2-4 personas com dor, medo, desejo, gatilho de comunicação)

---

## Template do `campaign_text`

> Cole este conteúdo na coluna `campaign_text` da tabela `bia_campaign_data`, após substituir todos placeholders manuais. Os `{{data_*}}` deixa como estão — vão ser substituídos em runtime.

```
PRODUTO: {{NOME_PRODUTO}}
FORMATO: {{duracao}} (ao vivo e online)
DATA: {{data_full_text}}
PRAZO INSCRICAO: até {{end_signup_text}}

PRECOS: NÃO HARDCODED. {{NOME_AGENTE}} NÃO sabe valor — só sabe que tem desconto na Fase 3 (recovery/convite). Lote atual definido por ciclo, pode mudar a qualquer momento. NUNCA invente preço.

LINK_DESCONTO_RECOVERY: {{LINK_DESCONTO_RECOVERY}}
LINK_DESCONTO_CONVITE: {{LINK_DESCONTO_CONVITE}}
LINK_CHECKOUT_NORMAL: {{LINK_CHECKOUT_NORMAL}}
INSTRUCAO_LINK: {{NOME_AGENTE}} envia o link de desconto na Fase 3 (ou direto no MODO ESPECIAL). O lead clica e cai no checkout com desconto já aplicado — não precisa digitar cupom.

PAGAMENTO: {{FORMAS_PAGAMENTO}}
GARANTIA: {{POLITICA_GARANTIA}}

QUEM_ENSINA: {{NOME_EXPERT}} — [3-4 linhas com posicionamento, bio resumida, autoridade, prova]

PROMESSA: {{PROMESSA_PRODUTO}}
MECANISMO: {{MECANISMO_PRODUTO}}
PARA_QUEM: {{PARA_QUEM}}
NAO_PRECISA: {{NAO_PRECISA}}

CONTEUDO:
{{TOPICOS_CONTEUDO}}

OBJECOES_ESPECIFICAS:
{{OBJECOES_E_RESPOSTAS}}
# Exemplo de formato:
# - "Não entendo de [tema]" → "É justamente pra quem não é técnico. {{NOME_EXPERT}} mostra tudo na prática, do zero."
# - "Tá caro" → "Tá no lote mais barato agora. E se não gostar, {{POLITICA_GARANTIA}}."
# - "Não tenho tempo" → "São {{duracao}}. E o que você vai aprender economiza meses de tentativa e erro."

PROVA_SOCIAL:
{{PROVA_SOCIAL}}
# Exemplo:
# - X clientes famosos validam {{NOME_EXPERT}}
# - +R$ Y milhões em vendas
# - N+ seguidores nas redes
# - Referência em [tema] no Brasil

PUBLICO_REAL:
{{PUBLICO_REAL}}
# Exemplo (se você tem dados de pesquisa):
# - 77% operam sozinhos
# - 74% vieram pela IA, mas dor real é falta de clareza (21%) e não saber vender (27%)
# - Público traumatizado com promessas (transparência = X menções)
# - 31% entraram por valores cristãos

VALORES_EXPERT:
{{VALORES_EXPERT}}
# Exemplo:
# - Negócio é extensão de propósito, não máquina de ganhar dinheiro.
# - Todo expert carrega algo que o mundo precisa ouvir.
# - Dinheiro é consequência de entregar valor real.
# - Você não precisa ter tudo resolvido pra começar.
# - Excelência é inegociável.

NAO_TOLERA (posicionar-se apenas se o assunto surgir, nunca confrontar):
{{NAO_TOLERA}}
# Exemplo:
# - Atalhos, fórmulas mágicas, "fique rico rápido"
# - Promessas vazias e gurus que vendem ilusão
# - Tratar pessoas como números

POSICIONAMENTO_EXPERT:
{{POSICIONAMENTO_EXPERT}}
# Exemplo (formato livre):
# - Problema central: IRRELEVÂNCIA — [expert que sabe que pode ser gigante mas não é]
# - Causa oculta: Falta de clareza + execução técnica + sobrecarga
# - Promessa: Construir [outcome] sem depender de [dependência]
# - Mecanismo: Método PMI — Propósito + Marketing + IA
# - Tom: Direto, sem frescura, confrontador quando precisa, parceiro. Nunca guru, nunca coach
# - Inimigos: O sistema que apagou seus talentos. O lançador que rouba autonomia do expert
# - Frase-chave: "Você já tem o ouro. Falta a pá."

PERSONAS_PUBLICO (adapte a conversa ao perfil detectado):
{{PERSONAS_PUBLICO}}
# Exemplo:
# Persona 1 — Renata, a Expert Travada (~40%):
# - 42 anos, psicóloga, 15+ anos de experiência
# - Dor: "Eu sei que tenho ouro nas mãos. Só não sei como vender."
# - Medo: Investir e perder de novo.
# - Desejo: Reconhecimento. Ser referência.
# - Gatilho: Clareza + acompanhamento + prova social de alguém como ela.
# - Como falar: Validar antes de instruir.
#
# Persona 2 — Marcos, o Aspirante (~25%):
# [...]

COMUNICACAO:
- Validação antes de instrução: "Eu sei que você tem conhecimento. O problema não é você."
- Simplificação: menos opções, menos ferramentas. "Faça isso. Depois isso."
- Prova social específica: não "Fulano faturou 6 dígitos" mas "Fulana era psicóloga e agora..."
- [Outros princípios da sua comunicação]

PALAVRAS_QUE_CONVERTEM: clareza, estrutura, passo a passo, método validado, propósito, acompanhamento, previsibilidade [adapte]
PALAVRAS_QUE_REPELEM: fique rico rápido, sem esforço, fórmula mágica, hack, atalho, automático, resultados garantidos, milhões em X dias [adapte]
```

---

## Como atualizar no Supabase

Após preencher os placeholders manualmente, salva em um arquivo `L4-preenchido.md` e roda:

```bash
L4_TEXT=$(cat L4-preenchido.md)

curl -s -X PATCH "$SUPA_URL/rest/v1/bia_campaign_data?agent_id=eq.bia" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg t "$L4_TEXT" '{campaign_text: $t}')"
```

Validar:

```bash
curl -s "$SUPA_URL/rest/v1/bia_campaign_data?agent_id=eq.bia&select=campaign_text" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | jq -r '.[0].campaign_text' | head -30
```

Deve mostrar o início do seu texto.

---

## Quando atualizar?

| Situação | O que atualizar |
|----------|-----------------|
| Mudou data/horário/duração do evento | NÃO mexer aqui — usar `workshop-cycle.mjs shift` |
| Mudou preço/lote | NÃO precisa atualizar (preço não vive aqui) |
| Mudou link de checkout | UPDATE `campaign_text` |
| Mudou política de garantia | UPDATE `campaign_text` |
| Mudou objeções/prova social | UPDATE `campaign_text` |
| Trocou produto (campanha completa) | UPDATE `campaign_text` inteiro com novo conteúdo |
| Adicionou persona / mudou tom | UPDATE `campaign_text` |

---

## Não confundir L3 com L4

- **L3 (metodologia):** estrutura da venda. Fases, LAVE, modo especial. **Não muda** quando você troca de campanha.
- **L4 (campanha):** dados específicos. Produto, preço, objeções, prova social. **Muda toda campanha.**

Se você se pegou alterando L3 pra mudar uma objeção específica ou um link — está errado. Atualiza L4.
