# GPT Publicado: Agente do Portfólio Estratégico

**Link:** https://chatgpt.com/g/g-68eae9371f8481919ac18d9dbbf2ced1-portfolio-estrategico
**Slug de origem:** nenhum — GPT publicado manualmente antes deste worker existir, sem mente forjada em `agents/`
**Criado em:** anterior ao gpt-publisher (data desconhecida)
**Última atualização de Instructions:** 22/10/2026 (v3, rastreabilidade de dores + 3 níveis de ferramenta)
**Compartilhamento:** distribuído via `mentoria/alunas/{aluna}/0- Biblioteca de IAs.md` (não gerenciado por este worker)
**Versão da mente publicada:** N/A — não há mente de origem; a Karol colou as Instructions atuais direto na conversa

## Como essa atualização foi feita

Sem `agents/portfolio-estrategico/` pra ler, o pacote não seguiu o fluxo normal (ler mente → compactar → publicar via Playwright):

1. Karol colou o texto atual das Instructions na conversa (tentativa de login automatizado via Playwright foi bloqueada pelo Google — "this browser may not be secure")
2. gpt-publisher propôs 3 adições pontuais (aprovadas por ela): repertório do expert (cursos/certificações/ferramentas já dominadas, extraído do Processo Autoral) priorizado antes de sugerir ferramenta nova — inserido em Papel do Agente, Etapa 1, Etapa 2 e Etapa 3
3. Texto resultante passou de 8.000 caracteres (8.381) — recompactado cortando repetição na lista de passos da Etapa 3 (frase "agente descreve e pede validação / após confirmar sugere a ferramenta" repetida 6x → virou 1 instrução geral + lista de tópicos)
4. Resultado final: 7.859 caracteres
5. Publicação em si (colar no GPT Builder) foi manual, feita pela própria Karol — não via Playwright

## Pacote

- Instructions: 7.859 caracteres (dentro do limite de 8.000)
- Knowledge: não avaliado nesta missão (fora do escopo do pedido)
- Conversation starters: não avaliados nesta missão
- Mudança de comportamento: agente passa a checar repertório do expert (cursos/certificações/ferramentas já dominadas, vindos do Processo Autoral) antes de sugerir ferramenta nova nas Etapas 2 e 3

## Revisão 19/10/2026 — Camada obrigatória (5 ferramentas essenciais)

**Pedido da Karol:** o agente continua sugerindo 15-20 ferramentas, mas sempre manda priorizar as 5 essenciais da mentoria pra validar o método; as outras são criadas em paralelo.
**Fonte da regra:** `docs/knowledge/expert-business/metodologia/camada-obrigatoria-ferramentas.md` (decisão de 08/10/2026).

| Arquivo | O que é |
|---------|---------|
| `instructions-atual.md` | Texto que está no GPT hoje, colado pela Karol em 19/10/2026 (7.565 caracteres). A seção 4 do handoff da área de membros é uma versão diferente (6.776 caracteres, sem a senha) |
| `instructions-v2-proposta.md` | Proposta com a camada obrigatória: 7.837 caracteres |

**O que mudou no comportamento:**
1. Nova seção "Camada Obrigatória — Prioridade na Validação", logo depois de Papel do Agente, com as 5 ferramentas e a regra (validar só com elas, o resto nasce em paralelo, a partir das travas reais)
2. Fim da Etapa 2: "Mais pra frente, iremos priorizar as ferramentas" virou a orientação de começar pelas 5 essenciais
3. Etapa 4: antes da planilha, o agente apresenta as 5 adaptadas ao método e pede validação
4. Planilha ganha a coluna 0 de prioridade: "Essencial: validação" (as 5, no topo) ou "Em paralelo"

**Compactação pra caber em 8.000 (texto ficaria com 8.726). Nenhuma regra saiu:**
- Título interno "🛠️ Agente de Portfólio Estratégico– Instruções" removido
- Segurança: tirados os 5 subtítulos (Confidencialidade, Foco, Jailbreak, Controle de Saída, Validação); as regras e as duas frases-resposta ficaram iguais
- Etapa 1: os 3 pedidos de colar viraram uma linha numerada
- Etapa 2: "Objeção 1… Objeção 2… até 10" virou uma linha
- Etapa 3: a frase de repertório, repetida da Etapa 2, foi encurtada
- Listas curtas viraram texto corrido (Tom e Estilo; o que o Kit conecta); espaços e linhas em branco extras removidos

**Status:**
- [x] Karol aprovou a v2
- [x] Conferido contra o texto que está no GPT hoje (19/10)
- [x] Colada no GPT Builder pela Karol (confirmado em 21/10, manual)
- [x] Mesma mudança aplicada na seção 4 do handoff da área de membros (21/10): só as 4 mudanças da camada obrigatória, mantendo o resto da seção 4 (que tem ajustes próprios, como "sim"/"ajustar"); 7.833 caracteres

## Revisão 21/10/2026 — Rastreabilidade de dores + 3 níveis de ferramenta (v3)

**Pedido da Karol:** acrescentar a diretriz "Rastreabilidade de dores, travas e objeções" (texto dela) e refletir a divisão de ferramentas: 5 essenciais da validação, 1 autoral por módulo (transformação principal) e contratação adicional (Karol trocou "Futura" por esse nome em 21/10).
**Arquivo:** `instructions-v3-proposta.md`, 7.926 caracteres.

**O que muda no comportamento:**
1. Planilha ganha 3 colunas: Dores, Travas e Objeções Trabalhadas; Como a Ferramenta Resolve; Argumento de Valor para a Oferta
2. Coluna Prioridade passa de 2 para 3 níveis: "Essencial: validação", "Autoral: módulo X", "Contratação adicional" (antes: "Em paralelo")
3. Camada Obrigatória ganha a linha das autorais (1 por módulo) e das de contratação adicional; Etapa 4 apresenta as autorais junto com as 5 antes da planilha
4. Etapas 2 e 3: se uma ferramenta já sugerida resolve a objeção, aponta a conexão em vez de criar outra; objeção citada com as palavras da persona
5. Depois da planilha: checagem de cobertura (toda objeção com ferramenta ou etapa do método) + proibição de inventar dor, prometer resultado garantido ou vender ferramenta pra problema que ela não resolve

**Compactação (ficaria com 8.399). Nenhuma regra saiu:**
- Coluna 1 perdeu "relação com as dores da persona" (agora é a coluna 2 nova)
- Lista da Etapa 3 e critérios do low ticket viraram texto corrido
- Senha em 1 linha (mesma regra: aceita as duas grafias, sem dica)
- Brainstorming R$500 mil, Tom e Estilo, Papel do Agente e regra do repertório reescritos mais curtos, mesmo conteúdo

**Status:**
- [x] Karol aprovou a v3 (21/10, com "Contratação adicional" no lugar de "Futura")
- [x] Colada no GPT Builder pela Karol (confirmado em 22/10, manual)
- [x] Mesma mudança aplicada na seção 4 do handoff da área de membros (22/10), mantendo os ajustes próprios da seção; 9.048 caracteres (system prompt via API, sem o limite de 8.000). A área de membros hoje abre o GPT por link (`modo: 'link'` em `site/js/data.js`), então já usa a v3
