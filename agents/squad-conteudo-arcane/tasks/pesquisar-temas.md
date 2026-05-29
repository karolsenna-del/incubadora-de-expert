---
task: "Pesquisar Temas"
responsavel: "@iris-pesquisador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nicho do expert + formatos definidos (Passo 1)"
Saida: "Pool de 15-30 temas estrategicos categorizados, salvos em base-inicial.md"
Checklist:
  - "Iris explicou tema viral (vs tema do momento)"
  - "Pesquisa profunda nas redes (YT pequenos, IG/TikTok hooks, ingles)"
  - "Aplicou 16 categorias Audience"
  - "Aplicou hierarquia de forca (dor, interesse, alcance, especificidade)"
  - "Debate iterativo com expert (feedback → repesquisa → refina)"
  - "Detectou tema quente emergente"
  - "Pool de 15-30 temas categorizado em 3 niveis (Fortes / Medios / Quentes)"
  - "Cada tema com descricao + exemplo viral (canal + headline + alcance)"
  - "Salvou em base-inicial.md (secao POOL DE TEMAS)"
execution_type: "interactive"
---

# Task: Pesquisar Temas — Passo 2 do Fluxo

**Task ID:** squad-conteudo-arcane/pesquisar-temas
**Version:** 1.0.0
**Responsavel:** @iris-pesquisador
**Category:** Fase Inicial (base pontual + abastecimento continuo)
**Execution Type:** Interactive

---

## Pipeline Visual

```
pesquisar-temas
  |
  v
STEP 1: EXPLICAR TEMA VIRAL (vs tema do momento)
  |
  v
STEP 2: PESQUISA PROFUNDA
  YT pequenos + IG/TikTok hooks + ingles
  |
  v
STEP 3: APRESENTAR PRIMEIRA LEVA (5-10 sugestões)
  |
  v
STEP 4: DEBATE ITERATIVO COM EXPERT
  feedback → repesquisa → refina
  loop até fechar 15-30
  |
  v
STEP 5: DETECTAR TEMA QUENTE
  Sinalizar emergente
  |
  v
STEP 6: ORGANIZAR EM 3 NIVEIS
  Fortes (top 10) / Medios (10-15) / Quentes (5)
  |
  v
STEP 7: SALVAR EM base-inicial.md
```

---

## Step 1: Explicar o que é tema viral

```
Antes de pesquisar, deixa eu alinhar o que e TEMA VIRAL:

Tema viral = assunto recorrente nos virais do nicho. Mina de
ouro pra escala. Ex pra teu nicho: "Como demitir alguem bom",
"Geração Z no trabalho", "Cultura tóxica".

NAO confundir com tema DO MOMENTO (hype passageiro tipo "Virginia
e Ze Felipe", "Frei Gilson", "BBB"). Tema do momento pode entrar
como ponto de atencao pontual, mas nao e o foco aqui.

Vou pescar VIRAIS. Hierarquia de forca:
- Nivel de dor (quanto mais dolorida, mais forte)
- Nivel de interesse (assunto que prende atencao)
- Numero de pessoas que atinge (alcance)
- Quanto mais especifico melhor (mas depende)

Posso começar a pesquisa?
```

---

## Step 2: Pesquisa Profunda (cirurgica no Audience)

Iris segue o método Audience:

**a) YouTube (primário)**
- Busca por keywords do nicho (ex: "lideranca", "demissao", "gestao")
- Filtra: virais de produtores PEQUENOS (poucos seguidores, alto engajamento)
- Olha: TÍTULO + THUMB (carregam o tema)
- Identifica: criadores que REPETEM o mesmo tema + forma (= tema acertado)

**b) Instagram / TikTok**
- Mesma keyword
- Olha: HEADLINE / HOOK do vídeo (carregam o tema)
- Engajamento alto vs número de seguidores

**c) Inglês** (antecipar tendência)
- Pesquisa em inglês temas do nicho
- Identifica: o que viralizou lá mas ainda não chegou ao BR
- Janela aberta = oportunidade

**d) 16 categorias Audience** — organiza descobertas:
- Desejos, Dores, Demográficas, Comportamentos+, Comportamentos-, Momentos de vida, Itens conhecidos, Instituições, Famosos, Figuras históricas, Inimigos, Medos, Crenças, Eventos sazonais, Locais, Entretenimento

**Anota pra cada tema:**
- Nome do tema
- Categoria(s) aplicável(is)
- 1-3 exemplos virais (canal + título/hook + alcance)
- Por que é forte (qual dor/interesse/etc)

---

## Step 3: Apresentar Primeira Leva (5-10 sugestões)

Iris não despeja 30 de uma vez. Apresenta 5-10 primeiros pra discussão.

```
Primeira leva de temas que garimpei pro teu nicho (lideranca empresarial):

═══════════════════════════════════════════════════════════════

1. "Como demitir alguem bom sem destruir o time"
   CATEGORIA: Momentos de vida + Dores
   FORTE PORQUE: dor universal pra qualquer lider; "demitir" gera
   curiosidade automatica.
   EXEMPLO VIRAL: canal X (45k seg) — "demiti meu melhor funcionario"
   — 850k views.

2. "Geração Z no trabalho — por que voce ta perdendo eles"
   CATEGORIA: Demograficas + Inimigos
   FORTE PORQUE: tema quente + dor recorrente de gestor 35+.
   EXEMPLO VIRAL: canal Y (12k seg) — 1.2M views.

[... mais 5-8 temas]

═══════════════════════════════════════════════════════════════

Bate? O que vibra pra ti, o que voce cortaria, o que quer mais
opcao em alguma categoria?
```

---

## Step 4: Debate Iterativo

Expert dá feedback. Iris ajusta.

**Tipos de feedback comuns:**

| Feedback | Ação da Iris |
|----------|--------------|
| "Tema X não bate com meu público" | Corta + busca substituto mesma categoria |
| "Quero mais opções em 'Cultura'" | Pesquisa mais temas nessa subárea |
| "Esse aqui é gold, quero variações" | Mapeia subtemas relacionados |
| "Falta tema sobre [Y]" | Pesquisa especificamente Y |
| "Esses estão muito genéricos" | Refina especificidade |
| "Quero mais polêmicos" | Foca em Inimigos + Polêmica do nicho |

**Loop até fechar 15-30 temas** balanceados.

---

## Step 5: Detectar Tema Quente Emergente

Durante a pesquisa, Iris fica atenta a:

- Algo viralizou nas últimas 1-4 semanas no nicho
- Tema novo aparecendo em criadores pequenos (sinal de tendência)
- Tópico gringo que ainda não chegou ao BR
- Evento/notícia recente conectável ao nicho

Quando detecta, sinaliza explicitamente:

```
🌟 TEMA QUENTE / EMERGENTE DETECTADO

"Lideranca remota — o que ninguem te conta sobre presenca"

STATUS: emergente. Gringo ja explora (vi 3 virais em ingles
no ultimo mes). No BR poucos abordam. Janela aberta nos proximos
2-3 meses.

POR QUE PEGAR: voce entra como precursor no BR. Quem chegar
depois, copia voce.

Vale incluir no pool?
```

---

## Step 6: Organizar em 3 Níveis

Iris organiza o pool final em 3 buckets:

**TOP 10 — FORTES**
- Alto alcance + alta dor/interesse
- Validados por múltiplos virais
- Podem virar série

**10-15 — MÉDIOS**
- Alcance médio
- Funcionam mas não viralizam fácil
- Bons pra variar

**5 — QUENTES / EMERGENTES**
- Sinalizados como novidade
- Pega antes de saturar
- Risco/oportunidade

---

## Step 7: Salvar em base-inicial.md

Atualiza arquivo `docs/producao-conteudo/{expert}/base-inicial.md` com seção POOL DE TEMAS:

```markdown
[seção FORMATOS já preenchida]

## POOL DE TEMAS (data: {YYYY-MM-DD})

### 🔥 TOP 10 — TEMAS FORTES (alto alcance + alta dor/interesse)

1. **"{tema}"**
   - Categoria: {qual das 16}
   - Por que é forte: {motivo}
   - Exemplos virais: canal {x} ({seguidores}) - "{título/hook}" - {alcance}

2. **"{tema}"**
   - ...

[total 10 temas]

### ⚡ MÉDIOS (10-15 temas)

[lista resumida]

### 🌟 QUENTES / EMERGENTES (5 temas — pega antes de saturar)

1. **"{tema}"**
   - STATUS: emergente. {situação atual}.
   - Janela: {prazo estimado}.
   - Por que pegar: {motivo estratégico}.

[total 5 temas]
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert quer pool com 5 temas só | Avisar: "Pool pequeno trava cedo. Pelo menos 15 — voce pesca pra mes inteiro." |
| Expert quer pool com 50+ temas | Avisar: "Acima de 30, paralisia. Vamos fechar em 25 max e expandir conforme necessario." |
| Expert recusa temas com polêmica | "Polêmica controlada = engajamento. Sem ela, alcance é limitado. Tem certeza que NÃO quer NENHUM?" |
| Nenhum tema bate em qualquer categoria | "Pode ser que o nicho ta sendo mal mapeado. Conta mais sobre teu publico — quem e, do que reclama, o que quer." |

---

## Quality Gate

**QG-SCA-001 (parcial) — Pool de temas pronto**

Checklist:
- [ ] 15-30 temas no pool
- [ ] Organizado em 3 níveis (Fortes / Médios / Quentes)
- [ ] Cada tema tem categoria Audience marcada
- [ ] Cada tema tem pelo menos 1 exemplo viral
- [ ] Pelo menos 1 tema quente/emergente sinalizado
- [ ] Salvo em base-inicial.md

Se algum falhou: voltar ao Step 4 (refinar).

---

## Próximo Passo

Após pool pronto:
```
Pool de {N} temas cravado. Salvei em base-inicial.md.

Esse e teu pool pra pescar. Daqui pra frente:
- Quando voce quiser produzir post, eu apresento candidatos
  daqui (3-5 com filtros aplicados) e voce escolhe.
- Pool e vivo — vamos atualizando conforme novos virais
  emergem ou tu trazer ideias da rua.

Bora produzir o primeiro post ja agora? Ou pausa aqui?
```

---

**Task Status:** Ready for Production
