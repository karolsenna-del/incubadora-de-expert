# Handoff — M4 precisa acompanhar a v2 do Agente da Autoridade Tríplice

**De:** @gpt-publisher · **Para:** @course-creator · **Data:** 20/10/2026
**Situação:** M4 ainda não foi gravado (confirmado pela Karol em 20/10), então dá pra ajustar roteiro e materiais antes da gravação.

## O que mudou no agente

A Karol decidiu (20/10) que o Agente da Autoridade Tríplice passa a entregar, além de Expert + Persona + Produto:

1. **Tese Autoral com a Frase-Tese Autoral.** Critério: curta e memorável, a bandeira que a pessoa repete de cabeça. O critério "até 15 palavras, polarizadora, 5 opções" do M4.2 **deixa de valer**
2. **Bio do Instagram.** Modelo "Eu ajudo [persona] a conquistar [resultado], [atratividade]" + CTA, até 150 caracteres. A estrutura "bio em 3 linhas (quem sou + pra quem / como entrego / CTA)" do roteiro da Aula 4 **deixa de valer**

Destaques e posts fixados **não** entram no agente: continuam nos materiais M4.4 e M4.5.

Texto do agente: `agents/gpt-publisher/output/autoridade-triplice/custom-gpt/Instructions-v2.txt` (aguardando aprovação final da Karol e colagem no GPT).

## Onde o curso cita o que mudou (mapeado, não alterado)

| Arquivo | Trecho | O que conflita |
|---------|--------|----------------|
| `roteiros/m4-roteiros.md` | Aula 3 (agente) — l. ~624 | Agora o agente já entrega frase-tese e bio; a aula pode anunciar isso |
| `roteiros/m4-roteiros.md` | Aula 4, Ponto 1 (bio) — l. 182-185 e 662-668 | Bio em 3 linhas → bio "Eu ajudo…" que já vem pronta do agente |
| `roteiros/m4-roteiros.md` | Aula 4, Ponto 2 (frase-tese) — l. 186-190 e 670-676 | Frase-tese gerada no M4.2 com 5 opções → já vem do agente |
| `roteiros/m4-roteiros.md` | Materiais/ordem — l. 198, 642, 688 | M4.2 aparece como material de geração |
| `materiais/M4/M4.1 - Relatório da Autoridade Tríplice.md` | "Como usar" | Diz que a frase-tese é feita na Aula 4 (M4.2) |
| `materiais/M4/M4.2 - Minha Frase-Tese Autoral.md` | Prompt inteiro | Prompt de 5 opções polarizadoras ficou redundante |
| `materiais/M4/M4.5 - Meus Posts Fixados.md` | Pinned 2 | Fonte da frase-tese passa a ser o relatório do agente |
| `business/producao/expert360/descricoes.md` l. 156 e `business/campanhas/area-de-membros/site/js/descricoes-aulas.js` l. 80 | Descrição da A4 | Cita frase-tese entre as peças montadas na aula |

O que fazer com o M4.2 (remover, ou virar só o espaço de registro da frase-tese) e como a Aula 4 fica é decisão do course-creator com a Karol.

## Resolvido em 30/10/2026

Todos os trechos do mapa foram ajustados (decisão: M4.2 fica como registro da frase-tese e da bio). O site da área de membros ainda não foi publicado com as descrições novas.
