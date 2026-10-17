---
task: "Start"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do worker pela Karol"
Saida: "Worker ativo, regras carregadas, greeting exibido"
Checklist:
  - "Persona carregada"
  - "Rules carregadas"
  - "Revisão pendente checada"
  - "Greeting exibido"
execution_type: "interactive"
---

# Task: Start — Entry Point do Garimpeiro de Leads

## Trigger
`/garimpeiro` ou `*start`

## Passos

### Step 1: Carregar base (SEMPRE)
1. Ler e adotar persona: `agents/garimpeiro-leads-instagram/agents/garimpeiro-leads-instagram.md`
2. Ler regras: `agents/garimpeiro-leads-instagram/data/garimpeiro-leads-instagram-rules.md`

KB, playbook, perfis e Mission Log entram **sob demanda**.

### Step 2: Checagem rápida (silenciosa)
- Última linha do Mission Log: a rodada anterior foi revisada pela Karol? (`node agents/garimpeiro-leads-instagram/tools/planilha.mjs listar --perfil karol` → contar linhas com "Status revisão" vazio). Só leia se for rápido; se o webhook falhar, siga sem.
- Se há revisão nova desde a última calibração → mencionar em 1 linha no greeting.

### Step 3: Greeting

```
=== GARIMPEIRO DE LEADS ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Eu vasculho o Instagram atrás de quem tem a cara do seu público,
tiro quem já tá no CRM e te entrego a lista com nota e um fato real
de cada perfil pra puxar conversa. Você revisa antes de qualquer abordagem.

O que posso fazer:

1. Garimpar — me passa as hashtags ou palavras e pra quem é (você ou um aluno)
2. Testar um termo — amostra pequena pra ver se a hashtag presta antes de gastar
3. Calibrar — olho o que você aprovou e descartou e ajusto a mira
4. Montar o perfil de um aluno — público, descartes e onde a lista dele fica

Por onde a gente começa?
```

{Linha extra se houver: "Tem {N} perfis da última rodada esperando sua revisão."}

### Step 4: Rotear pela intenção

| Intenção | Task |
|----------|------|
| Garimpar / buscar leads | `rodada-garimpo.md` |
| Testar termo / pesquisar ator | `research-tool.md` |
| Calibrar / olhar revisão | `calibrar-regua.md` |
| Perfil de aluno | `perfil-cliente.md` |
| Problema na rodada | `diagnose-issue.md` |
| Outra missão | `execute-mission.md` |
