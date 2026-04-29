# Task: validate-mind

## Objetivo

Validacao final da mente forjada: verificacao estrutural, smoke tests e aprovacao do usuario.

## Trigger

- Handoff automatico da Fase 4 (forge-mind)

## Pre-condicoes

- Fase 4 completa (QG-MF-004 passed)
- Artefatos completos em `04-forged/`

## Agente Executor

@forge-chief

## Passos

### Step 1: Validacao Estrutural

Verificar que todos os artefatos existem e estao corretos:

- [ ] `04-forged/config.yaml` — name, version, type: single-mind
- [ ] `04-forged/skill.md` — shim de ativacao aponta pro agent
- [ ] `04-forged/agents/{slug}.md` — agent com todas as secoes
- [ ] `04-forged/data/{slug}-kb.md` — KB >= 300 linhas
- [ ] `04-forged/tasks/start.md` — task de entrada
- [ ] `04-forged/tasks/*.md` — pelo menos 1 task de modo operacional

Verificar coerencia interna:
- [ ] config.yaml lista todos os agents e tasks que existem
- [ ] agent.md referencia KB no path correto
- [ ] skill.md aponta pro agent correto
- [ ] Tasks referenciam KB quando necessario

### Step 2: Smoke Tests (3 cenarios)

Apresentar 3 cenarios realistas ao usuario e mostrar como a mente responderia:

**Teste 1 — Modo Principal:**
Simular usuario ativando o modo principal com input realista.
Mostrar como a mente usaria a KB e o protocolo do modo pra responder.

```
CENARIO: Usuario pede "{descricao do pedido realista}"

COMO A MENTE RESPONDERIA:
- Ativa modo: {modo}
- Consulta KB secoes: {secoes relevantes}
- Segue protocolo: {passos}
- Output:
  {exemplo de resposta baseado na KB e regras}
```

**Teste 2 — Immune System:**
Simular trigger que deve ativar o immune system.

```
CENARIO: Usuario pede "{trigger que viola anti-padrao}"

COMO A MENTE RESPONDERIA:
- Immune system detecta: {trigger}
- Resposta automatica: "{resposta}"
- Redireciona para: {acao correta}
```

**Teste 3 — Edge Case:**
Simular pergunta na fronteira da expertise da mente.

```
CENARIO: Usuario pergunta "{algo no limite do escopo}"

COMO A MENTE RESPONDERIA:
- Identifica que esta no limite do escopo
- Responde com: {o que sabe} + {reconhece limite}
- NAO inventa: {o que nao esta na KB}
```

**Teste 4 — Context Death Test (inspirado por Alan Nicolas):**
Simular cold-start: alguem que NUNCA usou a mente antes, sem nenhum contexto, ativa e faz um pedido real.

```
CENARIO: Usuario novo ativa /{slashPrefix} pela primeira vez e pede:
"{pedido realista sem contexto previo}"

A MENTE CONSEGUE:
- [ ] Entender o pedido sem precisar de contexto extra?
- [ ] Acessar a KB e encontrar a informacao relevante?
- [ ] Responder de forma completa e util?
- [ ] Seguir o protocolo do modo correto?

Se NAO em qualquer item: a KB, o agent ou o start.md estao incompletos.
A mente precisa funcionar FRIA — sem contexto de quem a criou.
```

### Step 3: Apresentar Resultado ao Usuario

```
=== MENTE FORJADA: {nome} ===

Tipo: {Sintetica | Consultor}
Agent: {linhas} linhas
KB: {linhas} linhas, {dominios} dominios
Modos: {lista}
Immune System: {N} triggers
Heuristicas: {N} SE/ENTAO

--- SMOKE TESTS ---

Teste 1 (Modo Principal): {PASS/FAIL}
{resumo}

Teste 2 (Immune System): {PASS/FAIL}
{resumo}

Teste 3 (Edge Case): {PASS/FAIL}
{resumo}

Teste 4 (Context Death Test): {PASS/FAIL}
{resumo}

A mente ta pronta. Quer instalar ou ajustar algo?
```

### Step 4: Ciclo de Refinamento (minimo 1 iteracao)

Antes de coletar aprovacao final, executar pelo menos 1 ciclo de refinamento:

**Iteracao 1 (obrigatoria):**
1. Revisar smoke tests — identificar pontos fracos na resposta da mente
2. Verificar se KB tem gaps revelados pelos testes (dominio sem profundidade, modo sem output example)
3. Ajustar artefatos em `04-forged/` se necessario (micro-correcoes diretas, sem voltar pra Fase 4)
4. Re-executar smoke test que falhou ou ficou fraco

**Iteracao 2+ (se necessario):**
- Se ajuste foi significativo (>10% da KB mudou), re-executar TODOS os smoke tests
- Se ajuste foi menor (correcao pontual), re-executar apenas o teste afetado
- Maximo 3 iteracoes antes de escalar pro usuario

**Regra 40/20/40 (inspirada por Alan Nicolas):**
A validacao/refinamento deve receber ~40% do esforco total do pipeline.
Se Fases 1-2 levaram 60min e Fase 4 levou 30min, a Fase 5 deve levar ~35-40min.
Nao apressar a validacao — mente mal testada e mente que falha em producao.

### Step 5: Coletar Aprovacao

O usuario decide:
1. **Aprovar** — mente pronta pra instalar
2. **Ajustar** — voltar pra Fase 4 com feedback especifico
3. **Rejeitar** — voltar pra Fase 2 com feedback

### Step 6: Quality Gate QG-MF-005

- [x] Validacao estrutural passou
- [x] 3/4 smoke tests satisfatorios (incluindo Context Death Test)
- [x] Usuario aprovou

**Veto:** Usuario rejeita ou 0/4 smoke tests passam.

### Step 7: Instalacao

Se aprovado, instalar a mente:

1. Copiar `04-forged/` para `agents/{mind-slug}/`
2. Criar `.claude/commands/{slashPrefix}.md` com shim de ativacao
3. Gerar relatorio final em `05-validation/validation-report.yaml`

```yaml
validation:
  mind_slug: "{slug}"
  mind_name: "{nome}"
  mode: "{synthetic|consultant}"
  structural_validation: "PASS"
  smoke_tests:
    test_1: "PASS|FAIL"
    test_2: "PASS|FAIL"
    test_3: "PASS|FAIL"
  user_approved: true
  installed_at: "agents/{mind-slug}/"
  slash_command: "/{slashPrefix}"
  completed_at: "{timestamp}"
```

### Step 8: Atualizar State Final

```json
{
  "phase_status": { "phase_5": "completed" },
  "current_phase": 5,
  "quality_gates_passed": ["QG-MF-001", "QG-MF-002", "QG-MF-003", "QG-MF-004", "QG-MF-005"],
  "completed_at": "{timestamp}",
  "installed": {
    "path": "agents/{mind-slug}/",
    "slash_command": "/{slashPrefix}"
  }
}
```

### Step 9: Mensagem Final

```
Mente instalada com sucesso.

- Ativar: /{slashPrefix}
- Path: agents/{mind-slug}/
- KB: agents/{mind-slug}/data/{mind-slug}-kb.md

Bora testar ao vivo?
```

## Formato de Output

- `05-validation/validation-report.yaml`
- Mente instalada em `agents/{mind-slug}/`
- Comando em `.claude/commands/{slashPrefix}.md`

## Error Handling

| Cenario | Acao |
|---------|------|
| Validacao estrutural falha | Listar items faltantes, voltar pra Fase 4 |
| 0/3 smoke tests | Diagnosticar problema, ajustar na Fase 4 |
| Usuario quer ajustar | Coletar feedback, handoff pra @mind-smith |
| Conflito de nome na instalacao | Perguntar se quer sobrescrever |

## Completion Criteria

- Validacao estrutural PASS
- 2/3 smoke tests PASS
- Usuario aprovou
- Mente instalada no path correto
- Slash command criado
- Validation report salvo
- State finalizado
