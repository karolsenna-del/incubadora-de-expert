# Garimpeiro de Leads no Instagram — Playbook

> SOPs e procedures. Cresce a cada missão documentada.
> Consultar ANTES de iniciar qualquer rodada. Se já tem SOP, seguir.
> **Regras operacionais:** ver `garimpeiro-leads-instagram-rules.md` (carregado no start).

---

## Tier 1 — Recorrentes

### [SOP-001] Rodada de garimpo
**Criado em:** 17/10/2026
**Última execução:** 17/10/2026 (teste de 9 termos de servidora — US$0,70 real, 35 entregues)
**Trigger:** "garimpa", "busca leads com #X"
**Tempo estimado:** 10–20 min (coleta Apify 2–8 min + classificação)
**Ferramentas:** `tools/garimpo.mjs`, `tools/planilha.mjs`, Apify, webhook n8n
**Regras obrigatórias:** REGRA-001, REGRA-002, REGRA-003

**Pré-requisitos:**
- Perfil do cliente em `data/perfis/{cliente}.json`
- Termos da rodada

**Passos:** ver `tasks/rodada-garimpo.md` (estimar → coletar → classificar → enviar → relatório → documentar)
- Verificar: aba recebeu as linhas (`planilha.mjs listar`) e o relatório bate com `contagem` do JSON

**Output esperado:** até 50 linhas na aba + relatório + linha no Mission Log

**Troubleshooting:** KB §5

---

## Tier 2 — Sob demanda

### [SOP-002] Teste de termo
Ver `tasks/research-tool.md` (A). Limite 20, sem enviar pra aba.

### [SOP-003] Perfil de aluno novo
Ver `tasks/perfil-cliente.md`. Primeira vez: Gestor de Infra cria a planilha "Garimpo Alunos" e libera o ID no webhook.

## Tier 3 — One-shot
(nenhum ainda)

---

## Rendimento por termo

| Data | Cliente | Termo | Modo | Coletados | Entregues | Custo US$ | Obs |
|------|---------|-------|------|-----------|-----------|-----------|-----|
| 17/10/2026 | karol | #psicologa | hashtag (10) | 8 | 2 | 0,044 (real) | teste · metade estrangeira (sem acento = espanhol) · usar #psicóloga / termos com UF |
| 17/10/2026 | karol | #concursada | hashtag (20) | 20 | 8 (2 alta) | ~0,08 | teste servidora · muito recém-nomeado (média) |
| 17/10/2026 | karol | #professoraconcursada | hashtag (20) | 16 | 7 (2 alta) | ~0,08 | teste servidora · bom pra professora, pouco sinal de transição |
| 17/10/2026 | karol | #servidorapublica | hashtag (20) | 11 | 6 (1 alta) | ~0,08 | teste servidora · traz servidora de verdade + portal de notícia |
| 17/10/2026 | karol | #transiçãodecarreira | hashtag (20) | 17 | 5 (2 alta) | ~0,08 | teste · traz muito concorrente (mentor de carreira) |
| 17/10/2026 | karol | #transicaodecarreira | hashtag (20) | 7 | 2 (1 alta) | ~0,08 | teste · pouco volume |
| 17/10/2026 | karol | #vidadeservidor | hashtag (20) | 8 | 2 (1 alta) | ~0,08 | teste · muito perfil pequeno/meme |
| 17/10/2026 | karol | #analistajudiciaria | hashtag (20) | 12 | 3 (1 alta) | ~0,08 | teste · muita concurseira |
| 17/10/2026 | karol | #auditorafiscal | hashtag (20) | 12 | 2 (0 alta) | ~0,08 | teste · RUIM: cursinho, órgão, concurseira — não usar |
| 17/10/2026 | karol | #enfermeiraconcursada | hashtag (20) | 1 | 0 | ~0,08 | teste · quase nada volta — não usar |

## Histórico de régua (perfil de busca)

| Data | Cliente | Mudança | Motivo | Aprovado por |
|------|---------|---------|--------|--------------|
| 17/10/2026 | karol | Perfil inicial | Discovery do Worker Forge | Karol |
| 17/10/2026 | karol | Estrangeiro = descarte; brasileiro no exterior = dentro | Rodada teste trouxe perfis do México/Espanha | Karol |
| 17/10/2026 | karol | Régua própria pra servidor/CLT (carreira + sinal de transição; sem exigir link de agenda) | Servidora não vende serviço — cairia toda em média | Karol |

---

## Template de SOP

### [SOP-XXX] {Nome do Processo}
**Criado em:** {data}
**Última execução:** {data}
**Trigger:** {o que dispara}
**Tempo estimado:** {quanto tempo}
**Ferramentas:** {quais}
**Regras obrigatórias:** (nenhuma ainda — preencher quando surgirem)

**Pré-requisitos:**
- {o que precisa}

**Passos:**
1. {passo 1}
   - Verificar: {como saber que deu certo}

**Output esperado:** {o que deve sair}

**Troubleshooting:**
- {problema}: {solução}
