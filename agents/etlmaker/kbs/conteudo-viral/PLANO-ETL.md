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
- [x] Fase 2: Composição Blocada (8/8 volumes — VOL-01/02 Afonso, VOL-03/04 Rafael, VOL-05 síntese, VOL-06/07 Clara, VOL-08 síntese tripla)
- [x] Fase 3: Integração (README, REGRAS-CARDINAIS, REPERTORIO, GLOSSARIO regenerados pra 3 autores)
- [x] Fase 4: Validação Final (Camada 2 + Camada 3 completas)

**MERGE CONCLUÍDO (2º CICLO) — Verdict: APPROVED (score agregado 98.8%)**

## Decisões Chave
- Escopo Afonso: Módulo 3 inteiro (4 aulas), aprovado pelo expert.
- Escopo Rafael Bem: os 2 módulos inteiros do Reels Pro relacionados a modelos virais (10 aulas), aprovado pelo expert.
- Escopo Clara Siqueira (2º ciclo): antes de processar, o expert pediu pra verificar o que já existia — encontramos a KB `codigo-pev-2-0` já composta, mas sem MAPA-TERRITORIAL, sem [Fonte:] e sem Fase 4. Refizemos a KB standalone inteira (5 volumes) com rigor completo primeiro, e só então trouxemos os 2 módulos relevantes (Códigos Virais + Roteiros) pra este merge — os outros 3 módulos (Algoritmo, Movimento/Stories, Perfil que Vende) ficam disponíveis na KB standalone pra outro agente futuro.
- Fontes do Afonso: login manual + download HLS (ffmpeg) + Whisper local (modelo `small`).
- Fontes do Rafael: plataforma memberkit usa Panda Video com legendas pt-BR nativas — extraídas direto pra 8 das 10 aulas.
- Fontes da Clara: transcrições Whisper `tiny` (ciclo original, qualidade inferior às demais) — composição usou apenas trechos claramente compreensíveis, sinalizando ruído onde relevante.
- Durante composição do GLOSSARIO do Afonso (1º ciclo), um termo ("OBE") vazou por engano da KB `codigo-pev-2-0` lida anteriormente na sessão — identificado e removido antes da entrega. Lição que se provou relevante de novo neste 2º ciclo: ao trazer volumes de uma KB pra outra, todas as referências cruzadas internas (VOL-01, VOL-02 etc.) precisam ser reescritas pro novo contexto — verificado manualmente, 0 links quebrados na entrega final.

## Resultado Final (3 Autores, Pós-2º Merge)
- 8 volumes (2.072 linhas totais): VOL-01/02 (Afonso), VOL-03/04 (Rafael Bem), VOL-05 (síntese Afonso x Rafael), VOL-06/07 (Clara Siqueira), VOL-08 (síntese tripla)
- 4 docs transversais regenerados: README, REGRAS-CARDINAIS (15 regras), REPERTORIO (11/11 seções, itens dos 3 autores), GLOSSARIO (41 termos: 17 Afonso + 12 Rafael + 9 Clara + 3 convergentes)
- Validação: Camada 2 PASS 100% — 14 frameworks, 15 regras cardinais, 41 termos, 20 artefatos, todos rastreados
- Camada 3 (6 passes): fidelidade 100% (10/10 claims verificados, 0 invenções), 0 contradições reais, score agregado **98.8%**
- Convergência tripla e independente identificada em 4 princípios centrais (gancho, CTA, modelagem/adaptação, formatos prontos) — evidência de que são padrões estruturais do Instagram, não opinião de um criador isolado (ver VOL-08)
- Local: `agents/etlmaker/kbs/conteudo-viral/`
- Pronta pra servir de base à construção de um agente (Mente Sintética) — VOL-05 e VOL-08 têm orientação específica pra essa etapa

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
