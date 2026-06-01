---
task: "Construir Briefing + Copy Redigida da Pagina"
responsavel: "@copy-pagina"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "documento-mestre.md aprovado pelo usuario (especificamente Bloco 1 Tese e Proposta + Bloco 2 Publico)"
Saida: "briefing-pagina.md (estrutura completa de 12 secoes ou variante justificada + COPY REDIGIDA secao por secao — texto final, nao esqueleto)"
Checklist:
  - "Documento mestre lido e proposta/publico extraidos"
  - "Estrutura escolhida (12 secoes padrao OU variante justificada por contexto)"
  - "Hero com headline aplicando formula Tempo + Resultado + Mecanismo"
  - "Secao Mecanismo/SO articulada (peca que faltava com nome — RC-003)"
  - "Identificacao com ruminacoes do publico (literais — extraidas do doc mestre, nao parafrase)"
  - "Autoridade + provas (depoimentos / numeros / cases reais — sem inventar)"
  - "Conteudo do evento em cards tangiveis (RC-002 — produto, nao aula)"
  - "Oferta com preco respeitando RC-015 (Preco da Escala: faixa R$27-R$67 sweet spot R$38-R$57, default R$38; preco fora da faixa exige justificativa de nicho premium)"
  - "Matadora de objecoes (top 3 do publico ja respondidas)"
  - "FAQ pratico (5-8 perguntas operacionais)"
  - "CTA final + suporte WhatsApp"
  - "COPY REDIGIDA em CADA secao (texto pronto pra entrar na pagina, nao apenas esqueleto)"
  - "Validacao contra 4 inimigos da conversao"
  - "Mobile-first: primeira dobra resolve headline + promessa + CTA sem rolar"
  - "Validacao contra RC-002, RC-003, RC-005, RC-015 quando aplicaveis"
  - "Briefing aprovado EXPLICITAMENTE pelo usuario"
execution_type: "interactive"
---

# Task: Construir Briefing + Copy Redigida da Pagina

## Executive Summary

Pipeline pra construir briefing completo da pagina de vendas com COPY REDIGIDA secao por secao. NAO basta entregar esqueleto — PU-LP-007 trava: Anuncios so destrava com pagina COM COPY REDIGIDA. Esse e o gate critico do squad (QG-LP-02), bottleneck explicito do pipeline.

## Pipeline

```
Doc mestre aprovado (Bloco 1 + 2)
   |
   v
[Selecao de estrutura] -> 12 secoes padrao OU variante justificada
   |
   v
[Construcao secao por secao]
   |
   +-- Hero (primeira dobra)
   +-- Mecanismo / SO
   +-- Identificacao
   +-- Autoridade
   +-- Conteudo do evento (cards)
   +-- Oferta + preco
   +-- Sobre voce
   +-- Matadora de objecoes
   +-- FAQ
   +-- CTA final
   +-- Suporte
   +-- Footer
   |
   (cada secao: briefing + COPY REDIGIDA)
   |
   v
[Validacao mobile-first + RCs]
   |
   v
[Aprovacao explicita do usuario]
   |
   v
QG-LP-02 PASS -> Anuncios destrava
```

## Steps

### Step 1: Selecao de Estrutura

Default: 12 secoes padrao (VOL-03).

Variantes justificaveis:
- **Nicho B2B:** secao adicional "Para empresas / Para profissionais"
- **Produto high-ticket (>R$500):** secao "Para quem e / Para quem nao e" mais robusta
- **Publico aquecido:** ordem ajustada (autoridade pode vir antes de identificacao)

Justificativa documentada no header do briefing.

### Step 2: Construcao Secao por Secao

Para cada secao, entregar:

**A. BRIEFING:**
- Intencao da secao
- Elementos obrigatorios
- Variaveis declaradas (nome, dados, links)
- Justificativa de escolha de tom/formato

**B. COPY REDIGIDA:**
- Texto final pronto pra entrar na pagina
- Headlines, paragrafos, CTAs, FAQ com respostas escritas

### Step 3: Detalhe das 12 Secoes Padrao

#### Secao 1 — Hero (Primeira Dobra)

Elementos:
- Headline (formula: Tempo + Resultado + Mecanismo)
- Subheadline (1 frase de virada — ataca a crenca falsa)
- CTA primario (botao > 44px de altura, cor de destaque)
- 1 sinal de prova (numero / depoimento curto / autoridade)

Mobile-first check: visivel sem rolar em celular.

#### Secao 2 — Mecanismo / SO

- Apresenta a peca que faltava com NOME proprio
- 3 fases / 3 pilares / 3 etapas (estrutura tangivel)
- Por que essa abordagem e DIFERENTE

#### Secao 3 — Identificacao

- Lista de ruminacoes literais (palavra-por-palavra do publico)
- Frase ponte ("se voce se reconheceu em pelo menos 1...")
- Virada (a verdade que ninguem te contou)

#### Secao 4 — Autoridade

- Quem e voce (1 paragrafo curto)
- Numero(s): anos no nicho, pacientes/clientes atendidos, formacao
- 1-3 depoimentos reais (sem inventar)

#### Secao 5 — Conteudo do Evento (Cards Tangiveis)

- RC-002: produto, nao aula
- Cards com:
  - Titulo do modulo / fase / dia
  - Bullets do que vai aprender (resultado, nao processo)
  - Tempo / formato

#### Secao 6 — Oferta

- Preco (RC-015 Preco da Escala: faixa R$27-R$67 sweet spot R$38-R$57, default R$38 com plano de teste; fora da faixa exige justificativa de nicho premium)
- O que esta incluso
- Bonus (se houver)
- Ancora de valor (preco normal vs preco do lancamento)
- Forma de pagamento

#### Secao 7 — Sobre Voce

- Historia curta (3-4 paragrafos)
- Posicionamento (frase de assinatura)
- Foto (especificar tipo: profissional natural, nao "guru com livros caros")

#### Secao 8 — Matadora de Objecoes

Top 3 objecoes do publico ja respondidas:
- "Eu nao tenho tempo" -> resposta
- "Eu ja tentei coisas parecidas" -> resposta
- "Sera que funciona pro meu caso?" -> resposta

#### Secao 9 — FAQ Pratico

5-8 perguntas operacionais:
- Quando e o evento?
- Como acesso?
- Tem reposicao?
- Posso pagar parcelado?
- Tem garantia?
- Vai ficar gravado?
- E pra mim?

Respostas escritas, nao "consultar suporte".

#### Secao 10 — CTA Final

- Repete oferta resumida
- Urgencia (mas SEM mencao de data fixa em copy reutilizavel — REPERTORIO)
- Botao grande

#### Secao 11 — Suporte

- WhatsApp / contato direto
- Email (se aplicavel)

#### Secao 12 — Footer

- Termos de uso
- Politica de privacidade
- Direitos reservados
- LGPD se aplicavel

### Step 4: Validacao Mobile-First

Checklist:
- [ ] Primeira dobra mobile: headline + subheadline + CTA visiveis sem rolar
- [ ] Paragrafo > 3 linhas em mobile? Quebra
- [ ] CTA > 44px altura (touch target minimo)
- [ ] Cards leem em coluna unica
- [ ] Imagens nao quebram layout

### Step 5: Validacao 4 Inimigos da Conversao

- [ ] NAO usa texto centralizado em excesso (apenas em CTAs)
- [ ] NAO usa caixa muito larga (max 700-800px texto)
- [ ] NAO tem secao longa demais (> 5 paragrafos sem bullet/imagem)
- [ ] NAO tem inicio fraco (Hero precisa parar o scroll)

### Step 6: Validacao RCs

- [ ] RC-002: produto, nao aula (cards do conteudo + oferta tangivel)
- [ ] RC-003: peca que faltava com NOME (Secao 2 Mecanismo)
- [ ] RC-005: vendedor 24h (primeira dobra resolve)
- [ ] RC-015: ingresso = Preco da Escala (faixa R$27-R$67 com plano de teste; fora da faixa exige justificativa explicita do plano)

### Step 7: Aprovacao Explicita

```
Briefing + copy redigida fechados. 12 secoes (ou variante).

Pra cada secao: briefing + texto pronto.

Voce APROVA esse briefing como esta?

Aprovacao significa: copy redigida vai pra implementacao em
page builder (Cartpanda / Hotmart / Logzz / etc.). Apos isso,
voce pode invocar Anuncios — QG-LP-02 PASS.

(SIM / NAO + ajuste especifico)
```

## Veto Conditions

- Headline sem formula Tempo+Resultado+Mecanismo → recusa
- Mecanismo sem nome proprio → recusa
- Ruminacoes parafraseadas (nao literais) → devolve pro Estrategista
- Briefing entregue sem copy redigida → recusa (gate QG-LP-02 falha)
- Primeira dobra mobile precisa rolar pra ver CTA → reposiciona
- Preco de ingresso travado sem teste, ou fora da faixa do metodo (R$27-R$67 sweet spot, R$97 raro, R$200-R$300 so nicho premium) sem justificativa de nicho → recusa
- Tom corporativo / "masterclass exclusiva" / "investe em voce" → recusa
- Aprovacao implicita → exige SIM/NAO explicito

## Output Esperado

Arquivo `briefing-pagina.md` com:
- Header (data, versao, justificativa de estrutura escolhida)
- 12 secoes (ou variante) com briefing + copy redigida lado a lado
- Checklist mobile-first verde
- Checklist 4 inimigos verde
- Checklist RCs verde
- Linha de aprovacao

QG-LP-02 PASS. Anuncios destrava.

## Regras

- Aplicar formula da headline em CADA headline (incluindo subheadlines de secao)
- Mobile-first em CADA secao
- Cita RC aplicada por secao
- Mostra antes/depois quando refaz copy
- Pede aprovacao explicita por secao OU em bloco final
- Termina com proximo passo concreto
