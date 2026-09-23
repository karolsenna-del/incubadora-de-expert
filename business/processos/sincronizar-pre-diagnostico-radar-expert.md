# Sincronizar Pré-Diagnóstico → Radar do Expert

> Processo manual (sob pedido) pra levar as respostas do pré-diagnóstico de um lead pra dentro
> da ferramenta **Radar do Expert**, antes da Sessão Estratégica. Criado 21/09/2026, testado
> com a lead Marcelli (marcellistrobel@gmail.com, sessão de 22/09).

---

## O que é

O lead responde o pré-diagnóstico (`diagnostico.incubadoradeexpert.com.br`) antes da Sessão
Estratégica. Essas respostas caem numa planilha do Google Sheets. A Karol usa o
**Radar do Expert** (Claude Artifact — mapa mental interativo com radar dos 5Ps) pra pontuar
ao vivo na sessão: `https://claude.ai/artifact/AgwbWdzWbfo5QWgxuy9wVb`.

Esse processo pega a resposta do lead na planilha e carrega no Radar do Expert **antes** da
sessão, pra que:
- Um card de contexto apareça na tela assim que a Karol digitar o e-mail do lead (dificuldade,
  meta, o que já tentou, resultado esperado, urgência, faturamento, presença digital).
- Os sliders de **P1 (Persona Compradora)** e **P2 (Promessa Transformadora)** já venham
  pré-marcados com um ponto de partida, com base nas respostas de "Perfil do Cliente Definido",
  "Promessa Transformadora" e "Provas de Resultados" — ajustável ao vivo durante a conversa.

## Por que é manual (não é automático)

O formulário do pré-diagnóstico roda fora do Claude (site próprio + Google Apps Script gravando
na planilha). O banco de dados do Radar do Expert só aceita escrita de **dentro da própria
ferramenta**, por um viewer logado — não existe porta de entrada pra um servidor externo
escrever ali direto. Por isso não dá pra automatizar ponta a ponta (lead responde → já aparece
sozinho no Radar). Ver decisão registrada em `log-decisoes.md` (21/09/2026).

## Quando rodar

- Antes de qualquer Sessão Estratégica agendada — o ideal é pedir na véspera ou na manhã do dia,
  pra pegar respostas de última hora.
- Pode ser um lead só ("importa o pré-diagnóstico da Fulana") ou um lote da semana ("importa os
  pré-diagnósticos novos").

## Como pedir

Fala em linguagem natural com o Companion ou o Claude, ex:
- "Importa o pré-diagnóstico da Marcelli (marcellistrobel@gmail.com)"
- "Importa os pré-diagnósticos novos pras sessões desta semana"

## O que o Claude faz (passo a passo)

1. Lê a planilha de respostas do pré-diagnóstico via Google Drive (`read_file_content`).
   **Atenção — hoje existem 2 planilhas em uso** (achado 21/09/2026, ver Cuidado abaixo):
   - `1VWthqPmKdb2U5KK_oMQJzz4ucjZHyY-jjmgZoyahMXI` (a "oficial", linkada na Central Incubadora)
   - `1QXyhz4sAOblbXpqJS0fc0MCeACi7U6Q48a8N5GX3wDE` (uma planilha antiga que ainda está recebendo
     respostas de verdade — foi onde a resposta da Marcelli caiu)
   Checar as duas até a causa raiz ser corrigida (ver backlog).
2. Localiza a linha do lead pelo e-mail (ou nome, se o e-mail não bater).
3. Monta o documento e grava no banco do Radar do Expert via `ArtifactData` (`action: "set"`),
   coleção `prediagnosticos`, `doc_id` = e-mail em slug (ex: `marcellistrobel-gmail-com`).

**Mapa de campos (planilha → Radar do Expert):**

| Coluna da planilha | Campo no Radar | Uso |
|---|---|---|
| E-mail | `email` | chave de busca (doc_id em slug) |
| Nome | `nome` | preenche o nome do lead se o campo estiver vazio |
| Data | `data` | mostrado no card de contexto |
| Instagram, Seguidores | `instagram`, `seguidores` | snapshot no card |
| Faturamento Mensal | `faturamento` | snapshot no card |
| Perfil do Cliente Definido | `perfilClienteDefinido` | pré-marca P1, item 1 (Sim=7, Não=2, Não sei=1) |
| Promessa Transformadora | `promessaTransformadora` | pré-marca P2, item 1 (Sim=6, Não=2, Não sei=1) |
| Provas de Resultados | `provasResultados` | pré-marca P2, item 2 (Sim=7, Não=1, Não sei=1) |
| Urgência (1-10) | `urgencia` | snapshot no card |
| Principal Dificuldade | `dificuldade` | card de contexto |
| Meta/Desejo como Infoprodutor | `meta` | card de contexto |
| O Que Já Tentou | `jaTentou` | card de contexto |
| Resultado Esperado da Sessão | `resultadoEsperado` | card de contexto |
| Visão Geral do Negócio | `visaoGeral` | card de contexto — primeiro item, largura total (exibido desde 23/09/2026) |
| História do Negócio | `historiaNegocio` | card de contexto — logo abaixo da visão geral, largura total (exibido desde 23/09/2026; base da conexão na sessão) |

Os pré-preenchimentos de P1/P2 só entram se o slider ainda estiver em 0 — não sobrescrevem
pontuação que a Karol já tenha ajustado na hora.

## Cuidado — 2 planilhas ativas (achado 21/09/2026, não corrigido ainda)

O Apps Script do formulário deveria gravar numa planilha só, mas a resposta real de teste
(Marcelli) caiu na planilha **antiga** (`1QXyhz4sAOblbXpqJS0fc0MCeACi7U6Q48a8N5GX3wDE`), não na
que está linkada como oficial na Central Incubadora. Provável causa: o Apps Script atual
(`getActiveSpreadsheet()`, ver `lp-diagnostico-expert/materiais/setup-planilha-automatica.md`)
está *bound* (contêiner-vinculado) à planilha antiga, e a nova só existe como referência solta
sem script rodando nela. **Não corrigido ainda** — registrado em `demandas-backlog.md`.
Até corrigir, checar as duas planilhas neste processo.

## Resultado esperado

Ao abrir o Radar do Expert, ir em **Novo diagnóstico** e digitar o e-mail do lead: aparece o
card de contexto e os sliders de P1/P2 já vêm com um ponto de partida.
