# Capas de contraste — 13 a 15/11/2026

Revisão conforme a correção da Karol: cada capa comunica seu próprio tema por uma cena autoral. Nenhuma foto da Karol, retrato reaproveitado, imagem externa ou banco de ícones. Ilustrações construídas com formas geométricas no próprio gerador, gratuitamente, sem rede nem API.

## Conceitos visuais

- **capa-sex-13-11.png** — “QUEM ESPERA TER PÚBLICO” X “QUEM VENDE SEM AUDIÊNCIA”. Auditório com palco e vinte assentos vazios à esquerda; duas pessoas conversando frente a frente e fechando um acordo sobre a mesa à direita. A cena contrasta expectativa de plateia com negociação individual.
- **capa-sab-14-11.png** — “SERVIDOR QUE ESPERA” X “SERVIDOR QUE CONSTRÓI”. Relógio grande e cadeiras de espera institucional à esquerda; desenho de projeto e maquete com fundação, pilares e vigas à direita. Construção de autonomia sem sugerir jornada excessiva, abandono do serviço ou conflito de valores.
- **capa-dom-15-11.png** — “QUEM ACUMULA CONTEÚDO” X “QUEM COLOCA EM ORDEM PARA VENDER”. Folhas sobrepostas e linhas emaranhadas à esquerda; sete documentos numerados em uma sequência contínua, terminando na venda, à direita. Apoio: “AS 7 LISTAS DA SEMANA”. São documentos físicos esquemáticos, sem interface de software.

## Composição

1080 × 1350, RGB. Preto, branco e laranja #FF6B1A. Divisão vertical em dois lados e X sobre fundo laranja como pivô. Headline no topo, separada das cenas. Área reservada às imagens: y=530 a 1220, equivalente a 51,1% da capa. Identidade discreta no rodapé: “KAROL SENNA · INCUBADORA DE EXPERT”.

## Reprodução

Requer Python 3, Pillow e DejaVu Sans Bold em `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`. Execute da raiz:

```sh
python3 docs/producao-conteudo/karol/posts/contrastes-semana15-13a15nov/gerar_capas.py
PYTHONPYCACHEPREFIX=/tmp/capas-pycache python3 -m py_compile docs/producao-conteudo/karol/posts/contrastes-semana15-13a15nov/gerar_capas.py
```

Funciona também de qualquer diretório com o caminho absoluto do script. Gera as três capas, `preview-contato.png` (1080 × 450, cada capa a 360 × 450) e `manifesto.json`, com conceitos, textos, dimensões e origem visual.

## QA desta revisão

- Gerador executado com sucesso; três PNG abertos e decodificados, todos RGB e 1080 × 1350.
- `py_compile` aprovado, cache fora da pasta do projeto.
- Limites de texto conferidos automaticamente pelo gerador; headlines completas, sem palavras cortadas.
- Preview aberto e inspecionado visualmente em 360 × 450 por capa: headlines legíveis, margens preservadas, cenas desobstruídas e claramente diferentes. Identidade deliberadamente secundária.
- Nenhum roteiro alterado nesta revisão. Sem commit, push, publicação, downloads ou API paga.
- Execução e inspeção pelo Codex. Revisão independente por outra IA não realizada; serviço de equipe indisponível nesta sessão.
