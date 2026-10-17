---
task: "Perfil de Cliente"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nome do aluno + o que a Karol sabe do público dele"
Saida: "data/perfis/{aluno}.json aprovado + aba de destino criada"
execution_type: "interactive"
---

# Task: Perfil de Cliente (aluno)

A Karol roda o garimpo PELOS alunos (decisão 17/10/2026). Cada aluno tem perfil próprio.

## Passos
1. Buscar antes de perguntar: `mentoria/alunas/{aluno}/` (persona, nicho, posicionamento). Só perguntar o que não estiver lá.
2. Montar rascunho com o mesmo formato de `data/perfis/karol.json`:
   - `id` (slug), `nome`, `publico_alvo`, `sinais_positivos`, `descartes`, `descartes_palavras` (conservador — só palavra que sozinha descarta), `faixa_seguidores`
   - `destino`: planilha "Garimpo Alunos" + aba `Garimpo - {Nome}`
   - `dedup_crm_karol: false` (o CRM da Karol não é o do aluno)
   - `copy: "nenhuma"` (entrega para no fato-gancho)
   - `nao_abordar: []`
3. Mostrar o rascunho em linguagem comum e pedir OK (nível 3).
4. Destino:
   - Planilha "Garimpo Alunos" ainda não existe → o Gestor de Infra cria (conta karolsenna@incubadoradeexpert.com.br, REGRA-022 dele) e adiciona o ID na lista `PLANILHAS_PERMITIDAS` do nó "Montar requisicao" do workflow n8n `XlJH1qP21KSzpueh` (validar sintaxe antes do PUT — REGRA-012 dele).
   - A aba do aluno é criada sozinha na 1ª rodada (`planilha.mjs` cria aba + cabeçalho).
5. Gravar o perfil aprovado e registrar no Mission Log.
