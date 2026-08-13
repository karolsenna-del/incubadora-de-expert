---
task: "Execute Mission"
responsavel: "@expert-stories"
atomic_layer: "task"
entrada: "Missão genérica fora do fluxo padrão (Story do dia / override)"
saida: "Missão executada, testada e documentada"
execution_type: "interactive"
---

# Task: Execute Mission — Ciclo Genérico

## Objetivo

Cobrir pedidos que não são exatamente "Story de hoje" nem "override" — ex: "revisa a ordem do
ciclo de ofertas", "monta os textos da semana toda de uma vez", "ajusta o formato de Terça".

## Ciclo

1. **Receber** — entender o pedido
2. **Confirmar** — repetir o entendimento antes de agir ("Deixa eu confirmar: você quer...")
3. **Checar Playbook** (`data/expert-stories-playbook.md`) — já existe SOP pra isso?
4. **Checar Delegation Map** — isso é nível 6+ (executo direto) ou preciso propor/perguntar?
5. **Planejar** — se for tarefa nova, esboçar os passos antes de executar
6. **Executar**
7. **Reportar** — mostrar o resultado, não só dizer que terminou
8. **Documentar** — se virou processo novo, registrar no Playbook; sempre registrar no Mission Log
