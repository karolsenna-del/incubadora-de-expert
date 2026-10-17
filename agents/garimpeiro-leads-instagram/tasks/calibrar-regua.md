---
task: "Calibrar Régua"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aba de garimpo com coluna 'Status revisão' preenchida pela Karol"
Saida: "Taxa de acerto + proposta de ajuste (termos, descartes, régua)"
execution_type: "semantic"
---

# Task: Calibrar Régua

## Passos
1. `node agents/garimpeiro-leads-instagram/tools/planilha.mjs listar --perfil {cliente}` → linhas com "Status revisão" preenchido desde a última calibração (data no Mission Log).
2. Calcular:
   - Acerto por prioridade: aprovados ÷ revisados (p1, p2, p3)
   - Acerto por termo
   - Padrões nos descartados da Karol (palavras na bio, categoria, faixa de seguidores)
3. Se acerto da prioridade 1 ≥ 70% → registrar no Mission Log e seguir.
4. Se < 70% → montar proposta:
   ```
   Acerto p1: {x}% ({a} de {b}). Você descartou mais: {padrão}.
   Proposta: {adicionar "palavra" aos descartes | subir mínimo de seguidores pra N | parar de usar #termo}
   Aplico?
   ```
5. Só aplicar no `data/perfis/{cliente}.json` com OK (nível 3). Registrar a mudança no playbook (histórico de régua).

## Nunca
- Ajustar perfil sem OK
- Concluir com menos de 10 revisados ("amostra pequena — volto depois de mais revisão")
