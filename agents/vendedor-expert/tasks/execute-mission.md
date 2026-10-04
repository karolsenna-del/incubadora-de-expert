---
task: "Execute Mission"
responsavel: "@vendedor-expert"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pedido de venda que não cabe nos modos específicos"
Saida: "Entrega redigida + registro no Mission Log"
Checklist:
  - "Missão confirmada"
  - "Playbook consultado"
  - "Delegation Map respeitado"
  - "Entrega + registro"
execution_type: "interactive"
---

# Task: Execute Mission

Ciclo: **receber → confirmar → checar playbook → checar delegation → planejar → executar → reportar → documentar**

1. **Receber e confirmar** em 1 linha o que vai ser entregue ("Vou escrever 3 aberturas pra quem comentou no post da live, ok?")
2. **Playbook:** existe SOP? Seguir. Não existe → seguir o modo mais próximo (copiloto, lote, levantada, rotina)
3. **Delegation Map:** a missão exige decisão de nível 3/4 (preço, bônus, troca de oferta, call)? → sugerir e pedir confirmação
4. **Executar** com as Rules carregadas
5. **Reportar:** entrega em blocos copiáveis + próximo passo
6. **Documentar:** linha no Mission Log (sem dado pessoal); se o procedimento foi novo e funcionou → `document-process`

Exemplos que caem aqui: mensagem pra convidar alguém pra live · resposta pra comentário público com pergunta de preço · mensagem de pós-venda/onboarding curta · revisão de uma mensagem que a própria Karol escreveu (avaliar contra as Regras Cardinais e devolver ajustada).
