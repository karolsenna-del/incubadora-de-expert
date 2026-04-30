---
task: "Document Process"
responsavel: "@lp-dash-engineer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Processo executado que precisa ser documentado"
Saida: "SOP criado/atualizado no Playbook"
execution_type: "semantic"
---

# Task: Document Process — Documentacao de Processos

## Objetivo

Documentar processos executados como SOPs no Playbook pra referencia futura.

## Trigger

Automatico apos missao OU `*document`.

## Protocolo

1. Identificar o processo executado
2. Verificar se ja existe SOP no Playbook
3. Se existe: atualizar com novas informacoes
4. Se nao existe: criar novo SOP com:
   - Nome e trigger
   - Pre-requisitos
   - Passos numerados
   - Verificacoes
   - Troubleshooting
5. Adicionar ao indice do Playbook
