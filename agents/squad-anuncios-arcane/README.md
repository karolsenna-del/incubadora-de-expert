# Squad Anúncios Arcane

Squad de inteligência competitiva de anúncios pago — para experts da Mentoria Arcane.

**Versão:** 1.0.0 · **Ativação:** `/squad-anuncios-arcane`

---

## O que faz

Te mostra exatamente que anúncio criar, baseado em dado real do que os teus concorrentes já estão rodando no Meta. Não é achismo — é engenharia reversa do que já está validado.

**Tese central:** longevidade = lucratividade. Anúncio rodando há 90 dias está imprimindo dinheiro. Ninguém paga pra manter anúncio que não converte. Então a gente não adivinha o que funciona — olha o que sobreviveu.

---

## Os agentes

| Agente | Papel |
|--------|-------|
| 🛰️ **Argus** (recepção) | Porta de entrada. Recebe, apresenta o time, encaminha pro agente certo, e lê o relatório com você. Não executa — roteia. |
| 🔧 **Nina** (setup) | Onboarding técnico. Guia a configuração das ferramentas + instala as skills, passo a passo. |
| 🔎 **Vera** (inteligência) | Analista de inteligência competitiva. Roda o pipeline: acha concorrentes, scrapeia anúncios, gera o relatório. |
| 🎬 **Téo** (criativo) | Diretor de criação. Pega a inteligência e gera 20+ anúncios sugeridos — ângulo, formato, hook e roteiro prontos pra produzir. |

---

## O pipeline — 3 fases + ativação

| Fase | Skill / Agente | Entrega | Tempo |
|------|----------------|---------|-------|
| 1 — Achar concorrentes | `competitor-research` (Vera) | Tabela `Competitors` no Airtable | ~5 min |
| 2 — Scrapear anúncios | `scrape-ads` (Vera) | Tabela `Ad Research` no Airtable | ~10-15 min |
| 3 — Gerar o playbook | `ad-brief` (Vera) | `research/briefs/ad-brief-{data}.md` | ~2-3 min |
| 🎬 Ativação — Gerar anúncios | Téo | `research/anuncios/anuncios-sugeridos-{data}.md` (20+ anúncios) | ~5-10 min |
| 📦 Entregável final — Consolidar | Argus + `consolidate-final.mjs` | `research/entregaveis/entregavel-final-{data}.{md,html,pdf}` (pacote completo) | ~30 s |

A **Vera** conduz as 3 fases do pipeline (dispara as 3 skills embarcadas em `skills/`). O **Téo** traz uma KB de criativos própria (6 docs em `knowledge/criativos/`). O **Argus** fecha o ciclo gerando o pacote final em 3 formatos via `consolidate-final.mjs` (pandoc + Chrome headless pra PDF).

---

## Pré-requisitos

Cada expert configura as próprias contas (a Nina guia tudo isso):

- **Airtable** (free tier) — guarda os dados
- **Apify** (free tier) — acessa páginas públicas do Facebook
- **Whisper + ffmpeg** — opcional, transcrição de vídeo

---

## Como usar

1. Rode `/squad-anuncios-arcane`
2. Argus te recebe e apresenta o time
3. **Primeira vez?** Argus te passa pra Nina configurar as ferramentas + instalar as skills (~10 min, uma vez só)
4. **Já configurado?** Argus te passa pra Vera, que roda o pipeline — Fase 1 → 2 → 3
5. Argus lê o relatório com você e aponta o que criar primeiro
6. Téo gera o lote de 20+ anúncios sugeridos — ângulo, formato, hook e roteiro prontos pra produzir

---

## Escopo

**Faz:** setup, achar concorrentes, scrapear anúncios, gerar o playbook estratégico, leitura do brief, e gerar o lote de 20+ anúncios sugeridos (ângulo + formato + hook + roteiro).

**Não faz:** produzir/gravar/editar o vídeo, subir campanha no Meta. O Téo entrega o roteiro e a direção — a produção é do expert.

---

## Estrutura

```
squad-anuncios-arcane/
├── agents/        argus-chief.md · nina-setup.md · vera-pesquisa.md · teo-criativo.md
├── tasks/         start · setup-ferramentas · rodar-pipeline · atualizar-config
│                  ler-brief · gerar-anuncios
├── skills/        competitor-research · scrape-ads · ad-brief  (as 3 skills embarcadas)
├── knowledge/     pipeline-visao-geral · conceito-longevidade · guia-setup-ferramentas
│                  troubleshooting · criativos/ (6 docs — KB do Téo)
├── install-skills.mjs   (instala as skills em .claude/skills/)
├── skill.md · squad.yaml · README.md
```

---

## Autocontido

Squad 100% portável pra qualquer aluno Arcane. Skills + KB embarcadas. Os tokens não viajam — cada aluno configura as próprias contas.
