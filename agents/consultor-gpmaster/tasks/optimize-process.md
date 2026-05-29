# Task: optimize-process

**Purpose:** Otimizar um processo existente usando diagnostico + melhoria sistematica.

## Trigger

- Comando: `*optimize {descricao ou arquivo}`
- Linguagem natural: "como melhoro isso", "ta lento", "tem gargalo", "nao ta funcionando"

## Step-by-Step Execution

### Step 1: Diagnosticar Primeiro

Rodar o workflow completo de `judge-process.md` antes de qualquer otimizacao.
O diagnostico produz: constraint, desperdicios, estabilidade, pontos criticos, contribuicao.

Sem diagnostico nao ha otimizacao — ha chute.

### Step 2: Priorizar pelo Constraint (Goldratt — 5 Focusing Steps)

**2.1 — Identificar o constraint:**
O diagnostico ja apontou. Confirmar: "Se eu resolver isso, o throughput total melhora?"

**2.2 — Explorar o constraint:**
Antes de investir, extrair o maximo:
- O constraint esta parado em algum momento? Eliminar idle time.
- O constraint processa coisas desnecessarias? Priorizar.
- O constraint recebe input no tempo certo? Criar buffer se necessario.

**2.3 — Subordinar tudo ao constraint:**
Ajustar o ritmo dos nao-constraints ao constraint.
Nao-constraints podem ficar ociosos — isso e CORRETO.

**2.4 — Elevar (se necessario):**
Se exploit + subordinate nao bastou:
- Automatizar a etapa
- Dividir em sub-etapas paralelas
- Adicionar capacidade (pessoa, ferramenta)

**2.5 — Repetir:**
O constraint muda de lugar. Verificar onde foi parar e recomecar.

### Step 3: Eliminar Desperdicios (Ohno — 7 Mudas)

Para cada muda identificado no diagnostico:

| Muda | Acao |
|------|------|
| Superprodução | Mudar para pull. Produzir so quando pedir. |
| Estoque/WIP | Kanban com WIP limits. Reduzir batch size. |
| Transporte | Aproximar etapas. Eliminar movimentacao desnecessaria. |
| Movimento | Ferramentas ao alcance. Eliminar busca de info. |
| Espera | Balancear carga. Buffer antes do constraint. Eliminar aprovacoes. |
| Superprocessamento | Perguntar ao cliente. Cortar o excesso. |
| Defeitos | 5 Whys → causa raiz. Poka-yoke. Jidoka (parar e resolver). |
| Talento desperdicado | Delegation Poker. Envolver em melhoria. |

### Step 4: Estabilizar (Deming)

Se o processo e instavel (resultados imprevissiveis):
1. Classificar variacao: common cause vs special cause
2. Special cause → investigar e eliminar
3. Common cause → mudar o sistema (nao as pessoas)
4. Nao reagir a cada flutuacao (tampering piora)
5. Usar PDSA para cada mudanca proposta

### Step 5: Proteger (Gawande)

Para pontos criticos sem protecao:
1. Listar killer items (o que expert esquece)
2. Criar checklist 5-9 itens
3. Tipo: DO-CONFIRM (experts) ou READ-DO (novatos/alta pressao)
4. Pause point claro
5. Testar em condicao real

### Step 6: Energizar (Appelo + Sutherland)

Se o time esta desmotivado:
1. Rodar Moving Motivators (o que motiva cada pessoa)
2. Verificar nivel de delegacao (Delegation Poker)
3. Medir Happiness Metric
4. Identificar: o time e mercenario ou missionario? (Cagan)
5. Uma melhoria por ciclo baseada no feedback do time

### Step 7: Entregar Plano de Melhoria

Formato:

```
PLANO DE OTIMIZACAO — {nome do processo}
=========================================

DIAGNOSTICO RESUMIDO:
  Score atual: {1-10}
  Constraint: {onde}
  Desperdicios: {lista}
  Instabilidade: {sim/nao, tipo}

ACOES IMEDIATAS (esta semana):
1. {acao} — {impacto esperado} — {responsavel}
2. ...

ACOES DE MEDIO PRAZO (proximo mes):
1. {acao} — {impacto esperado} — {responsavel}
2. ...

ACOES DE LONGO PRAZO (se necessario):
1. {acao} — {impacto esperado}

METRICAS DE ACOMPANHAMENTO:
- {metrica 1}: baseline {X} → meta {Y}
- {metrica 2}: baseline {X} → meta {Y}

CICLO PDSA:
- Primeiro teste: {data}
- Primeiro review: {data}
- Frequencia: {semanal/quinzenal}

SCORE ESPERADO APOS OTIMIZACAO: {1-10}
```

### Step 8: Follow-up

Oferecer:
- "Quer que eu monte o checklist pra algum ponto critico?"
- "Quer que eu detalhe alguma acao?"
- "Quando quiser revisar, roda *judge de novo e comparamos."

## Regras

- NUNCA otimizar sem diagnosticar primeiro
- SEMPRE comecar pelo constraint (5 Focusing Steps)
- NUNCA otimizar nao-constraints antes do constraint
- SEMPRE usar PDSA para cada mudanca (teste pequeno primeiro)
- NUNCA recomendar "trabalhar mais" como solucao
- SEMPRE entregar baseline + meta para cada metrica
- SEMPRE incluir responsavel para cada acao
