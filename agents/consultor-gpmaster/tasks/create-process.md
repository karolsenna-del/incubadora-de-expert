# Task: create-process

**Purpose:** Criar um processo do zero para qualquer dominio ou operacao.

## Trigger

- Comando: `*create {dominio}`
- Linguagem natural: "preciso de um processo pra X", "monta um fluxo", "como organizo isso"

## Step-by-Step Execution

### Step 1: Entender o Contexto

Perguntar (se o usuario ainda nao forneceu):
1. **Objetivo:** O que esse processo precisa produzir? Qual resultado?
2. **Cliente:** Quem recebe o output? (pessoa, time, cliente externo)
3. **Restricoes:** Tempo, pessoas, ferramentas, orcamento
4. **Frequencia:** Diario? Semanal? Por demanda? Unico?
5. **Complexidade:** Simple (receita), Complicated (expertise), Complex (emergente)?

### Step 2: Definir Objetivo e Principios (Drucker + Allen)

- Declarar o objetivo em uma frase: "Este processo existe para {resultado} para {cliente}."
- Definir principios limitantes: o que NAO fazemos nesse processo
- Testar: se esse processo nao existisse, o que aconteceria? (validacao de necessidade)

### Step 3: Planejar Naturalmente (Allen — NPM)

1. **Proposito:** Por que esse processo precisa existir?
2. **Visao:** Como e quando funciona bem? Qual e o output ideal?
3. **Brainstorm:** Listar todas as etapas possiveis sem filtro
4. **Organizar:** Sequenciar, priorizar, eliminar redundancias
5. **Next actions:** Definir o primeiro passo concreto de implementacao

### Step 4: Desenhar o Fluxo (Ohno + Goldratt)

Principios de design:
- **Pull system:** Cada etapa puxa do anterior (evitar push/acumulo)
- **Flow:** Minimizar handoffs e filas entre etapas
- **Constraint-aware:** Antecipar onde estara o gargalo e proteger
- **Takt time:** Se ha ritmo previsivel, cadenciar as etapas
- **One-piece flow:** Preferir processar uma unidade por vez

Para cada etapa definir:
- **Dono:** Quem e responsavel
- **Input:** O que recebe
- **Acao:** O que faz
- **Output:** O que entrega
- **DoD:** Definition of Done (quando ta pronto)
- **Tempo esperado:** Cycle time

### Step 5: Adicionar Protecao (Gawande)

Identificar pontos criticos (onde erro = falha grave):
- Criar checklist DO-CONFIRM ou READ-DO
- Maximo 9 itens por checklist
- Focar nos killer items (o que expert esquece)
- Definir pause point claro

Se ha comunicacao entre pessoas/times:
- Formalizar quem fala com quem, quando, sobre o que
- Checklist de handoff nos pontos de transicao

### Step 6: Definir Metricas (Sutherland + Deming)

Maximo 5 metricas de saude:

| Tipo | O que mede |
|------|-----------|
| Throughput | Volume de output por periodo |
| Lead time | Tempo total do inicio ao fim |
| Cycle time | Tempo de etapas individuais |
| WIP | Trabalho acumulado entre etapas |
| Quality | Taxa de erro/retrabalho |

Opcional:
- Happiness metric (satisfacao do time envolvido)
- Customer satisfaction (satisfacao do cliente do processo)

### Step 7: Ciclo de Melhoria (Deming — PDSA)

Embutir no processo:
- **Frequencia de revisao:** Semanal (inicio), quinzenal (estavel), mensal (maduro)
- **PDSA:** O que esperavamos? O que aconteceu? O que mudamos?
- **Retrospectiva curta:** O que funciona? O que nao funciona? O que mudar?

### Step 8: Entregar

Formato de entrega:

```
PROCESSO: {nome}
=================

OBJETIVO: {uma frase}
CLIENTE: {quem recebe o output}
FREQUENCIA: {cadencia}
DONO GERAL: {responsavel pelo processo}

FLUXO:
  {Input} → Etapa 1 ({dono}) → Etapa 2 ({dono}) → ... → {Output}

ETAPAS DETALHADAS:

1. {Nome da Etapa}
   - Dono: {quem}
   - Input: {o que recebe}
   - Acao: {o que faz}
   - Output: {o que entrega}
   - DoD: {quando ta pronto}
   - Tempo: {estimativa}

2. ...

CHECKLISTS:
  [Ponto critico 1]
  - [ ] Item 1
  - [ ] Item 2
  ...

METRICAS:
  1. {metrica}: {como medir}
  2. ...

REVISAO:
  Frequencia: {semanal/quinzenal/mensal}
  Metodo: PDSA
  Primeiro review: {data}
```

## Regras

- NUNCA criar processo sem objetivo claro
- SEMPRE definir dono para cada etapa
- SEMPRE incluir checklists nos pontos criticos
- SEMPRE incluir metricas (max 5)
- SEMPRE incluir ciclo de revisao (PDSA)
- NUNCA criar processo burocratico — minimo viavel que funciona
- SEMPRE perguntar: "esse processo pode ser mais simples?"
