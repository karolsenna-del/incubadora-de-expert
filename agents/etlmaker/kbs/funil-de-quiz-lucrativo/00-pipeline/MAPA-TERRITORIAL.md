# Mapa Territorial — Funil de Quiz Lucrativo

> Gerado pelo ETLmaker v3.0 — Fase 1: Mapeamento Territorial
> Data: 16/10/2026
> Fontes: 8 transcrições (aulas 1.1 a 1.8), 11.164 palavras, ~58 min de vídeo

---

## 1. Domínios de Conhecimento

| # | Domínio | Descrição | Subtópicos | Importância | Fontes |
|---|---------|-----------|------------|-------------|--------|
| D1 | **Por que quiz (vs. página de vendas)** | Tese do curso: quiz mostra onde o lead abandona, é interativo, personalizado e permite ticket mais alto via VSL | Lâmina única x etapas; mapa de calor x métrica por etapa; interatividade/quebra de padrão; sensação de personalizado; faixa de ticket por modelo; boom do quiz no mercado | core | 1.2, 1.3, 1.4, 1.8 |
| D2 | **Estrutura Mestre do quiz** | Esqueleto que se repete nos funis escalados: abertura (promessa "Descubra como" ou teste/diagnóstico gratuito) + perguntas em ordem lógica + resultado + pitch | 2 padrões de abertura; Mapeamento → Identificação → Confirmação; blocos de autoridade, prova, Small Yes, captura; diagnóstico personalizado; pitch; nº de etapas (15–20) | core | 1.3, 1.4, 1.5, 1.7 |
| D3 | **Oferta, ticket e VSL** | Como o fim do quiz muda com o preço: low ticket vende direto no quiz; ticket alto manda pra VSL | Low ticket 17–97 sem VSL; VSL = produto mais caro; mini VSL no meio do quiz; bloco de oferta como "página de vendas dentro do quiz"; escassez por tempo | core | 1.2, 1.3, 1.4 |
| D4 | **Construção na ferramenta** | Criar o quiz: IA genérica x ferramenta pronta; do zero por blocos; com IA a partir de briefing | Trade-off métricas/banco de dados; blocos (pergunta, resposta, preço, captura, vídeo, áudio, prova, gráfico, carregando, oferta); briefing estratégico gerado por IA (produto, público, dores, mecanismo único, especialista, oferta); ajuste fino; prévia por etapa | core | 1.1, 1.4 |
| D5 | **Personalização visual e primeira dobra** | Dar identidade ao quiz e caprichar na primeira etapa | Imagem-gatilho gerada no ChatGPT a partir do briefing; compressão (Squoosh/WebP); cor de fundo/destaque/barra de progresso; logo; botão na primeira dobra; domínio; bloquear cópia | supporting | 1.5, 1.6 |
| D6 | **Referências: encontrar e modelar funis escalados** | Garimpar funis que estão dando dinheiro e modelar (não copiar) | Biblioteca de Anúncios + busca "inlead.digital"; extensão AdSparrow (filtro por nº de anúncios ativos); fazer o funil até o fim; modelar imagem de abertura com ChatGPT; clonar (Inlead/XQuiz), traduzir, modelar conservador x turbinado | core | 1.1, 1.6, 1.7 |
| D7 | **Métricas e otimização** | Ler o funil por etapa e melhorar com teste A/B | Taxa de interação (1ª etapa); taxa de conclusão; perda entre etapas; queda brusca = alerta; captura de lead como causa de queda; teste A/B quiz completo x 1ª etapa; até 5 variantes; mesma URL; marcar vencedor | core | 1.2, 1.3, 1.4, 1.8 |
| D8 | **Captura de lead** | Usar o quiz pra gerar lead antes de vender ou pra time comercial | Bloco de captura; WhatsApp; presente com imagem desfocada; aba de leads; custo em queda de etapa | supporting | 1.3, 1.4, 1.8 |

8 domínios (6 core, 2 supporting).

## 2. Backbone

- **backbone_exists:** sim
- **backbone_description:** o curso é linear em 3 movimentos que o próprio autor anuncia na 1.1 — "estrutura ideal de copy" (modelagem dos funis validados), "como encontrar funis escalados / fazer sua lista de referências" e "análise de métricas". As aulas seguem a sequência: entender (1.2–1.3) → construir (1.4–1.5) → referenciar/clonar (1.6–1.7) → otimizar (1.8).
- **backbone_source:** aula 1.1 (pilares) + ordem das aulas
- **strategy:** use_author_backbone (agrupando as 8 aulas nos 3 movimentos: entender, construir, escalar)
- **justification:** um autor, um método curto e sequencial. Cada aula depende da anterior (ex.: 1.4 diz "aquela ordem que eu te mostrei na aula anterior"; 1.7 diz "na aula anterior te mostrei como encontrar").

## 3. Autores

| Nome | Papel | Domínios | Peso | Marcadores |
|------|-------|----------|------|-----------|
| Henrique Melo | primary (único) | todos | high | "Fechou?", "Tamo junto", "Olha que legal", "bizarro", "barbadinha", "pegar a nata" |

**Referências citadas (não são autores):** Pablo Marçal e Renato Cariani (funis modelados por engenharia reversa, 1.1/1.6), Julio Balestrin, Nathalia Bildt, "Michio Fitness" (exemplos na biblioteca de anúncios), livro *As Armas da Persuasão* (base do Small Yes).

**Conflito de interesse a registrar:** o curso recomenda a ferramenta VQuiz (link com 7 dias grátis em todas as aulas). Na 1.7 o autor fala em primeira pessoa do plural sobre a ferramenta ("a gente dá um aviso", "a nossa inteligência artificial acredita"), o que indica vínculo com a VQuiz. As aulas 1.4, 1.5, 1.7 e 1.8 são em boa parte tutorial da VQuiz. O próprio autor diz que a estrutura vale pra qualquer ferramenta (1.1).

## 4. Frameworks e Métodos

| Nome | Criador | Propósito | Estrutura | Fontes |
|------|---------|-----------|-----------|--------|
| **Estrutura Mestre de um Quiz de Alta Conversão** | Henrique Melo (modelada de funis escalados) | Esqueleto de qualquer quiz de venda | 1ª dobra (promessa *ou* teste) → Mapeamento → Identificação → Confirmação, com blocos de Autoridade, Prova e Small Yes → (Captura) → Resultado: diagnóstico personalizado → Pitch | 1.3, 1.4 |
| **2 padrões de abertura** | idem | Gancho da 1ª etapa | (a) Promessa específica "Descubra como [meta]"; (b) Teste/diagnóstico gratuito ("Descubra em 30s por que...") | 1.3, 1.5 |
| **Small Yes** | atribuído a *As Armas da Persuasão* | Gerar congruência pro "sim" final | Perguntas óbvias de concordância (3 "sins" antes da oferta) | 1.3, 1.4 |
| **Regra ticket x final do quiz** | Henrique Melo | Decidir fim do funil | Low ticket (17–97, até 297) → botão de compra no quiz; ticket alto → quiz curto que aquece + VSL | 1.2, 1.3 |
| **Mini VSL no meio do quiz** | observado nos funis | Lead chegar mais preparado na oferta | Vídeo curto numa etapa, demais blocos aparecem só após X segundos | 1.3, 1.4 |
| **Garimpo de funis escalados** | Henrique Melo | Lista de referências | Biblioteca de Anúncios → "Todos os anúncios" → buscar "inlead.digital" → AdSparrow filtrando 3–4+ anúncios ativos por criativo → fazer o funil até o fim | 1.6, 1.7 |
| **Clonar → Modelar (conservador / turbinado)** | VQuiz | Atalho sem virar cópia | Clonar link (Inlead/XQuiz) → modelar: conservador troca palavras; turbinado procura lacunas e reescreve → (traduzir) | 1.7 |
| **Leitura de métricas do quiz** | Henrique Melo | Saber onde mexer | Taxa de interação (1ª etapa) + taxa de conclusão + perda entre etapas; queda brusca → editar a etapa | 1.8 |
| **Teste A/B contínuo de 1ª etapa** | Henrique Melo / VQuiz | Subir taxa de interação | Uma variável por teste (headline → imagem → sem imagem); até 5 variantes; tráfego meio a meio; mesma URL; marcar vencedor e abrir novo teste | 1.5, 1.8 |
| **Briefing estratégico como matriz** | VQuiz (IA) | Uma pesquisa alimentando quiz, imagens e anúncios | Produto melhorado, público, dores/crenças/objeções, mecanismo único, especialista, oferta → gera quiz; copiado pro ChatGPT gera imagens e anúncios | 1.4, 1.5 |

## 5. Regras Cardinais

| Regra | Absoluteness | Fontes |
|-------|--------------|--------|
| A 1ª etapa é a mais importante do quiz: se a pessoa não clica em continuar, não vê mais nada. É onde mais se testa. | máxima | 1.5, 1.8 (e 1.3) |
| Não rodar funil "cego": sem métrica por etapa você perde a principal vantagem do quiz. | máxima | 1.2, 1.4, 1.8 |
| Quiz feito com IA genérica só serve se você conectar banco de dados e garantir que os números batem; senão otimiza com métrica errada. | alta | 1.4 |
| Modelar, não copiar: quem copia o funil dos outros fica sempre atrás. | alta | 1.6, 1.7 |
| Mais importante que a média do mercado é conhecer as métricas da sua operação. | alta | 1.3, 1.8 |
| Toda pergunta do quiz serve pra subir o nível de consciência: tem problema → precisa resolver agora → existe solução → a sua oferta é a solução. | alta | 1.3 |
| Low ticket não leva VSL no final; VSL é pra produto mais caro. | média | 1.2, 1.3 |
| Botão na primeira dobra; imagem leve; o quiz tem que abrir rápido. | média | 1.5 |
| Otimização é trabalho contínuo e infinito. | média | 1.8 |

## 6. Glossário Preliminar

| Termo | Definição (como o autor usa) |
|-------|-----------------------------|
| Funil de quiz | Sequência de etapas interativas (perguntas, vídeos, provas) que termina em diagnóstico + oferta |
| Etapa / lâmina | Cada tela do quiz. "Lâmina única" = página de vendas inteira numa tela só |
| Primeira dobra / primeira etapa | Tela de abertura; leva a promessa ou o teste e o botão continuar |
| Estrutura Mestre | O esqueleto padrão do quiz de alta conversão (seção 4) |
| Mapeamento | Perguntas sobre o estado atual da pessoa (ponto A) |
| Identificação | Perguntas que fazem a pessoa perceber que tem um problema |
| Confirmação | Momento em que a pessoa reconhece o problema e que outras soluções falharam |
| Small Yes | Perguntas óbvias de concordância pra gerar congruência com o sim final |
| Bloco de autoridade | Etapa apresentando o especialista (foto, recado, nº de pessoas ajudadas) |
| Prova | Depoimentos/cases em formato print de WhatsApp, post de Facebook ou Instagram, carrossel |
| Diagnóstico personalizado / relatório | Resultado com gráficos (barra, radar, linha), muitas vezes igual pra todos |
| Pitch | Etapa da oferta |
| Mini VSL | Vídeo curto no meio do quiz |
| VSL | Vídeo de vendas, usado no fim pra produto mais caro |
| Taxa de interação | % de acessos únicos que passaram da 1ª etapa |
| Taxa de conclusão | % de acessos únicos que chegaram à última etapa (preço) |
| Funil escalado / validado | Funil com muitos anúncios ativos (sinal de que dá dinheiro) |
| Clonar x modelar | Clonar = importar o quiz; modelar = reescrever mantendo a lógica (conservador/turbinado) |
| Briefing estratégico | Estudo gerado pela IA da ferramenta: produto, público, dores, mecanismo único, especialista, oferta |
| Mecanismo único | O que diferencia a solução das outras do mercado |
| Teste A/B | Variantes da 1ª etapa ou do quiz completo disputando o mesmo tráfego |

## 7. Classificação de Fontes por Volume

| Volume | Primárias (âncora) | Suporte (enriquecimento) |
|--------|-------------------|--------------------------|
| VOL-01 | 1.2, 1.3 | 1.1 (pilares, ferramenta), 1.4 (ordem das perguntas na prática, small yes, captura, diagnóstico), 1.8 (por que métrica importa) |
| VOL-02 | 1.4, 1.5 | 1.1 (ferramenta), 1.3 (blocos), 1.6 (inspiração de 1ª dobra) |
| VOL-03 | 1.6, 1.7, 1.8 | 1.2 (vantagem dos dados), 1.3 (nº de etapas x métricas), 1.5 (testar variações da 1ª etapa) |

## 8. Plano de Volumes

| ID | Título | Domínios | Âncora | Estimativa | O que cobre |
|----|--------|----------|--------|------------|-------------|
| VOL-01 | **Fundamentos e Estrutura Mestre** | D1, D2, D3, D8 | 1.3 | ~300–350 linhas | Por que quiz, os 2 padrões de abertura, a ordem lógica das perguntas, autoridade/prova/Small Yes, diagnóstico e pitch, ticket x VSL, captura de lead, galeria dos funis analisados |
| VOL-02 | **Construção e Personalização** | D4, D5 | 1.4 | ~300 linhas | IA genérica x ferramenta pronta, montar por blocos, montar com IA a partir do briefing, todos os tipos de bloco, identidade visual, 1ª dobra, domínio e bloqueio de cópia |
| VOL-03 | **Referências, Modelagem e Otimização** | D6, D7 | 1.8 | ~300–350 linhas | Garimpar funis escalados, modelar a 1ª dobra, clonar/traduzir/modelar, métricas e benchmarks, diagnóstico de quedas, teste A/B contínuo |

**Docs transversais:** README.md · REGRAS-CARDINAIS.md · REPERTORIO.md · GLOSSARIO.md

**Sequência:** segue o backbone do autor (entender → construir → escalar). VOL-01 é pré-requisito: a 1.4 e a 1.7 pressupõem a Estrutura Mestre.

**Ressalva de tamanho:** a fonte total é curta (~11 mil palavras). 300 linhas por volume é alcançável sem encher linguiça só com 3 volumes; mais que isso diluiria.

## 9. Catálogo de Artefatos Acionáveis

| Tipo | Nome | Fonte | Volume |
|------|------|-------|--------|
| template | Estrutura Mestre (sequência de blocos do quiz) | 1.3, 1.4 | VOL-01 |
| swipe | Aberturas "Descubra como..." e "Teste/diagnóstico gratuito" (exemplos reais citados) | 1.3, 1.4, 1.5, 1.7 | VOL-01 |
| swipe | Perguntas-exemplo por fase (mapeamento, identificação, Small Yes) | 1.3, 1.4 | VOL-01 |
| reference_table | Ticket x estrutura final (sem VSL até ~97/297; VSL acima; casos de 37, 39, 47, 75, 300 reais, mentorias 5–30 mil) | 1.2, 1.3 | VOL-01 |
| benchmark | Nº de etapas: média 15–20 | 1.3, 1.4 | VOL-01 |
| checklist | Blocos disponíveis numa ferramenta de quiz (pergunta, resposta múltipla, preço, captura, contagem/escassez, vídeo, áudio estilo WhatsApp, prova, gráfico, carregando, oferta) | 1.4 | VOL-02 |
| script/prompt | Prompt de imagem-gatilho da 1ª etapa (+ briefing colado) | 1.5 | VOL-02 |
| script/prompt | Prompt de logo horizontal; ajuste pra fundo escuro; "sem espaço sobrando" | 1.5 | VOL-02 |
| script/prompt | Prompt de modelar imagem de referência pro seu nicho | 1.6 | VOL-03 |
| workflow | Briefing → quiz → imagens → anúncios | 1.4, 1.5 | VOL-02 |
| workflow | Garimpo na Biblioteca de Anúncios + AdSparrow | 1.6 | VOL-03 |
| workflow | Clonar → modelar (conservador/turbinado) → traduzir → organizar em pastas | 1.7 | VOL-03 |
| benchmark | Taxa de interação: mínimo 40%, ideal 50% (caso real 47%) | 1.8 | VOL-03 |
| benchmark | Perda entre etapas: normal até ~2%; acima de 5% "tá errado" (caso real: 13% da 21→22, etapa de captura) | 1.8 | VOL-03 |
| benchmark | Caso real: 36 mil acessos únicos → 11 mil na última etapa | 1.8 | VOL-03 |
| workflow | Teste A/B da 1ª etapa (até 5 variantes, 50/50, mesma URL, marcar vencedor) | 1.8 | VOL-03 |
| reference_table | Ferramentas citadas: VQuiz, Inlead, XQuiz, Manus, Lovable, ChatGPT, Squoosh, Vturb, YouTube, AdSparrow, Biblioteca de Anúncios | 1.1–1.8 | REPERTÓRIO |

## 10. Problemas / Gaps / Contradições

- **Contradição (1.8):** no mesmo vídeo o autor diz "se tiver entre etapas mais do que 5% de perda, tá errado" e "o normal é no máximo aí 2% entre uma etapa e outra". Registrar as duas; leitura possível: 2% é o normal, 5% é o limite do aceitável.
- **Faixa de ticket da página de vendas (1.2):** "dificilmente vai passar de 297" e "10, 37, 47, 97, no máximo 297"; na 1.3 o low ticket do quiz é "17, 27, 37, até 97". Faixas diferentes, sem conflito real.
- **Diagrama ausente (1.3):** "essa estrutura que vai estar aqui embaixo pra você". Não está na página da aula. A estrutura é reconstruída pela fala.
- **Conteúdo visual:** o que aparece na tela (perguntas exatas dos funis analisados, painel de métricas, prompts completos da IA) só entra pelo que é falado. Os prompts da 1.5 foram lidos em voz alta e entram como estão.
- **Viés de ferramenta:** metade do curso é tutorial da VQuiz. A KB separa princípio (vale em qualquer ferramenta) de recurso de ferramenta.
- **Sem conteúdo sobre:** tráfego/criativo pro quiz (só a menção de gerar anúncios a partir do briefing), integração com checkout, automação pós-captura, quiz pra serviço/mentoria high ticket com aplicação. Bônus citado por aluno nos comentários ("modelos prontos de quiz validados") não existe no curso.
- **Erros de transcrição automática** a corrigir na composição: "Skush/Squish" = Squoosh; "Ed Sparrow" = AdSparrow; "em Lead" = Inlead; "Cheat Sheet de 297" = "ticket de 297"; "Quisk" = quiz; "Tella" às vezes = "tela"; "carocial" = carrossel; "destrave estragueado" = trecho ininteligível.

## 11. Voice Profile — Henrique Melo

- **Tom:** formalidade 2/10, energia 7/10, diretividade 8/10. Fala de tutorial ao vivo, mostrando a tela.
- **Catchphrases:** "Fechou?" (fecha quase toda ideia), "Tamo junto" (encerramento), "Olha que legal" / "olha só", "bizarro" (elogio), "Legal?", "Show de bola", "barbadinha", "pegar a nata", "mão na massa", "assiste, aplica, tem resultado".
- **Estilo didático:** demonstração em tempo real (clica, cria, mostra); vai e volta entre princípio e exemplo; usa casos de nichos variados (medo de dirigir, emagrecimento, fitness, TikTok Shop, dentista); sempre lembra que é visão geral e que vai aprofundar na próxima aula.
- **Metáforas:** "rodar funil cego"; "luta entre duas versões" (teste A/B do quiz completo); "lâmina" pra tela; "página de vendas dentro do quiz" pro bloco de oferta.
- **Terminologia preferida:** etapa, lâmina, primeira dobra, modelar (não copiar), funil escalado, taxa de interação, low ticket, VSL, small yes, nível de consciência.
