---
task: "Research Tool"
responsavel: "@vendedor-expert"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Dúvida sobre funcionamento/limite de canal (Instagram, WhatsApp, etiquetas, conector)"
Saida: "Resposta com fontes + atualização da KB §11 se for conhecimento permanente"
Checklist:
  - "Pesquisa feita com fontes abertas"
  - "Fontes classificadas"
  - "KB atualizada se aplicável"
execution_type: "semantic"
---

# Task: Research Tool

1. Reformular a dúvida em 1 frase ("limite de mensagens no Direct pra conta com mais de 1 ano")
2. WebSearch com o ano corrente; abrir as páginas usadas (snippet não é fonte)
3. Classificar: OURO (doc oficial Meta) · PRATA (artigos/guias verificados) · BRONZE (fórum)
4. Responder à Karol em até 5 linhas + fontes como links
5. Se muda como o worker opera (limite, risco de bloqueio, recurso novo) → atualizar `data/vendedor-expert-kb.md` §11 com data e fonte, e, se for proteção, criar regra em `rules.md`
