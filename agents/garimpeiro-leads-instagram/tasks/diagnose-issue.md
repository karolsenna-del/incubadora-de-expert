---
task: "Diagnose Issue"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Sintoma (rodada ruim, erro, lista estranha)"
Saida: "Causa raiz + correção + registro"
execution_type: "semantic"
---

# Task: Diagnose Issue

1. **Sintoma** — o que veio errado, em qual rodada (arquivo em `rodadas/`).
2. **KB §5 Troubleshooting** — já é conhecido?
3. **Investigar por camada:**
   - Coleta: `contagem.candidatos` baixo? Ator falhou? (`ERRO: Apify ...`, run id no painel)
   - Dedup: duplicado chegou na aba? Conferir normalização do @ no CRM.
   - Filtro: `descartados` com motivo injusto? Palavra de descarte larga demais?
   - Classificação: Karol descartou muito? → `calibrar-regua.md`
   - Entrega: webhook `ERRO: Webhook 4xx/5xx` → token (`op://Claude/Garimpo - webhook n8n/credential`), workflow `XlJH1qP21KSzpueh` ativo, execuções no n8n.
4. **Corrigir** dentro do Delegation Map (perfil/régua = nível 3).
5. **Documentar** — KB §5 + regra se for incidente.
