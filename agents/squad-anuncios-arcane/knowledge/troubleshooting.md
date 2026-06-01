# Troubleshooting — Squad Anúncios Arcane

Erros comuns do pipeline e como corrigir. Consultado pela Nina (setup) e pelo Argus (pipeline).

---

## Setup / MCP

### MCP `airtable` ou `apify` não aparece conectado
**Causa:** o Claude Code não foi reiniciado após o `claude mcp add`.
**Correção:** fechar e reabrir o Claude Code. MCPs só carregam no boot.

### Medo de o token vazar no Git
**Causa:** MCP configurado com escopo `project` (grava no `.mcp.json`, que costuma ser versionado).
**Correção:** sempre usar `-s local` no `claude mcp add`. Grava em config local da máquina, fora do Git. Se já configurou com `project`, remover e re-adicionar com `local`.

---

## Airtable

### Erro de permissão ao criar a tabela
**Causa:** token PAT sem o scope `schema.bases:write`.
**Correção:** em `airtable.com/create/tokens`, conferir os 4 scopes (`data.records:read`, `data.records:write`, `schema.bases:read`, `schema.bases:write`). Gerar token novo com os 4 e reconfigurar o MCP.

### Skill não acha a base
**Causa:** base ID errado, ou token sem acesso àquela base.
**Correção:** confirmar que o ID começa com `app` (não `wsp` — esse é workspace). Confirmar que na seção Access do token a base está incluída.

### "Unknown field name" ao escrever
**Causa:** algum campo da tabela foi renomeado manualmente na interface do Airtable.
**Correção:** não renomear os campos que as skills criam. Se renomeou, voltar ao nome original ou deixar a skill recriar a tabela.

---

## Meta Ad Library / Apify

### Links do Ad Library retornam "No results"
**Causa:** está usando o Profile ID em vez do Ad Library ID. O Facebook tem dois IDs por página — só o Ad Library ID funciona nos links.
**Correção:** re-rodar a Fase 1 (`competitor-research`) — ela usa o Apify pra pegar o ID correto automaticamente.

### Algum concorrente aparece com 0 anúncios
**Causa:** ou ele não está rodando anúncios agora, ou o Page ID está errado.
**Correção:** abrir o link do Ad Library daquele concorrente no navegador pra verificar. Se o link não funciona, re-rodar a Fase 1 pra esse concorrente.

### Scrape muito lento
**Esperado.** Cada concorrente leva 30-90 segundos por limite de taxa do Apify. 15 concorrentes = 10-20 min. Não é erro.

---

## Whisper / Transcrição

### Vídeos não estão sendo transcritos
**Causa:** falta `whisper.cpp` ou `ffmpeg`, ou o caminho do Whisper não está no CLAUDE.md.
**Correção:** é opcional — o pipeline funciona sem (só não preenche os hooks de vídeo). Se quiser transcrição: instalar `whisper-cpp` + `ffmpeg`, baixar um modelo, e colocar os caminhos na seção `Tools` do `Ad Research Config`.

### Hooks faltando no brief
**Causa:** a Fase 2 rodou sem Whisper configurado.
**Correção:** configurar o Whisper e re-rodar `scrape-ads` pra preencher os hooks de vídeo.

---

## Pipeline / Config

### Fase 3 (brief) reclama de config ausente
**Causa:** seção `Ad Research Config` faltando, ou table IDs ainda como placeholder no CLAUDE.md.
**Correção:** o Argus deveria ter preenchido isso via `atualizar-config` após cada fase. Conferir se Competitors Table e Ad Research Table têm IDs reais (`tbl...`) e se os Niche Tiers têm os nomes dos concorrentes.

### Brief sai fino / sem seções
**Causa:** poucos dados — poucos concorrentes ou poucos anúncios scrapeados.
**Correção:** quanto mais concorrentes na Fase 1 e mais anúncios na Fase 2, mais rico o brief. Re-rodar a Fase 1 com mais concorrentes.
