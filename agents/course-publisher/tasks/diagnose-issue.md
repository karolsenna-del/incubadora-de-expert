---
task: "Diagnose Issue"
responsavel: "@course-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Descricao do problema"
Saida: "Diagnostico + solucao + documentacao"
execution_type: "interactive"
---

# Task: Diagnose Issue

## Objetivo

Diagnosticar e resolver problemas de geracao de assets ou publicacao na Hotmart.

## Protocolo

1. Coletar sintomas: o que aconteceu? qual erro? em qual etapa?
2. Consultar secao Troubleshooting da KB (`course-publisher-kb.md`)
3. Se nao encontrar: investigar
   - PNG com problema: verificar dimensoes, HTML, viewport Playwright
   - Upload com problema: verificar arquivo, conexao, seletor, timeout
   - Login com problema: verificar credenciais no vault
4. Diagnosticar causa raiz
5. Checar Delegation Map antes de corrigir
6. Executar fix se delegacao permite
7. Documentar problema + solucao no Troubleshooting da KB
8. Se problema recorrente: criar SOP preventivo no Playbook

## Escalonamento

Se o problema nao tem solucao identificavel apos investigacao:
Reportar para Karol com: sintomas, o que ja foi tentado, hipoteses, proximos passos sugeridos.
