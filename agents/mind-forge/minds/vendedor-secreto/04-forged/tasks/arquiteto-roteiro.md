# Task: arquiteto-roteiro

## Objetivo
Construir o roteiro personalizado da sessão de vendas do usuário, adaptando o Roteiro da Sessão de Vendas Secretas (KB seção 4.1) ao método/persona/oferta específicos dele.

## Trigger
- Comando `*roteiro`
- Linguagem natural: "criar meu roteiro", "montar minha sessão de vendas", "personalizar meu roteiro", "preciso de um roteiro de vendas"

## Pré-condições
- KB carregada (`vendedor-secreto-kb.md`)

## Protocolo

### Passo 1: Coletar Inputs
Perguntar (se o usuário não tiver trazido já):
1. Persona — pra quem é a sessão (quem é o lead-tipo)?
2. Promessa — qual é a transformação prometida?
3. Método — quais são as fases/passos do método do usuário?
4. Oferta — o que está sendo vendido (formato, duração, o que inclui)?

Se o usuário não tiver isso documentado, pode trazer de forma solta — o roteiro se adapta ao que tiver, mesmo incompleto.

### Passo 2: Gerar as 5 Etapas
Seguindo a estrutura fixa (KB seção 4.1), adaptando cada etapa ao método específico do usuário:
1. Abertura + Seeding
2. Diagnóstico Estruturado — gerar perguntas de potencial/dificuldade ESPECÍFICAS do método do usuário (não genéricas)
3. Ponte de Identificação — perguntar ao usuário se prefere estilo História Pessoal ou Bloco de Sonhos
4. Oferta com Narrativa ECROI — adaptar Colapso/Reenquadramento/Ordem/Inevitabilidade ao método e à oferta do usuário
5. Fechamento — objeções + negociação de pagamento

### Passo 3: Entregar o Roteiro Completo
Formato: ver KB seção 13.1 (Output Example) como referência de estrutura e nível de detalhe.

## Formato de Output
Roteiro estruturado por etapa, com falas-modelo entre aspas prontas pra adaptar (não genéricas — usando os termos do método/persona/oferta que o usuário trouxe).

## Error Handling
| Cenário | Ação |
|---------|------|
| Usuário não tem P1/P2/P3/P4 definidos ainda | Gerar o roteiro com placeholders claros e sugerir que ele defina isso primeiro (pode indicar que isso é trabalho do Agente da Persona / Promessa / Processo Autoral / Proposta Validada do Expert360º, se for o caso) |
| Usuário pede um roteiro fora da estrutura de 5 etapas | Explicar que a mente funde os 3 frameworks nessa estrutura por padrão, mas pode mostrar os 3 frameworks originais separados se o usuário preferir usar só 1 |

## Completion Criteria
- Roteiro completo nas 5 etapas, adaptado aos inputs do usuário
- Usuário escolheu o estilo da Ponte de Identificação
- Próximo passo indicado (ex: "agora é só ensaiar e ir a campo")
