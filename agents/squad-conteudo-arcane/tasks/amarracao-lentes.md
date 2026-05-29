---
task: "Amarração com 6 Lentes"
responsavel: "@sage-teorico"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pesquisa interna + externa concluidas"
Saida: "Seções de estrutura + leque de hooks do teoria.md preenchidas"
Checklist:
  - "6 lentes aplicadas durante (nao depois) a pesquisa"
  - "Tese central em 1 frase"
  - "Linha de raciocinio 5 etapas"
  - "Narrativa (caso/historia)"
  - "Argumentos de prova citados"
  - "Contra-intuitivo / polemica identificado"
  - "Pontos de identificacao mapeados"
  - "Moral da historia clara"
  - "Leque de 5-7 hooks com diversidade de gatilhos"
execution_type: "interactive"
---

# Task: Amarração com 6 Lentes — Sub-Passo 4.3

**Task ID:** squad-conteudo-arcane/amarracao-lentes
**Version:** 1.0.0
**Responsavel:** @sage-teorico
**Category:** Criar Teoria — Sub-passo 3 (Final)
**Execution Type:** Interactive

---

## Propósito

Pesquisa interna + externa = material bruto.
Amarração com 6 lentes = transforma material bruto em ARQUITETURA DE CONTEÚDO pronta pro roteiro.

---

## As 6 Lentes (aplicadas DURANTE a pesquisa, não depois)

### Lente 1 — O QUE VAI CHAMAR ATENÇÃO

Buscar ativamente:
- Dados curiosos
- Fatos chocantes
- Imagens mentais fortes
- Polêmicas em potencial

**Output → Seção "Chama-Atenção" do teoria.md** (insumos pro hook)

### Lente 2 — CONSTRUÇÃO DE RACIOCÍNIO

Estruturar o material em lógica encadeada:

```
Premissa de entrada (onde o público está mentalmente)
    ↓
Quebra/tensão (algo que confronta o que ele acha)
    ↓
Virada (a verdade que o expert defende)
    ↓
Prova/sustentação (por que isso é verdade)
    ↓
Conclusão/moral (o que isso significa)
```

**Output → Seção "Linha de Raciocínio"**

### Lente 3 — CONSTRUÇÃO DE TENSÃO

Identificar:
- Conflito (A vs B)
- Contradição
- Paradoxo
- Expectativa quebrada

**Output → integrada na Linha de Raciocínio + sinalizada**

### Lente 4 — NARRATIVA

Encontrar:
- História magnética (caso real, jornada, antes/depois)
- Personagens
- Conflito → resolução

Pode vir da pesquisa interna (caso do expert) ou externa (caso público).

**Output → Seção "Narrativa"**

### Lente 5 — LÓGICA

Mapear:
- Causa-efeito
- Provas concretas (estudos, dados)
- Argumentos sustentados
- Autoridade externa (livros, ciência, religião, especialistas)

**Output → Seção "Argumentos de Prova"**

### Lente 6 — CONTEÚDO NOTÁVEL (8 elementos Audience)

Identificar quais dos 8 elementos estão presentes/possíveis:

1. **Informação nova** — algo que pouca gente sabe
2. **Valor prático** — receita de bolo, instrução utilizável
3. **Identificação** — situação cotidiana
4. **Prova/argumentação poderosa** — estudo, dado, lógica
5. **Fato curioso** — info que chama atenção
6. **História magnética** — narrativa que prende
7. **Contra-intuitivo** — afirmação que contradiz senso comum
8. **Polêmica** — opinião que gera reação

**Output → todos esses elementos espalhados pelo teoria.md, marcados**

---

## Pipeline

```
amarracao-lentes
  |
  v
STEP 1: APLICAR LENTE 1 — CHAMA ATENCAO
  Listar insumos
  |
  v
STEP 2: APLICAR LENTE 2+3 — RACIOCINIO + TENSAO
  Montar linha de 5 etapas
  |
  v
STEP 3: APLICAR LENTE 4 — NARRATIVA
  Escolher historia/caso
  |
  v
STEP 4: APLICAR LENTE 5 — LOGICA
  Listar argumentos de prova
  |
  v
STEP 5: APLICAR LENTE 6 — CONTEUDO NOTAVEL
  Mapear 8 elementos
  |
  v
STEP 6: CONSOLIDAR TESE CENTRAL (1 frase)
  |
  v
STEP 7: GERAR LEQUE DE 5-7 HOOKS
  Diversidade obrigatoria de gatilhos
  |
  v
STEP 8: MORAL DA HISTORIA / GANCHO PRODUTO
  Confirmar com expert
```

---

## Step 1-5: Aplicar Lentes

Sage percorre material da pesquisa interna + externa aplicando cada lente.

Pra cada item de material, pergunta:
- Isso chama atenção? (Lente 1)
- Onde encaixa no raciocínio? (Lente 2-3)
- Tem narrativa associada? (Lente 4)
- Sustenta logicamente? (Lente 5)
- Qual dos 8 elementos isso é? (Lente 6)

Material vira mapa estruturado.

---

## Step 6: Consolidar Tese Central

Sage condensa tudo em UMA FRASE:

```
TESE CENTRAL:

"{frase única}"

Critério: Você defenderia isso em um evento ao vivo com convicção?
Se sim → forte.
Se não → ajustar.
```

Apresenta ao expert pra validar.

---

## Step 7: Gerar Leque de 5-7 Hooks

Sage gera hooks com diversidade obrigatória de gatilhos.

**7 Gatilhos disponíveis:**
1. Recompensa
2. Mistério
3. Popularidade
4. Reputação
5. Crença
6. Disrupção
7. Reconhecimento

**Mínimo:** 5 hooks cobrindo diversidade. **Ideal:** 7 (um por gatilho).

Pra cada hook:

```
Hook N ({gatilhos usados}):
  Frase: "{hook completo, pronto pra usar}"
  Por que pode funcionar: {motivo concreto baseado na pesquisa}
  Sugestão de 1ª linha pós-hook: "{frase de continuação}"
```

---

## Step 8: Moral da História + Gancho do Produto

```
MORAL DA HISTORIA:

"{frase final que aponta pra crenca/produto/visao de mundo do expert}"

Como amarra:
- Hook fisga → conteudo prova → moral fecha apontando pra {produto/visao}
- Sutil mas firme — sem ser comercial direto
```

Confirma com expert.

---

## Output Final

`teoria.md` completo, com TODAS as seções preenchidas:

```markdown
# Teoria do Post — {slug}

## Tema
## Tese Central
## Chama-Atenção
## Linha de Raciocínio
## Narrativa
## Argumentos de Prova
## Contra-Intuitivo / Polêmica
## Pontos de Identificação
## Moral da História / Gancho do Produto
## Leque de Hooks Sugeridos (5-7)
## Pesquisa Interna
## Pesquisa Externa
## Engenharia Reversa de Virais
## Fontes Consultadas
```

---

## Quality Gate

- [ ] 6 lentes aplicadas (cada uma com pelo menos 1 item)
- [ ] Tese central em 1 frase
- [ ] Linha de raciocínio com 5 etapas
- [ ] Narrativa identificada (caso/história)
- [ ] Mínimo 2 provas externas + 1 prova interna (caso do expert)
- [ ] Contra-intuitivo/polêmica identificado
- [ ] Moral da história clara
- [ ] Leque de 5-7 hooks com diversidade de gatilhos
- [ ] Expert validou tese central

---

**Task Status:** Ready for Production
