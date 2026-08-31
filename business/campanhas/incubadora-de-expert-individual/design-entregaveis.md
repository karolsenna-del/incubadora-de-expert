# Design de Entregáveis — Incubadora de Expert (Mentoria Individual)
Versão: 1.0 (Aprovado) | Fase 5 do Mentoring Creator | Gate: QG-MC-006 ✅

> Grande parte disso já roda de fato (com Milena e David) — aqui formalizei o que existe e fechei as decisões pendentes com a Karol.

---

## 1. Onboarding

| Componente | Status | Detalhe |
|---|---|---|
| Aplicação/filtro de entrada | ✅ **Existe, sem critério de reprovação** | Funil real (`business/campanhas/lp-diagnostico-expert/briefing.md`): lead preenche **pré-diagnóstico** (Google Forms: negócio, persona, promessa, provas, dificuldade) → **Sessão Estratégica / Diagnóstico do Expert** (45 min, gratuita) → fecha. Não existe critério que reprova alguém — é qualificação de conversa, não filtro de seleção. Confirmado com a Karol (28/08). |
| Welcome sequence | ✅ **Já existe e roda — 2 versões, precisa consolidar** | Ver seção "Welcome Sequence — 2 versões em uso" abaixo. |
| DNA do Expert (pré-Sessão 1) | ✅ **Já existe e roda** | Questionário preenchido pelo aluno **antes** do 1º encontro (objetivos, dificuldades do negócio) — alimenta o Roteiro do Expert Personalizado. Distinto da Sessão 1 (F0) em si: o DNA do Expert é o intake que prepara a sessão, os exercícios M0.2/M0.3 (História Real + Ikigai) acontecem depois, dentro da sessão, junto com a Karol. |
| Diagnóstico do Aluno / ficha de coaching | ✅ **Já existe e roda** | A partir do DNA do Expert + das sessões, Karol preenche `_mentor/perfil.md`, `negocio.md`, `contexto.md` — ficha viva de coaching, atualizada a cada sessão. |
| Baseline measurement | ✅ **Já existe, via F0** | M0.2 História Real + M0.3 Ikigai são o baseline — registram onde o aluno está antes de qualquer construção de método. |

---

### Welcome Sequence — 2 versões em uso (a consolidar)

Karol trouxe duas referências reais (28/08):

**Versão mais recente (usada pra Rosiani, "por último"):** mensagem de WhatsApp enxuta —
1. Acesso à área de membros (Hotmart Club)
2. Link do formulário de diagnóstico (**DNA do Expert**) — a aluna responde pra agendar a reunião de onboarding/1ª sessão

**Versão anterior (usada pro David):** mesma mensagem de acesso Hotmart, **sem** o link do diagnóstico — o envio do DNA do Expert acontecia solto, fora dessa mensagem.

**PDF "Onboarding Simplificado V1"** (`C:\Users\karol\Downloads\ONBOARDING SIMPLIFICADO V1 .pdf.pdf`): deck completo de 14 slides — o que é a mentoria, jornada visual (Entrar → Boas-vindas → Questionário → Instruções → Encontros → Criar método → Feedback → Validar → Portfólio), DNA do Expert, período de acesso, Drive, FAQ, horário de atendimento, SLA. **Não está claro se esse PDF ainda é enviado hoje**, ou se a mensagem de WhatsApp (mais enxuta) substituiu ele na prática.

**Desatualizado no PDF, vs. o que já aprovamos nas Fases 3-4:**
- Slide "Encontros Individuais" mostra só 3 encontros (Onboarding / Validação do método / Criação do Portfólio) — não bate com as 14 sessões / 5 fases (F0-F4) aprovadas
- Slide "Período de Acesso" mostra uma tabela com "4 Ps do lançamento" e "Venda de High Ticket" — nomenclatura antiga, não bate com os 5Ps (Persona/Promessa/Processo/Proposta/Posicionamento) nem com Vendas Secretas
- "6 ou 12 meses de acesso, a depender da contratação" — o PRD atual fala em 12 meses fixos; conferir se a opção de 6 meses ainda existe

**Resolvido (28/08):** o onboarding segue em uso e está em transição — Karol vai construir uma **nova página de onboarding** (substitui/atualiza o PDF), a mensagem de boas-vindas precisa apontar pra **nova área de membros** (troca o link do Hotmart Club atual) e o **link do diagnóstico (DNA do Expert) também mudou**. Ou seja: os 3 componentes da welcome sequence (mensagem, página/PDF, formulário de diagnóstico) estão todos com atualização pendente — não é decisão de design, é produção de material novo.

**Vira item do checklist de produção (Fase 9):**
- [x] Nova página de onboarding (substitui o PDF V1) — publicada em `onboarding.incubadoradeexpert.com.br` (31/08), construída com o Squad LPago Arcane (`business/campanhas/lp-onboarding-incubadora/`)
- [ ] Mensagem de boas-vindas atualizada com os links da página de onboarding e da área de membros — `onboarding.incubadoradeexpert.com.br` + `membros.incubadoradeexpert.com.br`
- [x] Confirmar e documentar o novo link do formulário de diagnóstico (DNA do Expert) — `dna.incubadoradeexpert.com.br` (confirmado 30/08)

---

## 2. Offboarding / Graduação

| Componente | Status | Detalhe |
|---|---|---|
| Assessment final vs. baseline | ✅ **Aprovado (28/08)** | Vira parte da Sessão 14 (F4, retro final) — comparação lado a lado entre o DNA do Expert/baseline (M0) e onde o aluno chegou. |
| Sessão de fechamento | ✅ **Desmembrado (28/08)** | Sessão 14 (F4) concentra só: assessment final + plano de continuidade (Expert Plan). O depoimento/case study **saiu daqui** — motivo na linha abaixo. |
| Plano de continuidade | ✅ **Definido (28/08) — ferramenta: Expert Plan** | Ao final, o aluno sai com um negócio rodando (mais de um produto + funil). Ferramenta: **Expert Plan** — planilha com 3 camadas: plano estratégico (projeção de faturamento por produto), plano tático (funis ativos), plano operacional (volume de prospecção, sessões realizadas, follow-up). **Já existe:** https://docs.google.com/spreadsheets/d/1T8hHRb1IRXDuRElpUwNKa8tHWuVxWp_g6gyPUB5vHpE/edit — Karol confirma que precisa ser melhorada. Vira item do checklist de produção (Fase 9). Narrativa de fechamento: depois de faturar X, é uma transição de carreira real — a pessoa tem um negócio digital de verdade, com recorrência, escala e estrutura (não só um método validado). |
| Depoimento / case study | ✅ **Reposicionado (28/08) — momento certo é F3, não F4** | Karol: o melhor momento pra pegar depoimento é logo **após a validação do método (Vendas Secretas)**, não no fechamento dos 12 meses — porque a prova em campo É a promessa central da mentoria (não a autoridade digital, que é só continuação). Captura movida pra Sessão 8 (F3, quando fecha a 3ª venda real). Formato (texto/vídeo) fica a critério da Karol na hora. |
| Alumni network | ✅ **Decisão consciente (28/08): mantém como está** | Sem grupo/acesso contínuo por enquanto. Revisitar se o volume de alunos formados crescer. |
| Oferta de próximo nível (upsell) | ✅ **Ideia embrionária registrada (28/08) — não formalizada** | Karol (contadora/administradora de formação) imagina o próximo nível como **gestão do negócio**: contratar, estruturar, criar processos. Ainda não é produto — entregue informalmente 1:1 quando algum aluno chegar nesse ponto. Não faz parte do empacotamento desta mentoria (fica pra quando/se virar oferta própria). |

**Resolvido:** desmembrado — depoimento saiu da Sessão 14 e foi pra Sessão 8 (F3). `design-sessoes.md` já atualizado com a revisão.

---

## 3. Assessments e Ferramentas

| Componente | Status | Detalhe |
|---|---|---|
| Diagnóstico de entrada | ✅ | Trio História Real + Ikigai + (Lista de Fracassos opcional) — já coberto na Fase 4 (Sessão 1) |
| Diagnóstico de saída | ✅ | Comparação DNA do Expert/baseline (M0) vs. estado final — feita na Sessão 14 (ver seção 2) |
| Frameworks proprietários | ✅ | Os 5Ps + agentes de IA correspondentes (M0-M4), já mapeados na Fase 2 e usados sessão a sessão (Fase 4) |
| Templates que o aluno usa | ✅ | Biblioteca de Templates (10 moldes genéricos) + Portfólio Estratégico (15-20 ferramentas específicas do método de cada aluno, construídas em F2) |
| Ferramentas externas (agentes de IA) | ✅ | 6 Custom GPTs — já existem, listados em `0- Biblioteca de IAs.md` de cada aluno (não fazem parte de `agents/`, são GPTs externos — registrado em memória do sistema) |

---

## 4. Comunidade e Suporte

| Componente | Status | Detalhe |
|---|---|---|
| Plataforma de suporte | ✅ | WhatsApp — decidido na Fase 3. Refinado pelo PDF de onboarding: **2 canais** — grupo de dúvidas de conteúdo (respondido pela Karol) + "Whats do Suporte" (acessos, calendário, financeiro, contrato) |
| Regras de convivência / uso do canal | ✅ **Resolvido via PDF** | Horário de atendimento: dias úteis, 9h-18h (exceto datas com encontro ao vivo fora desse horário) |
| Moderação | N/A | Não aplicável — não é comunidade de grupo |
| SLA de suporte | ✅ **Resolvido via PDF — fecha o gap da Fase 3** | Dúvidas: até 24h úteis. Gravações dos encontros ao vivo: disponibilizadas em até 48h úteis |
| Conteúdo async | ✅ **Confirmado pelo PDF** | Não há conteúdo gravado complementar — modelo é sessão ao vivo (gravada e disponibilizada) + ferramentas de IA. Gravações contam como o "conteúdo async" do programa. |

---

## 5. Materiais de Apoio

| Componente | Status | Detalhe |
|---|---|---|
| Conteúdos gravados complementares | ✅ **Confirmado: não existe, por decisão** | Modelo é 100% sessão ao vivo + ferramentas de IA (ver seção 4) |
| Biblioteca de recursos | ✅ | Biblioteca de Templates (10 moldes) + Portfólio Estratégico (ferramentas do método do próprio aluno) |
| Gravações das sessões | ✅ **Resolvido via PDF** | Sessões são gravadas e disponibilizadas em até 48h úteis (SLA do PDF de onboarding). Confirma o que o `00- Anotações` já sugeria. |

---

## 6. Validação contra o PRD

| Entregável comprometido no PRD | Coberto? |
|---|---|
| Método autoral com nome próprio (P3) | ✅ Fase 4, Sessão 4 |
| Persona + Promessa (P1+P2) | ✅ Fase 4, Sessões 2-3 |
| Proposta Validada + roteiros + Vendas Secretas (P4) | ✅ Fase 4, Sessões 6-8 |
| Autoridade Tríplice + Frase-Tese + Narrativa (P5) | ✅ Fase 4, Sessão 9 |
| Sessões semanais/mensais 12 meses | ✅ Fase 3 + Fase 4 |
| Acompanhamento via `_mentor/` | ✅ Seção 1 acima |
| Add-on ferramentas + agente de IA | 🟡 Ainda a precificar/detalhar — não é escopo desta fase (é comercial, cabe na Fase 7 — Empacotamento) |
| Add-on páginas + tráfego | 🟡 Idem — Fase 7 |

---

*Fase 5 do Mentoring Creator — aprovada pela Karol em 28/08/2026 (QG-MC-006).*
