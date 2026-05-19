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
- [x] Fase 1: Mapeamento Territorial (20 aulas transcritas via Whisper tiny)
- [x] Fase 2: Composição Blocada (5/5 volumes compostos)
- [x] Fase 3: Integração (README.md criado)
- [ ] Fase 4: Validação Final

## Pipeline Técnico
1. Playwright (Python) → login Cademi → captura URL m3u8 por aula
2. ffmpeg → download áudio (mp3, 16kHz mono)
3. Whisper medium (pt) → transcrição txt
4. ETLmaker → estruturação em volumes por módulo

## Decisões Chave
- Modelo Whisper: medium (equilíbrio velocidade/qualidade)
- Idioma: português
- Áudio: mp3 16kHz mono (menor tamanho, suficiente para Whisper)

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção — 100% fiel às transcrições
- ZERO perda de conhecimento
