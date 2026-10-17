# ETL Plan — Funil de Quiz Lucrativo

## Contexto
- **Fonte:** Curso "Funil de Quiz Lucrativo" (produto "Quiz de 100k"), 8 aulas em vídeo
- **Autor(es):** Henrique Melo
- **Tipo:** curso (transcrições)
- **Localização:** https://quizlucrativo.memberapp.pro/cursos/funil-de-quiz (vídeos no Tella; transcrição extraída da página pública de cada vídeo)
- **Objetivo da Karol:** usar a KB pra criar o funil de quiz da Incubadora de Expert
- **Modo:** Full Pipeline (inferido do pedido; confirmar junto com o plano de volumes)

## Status
- [x] Fase 0: Setup (16/10/2026)
- [x] Ingestão: 8 fontes, 11.164 palavras, QG-ETL-000 OK (16/10/2026)
- [x] Fase 1: Mapeamento Territorial — QG-ETL-001 OK; plano de 3 volumes APROVADO pela Karol em 16/10 (QG-ETL-002)
- [ ] Fase 2: Composição Blocada (1/3 volumes)
  - [x] VOL-01 Fundamentos e Estrutura Mestre — 404 linhas, 64 [Fonte], 5 tabelas; spot-check 10 claims: 9 corretos, 1 corrigido (atribuição do "recado do doutor Renan"), 0 inventados → PASS
  - [x] VOL-02 Construção e Personalização — 350 linhas, 66 refs, 4 tabelas; spot-check: 8 corretos, 2 corrigidos (opções de resposta; duração de animação era do gráfico, não do "carregando"), 0 inventados → PASS
  - [x] VOL-03 Referências, Modelagem e Otimização — 317 linhas, 49 refs, 6 tabelas; spot-check: 9 corretos, 1 corrigido (passo 3 da rotina tinha recomendação sem fonte), 0 inventados → PASS
- Fase 2 concluída em 16/10. Próximo: Fase 3 (README, REGRAS-CARDINAIS, REPERTORIO, GLOSSARIO, completeness-report)
- [x] Fase 3: Integração — README, REGRAS-CARDINAIS (10), REPERTORIO (11 seções), GLOSSARIO (38 termos), completeness-report; links internos OK (16/10)
- [x] Fase 4: Validação Final — Camada 2 PASS (1 termo faltante no glossário corrigido); Camada 3 agregado 99%, 15/15 claims corretos → APPROVED (16/10)

## Resultado
KB pronta em `agents/etlmaker/kbs/funil-de-quiz-lucrativo/`. Próximo passo (fora do ETL): usar a KB pra desenhar o funil de quiz da Incubadora.

## Decisões Chave
- 16/10 — Transcrição tirada do campo `transcriptionWords` do Tella (palavra a palavra, com tempo), não de áudio. Parágrafos quebrados por pausa/pontuação, com [MM:SS].
- 16/10 — Comentários dos alunos na área de membros ficam fora da fonte (não é conteúdo do autor).

## Gaps conhecidos na ingestão
- Aula 1.3 cita "estrutura que vai estar aqui embaixo pra você" — na página só aparece o link "Teste a Vquiz grátis por 7 dias". O diagrama, se existir, não foi capturado.
- Tudo que o autor mostra na tela (quizzes de exemplo, prompts de IA, painel da ferramenta) só entra pelo que ele fala.

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
