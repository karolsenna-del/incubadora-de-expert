# Memoria Inteligente — Rule Global

> Todo agente no Auroq OS segue este protocolo de memoria. Nao e opcional.

## Regra principal: fim de tarefa, memoria salva

No fim de CADA tarefa concluida, o agente ativo (Companion, Ops, qualquer squad, skill ou a equipe que
o Companion abre, no Claude ou no Codex) salva sem esperar pedido, antes da resposta final. Com o app
Auroq OS aberto, a memoria tambem e consolidada sozinha a cada ~30 min e logo que um trabalho termina;
sem o app (so no terminal), esta regra e o que garante a memoria:
→ `agents/companion/data/contexto-dinamico.md`: onde paramos (o que ficou pronto, o que segue, o que espera o aluno)
→ `agents/companion/data/log-decisoes.md`: as decisoes tomadas na tarefa (formato abaixo)
→ tracker do projeto, se a tarefa e de um projeto do cockpit
→ Avisar em uma linha o que anotou ("Anotei: ..."). Se o aluno pedir para nao guardar algo, nao guarde.

Os gatilhos abaixo completam essa regra no meio do trabalho.

## 7 Gatilhos — Quando Salvar

### 1. Decisao Tomada
SE o aluno decidiu algo significativo (estrategia, preco, foco, prioridade, cancelamento):
→ Registrar em `agents/companion/data/log-decisoes.md` (no maximo no fim da tarefa) e avisar em uma linha
→ Formato:
```
## [DATA] — [TITULO]
**Contexto:** [situacao]
**Decisao:** [o que decidiu]
**Racional:** [por que]
**Impacto:** [o que muda]
```

### 2. Projeto Progrediu
SE completou tarefa de projeto ou avancou fase:
→ Atualizar tracker do projeto (conforme project-tracker protocol)
→ Adicionar entrada no LOG do tracker

### 3. Conhecimento Criado
SE produziu documento, framework, analise, ou processo novo que tem valor permanente:
→ Perguntar: "Guardo no seu conhecimento? Onde faz mais sentido?"
→ Salvar em `docs/knowledge/` (subpasta adequada) ou `business/processos/`

### 4. Padrao Detectado
SE o Companion percebe comportamento recorrente (so Companion faz isso):
→ Registrar silenciosamente em `agents/companion/data/padroes-observados.md`

### 5. Sessao Encerrando
SE o aluno indica que vai fechar ou pede commit final:
→ Ops verifica no ritual de commit: contexto e trackers atualizados?
→ Atualizar `agents/companion/data/contexto-dinamico.md` com onde paramos

### 6. Tarefa Concluida
SE terminou uma tarefa (entregou o que foi pedido, mesmo que pequena):
→ Aplicar a regra principal acima: contexto-dinamico + log de decisoes + tracker, e avisar em uma linha

### 7. Correcao Recebida
SE o aluno corrigiu um jeito seu de trabalhar ("nao faz assim", "ja falei", "errou de novo"):
→ Conferir se a regra ja existe em `.claude/rules/custom-do-aluno.md`; se existe, nao repetir
→ Se nao existe: escrever em "Suas regras" uma linha imperativa com o porque, sem contar o caso
→ Avisar em uma linha: "Anotei nas suas regras: ..."

> Salvar estado antes de compactacao de contexto e responsabilidade do
> `dna-operacional.md` (Session Management) — nao repetir aqui.

## Memória automática do app (Auroq OS)

Com o app Auroq OS aberto, depois das conversas na pasta do negócio, o app lê o que mudou e, usando a
própria IA do aluno, atualiza sozinho o "Onde Parou" do `contexto-dinamico.md`, acrescenta decisões em
`log-decisoes.md`, pendências em `demandas-backlog.md`, regras em `custom-do-aluno.md` e escreve:
→ `agents/companion/data/diario/AAAA-MM.md`: um resumo por conversa (só acrescenta)
→ `agents/companion/data/nucleo.md`: o bilhete curto (até 3.000 caracteres) que entra no começo de toda
  conversa
Isso não tira a regra principal: a IA da conversa continua salvando no fim de cada tarefa (o app é a rede
de segurança). Não edite `nucleo.md` nem o `diario/` à mão: o app refaz a partir dos outros arquivos.

### Buscar na memória (app Auroq OS)

O app mantém uma busca de toda a memória do negócio (estes arquivos, o diário, o arquivo da faxina,
`docs/knowledge/`, `business/processos/`, as conversas antigas desta pasta e o que o Claude e o Codex
anotaram sozinhos). No Claude Code, a cada pedido do aluno, até 3 trechos que têm a ver chegam sozinhos
("[Memoria do sistema] Trechos da memoria…"), em toda conversa da pasta, de qualquer agente; use só o
que ajudar.

SE a resposta depende do passado do negócio (preço, decisão, cliente, fornecedor, campanha, "o que a
gente combinou", "lembra de…") e nem o bilhete nem os trechos que chegaram respondem:
→ Rode `auroq memoria busca "<palavras do assunto>"` (Windows igual) e responda com o que achar
→ Trecho do "arquivo da memória" saiu da memória ativa (velho, repetido ou trocado): confira antes de usar
→ O comando não existe ou falhou (app fechado): procure nos arquivos de `agents/companion/data/` e siga
→ Pedido novo, que não depende do passado, não precisa de busca

### Arrumação diária (app Auroq OS)

Uma vez por dia, com o app aberto e sem conversa no meio, a memória se arruma sozinha usando a IA do
aluno: faz uma prova de lembrança (`agents/companion/data/dreaming/prova.json`, nota em
`dreaming/historico.md`), tira da memória ativa o que é repetido, trocado, vencido ou pendência feita há
mais de 30 dias (no máximo 10% por dia; vai para `agents/companion/data/arquivo/AAAA-MM-DD.md` com o
motivo, nunca é apagado, e volta tudo se a prova piorar) e transforma as correções do dia em regras
curtas em `custom-do-aluno.md`. Não edite `dreaming/` à mão. Para trazer algo de volta do arquivo,
copie o trecho para o lugar dele.

## Onde Cada Coisa Vai

| Tipo de informacao | Destino |
|-------------------|---------|
| Decisao estrategica | `agents/companion/data/log-decisoes.md` |
| Progresso de projeto | `business/campanhas/{projeto}/tracker.md` |
| Onde estamos agora | `agents/companion/data/contexto-dinamico.md` |
| Ideia ou pendencia | `agents/companion/data/demandas-backlog.md` |
| Padrao recorrente | `agents/companion/data/padroes-observados.md` |
| Conhecimento permanente | `docs/knowledge/{subpasta}/` |
| Processo documentado | `business/processos/` |
| Estado de trabalho (pre-autocompact) | Documento de trabalho do projeto |
| Correcao do aluno (vira regra) | `.claude/rules/custom-do-aluno.md` |
| Resumo de cada conversa (feito pelo app) | `agents/companion/data/diario/AAAA-MM.md` |
| Bilhete curto do começo da conversa (feito pelo app) | `agents/companion/data/nucleo.md` |
| O que a faxina diária tirou da memória ativa (feito pelo app) | `agents/companion/data/arquivo/AAAA-MM-DD.md` |
| Prova e histórico da arrumação diária (feito pelo app) | `agents/companion/data/dreaming/` |

## Regra de Ouro

**Tarefa concluida = memoria salva.** Fora isso, **na duvida, salva.** E mais barato salvar informacao que nao vai usar do que perder informacao que precisava.

## O que NAO salvar

- Conversa trivial sem decisao ou aprendizado
- Informacao que ja existe em outro lugar (nao duplicar)
- Dados temporarios que perdem valor em 24h
- Output intermediario que vai ser refinado (salvar so o final)
