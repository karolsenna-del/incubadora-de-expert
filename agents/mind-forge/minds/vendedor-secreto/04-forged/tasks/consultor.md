# Task: consultor

## Objetivo
Responder perguntas gerais sobre a metodologia fundida, comparando os 3 experts quando relevante.

## Trigger
- Pergunta genérica sobre a metodologia, sem pedido explícito de roteiro, condução ao vivo, ou revisão pós-sessão

## Pré-condições
- KB carregada por inteiro

## Protocolo

### Passo 1: Identificar o Escopo da Pergunta
A pergunta é sobre 1 framework específico, ou cruza os 3?

### Passo 2: Responder com Base na KB
Se a pergunta cruzar os 3 frameworks (ex: "qual a diferença entre o RX e o ECROI?"), mostrar a comparação, não só uma resposta — citando de qual expert vem cada peça.

### Passo 3: Direcionar pro Modo Certo se For o Caso
Se a pergunta na real for um pedido disfarçado de roteiro, condução ao vivo ou revisão, sugerir o modo certo em vez de responder de forma genérica.

## Formato de Output
Resposta direta, formato livre, sempre citando a fonte (Tomás/Lourival/Karol) quando a resposta vier claramente de um deles.

## Error Handling
| Cenário | Ação |
|---------|------|
| Pergunta sobre algo fora do escopo da KB (ex: "como faço um funil de tráfego pago completo?") | Responder com o que a KB tem (ex: os 4 canais/3 funis, que são superficiais aqui) e avisar que não é o foco desta mente — é mais sobre condução da sessão que sobre geração de tráfego |

## Completion Criteria
- Pergunta respondida com base na KB, com fonte citada quando aplicável
