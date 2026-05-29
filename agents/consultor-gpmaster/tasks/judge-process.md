# Task: judge-process

**Purpose:** Diagnosticar um processo existente usando as 5 lentes simultaneas.

## Trigger

- Comando: `*judge {descricao ou arquivo}`
- Linguagem natural: "avalia esse processo", "o que acha desse fluxo", "tem algo errado"

## Step-by-Step Execution

### Step 1: Coletar Informacao

Pedir ao usuario:
1. Descricao do processo (texto, arquivo, fluxograma, ou verbal)
2. Qual e o OBJETIVO desse processo? (se o usuario nao souber, isso ja e achado #1)
3. Quem e o CLIENTE do processo? (quem recebe o output)
4. Quantas pessoas envolvidas?
5. Qual e a frequencia? (diario, semanal, por demanda)

Se o usuario ja forneceu tudo, nao perguntar de novo.

### Step 2: Mapear o Fluxo

Descrever o fluxo em formato simples:
```
INPUT → Etapa 1 → Etapa 2 → ... → OUTPUT → CLIENTE
```

Identificar:
- Handoffs (onde o trabalho muda de mao)
- Pontos de decisao
- Loops (retrabalho, aprovacoes)
- Filas (onde trabalho acumula)

### Step 3: Aplicar as 5 Lentes

**Lente 1 — Goldratt (Constraint):**
- Qual etapa limita o throughput total?
- Onde a fila e mais longa?
- Se acelerasse essa etapa, o output total aumentaria?

**Lente 2 — Ohno (Desperdicio):**
- Quais dos 7+1 mudas estao presentes?
- O processo e push ou pull?
- Onde tem superproducao, estoque, espera?

**Lente 3 — Deming (Estabilidade):**
- Variacao e common ou special cause?
- Estao reagindo a cada flutuacao?
- Existe ciclo de melhoria (PDSA)?

**Lente 4 — Gawande (Protecao):**
- Quais etapas sao criticas?
- Tem checklist nos pontos criticos?
- A comunicacao entre etapas e formalizada?

**Lente 5 — Drucker (Contribuicao):**
- O processo contribui para resultado que importa?
- Se eliminasse, o que aconteceria?
- Estao medindo eficacia ou eficiencia?

### Step 4: Emitir Veredicto

Formato obrigatorio:

```
DIAGNOSTICO — {nome do processo}
================================

OBJETIVO: {declarado vs real}
CLIENTE: {quem recebe o output}
FLUXO: {descricao simplificada}

CONSTRAINT PRINCIPAL:
{onde + por que + impacto}

DESPERDICIOS:
1. {tipo de muda} — {onde} — {impacto}
2. ...

ESTABILIDADE:
{common vs special cause, nivel de variacao}

PONTOS CRITICOS SEM PROTECAO:
{etapas sem checklist}

CONTRIBUICAO:
{o processo contribui ou nao}

SCORE GERAL: {1-10}
- 1-3: Processo disfuncional, precisa de redesign
- 4-6: Processo funcional com problemas significativos
- 7-8: Processo bom com oportunidades de melhoria
- 9-10: Processo excelente

PRESCRICAO:
1. IMEDIATO: {quick win}
2. MEDIO PRAZO: {mudanca estrutural}
3. LONGO PRAZO: {redesign se necessario}

METRICAS SUGERIDAS:
- {metrica 1}
- {metrica 2}
```

## Regras

- NUNCA prescrever sem diagnosticar primeiro
- SEMPRE usar todas as 5 lentes
- SEMPRE dar score numerico com justificativa
- NUNCA ser generico — citar o mestre e a ferramenta especifica
- SEMPRE entregar prescricao com prioridade (imediato, medio, longo)
