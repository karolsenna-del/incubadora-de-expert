# Salvar, Entregar e Puxar — Qualquer Agente Executa o Ritual do Ops

> O expert NUNCA precisa trocar de agente pra salvar, entregar ou puxar trabalho.
> Quem estiver ativo (Companion, Organizer, squad, worker ou Claude sem agente) executa o ritual do Ops por baixo.
> O Ops continua sendo o DONO do ritual; os outros agentes o executam.

## Intents (linguagem natural → acao)

| O expert diz (exemplos) | Acao |
|-------------------------|------|
| "salva", "guarda isso", "faz checkpoint", "commita" | SALVAR (commit) |
| "entrega", "manda pro GitHub", "sobe", "faz push" | ENTREGAR (push com pre-push) |
| "salva e entrega", "fecha o dia", "acabei por hoje" | SALVAR + ENTREGAR |
| "puxa", "atualiza do GitHub", "traz o que mudou", "sync" | PUXAR (sync) |

## O que o commit e aqui

Commit nao e deploy de codigo: e o **botao salvar do negocio**. Cada commit e um ponto
de restauracao — se a maquina quebrar, se o contexto for compactado, se trocar de
computador, o ultimo commit e de onde se retoma. Por isso a mensagem conta o que
aconteceu no negocio, nao o que mudou nos arquivos:

`progresso:` avancou · `decisao:` decidiu · `processo:` documentou · `agente:` criou ou
melhorou agente · `conhecimento:` tratou a biblioteca · `campanha:` acao de campanha ·
`fix:` corrigiu · `setup:` configuracao.

Exemplo: `progresso: NDF Workshop fase 1 concluida — LP, flows e criativos prontos`

Momentos naturais de salvar: fim de sessao, troca de assunto, etapa de projeto
concluida, decisao importante tomada, antes de fechar o computador.

## O ritual — fonte da verdade: `.claude/commands/AuroqOS/agents/ops.md`

Leia as secoes `*commit`, `*pre-push` e `*sync` do ops.md e execute os passos como estao. O minimo inegociavel:

- **SALVAR:** revisar o que mudou → conferir tracker/contexto → mensagem em linguagem de negocio → **mostrar a lista do que vai entrar e ter o OK do expert** (regra 7) → `git add` SO desses arquivos, um a um (NUNCA `git add -A`/`git add .`, NUNCA `business/vault/`, `.env`, chaves) → commit → confirmar ao expert em 1 linha.
- **ENTREGAR:** pre-push OBRIGATORIO (vault/.env fora do staging, `.gitignore` protege, nenhum arquivo gigante, branch certa) → `git push` → confirmar.
- **PUXAR:** se ha trabalho local, SALVAR primeiro (commit antes de pull, sempre) → `git fetch` → `git pull` (merge — nunca rebase com o expert) → relatar em portugues o que chegou (autor + o que fez) → conflito: conduzir com o expert, mostrando as duas versoes; em `agents/companion/data/` a resposta quase sempre e juntar as duas.

## Regras

1. Nao pedir troca de agente. Nao dizer "chama o Ops". Faca.
2. **Nunca entregar (push) sem o expert pedir.** O sistema so PUXA sozinho (hook de abertura) — entregar e decisao dele.
3. As travas do pre-push valem pra TODO agente — sao o que impede senha de subir pro GitHub.
4. Continua EXCLUSIVO do Ops: `git push --force`, Pull Request (`gh pr`), MCP/infra, bootstrap, `*update`.
5. O hook de abertura (`.claude/hooks/auroq-sync.cjs`) ja puxou o que era seguro e pode ter deixado um aviso no contexto (atualizacoes esperando, trabalho pendente). Repasse ao expert em 1-2 linhas, sem drama, e siga.
6. O lembrete de trabalho nao entregue chega no contexto no maximo a cada 30 min: ofereca "salva e entrega" em UMA linha ao fechar o bloco — nunca interrompa o raciocinio em andamento.
7. **A pasta e compartilhada; a conversa nao.** Outras janelas, agentes e squads escrevem
   na mesma pasta, entao `git status` mostra trabalho que NAO e desta conversa — e um `git
   add -A` publica isso pela metade, dentro de um commit com nome de outro assunto. Antes
   de salvar, SEMPRE:
   - rodar `git status --short` e separar o que ESTA conversa tocou do resto;
   - mostrar ao expert a lista agrupada por assunto, em linguagem comum (nome do arquivo
     nao basta: diga o que e). Ex: *"Vai entrar: a pagina de vendas que a gente fez agora.
     Encontrei tambem 12 arquivos de financas, que nao sao deste assunto — parecem de outra
     conversa sua."*;
   - perguntar em UMA linha: *"salvo so o nosso, ou tudo junto?"* — e obedecer a resposta;
   - na duvida, ou se ele nao responder, salvar SO o que esta conversa tocou. Deixar o resto
     parado nunca perde nada: fica no lugar, esperando a conversa dona dele.
