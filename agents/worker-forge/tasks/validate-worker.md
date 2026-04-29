---
task: "Validate Worker"
responsavel: "@worker-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Worker AIOS montado"
Saida: "Worker validado e operacional (ou lista de correcoes)"
Checklist:
  - "Smoke test 1: missao simples executada"
  - "Smoke test 2: ferramenta desconhecida pesquisada"
  - "Smoke test 3: SOP criada automaticamente"
  - "Smoke test 4: diagnostico executado"
  - "Usuario aprovou"
execution_type: "interactive"
---

# Task: Validate Worker — Validacao Final

## Objetivo

Testar o worker com missoes reais e obter aprovacao do usuario.

## Posicao no Workflow

Fase 5 do pipeline. Gate: QG-WF-005.

## PRD Fulfillment Check

ANTES dos smoke tests, verificar se o worker montado atende ao WORKER-PRD gerado na Discovery.

### Step 1: Carregar WORKER-PRD

Ler `agents/worker-forge/output/{slug}/WORKER-PRD.md`.
Se nao existe: pular PRD Fulfillment Check e ir direto pros smoke tests (pipeline legacy).

### Step 2: Checklist Automatico

Para CADA secao do WORKER-PRD, verificar no worker montado:

**Secao 2 — Duties:**
- [ ] Cada duty listada no PRD tem task correspondente OU esta coberta por um dos 4 modos padrao
- [ ] Criterios de aceite de cada duty sao verificaveis pelo Scoreboard no agent.md

**Secao 3 — Ferramentas:**
- [ ] Cada ferramenta requerida esta documentada na Foundation KB ({slug}-kb.md)
- [ ] Nivel minimo de conhecimento coberto (API docs, troubleshooting, integracoes)

**Secao 4 — Autonomia:**
- [ ] Delegation Map no agent.md cobre todas as decisoes listadas no PRD
- [ ] Niveis de autonomia sao consistentes (min 1 nivel 7, min 1 nivel 1-3)

**Secao 5 — Metricas:**
- [ ] Scoreboard no agent.md reflete as metricas do PRD
- [ ] Cada metrica tem forma de medicao definida

**Secao 6 — Restricoes:**
- [ ] Boundaries no agent.md refletem restricoes do PRD
- [ ] Strict Rules cobrem pelo menos os "NAO faz" do PRD

### Step 3: Report de Fulfillment

```
=== PRD FULFILLMENT — {worker name} ===

CHECKS: {X} de {Y} aprovados

APROVADOS:
- {check que passou}

GAPS:
- {gap encontrado}: {descricao}

RECOMENDACAO: {prosseguir para smoke tests / resolver gaps primeiro}
```

**Decisao:**
- Se ZERO gaps → prosseguir pros smoke tests
- Se gaps menores (cosmeticos) → registrar e prosseguir
- Se gaps criticos (duty nao coberta, ferramenta sem KB) → voltar pra Assembly (Fase 4), corrigir, re-validar

## Smoke Tests

### Test 1: Missao Simples
Pedir ao worker pra executar uma missao basica do dominio dele.
Verificar: entendeu a missao? Checou playbook? Executou? Reportou? Documentou?

### Test 2: Pesquisa de Ferramenta Nova
Pedir ao worker pra estudar uma ferramenta que NAO esta na KB.
Verificar: pesquisou? Sintetizou? Adicionou a KB?

### Test 3: Documentacao Automatica
Apos Test 1, verificar se o worker criou/atualizou SOP no Playbook.
Verificar: SOP esta no Playbook? Tem passos claros? E reutilizavel?

### Test 4: Diagnostico
Apresentar um problema do dominio.
Verificar: consultou KB? Investigou? Diagnosticou? Propos solucao?

## Criterios de Aprovacao

3/4 smoke tests devem passar. Se 2/4 falharem: identificar causa, corrigir, re-testar.

Apos smoke tests, apresentar resultado ao usuario:

```
=== VALIDACAO: {worker name} ===

Smoke Tests:
  1. Missao simples: {PASS/FAIL} — {resumo}
  2. Pesquisa ferramenta: {PASS/FAIL} — {resumo}
  3. Documentacao automatica: {PASS/FAIL} — {resumo}
  4. Diagnostico: {PASS/FAIL} — {resumo}

Resultado: {3/4 ou 4/4}

{Se >=3: "Worker operacional. Quer ativar?"}
{Se <3: "Precisa de ajustes em {areas}. Vou corrigir."}
```

## Ativacao

Se usuario aprovar:

1. Mover worker de `agents/worker-forge/output/{slug}/` para `agents/{slug}/`
2. Registrar skill no `.claude/commands/{slashPrefix}.md`
3. Confirmar:

```
Worker ativado!

Comando: /{slashPrefix}
Skill: agents/{slug}/skill.md

Ele ta pronto pra receber missoes.
```

## Quality Gate: QG-WF-005

| Criterio | Obrigatorio |
|----------|-------------|
| >= 3/4 smoke tests passaram | Sim |
| Usuario aprovou | Sim |

**Veto:** < 2/4 smoke tests, usuario rejeitou.

## Error Handling

| Cenario | Acao |
|---------|------|
| Smoke test falha por KB rasa | Voltar pra Research, enriquecer KB |
| Smoke test falha por agent mal definido | Corrigir agent.md, re-testar |
| Usuario quer ajustes | Integrar, re-montar, re-testar |
| Worker funciona mas usuario nao gosta do tom | Ajustar personalidade no agent.md |
| PRD fulfillment encontra gap critico | Voltar pra Assembly (Fase 4), corrigir, re-validar |
| WORKER-PRD nao encontrado | Pular PRD check, executar smoke tests normalmente (pipeline legacy) |
