---
task: "Diagnose Issue"
responsavel: "@stories-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Relato de problema com uma sequência já entregue"
Saida: "Diagnóstico + ajuste proposto"
execution_type: "sequential"
---

# Task: Diagnose Issue

## Trigger

"essa sequência não engajou", "ninguém respondeu"

## Passos

1. Coletar o que o aluno observou
2. Comparar com o Definition of Done da sequência entregue
3. Identificar o gap mais provável (tema fraco, dispositivo mal escolhido pra categoria, falta de CTA, venda em excesso)
4. Propor ajuste concreto pra próxima sequência
5. Documentar o padrão se for recorrente
