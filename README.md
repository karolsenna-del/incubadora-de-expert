# Auroq OS — Sistema Operacional de IA para Experts

Transforma o Claude Code num centro de comando inteligente para operar seu negocio digital.

**Pensar. Fazer. Lembrar.** Tudo com IA.

## Instalacao

### Pre-requisitos
- Mac com Apple Silicon (recomendado)
- Node.js 22+
- Git
- Claude Code (plano Max recomendado)

### Setup

```bash
# 1. Crie uma pasta pro seu negocio
mkdir meu-negocio && cd meu-negocio

# 2. Instale o Auroq OS (gate: email + senha da Mentoria Arcane)
npx auroq-os init

# 3. Abra o Claude Code
claude

# 4. Ative o Companion
/companion
```

> **Acesso exclusivo para alunos da Mentoria Arcane.** O `init` pede o mesmo email + senha
> que voce usa em [mentoria-arcane.vercel.app](https://mentoria-arcane.vercel.app).
> A sessao fica salva em `~/.arcane/credentials.json` e renova automaticamente.

### Comandos de sessao

| Comando | O que faz |
|---------|-----------|
| `auroq-os init` | Instala o Auroq OS (exige login na primeira vez) |
| `auroq-os login` | Forca novo login (substitui credencial atual) |
| `auroq-os logout` | Encerra sessao local (remove `~/.arcane/credentials.json`) |
| `auroq-os whoami` | Mostra usuario autenticado e status de acesso |

## Estrutura

```
business/           → Sua empresa (campanhas, processos, agentes)
docs/knowledge/     → Biblioteca ETL (sua mente, seu negocio, conhecimento)
agents/             → Seu exercito (companion, workers, minds, squads)
.claude/            → Ponte Claude Code (agentes, rules, hooks)
.auroq-core/        → Framework (nao modificar)
```

## Agentes Core

| Agente | Comando | O que faz |
|--------|---------|-----------|
| Companion | `/companion` | Parceiro cognitivo. Situa, lembra, pensa junto |
| Ops | `/AuroqOS:agents:ops` | Git, deploy, ambiente, install |
| Organizer | `/organizer` | Organizacao, guarda documentos, limpeza, backup |

### Meta Squads (criadores de agentes)

| Squad | Comando | O que faz |
|-------|---------|-----------|
| Squad Forge | `/squad-forge` | Cria squads multi-agente a partir dos seus processos |
| Mind Forge | `/mind-forge` | Fabrica mentes sinteticas e consultores |
| Worker Forge | `/worker-forge` | Cria workers especializados |
| Clone Forge | `/clone-forge` | Clona mentes reais em agentes digitais |
| ETLmaker | `/etlmaker` | Extrai conhecimento de fontes brutas e estrutura em KBs |

## Primeiro uso

1. Ative o Companion (`/companion`)
2. Preencha os templates em `docs/knowledge/expert-mind/` (quem voce e)
3. Preencha `docs/knowledge/expert-business/` (o que voce faz)
4. Pronto — o sistema ja te conhece

## Filosofia

- **Repertorio + IA = Resultado**
- Expert manda e julga. IA executa
- Tudo documentado. Nada se perde
- Evolucao incremental. Nunca do zero
- Pain-first. Resolve a dor de agora

---

*Auroq OS v1.3.0 — by Euriler Jube / Arka*
