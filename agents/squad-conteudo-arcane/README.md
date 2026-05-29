# Squad Conteudo Arcane

> Squad criativo end-to-end pra expert da Mentoria Arcane produzir conteudo (Reels + Carrossel) que viraliza, conecta e vende.

**Base metodologica:** Metodo Audience (Elias Maman) + Formato Criativo (Hannah Franklin) + principios autorais consolidados.

**Ativacao:** `/squad-conteudo-arcane`

---

## Visao Geral

Voce e expert. Tem conhecimento profundo no nicho. Mas conteudo organico que funciona exige metodo — sem ele, voce posta no escuro e queima energia.

Esse squad embarca o metodo. 6 agentes especializados, cada um com fronteira clara, executando o pipeline completo:

```
SETUP INICIAL (base pontual)
  1. Definir Formatos          [Iris]
  2. Pool de Temas              [Iris]
        ↓
ROTINA POR POST
  3. Tema do Post               [Iris + expert decide]
  4. Criar Teoria               [Sage — coracao do squad]
  5. Roteirizar                 [Rico]
  6. Produzir                   [Mack — orienta voce a executar]
        ↓
POS-PUBLICACAO
  Analisar Performance          [Aria — diagnostico cirurgico]
        ↓
  Retroalimenta formatos / pool
```

---

## Time

| Agente | Papel | Quando entra |
|--------|-------|--------------|
| 🎙️ **Vox** | Recepção / Orquestrador | Entrada — roteia pra agente certo |
| 🔍 **Iris** | Pesquisadora (formatos + temas) | Setup Inicial + apoio Passo 3 |
| 🧠 **Sage** | Teórico / pesquisador profundo | Passo 4 (criar teoria) |
| ✍️ **Rico** | Roteirista | Passo 5 (roteiro) |
| 🎬 **Mack** | Produtor (orientador) | Passo 6 (orienta produção) |
| 📊 **Aria** | Analista estratégica | Pós-publicação |

---

## Como Usar

### 1. Setup Inicial (primeira vez)

Iris define formatos iniciais (1-3) e monta pool de 15-30 temas estrategicos do teu nicho.

```
*setup-inicial
```

Output: `docs/producao-conteudo/{voce}/base-inicial.md`

### 2. Produzir 1 Post

Voce ja tem base. Pipeline completo:

```
*produzir
```

Output: `posts/{slug}/teoria.md` + `roteiro.md` + lâminas/direção de produção

### 3. Produzir Batelada (N posts)

Cadencia ideal: 3-7 posts/semana. Roda em lote.

```
*batch
```

### 4. Analisar Performance

Posts publicados? Traz números (print, verbalizado ou Apify) + comentarios.

```
*analisar
```

Output: relatório cirúrgico com insights e sugestões de escala.

### 5. Convocação Livre

Voce sabe quem quer:

```
chamar sage
quero a iris
rico, vamos roteirizar
```

---

## Princípios

1. **Atencao primeiro, conteudo depois** — sem hook, ninguem ve
2. **Formato definido > variacao caotica** — encontra o que funciona e repete
3. **Pesquisa de virais > inventar do zero** — o publico ja validou padroes
4. **Punch + objetividade** — sem firula, direto ao osso
5. **Loopings abertos/fechados em cadeia** — mecanica de retencao continua
6. **Sempre entregar algo poderoso** — nunca raso
7. **Construir visao de mundo / crenca / posicionamento** — conteudo nao e neutro
8. **Natural mas forte** — sutil como conversa, intenso quando preciso

---

## Estrutura

```
squad-conteudo-arcane/
├── squad.yaml                    # Manifest do squad
├── skill.md                       # Activation file (Vox loaded)
├── README.md                      # Este arquivo
│
├── agents/
│   ├── vox-chief.md               # Recepção / orquestrador
│   ├── iris-pesquisador.md        # Formatos + temas
│   ├── sage-teorico.md            # Teoria do post
│   ├── rico-roteirista.md         # Roteiro
│   ├── mack-produtor.md           # Orientação produção
│   └── aria-analista.md           # Análise pós
│
├── tasks/                          # 19 tasks (uma por ação)
│   ├── start.md                    # Entry point
│   ├── pesquisar-formatos.md
│   ├── pesquisar-temas.md
│   ├── ensinar-pesquisa-manual.md
│   ├── escolher-tema-post.md
│   ├── sugerir-tema-do-momento.md
│   ├── criar-teoria.md
│   ├── pesquisa-interna.md
│   ├── pesquisa-externa.md
│   ├── amarracao-lentes.md
│   ├── capturar-tom.md
│   ├── roteirizar.md
│   ├── refinar-roteiro.md
│   ├── gerar-laminas-carrossel.md
│   ├── orientar-reels.md
│   ├── analisar-post.md
│   ├── analisar-batch.md
│   ├── analisar-comentarios.md
│   └── ler-apify.md
│
├── workflows/                      # 4 workflows guiados
│   ├── setup-inicial.md
│   ├── produzir-post.md
│   ├── produzir-batch.md
│   └── analisar-performance.md
│
└── knowledge/                      # KB embarcada (autocontida)
    ├── metodo-audience/
    │   ├── 5-pilares.md
    │   ├── 7-gatilhos-atencao.md
    │   ├── 8-elementos-conteudo-notavel.md
    │   ├── 16-categorias-temas.md
    │   ├── metricas-diagnostico.md
    │   └── metodo-pesquisa-virais.md
    ├── formato-criativo/
    │   ├── conceito-hannah.md
    │   ├── biblioteca-formatos.md     # 16 formatos com descrição visual
    │   ├── estrutura-conflito-virada.md
    │   ├── interseccao-criativa-a-b.md
    │   └── tema-vs-moral-historia.md
    ├── estrutura-roteiro/
    │   ├── macro-hook-intro-conteudo-cta.md
    │   ├── principios-nao-negociaveis.md
    │   ├── como-construir-looping.md
    │   └── variacao-emocional.md
    ├── templates/                  # Vazio — expert popula
    │   └── hooks/
    ├── swipe-files/                # Vazio — expert popula
    │   ├── hooks-virais/
    │   └── conteudos-virais/
    ├── analise/
    │   ├── diagnostico-cirurgico.md
    │   ├── escalar-formato-vs-assunto.md
    │   ├── reaproveitamento.md
    │   ├── analise-comentarios.md
    │   └── processar-apify.md
    ├── fluxo-do-squad/
    │   ├── visao-geral.md
    │   └── quando-revisita-base.md
    └── 41-templates-audience.md
```

---

## Outputs do Squad

Tudo gerado fica em `docs/producao-conteudo/{voce}/`:

```
docs/producao-conteudo/{voce}/
├── base-inicial.md                 # Output Fase Inicial (formatos + pool)
├── perfil-tom-de-voz.md            # Captado 1x pelo Rico
├── posts/
│   └── {slug-post}/
│       ├── teoria.md               # Output Sage
│       ├── roteiro.md              # Output Rico
│       ├── laminas-carrossel.md    # Output Mack (se carrossel)
│       └── direcao-reels.md        # Output Mack (se reels)
└── analises/
    └── {YYYY-MM-DD}/
        └── relatorio.md            # Output Aria
```

---

## Escopo

### IN-scope

- Definir formatos (biblioteca + lapidação 80/20)
- Pesquisa profunda de temas virais (16 categorias Audience)
- Selecao de tema do post (debate com expert, expert decide)
- Criar teoria (pesquisa interna → externa → amarracao 6 lentes)
- Roteirizar (hook + intro + conteudo + CTA + posicionamento)
- Orientar producao (lâminas carrossel + setup reels)
- Analisar pós-publicacao (cirurgico no Audience + qualitativa comentários)

### OUT-of-scope

- **Definir Nucleo de Influência** → futuro `squad-posicionamento-digital`
- **Postar / agendar** → operação (outro squad se quiser automatizar)
- **Design final do carrossel** → squad de design próprio se tiver

---

## Quality Gates

| Gate | O que valida | Bloqueia se |
|------|--------------|-------------|
| QG-SCA-001 | Base inicial completa | Sem formatos definidos ou pool <15 temas |
| QG-SCA-002 | Tema do post cravado | Expert não bateu martelo explícito |
| QG-SCA-003 | Teoria pronta | teoria.md incompleto (sem hooks sugeridos, sem moral, etc) |
| QG-SCA-004 | Roteiro aprovado | Expert não disse "pode produzir" |
| QG-SCA-005 | Análise entregue | (não-bloqueante — informativo) |

---

## Cadência

- **Mínimo:** 3 posts/semana
- **Ideal:** 1/dia
- **Operação:** batelada (gravar/diagramar várias e postar 1/dia)

---

## Princípios de Análise (Aria)

3 métricas-chave (Método Audience):

| Métrica | Threshold | Diagnóstico se falha |
|---------|-----------|----------------------|
| Taxa após 3s | >50% | Problema no GANCHO |
| Tempo médio | 25-30% do vídeo | Problema na ESTRUTURA/CONTEÚDO |
| Interação/visualização | >10% pra viralizar | Problema no CTA ou NOTABILIDADE |

Aria identifica não só números, mas tema/hook/formato/elementos usados + análise qualitativa de comentários.

---

## Versão

`v1.0.0` — criado em 2026-05-11 via Squad Forge (UC1).

---

*Agente Auroq — feito por Euriler Jube*
