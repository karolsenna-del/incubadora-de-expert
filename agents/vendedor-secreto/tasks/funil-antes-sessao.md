# Task: funil-antes-sessao

## Objetivo
Levar o lead da qualificação até a sessão agendada: qualificar, abordar, fazer o follow-up de abordagem, mandar e cobrar o pré-diagnóstico, ler os sinais (sessão ou venda direta) e agendar, lembrar e remarcar.

## Trigger
- Comando `*funil`
- Linguagem natural: "como abordo esse lead", "escreve a abordagem", "ela não respondeu", "ela aceitou", "não mandou o pré-diagnóstico", "chegaram as respostas", "agendo?", "faltou", "quer remarcar", "lembrete"

## Pré-condições
- KB carregada, especialmente seções 3.0 a 3.7

## Protocolo

### Passo 1: Situar o Lead no Funil
Identificar (ou inferir pelo contexto e dizer a suposição em uma linha) em que ponto o lead está: qualificar → abordar → follow-up de abordagem → pré-diagnóstico → agendamento → remarcação (KB seção 3.0).

### Passo 2: Qualificar Antes de Abordar
Se o lead ainda não foi abordado: Score de Fit pelos 4 critérios da persona do aluno + perfil (Conector/Analista/Diretivo) pela leitura em 4 camadas. Sem fit → não convidar pra sessão; indicar conteúdo, aula em grupo ou isca antes.

### Passo 3: Abordagem e Follow-up de Abordagem
Escrever a abordagem em 3 etapas (abertura genuína → conexão ao problema → convite), pela abertura do perfil (KB seção 3.4), com a dor da persona do aluno. Não respondeu: Toque 2 (24-48h, ângulo novo) → Toque 3 (encerramento gracioso) → Lead frio.

### Passo 4: Pré-Diagnóstico Antes de Agendar
Aceitou o convite → mensagem A (manda o pré-diagnóstico, não agenda). Sem resposta em 24-48h → mensagem B (cobra as respostas; o agendamento depende delas).

### Passo 5: Ler os Sinais
Com as respostas: listar os sinais de sessão e de venda direta (KB seção 3.6) com as palavras do lead, e recomendar. Sinais misturados → sessão. Venda direta → oferta por mensagem com os princípios da KB (preço dito e pausa, objeção acolhe → pergunta → responde).

### Passo 6: Agendar, Lembrar, Remarcar
Sessão → mensagem C (já avisando que dá pra remarcar uma vez; convidar terceiro decisor se houver). Véspera → D. Falta (1ª) → E. Pedido de remarcação (1ª) → F. Segunda falta ou pedido → G (sessão paga, valor do aluno).

## Formato de Output
Mensagem pronta pra copiar entre aspas + 1 linha de porquê + status pra anotar no Rastreador. Na leitura de sinais: sinais encontrados (com as palavras do lead) → recomendação → próxima mensagem (ver KB seção 13.5).

## Error Handling
| Cenário | Ação |
|---------|------|
| Aluno quer agendar sem as respostas do pré-diagnóstico | Immune system: as respostas são pré-requisito; mandar a mensagem B |
| Aluno quer remarcar de graça pela 2ª vez | Mensagem G: a sessão passa a ser paga |
| Aluno não tem o formulário de pré-diagnóstico | Indicar o modelo do curso (M3.3, 4 seções, 12 perguntas) pra adaptar; não inventar perguntas |
| Aluno não sabe o valor da sessão paga | Pedir que ele defina; citar a Karol (R$97) só como referência |

## Completion Criteria
- Ponto do funil identificado
- Mensagem pronta entregue (ou leitura de sinais com recomendação)
- Status do Rastreador indicado
- Próximo passo concreto com prazo
