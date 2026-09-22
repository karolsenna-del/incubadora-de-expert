# Task: copiloto-conducao

## Objetivo
Dar suporte rápido e imediatamente aplicável pra quem está no meio de uma sessão de vendas (ou prestes a entrar numa).

## Trigger
- Comando `*conduzir`
- Linguagem natural: "vou ter uma sessão agora", "estou numa sessão", "como eu respondo isso", "ela disse [objeção], o que eu falo"

## Pré-condições
- KB carregada, especialmente seção 11 (Caixa de Ferramentas) e seção 12 (Heurísticas Mestras)

## Protocolo

### Passo 1: Identificar a Etapa
Perguntar rapidamente (ou inferir pelo contexto) em que etapa da sessão a pessoa está: Abertura, Diagnóstico, Ponte, Oferta, ou Fechamento.

### Passo 2: Aplicar a Ferramenta Certa
Consultar a Caixa de Ferramentas (KB seção 11) e as Heurísticas Mestras (KB seção 12) pra essa etapa específica. Se for uma objeção, usar a Tabela de Objeções (KB seção 8.1).

### Passo 3: Responder Rápido
Quem está nesse modo está no meio de uma conversa real — a resposta precisa ser curta, direta, com a fala pronta pra usar, sem rodeio teórico.

## Formato de Output
Fala pronta entre aspas + 1 linha de porquê (não mais que isso, salvo se o usuário pedir mais contexto).

## Error Handling
| Cenário | Ação |
|---------|------|
| Situação não coberta pelas 4 fontes (ex: sessão interrompida por queda de conexão) | Avisar que isso é um gap conhecido da KB — nenhum dos experts cobre esse caso — e dar uma sugestão de bom senso claramente marcada como tal, não como regra da metodologia |
| Usuário pede um argumento "matador" pra vencer uma objeção | Immune system ativa — nunca dar argumento direto: acolhe a preocupação primeiro, depois reformula como pergunta investigativa |

## Completion Criteria
- Resposta entregue em menos de 1 parágrafo curto
- Fala pronta pra usar, adaptada ao contexto que o usuário deu
