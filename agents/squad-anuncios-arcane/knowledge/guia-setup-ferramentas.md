# Guia de Setup das Ferramentas

KB da Nina. Referência completa da configuração — a task `setup-ferramentas.md` é o roteiro interativo; este doc é o material de apoio.

---

## O que o pipeline precisa

| Ferramenta | Pra quê | Obrigatório? | Custo |
|------------|---------|--------------|-------|
| **Airtable** | Guardar os dados (concorrentes + anúncios) | Sim | Free tier serve |
| **Apify** | Acessar páginas públicas do Facebook / Ad Library | Sim | Free tier serve (crédito mensal cobre o uso) |
| **Whisper + ffmpeg** | Transcrever os vídeos dos anúncios | Não | Grátis (local) |

Cada expert usa as **próprias contas**. Os tokens não viajam no pacote do squad — por isso a Nina existe: pra guiar cada aluno a configurar as dele.

---

## Airtable — passo a passo

1. Conta em `airtable.com` (free).
2. Token: `airtable.com/create/tokens` → criar PAT com os **4 scopes**:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
   - `schema.bases:write`
3. Na seção **Access** do token, incluir a base (ou o workspace inteiro).
4. Criar uma **base vazia** (nome livre, ex: "Ad Research").
5. Base ID: está na URL, começa com `app`. (`wsp` é workspace, não serve.)

---

## Apify — passo a passo

1. Conta em `apify.com` (free).
2. Token: Settings → Integrations → API tokens → copiar (começa com `apify_api_`).

O Apify acessa só dados **públicos** do Facebook. Não usa nem pede a conta de Facebook do expert.

---

## MCPs — os plugues

```
claude mcp add airtable -s local -e AIRTABLE_API_KEY=<token> -- npx -y airtable-mcp-server
claude mcp add apify -s local -e APIFY_TOKEN=<token> -- npx -y @apify/actors-mcp-server
```

**Sempre `-s local`.** Isso grava o token numa config local da máquina, fora do Git — não vaza em repositório. Nunca usar `-s project` se o `.mcp.json` for versionado.

Depois de adicionar: **reiniciar o Claude Code** (os MCPs só carregam no boot).

---

## Whisper — opcional

Transcreve os vídeos dos anúncios → gera os "hooks" de vídeo no brief. O pipeline funciona sem; só não preenche esse campo.

Pra ativar (Mac):
```
brew install whisper-cpp ffmpeg
```
Depois baixar um modelo (`medium` é ótimo; `tiny.en` é o mais leve). Colocar os caminhos na seção `Tools` do `Ad Research Config`.

---

## CLAUDE.md — a seção de config

As skills leem o CLAUDE.md do projeto. A seção precisa existir assim:

```
## Ad Research Config

Brand: <marca do expert>

### Airtable
- Base ID: <app...>
- Competitors Table: _(preencher após a Fase 1)_
- Ad Research Table: _(preencher após a Fase 2)_

### Niche Tiers
Direct: _(preencher após a Fase 1)_
Adjacent: _(preencher após a Fase 1)_
Aspirational: _(preencher após a Fase 1)_

### Tools
- Whisper: <caminho ou omitir>
- Whisper Model: <caminho ou omitir>
```

Os placeholders são preenchidos pelo Argus conforme o pipeline roda.

---

## Checklist final (QG-SAA-001)

- [ ] MCPs `airtable` e `apify` conectados
- [ ] Base ID no CLAUDE.md
- [ ] Token Airtable com os 4 scopes
- [ ] Seção `Ad Research Config` montada
- [ ] Claude Code reiniciado
