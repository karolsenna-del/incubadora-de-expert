# Log de Decisoes

> Decisoes importantes registradas com racional e contexto. Append-only.

<!-- Formato:
## [DATA] — [TITULO DA DECISAO]
**Contexto:** [o que estava acontecendo]
**Decisao:** [o que foi decidido]
**Racional:** [por que]
**Impacto:** [o que muda]
-->

## 03/07/2026 — Rebalancear o Roteiro da Jornada: acelerar fases iniciais, mais tempo pra proposta/validação/posicionamento

**Contexto:** Na prática com a Milena, M0 e P1 (Persona Compradora) fecharam em sequência acelerada — as fases iniciais são conduzidas pelos agentes de IA com a aluna e andam muito mais rápido do que o roteiro de 12 meses previa (5 meses pra M0-M2). Já a parte que realmente demora é a criação e validação do produto no campo.

**Decisão (cronograma validado pela Karol em 03/07):**
- Mês 1: M0 + M1 (desbloqueio + persona + promessa)
- Meses 2-3: M2 + campo (processo autoral + portfólio + 3+ leads)
- Meses 4-6: M3 + campo (proposta + 10+ conversas + validar 3x)
- Meses 7-12: M4 + escala (autoridade, frase-tese, presença, conteúdo, escala)

**Racional:** O gargalo real da jornada não é conceitual — é ir a campo, vender, validar 3x e construir posicionamento. O roteiro antigo superestimava o tempo da fundação (5 meses pra M0-M2) e subestimava o tempo de validação. A experiência real com aluna (Milena) é a evidência.

**Impacto:** Aplicado em 03/07 no template (`mentoria/alunas/_template/0.1- Roteiro da Jornada.md`) e replicado pros 5 alunos ativos (Milena, Analia, Helio, Ricardo, Rodrigo). Milena já segue o ritmo novo: P1 fechada 03/07, P2 fecha na semana de 06-10/07 — dentro do Mês 1.

## 01/07/2026 — Migração de plataforma: Hotmart bloqueou → curso migrado pra Voomp Play

**Contexto:** Expert360º estava planejado pra rodar na Hotmart (estrutura, questionário de pré-diagnóstico, agente de suporte nativo). Hotmart bloqueou o acesso/uso pretendido.

**Decisão:** Migrar o curso pra Voomp Play. O worker `course-publisher` (`agents/course-publisher/`) já estruturou os 5 módulos + Módulo de Orientações com as 43 aulas na nova plataforma (config.yaml).

**Racional:** Sem alternativa viável na Hotmart, Voomp Play oferece a estrutura equivalente (módulos, aulas, agente de suporte nativo) sem o bloqueio.

**Impacto:** PRD atualizado pra v1.4 refletindo a mudança. Itens do checklist de produção que citavam Hotmart (H01-H09) atualizados pra Voomp — parte já concluída (estrutura dos módulos), parte pendente (upload de vídeos, vínculo de materiais, questionário de pré-diagnóstico equivalente na Voomp).

## 15/06/2026 — Criar especialista "Expert em Lives" para roteiros de live semanal

**Contexto:** Karol faz lives semanais pro grupo fechado (Google Meet) hoje sem agente especializado — produzidas no "Claude normal", cada sessão do zero. Testamos um outline em tópicos pra Live 19, adaptando o modelo "Funil de Zoom" (Conversão Imediata) do ETL Vinizoom: Narrativa → Execução (com spoiler do pitch) → Prática (reusa o exercício "Lista de Fracassos" do M0) → Prova Racional + Pitch Estendido.

**Decisão:** Criar um Worker "Expert em Lives", especializado em roteiros de live semanal no modelo Funil de Zoom, usando o outline da Live 19 como seed/referência.

**Racional:** Lives semanais são operação contínua e recorrente — repertório hoje não persiste entre sessões. O teste da Live 19 validou o formato tópicos + Funil de Zoom; precisa virar competência fixa no sistema (REUSE > recriar do zero a cada semana).

**Impacto:** Próximo passo: ativar `/worker-forge` pra criar o Expert em Lives, com `business/campanhas/lives-semanais/live-19-outline.md` como referência inicial.

## 28/05/2026 — "Expert em fracassar no digital" como pilar de posicionamento

**Contexto:** Weekly review. Gancho levantado em 11/05 foi revisitado e elevado de ideia de conteudo para decisao de posicionamento.

**Decisao:** Nao e so angulo de conteudo — e pilar central de posicionamento. O metodo da Karol nasceu dos seus fracassos. A autoridade nao vem dos acertos — vem de ter falhado, entendido o porque, e transformado em metodo.

**Racional:** Conecta diretamente a tese ("Diploma e o que voce estudou. Metodo e o que voce viveu."), ao M0 do Expert360 ("Fracasso como Prova"), e a ferida→medicina do diagnostico de proposito (13 anos servico publico + 8 fracassos). A maioria dos players fala de sucesso. Karol fala de autoridade construida na derrota — diferencial raro.

**Impacto:** Usar "expert em fracassar no digital" como angulo estruturante do posicionamento no Instagram. Permeia bio, conteudo e abertura dos modulos do curso.

## 14/05/2026 — Persona compradora vs persona de propósito: manter "sem lançamentos" na promessa

**Contexto:** Durante o preenchimento da ferramenta de posicionamento, surgiu dúvida sobre manter "sem lançamentos" na promessa principal. A questão era se a persona conhece o termo — já que o propósito da Karol é libertar CLTs e servidores públicos que ainda não entraram no digital.

**Decisão:** Manter "sem lançamentos" na promessa da oferta. Calibrar a promessa para a persona compradora de hoje (Laura 2 — já tentou, estudou Fórmula de Lançamento, conhece o mercado). A persona de propósito (Laura 1 — CLT, servidor público, ainda não começou) é o movimento de longo prazo, construído via conteúdo e tese.

**Racional:** Quem compra hoje é Laura 2. "Sem lançamentos" fala diretamente com ela — é alívio imediato, diferenciação clara do mercado. Laura 1 chega pelo conteúdo ao longo do tempo, não pela promessa da oferta. As duas coexistem: Laura 2 financia enquanto Laura 1 chega.

**Impacto:** Promessa da oferta calibrada para Laura 2. Conteúdo e tese continuam falando com o movimento maior (Laura 1). Não misturar os dois na mesma comunicação.

## 19/05/2026 — Precificação do curso Expert360º

**Contexto:** Durante o módulo de criação de produtos da Arcane, surgiu a dúvida sobre incluir os agentes de IA no curso online ou entregar só teoria + templates. A percepção era de que R$497 estava barato para um produto com os agentes.

**Decisão:** Incluir os agentes no curso. Preço direto na plataforma: R$697. Preço nos funis: R$497.

**Racional:** Os agentes são o mecanismo do Expert360º — sem eles, o curso vira teoria genérica e não entrega a transformação prometida. R$697 ancora o valor percebido. R$497 nos funis cria oferta agressiva de escala sem desvalorizar o produto na plataforma.

**Impacto:** Curso Expert360º com agentes de IA incluídos. Estratégia de preço duplo: R$697 (plataforma) / R$497 (funis). Meta: escala com percepção de premium mantida.

## 19/05/2026 — Entregáveis finais do curso Expert360º

**Contexto:** Definição dos entregáveis do curso durante módulo de criação de produtos da Arcane.

**Decisão:**
- Agentes de IA incluídos (6 agentes — mecanismo do produto, não acessório)
- Sem comunidade de alunos ativos (protege self-image da persona)
- Sem suporte direto da Karol (anti-escala — agentes substituem)
- Encontro mensal ao vivo em grupo: Q&A coletivo, não individual
- Alumni group como bônus futuro (quem concluiu — não alunos ativos)

**Racional:** Encontro mensal resolve objeção de compra ("não estou sozinha"), mantém engajamento e serve como upsell natural para mentoria — quem quer mais acompanhamento já conhece e confia, a venda é continuidade, não pitch.

**Impacto:** Produto limpo, escalável, com touchpoint mensal de upsell para mentoria integrado à experiência do aluno.

## 08/06/2026 — Renomear aulas de "Encerramento" em todos os módulos do Expert360º

**Contexto:** Durante a roteirização do Encerramento M3, Karol observou que o nome "Encerramento" soa institucional/genérico — do tipo que aluna pula — mas essas aulas carregam a virada psicológica de identidade de cada módulo (consolidação de quem ela se tornou).

**Decisão:** Renomear todas as aulas de Encerramento (M0, M1, M2, M3 — e futuramente M4) para **"Quem Você Se Tornou — Encerramento Módulo X: [tema]"**. Mantém a referência ao módulo para navegação interna do roteiro, mas o nome que a aluna vê passa a comunicar o real valor da aula: reconhecimento da transformação, não aviso de fim de conteúdo.

**Racional:** "Encerramento" é nome operacional (perspectiva de produção), não persuasivo (perspectiva de quem assiste). Aulas que carregam a virada de identidade — o momento mais importante da jornada psicológica — não podem ter nome que convide a pular.

**Impacto:** Aplicado em `m0-roteiros.md`, `m1-roteiros.md`, `m2-roteiros.md` e `m3-roteiros.md`. M4, quando roteirizado, deve seguir a mesma convenção.

## 03/07/2026 — Copy pública em masculino genérico

**Contexto:** Durante a reescrita da LP do mini treinamento, surgiu a questão de gênero na copy — a persona (Laura) é feminina, mas 40% dos alunos da Karol são homens. Testou-se alternância de gênero na mesma frase ("psicóloga, advogado, médica...") e a Karol vetou: parece erro de concordância.

**Decisão:** Toda copy pública (LPs, posts, anúncios) usa **masculino genérico como padrão**. Feminino só em contexto exclusivamente feminino (história da Karol, depoimentos de alunas). Nunca alternar gênero dentro da mesma frase ou lista. Perfis de público nomeados direto ("Profissional liberal", "Empregado CLT", "Servidor público"), sem rótulos criativos.

**Racional:** Alienar 40% da audiência custa mais do que a especificidade de gênero agrega. A persona Laura segue como referência de dores e ruminações — muda só a marca gramatical.

**Impacto:** Aplicado na LP nova (`business/campanhas/lp-minitreinamento/`). Vale pra toda produção de copy futura (registrado também na memória do sistema).
