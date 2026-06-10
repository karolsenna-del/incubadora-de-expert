# 04 — Filosofia e Didática (a voz do Euriler)

> Como o Euriler ensina o Auroq OS — modelos mentais, metáforas, frases e práticas, destilados do workshop. O consultor usa isto pra explicar o sistema NA VOZ DELE, do jeito que faz o aluno entender. Fonte: Workshop NDF 23-24/mai/2026 (transcrição).

---

## O modelo mental central: os níveis de uso da IA (N1 → N4)

O Euriler ensina a IA em níveis de poder crescente. O aluno precisa entender ONDE ele está pra saber pra onde vai.

- **N1/N2 — o chat** (ChatGPT/Claude no navegador): só skills e contexto colados na hora. Some quando a sessão acaba.
- **N3 — a IA autônoma crua** (Claude Code "cru"): tem superpoderes — mexe no computador, nos programas, na web (via Playwright) — mas **é CRU**. Não tem memória, não tem squads, não tem agentes. "É a mesma coisa que usar o chat sem skill."
- **N4 — a IA autônoma COM contexto** (Claude Code dentro do Auroq OS): o nível mais bravo. É pegar o Claude Code e colocar dentro de um sistema que dá **memória persistente + metodologia (skills/squads/agentes) + credenciais + projetos**. "Não tô sempre recomeçando — é tudo uma grande coisa só. O trabalho vai crescendo, vira incremental."

> A frase-âncora: **"O Cloud Code é a máquina. A qualidade do que você faz nela é o contexto — skills, squads, o rolê todo. O valor está no repertório, no contexto e no rolê todo."**

---

## As 3 camadas do Claude Code (qual usar)

Quando o aluno pergunta "qual versão do Claude Code eu uso?":

1. **Claude Cowork** — amostra grátis no aplicativo. Mexe numa pasta, mas faz pouco. Feito pra leigo.
2. **Claude Code no app** — o botão "code" no aplicativo. Básico, já resolve muita coisa.
3. **Claude Code no terminal** — **o melhor de todos.** "Parece assustador, mas é o mais simples e o melhor." O Claude Code mora DENTRO do terminal: o terminal vira um chat que mexe no teu computador, nos teus programas e na web.

> O terminal é "o sistema nervoso do computador — essa coisa preta que todo computador tem (Windows e Mac)". Dá pra deixar a tela branca, mas isso é estético.

**Planos do Claude (importante pro aluno):** tudo isso roda já no plano **Pro de R$100/mês**. Os planos (Pro R$100 · Max 5x R$550 · Max 20x R$1000) **só mudam o limite de tokens** — quanto mais caro, mais tempo sem estourar. *(Nota de produto: nunca usar API paga no Claude Code — é dinheiro jogado fora.)*

**Como o Claude Code interage com o mundo:**
- **Playwright** → simula um ser humano, navega na web (faz login, clica). Útil quando a ferramenta não tem API.
- **MCP / API** → conexão DIRETA, a melhor opção. Não precisa simular nada — só resolve.

---

## A metáfora da casa: o que é o sistema operacional

O Auroq OS é "uma casinha" — na prática, uma **pasta-mãe = a tua empresa** (uma pasta por empresa/projeto). Dentro dela:

- **Arquivo de pastas** — documentos, projetos, dados do público, do negócio, dos clientes, posicionamento
- **Memória unificada** — histórico, decisões, aprendizados (ele lembra de tudo que já aconteceu)
- **Regras de operação** — como o negócio funciona
- **Sala dos squads** — os agentes e squads instalados
- **Docas de integração** — MCP/API com todas as chaves (ele se conecta a tudo automaticamente)

> "Quase como um grande Google Drive, mas com inteligência artificial e superpoderes. O Claude Code trabalha dentro desse universo." Cada relatório que você gera fica guardado e ele acessa automaticamente na hora de trabalhar.

---

## Os conceitos, do jeito que ele explica

**Skill** = um agente que é uma pessoa só, um arquivo (~500 linhas — o "miniclone"). Não precisa do sistema operacional pra existir; o sistema só organiza as skills no mesmo ambiente.

**Squad** = "um conjunto de agentes em prol de um mesmo tema, onde um passa o bastão pro outro." Vem do militar — equipe de elite especializada. Ex: squad de lançamento pago = um especialista em copy de página, outro em design, outro chefe, outro estrategista.
> Regra de ouro do squad: **"Quanto mais específico o trabalho, melhor. Não criaria um squad da empresa inteira — tenho um squad só pra cada coisa."**

**Superagente** = a complexidade de um squad inteiro dentro de uma única persona. Dois tipos:
- **Clone** — clona uma mente real (você ou qualquer pessoa). Puxa workflows, metodologias, processo de tomada de decisão, heurísticas, vieses, modelos mentais, o drive mental. Precisa de conteúdo bruto + ETL. (Ex real: clonou a melhor gestora de tráfego do Brasil a partir de vídeos do YouTube, curso e Instagram.) O clone real dele = 29 documentos (vs o miniclone de 1 arquivo).
- **Mente sintética** — vários experts numa cabeça só, por tema. (Ex: um gestor de projetos = os melhores pensadores e metodologias de gestão do mundo fundidos.)

**Companion** = o "meio de campo entre você, a sua empresa e os seus squads". "Me sinto Homem de Ferro." É o gestor de projeto — lembra de tudo, sabe os projetos parados e os próximos planos, abre a sessão já sabendo o contexto.

---

## Como o agente trabalha (e como o expert opera)

Todo agente/worker/squad, ao receber uma missão: **1)** checa as regras do que tem que fazer (o contexto) → **2)** propõe (ex: uma copy) → **3)** confirma com o expert → **4)** executa.

> **Orquestrar = mandar e julgar.** "Dou a ordem e vou viver minha vida. Não fico assistindo ele trabalhar — depois ele entrega o resultado." O expert vira maestro: manda pra um funcionário, manda pra outro, e julga o output.

---

## O que o sistema substitui (o argumento de infra)

Exemplo real que ele demonstra — a "gestão de infra" feita por um worker que conhece os processos e tem as chaves. O que ele eliminou:

| Antes (ferramenta terceirizada) | Custo/mês | Depois |
|--------------------------------|-----------|--------|
| Ferramenta de disparo de grupo WhatsApp | R$ 500 | Z-API (API direta) |
| Ferramenta de API individual (ManyChat) | R$ 800 | N8N + paga direto à Meta (~R$0,50/msg) |
| Área de membros terceirizada | R$ 1.000 | o próprio sistema produz |
| Email marketing (Active Campaign etc.) | — | dentro do sistema |
| Profissional de infra | R$ 3.000 | um worker faz |
| **Total** | **~R$ 6.300** | **≈ zero** |

> A lógica: ferramenta com conexão **via API/MCP** o Claude resolve direto; sem API, usa Playwright. "Antes você ia ter que apertar todos esses botões ou contratar alguém ou arrumar um sócio/lançador — e tudo ia por água abaixo. Agora não."

---

## A filosofia (frases e crenças que ele repete)

- **"As barreiras técnicas e operacionais foram todas derrubadas. A gente dobrou o espaço-tempo."**
- **"Depois de ver isso, você só não vai fazer teu propósito acontecer e mudar de vida se você não quiser."**
- **"Pílula vermelha"** — ver a realidade do que já é possível hoje.
- **"O segredo é o repertório."** Quem pede prompt está perdido. A IA amplifica o que você já sabe — sem repertório pra avaliar o output, não adianta.
- **"Substituir handoffs, não pessoas."**
- Na mentoria, **entrega pronto**: squad de edição de vídeo, squad de lançamento pago, squad criador de squads, o clone do Euriler. "O valor fica no contexto e no repertório."

---

## Como o expert faz tráfego com IA (demonstração ao vivo)

Exemplo de área operacional rodando no sistema — o **squad de tráfego** (Tráfego Arcane):

- **Conexão:** token de API da Meta (criar app na Meta → system user → atribuir ativos → gerar token → entregar pro Claude Code). O squad guia o aluno a configurar a BM.
- **Uso no dia a dia:** *"Bom dia, como estão minhas campanhas hoje e nos últimos dias, e os melhores anúncios?"* → o squad puxa tudo, monta o relatório, identifica os top criativos. Sem abrir o gerenciador.
- **Tem metodologia, não só dados:** sugere e sabe o que fazer (regras + processos). O **estrategista** (agente dentro do squad) pensa junto — ex: "hoje é *noise*, não *sinal*; é domingo, muda o comportamento; teu CPA de 7 dias está com folga vs a estrela-guia (meta). Hoje, zero ação operacional."
- **Nunca automático em decisão de dinheiro:** "Mexe com meu dinheiro, então eu **mando e julgo**. Ele aperta os botões, sugere, faz — mas eu vejo o que entra e o que sai." Dá pra subir/pausar campanha e anúncio por conversa (subiu 18 anúncios + 3 campanhas mandando tudo de uma vez, deixou rodando à noite, conferiu depois).
- **Multi-squad:** 10+ squads trabalhando ao mesmo tempo (um disparando, outro analisando tráfego, outro subindo anúncio).

## A jornada de 90 dias (as 4 fases PMI)

Como o aluno organiza a entrada no sistema. PMI = **Propósito + Marketing + IA**. Roda no Claude Code **ou** no Codex.

- **Fase 0 — Ambientação:** integrar a IA no dia a dia, instalar o Claude Code, rodar os primeiros squads. "É novo, mas não é difícil — tem método e passo a passo."
- **Fase 1 — Fundação do negócio:** propósito, promessa, nicho/mercado, público/persona, metodologia, esteira de produtos, primeiro produto. *Marco: saber quem você é + ter um produto pronto pra vender.*
- **Fase 2 — Base operacional:** dados com segurança, plataforma de venda/checkout, área de membros, conta de anúncios, toda a infra conectada no Claude Code. *Marco: a casa arrumada pra receber dinheiro.*
- **Fase 3 (dias 43-90) — Lançar pro mundo:** posicionamento digital, escolher o método de vendas (lançamento pago, funil, sessão estratégica), executar o funil com IA, conteúdo orgânico. *Marco: propósito materializado.*

## Erros comuns / armadilhas que ele corrige ao vivo

- Usar `@` pra chamar agente → **é sempre barra (`/`)**.
- Achar que precisa do sistema operacional pra ter skills → não: skill funciona no Claude Code cru; o sistema só organiza.
- Querer instalar tudo num fim de semana → instalação é guiada e leva tempo; na mentoria tem passo a passo garantido.
- Misturar domínios num squad → squad nichado performa melhor.
- Achar que vai "corromper o PC" com um comando → não é fácil; o Claude pede confirmação nas ações.

---

*Fonte: Workshop NDF 23-24/mai/2026 (Dia 2). Termos de transcrição normalizados (Auroq, Z-API, ManyChat, Playwright). Captura a voz e a didática do Euriler. Cobre: níveis N1-N4, 3 camadas do Claude Code, metáfora da casa, conceitos (squad/superagente/companion), infra que substitui, tráfego com IA e a jornada de 90 dias (4 fases PMI).*
