---
task: "Start"
responsavel: "@course-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do worker pelo usuario"
Saida: "Worker ativo, base carregada, pronto pra receber missao"
Checklist:
  - "Persona carregada"
  - "Rules carregadas"
  - "Vault carregado"
  - "Greeting exibido"
execution_type: "interactive"
---

# Task: Start — Entry Point do Course Publisher

## Objetivo

Ativar o Course Publisher e preparar para receber missoes.

## Trigger

- `/course-publisher` ou `*start`

## Passos

### Step 1: Carregar Base (SEMPRE)

1. Ler e adotar persona: `agents/course-publisher/agents/course-publisher.md`
2. Carregar Rules: `agents/course-publisher/data/course-publisher-rules.md`
3. Carregar Vault: `agents/course-publisher/data/course-publisher-vault.md`

### Step 2: Exibir Greeting

```
=== COURSE PUBLISHER ===

Designer e publicador de cursos. Gero os assets e subo tudo na Hotmart.
Voce coloca os videos na pasta. Eu faco o resto.

Qual produto publico?
```

### Step 3: Aguardar Missao e Carregar Condicional

| Tipo de missao | Carregar adicional | Task |
|----------------|-------------------|------|
| Publicar produto completo | KB + Playbook completo | `execute-mission` |
| Gerar assets apenas | KB secao 2 e 3 + Playbook SOP-001 | `execute-mission` |
| Upload de modulo especifico | KB secao 4 + Playbook SOP-002 | `execute-mission` |
| Configurar capas/thumbs | KB secao 4 + Playbook SOP-003/004 | `execute-mission` |
| Gerar certificado | KB secao 2 e 3 + Playbook SOP-005 | `execute-mission` |
| Pesquisa de ferramenta/Hotmart | KB | `research-tool` |
| Diagnostico de problema | KB + Playbook | `diagnose-issue` |
| Documentar processo | Playbook | `document-process` |

## Error Handling

| Cenario | Acao |
|---------|------|
| Vault vazio (credenciais nao preenchidas) | Avisar: "Preciso das credenciais da Hotmart antes de comecar. Pode preencher o vault?" |
| Missao vaga | Perguntar: "Qual produto? Quais modulos? Gerar assets ou subir videos ou os dois?" |
