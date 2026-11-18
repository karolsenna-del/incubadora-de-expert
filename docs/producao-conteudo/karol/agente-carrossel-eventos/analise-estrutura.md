# Agente de Carrossel de Eventos — análise da conversa de referência

> Fonte: conversa da Karol com o GPT "@vinigrevy | Carrossel de Eventos" (18/09 a 17/11/2026, 83 mensagens), lida em 17/11/2026.
> O GPT recebeu o dossiê da Laura como arquivo (equivalente a `docs/knowledge/expert-business/dossie-personas.md`).
> As instruções internas do GPT não aparecem na conversa: a estrutura abaixo foi reconstruída pelo que ele entregou.
> Status: análise pronta, esperando aprovação da Karol antes de construir o agente.

## Fluxo da conversa (como o GPT conduz)

1. Pergunta o público → carrega o dossiê da persona (Laura).
2. Pergunta se já tem tema ou se quer sugestões.
3. Sugere **5 temas** (depois 5, depois 7), cada um com: título-tese, gancho, **evento** (cena do cotidiano da persona), **verdade oculta**, **virada/lição** e, a partir do tema 11, **oportunidade de venda** (qual oferta da Karol o tema puxa). Fecha com ordem sugerida e qual faria primeiro, com o porquê.
4. Karol escolhe → **carrossel de 8 slides**.
5. "faça a legenda" → legenda que **complementa** o carrossel (não repete).
6. Ajustes da Karol: agrupar frases, resumir, trocar CTA, manter gancho, encaixar Vendas Secretas no desenvolvimento.
7. Também aceita: tema/ideia dada pela Karol ("desenvolva essa ideia") e roteiro pronto ("transforme esse roteiro em carrossel").

## Estrutura fixa dos 8 slides

| Slide | Bloco | Função |
|---|---|---|
| 1 | HOOK | Quebra uma crença ou nomeia a dor escondida ("Você não está pesquisando. Está adiando…"). Tese em contraste. |
| 2 | FERIDA | Cena concreta do dia a dia da persona, com a fala dela entre aspas ("Mas eu sei fazer isso há anos…"). |
| 3 | VERDADE OCULTA | O medo real por trás do comportamento ("E se eu tentar de verdade… e ninguém comprar?"). |
| 4 | MINHA VIRADA | O que a especialista entendeu; reenquadra o problema ("Clareza vem por causa da ação"). |
| 5 | QUEBRA DE PADRÃO | Contraste/metáfora que desmonta a crença (biblioteca x mapa; palco antes do ingresso). |
| 6 | NOVO CÓDIGO | O caminho prático em passos curtos (problema → método → oferta → validação; "qual o menor teste?"). |
| 7 | LIÇÃO FINAL | Frase-síntese citável + custo de continuar igual. |
| 8 | CTA | Pergunta de identificação + palavra para comentar (CHEGA, MÉTODO, VALIDAR, CLAREZA, AGORA → depois padronizado em **AULA** = link do mini treinamento). |

## Regras observadas

- Toda dor/fala vem do dossiê da persona; o GPT cita a fonte e evita inventar fato biográfico (ex.: não assumiu idade da Laura).
- Cenas "verossímeis inspiradas na persona", nunca apresentadas como depoimento real.
- Cada tema conecta a dor a uma **oportunidade de venda** (método autoral, validação, Vendas Secretas, oferta clara).
- Negrito na frase-chave de cada slide.
- **Texto agrupado**, sem uma frase por linha (Karol pediu 2x; vale para slides e legenda).
- Legenda: complementa o carrossel, curta, termina no CTA "Comenta AULA que eu te envio o link do mini treinamento".
- Não repete tema já feito; numeração contínua dos temas.
- Quando a Karol traz ideia própria, mantém o gancho dela e encaixa o conceito dela (ex.: Vendas Secretas) no desenvolvimento, não no gancho.

## Temas já produzidos (não repetir)

1 pesquisar = adiar · 2 gente com menos experiência vendendo · 3 e se ninguém comprar · 4 sabe muito, ninguém entende o que vende · 5 ainda não é o momento · 6 não quer virar influencer (só pauta) · 7 primeira venda > lançamento (só pauta) · 8 o óbvio pra você tem valor · 9 renda que para quando você para (só pauta) · 10 conhecimento parado · digital depois dos 30 · a maior mentira (aprender marketing antes) · o mercado não te ignora, não entende por que te escolher · não é falta de seguidores (Vendas Secretas) · 11 Instagram decidindo quanto você vale · 12 medo de cobrar · 13 vender tudo que sabe · 14 "vou pensar" · 15 produto pra provar que é boa · roteiro prospecção/delegar vendas · 16-22 em pauta (estudo como desculpa, agenda de contatos, esperar pedirem pra comprar, curso antes da solução, elogio ≠ compra, medo de parecer inconveniente, método preso na cabeça).

## O que adaptar no agente da Karol

- Ganchos abrindo com frase de empatia da persona (regra dela de 15/11) e furando a bolha da Laura.
- Seeding da oferta da Karol (Vendas Secretas, Incubadora Express, Sprint) e CTA AULA.
- Visual: entregar o texto no formato do motor de carrossel que ela já usa (card-tweet / diagnóstico tipográfico), paleta preto/branco/laranja.
