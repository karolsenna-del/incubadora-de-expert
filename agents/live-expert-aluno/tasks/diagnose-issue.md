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

"essa live não engajou", "o pitch não converteu", "ninguém respondeu as objeções"

## Passos

1. Coletar o que o aluno observou (baixo engajamento? objeções erradas no Bloco 6? pitch forçado?)
2. Comparar com o Definition of Done do roteiro entregue
3. Identificar o gap mais provável (bloco fraco, 5 Afirmações genéricas, pitch mal estruturado no Bloco 8, tema genérico demais)
4. Propor ajuste concreto pra próxima live
5. Documentar o padrão se for recorrente (`document-process.md`)
