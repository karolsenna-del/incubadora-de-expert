# Bootstrap 3 — Configuracoes Avancadas

> Squad da fase **Turbinando** da Mentoria Arcane. Conduz o aluno (expert, nao-dev)
> a montar a infra avancada do negocio: servidor proprio, banco de dados unificado
> e automacoes essenciais. Ativacao: `/bootstrap3`

## O que entrega

Ao final, o aluno tem uma **maquina de operacao 24/7**:

- **FASE 0 — Servidor:** Hetzner (cx23, ~€6,49/mes — checar valor vigente; o CX22 foi descontinuado) provisionado **via API pelo Claude Code** — Docker (cloud-init) + Traefik (SSL Let's Encrypt) + n8n queue mode + DNS no Cloudflare. Sem EasyPanel, sem painel: o aluno gera 1 token e confirma o dominio, o Claude monta o resto
- **FASE 1 — Banco unificado:** core no Supabase com a logica centralizada da Arka — `pessoas` (hub de identidade por email) + `capturas` (leads, append-only) + `compras` (ledger, append-only)
- **FASE 2 — Automacoes essenciais:** Z-API conectado (canal WhatsApp pre-Bia) + compras/onboarding automatico + dispatcher de disparos (grupo e individual) + recovery de vendas

## Por que existe

Na jornada da plataforma, o aluno chega no Turbinando depois de Fundacao/Base
Operacional/Propulsao. Ele ja viu a operacao do Euriler rodando conectada — agora
monta a dele. Os bootstraps 1 e 2 (do Ops, no `auroq-os`) conectam *servicos*;
o Bootstrap 3 constroi *infra* — por isso e squad com pipeline em fases, gates
bloqueantes e tracker persistido (multi-sessao).

## Posicao na jornada

```
bootstrap 1 (Ops)  →  núcleo: Claude Code, GitHub, Vercel, Supabase, cofre
bootstrap 2 (Ops)  →  extras opcionais: 1Password, Cloudflare, Drive...
bootstrap 3 (ESTE) →  Turbinando: servidor + banco unificado + automacoes
/instalacaoBia     →  a Bia — REUSA o servidor e o n8n montados aqui
```

## Agentes

| Agente | Papel |
|---|---|
| `b3-chief` | Guia unico do aluno. Orquestra as fases, guarda os gates, dono do tracker, consultor permanente |
| `operador-infra` | FASE 0 — servidor Hetzner + n8n no ar |
| `operador-banco` | FASE 1 — schema core no Supabase do aluno |
| `operador-automacoes` | FASE 2 — Z-API + 3 automacoes essenciais |

## Tracker (multi-sessao)

Estado vive no repo do aluno: `business/infra/bootstrap3-tracker.md`
(criado do template `data/tracker-template.md` na primeira ativacao).
O aluno pode parar em qualquer fase e voltar dias depois — o chief le o
tracker e retoma de onde parou.

## Estrutura

```
agents/bootstrap-3/
├── squad.yaml
├── PLANO-CORRECAO-v1.1.md  # correcoes da 1a execucao real (origem das regras operacionais)
├── agents/            # b3-chief + 3 operadores
├── tasks/             # start + 1 task por fase
├── workflows/         # wf-bootstrap-3.yaml (pipeline com gates)
├── data/
│   ├── tracker-template.md
│   └── kit/
│       ├── fase-0/    # setup servidor (playbook Hetzner+n8n)
│       ├── fase-1/    # esquema core + migrations SQL
│       └── fase-2/    # Z-API + specs das 3 automacoes (SQL embutido)
└── knowledge/         # banco-unificado-logica.md (consultoria do chief)
                       # principios-operacionais.md (regras transversais — cofre, versoes atuais, MCP, Publish)
```

## Regras herdadas (inegociaveis)

- Uma coisa por vez, linguagem de leigo, operador FAZ / aluno aprova
- Gate BLOCKING: nunca dizer "configurado" sem teste real
- **Token/credencial NUNCA no chat** — vai direto pro cofre, agente prepara a linha, aluno cola o valor
- Custo sempre honesto ANTES (Hetzner ~€6,49/mes — checar valor vigente, Z-API ~R$100/mes)
- **Anti-ban e lei** na Fase 2 (Z-API = numero comum; regras de intervalo/limite embarcadas)
