# 05 — Como Fazer Cada Coisa no Dia a Dia

> O guia operacional: como o expert produz página, conteúdo, anúncio, vídeo e publica — dentro do sistema. O consultor usa isto pra responder "como eu faço uma página?", "como produzo conteúdo?", "como subo no ar?". Fonte: Workshop NDF 23-24/mai/2026 (Dia 2, demos ao vivo).

---

## Princípio que vale pra TUDO

> **"O Claude Code é vida. Vocês têm que sair daqui e ir pro code."** O chat (web) serve pra brincar; o trabalho de verdade é no terminal. E a régua é sempre a mesma: **quanto mais informação você dá na entrada, mais assertivo sai o output.** "Roteiro/copy é o coração de tudo."

A pergunta que ele faz pro aluno: *"Quanto tempo da sua vida você gasta fazendo coisa que a IA já faria no seu lugar — melhor e mais rápido? Escrever copy, e-mail, anúncio, editar vídeo, responder cliente, organizar agenda, gravar vídeo."*

---

## Skills: como instalar e usar

- Skill é entregue como arquivo. Instala em **Configurações → Capacidades → Habilidades → Adicionar habilidade** (upload).
- **Regra crítica:** skill nova só funciona em **chat NOVO**. Conversa antiga não enxerga a skill recém-instalada.
- Skill não precisa do sistema operacional pra rodar — funciona no Claude Code cru. O sistema só organiza as skills no mesmo ambiente.

---

## Criar uma página de vendas

São **3 etapas** (não confundir): **1) Copy → 2) Design → 3) Domínio/publicação.**

**1. Copy (o texto que vende):**
- Insumo: o relatório de **posicionamento** (do miniclone) + o de **nicho** (detetive). Faz upload no chat novo.
- Chama a ferramenta de página → ela pergunta sobre o negócio → gera a copy + estrutura de seções.
- Edita iterando na conversa: *"mexe nisso, reescreve isso, não gostei disso."*
> "É assim que eu crio página hoje: numa conversa mexendo, criando, mexendo, criando. Eu faço primeiro a copy, valido e aprovo, **depois** vou pro design."

**2. Design (o visual):**
- Quem usa o sistema cria um **design system** (identidade visual padronizada) — toda página sai já no padrão.
- Como criar: junta referências (Pinterest, sites que gosta) → **Claude Design** gera o design system. Ou: pede pro Claude Code **extrair o design system de uma página de referência** e replicar na sua.
- Sem design system: joga as referências no chat e pede pra seguir.
- Imagens: conectado a **Higgsfield** ou **GPT** — *"troca a imagem da hero por uma mulher de 30 anos com vontade de vencer"* e ele gera/coloca.

**3. Publicação:**
- Hospedagem: **Vercel** (grátis). Domínio: **Cloudflare**. Já vêm conectados no sistema.
- Comando: *"bota a página no ar no domínio X"* → no ar em segundos, sem custo de servidor.
- **Pixel de conversão:** copia o código do pixel → cola no Claude Code → *"bota o pixel na página."* Pronto.

> Antes: WordPress/Lovable, R$500/mês, lento. "Eu gastava R$500 pra fazer uma página — isso paga um mês de Claude Max que faz TUDO."

---

## Produzir conteúdo (orgânico)

O processo: **Formato → Tema → Teoria → Roteiro → Carrossel/vídeo → Postar.**

1. **Formato** — escolher um formato validado (mito vs verdade, lowfi, stories, carrossel educativo). "É uma ciência: acha um formato que funciona, replica, depois testa outros."
2. **Tema** — pesquisar ideias de tema quente/de dor pro público (a IA pesquisa).
3. **Teoria** — antes do roteiro, desenvolver a teoria: a IA faz perguntas aprofundadas pra entender o que você quer dizer (ex: pra uma médica, "que frases suas pacientes ouvem?").
4. **Roteiro** — o coração. Com o hook certo.
5. **Carrossel** — manda o roteiro + uma referência visual → o Claude Code gera o design do carrossel pronto. "Isso já tá postável — você tá pagando designer e perdendo tempo no Canva pra fazer isso."
6. **Postar** — via **Playwright** (o Instagram acha que é um humano postando). Se perguntar "você é robô?", você responde manualmente que não é e deixa o robô seguir.

> No sistema vem o **squad de produção de conteúdo** — "o jeito certo de produzir, codificado num squad."

---

## Anúncios

O trabalho: **pesquisar referências → roteirizar → gerar criativo (imagem/vídeo) → copy + variações.**

- **Pesquisa de concorrentes (a inteligência):** o Claude Code mapeia concorrentes (nome, Instagram), coleta os anúncios, transcreve e estuda. *"Se o concorrente está anunciando há mais tempo e botando mais dinheiro, é porque está funcionando."*
- **Máquina de anúncios** (skill/squad): gera anúncios por nível de consciência (baixa/média/alta) + roteiro de vídeo vertical, baseado nos melhores anúncios do Euriler.
- Sobe na conta via o **squad de tráfego** (ver `04`).

---

## Vídeo

Três frentes, todas no sistema:

**1. Editar vídeo (squad de edição):** transcreve, baixa, **corta a respiração** (fino, entre cada fala), **acelera 1.2x (20%)**, põe **legenda** (estilo que você mandar), corte de **zoom in/out**, **trilha sonora**. Dica pra gravar: **frase a frase**, com roteiro, sem errar (a IA transcreve exato).

**2. Clone de vídeo (Runway via MCP):** grava 15-20s de selfie → treina um clone → gera dezenas de anúncios com a sua cara, modelos e roupas diferentes. "Mando o squad de anúncio produzir 50 anúncios numa noite."

**3. Vídeo UGC/GC com avatar (Higgsfield via MCP):** o formato GC (terceira pessoa/depoimento) funciona muito pra lançamento. Define o avatar (idade, classe, realidade do público) → 3 opções pra aprovar → roteiro → vídeo. "Deixa a noite inteira ele fazendo vários."

---

## Como tudo se conecta (MCP)

**MCP** (Model Context Protocol) conecta ferramentas direto no Claude Code, sem precisar de squad — "mais fluido". É assim que Runway, Higgsfield, Z-API, Meta, etc. ficam acessíveis. "É tudo conectado — a mágica. Eu sou uma pessoa só pra fazer meu negócio acontecer, então automatizo tudo."

> Setup: o **Ops** é o primeiro agente que o aluno chama. Ele configura o Claude Code e conecta Playwright, Vercel, Google Drive, e-mail — deixa tudo pronto pra trabalhar igual ao sistema do Euriler.

---

## Squads que vêm prontos no ecossistema (referência)

Tráfego · Lançamento pago · Low ticket · Produção de conteúdo · Edição de vídeo · Produção de anúncios · Clone de vídeo · Carrossel · Slide · Página · Posicionamento digital · Gestão de infra. Mais as 4 Forjas + ETLmaker pra criar os seus (ver `03`).

---

*Fonte: Workshop NDF 23-24/mai/2026 (Dia 2, tarde — demos ao vivo, processadas com verbatim). Termos normalizados (Auroq, Claude Code, Higgsfield, Runway, Z-API, Vercel, Cloudflare). Foco: o "como faço" operacional, na voz do Euriler.*
