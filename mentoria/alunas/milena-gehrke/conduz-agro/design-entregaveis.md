# Design de Entregáveis — Conduz Agro

> Status: ✓ APROVADO (QG-MC-006) — 21/08/2026
> Executa contra: `prd.md` (Seção 4 — Entregáveis Comprometidos) + `estrutura-programa.md` + `design-sessoes.md`
> Modalidade: Individual (1:1) — não há componente de turma/cohort

---

## 1. Onboarding — Fluxo de Entrada

| Etapa | Descrição | Status |
|---|---|---|
| Aplicação/filtro | O **Pré-Diagnóstico de Vendas** cumpre esse papel: qualificação (área de atuação, tempo de mercado, faturamento, urgência) + teaser das 3 esferas com perguntas abertas de contexto, respondido antes da sessão estratégica de vendas. Sem call de screening separada — o próprio formulário já filtra e prepara a conversa. Ver `diagnostico-aluno-completo.md` Seção 6 | Confirmado |
| Welcome sequence | Mensagem (WhatsApp + e-mail) após confirmação de pagamento: boas-vindas, o que esperar dos 12 meses, como funciona a Etapa 1 vs Etapa 2, link do kit de boas-vindas | Proposto |
| Kit de boas-vindas | Calendário das 24 sessões (datas sugeridas, quinzenal), acesso ao Agente do Método Conduz Agro, ao Preparador de Conversas Difíceis e ao Destrava Condução, instruções da Trilha de Aplicação Diária, contato do WhatsApp direto | Proposto |
| Sessão de intake = Sessão 1 | Não precisa de uma sessão de intake separada — a própria **Sessão 1 (Diagnóstico)** já cumpre esse papel: aplica o Diagnóstico da Autoridade Aplicada + DISC e nomeia o papel atual do mentorado | Confirmado (já desenhado na Fase 4) |
| Baseline measurement | O preenchimento da Sessão 1 (diagnóstico + papel nomeado) É o baseline — usado como referência em todos os 5 checkpoints do Checklist de Evidências e na Sessão 21 (revisão antes x depois) | Confirmado |
| Apresentação ao grupo | N/A — modalidade individual | N/A |

## 2. Offboarding / Graduação

| Etapa | Descrição | Status |
|---|---|---|
| Assessment final | Reaplicação do Diagnóstico da Autoridade Aplicada (mesmo formato da S1) — compara trava predominante no início x no fim. Já usado como base da Sessão 21 (revisão da jornada) | Confirmado |
| Sessão de fechamento = Sessão 24 | Já desenhada: indicadores finais + plano de continuidade + 5ª marcação do Checklist de Evidências | Confirmado (Fase 4) |
| Plano de continuidade | Componente da própria Sessão 24 — não é um entregável separado | Confirmado |
| Depoimento/case study | Proposto: pedir depoimento em vídeo curto (2-3min) na Sessão 24, focado no resultado comercial concreto da Etapa 1 (S8) + na evolução registrada no Checklist de Evidências — dá prova social ancorada em fato, não em promessa | Proposto |
| Alumni network (Conduz Agro, não confundir com o grupo do Expert360º) | Fica pra quando a Milena tiver 3+ mentorados formados — sem estrutura formal agora. Nome definitivo (não "alumni") sai na Fase 6 (Branding) | Confirmado (revisitar depois) |
| Oferta próximo nível | **Aberto — decisão da Milena.** O PRD (Seção 7, fora do escopo do 1:1) já lista itens do ecossistema Conduz Agro maior (Rede de Apoio, Central de Condução, Conselho Estratégico, Sessão Estratégica avulsa, Radar de Evidências) — algum desses pode virar a oferta de continuidade natural pós-programa, mas isso é planejamento de esteira, não deste squad | Fora de escopo aqui — sinalizar pra depois |

## 3. Assessments e Ferramentas

Já mapeadas no PRD (Seção 4) e com uso definido nas sessões (`design-sessoes.md`). Consolidado aqui pra fechar o desenho:

| Ferramenta | O que mede/faz | Onde entra |
|---|---|---|
| Diagnóstico da Autoridade Aplicada + DISC | 30 perguntas (reduzido de 64 pra evitar fadiga), 3 esferas (Técnica/Emocional/Condução), Índice Conduz Agro geral + mapa de travas por subdimensão + perfil comportamental (DISC). Tem também uma versão ainda mais reduzida — o Pré-Diagnóstico de Vendas — pro lead, pré-matrícula. Ver `diagnostico-aluno-completo.md` | S1 (baseline) e S21/reaplicação (final); versão de vendas na sessão estratégica pré-matrícula |
| Círculo de Controle da Condução | Separa o que depende do profissional / pode influenciar / está fora de controle | S3, revisitado sempre que a pressão de um caso pede |
| Mapa do Caso | Demanda → problema real → riscos → próximo passo | S4 (versão rápida), S12 (versão avançada) |
| Simulador de Conversas que Conduzem | Treino de resposta a objeção/pressão | S6, S16 |
| Mapa de Posicionamento | Eu sou → Eu resolvo → Para quem → Como faço → Qual valor entrego | S7, S18 (revisado) |
| Mapa de Valor Percebido no Agro | Traduz tarefa técnica em risco evitado/ganho — reduz disputa por preço | S7 |
| Protocolo Pessoal de Condução | Sistema pessoal repetível (Abrir→Ouvir→Investigar→Diagnosticar→Orientar→Propor→Negociar→Decidir→Conduzir→Acompanhar) | S23-S24 |
| Checklist de Evidências da Autoridade | Registro cumulativo de evolução — 5 marcações | S8, S12, S16, S20, S24 |
| Plano de Aplicação Diária | Trilha paralela, 15min 5x/semana, sincronizada por quinzena | Contínuo, todos os 12 meses (formato de entrega — ver Seção 5) |
| CRM Comercial Conduz Agro | Planilha (Sheets): pipeline de prospecção → fechamento + controle financeiro (a pagar/em dia/atrasado/quitado) + reativação anual pra renovar documentação. Adaptado do Rastreador de Leads do Expert360º (M3.5) da própria Milena. Execução do serviço fica com as ferramentas de condução de caso, não com o CRM | Uso contínuo da Milena no negócio dela (fora das sessões) — ver `crm-comercial.md` |

**Nota de produção:** o Diagnóstico da Autoridade Aplicada é candidato natural a virar ferramenta interativa self-service (Claude Artifact, sem domínio — molde do "Diagnóstico do Expert" da Incubadora: wizard, progresso salvo, resultado calculado, respostas indo pra uma planilha). Identidade visual já disponível (`branding.md` Seção 6) — construção liberada.

## 4. Comunidade e Suporte

Não há comunidade (modalidade individual). Suporte já desenhado na Fase 3 (`estrutura-programa.md`, seção "Suporte Entre Sessões — 4 Camadas") — replicado aqui pra fechar o gate:

1. **Agente do Método Conduz Agro** (self-service) — dúvida de referência sobre qualquer conteúdo do método
2. **Preparador de Conversas Difíceis** (self-service) — antes de uma conversa real difícil (preço, cobrança, documento, limite)
3. **Destrava Condução** (self-service) — quando trava num caso pontual e não quer esperar a próxima sessão
4. **WhatsApp direto com a Milena** — reservado pro que exige julgamento humano dela, SLA 48h úteis (a validar com a capacidade dela)

*(Agente de IA Técnico em Regularização é uma 5ª camada separada, cobrindo dúvida técnica — não comportamental)*

**Regras de convivência:** N/A formalizado — é 1:1, não precisa de regras de grupo. Vale só alinhar expectativa de uso das ferramentas self-service vs. WhatsApp (já coberto na welcome sequence do onboarding).

## 5. Materiais de Apoio

| Item | Descrição | Status |
|---|---|---|
| Gravação das sessões | Grava e sobe numa área de membros — ferramenta pronta por ora (Hotmart ou similar), com plano da Karol de entregar área de membros personalizada aos alunos no futuro | Confirmado |
| Conteúdos gravados complementares | Não previsto no PRD — o programa é 100% guiado por sessão 1:1 + ferramentas. Não criar conteúdo de nivelamento gravado a menos que surja demanda específica | Confirmado (não incluir por ora) |
| Biblioteca de recursos | As próprias ferramentas do Portfólio Estratégico (Seção 3 acima), entregues no kit de boas-vindas e reforçadas a cada sessão em que são usadas — não precisa de uma "biblioteca" separada | Confirmado |

## 6. Validação contra o PRD (Seção 4 — Entregáveis Comprometidos)

- [x] Diagnóstico inicial da postura profissional — S1
- [x] 24 sessões 1:1 quinzenais, 6 módulos — `design-sessoes.md`
- [x] Suporte via WhatsApp direto com a mentora — Seção 4 deste doc
- [x] Protocolo Pessoal de Condução — S23-S24
- [x] Plano de posicionamento 30/60/90 — S20 (parte do escopo revisado)
- [x] Aplicação em caso real (simulação + atendimento real) — S8 e S22
- [x] Indicadores de evolução + plano de continuidade — S24
- [x] Todas as 13 ferramentas do Portfólio Estratégico — Seção 3 deste doc + `design-sessoes.md`

**Zero gaps contra o PRD.**

## 7. Decisões fechadas (histórico)

1. Aplicação/filtro de entrada → Pré-Diagnóstico de Vendas cumpre esse papel (21/08)
2. Gravação das sessões → grava, sobe em área de membros (21/08)
3. Plataforma de call → Meet (21/08)
4. Alumni/oferta de continuidade → fica pra quando houver 3+ mentorados formados, nome a definir na Fase 6 (21/08)

**Oferta de próximo nível pós-programa** segue fora de escopo deste squad (é planejamento de esteira) — sinalizado pra retomar depois.
