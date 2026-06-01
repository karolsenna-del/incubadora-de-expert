---
task: "Construir Downsell Pos-Evento (Meteorico)"
responsavel: "@copywriter-mensagens"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "documento-mestre.md (referencia da oferta de continuidade SE definida — caso contrario, agente entrega placeholder com estrutura preservada)"
Saida: "downsell-pos-evento.md (estrutura Meteorico do metodo + 7 angulos diarios + ficha interesse + comercial + encerramento — copies como PLACEHOLDER se oferta de continuidade nao foi definida)"
Checklist:
  - "Verificar se documento mestre tem oferta de continuidade definida"
  - "SE SIM: redigir copies finais aplicando estrutura Meteorico (VOL-08), 7 angulos diarios, gramatica de comercial humano + chatbot api"
  - "SE NAO: entregar arquivo placeholder com estrutura preservada (Meteorico, 7 angulos, ficha interesse, comercial, encerramento), TODO no header explicito"
  - "Quando placeholder: cada secao tem `{{COPY TBD — definir oferta primeiro}}` no lugar do texto, mas estrutura intacta"
  - "Validacao contra RC-014 (40-60% das vendas pos-evento — recuperacao e estrategica)"
  - "Output aprovado pelo usuario (mesmo placeholder precisa aprovacao explicita do escopo)"
execution_type: "interactive"
---

# Task: Construir Downsell Pos-Evento (Meteorico)

> ⚠️ **NAO CONFUNDIR COM RECUPERACAO DE INGRESSO (`construir-recuperacao-ingresso`)**
>
> - **Esta task (downsell pos-evento):** roda DEPOIS do evento. Vende oferta alternativa (Meteorico) pra quem assistiu o pitch e nao comprou o produto principal. 7 angulos diarios + ficha interesse + comercial humano + encerramento.
> - **Recuperacao de Ingresso (`construir-recuperacao-ingresso`):** roda DURANTE a captacao, ANTES do evento. Vende o INGRESSO (nao o produto principal nem o downsell) pra lead que abandonou checkout. Cadencia de ate 6 disparos comecando 15min apos abandono.
>
> Trigger, momento e produto vendido sao DIFERENTES. Nao misturar.

## Executive Summary

Pipeline pra produzir copies de downsell pos-evento (Meteorico). Aplicar estrutura Meteorico (VOL-08) + 7 angulos diarios + ficha de interesse + comercial humano + encerramento.

**CRITICO:** se oferta de continuidade nao esta definida no doc mestre, NAO inventa copies. Entrega placeholder com estrutura preservada e TODO claro. Estrutura > Conteudo Falso.

## Pipeline

```
Doc mestre + (opcional) oferta definida
   |
   v
[Verificar se oferta de continuidade existe]
   |
   +-- SIM -> redigir copies finais
   +-- NAO -> entregar PLACEHOLDER estrutural
   |
   v
[Estrutura preservada]:
   Meteorico (downsell)
   7 angulos diarios
   Ficha de interesse
   Comercial humano
   Encerramento
   |
   v
[Validar RC-014]
   |
   v
[Aprovacao explicita]
```

## Steps

### Step 1: Verificar Oferta de Continuidade

Le doc mestre. Procura:
- Bloco 6 (metas) tem produto pos-evento listado?
- Bloco 1 (proposta) menciona produto de continuidade?
- Bloco 5 (cronograma) tem disparos pos-evento (T+1d a T+7d) com tipo "recuperacao" / "downsell"?

**SE oferta definida:** prossegue pra Step 2A (redigir copies finais).
**SE oferta nao definida:** prossegue pra Step 2B (placeholder).

### Step 2A: Redigir Copies Finais (oferta definida)

Aplica estrutura Meteorico:

**Meteorico (downsell):**
- Tipicamente oferta secundaria com ticket menor (~30-40% do principal)
- Apresentada T+24h a T+48h apos evento encerrar
- Justificativa: "voce nao quis o programa completo, mas eu fiz uma versao menor pra voce"

**7 Angulos Diarios (T+1d a T+7d):**
Cada dia, um angulo diferente do problema/solucao:

| Dia | Angulo | Foco |
|-----|--------|------|
| D+1 | Reabrir oferta | "Ultima chance bonus X" |
| D+2 | Identificacao | "Sei que voce ta na duvida porque..." |
| D+3 | Caso real | Depoimento de cliente que comprou e teve resultado |
| D+4 | Indignacao | "Nao faz sentido voce continuar com [dor]" |
| D+5 | Comparativo | "Voce vai gastar [X] tentando sozinha vs [Y] no programa" |
| D+6 | Autoridade / numero | "+ X clientes ja passaram" |
| D+7 | Encerramento | "Ultimo dia. Apos isso, fecha por X meses" |

**Ficha de Interesse:**
Formulario gatilho pra leads quentes — mensagem "se voce ta interessada mas com duvida especifica, preenche [link]".

**Comercial Humano:**
Script de abordagem 1-a-1 quando lead preenche ficha. Tom transparente, sem pressao agressiva.

**Encerramento:**
Mensagem final de encerramento da janela de oferta. "A oferta fechou. Proxima abertura em X meses."

### Step 2B: Entregar PLACEHOLDER (oferta nao definida)

Estrutura preservada, copies como TBD:

```markdown
# Downsell Pos-Evento (Meteorico) — PLACEHOLDER

[!] STATUS: PLACEHOLDER
[!] OFERTA DE CONTINUIDADE NAO DEFINIDA NO DOC MESTRE
[!] ESTRUTURA PRESERVADA — COPIES SERAO ESCRITAS QUANDO OFERTA FOR DEFINIDA

---

## Meteorico (Downsell)

**Quando:** T+24h a T+48h pos-evento
**Canal:** Email + Grupo WA
**Variaveis:** {{oferta_principal_nome}}, {{ticket_meteorico}}, {{link_meteorico}}

{{COPY TBD — definir oferta primeiro}}

---

## 7 Angulos Diarios

### D+1 — Reabertura da Oferta
{{COPY TBD — definir oferta primeiro}}

### D+2 — Identificacao
{{COPY TBD — definir oferta primeiro}}

### D+3 — Caso Real
{{COPY TBD — definir oferta primeiro}}

### D+4 — Indignacao
{{COPY TBD — definir oferta primeiro}}

### D+5 — Comparativo
{{COPY TBD — definir oferta primeiro}}

### D+6 — Autoridade
{{COPY TBD — definir oferta primeiro}}

### D+7 — Encerramento
{{COPY TBD — definir oferta primeiro}}

---

## Ficha de Interesse

**Quando:** Disparada T+2d
**Canal:** Email + grupo
**Forma:** link pra formulario simples (dor especifica + duvida)

{{COPY TBD — definir oferta primeiro}}

---

## Comercial Humano

**Quando:** Lead preenche ficha
**Canal:** WhatsApp 1-a-1 (api individual ou pessoal)
**Tom:** transparente, sem pressao agressiva

{{COPY TBD — definir oferta primeiro}}

---

## Encerramento da Janela

**Quando:** D+7 fim do dia
**Canal:** Email + grupo
**Tom:** fechamento limpo, sem clima de pressao terminal

{{COPY TBD — definir oferta primeiro}}

---

## TODO ATIVOS

- [ ] Definir oferta de continuidade pos-evento (Euriler / aluno decide)
- [ ] Definir ticket Meteorico (~30-40% do principal)
- [ ] Definir validade da janela (7 dias e padrao, mas pode variar)
- [ ] Apos definicao, retornar a esta task pra redigir copies finais
```

### Step 3: Validar RC-014

RC-014: 40-60% das vendas vem pos-evento.

- Se oferta DEFINIDA: copies precisam estar boas o suficiente pra RC-014 ser atingida
- Se oferta NAO definida: marca explicitamente que RC-014 fica em risco ate definir

### Step 4: Aprovacao Explicita

**Se oferta definida:**
```
Recuperacao de venda redigida (Meteorico + 7 angulos + ficha + comercial + encerramento).

Voce APROVA?

(SIM / NAO + ajuste especifico)
```

**Se placeholder:**
```
Recuperacao de venda entregue como PLACEHOLDER.

Estrutura preservada (Meteorico + 7 angulos + ficha + comercial +
encerramento). Copies marcadas como TBD ate definir oferta de
continuidade.

Voce APROVA o ESCOPO desse placeholder? Aprovacao explicita
significa: voce entende que sem oferta definida, nao vamos
disparar essas mensagens — RC-014 fica em risco.

PROXIMO PASSO sugerido: Voce volta pro Estrategista pra definir
oferta de continuidade no doc mestre. Apos isso, retorna a essa
task que eu redijo copies finais.

(SIM / NAO + ajuste de escopo)
```

## Veto Conditions

- Inventar copies sem oferta definida → recusa, entrega placeholder
- Estrutura Meteorico/7 angulos quebrada → ajusta
- Tom de pressao terminal no encerramento → ajusta
- Comercial humano com script agressivo → ajusta
- Aprovacao implicita → exige SIM/NAO

## Output Esperado

Arquivo `downsell-pos-evento.md` com:
- Status (PLACEHOLDER ou FINAL)
- Header com TODO claro se placeholder
- Estrutura completa (Meteorico + 7 angulos + ficha + comercial + encerramento)
- Copies finais OU `{{COPY TBD}}` por secao
- Lista de TODOs ativos (se placeholder)
- Linha de aprovacao

## Regras

- NUNCA inventa copies sem oferta definida
- Estrutura SEMPRE preservada (mesmo em placeholder)
- TODO claro no header se placeholder
- RC-014 sempre citada
- Comercial humano: tom transparente, sem pressao
- Encerramento: limpo, nao terminal
