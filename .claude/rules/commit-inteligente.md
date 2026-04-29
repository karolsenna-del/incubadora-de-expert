# Commit Inteligente — Ritual de Incrementacao

> No Auroq OS, commit nao e sobre deployar codigo. E sobre **salvar o checkpoint do negocio**.
> Cada commit e um ponto de evolucao incremental do sistema.

## Quando Commitar

- Final de sessao de trabalho significativa
- Antes de trocar de assunto/projeto
- Antes de fechar o computador
- Quando completou uma etapa de projeto
- Quando tomou decisoes importantes

## Ritual do Commit (Ops executa)

### 1. Revisar o que mudou
```
git status + git diff
```
Entender: o que progrediu desde o ultimo commit?

### 2. Verificar projetos ativos
- SE trabalhou num projeto do cockpit → tracker esta atualizado?
- SE tracker nao foi atualizado → atualizar ANTES do commit (log, status, blockers)

### 3. Verificar contexto
- SE houve decisoes importantes → estao no `agents/companion/data/log-decisoes.md`?
- SE o estado do negocio mudou → `agents/companion/data/contexto-dinamico.md` reflete?
- SE algo foi aprendido → esta documentado em algum lugar?

### 4. Commitar com mensagem significativa
A mensagem conta O QUE ACONTECEU no negocio, nao o que mudou nos arquivos:

**Formato:**
```
{tipo}: {o que aconteceu}

{detalhes se necessario}
```

**Tipos:**
- `progresso:` — avancou em projeto/tarefa
- `decisao:` — tomou decisao estrategica
- `processo:` — documentou/criou/melhorou processo
- `agente:` — criou/melhorou agente/squad/worker
- `conhecimento:` — adicionou/tratou conhecimento na biblioteca
- `campanha:` — acao de campanha (criativo, disparo, ajuste)
- `fix:` — corrigiu problema
- `setup:` — configuracao/infra

**Exemplos:**
```
progresso: NDF Workshop fase 1 concluida — LP, flows e criativos prontos
decisao: definiu preco do ingresso em R$47 (teste contra R$97 no proximo ciclo)
processo: documentou SOP de shift entre ciclos de lancamento
agente: criou worker TechOps com vault e SOPs operacionais
conhecimento: ETL completo de criativos de anuncio (9 vols, 6450 linhas)
campanha: lancou lote 2 de criativos — 9 pecas, 3 hooks novos
```

### 5. Push
- Backup na nuvem (GitHub)
- Historico incremental do negocio
- Qualquer maquina, qualquer momento: `git clone` e o negocio ta la

## O que o Commit NAO e

- NAO e sobre codigo limpo ou testes passando
- NAO precisa de conventional commits estilo dev (feat/fix/chore)
- NAO e obrigatorio ter tudo perfeito — e checkpoint, nao release
- NAO e so pra deploy — e pra PERSISTIR evolucao

## Commit como Seguro

> "Commit e o botao salvar do sistema."

Se o computador quebrar, se o autocompact apagar tudo, se trocar de maquina — o ultimo commit e o ponto de restauracao. Quanto mais frequente, menos se perde.

## Protocolo do Ops

Quando o expert pede `*commit` ou `*push`, o Ops executa o ritual completo:
1. Revisa mudancas
2. Pergunta se trackers e contexto estao atualizados
3. Sugere mensagem de commit baseada no que aconteceu
4. Expert aprova
5. Commit + push
