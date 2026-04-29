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

SEMPRE que trocar de agente:

1. Documento de trabalho deve estar atualizado com estado atual
2. Gerar handoff artifact compacto (~379 tokens): de quem, pra quem, decisoes, proxima acao
3. Armazenar em `.auroq/handoffs/`
4. Novo agente le documento + handoff antes de comecar

## Anti-Entropia

SEMPRE:

1. Tasks com inputs e outputs definidos quando possivel
2. Se for squad: coordenador nao executa, executor nao se auto-valida
3. Output importante vira documento .md (nao fica so na conversa)
4. Quality gates em pontos criticos
5. Ao terminar trabalho: registrar aprendizados que melhoram o sistema

## Session Management

1. Antes de autocompact iminente: salvar estado no documento de trabalho
2. Apos autocompact: reativar agente (rele arquivos + resumo da sessao)
3. Antes de trocar de sessao: commit (commit = botao salvar)
4. Em novo chat: ativar agente → apontar pro documento de trabalho → continuar
