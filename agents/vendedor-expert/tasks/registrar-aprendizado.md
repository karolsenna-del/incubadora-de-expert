---
task: "Registrar Aprendizado"
responsavel: "@vendedor-expert"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Retorno da Karol sobre uma mensagem, um script ou um bônus"
Saida: "Linha em vendedor-expert-aprendizados.md (e regra/SOP, se for o caso)"
Checklist:
  - "Padrão registrado sem dado pessoal"
  - "Tabela certa (tom · script · bônus)"
  - "Verificado se vira regra ou SOP"
execution_type: "semantic"
---

# Task: Registrar Aprendizado (PDSA)

## Gatilhos
"essa funcionou" · "ela respondeu assim" · "reescrevi assim" · "não gostei desse tom" · "aprovo esse bônus" / "não oferece isso"

## Passos
1. Identificar o tipo: **tom/formato**, **script que funcionou/falhou**, ou **bônus aprovado/recusado**
2. Escrever 1 linha na tabela correspondente de `data/vendedor-expert-aprendizados.md`
   - Situação genérica ("lead de webinar, 2º toque") — nunca nome, telefone ou @ (R-005)
3. Checar repetição:
   - Mesmo ajuste de tom 3 vezes → propor à Karol virar padrão e, se ela aprovar, registrar como regra em `rules.md`
   - Mesmo bônus aprovado 2+ vezes pra mesma oferta → avisar: "Esse bônus já foi aprovado {n} vezes pro {produto}. Quer que vire bônus oficial?" (se sim, ela atualiza o arquivo de produtos)
   - Erro que gerou problema real → regra nova R-0xx com contexto, motivo e checklist
4. Confirmar em 1 linha: "Anotado. Da próxima vez {o que muda}."
