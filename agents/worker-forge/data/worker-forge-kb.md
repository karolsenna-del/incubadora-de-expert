# Worker Forge — Knowledge Base

> Fabrica de funcionarios digitais. Transforma descricoes de cargo em workers AIOS operacionais com KB viva.

---

## 1. O QUE E UM WORKER

Worker e um agente que TRABALHA — diferente de consultor (pensa) e processo fixo (segue fluxo rigido).

| | Assistant | Agent | **Worker** |
|---|---|---|---|
| Pergunta central | "O que voce quer saber?" | "O que voce quer que eu faca?" | "Qual resultado voce espera?" |
| Entrega | Resposta | Tarefa feita | Resultado entregue + documentado |
| Memoria | Sessao | Cross-session | Viva (cresce com uso) |
| Autonomia | Baixa | Media | Alta + calibrada |
| Diferencial | Responde | Faz | Possui o resultado |

Frase-chave (EverWorker): "Tools run tasks; Workers own outcomes."

---

## 2. DNA DO WORKER — 9 COMPONENTES

Todo worker produzido pelo Worker Forge tem estes 9 componentes:

| # | Componente | O que e | Framework-raiz |
|---|-----------|---------|----------------|
| 1 | **Role Card** | Quem sou, o que faco, ate onde vou | Job Description (SHRM), Hackman & Oldham |
| 2 | **Context Pack** | Entendo o negocio, cultura, momento | Onboarding 30-60-90 |
| 3 | **Playbook** | SOPs pro trabalho repetitivo | SIPOC, Work the System (Carpenter) |
| 4 | **Skill Level** | Nivel de competencia por area | Dreyfus (5 niveis) |
| 5 | **Delegation Map** | Quando decide sozinho vs escala | Appelo 7 Levels, RACI |
| 6 | **Knowledge Base** | Acesso ao conhecimento + sabe buscar mais | SECI (Nonaka), Voyager |
| 7 | **Scoreboard** | Como sei que fiz bem feito | OKRs, KPIs, 4DX, DoD |
| 8 | **Quality Gates** | Checklists de verificacao | Gawande (Checklists), PDSA |
| 9 | **Improvement Loop** | Melhora com o tempo, documenta aprendizado | Toyota Kata, PDSA (Deming) |

---

## 3. WORKER OS — SISTEMA OPERACIONAL

Todo worker vem com 4 modos padrao:

### Modo 1: Missao
**Trigger:** "faz X", "configura Y", "integra Z"
**Ciclo:** Receber -> Confirmar -> Checar Playbook -> Checar Delegation -> Planejar -> Executar -> Reportar -> Documentar
**Regra:** Missao completa = executada + testada + documentada

### Modo 2: Pesquisa
**Trigger:** "estuda X", "descobre como fazer Y"
**Ciclo:** Pesquisar (WebSearch) -> Sintetizar -> Adicionar a KB
**Regra:** Pesquisa nao e resposta de chat — e conhecimento adicionado permanentemente a KB

### Modo 3: Documentacao
**Trigger:** automatico apos missao OU "documenta X"
**Ciclo:** Registrar passos -> Criar/atualizar SOP -> Adicionar ao Playbook
**Regra:** Todo processo novo executado DEVE virar SOP

### Modo 4: Diagnostico
**Trigger:** "o que ta errado com X", "por que Y nao funciona"
**Ciclo:** Sintomas -> Consultar KB -> Investigar -> Diagnosticar -> Propor/Executar fix -> Documentar
**Regra:** Diagnostico documentado vira entrada no Troubleshooting da KB

---

## 4. KB VIVA — 4 CAMADAS

| Camada | Arquivo | Conteudo | Quando cresce | Loading |
|--------|---------|----------|---------------|---------|
| **Rules** | `{slug}-rules.md` | Regras operacionais nascidas de incidentes | Quando bug/incidente gera aprendizado permanente | ALWAYS |
| **Foundation KB** | `{slug}-kb.md` | Dominio base: plataformas, APIs, conceitos, integracoes | Quando pesquisa ferramenta nova | On-demand |
| **Playbook** | `{slug}-playbook.md` | SOPs e procedures passo-a-passo | A cada missao nova documentada | On-demand |
| **Mission Log** | `{slug}-missions.md` | Historico: missao, resultado, aprendizados | A cada missao executada | On-demand |

**Rules vs Strict Rules:** Strict Rules (no agent.md) sao comportamentais e permanentes ("NUNCA pedir credencial duas vezes"). Rules operacionais (no rules.md) nascem de incidentes e protegem contra erros especificos do dominio. O arquivo nasce vazio e cresce conforme o worker opera.

**Inspiracao:**
- Voyager (NVIDIA) — Skill library que cresce com uso
- MetaAgent — KB auto-construida conforme encontra gaps
- A-Mem (NeurIPS 2025) — Zettelkasten: notas atomicas interconectadas
- Letta/MemGPT — Agente que gerencia propria memoria
- Tech Ops Optimization (03/2026) — Separacao rules/KB/playbook como otimizacao de context window

**Principio:** Worker sem KB e funcionario no primeiro dia sem treinamento.

---

## 5. IMPROVEMENT LOOP (PDSA)

Ciclo Deming embutido em toda missao:

1. **Plan:** O que era esperado?
2. **Do:** O que foi feito?
3. **Study:** Resultado bateu? O que surpreendeu?
4. **Act:** Atualizar SOP? KB? Delegation Map?

SE problema recorrente detectado: flag pro usuario.
SE processo novo executado: criar SOP no Playbook.
SE ferramenta nova descoberta: adicionar a Foundation KB.

---

## 6. DELEGATION MAP — ESCALA APPELO

7 niveis de autonomia (Jurgen Appelo, Management 3.0):

| Nivel | Nome | Quem Decide | Uso Tipico |
|-------|------|-------------|------------|
| 1 | **Tell** | Usuario decide, worker executa | Decisoes financeiras, estrategicas |
| 2 | **Sell** | Usuario decide, explica por que | Mudancas de direcao |
| 3 | **Consult** | Worker propoe, usuario decide | Mudancas em sistema em producao |
| 4 | **Agree** | Consenso | Decisoes com impacto medio |
| 5 | **Advise** | Worker decide, usuario pode opinar | Integracoes novas |
| 6 | **Inquire** | Worker decide, reporta depois | Configuracoes de rotina |
| 7 | **Delegate** | Worker decide, nem reporta | Tasks operacionais padrao |

**Regras:**
- Todo worker DEVE ter pelo menos 1 decisao nivel 7 (senao nao e worker, e robo)
- Todo worker DEVE ter pelo menos 1 decisao nivel 1-3 (senao nao tem supervisao)
- Decisoes com impacto financeiro: nunca acima de nivel 5 sem autorizacao

---

## 7. FRAMEWORKS EMPRESARIAIS INTEGRADOS

### E-Myth (Michael Gerber)
"Liste todos os jobs que voce faz. Escreva job description pra cada um. Crie sistemas."
Isso e literalmente o que o Worker Forge faz — cada funcao vira um worker com SOP.

### Work the System (Sam Carpenter)
3 documentos: Strategic Objective (system prompt), Operating Principles (rules), Working Procedures (tasks).
Mapeamento direto pro AIOS: context pack, strict rules, tasks.

### EOS/Traction (Gino Wickman)
Accountability Chart + Rocks + Scorecard.
Mapeamento: Role Card + Scoreboard.

### SECI (Nonaka & Takeuchi)
Externalization (tacito -> explicito): o que o Worker Forge faz ao criar KB.
Internalization (explicito -> tacito): o que o worker faz ao absorver KB e executar.

### 4DX (FranklinCovey)
WIGs, Lead Measures, Scoreboard, Cadence of Accountability.
Mapeamento direto pro Scoreboard do worker.

---

## 8. REFERENCIA: AGENTS AUTONOMOS

### Voyager (NVIDIA)
Skill library executavel que cresce com uso. Referencia pra KB viva.

### MetaAgent
Learning-by-doing: comeca com minimo, constroi tools + KB conforme encontra gaps.

### Strands SOPs (AWS)
Workflows em markdown com linguagem natural + keywords RFC 2119.
Validacao do formato AIOS de tasks.

### Letta/MemGPT
Agente que gerencia propria memoria — decide o que lembrar/esquecer.
Referencia pra evolucao autonoma da KB.

### Claude Cowork (Anthropic)
Funcionario digital persistente com schedule. Modelo de triggers + autonomia + escalacao humana.

---

## 9. CHECKLIST DE WORKER PRONTO

- [ ] Role Card completa (proposito, duties com %, scope, boundaries)
- [ ] Context Pack montado (empresa, cultura, stack, stakeholders)
- [ ] Delegation Map com >= 5 tipos de decisao (min 1 nivel 7, min 1 nivel 1-3)
- [ ] Scoreboard definido (KPIs, DoD, Lead Measures)
- [ ] Foundation KB >= 300 linhas para 3+ ferramentas, >= 150 para 1-2 (organizada por dominio/ferramenta)
- [ ] Rules file inicializado (vazio, estruturado — cresce com operacao)
- [ ] Playbook inicializado com tiers (Recorrentes / Sob demanda / One-shot) + template com campo "Regras obrigatorias"
- [ ] Mission Log inicializado
- [ ] 4 modos padrao (Missao, Pesquisa, Documentacao, Diagnostico)
- [ ] 5 tasks padrao (start, execute-mission, research-tool, document-process, diagnose-issue)
- [ ] Improvement Loop (PDSA) embutido
- [ ] STRICT RULES: >= 5 NUNCAs + >= 5 SEMPREs
- [ ] skill.md como shim de ativacao
- [ ] squad.yaml valido (rules como critical/always, KB e Playbook como on-demand)

---

## 10. GROWTH TRIGGERS — Quando Otimizar um Worker

Workers nascem enxutos. Conforme operam, acumulam SOPs, regras e conhecimento. Estes triggers indicam quando intervir:

| Trigger | Threshold | Acao |
|---------|-----------|------|
| **Decision Tree** | 5+ SOPs com triggers parecidos | Criar arvore de decisao no topo do Playbook |
| **Carregamento condicional** | Context load total > 2.000 linhas | Refatorar start.md: base (agent + rules + vault) sempre, KB + Playbook sob demanda |
| **Auditoria de nomenclatura** | 2+ termos ambiguos no dominio | Padronizar: qualificar nomes ambiguos em todos os SOPs e KB |
| **Deduplicacao de dados** | IDs/tokens hardcoded em 3+ SOPs | Mover tudo pro Vault, referenciar por numero |
| **Regras enterradas** | Regras operacionais misturadas com SOPs no Playbook | Extrair pro rules.md (ja criado no Day 1) |
| **SOPs desbalanceados** | SOPs misturando referencia + procedimento + dados | Desmembrar: referencia → KB, dados → Vault, procedimento → SOP |

**Principio (Deming):** O sistema precisa de manutencao. Worker que so cresce sem podar vira arquivo morto.

---

## 11. ARMADILHAS NA FORJA

| Armadilha | Sinal | Correcao |
|-----------|-------|----------|
| Scope infinito | Worker "faz tudo" | Definir boundaries explicitas |
| KB rasa | <300 linhas, sem troubleshooting | Pesquisar mais, enriquecer |
| Autonomia total | Tudo nivel 7 | Adicionar gates pra decisoes de impacto |
| Autonomia zero | Tudo nivel 1 | Nao e worker, e robo. Aumentar delegacao |
| Zero documentacao | Worker nao documenta | Embutir Modo Documentacao como obrigatorio |
| Duties vagas | "Cuida da infra" sem detalhar | Decompor em atividades com % de esforco |
| KB sem troubleshooting | So features, sem problemas | Pesquisar problemas comuns de cada plataforma |

---

## 12. WORKER-PRD — Template e Protocolo

### O que e

O WORKER-PRD e o documento de requisitos formais do worker. Gerado ao final da Discovery (Fase 0), serve como fonte de verdade que o pipeline inteiro referencia e que a validacao final (Fase 5) verifica contra o worker montado.

### Por que existe

Sem PRD, o pipeline trabalha contra uma conversa. A conversa e perdida entre sessoes. O PRD:
- Cristaliza o que foi decidido na Discovery
- Permite que qualquer agente no pipeline saiba o que foi prometido
- Habilita validacao automatica no final (PRD Fulfillment Check)
- Documenta restricoes e boundaries ANTES de comecar a montar

### Quando e gerado

Na task `discover-needs`, APOS consolidar o discovery_summary e ANTES da confirmacao do usuario. O usuario aprova o PRD junto com o discovery summary.

### Onde vive

`agents/worker-forge/output/{slug}/WORKER-PRD.md`

### Template (8 secoes)

| Secao | Conteudo | Fonte |
|-------|----------|-------|
| 1. Identidade | Nome, slug, proposito, dominio | Discovery lenses D1-D2 |
| 2. Duties | Responsabilidades com % e criterio de aceite | Discovery lens D2 |
| 3. Ferramentas | Ferramentas requeridas com nivel minimo | Discovery lens D3 |
| 4. Autonomia | Delegation map resumido (Appelo levels) | Discovery lens D4 |
| 5. Metricas | Criterios de sucesso mensuráveis | Discovery lens D5 |
| 6. Restricoes | O que NAO faz, boundaries explicitas | Discovery consolidacao |
| 7. Fontes Internas | Paths de processos/docs existentes no AIOS | Coleta interna |
| 8. Gaps Conhecidos | Duvidas nao resolvidas, informacao faltante | Gap analysis |

### Quem referencia

| Fase | Como usa o PRD |
|------|---------------|
| 0 - Discovery | Gera o PRD |
| 1 - Research | Consulta ferramentas requeridas (Secao 3) |
| 2 - Proposal | Alinha Role Card com duties (Secao 2) e metricas (Secao 5) |
| 3 - Playback | Usuario re-valida contra PRD |
| 4 - Assembly | Smith verifica coerencia com PRD |
| 5 - Validation | PRD Fulfillment Check (obrigatorio antes de smoke tests) |
