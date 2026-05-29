---
task: "Pesquisar Formatos"
responsavel: "@iris-pesquisador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nicho do expert + (opcional) formatos que ja testou"
Saida: "1-3 formatos selecionados pra focar inicialmente, salvos em base-inicial.md"
Checklist:
  - "Iris explicou o que e formato com exemplos"
  - "Cardapio visual apresentado (biblioteca + descricao visual)"
  - "Iris perguntou se expert ja tem formato favorito"
  - "Aplicou 4 criterios Hannah + criterio do squad"
  - "1-3 formatos cravados pelo expert"
  - "Salvou em base-inicial.md (secao FORMATOS)"
execution_type: "interactive"
---

# Task: Pesquisar Formatos — Passo 1 do Fluxo

**Task ID:** squad-conteudo-arcane/pesquisar-formatos
**Version:** 1.0.0
**Responsavel:** @iris-pesquisador
**Category:** Fase Inicial (base pontual)
**Execution Type:** Interactive

---

## Pipeline Visual

```
pesquisar-formatos
  |
  v
STEP 1: EXPLICAR O QUE E FORMATO
  Conceito + exemplos concretos
  |
  v
STEP 2: APRESENTAR CARDAPIO VISUAL
  Biblioteca embarcada com descricao
  |
  v
STEP 3: PERGUNTAR — ja gosta de algum?
  |
  +→ SIM → lapidar em cima dele
  |
  +→ NAO → sugerir 3-5 com 5 criterios
  |
  v
STEP 4: PESQUISA ADICIONAL (se nenhum bate)
  Iris garimpa IG/TikTok/YT
  |
  v
STEP 5: CRAVAR 1-3 FORMATOS
  Expert decide
  |
  v
STEP 6: SALVAR EM base-inicial.md
```

---

## Step 1: Explicar o que é formato

Iris abre com explicação clara + 2-3 exemplos concretos:

```
Antes de mostrar opcoes, deixa eu te explicar o que e FORMATO:

Formato = padrao visual + estrutura de roteiro que se repete.

Quando voce encontra um padrao que funciona, voce REPETE — e isso
faz tua audiencia te reconhecer visualmente E performar melhor com
o algoritmo.

EXEMPLOS:

→ Mari Krieger sempre comeca com pranchetinha, bate-bola com
  produto, termina no "xixi caro". Formato = DIALOGO.
  Cada video novo: mesmo padrao, produto diferente.

→ Pantera sempre grava na cozinha simples, voz tranquila,
  fala de comida saudavel. Formato = TRIVIAL/LO-FI.

→ Veridiana Cavalieri sempre faz analise de evento (Pedro do
  Flamengo, etc) com mesma estrutura. Formato = ANALISE.

Por que importa: cada video do Pantera vira por 1M+ porque
o publico ja sabe o que esperar (formato validado).

Faz sentido? Quer ver o cardapio de formatos disponiveis?
```

---

## Step 2: Apresentar Cardápio Visual

Iris carrega `knowledge/formato-criativo/biblioteca-formatos.md` e apresenta o cardápio adaptado ao nicho do expert.

**Formato de apresentação:**

Pra cada formato, mostrar:
- Nome
- Descrição visual (cenário, vestimenta, abertura, padrão de corte, tom, elemento recorrente)
- Quem usa (referência viral)
- Por que funciona

**Não apresenta todos os 16 de uma vez.** Filtra os 5-8 mais relevantes ao nicho do expert.

Exemplo:
```
Pra teu nicho de lideranca empresarial, te trago um cardapio
focado em 6 formatos com alta aderencia:

═══════════════════════════════════════════════════════════════

1) ANÁLISE
   [descricao visual completa]
   Quem usa: Diretores virando criadores
   Forte porque: posicionamento de autoridade

2) DIÁLOGO COM PRANCHETINHA
   [descricao]
   Quem usa: adaptado da Mari Krieger
   Forte porque: super viral, formato altíssimo engajamento

[... mais 4 formatos]

═══════════════════════════════════════════════════════════════
```

---

## Step 3: Perguntar — Já gosta de algum?

```
Antes de eu sugerir 1-3 pra voce focar, me responde:

Algum desses formatos voce ja testou e rolou? Ou ja tem um
formato proprio que funciona pra voce?
```

**Se SIM:** vai pro Step 5 (cravar) lapidando em cima do formato existente.

**Se NÃO:** vai pro Step 4 (sugerir candidatos).

---

## Step 4: Sugerir 3-5 candidatos com 5 critérios

Iris aplica 5 critérios na seleção:

**4 Critérios Hannah:**
1. **Referências** — tem criadores virais usando? (validação social)
2. **Autenticidade** — bate com a personalidade do expert? (sustentar a longo prazo)
3. **Recursos** — expert tem skill/equipamento pra executar? (não bloqueia)
4. **"Tem que ser massa de fazer"** — expert vai sentir prazer produzindo? (consistência)

**+1 Critério do squad:**
5. **Sustentar** — expert consegue manter no longo prazo? (não trava em 5 posts)

**Output:**

```
Te sugiro 3 candidatos baseados nos criterios:

1. {FORMATO 1}
   Por que sugiro: {explica os 5 critérios atendidos}
   Risco: {se houver}

2. {FORMATO 2}
   Por que sugiro: ...

3. {FORMATO 3}
   Por que sugiro: ...

Qual desses 3 pega tua vibe? Pode escolher 1, 2 ou 3 deles
(recomendado: 1-3 max — focar pra validar).
```

---

## Step 5: Pesquisa Adicional (se nenhum bate)

Se expert disser "nenhum desses me vibra", Iris vai pesquisar.

**Protocolo:**
1. Identifica nicho específico (já tem) + área de atuação
2. Vai no IG/TikTok/YT buscar virais do nicho
3. Identifica formatos não-óbvios sendo usados
4. Traz 2-3 candidatos novos com descrição visual

```
Beleza, vou garimpar. Volto em alguns minutos com mais opções
do que ja viralizou no teu nicho.

[pesquisa profunda]

Achei 3 formatos não-óbvios que estao bombando:

1. {novo formato}
2. {novo formato}
3. {novo formato}

Algum desses bate?
```

---

## Step 6: Cravar 1-3 formatos

Expert escolhe (1-3 formatos pra focar inicialmente).

Iris confirma:

```
Beleza, cravado:
- Formato principal: {nome}
- Formato secundario: {nome} (se houver)
- Formato pra testar: {nome} (se houver — 20% testando)

Lapidacao 80/20: 80% dos teus posts no principal/secundario,
20% testando o experimental. Isso evita estagnar e mantem
exploracao.

Salvando isso na tua base-inicial.md...
```

---

## Step 7: Salvar em base-inicial.md

Cria/atualiza arquivo `docs/producao-conteudo/{expert}/base-inicial.md` com seção FORMATOS:

```markdown
# Base Inicial — {Expert}

## FORMATOS ESCOLHIDOS

### Formato Principal: {nome}
**Descrição visual:** {descricao completa}
**Referência viral:** {criador + canal}
**Por que escolheu:** {justificativa}

### Formato Secundário: {nome}
[...]

### Formato Pra Testar (20%): {nome}
[...]

## Lapidação 80/20

Dos próximos N posts:
- 80%: formato principal e secundário
- 20%: formato pra testar

Após 5-10 posts, revisar:
- Formato pra testar virou validado? → vira principal
- Formato principal estagnou? → testar novo

[seção POOL DE TEMAS virá no próximo task]
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert escolhe 4+ formatos | Avisar: "Foco. Comeca com 1-3 max. Validar leva tempo." |
| Expert quer formato sem referência viral | Pergunta: "Tem certeza? Sem referencia e loteria. Vamos garimpar 1 validado ou ele e tao unico que vale o risco?" |
| Expert escolhe formato que ele não tem recursos pra executar | Avisar: "Esse precisa de [recurso]. Voce tem? Se nao, sugiro alternativa." |
| Expert recusa todos os 5+ candidatos | Pergunta: "O que ta travando? Nicho? Tom? Tipo de producao? Conta pra eu calibrar." |

---

## Quality Gate

**QG-SCA-001 (parcial) — Formatos definidos**

Checklist:
- [ ] 1-3 formatos cravados pelo expert
- [ ] Cada um com descrição visual e justificativa
- [ ] Lapidação 80/20 explicada
- [ ] Salvo em base-inicial.md

Se algum falhou: voltar ao Step apropriado.

---

## Próximo passo

Após formatos cravados:
- Mesma sessão pode continuar com `pesquisar-temas` (Passo 2) pra fechar Fase Inicial
- OU expert pode pausar e voltar depois

Iris pergunta:
```
Formatos cravados. Bora ja pra pesquisa de temas (próximo passo
da Fase Inicial) ou voce quer pausar e voltar depois?
```

---

**Task Status:** Ready for Production
