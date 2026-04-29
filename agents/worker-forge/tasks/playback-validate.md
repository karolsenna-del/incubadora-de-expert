---
task: "Playback Validate"
responsavel: "@worker-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Proposta completa do worker"
Saida: "Proposta validada pelo usuario (aprovada, corrigida ou rejeitada)"
Checklist:
  - "Proposta apresentada em formato legivel"
  - "Usuario respondeu (aprovado/correcoes/rejeitado)"
  - "Correcoes integradas (se houver)"
  - "QG-WF-003 avaliado"
execution_type: "interactive"
---

# Task: Playback Validate — Validacao da Proposta

## Objetivo

Apresentar a proposta completa do worker pro usuario em formato legivel e coletar aprovacao, correcoes ou rejeicao.

## Posicao no Workflow

Fase 3 do pipeline. Gate: QG-WF-003.

## Protocolo de Apresentacao

### Formato

```
=== PROPOSTA DE WORKER: {nome} ===

Proposito: {1-2 frases}
Dominio: {area de atuacao}
Ferramentas: {lista}

--- CARGO ---

Responsabilidades:
  1. {duty 1} ({X}% do tempo)
  2. {duty 2} ({Y}% do tempo)
  ...

Scope: {o que FAZ}
Boundaries: {o que NAO faz}

--- AUTONOMIA ---

| Tipo de Decisao | Nivel | Traduzindo |
|-----------------|-------|------------|
| {decisao 1} | 7 — Delegate | Faz sozinho, nem reporta |
| {decisao 2} | 5 — Advise | Faz e reporta |
| {decisao 3} | 3 — Consult | Propoe, voce decide |
| ...

--- COMO ELE OPERA ---

4 modos padrao:
  1. Missao — voce pede, ele faz
  2. Pesquisa — estuda ferramenta nova, adiciona a KB
  3. Documentacao — documenta o que fez (automatico)
  4. Diagnostico — investiga quando algo da errado

{+ modos especificos se houver}

--- KB INICIAL ---

Ferramentas pesquisadas: {lista}
Dominios cobertos: {lista}
SOPs existentes: {N}
Tamanho: {N} linhas
Gaps: {lista se houver}

--- COMO VOCE MEDE ---

KPIs: {lista}
Missao completa = {criterios}

---

Isso bate com o funcionario que voce precisa?
O que ajustaria?
```

### Regras do Playback

- NUNCA apresentar YAML ou JSON bruto
- SEMPRE traduzir niveis de Appelo pra linguagem simples
- Mostrar a KB em resumo (dominios + tamanho), nao o conteudo inteiro
- Terminar com pergunta aberta: "O que ajustaria?"
- Se usuario disser "bate" ou "aprovado": QG-WF-003 passed
- Se usuario corrigir: integrar, re-apresentar secao corrigida
- Se correcoes forem significativas (>30% mudou): re-apresentar tudo

### Apos Aprovacao

```
Worker aprovado. Vou montar agora.

Proximo passo: Assembly — construir a estrutura AIOS completa.
Isso inclui: agent.md, tasks, KB, workflow, config, skill.

Quando terminar, te chamo pra testar com uma missao real.
```

Handoff para @worker-smith com task `assemble-worker`.

## Quality Gate: QG-WF-003

| Criterio | Obrigatorio |
|----------|-------------|
| Usuario respondeu | Sim |
| Resposta e aprovacao (explicita ou implicita) | Sim |
| Correcoes integradas (se houve) | Sim |

**Veto:** Usuario rejeitou ("nao e isso").
**Acao se rejeitado:** Entender o que ta errado, voltar pra Fase 0 ou 1.

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario aprova parcialmente | Integrar correcoes, re-apresentar secao afetada |
| Usuario rejeita completamente | Voltar pra Discovery, re-entender necessidade |
| Usuario pede funcionalidade impossivel | Explicar limite, propor alternativa |
| Usuario quer adicionar ferramenta | Voltar pra Research (Fase 1) pra pesquisar |
