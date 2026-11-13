# Capas de contraste — 13 a 15/11/2026

Capas para os carrosséis das 20h do roteiro `desafio-rota100k-semana15-roteiros.md`. Exportação RGB, 1080 × 1350 (4:5), sem preço. Preto, branco e laranja #FF6B1A. Identidade discreta: KAROL SENNA · INCUBADORA DE EXPERT.

- **capa-sex-13-11.png** — sexta 13/11, 20h. **QUEM ESPERA TER PÚBLICO X QUEM VENDE SEM AUDIÊNCIA**. Foto à direita em coluna de 470 × 1350 (43,5%); contraponto em dois blocos à esquerda.
- **capa-sab-14-11.png** — sábado 14/11, 20h. **SERVIDOR QUE ESPERA X SERVIDOR QUE CONSTRÓI**. Foto à esquerda, reenquadrada, em coluna de 470 × 1350 (43,5%); blocos à direita.
- **capa-dom-15-11.png** — domingo 15/11, 20h. **QUEM ACUMULA CONTEÚDO X QUEM COLOCA EM ORDEM PARA VENDER**. Apoio **AS 7 LISTAS DA SEMANA**. Retrato aproximado em faixa superior de 1080 × 600 (44,4%); contraste em colunas abaixo.

## Foto real e substituições

As três capas usam `business/campanhas/lp-diagnostico-expert/karol.jpg`, foto real autorizada e rastreada. A consulta à árvore de `origin/master` confirmou a ausência de `business/campanhas/lives-semanais/assets/live-26-foto-blazer.jpg` e `business/campanhas/crm-reativacao-leads/paginas-vendas/site/black-expert/karol.jpg`.

Foram localizadas as alternativas rastreadas `business/campanhas/crm-reativacao-leads/paginas-vendas/site/karol.jpg` e `business/campanhas/lp-minitreinamento/karol.jpg`. Ambas são duplicatas exatas da foto autorizada (SHA-256 `208d91992e45022aa9f840b9eb5a042f87877448a2d415ca290b28e5bac3a831`). Por isso foi usada a fonte autorizada existente, variando lado, recorte, escala e composição, sem simular fotos diferentes. Nenhuma imagem gerada por IA.

## Reprodução

Requisitos: Python 3, Pillow e fonte DejaVu Sans Bold em `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`. Pillow usado: 13.0.0. Instalação gratuita: `python3 -m pip install Pillow==13.0.0` em ambiente virtual.

Execute `python3 docs/producao-conteudo/karol/posts/contrastes-semana15-13a15nov/gerar_capas.py` na raiz do repositório, ou use o caminho absoluto do script a partir de qualquer pasta. O script lê a foto do próprio repositório e grava as três capas, `preview-contato.png` e `manifesto.json` ao lado dele. Não usa rede nem API. A fonte determina as métricas; não é substituída silenciosamente.

## QA executado

- Gerador executado com sucesso; três PNG RGB de 1080 × 1350, não vazios, abertos e decodificados por Pillow.
- `py_compile` aprovado; cache direcionado para /tmp.
- Headlines, apoio, fotos e usos registrados no manifesto e neste README; textos obrigatórios validados mecanicamente.
- Preview de contato inspecionado em 1080 × 450, com cada capa a 360 × 450: leitura clara das headlines, contraste forte, X laranja, olhos e boca descobertos, margens preservadas, palavras completas. Foto ocupa mais de 40% em todas.
- Apenas as três linhas “Capa” dos carrosséis solicitados foram alteradas no roteiro.
- Execução e revisão visual pelo Codex. Revisão por outra IA indisponível nesta sessão; material local, sem publicação. Ferramenta de equipe Arcane não disponível na sessão.
- Sem commit e sem push.
