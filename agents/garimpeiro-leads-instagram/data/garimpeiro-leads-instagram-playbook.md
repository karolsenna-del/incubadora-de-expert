# Garimpeiro de Leads no Instagram — Playbook

> SOPs e procedures. Cresce a cada missão documentada.
> Consultar ANTES de iniciar qualquer rodada. Se já tem SOP, seguir.
> **Regras operacionais:** ver `garimpeiro-leads-instagram-rules.md` (carregado no start).

---

## Tier 1 — Recorrentes

### [SOP-001] Rodada de garimpo (v2 — custo zero, 3 fases)
**Criado em:** 17/10/2026 · **Reescrito em:** 18/10/2026 (sem Apify + rastreador na aba)
**Última execução:** 17/10/2026 (versão Apify — teste de 9 termos de servidora, US$0,70, 35 entregues). v2 ainda sem rodada real.
**Trigger:** "garimpa", "busca leads de X"
**Tempo estimado:** 30–50 min (busca web ~10 min · perfil público ~6 min pra 150 · fase logada ~4 min pra 15 · classificação)
**Ferramentas:** WebSearch, `tools/garimpo.mjs`, `tools/logado.mjs`, `tools/planilha.mjs`, webhook n8n
**Regras obrigatórias:** REGRA-001, REGRA-002, REGRA-003, REGRA-004

**Pré-requisitos:**
- Perfil do cliente em `data/perfis/{cliente}.json`
- Termos da rodada
- Sessão `referenciasgpt` ativa (`logado.mjs conferir`) — só pra fase 3

**Passos:** ver `tasks/rodada-garimpo.md` (descobrir → perfil público → fit 1-3 → aprofundar logado → classificar → enviar → relatório → documentar)
- Verificar: aba recebeu as linhas (`planilha.mjs listar`), Score calculando, relatório bate com `contagem` do JSON

**Output esperado:** até 50 linhas na aba (garimpo + rastreador) + relatório + linha no Mission Log

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

## Consultas que funcionam (busca web, fase 1)

| Data | Cliente | Consulta | Perfis úteis / resultados | Obs |
|------|---------|----------|---------------------------|-----|
| 18/10/2026 | karol | `site:instagram.com "servidora pública" "transição de carreira"` | ~1/8 (teste) | traz muito mentor de carreira, sindicato e portal — testar com cidade/UF e cargo |
| 19/10/2026 | karol | `site:instagram.com "{profissão}" "anos de experiência"` ou `"{profissão} há" anos` (+ cidade) | ~4-8 perfis individuais/10 | MELHOR consulta da v2: traz liberal com tempo de carreira na bio (já responde "experiência"). Psicóloga, nutricionista, enfermeira, fisioterapeuta, advogada renderam |
| 19/10/2026 | karol | `"servidora pública"/"concursada" "empreendedora"` | ~2-3/10 | traz servidora com negócio paralelo (regra nova da dor), mas muito perfil de loja/doceria |
| 19/10/2026 | karol | `"transição de carreira"` + profissão, `"projeto paralelo"`, `"ex-professora"` | ~0-1/10 | RUIM: só mentor de carreira, universidade e instituição — não usar |
| 19/10/2026 | karol | `"engenheira"/"assistente social"/"RH"/"farmacêutica"/"contadora" "anos de experiência"` | 0-2/10 | só empresa/escritório ou vazio |

## Histórico de régua (perfil de busca)

| Data | Cliente | Mudança | Motivo | Aprovado por |
|------|---------|---------|--------|--------------|
| 17/10/2026 | karol | Perfil inicial | Discovery do Worker Forge | Karol |
| 17/10/2026 | karol | Estrangeiro = descarte; brasileiro no exterior = dentro | Rodada teste trouxe perfis do México/Espanha | Karol |
| 17/10/2026 | karol | Régua própria pra servidor/CLT (carreira + sinal de transição; sem exigir link de agenda) | Servidora não vende serviço — cairia toda em média | Karol |
| 18/10/2026 | karol | 4 perguntas de fit do rastreador: carreira clara · ainda não vende método · sinal de empreender/transição · já cria conteúdo profissional | Juntar o Rastreador de Leads Qualificados na aba; renda saiu (não qualifica abordagem inicial) | Karol |
| 18/10/2026 | karol | Fit v2: anos de experiência · mostra a dor · já cria conteúdo · quer ser autoridade (Sim/Não/A avaliar + "Revisar:" automático). Prioridade de abordagem = Score + trava de Aderência. Coluna M = "Postou nos últimos 30 dias?" | v1 repetia a Aderência; Aderência = "é do público?", fit = "vale abordar agora?" | Karol |
| 18/10/2026 | karol | "A avaliar" não penaliza: prioridade de abordagem calculada pela proporção de Sim entre as respondidas (Alta exige 3+ respondidas). "Revisar:" passa a dizer o que olhar no perfil | Lead sem informação caía pra Baixa sem motivo | Karol |

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
| 19/10/2026 | karol | "Mostra a dor?" = Sim também pra negócio paralelo próprio ou estudo voltado a mudar de rumo (não vale estudo pra outro concurso) | 1ª revisão: acerto Alta 4/4, Média 14/15; os 3 aprovados que caíram em Baixa tinham negócio paralelo/mestrado em negócios. Efeito: os 3 sobem pra Média | Karol |
