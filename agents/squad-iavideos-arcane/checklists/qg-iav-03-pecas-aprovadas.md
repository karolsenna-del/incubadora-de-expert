# Checklist: QG-IAV-03 — Peças Aprovadas

Quality gate entre a Fase 5 (Avaliação) e a Fase 6 (Escala). Bloqueia o escalonamento até ao menos uma peça ser aprovada no feedback loop.

## Critérios

- [ ] Cada peça apresentada teve avaliação do usuário (aprovada ou rejeitada)
- [ ] Para peças aprovadas: critério dos 3 segundos checado (hook prende em até 3s)
- [ ] Para peças rejeitadas: feedback do "por que não funcionou" coletado quando possível
- [ ] Peças rejeitadas foram regeneradas com direção específica
- [ ] Ao menos uma peça tem aprovação explícita do usuário
- [ ] Loop não excedeu rodadas razoáveis sem convergir (sinal de problema no conceito)

## Veto conditions

- Nenhuma peça aprovada
- Peça aprovada cujo hook não prende em 3s (rejeição automática)
- Loop em 5+ rodadas sem convergência (devolver pro estrategista)

## Próximo passo após aprovação

Fase 6 (Escala) com `@operador-higgsfield` — escalar a peça-base nas variações que o usuário escolher.
