# Validação — Vendedor Secreto v3.0.0 (31/10/2026)

## Onde foi instalado
- Mente local (Claude Code): `agents/vendedor-secreto/` — agent.md v3.0.0, KB (647 linhas), tarefa nova `funil-antes-sessao`, revisor com onboarding, config/skill/atalhos (.claude e .agents) atualizados. Forja feita direto na pasta instalada (atualização incremental da v2.1.0; histórico no git).
- Área de membros: seção 10 de `business/campanhas/area-de-membros/handoff-agentes-biblioteca-ia.md` + `site/api/chat-agente.js` (prompt regenerado, `node --check` ok) + card em `site/js/data.js`.
- Vendedor Expert: regra R-009 (sinais sessão x venda direta).

## Smoke tests (prompt da área, gpt-4.1-mini, direto na API)
| Caso | Resultado |
|---|---|
| 1. Abordagem de lead Conector | OK — leu o perfil, 3 etapas, convite de 30 min |
| 2. Lead quer agendar sem pré-diagnóstico | OK — recusou agendar, mandou a mensagem que cobra as respostas |
| 3. Segunda falta | 1ª rodada usou R$97 da Karol; 2ª usou o preço da oferta → regra reforçada → 3ª rodada OK: pergunta o valor da sessão paga do aluno antes |
| 4. Leitura do pré-diagnóstico com sinais de venda direta | OK — listou sinais, recomendou venda direta, mensagem pronta, status do Rastreador |
| 5. Onboarding | 1ª rodada prometeu "fica salvo" sem saber → regra reforçada → 2ª rodada OK: uma coisa só, sem promessa de salvar |

Context Death Test: não rodado (o prompt da área é autocontido; cada conversa recebe o prompt inteiro).

## Pendente
- Publicado em 31/10 (dpl_GJ6hJgtaQtAP3wVeiSdrDwxQmG1x); card novo conferido em membros.incubadoradeexpert.com.br; servidor do chat respondendo (recusa sem login, como deve).
- Material do curso M3.2 ainda manda o pré-diagnóstico depois de confirmar a sessão (ordem antiga).
- Custo: prompt do Vendedor Secreto passou de ~24,8 mil para ~33,8 mil caracteres (cada mensagem do aluno paga esse texto).
