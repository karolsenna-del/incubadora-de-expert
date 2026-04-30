# Casos Práticos NDF — Catálogo de Uso Real

> Casos reais de uso do SO de IA que demonstram a teoria funcionando.
> Cada caso é um argumento tangível. Quanto mais casos, mais valor na hora de apresentar, convencer, impressionar.
> Formato: situação, o que foi feito, resultado, conceito que prova.

---

## CP-001: Shift de campanha entre ciclos

**Situação:** Workshop 14/03 acabou. Próximo ciclo é dia 28/03. Precisa atualizar tudo: datas em 6+ arquivos, links de grupo WhatsApp em 15+ ocorrências, link da sala, prompts da Bia (3 versões), copies de WhatsApp, calendário de envio, templates da Meta, página de vendas no Lovable.

**O que foi feito:** Acionou TechOps (worker) à noite. TechOps fez varredura completa, listou tudo que precisava mudar, perguntou os dados novos, e executou sozinho. Inclusive usou Playwright pra entrar no Lovable e dar prompt pra outra IA mudar as datas na página.

**Resultado:** Tudo atualizado em ~1 hora. Antes levava 3+ dias com equipe (gestor de infra + gestor de tráfego).

**Conceito que prova:** Worker operacional, IA que orquestra outras IAs, pain-first (nasceu da necessidade real), velocidade vs equipe.

---

## CP-002: Bug log orgânico da Bia

**Situação:** Bia (agente WhatsApp) deu vários bugs na primeira versão. Repetia mensagem, ativava prompt errado, travava.

**O que foi feito:** Expert investigou bugs com Cloud Code. Depois falou: "cria um sistema de catalogação desses bugs". A IA criou sozinha a pasta `bug-log` com formato padronizado: bug ID, descrição, diagnóstico, correção.

**Resultado:** Sistema de catalogação que não existia, nasceu da dor, agora previne que bugs se repitam em agentes futuros.

**Conceito que prova:** Pain-first, evolução incremental, documentar é investir, sistema que nasce organicamente.

---

## CP-003: Organização da pasta Downloads

**Situação:** Pasta de downloads do Mac completamente bagunçada com arquivos acumulados.

**O que foi feito:** Falou pro Claude: "minha pasta tá bagunçada, dá uma olhada". Claude analisou tudo, propôs organização. Expert aprovou. Claude reorganizou inteira.

**Resultado:** Pastas organizadas: tools, arquivo pessoal, fontes, ativo (projetos ativos).

**Conceito que prova:** Braço e perna (IA agindo no computador real), co-piloto pra tarefas mundanas, o expert manda e julga.

---

## CP-004: Teoria NDF visualizada

**Situação:** A teoria NDF estava crescendo em texto linear (markdown). Expert sentiu necessidade de ver algo visual pra enxergar conexões.

**O que foi feito:** Pediu pro Cloud atualizar a teoria no MD e depois criar uma versão visual (HTML interativo). Cloud leu toda a teoria, atualizou, e gerou o diagrama automaticamente.

**Resultado:** Visual interativo da teoria completa, atualizado junto com o documento fonte.

**Conceito que prova:** Pensar com IA, sistema que se auto-documenta, Exocortex vivo.

---

## CP-005: Jarvis briefing ao vivo no workshop

**Situação:** No meio do workshop, acionou Jarvis ao vivo pra mostrar o companion funcionando. Perguntou "onde estamos? o que tenho que fazer agora?"

**O que foi feito:** Jarvis leu contexto dinâmico, cockpit, trackers. Mostrou estado de todos os projetos ativos, pendências, prioridades. Sabia sobre o laudo psicológico, sobre padrões de risco, sobre decisões recentes.

**Resultado:** Briefing completo da empresa em segundos, ao vivo, na frente dos alunos. "Eu sei que a Arka fatura acima de 500K, que o público são experts de 35 a 54 anos..."

**Conceito que prova:** Companion/Exocortex, memória perfeita, "materializar a empresa em documentos e pastas", zona de graça (expert opera no estratégico).

---

## CP-006: Slides produzidos pela IA durante a noite

**Situação:** Precisava de slides pro workshop do dia seguinte.

**O que foi feito:** Deixou a IA produzindo slides a noite inteira. Expert dormiu.

**Resultado:** Slides prontos de manhã. "A IA tem mais força de vontade que qualquer funcionário."

**Conceito que prova:** IA sem limite de jornada, delegação pós-pavimentação, braço e perna.

---

## CP-007: Clone Babruna — Mind Upload na prática

**Situação:** Precisava de expertise em tráfego pago (Método Andromeda) operando dentro do SO, sem depender de consultor externo.

**O que foi feito:** Clone Forge extraiu conhecimento da Barbara Bruna (especialista tráfego) em 3 versões progressivas:
- v1: 82 reels extraídos
- v2: 122 reels, POC com 77.3% de fidelidade
- v3: modelagem cognitivo-motora — não só o que ela diz, mas como pensa e decide

**Resultado:** 246 MIUs extraídas. Agente Babruna opera com os padrões de decisão dela. Prioriza, julga e decide como ela. Disponível 24/7 dentro do SO.

**Conceito que prova:** Mind Upload, ETL como mecanismo, Clone Forge, conhecimento é baixável e instalável, Fórmula do Sistema (IA + Conhecimento = Superagente).

---

## CP-008: Dashboard — de dias pra 30 minutos

**Situação:** Dashboard de métricas do negócio. Antes, Cauê (da equipe) levava dias pra montar e atualizar.

**O que foi feito:** IA construiu dashboard junto com o expert no modo co-piloto.

**Resultado:** 30 minutos pra montar. Atualizado em tempo real. Sem depender de ninguém.

**Conceito que prova:** Velocidade vs equipe, co-piloto, pavimentar antes de delegar.

---

## CP-009: Bia refeita — de versão genérica a agente real

**Situação:** Agente Bia (WhatsApp) tinha sido feita por David (prestador). Funcionava, mas era genérica.

**O que foi feito:** Expert refez inteira em 1 dia com Claude Code. Com contexto profundo, tom de voz, regras de negócio, fluxos personalizados.

**Resultado:** 10x melhor que a versão anterior. Feita em 1 dia vs semanas do prestador. Expert entende cada linha porque pavimentou.

**Conceito que prova:** Pai da criança, pavimentar antes, One Expert Business, velocidade.

---

## CP-010: Equipe de 30K/mês → zero

**Situação:** Tinha 3 pessoas na equipe, ~30K/mês de custo. Gestor de infra, gestor de tráfego, assistente.

**O que foi feito:** Migrou progressivamente cada função pra IA. Infra → Tech Ops. Tráfego → Gestor Andromeda + Babruna. Assistente → Bia + Workers.

**Resultado:** Custo de equipe: zero. Qualidade: igual ou superior. Velocidade: absurdamente maior. Autonomia: total.

**Conceito que prova:** One Expert Business, IA substitui workaround humano, PLI (lucro + independência), democratização.

---

## CP-011: Página de vendas 100% com IA

**Situação:** Precisava de página de vendas pro lançamento. Antes dependia de designer + copywriter + dev.

**O que foi feito:** Copy com LP Master (mind consultor). Design no Lovable com IA. Código gerado automaticamente. Expert direcionou e julgou cada etapa.

**Resultado:** Página completa — copy + design + código — sem nenhum humano além do expert. Qualidade profissional.

**Conceito que prova:** Entrelaçamento M+I, orquestrador (manda + julga), OEB, Skills técnicas em ação.

---

## CP-012: Ciclo diário real — situação + prioridade + ação

**Situação:** Manhã típica de operação. Expert senta, abre Claude Code.

**O que foi feito:** Jarvis carrega contexto e diz: "Ontem você finalizou a copy da página e mandou pro ar. Campanha rodando há 12h. CPA tá em R$14 — acima da meta de R$10. 3 leads quentes no WhatsApp que a Bia não converteu. Criativo 2 performando 40% melhor que os outros."

**Resultado:** Em 30 segundos, expert situado. Sabe onde está, o que importa, o que fazer. Decide: "Mata os criativos fracos, escala o 2, manda Tech Ops trocar pela versão B. Vou olhar os leads da Bia."

**Conceito que prova:** Ciclo diário (situar → priorizar → executar), Companion/Jarvis, 4 necessidades (situar + executar), zona de graça.

---

## CP-013: ETL de tráfego — conhecimento vira operação

**Situação:** Tinha a KB de tráfego Andromeda (7 volumes, 4273 linhas) mas era documento passivo.

**O que foi feito:** ETLmaker processou a KB. Squad Forge criou o Gestor Andromeda (4 agentes, 9 tasks, 1 workflow). Babruna (clone) foi integrada como consultora de estratégia dentro do squad.

**Resultado:** Squad que opera Meta Ads com metodologia dentro. Não é IA genérica apertando botão — é IA que sabe COMO o método funciona, com regras cardinais, nomenclatura, padrão de decisão.

**Conceito que prova:** Fórmula do Sistema (IA + Conhecimento = Superagente), Pipeline completo (conhecimento → ETL → KB → Skill → Squad), tem técnica pra tudo.

---

*Catálogo atualizado em 23/03/2026*
*13 casos documentados. Fontes: workshop 14/03, teoria v5.1, operação diária.*
*Quanto mais casos, mais poder de convencimento. Priorizar casos mundanos (shift de campanha) tanto quanto os espetaculares (Jarvis ao vivo).*
