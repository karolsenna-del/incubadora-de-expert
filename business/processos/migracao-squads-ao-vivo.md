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

## Etapa 2 — DIAGNÓSTICO (04/10) — muda o plano

Comparação versão local × ao vivo (squad-config e hashes dos arquivos oficiais de `preparar-execucao`):

| Squad | Local | Ao vivo | Conclusão |
|---|---|---|---|
| Conteúdo | 1.0.1 | 1.0.1 (config idêntica ao original) | Nada novo no método. Migrar não ganha nada |
| Carrossel | 1.2.0 | mesmos arquivos da atualização de 14/08 | Nada novo. E o `preparar-execucao` trocaria `build-carousel.mjs` e `render.sh` pelos oficiais, que NÃO têm os fixes da Karol (Chrome no Windows, cygpath, `--no-sandbox` pras rotinas de nuvem, avatar em `assets/`), a cada uso |
| Posicionamento | 1.0.0 | 1.0.0 | Nada novo |
| Tráfego | 2.5.2 | 2.6.1 | Atualização real e zero ajuste da Karol → TROCADO pro ao vivo em 04/10 |
| Edição | 1.1.1 | 1.3.0 (legenda karaokê padrão + portão de entrega) | Atualização real, MAS a Karol corrigiu scripts (OpenCV 5, memória do transcribe, reframe vertical, headline, estilo split-screen, nomes próprios) e o Clip Expert depende deles. Trocar a seco quebraria os cortes |

**Decisão da Karol (04/10):** Conteúdo, Carrossel e Posicionamento ficam locais (são iguais ao ao vivo + ajustes dela). Edição Arcane fica como está — o Clip Expert depende dos scripts corrigidos. Só revisitar se ela quiser a legenda karaokê / portão de entrega da 1.3.0, ou se o Clip Expert quebrar (aí juntar a 1.3.0 com os fixes e testar num corte real). Tráfego trocado pro ao vivo. **Migração encerrada.**

Obs.: Edição Euriliana (`/squad-edicao-euriliana`) é outro squad, já nasceu ao vivo, sem relação com o Clip Expert.

## Etapa 2 — plano original (superado pelo diagnóstico acima)

Squads com ajustes da Karol (não trocar o atalho a seco):

- **Conteúdo** — `data/config.yaml` (7 slides / 1.700 caracteres), `tasks/gerar-laminas-carrossel.md` (pipeline pro Instagram), bancos de ganchos e `vocabulario-palavras-gatilho.md`, `metricas-diagnostico.md`.
- **Carrossel** — `tasks/produce-carousel.md`, `tools/build-carousel.mjs`, `tools/build-tipografico.mjs` (exclusivo da Karol), `tools/render.sh` (fix nuvem/Windows), `templates-base/story-texto/`. Templates card-tweet ficam em `~/.carrossel-arcane/` (fora do repo).
- **Tráfego** (`/trafegoArcane`), **Posicionamento** (pasta `work/` com clientes), **Edição** (dicionário de nomes do Clip Expert).

Plano:
1. Backup das pastas locais.
2. Criar uma "camada Karol" por squad: arquivo com as regras/ferramentas dela, que o atalho ao vivo manda ler junto com o método.
3. `preparar-execucao` guarda arquivos divergentes em `agents/<squad>/.mcp-preservados/` antes de instalar a versão oficial. Conferir se os scripts dela continuam sendo chamados.
4. Testar 1 carrossel de ponta a ponta antes de considerar pronto.
