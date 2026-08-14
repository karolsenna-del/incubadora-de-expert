---
task: "Start"
responsavel: "@gestor-infra"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do worker pelo usuario"
Saida: "Worker ativo, base carregada, pronto pra receber missao"
Checklist:
  - "Persona carregada"
  - "Rules carregadas"
  - "Credentials Vault carregado"
  - "Greeting exibido"
execution_type: "interactive"
---

# Task: Start — Entry Point do Gestor de Infra Arcane

## Objetivo

Ativar o Gestor de Infra Arcane e preparar pra receber missoes.

## Trigger

- `/gestorInfra-arcane` ou `*start`

## Passos

### Step 1: Carregar Base (SEMPRE)

Estes 3 arquivos sao carregados em TODA ativacao:

1. Ler e adotar persona de `squads/gestor-infra/agents/gestor-infra.md`
2. Carregar Regras Operacionais: `squads/gestor-infra/data/gestor-infra-rules.md`
3. Carregar Credentials Vault: `squads/gestor-infra/data/gestor-infra-vault.md`

### Step 2: Exibir Greeting

```
=== GESTOR DE INFRA · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Operador de infra geral. Pronto pra missao.

O que precisa? Me passa a tarefa que eu resolvo.
```

**Regras do Greeting:**
- NAO listar comandos
- NAO explicar o que faz
- NAO listar ferramentas
- Ir direto ao ponto — curto e operacional

### Step 3: Aguardar Missao e Carregar Condicional

Com a resposta do usuario, identificar o modo e carregar sob demanda:

| Tipo de missao | Carregar adicional | Task |
|----------------|-------------------|------|
| Missao envolvendo disparo | Playbook SOPs relevantes | `execute-mission` |
| Missao envolvendo shift de evento | Playbook SOP-008 | `execute-mission` |
| Auditoria pipeline | Playbook SOP-010 + KB secao 2.5 | `execute-mission` |
| Criar/operar workflow n8n | KB secao 9 + Playbook SOP-016 | `execute-mission` |
| Missao generica/nova | KB + Playbook completos | `execute-mission` |
| Pesquisa de ferramenta | KB | `research-tool` |
| Diagnostico de problema | KB + Playbook | `diagnose-issue` |
| Documentar processo | Playbook (pra ver template) | `document-process` |

**Paths dos arquivos condicionais:**
- KB: `squads/gestor-infra/data/gestor-infra-kb.md`
- Playbook: `squads/gestor-infra/data/gestor-infra-playbook.md`

## Error Handling

| Cenario | Acao |
|---------|------|
| Arquivo nao encontrado | Avisar e operar com conhecimento base |
| Missao vaga | Pedir clarificacao: "Me da mais detalhe: o que precisa ser feito, em qual plataforma, e qual resultado esperado?" |
