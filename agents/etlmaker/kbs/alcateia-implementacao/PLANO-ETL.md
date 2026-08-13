# ETL Plan — Alcateia Implementação

## Contexto
- **Fonte:** Mentoria Alcateia — vinigrevy.memberkit.com.br
- **Autor(es):** Vinicius Grevy
- **Tipo:** curso estruturado + workshop
- **Localizacao:** https://vinigrevy.memberkit.com.br/categories/35576-alcateia-implementacao/courses

## Escopo
3 seções solicitadas:
1. **Alcateia Implementação** — 7 módulos, ~90 aulas, ~8h52m
2. **Social Selling** — 4 aulas, ~1h59m
3. ~~**Rotinas de Stories** — apenas PDFs (pendente estratégia de extração)~~ — **RESOLVIDO (Merge 12/08/2026).** Ver item 5 abaixo.

### Merge — Fontes Adicionadas Posteriormente
4. **Funil Vinizoom — Imersão ViniZoom** (categoria 285180-funil-vinizoom, mesmo parent "Mentoria Alcateia") — 1 aula "Funil de Zoom" (1h17m28s), adicionada via Merge em 13/06. Foco solicitado por Karol: técnica de Vini Grevy de inserir CTA no meio de uma live longa, pra aplicar nas lives de Zoom dela (não cobertas em VOL-conteudo, que trata de conteúdo em feed/stories).
5. **Rotinas de Stories (PDFs)** — 12 PDFs semanais ("Teia de Aranha", semana-01 a semana-12) + 1 playbook (levantada-de-mão), adicionados via Merge em 12/08. Bloqueio original (Read tool sem `pdftoppm`/poppler-utils) resolvido pelo Ops. Conteúdo incorporado em VOL-conteudo.md seção 5 — catálogo de 20 formatos de Stories com scripts verbatim.

## Módulos — Alcateia Implementação
| Módulo | Aulas | Duração |
|--------|-------|---------|
| 01 Comece aqui - Modelo de negócio | 6 | 26m |
| 02 Caixa rápido 24hrs | 4 | 19m |
| 03 Posicionamento e comunicação | 7 | 47m |
| 04 Oferta e produto | 20 | 1h23m |
| 05 Aquisição de clientes | 36 | 4h01m |
| 06 Vendas e escala | 17 | 1h14m |
| 07 Páginas de vendas | 1 | links |
| Social Selling | 4 | 1h59m |

## Status
- [x] Fase 0: Setup
- [x] Fase 1: Ingestão (extração de áudio + transcrição) — 92 transcrições
- [x] Fase 2: Mapeamento Territorial — MAPA com 7 domínios, 21 frameworks, 17 regras
- [x] Fase 3: Composição Blocada — 7/7 volumes
- [x] Fase 4: Integração — README, REGRAS-CARDINAIS, REPERTÓRIO, GLOSSÁRIO
- [x] Fase 5: Validação Final — **APPROVED, score 95.4%** (12/07/2026)

## Resultado da Validação Final (12/07/2026)
- **Camada 2 (auditoria exaustiva):** PASS — 21/21 frameworks, 17/17 regras, 44/44 termos, 0 contradições
- **Camada 3 (6 passes):** cobertura 97 · fidelidade 96 (0 invenções) · riqueza 90 · voz 85 · consistência 98 · integridade 100
- **Agregado:** 95.4% → **APPROVED** · QG-ETL-005 passou
- **Correção aplicada:** dessincronia do Merge de 13/06 — os 4 docs transversais estavam em 29/05 e foram sincronizados (9 termos, 2 regras, framework do Funil de Zoom, README). Conteúdo já existia nos volumes; zero invenção.
- **completeness-report.yaml** gerado em 13/07 (retroativo à Integração) — placar de completude 100%.
- **Pendência menor (não bloqueante):** proveniência em formato [Fonte:] mais forte nos trechos do Merge que nos volumes originais (citação inline por aula).
- Relatórios: `00-pipeline/critical-audit-report.yaml` + `validation-report.yaml` + `completeness-report.yaml`

## Progresso de Ingestão
- [ ] 01-bem-vindo-a-alcateia
- [ ] 02-curva-jota
- [ ] 03-modelo-de-negocio
- [ ] 04-seu-caminho-para-os-30k
- [ ] 05-como-editar-o-notion
- [ ] 06-checklist-modelo-de-negocios
- [ ] 07-caixa-rapido-sem-audiencia
- [ ] 08-caixa-rapido-com-audiencia
- [ ] 09-checklist-caixa-rapido
- [ ] 10-teia-de-aranha-da-alcateia
- [ ] 11-definindo-seu-problema
- [ ] 12-mercado-unico
- [ ] 13-promessa-matadora
- [ ] 14-metodo-ab
- [ ] 15-perfil-matador
- [ ] 16-guia-de-publico-e-posicionamento
- [ ] 17-checklist-posicionamento
- [ ] 18-inicio-oferta
- [ ] 19-instagram-fantasma
- [ ] 20-criando-seu-metodo
- [ ] 21-precificacao
- [ ] 22-alcateia-model-offer
- [ ] 23-modelo-prestacao-de-servicos
- [ ] 24-modelo-mentoria-individual
- [ ] 25-modelo-mentoria-em-grupo
- [ ] 26-modelo-infoproduto
- [ ] 27-checklist-oferta-e-produto
- [ ] 28-criando-conteudos-validados-agente-gpt
- [ ] 29-estrategia-de-conteudo
- [ ] 30-conteudo-1-viral-reels
- [ ] 31-conteudo-2-dor-eventos
- [ ] 32-conteudo-3-principios-e-valores
- [ ] 33-frequencia-de-conteudo
- [ ] 34-criando-com-chatgpt-alcance
- [ ] 35-criando-com-chatgpt-eventos-e-dor
- [ ] 36-agentes-de-ia-conteudos-validados
- [ ] 37-checklist-conteudo
- [ ] 38-cilindro-de-vendas
- [ ] 39-jornada-do-cliente
- [ ] 40-modelos-de-mini-treinamento
- [ ] 41-automacao-mini-treinamento-manychat
- [ ] 42-agente-ia-mini-treinamento
- [ ] 43-pagina-mini-treinamento
- [ ] 44-checklist-mini-treinamento
- [ ] 45-planilha-metricas-mini-treinamento
- [ ] 46-problemas-com-manychat
- [ ] 47-estrutura-aula-milionaria
- [ ] 48-etapa-1-introducao-lead
- [ ] 49-etapa-2-conteudo
- [ ] 50-etapa-3-oferta
- [ ] 51-aula-milionaria-sem-depoimento
- [ ] 52-aula-milionaria-com-depoimento
- [ ] 53-subindo-aula-milionaria-vturb
- [ ] 54-pagina-aula-milionaria
- [ ] 55-pagina-upsell-faturamento
- [ ] 56-automacao-aula-milionaria-manychat
- [ ] 57-checklist-aula-milionaria
- [ ] 58-config-pv-aula1-introducao
- [ ] 59-config-pv-aula2-vantagens
- [ ] 60-config-pv-aula3-orientacoes
- [ ] 61-config-pv-aula4-greatpages
- [ ] 62-config-pv-aula5-vturb
- [ ] 63-config-pv-aula6-primeiro-codigo
- [ ] 64-config-pv-aula7-testando-pagina
- [ ] 65-config-pv-aula8-teste-ab-vturb
- [ ] 66-config-pv-aula9-codigo-ab
- [ ] 67-config-pv-aula10-botoes-teste-ab
- [ ] 68-config-pv-aula11-encerramento
- [ ] 69-copie-automacao-seguidores
- [ ] 70-funil-seguidores-manual
- [ ] 71-estrategia-no-meu-perfil
- [ ] 72-funis-ocultos-perfil
- [ ] 73-aumentando-conversao-30
- [ ] 74-processo-de-vendas
- [ ] 75-rotina-14hrs-semanais
- [ ] 76-script-de-vendas-e-conducao
- [ ] 77-social-seller-e-boas-vindas
- [ ] 78-gerando-desejo-no-produto
- [ ] 79-metricas-de-trafego
- [ ] 80-trafego-pago
- [ ] 81-turninando-pelo-notebook
- [ ] 82-escala-de-trafego
- [ ] 83-planilha-metricas-trafego
- [ ] 84-checklist-vendas-e-escala
- [ ] 85-o-simples-que-funciona-iniciante
- [ ] 86-hackeando-gerenciador-intermediario
- [ ] 87-momento-certo-remarketing
- [ ] 88-estrutura-remarketing-e-campanhas
- [ ] 89-criativos-para-remarketing
- [ ] 90-baixe-pdf-mapa-mental
- [ ] 91-selling-no-instagram
- [ ] 92-selling-no-whatsapp
- [ ] 93-pdf-e-docs-social-selling
- [ ] 94-workshop-social-selling

### Merge — Fontes Adicionadas
- [x] 95-funil-de-zoom-vinizoom (áudio extraído, transcrição completa, mapeamento territorial concluído, VOL-conteudo e VOL-funil-vendas atualizados — Merge concluído 13/06)

## Decisões Chave
- Método de extração: m3u8 via Playwright + ffmpeg + Whisper (mesmo padrão do Código PEV 2.0)
- ~~Rotinas de Stories: apenas PDFs — estratégia pendente (download manual ou selenium)~~ — resolvido, ver decisão 12/08 abaixo
- Páginas de vendas e PDF e DOCS: sem vídeo, serão pulados pelo script
- **13/06 — Merge aprovado por Karol:** fonte 95-funil-de-zoom-vinizoom (curso Funil Vinizoom, módulo Imersão-ViniZoom) entra na KB Alcateia Implementação via modo Merge. Impacta VOL-funil-vendas (estrutura do funil de Zoom) e VOL-conteudo (formato de live longa + técnica de CTA no meio do conteúdo)
- **12/08 — Merge aprovado por Karol:** 13 PDFs de rotina de Stories (retomada do backlog "Automatizar Stories"). Bloqueio de leitura de PDF (faltava poppler-utils) resolvido pelo Ops. ETLmaker leu os 13 PDFs via Read tool (extração de imagem por página) e atualizou VOL-conteudo.md seção 5, sem recriar o que já existia — fecha os gaps "Aula 90" e "Rotinas de Stories (PDF ausente)" do MAPA-TERRITORIAL.md

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
