---
name: squad-carrossel-arcane
description: |
  Squad pra producao de carrosseis e posts estaticos pra Instagram. Faz a ARTE do
  post — nao escreve a copy.

  Trabalha em duas camadas visuais:
  - Arte em CSS (HTML+CSS renderizado aqui no Claude Code, sem custo de API) — a
    moldura do post: fundo, tipografia, layout, avatar. Quem faz: Identity Designer.
  - Imagem gerada por IA (GPT Image 2 / Nano Banana Pro, gasta credito) — a
    ilustracao de conteudo que encena a tese do card. Quem faz: Image Director.
  Um carrossel pode usar as duas: a imagem de IA entra dentro da moldura CSS.

  Use quando o aluno quer:
  - Definir o template de arte CSS dos posts (padrao reutilizavel)
  - Definir o estilo padrao das imagens geradas por IA (padrao reutilizavel)
  - Gerar as imagens de IA dos cards de um carrossel
  - Produzir carrossel ou post estatico a partir de copy pronta
  - Listar templates e estilos ja salvos

  Output em ~/Downloads/{nome-do-carrossel}/ com PNGs numerados prontos pra postar.
---

# Squad Carrossel Arcane

Ativacao: `/squad-carrossel-arcane`

## O que faz

Transforma copy pronta em carrossel ou post estatico de Instagram — PNGs prontos
pra postar.

## O que NAO faz

- **Nao escreve a copy nem o texto do post** — isso o aluno traz pronto
- **Nao posta em rede social** — entrega os arquivos
- Apresentacoes de palestra/aula → use `/slideForgeV2`
- Copy/roteiro do post → use `/squad-conteudo-arcane`

## As duas camadas visuais

| Camada | O que e | Onde e feita | Custo | Agente |
|--------|---------|--------------|-------|--------|
| **1. Arte em CSS** | A moldura do post: fundo, tipografia, layout, avatar, caixa de texto | Aqui, no Claude Code (HTML+CSS → PNG) | Nenhum — refaz a vontade | Identity Designer |
| **2. Imagem de IA** | A ilustracao de conteudo do card: a cena que encena a tese e para o scroll | GPT Image 2 / Nano Banana Pro | Gasta credito/API | Image Director |

Um carrossel forte normalmente usa as duas — a imagem de IA entra **dentro** da
moldura CSS. Carrossel so-texto usa so a camada 1.

## Os dois padroes reutilizaveis

O aluno define uma vez e reusa em todo post:

- **Template de arte** (camada 1) → Identity Designer. A cara dos posts.
- **Estilo de imagem** (camada 2) → Image Director. Faz toda imagem gerada sair na
  linguagem visual do aluno, em qualquer sessao nova.

## Quem faz o que

| Agente | Funcao |
|--------|--------|
| **carrossel-chief** | Apresenta, detecta estado, roteia |
| **identity-designer** | Cria/ajusta o template de arte em CSS |
| **image-director** | Define o estilo de imagem e gera as imagens de IA dos cards |
| **producer** | Junta copy + template + imagens e entrega os PNGs |

## Fluxos tipicos

- **Carrossel com imagem:** Image Director gera as imagens → Producer monta o post
- **Carrossel so-texto:** vai direto no Producer
- **Primeiro uso:** Identity Designer cria o template de arte antes de qualquer producao
