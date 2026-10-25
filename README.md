# Auroq OS — Sistema Operacional de IA para o negócio do aluno

Transforma Claude Code, Codex CLI ou Grok Build num centro de comando inteligente para operar seu negocio digital.

**Pensar. Fazer. Lembrar.** Tudo com IA.

## Instalacao

### Pre-requisitos
- Mac com Apple Silicon (recomendado)
- Node.js 22+
- Git
- Claude Code, Codex CLI ou Grok Build (um deles basta)

### Setup

Cole **um endereco** no terminal (o de dentro do Claude Code ou do Codex serve).
Ele instala o Git, o motor do sistema, faz o login da mentoria, cria a pasta do seu
negocio e monta tudo — sem senha e sem voce baixar nada na mao:

```bash
# Mac
curl -fsSL https://arka.education/install.sh | bash

# Windows (PowerShell, sem Administrador)
irm https://arka.education/install.ps1 | iex
```

Depois, **feche e abra** o Claude Code ou o Codex — senao ele nao enxerga o que
acabou de ser instalado.

O caminho manual antigo foi aposentado. Use a instalacao guiada acima. Em negocio existente, peca ao Ops "atualiza o sistema" (no Claude Code ou no Codex). Os agentes e squads chegam pelo MCP, sem instalacao ou atualizacao de Pack.


> **Grok:** nao precisa de `sync:codex`. Ele descobre `.claude/commands/`,
> `.claude/rules/` e `AGENTS.md` sozinho. Use Claude/Grok com slash commands;
> use Codex com `$nome` apos o sync de skills.

> **Acesso exclusivo para alunos da Mentoria Arcane.** O instalador pede o mesmo email + senha
> que voce usa em [mentoria-arcane.vercel.app](https://mentoria-arcane.vercel.app).
> A sessao fica salva em `~/.arcane/credentials.json` e renova automaticamente.

### Comandos de sessao

| Comando | O que faz |
|---------|-----------|
| `auroq-os manutencao` | Manutencao do motor no negocio existente; conteudo vem pelo MCP. **Caminho normal: pedir ao Ops "atualiza o sistema"** — ele roda `manutencao --agente` (sem perguntas; ultima linha `AUROQ_RESULTADO ...`). Rodar no terminal e so reserva |
| `auroq-os clone` | Continua o SEU negocio em outra maquina (ou na maquina de um colaborador) — baixa tudo do GitHub, ja instalado |
| `auroq-os fix-gitignore` | Garante as protecoes de segredo no .gitignore (vault, .env, midia) e destraqueia segredos versionados |
| `auroq-os login` | Forca novo login (substitui credencial atual) |
| `auroq-os logout` | Encerra sessao local (remove `~/.arcane/credentials.json`) |
| `auroq-os whoami` | Mostra usuario autenticado e status de acesso |
| `auroq-os doctor` | Diagnostico do suporte: arquivos, motor do sistema (e se o programa aberto pelo icone enxerga ele), registro do conteudo ao vivo, login e servidor |
| `auroq-os register-mcp` | Reescreve o registro do conteudo ao vivo no projeto (use se o `doctor` apontar que ele falta) |
| `auroq-os sync-codex` | Regenera e verifica as skills locais do Codex |
| `auroq-os conectar-1password` | Liga o 1Password ao Auroq sozinho (Mac/Windows): instala o `op` se faltar, cria o cofre `Claude` e uma conta de servico que so enxerga esse cofre (sem data de validade), guarda a chave no computador e testa. Voce so aprova no app do 1Password. O Ops roda isto por voce (`--agente`). Opcoes: `--conta "<e-mail>"` (escolhe a conta quando o app tem mais de uma), `--rotacionar` (cria uma chave nova), `--estado` (mostra em que etapa voce parou, sem falar com o 1Password; com `--agente` imprime a linha `AUROQ_ESTADO ...`). Pode ser retomado a qualquer hora: ele reconfere cada etapa e continua de onde parou. O Companion roda isto sozinho quando falta o cofre (skill `conectar-cofre`, que pergunta qual cofre) |
| `auroq-os conectar-cofre` | Escolhe e liga o cofre de senhas: **1Password** (pago, uns US$ 3 por mes, confira o preco na tela, recomendado; preenche senha no navegador) ou **Infisical** (gratis, so guarda as chaves que o agente usa). Opcoes: `--cofre 1password\|infisical` (sem ela, pergunta qual), `--regiao us\|eu` (Infisical), `--estado` (em que etapa voce parou, sem falar com o cofre; com `--agente` imprime a linha `AUROQ_ESTADO ...`), `--rotacionar` (chave nova) e `--migrar` (passa as chaves do Infisical para o 1Password, sem apagar nada; so depois que todas passaram o 1Password vira o cofre ativo, e `--ignorar-fora-do-formato` deixa no Infisical as chaves com nome que o Auroq nao usa). Ligar o 1Password sozinho nao troca o cofre de quem ja usa o Infisical; ligar o Infisical com o 1Password ativo troca, e as chaves do 1Password nao sao levadas (continuam la, `segredo ler NOME --cofre 1password`). O Ops e o Companion rodam isto por voce (`--agente`) |
| `auroq-os segredo` | Le e guarda credenciais no cofre que voce escolheu, igual nos dois: `segredo ler\|gravar\|listar\|apagar\|qual <referencia>`. O valor de `gravar` entra por stdin, nunca como argumento; `ler` imprime o valor, entao use sempre dentro do comando que o usa (`X="$(auroq-os segredo ler Item/campo)" && comando "$X"`), nunca sozinho; a referencia e `op://Claude/<Item>/<campo>` ou `cofre://<Item>/<campo>`. Com 1Password, `op read` direto continua valendo. Squads, skills e agentes usam este comando |

> **Um cofre de senhas e obrigatorio** para guardar credenciais: senha, token e chave nunca ficam em arquivo do
> projeto. Em `business/vault/` fica so o status e a referencia `op://...`, nunca o valor. Voce escolhe:
>
> - **1Password (recomendado, pago).** Quem nao tem e guiado pelo Ops (ou pelo Companion) a criar a conta (teste
>   gratis de 14 dias, sem cartao; o plano Individual custa ~US$ 2,99 a 3,99/mes, confira o preco na tela). Voce so
>   (1) cria a conta, (2) instala o app, (3) liga "Integrar com a CLI do 1Password" em Configuracoes >
>   Desenvolvedor e (4) aprova com a digital (Mac) ou o Windows Hello. O resto o Ops faz. Preenche senha no
>   navegador.
> - **Infisical (gratis).** Para quem nao quer gastar nem 1 real. Voce so (1) cria a conta em
>   https://app.infisical.com/signup (plano gratis; **nao** clique em "Start a free trial", que e o teste dos
>   planos pagos e pede cartao) e (2) aprova o login que abre no navegador. O resto o Ops faz. Nao e tao bom: **nao
>   preenche senha no navegador**, so guarda as chaves que o agente usa. Plano gratis (confira os limites na tela):
>   5 vagas (voce e o agente Auroq; um segundo computador ganha chave nova mas nao gasta vaga), sem historico de versoes e sem registro de auditoria. Os termos do
>   Infisical falam em uso profissional e o gratis pode mudar. Se um dia assinar o 1Password, `conectar-cofre
>   --migrar` leva as chaves para la.
>
> Nao existe cofre de valores guardado em arquivo no computador, em nenhuma das duas rotas.

> **Seguranca da chave 1Password:** o comando cria sozinho o cofre `Claude` e a conta de servico, e essa
> chave **so enxerga o cofre `Claude`** (leitura e escrita), nunca suas senhas pessoais, de banco ou da empresa.
> Ela nao expira. A chave fica salva no computador e qualquer programa seu consegue usa-la; por isso o cofre
> `Claude` deve ter so o que o Auroq precisa. Em conta de empresa (Teams/Business), em geral so o dono ou
> administrador cria conta de servico. Se um dia quiser trocar a chave, rode com `--rotacionar` e revogue a
> antiga em 1password.com > Developer > Service accounts. Plano B escondido: `--manual`, para quem prefere
> criar a conta de servico na mao e copiar o token (Cmd+C / Ctrl+C), sem colar em lugar nenhum: o comando le da
> area de transferencia e a limpa depois.

> **Seguranca da chave do Infisical:** o comando cria sozinho o projeto `Auroq` e uma chave do agente que **so
> enxerga esse projeto** (leitura e escrita), sem data de validade. Ela fica salva no computador (arquivo so seu no
> Mac, variavel do usuario no Windows) e qualquer programa seu consegue usa-la; por isso o projeto deve ter so o que
> o Auroq precisa. Para trocar, rode com `--rotacionar` (depois do teste ele revoga as chaves antigas deste
> computador, reconhecido por um codigo proprio e nao pelo nome, e tambem a chave que este computador usa agora;
> se a revogacao falhar, ou se ele nao achar nenhuma chave antiga para revogar, avisa que a chave antiga ainda vale
> e que voce deve apaga-la no painel do Infisical). A sessao do seu login no Infisical so existe durante a conexao e e encerrada no fim. A chave nunca
> passa pela conversa.

Dentro do projeto instalado, os mesmos checks ficam disponiveis como
`npm run auroq:sync:codex`, `npm run auroq:sync:codex:check` e
`npm run auroq:validate`. O instalador adiciona esses scripts sem sobrescrever
os comandos existentes do seu negocio.

### Segunda maquina (ou colaborador)

O Auroq nao mora no computador — mora no GitHub. Pra trabalhar em outra maquina,
**nao instale de novo**: clone o que ja existe.

```bash
# na maquina nova (Claude Code instalado e logado)
npx auroq-os clone          # lista seus repos do GitHub e baixa o negocio inteiro
cd meu-negocio
claude
/AuroqOS:agents:ops
*conectar-cofre            # 1Password: reaproveita a chave que ja existe no seu cofre (uma vez so nesta maquina; so aprovar no app). Infisical gratis: cria uma chave nova so para esta maquina (voce aprova o login no navegador). Antes, ele pergunta qual cofre voce usa
*conectar-1password        # atalho antigo, so para o 1Password
```

Ritual diario em toda maquina: **abriu o `claude` → o sistema puxa sozinho o que mudou · terminou → diga "salva e entrega"** (qualquer agente executa o ritual do Ops; `*sync`/`*commit`/`*push` seguem como atalhos).
Colaborador usa conta propria de tudo (GitHub via convite, assinatura Claude propria,
cofre 1Password ou Infisical com escopo) — nunca a senha do dono. **Colaborador nao precisa ser
aluno**: o acesso dele e o convite do GitHub (o `clone` nao pede login); quem atualiza
o sistema e o dono, e o colaborador recebe as atualizacoes automaticamente ao abrir o `claude`.

## Conteudo ao vivo

O Auroq OS tem duas partes:

- **Motor** (mora no seu computador): a estrutura de pastas, o git, os comandos e as regras.
  E o que o instalador monta e o que o `*manutencao` atualiza.
- **Conteudo** (chega ao vivo): o cerebro dos agentes — Companion, Consultor, forjas e o
  Pack Arcane — e servido em tempo real pelo servidor da mentoria, atraves de uma conexao
  chamada MCP `arcane`. O instalador ja registra essa conexao no projeto; voce nao precisa
  configurar nada.

Na pratica: melhorias de conteudo chegam pra voce **sozinhas**, sem atualizar nada.
So e preciso estar logado (mesmo email e senha da plataforma) e com o contrato ativo.
Se um agente nao responder, rode `npx auroq-os doctor` — ele confere a conexao, o login
e o servidor, e diz exatamente o que fazer.

## Atualizar o sistema

De tempos em tempos sai versao nova do **motor** ou da **conexao** (novos comandos,
correcoes). Voce nao precisa vigiar nada: quando existe versao nova, o proprio sistema
avisa — ao usar um squad ou agente do conteudo ao vivo e ao abrir o Claude Code no seu
projeto — e pergunta se voce quer atualizar.

Pra atualizar, e uma frase — dentro do Claude Code ou do Codex, com o Ops ativo
(`/AuroqOS:agents:ops` ou `$ops`), ou respondendo "sim" ao aviso:

```
atualiza o sistema
```

Voce nao abre terminal nem digita comando: o Ops salva um ponto de restauracao (commit)
se houver trabalho seu pendente, roda a manutencao e diz se precisa fechar e abrir o
aplicativo. Se o login da plataforma tiver expirado, abre uma janela "Login Arcane" pra
voce digitar o e-mail e a senha (nunca no chat). **Seus dados nunca sao tocados**:
memoria do Companion, documentos, cockpit, campanhas, squads que voce criou,
personalizacoes e as suas permissoes do Claude Code ficam exatamente como estavam.
O que se atualiza e so o framework.

Reserva, so se o Ops nao abrir: na pasta do negocio, `npx -y auroq-os@latest manutencao`
(Windows: `npx.cmd`).

O historico do que mudou em cada versao fica no arquivo `CHANGELOG.md`, dentro do
proprio pacote.

## Historico de uso (AHI)

`auroq-os historico status` mostra captura comprovada, fila pendente, ultimo ACK,
exclusoes e problemas. O registro das sessoes com os squads da Arcane esta previsto
nos Termos de Uso e na Politica de Privacidade da plataforma: vem ligado para quem
aceita os termos (aviso na plataforma) e so acontece quando a sessao usa o MCP Arcane
com conta autenticada e licenca validada pelo servidor. Quem ja tinha dito "nao"
continua sem gravar: aceitar os termos nao desfaz essa recusa. Para desligar, entre
em Minha Conta (arcane.arka.education/conta) e desligue "Guardar minhas conversas",
ou peca ao proprio agente (ele registra o "nao"). Religar so pela plataforma. Se a
pasta do seu negocio tem dados de clientes, desligue. Para pedir a exclusao do que ja
foi guardado, use os comandos de exclusao abaixo ou o e-mail euriler@arka.education.
Nao e preciso desligar o MCP nem os hooks. Instalar ou apenas abrir o projeto nao
prova captura.

O adaptador `ahi-hooks-v2` registra mensagens e entradas/saidas de ferramentas
que os hooks visiveis do Claude Code/Codex disponibilizam. A cobertura e parcial:
nao le raciocinio interno, transcripts globais, respostas intermediarias ausentes
nos hooks ou arquivos binarios. O Codex exige uma versao com hooks nativos e o
projeto precisa ter a confianca que o proprio host exige; o instalador nao altera
essa confianca. Grok e hosts sem esses hooks nao tem captura comprovada.

Na validacao desta versao, o Codex CLI 0.154.0 passou tres turnos completos e uma
resposta apos 125 s de espera. No Claude Code 2.1.270, a prova nativa chegou apenas
a `SessionStart`/`UserPromptSubmit`: o provedor recusou a execucao antes do MCP.
Os demais eventos Claude estao cobertos pelos testes automatizados do adaptador;
a prova nativa de ponta a ponta permanece incompleta.

Antes de gravar ou enviar, o coletor filtra formatos conhecidos de credenciais,
campos sensiveis, JSON aninhado e valores opacos longos. Nenhum filtro consegue
reconhecer toda senha possivel. A fila fica fora do Git, cifrada por evento, em
`~/.arcane/ahi-v2/`, separada por conta/projeto/sessao/host. A chave privada fica
no Keychain do macOS ou protegida pelo DPAPI do Windows. Cofre indisponivel ou
sistema sem suporte deixa o historico inativo, sem impedir o uso educacional.

O envio ocorre em processo separado. Hooks de fim (`Stop`, `SubagentStop`,
`StopFailure`, `SessionEnd`) aguardam apenas a gravacao cifrada local, com prazo
curto e sem esperar rede/licenca, para o fechamento do host nao cancelar o registro.
Os demais hooks de captura executam de forma assincrona. A licenca continua sendo
renovada em segundo plano durante um turno ativo, inclusive em respostas longas.
Sem atividade real por 60 min, o turno e considerado orfao (`ACTIVE_TURN_EXPIRED`);
heartbeats nao prolongam esse prazo. Sem turno ativo, o worker encerra apos 60s
de inatividade; se houver fila com falha de envio, tenta por ate cinco minutos
sem turno ativo e preserva a fila para a proxima atividade. `SubagentStop` nao encerra o turno principal. Cada evento permanece na fila ate o ACK
duravel individual; falhas temporarias tentam novamente com espera progressiva.
A fila tem limite de 100 MiB/10.000 eventos e sete dias. Exclusoes, truncamentos,
revogacoes e corrupcao ficam explicitos no status e em eventos de cobertura.
Logs locais antigos em `.auroq/ahi/events.jsonl` nao sao importados ou alterados.

Comandos de acesso ao proprio historico:

```bash
auroq-os historico sessoes
auroq-os historico timeline --session UUID
auroq-os historico busca --query "termo"
auroq-os historico export --session UUID --arquivo
auroq-os historico excluir --session UUID --confirm-delete
```

As consultas indicam o cursor de continuacao. `export --arquivo` percorre todas
as paginas do mesmo recorte e grava um novo arquivo privado em
`~/.arcane/ahi-exports/`; uma falha nunca e apresentada como exportacao completa.
Direitos de consulta/exclusao continuam disponiveis com autenticacao mesmo sem
licenca de captura. Para apagar o historico da conta inteira, o escopo explicito
exigido e `excluir --account --confirm-delete`. Apagar o historico da conta inteira
(`excluir --account`) tambem encerra a gravacao nessa conta (marca de exclusao
permanente); para voltar a gravar, escreva para euriler@arka.education. Excluir uma
sessao nao encerra a gravacao.

A atualizacao do coletor exige a manutencao no projeto (peca ao Ops "atualiza o sistema")
e reabrir o host. O aviso de nova versao ao iniciar o Claude Code nao instala essa correcao.
A publicacao do pacote tambem nao comprova que cada aluno ja atualizou.

## Estrutura

```
business/           → Sua empresa (campanhas, processos, agentes)
docs/knowledge/     → Biblioteca ETL (sua mente, seu negocio, conhecimento)
agents/             → Seu exercito (companion, workers, minds, squads)
.claude/            → Ponte Claude Code + Grok (agentes, rules, hooks, commands)
.agents/skills/      → Ponte Codex local (skills geradas por projeto)
.auroq-core/        → Framework (nao modificar)
```

## Agentes Core

| Agente | Comando | O que faz |
|--------|---------|-----------|
| Companion | `/auroq-companion` ou `$companion` | Parceiro cognitivo. Situa, lembra, pensa junto |
| Ops | `/AuroqOS:agents:ops` ou `$ops` | Git, deploy, ambiente, install |
| Organizer | `/auroq-organizer` ou `$organizer` | Organizacao, guarda documentos, limpeza, backup |

### Meta Squads (criadores de agentes)

| Squad | Comando | O que faz |
|-------|---------|-----------|
| Squad Forge | `/auroq-squad-forge` | Cria squads multi-agente a partir dos seus processos |
| Mind Forge | `/auroq-mind-forge` | Fabrica mentes sinteticas e consultores |
| Worker Forge | `/auroq-worker-forge` | Cria workers especializados |
| Clone Forge | `/auroq-clone-forge` | Clona mentes reais em agentes digitais |
| ETLmaker | `/auroq-etlmaker` | Extrai conhecimento de fontes brutas e estrutura em KBs |

## Primeiro uso

1. Ative o Ops (`/AuroqOS:agents:ops` no Claude/Grok ou `$ops` no Codex) e peca o Bootstrap 1.
2. O Ops prepara browser oficial, Computer Use quando elegivel e Playwright como fallback, sempre com smoke test real.
3. Ative o Companion (`/auroq-companion` no Claude/Grok ou `$companion` no Codex).
4. O Companion monta o seu Mapa do Negocio (`docs/knowledge/mapa-do-negocio.md`): le o material que voce tiver,
   pergunta so o que faltou e completa o resto aos poucos (`*contexto`). Todo squad le esse resumo primeiro.
5. Pronto — o sistema ja te conhece.

## Filosofia

- **Repertorio + IA = Resultado**
- O aluno pede, confere e aprova. A IA executa
- Tudo documentado. Nada se perde
- Evolucao incremental. Nunca do zero
- Pain-first. Resolve a dor de agora

---

*Auroq OS — by Euriler Jube / Arka*


## Observabilidade e integridade do motor

Apos publicacao, `npx -y auroq-os@2.8.2 doctor` mostra a fila local segura e os comandos pinados de
manutencao/diagnostico. `npx -y auroq-os@2.8.2 manutencao` preserva o caminho existente
de consentimento legado, studentFiles, customizacoes e dados do negocio. Nao ha
migracao forcada. O registro MCP aponta para `arcane-mcp@0.7.1` — o pin mora no campo
`arcaneMcpPin` do package.json (fonte unica; o servidor le o mesmo campo no npm).
`npm run release:verify` recusa publicar com um pin que o npm nao resolva.
Os instaladores do repositorio ficam preparados para 2.8.2; as copias publicas so recebem
a versao apos os gates nativos e a verificacao do tarball publicado.
O pacote inclui `lib/runtime-integrity.json`: inventario SHA-256 gerado depois da montagem da casca, verificavel com `npm run integrity:verify` dentro do pacote extraido. Ele comprova consistencia do conteudo; nao e uma assinatura de autoria.

O CLI inicia captura antes das dependencias pesadas e registra resultado ao sair.
Eventos com identidade ja existente podem seguir pela rota autenticada na proxima
inicializacao. Shell e PowerShell gravam somente etapas/codigos em spool privado
`~/.arcane/installer-outbox`, sem ler credenciais nem conteudo pessoal; 200 slots por
formato limitam o disco antes de haver Node. Saturado, deixa de capturar. Quando Node
executa nosso CLI, ele importa/expurga o spool com TTL de sete dias, preserva proveniencia
local e jamais atribui esses eventos ao login posterior. Cada execucao do instalador
expurga sete dias e slots interrompidos sob lock; nao precisa esperar Node. Nao existe daemon. O runtime Windows falha fechado (`OUTBOX_UNAVAILABLE`), sem
ler/enviar/importar fila enquanto nao houver garantia nativa de ACL/no-follow.
O PowerShell verifica DACL nativa e conserva seus eventos locais. O spool nao substitui o install.log legado,
que nao e lido nem enviado pela telemetria nova.

Captura cobre inicio e etapas Git/motor/acesso/pasta/montagem do instalador; no CLI,
instalacao/manutencao/doctor/login/register-mcp. Bootstrap conversacional e o trabalho
final do squad nao sao inferidos como sucesso por sair do CLI ou preparar arquivos.
Antes de o script chegar ou em computador que nunca executa nosso codigo, nao ha sinal.
A rota events continua autenticada, limitada e idempotente. A plataforma deve receber
a whitelist antes de distribuir/promover os clientes; a promocao dos instaladores sincronizados depende da publicacao e verificacao da versao fixada. Nao precisa migration adicional.

O canal de adocao e o instalador oficial, o README/changelog, o doctor e o aviso de
comando aposentado quando a versao nova e executada. Isso nao atualiza silenciosamente
quem continua com o pacote antigo. Testado nesta VPS em Linux; sintaxe Bash e verificacoes
estaticas ASCII/compatibilidade PS passaram, mas Windows PS5.1 e macOS nao foram executados.
