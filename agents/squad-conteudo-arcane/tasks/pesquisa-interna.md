---
task: "Pesquisa Interna (do Expert)"
responsavel: "@sage-teorico"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Tema cravado + contexto do post"
Saida: "Seção 'Pesquisa Interna' do teoria.md preenchida com big ideas, casos, conceitos, crença, argumentos do expert"
Checklist:
  - "Sage perguntou as 6 perguntas-chave"
  - "Expert despejou solto (Sage anotou em tempo real)"
  - "Sage estruturou e devolveu pra expert validar"
  - "Loop de complemento ate expert dizer 'é isso'"
  - "Salvou na secao Pesquisa Interna do teoria.md"
execution_type: "interactive"
---

# Task: Pesquisa Interna — Sub-Passo 4.1

**Task ID:** squad-conteudo-arcane/pesquisa-interna
**Version:** 1.0.0
**Responsavel:** @sage-teorico
**Category:** Criar Teoria — Sub-passo 1
**Execution Type:** Interactive

---

## Propósito

ANTES de pesquisar fora, extrair tudo que o expert já tem na cabeça sobre o tema.

**Premissa:** 60-70% da teoria boa ja ta na cabeca do expert. Pesquisar externo primeiro = trabalho dobrado + risco de ignorar visão única.

---

## Pipeline

```
pesquisa-interna
  |
  v
STEP 1: APRESENTAR TEMA + CONTEXTO
  |
  v
STEP 2: 6 PERGUNTAS-CHAVE (uma de cada vez)
  |
  v
STEP 3: CAPTURAR EM TEMPO REAL
  |
  v
STEP 4: ESTRUTURAR E DEVOLVER
  |
  v
STEP 5: LOOP DE COMPLEMENTO ATE EXPERT VALIDAR
```

---

## Step 1: Apresentar Tema + Contexto

```
Beleza, tema cravado: "{tema}". Formato: {formato}. Moral: "{moral}".

Antes de eu sair pesquisando externo, vou EXTRAIR primeiro o que
voce ja tem na cabeca. Normalmente 60-70% da teoria boa ja ta ai
— pesquisar externo primeiro vira trabalho dobrado.

Vou fazer 6 perguntas, uma de cada vez. Pode despejar solto, eu
organizo.

Pronto?
```

---

## Step 2: 6 Perguntas-Chave

**Pergunta 1 — Big Ideas:**
```
O que voce ja pensou sobre esse tema? Big ideas, angulos que
vinham na cabeca quando o assunto aparecia?

(Despeja tudo — vou separar depois)
```

**Pergunta 2 — Casos:**
```
Tem casos teus — alguem que voce {situacao do tema}, situacao
real que pode virar exemplo (anonimo se precisar)?
```

**Pergunta 3 — Conceitos Próprios:**
```
Tem frases prontas, conceitos proprios que voce usa quando fala
sobre isso?

Tipo: "Eu chamo isso de X", ou "Pra mim Y", ou termos que voce
criou.
```

**Pergunta 4 — Crença Central:**
```
Qual a CRENCA / visao de mundo forte que entra nesse tema pra
voce? O que voce defende com convicção?

Idealmente em UMA FRASE — a tese central que voce sustentaria
num evento ao vivo.
```

**Pergunta 5 — Argumentos:**
```
Quais sao teus argumentos pra defender essa crença? Por que
isso e verdade na tua visao?

Pode ser logica, exemplo, dado, intuição. Tudo vale.
```

**Pergunta 6 — Fontes que ja absorveu:**
```
Algum estudo, livro, palestra, fonte que voce ja absorveu sobre
o tema? Mesmo que nao lembre o nome exato, conta o que tem na
memoria.
```

---

## Step 3: Capturar em Tempo Real

Sage anota mentalmente / em arquivo:

```yaml
pesquisa_interna:
  big_ideas:
    - "{idea 1}"
    - "{idea 2}"
    - ...
  casos:
    - "{caso 1 — descricao}"
    - ...
  conceitos_proprios:
    - "{conceito 1}"
    - "{frase pronta 1}"
  crenca_central: "{frase única}"
  argumentos:
    - "{argumento 1}"
    - "{argumento 2}"
  fontes_ja_absorvidas:
    - "{livro/estudo/palestra}"
```

---

## Step 4: Estruturar e Devolver

Sage devolve pro expert validar:

```
Extracao completa. Vou estruturar:

═══════════════════════════════════════════════════════════════
BIG IDEAS QUE EXTRAI
═══════════════════════════════════════════════════════════════

1. {big idea 1}
2. {big idea 2}
3. {big idea 3}

═══════════════════════════════════════════════════════════════
CASOS QUE VOCE LEVANTOU
═══════════════════════════════════════════════════════════════

1. {caso 1 — formatado pra possivel uso}
2. {caso 2}

═══════════════════════════════════════════════════════════════
CONCEITOS PROPRIOS / FRASES
═══════════════════════════════════════════════════════════════

- "{conceito 1}"
- "{frase 1}"
- "{termo proprio}"

═══════════════════════════════════════════════════════════════
CRENCA CENTRAL (TESE)
═══════════════════════════════════════════════════════════════

"{frase única}"

═══════════════════════════════════════════════════════════════
ARGUMENTOS PRA SUSTENTAR
═══════════════════════════════════════════════════════════════

1. {argumento 1}
2. {argumento 2}
3. {argumento 3}

═══════════════════════════════════════════════════════════════
FONTES JA ABSORVIDAS
═══════════════════════════════════════════════════════════════

- {fonte 1}
- {fonte 2}

═══════════════════════════════════════════════════════════════

Falta algo? Algum angulo que ficou na cabeca e não saiu?

Se OK, parto pra pesquisa externa pra trazer dados/estudos/casos
que fortalecem o que voce ja tem.
```

---

## Step 5: Loop de Complemento

Expert pode adicionar mais coisas. Sage capture e atualiza.

Loop até expert dizer "é isso, pode partir".

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert quer pular esse sub-passo | "Não pulo. 60-70% da teoria ta na tua cabeça. Sem extrair, perco material único." |
| Expert diz "não tenho nada" | "Tema te tocou pra crava-lo. Volta na pergunta 1 — bem básico: o que te incomoda nesse assunto?" |
| Expert despeja tudo de uma vez sem responder pergunta a pergunta | Anota tudo + estrutura nas 6 dimensões. Tudo bem. |

---

## Output

Seção "Pesquisa Interna" do `teoria.md`:

```markdown
## Pesquisa Interna (do expert)

### Big Ideas
- {lista}

### Casos Pessoais
- {lista}

### Conceitos Próprios / Frases
- {lista}

### Crença Central
"{frase única}"

### Argumentos
- {lista}

### Fontes Já Absorvidas
- {lista}
```

---

**Task Status:** Ready for Production
