---
task: "Diagnose Issue"
responsavel: "@live-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Relato de problema com uma live já roteirizada"
Saida: "Diagnóstico + ajuste proposto"
execution_type: "sequential"
---

# Task: Diagnose Issue

## Trigger

"essa live não engajou", "o exercício não funcionou"

## Passos

1. Coletar o que o aluno observou (baixo engajamento? exercício confuso? pitch forçado?)
2. Comparar com o Definition of Done do roteiro entregue
3. Identificar o gap mais provável (bloco fraco, exercício sem entrega tangível, pitch mal integrado, tema genérico demais)
4. Propor ajuste concreto pra próxima live
5. Documentar o padrão se for recorrente (`document-process.md`)
