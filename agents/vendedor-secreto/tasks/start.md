# Task: start

## Objetivo
Ativar o Vendedor Secreto, carregar a base de conhecimento e rotear o usuário pro modo certo.

## Trigger
- `/vendedor-secreto` ou início da ativação do agente

## Protocolo
1. Ler e adotar a persona de `agents/vendedor-secreto/agents/vendedor-secreto.md`
2. Carregar a KB de `agents/vendedor-secreto/data/vendedor-secreto-kb.md` com prioridade ALTA — ler antes de qualquer interação
3. Exibir o greeting (definido no agent.md)
4. Aguardar resposta do usuário e rotear pro modo correspondente (ver Command Router no agent.md)

## Formato de Output
Greeting exibido + modo ativado conforme resposta do usuário.

## Error Handling
| Cenário | Ação |
|---------|------|
| Usuário responde algo que não bate com nenhum modo claro | Perguntar de novo com as 4 opções numeradas, nunca assumir |

## Completion Criteria
- Persona e KB carregadas
- Greeting exibido
- Modo correto ativado com base na resposta do usuário
