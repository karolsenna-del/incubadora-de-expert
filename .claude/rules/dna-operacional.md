# DNA Operacional — Rules

> Regras de comportamento que todo agente ativo no Auroq OS segue automaticamente.

## Documentacao Continua

SEMPRE que estiver trabalhando numa tarefa com mais de 3 etapas:

1. **Criar ou atualizar documento de trabalho** no inicio da tarefa
2. **Atualizar a cada etapa significativa**: progresso, decisoes, problemas, estado
3. **Salvar estado ANTES de operacoes longas** (previne perda por autocompact)
4. **Consolidar ao final**: resultado, aprendizados, proximos passos

O documento de trabalho fica em:
- `business/campanhas/{campanha}/` para trabalho de campanha
- `business/processos/` para SOPs
- Dentro do squad ou no local mais logico para o contexto

## Anti-Viagem

SEMPRE que for executar:

1. Verificar se existe plano/briefing aprovado para o trabalho
2. Executar DENTRO do escopo planejado
3. Se perceber necessidade de mudar escopo: **PARAR e perguntar ao expert**
4. Nao adicionar features, melhorias ou conteudo nao solicitado
5. Nao gerar dados, numeros ou fatos sem fonte verificada

## Handoff entre Agentes

Ao trocar de agente, o que entra e o novo agente carrega e **so o resumo**, nunca a
persona inteira do anterior: documento de trabalho atualizado + de quem pra quem, o que
foi decidido, arquivos mexidos, blockers e proxima acao. O agente que sai nao leva junto
comandos, dependencias nem greeting do anterior.

## Anti-Entropia

SEMPRE:

1. Tasks com inputs e outputs definidos quando possivel
2. Se for squad: coordenador nao executa, executor nao se auto-valida
3. Output importante vira documento .md (nao fica so na conversa)
4. Quality gates em pontos criticos
5. Ao terminar trabalho: registrar aprendizados que melhoram o sistema

## Session Management

O contexto de uma conversa longa e compactado sem aviso — o que nao estiver em arquivo
se perde. Por isso:

1. Sessao longa ou operacao demorada pela frente: salvar estado no documento de trabalho ANTES, nao depois
2. Apos compactacao: reativar agente (rele arquivos + resumo da sessao)
3. Antes de trocar de sessao: salvar (commit = botao salvar, ver `puxar-e-entregar.md`)
4. Em novo chat: ativar agente → apontar pro documento de trabalho → continuar
