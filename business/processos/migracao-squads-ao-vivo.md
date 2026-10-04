# Migração dos squads da Arcane pra versão ao vivo (MCP)

> Documento de trabalho. Iniciado em 04/10/2026 (Clone Euriler → Ops). Decisão da Karol: fazer em 2 etapas.

## Por quê

Desde a v2.6.6 do Auroq, o método dos squads da Arcane chega ao vivo pelo MCP `arcane`. A manutenção (`npx auroq-os manutencao`) NÃO troca atalhos antigos: trata como personalizados. Os atalhos em `.claude/commands/` continuavam lendo a cópia local (instalada em maio/junho). A versão ao vivo é de 19/09 (Edição: 25/09).

## Etapa 1 — FEITA (04/10)

Atalhos trocados pro formato ao vivo (backup dos antigos ficou no scratchpad da sessão; o histórico do git também guarda):

| Atalho | recurso_id |
|---|---|
| `/squad-anuncios-arcane` | squad-anuncios-arcane |
| `/squad-heygen-arcane` | squad-heygen-arcane |
| `/squad-iavideos-arcane` | squad-iavideos-arcane |
| `/squad-low-ticket-arcane` | squad-low-ticket-arcane (com passo `preparar-execucao`) |
| `/squad-lpago-arcane` | squad-lpago-arcane (igual a `/squadLPagoArcane`) |
| `/euriler` | euriler-mentor-clone-v4 |

Testado: Clone v4 ativa pelo MCP; `preparar-execucao` do Low Ticket responde.

## Etapa 2 — PENDENTE

Squads com ajustes da Karol (não trocar o atalho a seco):

- **Conteúdo** — `data/config.yaml` (7 slides / 1.700 caracteres), `tasks/gerar-laminas-carrossel.md` (pipeline pro Instagram), bancos de ganchos e `vocabulario-palavras-gatilho.md`, `metricas-diagnostico.md`.
- **Carrossel** — `tasks/produce-carousel.md`, `tools/build-carousel.mjs`, `tools/build-tipografico.mjs` (exclusivo da Karol), `tools/render.sh` (fix nuvem/Windows), `templates-base/story-texto/`. Templates card-tweet ficam em `~/.carrossel-arcane/` (fora do repo).
- **Tráfego** (`/trafegoArcane`), **Posicionamento** (pasta `work/` com clientes), **Edição** (dicionário de nomes do Clip Expert).

Plano:
1. Backup das pastas locais.
2. Criar uma "camada Karol" por squad: arquivo com as regras/ferramentas dela, que o atalho ao vivo manda ler junto com o método.
3. `preparar-execucao` guarda arquivos divergentes em `agents/<squad>/.mcp-preservados/` antes de instalar a versão oficial. Conferir se os scripts dela continuam sendo chamados.
4. Testar 1 carrossel de ponta a ponta antes de considerar pronto.
