# Template — Sequência de Antecipação Pré-Evento

> **KB do Squad LPago Arcane — Templates**
> Tratamento: built from scratch (baseado em `data/metodo/06-antecipacao.md` + referências reais NDF em `data/exemplos/`)
> Carregado por: copywriter-mensagens

---

## Propósito

Template do output da task `construir-sequencia-antecipacao`. Define o conjunto completo de mensagens pré-evento (T-7 a T-1) — cronograma + copies prontas em 3 canais (WhatsApp grupo + WhatsApp API individual + email).

A sequência de antecipação serve a 3 objetivos do método:
1. **Acolher** quem comprou (boas-vindas + redução de buyer's remorse)
2. **Aquecer** pro conteúdo (preparar mente + criar expectativa)
3. **Aumentar comparecimento** (combater o gap natural compra→evento)

Sem antecipação, comparecimento cai 40-60% (RC-013).

---

## Pré-requisitos (input do Estrategista)

Antes de redigir, confirmar que o documento mestre tem:
- Bloco 4 (Cronograma operacional) com data evento + data início vendas
- Bloco 5 (Cronograma de disparos) com #, quando, canal, tipo, intenção por disparo

Se faltar Bloco 5, voltar pro Estrategista. Sem cronograma, copy fica solta.

---

## Estrutura do Output

```markdown
# Sequência de Antecipação — {Nome do Lançamento}

**Data do evento:** {data}
**Data início vendas:** {data}
**Janela de antecipação:** T-{N}d até T-1d
**Canais ativos:** {grupo / api / email}
**Cliente:** {Euriler ou aluno + nicho}
**Versão:** v{N}
**Última atualização:** {data}

---

## Sumário do Cronograma

| # | Quando | Canal | Tipo | Intenção | Status |
|---|--------|-------|------|----------|--------|
| 1 | T-7d 18h | grupo | boas-vindas | acolher + setup expectativa + 1º upsell formato aulas | redigida |
| 2 | T-5d 10h | api individual | check-in | confirmar presença | redigida |
| 3 | T-3d 10h | grupo | lembrete + setup ferramenta | preparar prática + 2º upsell | redigida |
| ... | ... | ... | ... | ... | ... |

---

## Disparos Detalhados

### Disparo #1 — {Nome curto}

**Quando:** T-{N}d às {hora}
**Canal:** {grupo / api individual / email}
**Tipo:** {boas-vindas / lembrete / hype / FOMO / setup / upsell / link / encerramento}
**Filtros:** {se aplicável — ex: "filter_formato_aulas = TRUE (não comprou)"}
**Variáveis dinâmicas:** {{first_name}}, {{data_evento_texto}}, {{link_grupo}}, etc.

**Objetivo do método:** {qual fase da antecipação serve, conforme `data/metodo/06-antecipacao.md`}

**Copy:**

```
{texto literal da mensagem, formatado pro canal}

{quebras de linha conforme tom Euriler}

{negrito *texto*, itálico _texto_ se aplicável a WhatsApp}
```

**Validação contra Regras Cardinais:**
- RC-{N}: {confirmação ou ressalva}
- RC-{N}: {idem}

**Notas:**
- {qualquer detalhe operacional — ex: "vincular Quick Reply do botão pro link do grupo"}

---

### Disparo #2 — {Nome curto}

(mesma estrutura)

---

(repetir pra todos os disparos do cronograma)
```

---

## Regras de Redação (PRESERVAR ao escrever)

### Tom Euriler (ver `data/metodo/REPERTORIO.md`)
- PT-BR casual, direto, sem corporatives
- Sem "nessa masterclass exclusiva", "investe em você", "resultados garantidos"
- Frases curtas. Quebra de linha gera respiro.
- Bordões ok com moderação ("É o que é", "Grava isso", "Anota isso")
- Negrito (*texto*) usado pra ÊNFASE real, não pra decoração

### Estrutura por canal

**WhatsApp grupo:**
- Headline forte na primeira linha (visível na lista de mensagens)
- Texto médio (50-300 palavras)
- Negrito pra pontos críticos
- Emojis com parcimônia (1-2 por mensagem max — começa com emoji se for mensagem de hype/urgência)
- CTA claro no final (link OU instrução)

**WhatsApp API individual (templates Meta):**
- Mais curtos (70-150 palavras body)
- Variáveis dinâmicas {{first_name}} pra personalização
- Quick Reply Buttons quando aplicável
- Header com vídeo OU imagem se aprovado

**Email:**
- Subject curto (40-60 chars), gera curiosidade ou estado de problema
- Body em texto puro (sem HTML pesado pra evitar SPAM)
- Custom fields {$name}, {$workshop_data}, {$link} preservados
- Assinatura padrão Euriler / aluno

### Variáveis comuns
- `{{first_name}}` — nome do destinatário
- `{{data_evento_texto}}` — "sábado dia 17 de maio"
- `{{link_grupo}}` — URL do grupo WhatsApp
- `{{meet_link}}` — URL da sala do evento
- `{{checkout_formato_aulas}}` — link da oferta
- `{{prazo_formato_aulas}}` — "até quinta às 23h59"
- `{$name}`, `{$workshop_nome}`, `{$workshop_data}`, `{$workshop_horario}`, `{$grupo_whatsapp}` (formato MailerLite)

---

## Mapeamento Cronograma → Tipos de Mensagem (do método)

Conforme `data/metodo/06-antecipacao.md` os 11 momentos de antecipação geralmente cobrem:

| Momento | Tipo de mensagem | Canal recomendado |
|---------|------------------|-------------------|
| 1. Boas-vindas | Acolhida + checklist + 1º upsell | grupo + api |
| 2. Confirmação | Check-in pessoal | api individual |
| 3. Setup ferramenta | Lembrete + prep técnica + 2º upsell | grupo |
| 4. Lembrete pessoal | Push individual | api individual |
| 5. Upsell pré-evento (filtro) | Última chance formato aulas | api (filter ativo) |
| 6. Hype | "AMANHÃ COMEÇA" | grupo |
| 7. Link antecipado | Acesso individual | api |
| 8. Link público | Acesso + intro | grupo |
| 9. "COMEÇOU" | Urgência | grupo |
| 10. Recovery atrasado | "Cadê você?" | api |
| 11. Encerramento dia | Acolhida + reabertura próximo dia | grupo |

Adaptar quantidade pro nicho/maturidade do aluno (mais conservador pra primeiro lançamento).

---

## Validação Final (checklist obrigatório)

Antes de entregar a sequência completa:

- [ ] Cada disparo tem cronograma + objetivo + copy + validação RCs
- [ ] Variáveis dinâmicas listadas explicitamente em cada disparo
- [ ] Filtros documentados quando aplicável (filter_formato_aulas)
- [ ] Tom Euriler preservado (sem infoprodutor genérico)
- [ ] Negrito usado pra ênfase real, não decoração
- [ ] CTAs claros e específicos
- [ ] Sequência cobre 3 fases (acolher / aquecer / aumentar comparecimento)
- [ ] Mensagens de upsell (formato aulas) com filtro ativo
- [ ] Compatibilidade com infraestrutura do aluno (dispatcher / MailerLite / Meta Cloud API)

---

## Anti-padrões (NÃO fazer)

- Mensagens longas demais (cansa, perde atenção)
- Promessas de "milagre" ou "transformação garantida"
- Linguagem corporativa ("nessa oportunidade única", "evento exclusivo")
- Repetição literal entre canais (cada canal tem voz própria)
- Esquecer de variar quem fala (texto pode rotacionar pra "você", "vocês", "amigo(a)")
- Ignorar contexto cultural do nicho (linguagem técnica demais pra público leigo)
- Misturar venda hard e antecipação (antecipação prepara, venda é no evento)

---

## Referências dentro da KB

- Protocolo completo de antecipação: `data/metodo/06-antecipacao.md`
- Regras Cardinais aplicáveis: RC-013 (comparecimento), RC-016 (order bump = upsell pré-evento), RC-018 (formato 2 dias)
- Tom Euriler: `data/metodo/REPERTORIO.md`
- Exemplo real de copies (NDF): `data/exemplos/active-ndf-ciclo-real.md`
- Cronograma estrutural exemplo: `data/exemplos/cronograma-disparos-ndf.md`
- Email boas-vindas exemplo: `data/exemplos/email-boas-vindas-ndf.md`
- Template Meta WhatsApp exemplo: `data/exemplos/template-whatsapp-meta-ndf.md`

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
