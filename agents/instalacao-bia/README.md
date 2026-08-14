# Squad Instalação da Bia

Conduz um aluno da Mentoria Arcane (expert, não-dev) a instalar a **Bia** — sua agente de atendimento no WhatsApp via Meta Cloud API — na própria infra, do zero ao smoke test. Entrega: uma Bia **viva**, com a personalidade dele e handoff humano via Chatwoot.

## Ativação

```
/instalacaoBia
```

O `bia-chief` te recebe, confirma os pré-requisitos e conduz a jornada.

## Pré-requisitos (você chega com isso pronto)

- **API oficial Meta** (Cloud API) configurada e funcional — de um step anterior da mentoria
- **Infra-base de pé:** servidor com **n8n** + **Supabase**, num **domínio com SSL** (proxy reverso)

Sem os dois, a instalação não começa (gate QG-IB-000). O **Chatwoot não é pré-requisito** — é exclusivo da Bia, então o squad **instala** ele logo no começo (Passo 0.5, com o Preparador).

## A jornada — 4 estações (passos do INSTALL)

| Bloco | Estação | O que faz |
|-------|---------|-----------|
| Passos 0.5,1,3,4 | **Preparador** | Sobe o Chatwoot · migrations Supabase · inbox Chatwoot · 5 credentials n8n |
| Passos 5,6 | **Construtor** | Importar + ajustar os 4 workflows · customizar e injetar os prompts (a alma) |
| Passos 5.4-5.5,7 | **Conector** | Abrir as 2 portas (webhook Meta + Chatwoot) · ativar · template |
| Passo 8 | **Doutor** | Smoke test e2e · diagnosticar e consertar |

Cada bloco fecha num **quality gate** (QG-IB-001..004). O Chief só libera o próximo quando o anterior valida — você não acumula erro pra descobrir no fim.

## Os 5 agentes

| Agente | Papel |
|--------|-------|
| `bia-chief` | Guia/maestro + consultor permanente (rosto único; tira dúvidas sobre a Bia) |
| `preparador` | Passos 0.5,1,3,4 |
| `construtor` | Passos 5,6 |
| `conector` | Passos 5.4-5.5,7 |
| `doutor` | Passo 8 |

## Estrutura

```
instalacao-bia/
├── squad.yaml          # manifest + 5 quality gates
├── README.md
├── BLUEPRINT.md        # design completo (referência)
├── agents/             # os 5 agentes
├── tasks/              # start + 4 estações (formato 8 campos)
├── workflows/          # wf-instalacao-bia.yaml (a jornada)
├── knowledge/          # como a Bia funciona, 4 camadas, runbook da ponte, instalar Chatwoot
└── data/kit/           # o kit técnico embarcado (migrations, workflows, prompts, docs, chatwoot/)
```

## Escopo

Instala o **pipeline base + handoff** (4 workflows). Recuperação automática, boas-vindas pós-compra e disparo em massa **não fazem parte** — são kits futuros (kit-recovery, kit-compras-hotmart, kit-dispatcher).

## Autocontido

Tudo o que o squad precisa está dentro dele (`data/kit/`, `knowledge/`). Roda na mão do aluno, fora do repo original. Os workflows do kit usam **placeholders** — o aluno preenche com os dados dele (ver `data/kit/SUBSTITUICOES.md`).

---

*Squad Auroq · Mentoria Arcane · forjado com Squad Forge*
