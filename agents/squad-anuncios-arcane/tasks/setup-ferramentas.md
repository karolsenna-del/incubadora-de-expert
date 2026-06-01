---
task: "Setup Ferramentas"
responsavel: "@nina-setup"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Handoff do Argus — expert no estagio ZERADO"
Saida: "MCPs airtable + apify conectados, base ID no CLAUDE.md, secao Ad Research Config montada, expert pronto pro pipeline"
Checklist:
  - "Conta Airtable criada + PAT com 4 scopes + base criada + base ID copiado"
  - "Conta Apify criada + token copiado"
  - "MCP airtable e apify adicionados via claude mcp add -s local"
  - "3 skills do pipeline instaladas em .claude/skills/ via install-skills.mjs"
  - "Whisper verificado/configurado (ou pulado conscientemente)"
  - "Secao Ad Research Config montada no CLAUDE.md"
  - "Expert avisado pra reiniciar o Claude Code"
  - "MCPs verificados conectados apos reinicio"
execution_type: "interactive"
---

# Task: Setup Ferramentas — Onboarding Técnico

**Task ID:** squad-anuncios-arcane/setup-ferramentas
**Version:** 1.0.0
**Responsável:** @nina-setup
**Execution Type:** Interactive

> Conduzir UM PASSO POR VEZ. Confirmar cada passo antes de seguir.
> Nunca despejar a configuração inteira de uma vez.

---

## Bloco 1 — Airtable

O Airtable é onde os dados ficam guardados — uma planilha turbinada.

**Passo 1.1 — Conta**
Pedir o expert criar conta em `airtable.com` (free tier serve). Confirmar.

**Passo 1.2 — Personal Access Token (PAT)**
Pedir pra ir em `airtable.com/create/tokens` e criar um token novo com **os 4 scopes** (todos obrigatórios):
- `data.records:read`
- `data.records:write`
- `schema.bases:read`
- `schema.bases:write`  ← o mais esquecido — sem ele não dá pra criar tabela

Na seção **Access** do token, dar acesso à base que vai ser criada no próximo passo (ou a todo o workspace).

**Passo 1.3 — Criar a base**
Pedir pra criar uma **base vazia** no Airtable (pode chamar "Ad Research"). O pipeline cria as tabelas sozinho — só precisa da base existir.

**Passo 1.4 — Pegar o base ID**
Abrir a base e olhar a URL: `airtable.com/appXXXXXXXXXXXXX/...`. O `appXXXXXXXXXXXXX` é o base ID. Pedir pro expert colar.

> ⚠️ Não confundir: `wsp...` é workspace, `app...` é a base. O pipeline precisa do `app...`.

---

## Bloco 2 — Apify

O Apify é o que permite acessar páginas públicas do Facebook (Ad Library). Não usa a conta de Facebook do expert — só dados públicos.

**Passo 2.1 — Conta**
Pedir pra criar conta em `apify.com` (free tier é suficiente — dá crédito mensal que cobre o uso).

**Passo 2.2 — Token**
Settings → Integrations → API tokens → copiar o token (começa com `apify_api_...`). Pedir pro expert colar.

---

## Bloco 3 — Configurar os MCPs

Os MCPs são os "plugues" que conectam o Claude Code ao Airtable e ao Apify.

> 🔒 SEMPRE usar escopo `local` — o token fica numa config local da máquina, **não vai pro Git**, não vaza no repositório.

Rodar (ou pedir pro expert rodar com `!` na frente, trocando pelos tokens dele):

```
claude mcp add airtable -s local -e AIRTABLE_API_KEY=<token_airtable> -- npx -y airtable-mcp-server
claude mcp add apify -s local -e APIFY_TOKEN=<token_apify> -- npx -y @apify/actors-mcp-server
```

Confirmar que ambos foram adicionados.

---

## Bloco 4 — Whisper (opcional)

O Whisper transcreve os vídeos dos anúncios — é o que dá os "hooks" de vídeo no relatório. **O pipeline funciona sem.** É opcional.

**Passo 4.1 — Verificar o que já existe**
Checar se a máquina tem `whisper-cli` e `ffmpeg` instalados, e se há um modelo `ggml-*.bin` utilizável.

**Passo 4.2 — Decidir**
- Se tem tudo → usar. Anotar os caminhos pro Bloco 5.
- Se não tem e o expert quer transcrição → orientar a instalar (`brew install whisper-cpp ffmpeg` no Mac, depois baixar um modelo — `medium` é ótimo, `tiny.en` é o mais leve).
- Se o expert não quer se preocupar com isso agora → pular. O pipeline roda sem; só não preenche os hooks de vídeo. Pode adicionar depois.

---

## Bloco 5 — CLAUDE.md (seção Ad Research Config)

Montar/atualizar no CLAUDE.md do projeto a seção que as skills leem:

```
## Ad Research Config

Config lida pelas skills do pipeline de anúncios.

Brand: <nome da marca do expert>

### Airtable
- Base ID: <o app... do Bloco 1.4>
- Competitors Table: _(preencher após rodar a Fase 1)_
- Ad Research Table: _(preencher após rodar a Fase 2)_

### Niche Tiers
Direct: _(preencher após a Fase 1 — concorrentes diretos)_
Adjacent: _(preencher após a Fase 1 — mercados adjacentes)_
Aspirational: _(preencher após a Fase 1 — grandes anunciantes de referência)_

### Tools
- Whisper: <caminho do whisper-cli, ou omitir se pulou>
- Whisper Model: <caminho do modelo, ou omitir se pulou>
```

Os table IDs e os niche tiers ficam como placeholder — o Argus preenche conforme o pipeline roda (task `atualizar-config`).

---

## Bloco 5B — Instalar as Skills do Pipeline

As 3 skills do pipeline (`competitor-research`, `scrape-ads`, `ad-brief`) vêm embarcadas no squad em `squads/squad-anuncios-arcane/skills/`. Pra funcionarem como comando (`/competitor-research` etc.) e ficarem acessíveis ao Argus, precisam ser copiadas pra `.claude/skills/` do projeto.

A Nina roda o instalador (ou pede pro expert rodar), **a partir da raiz do projeto**:

```
node squads/squad-anuncios-arcane/install-skills.mjs
```

O script copia as 3 skills pra `.claude/skills/` e confirma com `3/3 skills instaladas`. Se alguma skill já existir lá, é sobrescrita com a versão embarcada no squad (mantém tudo na mesma versão).

> Se o script avisar que não há pasta `.claude/` no diretório atual → não está na raiz do projeto. Rodar de novo a partir da raiz.

Confirmar o `3/3` antes de seguir.

---

## Bloco 6 — Reiniciar + Verificar

**Passo 6.1 — Reiniciar**
Avisar o expert: os MCPs **só carregam quando o Claude Code reinicia**. Pedir pra fechar e reabrir.

**Passo 6.2 — Verificar**
Após o reinício, confirmar que `airtable` e `apify` aparecem conectados (`claude mcp list` ou o painel de MCP). Se algum não subiu → ver `knowledge/troubleshooting.md`.

---

## Quality Gate — QG-SAA-001

A Nina só devolve o controle pro Argus quando:
- [ ] MCPs `airtable` e `apify` conectados
- [ ] Base ID no CLAUDE.md
- [ ] Token Airtable com os 4 scopes (confirmado com o expert)
- [ ] 3 skills do pipeline instaladas em `.claude/skills/` (`3/3` no instalador)
- [ ] Seção `Ad Research Config` montada

Se algum item falhar → diagnosticar e corrigir antes de devolver. Não empurrar problema pro pipeline.

---

## Handoff de volta pro Argus

```
🤝 Setup fechado. MCPs conectados, base no lugar, CLAUDE.md
preparado. Te devolvo pro Argus — ele conduz o pipeline daqui.
```

---

**Task Status:** Ready for Production
