# Suas Customizações — Sobrevivem a Updates

> Este arquivo é SEU. O update do Auroq OS (e do Pack Arcane) **nunca** sobrescreve ele.
> Tudo que você quer que valha pra sempre — regras de comportamento, preferências,
> overrides — escreve AQUI, não no CLAUDE.md nem nas outras rules.

## Por que aqui e não no CLAUDE.md?

O `CLAUDE.md` e as outras rules (`agent-authority.md`, `natural-language-first.md`, etc.)
são **framework** — toda atualização do Auroq atualiza elas pra trazer melhorias. Se você
editar uma delas direto, sua mudança é perdida no próximo update.

Este arquivo (`custom-do-aluno.md`) e o `settings.local.json` são os únicos lugares de
config que o update **preserva**. Coloque suas regras aqui.

## Como escrever uma regra

Linguagem natural, direto. O Auroq carrega este arquivo automaticamente junto com as
outras rules. Exemplos:

- "Quando eu pedir pra rodar algo, executa direto sem ficar pedindo confirmação a cada passo."
- "Nunca commita sem eu mandar."
- "Responde sempre em português, casual."

## Suas regras

<!-- Escreva abaixo. Apague estes exemplos quando colocar as suas. -->

### Gestor de Infra: uma pasta só

- `/techOps` e `/gestor-infra-arcane` são o MESMO agente. A pasta canônica é `agents/gestor-infra-arcane/` (vault, regras, playbook e Mission Log reais). Os dois atalhos (`.claude/commands/techOps.md`, `.claude/commands/gestor-infra-arcane.md` e os espelhos em `.agents/skills/source-command-*`) apontam pra ela.
- Atualização do Pack Arcane costuma recriar `agents/gestor-infra/` (cópia de fábrica, vault vazio) e repontar o `/techOps` pra lá — já aconteceu em 14/08/2026. Depois de qualquer update do Pack, conferir: se o `/techOps` voltou a apontar pra `agents/gestor-infra/`, repontar pra `agents/gestor-infra-arcane/` e remover a cópia de fábrica (antes, comparar se ela trouxe SOP/regra nova que valha mesclar na canônica).
- Nunca registrar credencial, missão ou SOP em `agents/gestor-infra/`.

### Análise junto não é ordem de editar

- Quando a Karol faz pergunta ou aponta algo pra discutir ("não teria que ser…?", "o que acha?"), responder com a análise e parar: não editar arquivo, página ou banco até ela pedir a mudança. Ela está pensando junto, e edição antecipada atropela a conversa (22-23/10, Canvas do Tasso).

### Edição de vídeo: liberar RAM antes

- O PC tem 16 GB de RAM e o disco sobra (365 GB livres em 23/10/2026): o "sem memória" na edição de vídeo é RAM, não espaço. Não resolver apagando arquivo.
- Antes de qualquer edição de vídeo (squads de edição, transcrição, render): conferir a RAM livre e fechar o app do ChatGPT e o Edge (`msedge`; nunca `msedgewebview2`, que outros apps usam), sem perguntar. Não mexer no Linux do Windows (WSL), onde o Hermes do WhatsApp roda.
- Em seguida, pedir à Karol em uma linha pra deixar só as abas do Chrome que ela precisa, e só então começar a edição.
- Headline dos Reels: caixa preta com letra branca e só a palavra-chave em laranja, nunca a caixa toda laranja (ela não gostou, 25/10).
- Glowup: tentar 2 vezes, em primeiro plano. Se travar nas duas, seguir sem glow e avisar na entrega, sem esperar o ok dela (ela deixa a edição rodando sozinha, 24/10).

### Lives semanais

- O Expert em Lives só escreve o roteiro: slides e PDF da live são de outro squad, nunca montar no mesmo trabalho (Karol, 25/10).
- O spoiler do pitch vai na metade da live, como no ETL do Funil de Zoom (VOL-conteudo 11.4), nunca no Acordo (Karol, 25/10).
- Não citar a Black (lista esgotada, resultado, "hora errada") em live nem conteúdo: ninguém precisa saber do resultado dela (Karol, 25/10).

### Conceitos do Expert360º

- Definir termo do método (urgência oculta, dores, desejos…) pelo jeito da Karol, não por material de terceiros como o Stories 10x. Urgência oculta = os medos que tiram o sono da persona, que ela não conta pra ninguém, esconde e tenta fugir. Em material de captação (ex.: quiz da Live 35), cada pergunta leva o exemplo mais forte do dossiê da Laura, pra quem responde se reconhecer como a persona da Karol (Karol, 26/10).
