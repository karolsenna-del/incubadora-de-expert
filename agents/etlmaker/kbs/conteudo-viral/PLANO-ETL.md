# ETL Plan — Conteúdo Viral (Multi-Autor: Afonso Molina + Rafael Bem + Clara Siqueira)

## Contexto
- **Fonte 1:** Curso ROTA 100K - 2026 (Kiwify, área de membros), Módulo 3 — "Conteúdo Viral: Identifique, Adapte, Exploda!"
- **Autor 1:** Afonso Molina
- **Fonte 2:** Curso Reels Pro (memberkit.com.br), módulos "Modelos Virais" e "Ingredientes do Perfil Viral"
- **Autor 2:** Rafael Bem
- **Tipo:** Cursos em vídeo (transcrições) + PDF anexo + vídeo de referência (Afonso) + legendas nativas Panda Video (Rafael)
- **Localização:** `00-pipeline/sources/transcricoes/` (Afonso), `00-pipeline/sources/transcricoes-rafael-bem/` (Rafael), `00-pipeline/sources/anexos/`
- **Objetivo do expert:** fundir o conhecimento dos dois experts sobre criação de conteúdo viral — método E estilo de ensinar de cada um — pra virar base de criação de conteúdos próprios da Karol e, na sequência, montar um agente (Mente Sintética) a partir dessa KB.

## KB Renomeada
- Slug anterior: `rota100k-conteudo-viral` (preso ao curso do Afonso)
- Slug atual: `conteudo-viral` (neutro, comporta múltiplos experts)
- Decisão aprovada pelo expert ao optar por "uma KB só, multi-autor" em vez de KBs separadas fundidas só no agente.

## Fontes — Afonso Molina (Módulo 3, ROTA 100K)
| # | Aula | Duração | Status |
|---|------|---------|--------|
| 01 | Caça às referências | 8:22 | Transcrita (Whisper) |
| 02 | Desvendando Formatos Virais | 6:26 | Transcrita (Whisper) |
| 03 | Ganchos Irresistíveis | 8:54 | Transcrita (Whisper) + PDF anexo + vídeo de referência |
| 04 | Edição Rápida e Impactante | 9:32 | Transcrita (Whisper) |

## Fontes — Rafael Bem (Reels Pro)
| # | Aula | Módulo | Fonte da transcrição | Status |
|---|------|--------|----------------------|--------|
| 01 | Acesse os Modelos Virais Aqui | Modelos Virais | Legenda nativa Panda Video (pt-BR) | Extraída |
| 02 | Como usar os Modelos Virais | Modelos Virais | Whisper (sem legenda nativa disponível) | Transcrita |
| 03 | Exemplo de Modelo Viral | Modelos Virais | Whisper (28:58, sem legenda nativa disponível) | Transcrita |
| 04 | Os 3 Fatores de um Reels Viral | Ingredientes do Perfil Viral | Legenda nativa Panda Video (pt-BR) | Extraída |
| 05 | Exemplos de ganchos virais | Ingredientes do Perfil Viral | Legenda nativa Panda Video (pt-BR) | Extraída |
| 06 | Criando uma conexão verdadeira | Ingredientes do Perfil Viral | Legenda nativa Panda Video (pt-BR) | Extraída |
| 07 | Elemento da Edição Dinâmica | Ingredientes do Perfil Viral | Legenda nativa Panda Video (pt-BR) | Extraída |
| 08 | Elemento Música em Alta | Ingredientes do Perfil Viral | Legenda nativa Panda Video (pt-BR) | Extraída |
| 09 | CTA para viralizar | Ingredientes do Perfil Viral | Legenda nativa Panda Video (pt-BR) | Extraída |
| 10 | Resumo do vídeo viral | Ingredientes do Perfil Viral | Legenda nativa Panda Video (pt-BR) | Extraída |

## Status
- [x] Fase 0: Setup (Afonso + Rafael + Clara)
- [x] Fase 1: Mapeamento Territorial multi-autor (MAPA-TERRITORIAL.md regenerado com 3 autores, 2º ciclo)
- [x] Fase 2: Composição Blocada (9/9 volumes — VOL-01/02 Afonso, VOL-03/04 Rafael, VOL-05 síntese, VOL-06/07 Clara, VOL-08 síntese tripla, VOL-09 catálogo completo 18 modelos)
- [x] Fase 3: Integração (README, REGRAS-CARDINAIS, REPERTORIO, GLOSSARIO regenerados pra 3 autores)
- [x] Fase 4: Validação Final (Camada 2 + Camada 3 completas)

**MERGE CONCLUÍDO (3º CICLO) — Verdict: APPROVED**

## 3º Ciclo de Merge (2026-08-05) — Catálogo Completo do Rafael Bem

**Contexto:** durante o Playback do Mind Forge (mente ExpertViral, ver `agents/mind-forge/minds/expert-viral/`), a Karol pausou a validação e trouxe o link do board Trello "🧠🔥 MODELOS VIRAIS 2026 ReelsPro©" — o catálogo completo dos 18 Modelos Virais do Rafael, que desde o 1º ciclo desta KB era gap documentado ("vive num Trello externo, fora do alcance desta KB").

**Processamento:**
1. Tentativa de WebFetch direto na URL do board — falhou (Trello é SPA pesada em JS, não renderiza sem execução de JS).
2. Solução: boards públicos do Trello expõem um endpoint JSON em `{url}.json` sem necessidade de autenticação — baixado via `curl` (929KB).
3. Parseado com Python (`json.load`) — 20 listas, 314 cards. 2 listas são instrucionais ("Primeiro Passo" = os 18 nomes resumidos; "Segundo Passo" = protocolo de adaptação em 5 passos). As outras 18 listas são 1 por modelo, cada uma com o mesmo padrão: card "Por que viraliza" (5 gatilhos nomeados) + card "Guia Estrutura" (gancho→desenvolvimento→clímax→CTA, com exemplos multi-nicho) + card resumo + N links de exemplos reais do Instagram.
4. Composto em `VOL-09-catalogo-completo-18-modelos-virais-rafael-bem.md` (334 linhas).

**Achado de qualidade de dado (documentado com transparência, não corrigido por invenção):** o card "Guia Estrutura" do Modelo #18 (Efeitos Criativos) está com texto idêntico ao do Modelo #17 (Produto em Uso) na fonte original — aparenta ser erro de copiar-colar de quem mantém o board. Registrado no VOL-09 em vez de inventar uma estrutura própria pro #18.

**Novo material que não existia nos ciclos anteriores:**
- Nomes completos dos 18 modelos (antes só se sabia que existiam 18, com 1 detalhado — Tutorial)
- Taxonomia de 11 gatilhos psicológicos nomeados explicitamente (curiosidade, identificação, medo/FOMO, urgência, exclusividade, prova social, desejo, continuidade, satisfação visual, participação, autoridade) — camada de vocabulário mais granular que qualquer coisa já catalogada no GLOSSARIO
- Confirmação da anatomia universal (Gancho→Desenvolvimento→Clímax→CTA) em 18 casos independentes, não só 1
- Uma 4ª formulação independente da regra "modelar, não copiar" (exemplo P.O.V. dormir cedo → finanças/academia), reforçando ainda mais esse crown jewel

## Decisões Chave
- Escopo Afonso: Módulo 3 inteiro (4 aulas), aprovado pelo expert.
- Escopo Rafael Bem: os 2 módulos inteiros do Reels Pro relacionados a modelos virais (10 aulas), aprovado pelo expert.
- Escopo Clara Siqueira (2º ciclo): antes de processar, o expert pediu pra verificar o que já existia — encontramos a KB `codigo-pev-2-0` já composta, mas sem MAPA-TERRITORIAL, sem [Fonte:] e sem Fase 4. Refizemos a KB standalone inteira (5 volumes) com rigor completo primeiro, e só então trouxemos os 2 módulos relevantes (Códigos Virais + Roteiros) pra este merge — os outros 3 módulos (Algoritmo, Movimento/Stories, Perfil que Vende) ficam disponíveis na KB standalone pra outro agente futuro.
- Fontes do Afonso: login manual + download HLS (ffmpeg) + Whisper local (modelo `small`).
- Fontes do Rafael: plataforma memberkit usa Panda Video com legendas pt-BR nativas — extraídas direto pra 8 das 10 aulas.
- Fontes da Clara: transcrições Whisper `tiny` (ciclo original, qualidade inferior às demais) — composição usou apenas trechos claramente compreensíveis, sinalizando ruído onde relevante.
- Durante composição do GLOSSARIO do Afonso (1º ciclo), um termo ("OBE") vazou por engano da KB `codigo-pev-2-0` lida anteriormente na sessão — identificado e removido antes da entrega. Lição que se provou relevante de novo neste 2º ciclo: ao trazer volumes de uma KB pra outra, todas as referências cruzadas internas (VOL-01, VOL-02 etc.) precisam ser reescritas pro novo contexto — verificado manualmente, 0 links quebrados na entrega final.

## Resultado Final (3 Autores, Pós-3º Merge)
- 9 volumes (2.406 linhas totais): VOL-01/02 (Afonso), VOL-03/04 (Rafael Bem), VOL-05 (síntese Afonso x Rafael), VOL-06/07 (Clara Siqueira), VOL-08 (síntese tripla), VOL-09 (catálogo completo 18 modelos do Rafael)
- 4 docs transversais: README, REGRAS-CARDINAIS (15 regras), REPERTORIO (11/11 seções, itens dos 3 autores), GLOSSARIO (41 termos: 17 Afonso + 12 Rafael + 9 Clara + 3 convergentes) — pendente: incorporar taxonomia de gatilhos do VOL-09 ao GLOSSARIO num próximo passe de integração
- Validação (2º ciclo): Camada 2 PASS 100% — 14 frameworks, 15 regras cardinais, 41 termos, 20 artefatos, todos rastreados
- Camada 3 (2º ciclo, 6 passes): fidelidade 100% (10/10 claims verificados, 0 invenções), 0 contradições reais, score agregado **98.8%**
- 3º ciclo (VOL-09): validação leve aplicada diretamente na composição (rastreabilidade 100% a cards do Trello, 1 anomalia de fonte documentada, zero invenção) — não rodada a bateria completa de Camada 2/3 estatística por ser expansão de 1 autor já coberto, não merge de autor novo
- Convergência tripla e independente identificada em 4 princípios centrais (gancho, CTA, modelagem/adaptação, formatos prontos) — agora com uma 4ª evidência independente da regra de modelagem, vinda do próprio material de apoio do Rafael (VOL-09, Seção 2)
- Local: `agents/etlmaker/kbs/conteudo-viral/`
- Pronta pra servir de base à construção de um agente (Mente Sintética) — VOL-05 e VOL-08 têm orientação específica pra essa etapa; ExpertViral (Mind Forge) está em Fase 3 (Playback), retomando com este catálogo atualizado

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
