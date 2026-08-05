# ETL Plan — Código PEV 2.0

## Contexto
- **Fonte:** Curso Código PEV 2.0 — Clara Siqueira (plataforma Cademi)
- **Autor(es):** Clara Siqueira
- **Tipo:** Curso em vídeo (20 aulas, 5 módulos)
- **Localização:** https://clarasiqueira.cademi.com.br

## Módulos
| # | Módulo | Aulas |
|---|--------|-------|
| 1 | Comece Aqui para Resultado Rápido | 3 |
| 2 | Códigos pra Viralizar ainda Hoje | 7 |
| 3 | Como Escrevo meus Roteiros | 4 |
| 4 | Nunca Mais tenha um Perfil Flopado | 3 |
| 5 | Estrutura de um Perfil que Vende | 3 |

## Status
- [x] Fase 0: Setup
- [x] Fase 1: Mapeamento Territorial — **refeita retroativamente em 2026-08-05** (MAPA-TERRITORIAL.md criado; não existia antes)
- [x] Fase 2: Composição Blocada — **volumes recompostos em 2026-08-05** com [Fonte:] rastreável (antes: composição manual sem provenance)
- [x] Fase 3: Integração — **REGRAS-CARDINAIS.md, REPERTORIO.md, GLOSSARIO.md criados em 2026-08-05** (só o README existia antes)
- [x] Fase 4: Validação Final — **feita em 2026-08-05**, Camada 2 PASS 100%, Camada 3 score agregado 98.2%, verdict APPROVED

**KB elevada ao padrão de rigor completo do ETLmaker v3.0 — nivelada com as KBs de Afonso Molina e Rafael Bem.**

## Pipeline Técnico (Ciclo Original)
1. Playwright (Python) → login Cademi → captura URL m3u8 por aula
2. ffmpeg → download áudio (mp3, 16kHz mono)
3. Whisper (pt) → transcrição txt — **nota:** PLANO original citava modelo `medium`, mas o ruído observado nas transcrições (ex.: 01-estrutura-perfil-que-vende.txt, trecho de 03-estrutura-viral-2026.txt) é mais consistente com modelo `tiny`. Inconsistência da documentação original, não verificável retroativamente — registrada como gap de rastreabilidade do ciclo anterior.
4. ETLmaker → estruturação em volumes por módulo

## Decisões Chave (Ciclo Retroativo — 2026-08-05)
- Expert pediu pra verificar o que já tinha sido processado desse curso antes de propor um "retrabalho" — encontramos a KB já existente, mas sem MAPA-TERRITORIAL, sem [Fonte:] e sem Fase 4.
- Expert optou por refazer os 5 volumes com rigor completo (não só os 2 relevantes pro merge), mantendo a KB standalone íntegra pra uso futuro.
- Apenas VOL-02 (Os 5 Códigos Virais) e VOL-03 (Como Escrever Roteiros Virais) serão trazidos pra dentro da KB multi-autor `conteudo-viral`, como 3º autor/fonte — os demais ficam aqui, disponíveis pra outro agente (crescimento de perfil/vendas).
- Identificado durante a leitura: o Módulo 5 (Aulas 2-3) é narrado por uma segunda voz (co-estrategista, provavelmente marido/parceiro de negócio da Clara) — registrado no MAPA-TERRITORIAL como colaborador, não presumido nome completo.

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção — 100% fiel às transcrições
- ZERO perda de conhecimento
