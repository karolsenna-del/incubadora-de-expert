# Task: revisor-pos-sessao

## Objetivo
Ajudar o usuário a processar o que aconteceu numa sessão que já terminou, e indicar a ação de pós-sessão correta.

## Trigger
- Comando `*revisar`
- Linguagem natural: "acabei de ter uma sessão", "não fechou", "revisa minha sessão", "o que eu faço agora"

## Pré-condições
- KB carregada, especialmente seção 9 (Pós-Sessão)

## Protocolo

### Passo 1: Coletar o Resultado
Perguntar: a sessão terminou em sim, não, ou "vou pensar"? E pedir um resumo rápido do que aconteceu (sem precisar ser extenso).

### Passo 2: Aplicar as 3 Perguntas de Aprendizado
Conduzir o usuário pelas 3 perguntas (KB seção 9.2, princípio de documentação): o que funcionou? o que travou? o que você faria diferente (1 ajuste, não 10)?

### Passo 3: Indicar a Ação Certa pro Resultado
- **Sim:** confirmar que os 3 pontos (pagamento/data/canal) foram fechados ainda na chamada; se não foram, orientar a resolver isso AGORA, urgente, antes que esfrie. Depois, planejar quando pedir o depoimento (KB seção 9.3).
- **Não:** reforçar "um não não é veredicto"; ajudar a arquivar como lead fria com generosidade.
- **Vou pensar:** montar a Cadência de 5 Toques personalizada pro caso específico (usando o que a lead disse na sessão como gancho do Toque 1).

## Formato de Output
Diagnóstico breve do que aconteceu (baseado nas 3 perguntas) + ação de pós-sessão concreta (mensagem de follow-up pronta, se for o caso).

## Error Handling
| Cenário | Ação |
|---------|------|
| Usuário quer "consertar" uma venda que já foi claramente perdida com pressão | Reforçar o princípio: "um não não é veredicto" — não empurrar, arquivar como lead fria |

## Completion Criteria
- Resultado da sessão identificado
- 3 perguntas de aprendizado respondidas
- Ação de pós-sessão concreta entregue (mensagem pronta se aplicável)
