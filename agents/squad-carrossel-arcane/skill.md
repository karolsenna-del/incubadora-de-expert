---
name: squad-carrossel-arcane
description: |
  Squad pra producao de carrosseis e posts estaticos pra Instagram.
  Identity Designer cria os templates visuais do aluno (3-5 ideais), Producer monta os PNGs.

  Use quando o aluno quer:
  - Criar templates visuais do zero com identidade propria
  - Produzir carrossel a partir de copy pronta
  - Produzir post estatico
  - Adicionar templates novos
  - Listar templates ja criados

  Output em ~/Downloads/{nome-do-carrossel}/ com PNGs numerados prontos pra postar.
---

# Squad Carrossel Arcane

Ativacao: `/squad-carrossel-arcane`

## O que faz

Pipeline end-to-end de producao de carrosseis Instagram. 2 fluxos:

1. **Setup** (primeiro uso): Identity Designer cria 3-5 templates visuais a partir das tuas referencias
2. **Producao** (normal): Producer recebe tua copy + escolhe template + entrega PNGs em ~/Downloads/

## Quando usar

- Aluno tem copy pronta e quer transformar em carrossel/post visual
- Aluno quer padronizar identidade visual dos posts
- Aluno quer escalar producao de conteudo sem depender de designer

## Quando NAO usar

- Pra criar apresentacoes de palestra/aula → use `/slideForgeV2`
- Pra criar copy/roteiro do post → use `/squad-conteudo-arcane`
- Pra postar automaticamente → squad nao posta, so entrega arquivos
