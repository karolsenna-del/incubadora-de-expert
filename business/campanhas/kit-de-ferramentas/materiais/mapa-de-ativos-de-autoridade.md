# Mapa de Ativos de Autoridade — especificação da ferramenta

## Identificação e entrega

- **Título no Google Drive:** Mapa de Ativos de Autoridade — Incubadora de Expert
- **ID:** `1yFGslckpBPkFRAfnMjkGlh9OTXWE2UvyIY170wnPacw`
- **Link mestre:** https://docs.google.com/spreadsheets/d/1yFGslckpBPkFRAfnMjkGlh9OTXWE2UvyIY170wnPacw/edit
- **Link de cópia para o público:** https://docs.google.com/spreadsheets/d/1yFGslckpBPkFRAfnMjkGlh9OTXWE2UvyIY170wnPacw/copy
- **Proprietária:** conta Google da Incubadora/Karol
- **Uso original:** bônus da Live 30 — “Seu conhecimento é suficiente para se tornar método”

O link que deve ser divulgado na live é sempre o link `/copy`. O arquivo-mestre não deve ser
compartilhado como editor com o público.

## Objetivo do produto

Em 20–30 minutos, ajudar a expert a reconhecer e priorizar a matéria-prima que já possui para
método, narrativa e posicionamento. A ferramenta organiza formação e conhecimento, experiências
vividas, resultados e provas, erros e aprendizados, padrões de resolução e capacidade de ensinar.

O mecanismo usado é **Saber • Viver • Ensinar**, conforme a definição da ferramenta no Portfólio
Estratégico. A planilha não adiciona teoria nova: traduz esse mecanismo e os materiais da Live 30
em inventário, critérios de priorização e síntese prática.

## Estrutura das abas

### 1. `COMECE AQUI`

- objetivo e regra de ouro;
- roteiro de uso em cinco passos, com tempo total de 20–30 minutos;
- definição operacional de Saber, Viver e Ensinar;
- aviso para não incluir nomes ou dados sensíveis de clientes;
- três modelos de preenchimento marcados como **EXEMPLO**;
- instrução explícita para apagar as linhas de exemplo antes de preencher.

### 2. `INVENTÁRIO`

Possui 100 linhas de trabalho e 20 campos:

1. Selecionar (checkbox);
2. Tipo de linha (`EXEMPLO` ou `MEU ATIVO`);
3. Pilar dominante (`Saber`, `Viver` ou `Ensinar`);
4. Categoria;
5. Ativo de autoridade;
6. Contexto/origem;
7. Problema que ajuda a resolver;
8. Aprendizado/princípio;
9. Evidência disponível;
10. Como pode ensinar/demonstrar;
11. Para quem é relevante;
12. Saber (1–5);
13. Viver (1–5);
14. Ensinar (1–5);
15. Relevância (1–5);
16. Evidência (1–5);
17. Singularidade (1–5);
18. Força média (fórmula);
19. Classificação (fórmula);
20. Observações.

Categorias disponíveis no dropdown:

- Formação / conhecimento
- Experiências vividas
- Resultados / provas
- Erros / aprendizados
- Padrões de resolução
- Capacidade de ensinar

Recursos de uso: checkboxes, dropdowns, filtro, cinco linhas de cabeçalho congeladas, formatação
condicional da classificação e avisos de proteção nas duas colunas de fórmula.

## Critérios e fórmulas

Cada ativo recebe seis notas de 1 a 5:

- **Saber:** compreensão e capacidade de aplicação;
- **Viver:** experiência prática, além do estudo;
- **Ensinar:** capacidade de explicar, demonstrar ou conduzir;
- **Relevância:** utilidade para um problema da pessoa que a expert quer servir;
- **Evidência:** prova responsável disponível;
- **Singularidade:** força da combinação entre contexto, experiência e modo de resolver.

Fórmula de força, no locale `pt_BR`:

```text
=IF(COUNT(L6:Q6)<6;"";ROUND(AVERAGE(L6:Q6);1))
```

A fórmula usa média simples e pesos iguais para manter o cálculo transparente. Classificação:

```text
=IF(R6="";"";IFS(R6>=4;"FORTE";R6>=3;"PROMISSOR";TRUE;"EM EXPLORAÇÃO"))
```

- `FORTE`: força média maior ou igual a 4,0;
- `PROMISSOR`: força média maior ou igual a 3,0 e menor que 4,0;
- `EM EXPLORAÇÃO`: força média menor que 3,0.

### 3. `SÍNTESE`

- recebe apenas os ativos marcados em `Selecionar`;
- ordena automaticamente pela força média, do maior para o menor;
- expõe as seis notas, a média e a classificação;
- destaca o Top 3;
- abre campos para transformar cada ativo em matéria-prima de **método**, **narrativa** e
  **posicionamento**;
- inclui a explicação dos critérios e perguntas de transformação.

A área automática usa `QUERY`, e as células de fórmula têm proteção em modo de aviso para evitar
sobrescrita acidental sem bloquear a proprietária.

## Identidade visual

- carvão/preto nos títulos e cabeçalhos;
- laranja da Incubadora `#FF6B1A` nos destaques e nas abas;
- branco e cinza nas áreas de leitura e preenchimento;
- cabeçalhos fortes, hierarquia por blocos, quebra de texto e grade oculta.

## Regra de compartilhamento

- Karol permanece como `owner` e edita o mestre normalmente;
- permissão pública do mestre: `anyone with link = reader`;
- `allowFileDiscovery = false`;
- participantes recebem `/copy`, entram na própria conta Google e criam uma cópia editável;
- nunca alterar o público para `writer`, pois isso permitiria que todas as pessoas editassem o
  mesmo arquivo-mestre.

## Fontes usadas

- Portfólio Estratégico, linha “Mapa de Ativos de Autoridade” — ID
  `1tCT11UNQfEC4DP8818cwNkSb765YE-FRF-Cy1DHpXAg`;
- `business/campanhas/lives-semanais/live-30-roteiro.md`;
- materiais do Expert360 sobre Autoridade Tríplice e transformação da trajetória em autoridade;
- identidade visual da Incubadora de Expert.

Não foram incluídos dados sensíveis de clientes nem cases inventados. Os exemplos são modelos
genéricos, estão marcados como `EXEMPLO` e devem ser apagados antes do uso.

## Verificações realizadas em 16/09/2026

- Drive API: arquivo ativo, proprietário correto e permissão `anyone/reader` sem descoberta;
- Sheets API: três abas, valores, fórmulas, filtros, checkboxes, dropdowns, congelamento,
  formatação condicional, cor `#FF6B1A` e proteções de fórmula;
- teste funcional: marcar um exemplo preencheu a síntese com notas, média e classificação; a
  checkbox foi desmarcada após o teste;
- acesso sem sessão: `/edit` respondeu HTTP 200 e exibiu o conteúdo público em modo leitor;
- `/copy` redirecionou para o login do Google, comportamento esperado para criar uma cópia na
  conta individual da participante.