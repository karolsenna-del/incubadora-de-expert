---
task: "Consolidar Entregável Final"
responsavel: "@argus-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Brief Fase 3 + Lote de anúncios Fase 4 prontos em research/"
Saida: "Pacote final em 3 formatos (.md + .html + .pdf) em research/entregaveis/"
Checklist:
  - "Brief mais recente localizado em research/briefs/"
  - "Lote de anúncios mais recente localizado em research/anuncios/"
  - "Resumo executivo (1 página) composto"
  - "Markdown master gerado e salvo"
  - "HTML standalone com CSS gerado via pandoc"
  - "PDF gerado via pandoc + engine disponivel"
  - "Caminhos dos 3 arquivos reportados ao expert"
execution_type: "automated"
---

# Task: Consolidar Entregável Final

**Task ID:** squad-anuncios-arcane/consolidar-entregavel
**Version:** 1.0.0
**Responsável:** @argus-chief

> Trabalho de fechamento do ciclo. Argus pega tudo que o squad produziu — brief estratégico + lote de anúncios + config + bugs descobertos — e empacota num pacote único em 3 formatos (md/html/pdf) que vira o entregável que o expert leva pra equipe/cliente/produção.

---

## Pré-checagem

- [ ] Brief existe em `research/briefs/ad-brief-{data}.md` (Fase 3 executada)
- [ ] Lote de anúncios existe em `research/anuncios/anuncios-sugeridos-{data}.md` (Fase 4 / Téo executou)
- [ ] CLAUDE.md tem `Ad Research Config` com Brand, Niche Tiers, table IDs
- [ ] `pandoc` instalado no sistema (Argus testa com `pandoc --version`)

Se o brief ou os anúncios não existem, **devolver pro fluxo principal** — Argus encaminha pra Vera (rodar pipeline) ou pro Téo (gerar anúncios) antes de tentar consolidar.

---

## Step 1: Localizar inputs mais recentes

```bash
LATEST_BRIEF=$(ls -t ~/arka1/research/briefs/ad-brief-*.md 2>/dev/null | head -1)
LATEST_ADS=$(ls -t ~/arka1/research/anuncios/anuncios-sugeridos-*.md 2>/dev/null | head -1)
```

Se `LATEST_BRIEF` ou `LATEST_ADS` está vazio → abort com instrução clara.

---

## Step 2: Rodar o script consolidador

Argus invoca o utilitário do squad:

```bash
node squads/squad-anuncios-arcane/consolidate-final.mjs
```

O script:
1. Lê brief + anúncios mais recentes
2. Lê config do `CLAUDE.md`
3. Lê o log de bugs (`memory/project_squad_anuncios_arcane_runtime_bugs.md`) se existir
4. Compõe o resumo executivo (1 página) com os 5 achados-chave do brief + os 3 anúncios prioritários
5. Concatena tudo num markdown master
6. Salva em `research/entregaveis/entregavel-final-{data}.md`
7. Gera o `.html` standalone (CSS embutido) via `pandoc -s --metadata title="..."`
8. Gera o `.pdf` via `pandoc --pdf-engine=...` (tenta `xelatex`, `wkhtmltopdf`, ou exporta via Chrome headless)

---

## Step 3: Reportar pro expert

Argus apresenta:

```
✅ Pacote final consolidado:

   📄 research/entregaveis/entregavel-final-{data}.md
   🌐 research/entregaveis/entregavel-final-{data}.html
   📑 research/entregaveis/entregavel-final-{data}.pdf

Conteúdo:
   1. Resumo executivo (1 página) — achados + 3 anúncios prioritários
   2. Brief estratégico completo (8 seções, ~25k chars)
   3. Lote de 20+ anúncios prontos pra produzir (com roteiro + nota produção)
   4. Links das tabelas Airtable (banco bruto)
   5. Log de bugs descobertos + correções aplicadas (transparência)

A criação/gravação dos anúncios é o próximo passo — fora do squad.
```

---

## Tratamento de erro: PDF

PDF pode falhar se não houver engine LaTeX instalado. Em caso de erro:
1. Tentar `--pdf-engine=xelatex` (precisa MacTeX)
2. Fallback: `--pdf-engine=wkhtmltopdf` (precisa brew install wkhtmltopdf)
3. Último fallback: gera só `.md` + `.html` e avisa "PDF não gerado — instale MacTeX ou wkhtmltopdf pra próximo run"

Argus **nunca falha silenciosamente** no PDF — sempre reporta o motivo.

---

## Quality Gate — QG-SAA-006

Pacote completo quando:
- [ ] `.md` salvo e não-vazio
- [ ] `.html` salvo e abre no browser
- [ ] `.pdf` salvo (ou avisado o motivo de não ter sido gerado)
- [ ] Caminhos reportados claramente ao expert

---

**Task Status:** Ready for Production
