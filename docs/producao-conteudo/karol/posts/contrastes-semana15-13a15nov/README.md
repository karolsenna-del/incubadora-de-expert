# Capas fotográficas de contraste — 13 a 15/11/2026

Revisão da correção explícita da Karol: fotos reais como imagem principal, nos seis arquivos e pares obrigatórios. Nenhuma ilustração ou foto da Karol. Roteiro preservado nesta revisão.

## Arquivos

- `capa-sex-13-11.png`: QUEM ESPERA TER PÚBLICO X QUEM VENDE SEM AUDIÊNCIA. Mulher sozinha no auditório à esquerda; duas pessoas fechando um acordo à direita.
- `capa-sab-14-11.png`: SERVIDOR QUE ESPERA X SERVIDOR QUE CONSTRÓI. Pessoa aguardando à esquerda; mulher trabalhando no laptop à direita.
- `capa-dom-15-11.png`: QUEM ACUMULA CONTEÚDO X QUEM COLOCA EM ORDEM PARA VENDER. Papéis acumulados à esquerda; mulher organizando post-its à direita. Apoio: AS 7 LISTAS DA SEMANA.
- `preview-contato.png`: comparação das três capas, 1080 × 450, cada miniatura com 360 × 450.
- `gerar_capas.py`, `manifesto.json` e `assets-fotos/creditos.json`: reprodução, mapeamento, URLs de página e imagem, créditos e hashes das fontes.

## Direção e enquadramento

Capas 1080 × 1350, RGB. Preto #090909, branco #FFFFFF e laranja #FF6B1A na tipografia e nos elementos gráficos; cores naturais das fotos preservadas. Headline grande no topo em áreas sólidas, contraste branco/preto ou preto/branco. Divisão central com linha laranja e X laranja como pivô. Identidade discreta no rodapé: KAROL SENNA · INCUBADORA DE EXPERT.

Os painéis fotográficos ocupam y=470 até 1239: 57,04% da área. Retratos têm corte mínimo proporcional. As paisagens usam recorte editorial quadrado sobre fundo ampliado, desfocado e escurecido da própria foto: preserva as pessoas e o gesto do acordo sem esticar os corpos. Não há texto sobre fotos, olhos ou boca. Rostos, mãos e elementos que distinguem os temas foram conferidos nas miniaturas.

Observação da fonte obrigatória: `05-conteudo-caotico.jpg` mostra mãos e braços entre papéis, sem rosto no original. Mantida exatamente essa imagem, conforme o mapeamento; não foi inventado um rosto nem substituído o arquivo.

## Fontes e créditos Pexels

As seis fotos já vieram em `assets-fotos/`. Os endereços públicos de imagem em largura 1400 foram consultados para identificar os originais: **os seis downloads tiveram SHA-256 idêntico aos seis arquivos locais**. Nenhuma foto local foi substituída. Créditos de exibição no Pexels; os metadados internos podem trazer nomes pessoais/estúdio diferentes (Dimenshteyn e Ludmila Nilava).

- **01-espera-publico.jpg** — Anna / Pexels. Mulher sozinha no auditório vazio. [Página](https://www.pexels.com/photo/30143692/) · [Imagem original utilizada](https://images.pexels.com/photos/30143692/pexels-photo-30143692.jpeg?auto=compress&cs=tinysrgb&w=1400).
- **02-venda-direta.jpg** — MART PRODUCTION / Pexels. Duas pessoas fechando uma conversa com aperto de mãos. [Página](https://www.pexels.com/photo/7643738/) · [Imagem original utilizada](https://images.pexels.com/photos/7643738/pexels-photo-7643738.jpeg?auto=compress&cs=tinysrgb&w=1400).
- **03-espera-rotina.jpg** — Livia Covaliov / Pexels. Pessoa sentada em postura de espera, diante de uma janela. [Página](https://www.pexels.com/photo/9668811/) · [Imagem original utilizada](https://images.pexels.com/photos/9668811/pexels-photo-9668811.jpeg?auto=compress&cs=tinysrgb&w=1400).
- **04-construcao-propria.jpg** — Andrea Piacquadio / Pexels. Mulher trabalhando em projeto no laptop. [Página](https://www.pexels.com/photo/3756681/) · [Imagem original utilizada](https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=1400).
- **05-conteudo-caotico.jpg** — cottonbro studio / Pexels. Mãos de uma pessoa entre papéis e conteúdo acumulado; original sem rosto. [Página](https://www.pexels.com/photo/5185086/) · [Imagem original utilizada](https://images.pexels.com/photos/5185086/pexels-photo-5185086.jpeg?auto=compress&cs=tinysrgb&w=1400).
- **06-organizacao-venda.jpg** — Mikhail Nilov / Pexels. Mulher organizando post-its em um planejamento. [Página](https://www.pexels.com/photo/6592666/) · [Imagem original utilizada](https://images.pexels.com/photos/6592666/pexels-photo-6592666.jpeg?auto=compress&cs=tinysrgb&w=1400).

Licença: [Pexels](https://www.pexels.com/license/). Sem API paga; o gerador é inteiramente local e funciona sem rede. As consultas gratuitas de origem foram apenas para a documentação.

## Reprodução

Requer Python 3, Pillow e DejaVu Sans Bold em `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`.

```sh
python3 docs/producao-conteudo/karol/posts/contrastes-semana15-13a15nov/gerar_capas.py
PYTHONPYCACHEPREFIX=/tmp/capas-pycache python3 -m py_compile docs/producao-conteudo/karol/posts/contrastes-semana15-13a15nov/gerar_capas.py
```

O script também funciona a partir de outro diretório; resolve os assets relativamente ao próprio arquivo. Verifica margens dos textos, seis hashes diferentes, dimensões/modo e decodificação dos PNGs. Não edita os JPEGs nem o roteiro.

## Checklist da revisão e QA

- [x] Usar os pares 01/02, 03/04 e 05/06, esquerda/direita, respectivamente.
- [x] Executar o gerador e atualizar os três PNGs, preview e manifesto.
- [x] Validar três capas RGB em 1080 × 1350 e preview RGB em 1080 × 450.
- [x] Executar `py_compile`, cache em `/tmp`.
- [x] Abrir o preview final em 360 × 450 por capa: seis imagens diferentes; pessoas reconhecíveis; auditório/espera, laptop/acordo, papéis/post-its distinguíveis.
- [x] Conferir títulos completos, acentos, apoio de domingo, contraste, margens e ausência de texto sobre rostos. Nenhuma palavra cortada.
- [x] Conferir as seis URLs públicas contra os arquivos locais por SHA-256: todos idênticos.
- [x] Preservar roteiro e JPEGs; conferir diff e mudanças restritas à worktree.
- [x] Sem commit, push, publicação ou API paga.

Execução e inspeção visual: Codex. Revisão independente por outra IA não realizada: serviço de equipe indisponível nesta sessão. Esta entrega não publica os posts.
