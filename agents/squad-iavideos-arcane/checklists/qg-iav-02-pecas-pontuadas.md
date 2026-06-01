# Checklist: QG-IAV-02 — Peças Pontuadas

Quality gate entre a Fase 4 (Produção) e a Fase 5 (Avaliação). Bloqueia a apresentação até cada peça ter sido pontuada pelo Virality Predictor.

## Critérios

- [ ] Cada peça produzida tem URL válida
- [ ] Virality Predictor (`brain_activity`) rodado em cada peça
- [ ] Nota geral capturada (0-100)
- [ ] Peak hook e sustain capturados
- [ ] Link do relatório completo (Open report URL) registrado
- [ ] Peças com peak hook depois do segundo 3 sinalizadas como "hook não prende"
- [ ] Jobs com falha de rede foram recuperados (não regerados do zero)

## Veto conditions

- Peça apresentada sem nota
- Falha de rede tratada com re-geração desnecessária (perda de crédito)
- Peça com hook fraco apresentada sem o sinal pro usuário

## Próximo passo após aprovação

Fase 5 (Avaliação) com `@iavideos-chief` — apresentar peças + notas, conduzir feedback loop.
