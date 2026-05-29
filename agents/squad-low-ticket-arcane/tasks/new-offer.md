---
task: "Nova Oferta"
responsavel: "@lt-strategist (orquestra) + @lt-copywriter + @lt-page-master + @lt-creative-director"
responsavel_type: "multi-agent"
atomic_layer: "task"
Entrada: "Aluno quer criar oferta nova low ticket"
Saida: "Oferta validada estruturalmente, pagina ao ar, 10 criativos prontos pra subir"
duracao: "16 dias (Fase 0 do wf-perpetuo-completo)"
Checklist:
  - "Pneu furado identificado"
  - "Tipo de perpetuo decidido (Frio/Porta/Branding)"
  - "Mecanismo unico definido"
  - "EDI completo (3 perguntas + linguagem popular)"
  - "Ruminacoes Score 4-5 extraidas"
  - "Nome da oferta (Maquina de Nomes)"
  - "Headline 3 partes costurada"
  - "Pagina 14 blocos ao ar"
  - "Setup tecnico OK (PageSpeed, Pixel)"
  - "Esteira mapeada (mas nao ligada)"
  - "10 criativos PRSA gravados"
execution_type: "interactive multi-agent"
---

# Task: Nova Oferta — Workflow Fase 0 (16 dias)

**Task ID:** squad-low-ticket-arcane/new-offer
**Version:** 1.0.0
**Owner:** lt-strategist (orquestra) + agentes especialistas
**Duracao:** 16 dias
**Output:** Oferta pronta pra subir trafego (Fase Azul)

---

## Sequencia Completa (12 passos)

### Passo 1 — Pneu Furado (lt-strategist)

```
Pergunta: "Qual o pneu furado da tua persona? Qual dor latente,
real, que ela quer resolver AGORA — sem poder empurrar com a barriga?"
```

Validar:
- E dor lucrativa? (pessoa quer resolver agora, nao "reservatorio de para-brisa")
- E uma dor so? (anti AP6 Hospital)
- Cabe em produto fast food (consumo 48h)?

### Passo 2 — Tipo de Perpetuo (lt-strategist)

```yaml
prompt: |
  Tem audiencia ativa no Instagram?
  1. Nao tem ou pouca → Perpetuo Frio (R$67)
  2. Tem audiencia mas quer vender produto maior depois → Perpetuo Porta (R$67-97)
  3. Audiencia ativa, faz conteudo → Perpetuo Branding (R$147-197)
```

### Passo 3 — Mecanismo Único (lt-strategist)

> *"Eu nao crio produto olhando pro nicho. Olho pro mecanismo unico."*

- Identificar HABILIDADE CORE (nao o nicho)
- Validar: e o COMO, nao o QUE?
- "3 passos" NAO e mecanismo. Protocolo, ciclo, planilha = mecanismo

### Passo 4 — EDI Completo (lt-copywriter)

Executar `tasks/edi-completo.md`:

3 perguntas:
1. Pensamentos negativos no dialogo interno
2. Pior cenario na cabeca
3. Conversas com pessoas de confianca

**Comando linguagem popular** em todo prompt ChatGPT:
> "Escreva exatamente as frases que brasileiros falam sem formalidade, com girias e palavroes e expressoes reais."

Output: 10-20 ruminacoes brutas.

### Passo 5 — Score 0-5 (lt-copywriter)

Pontuar cada ruminacao:
- 0-2: descarta
- 3: refina
- 4-5: usa

Output: 6 ruminacoes Score 4-5 (max 4-6 iluminacoes na pagina).

### Passo 6 — Maquina de Nomes (lt-strategist + lt-copywriter)

Formula: **Gancho + Conexao + Palavra-chave + Fechamento**

| Posicao | Tipo | Exemplos |
|---------|------|----------|
| Gancho | Substantivo | Desafio, Protocolo, Rota, Pack, Manual |
| Conexao | Preposicao | do, da, dos, para, pra, com |
| Palavra-chave | Subst. | barriga, amor, magra, mente, seguidor |
| Fechamento | Adjetivo | definida, poderosa, dourada |

ChatGPT: "Complete o nome usando 20 variacoes. Dor: {X}. {Gancho da {palavra}} ____."

Validar palavras proibidas (metodo, bonus, e-book, curso, ritual, aulas).

Output: Top 5 nomes → escolher 1.

### Passo 7 — Headline 3 Partes (lt-copywriter, refina embriao do strategist)

```
[Verbo] como [RESULTADO] em [TEMPO] com/usando [MECANISMO]
```

Mecanismo + Tempo OBRIGATORIOS.

Validar:
- E literalmente o que a persona pensa?
- Score 4-5?
- Mecanismo aparece?
- Fator tempo aparece?

Costura: pensar como reaparece nos blocos da pagina.

### Passo 8 — Pagina 14 Blocos (lt-page-master)

Executar `tasks/nova-pagina.md`:

14 blocos sequenciais:
1. Vender Sozinho (primeira dobra) — SEM botao
2. Depoimentos (sem carrossel)
3. Dor Latente (ruminacoes Score 4-5)
4. Transicao
5. Passo a Passo (3-4, NUNCA "modulo")
6. Entregaveis (mockups REAIS 535x535)
7. Pra Quem Serve (dialogo interno)
8. Ancoragem (~90% acima)
9. Primeiro Botao + Tudao 650x520 (botao VERDE)
10. Conversa Seria
11. Autoridade ("manhas")
12. Segundo Botao
13. FAQ (matar medo de pagar)
14. Rodape (dominio proprio)

Stack: Hostinger + WP + Elementor + Pixel YourSite + WP Rocket + WebP Express.

### Passo 9 — Produto (lt-strategist)

ATENCAO: Produto NASCE DA PAGINA, nao o contrario.

> "Cronograma de curso sai da pagina, nao da area de membro."

Construir entregaveis 4+3 (ja descritos na pagina passo 8):
- 4 principais
- 3 extras (NUNCA "bonus")
- Cada um: mockup + titulo (Food Porn) + descricao
- Linguagem da ruminacao, nao tecnica

### Passo 10 — Stack Técnica + Pixel (lt-page-master)

- PageSpeed mobile 80+
- Tempo carregamento <3s
- Pixel Your Site instalado
- API Conversoes configurada
- Meta Pixel Helper verificado
- Connect Rate previsto >85%

Se Connect Rate <50% = trocar Hostinger pra Rochost.

### Passo 11 — Esteira Mapeada (NÃO LIGADA AINDA)

Mapear (pra ligar so na Fase Verde):
- Order Bump 1 (max 20% do produto, conversao 35%)
- Order Bump 2
- Upsell (R$147-197, conversao min 5-10%)
- Recuperador 3 tempos (5min/24h/7d)

REGRA: Fase Azul = SO trafego direto. Sem OB, sem upsell, sem recuperacao.

### Passo 12 — 10 Criativos PRSA (lt-creative-director + lt-copywriter)

Executar `tasks/prsa-criativo.md` + `tasks/teste-bifasico.md` (Fase 1):

- 10 criativos com copies 100% DIFERENTES (variedade)
- Formatos diferentes (selfie, dupla, narrativo, etc)
- PRSA completo cada um
- 3 CTAs gravados (site/grupo/comercial)
- Frases do criativo APARECEM na pagina (anti AP5 Sovaco)

---

## Quality Gate: QG-LT-001 — Oferta Validada Estruturalmente

Bloqueia se:
- Sem mecanismo unico claro
- Headline sem mecanismo OU sem tempo
- Headline com palavra proibida
- Multiplas ruminacoes (anti AP6)
- Esteira ligada na Fase Azul (anti AP7)
- Preco abaixo de R$37 (Underlands)
- Pagina sem os 14 blocos
- Connect Rate <75% previsto

Aprova se:
- 1 ruminacao Score 4-5
- Headline 3 partes costurada
- 4+3 entregaveis com Food Porn
- Pagina ao ar, 14 blocos, mobile-first
- 10 criativos PRSA prontos

---

## Handoff Final

Apos QG-LT-001 aprovado, handoff:

```
@lt-traffic-ops — contexto:
Oferta [NOME] pronta pra Fase Azul.
Preco R$67. Funil 3X projetivo: CVP R$2,68 / Final R$15,41 / CPA R$30,15.
Budget conjunto R$30/dia. 10 criativos prontos.
Subir ABO Testadora 1-1-1 a meia-noite e tres.
```

---

## Cases de Referencia

| Case | O que ensina |
|------|--------------|
| Tiao da Borracharia | Pneu furado / dialogo interno > branding |
| Mil Seguidores Por Semana | Headline 3 partes classica |
| Mulher Sem Barriga | Mesmo Maxxima erra (R$147 → R$67 → tchau) |
| Giovana olheira | Pivot de headline pode salvar produto |
| Lencinho Umedecido | 1 produto, multiplas ofertas |

---

**Task Status:** Production Ready
