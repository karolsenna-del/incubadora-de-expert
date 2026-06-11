# ETL Plan — Máquina Automática de Vendas (Ícaro de Carvalho)

## Contexto
- **Fonte:** Curso "Máquina Automática de Vendas" — plataforma Hotmart Club (white-label onovomercado)
- **Autor:** Ícaro de Carvalho
- **Tipo:** Curso em vídeo — legendas/transcrições a extrair via browser automation
- **Localização:** https://alunos-mav.onovomercado.com/pt-br/club/maquina-automatica-de-vendas/products/5080945
- **Total:** 94 conteúdos em 15 módulos (~28h30min de vídeo + 3 itens de texto)

## Status
- [x] Fase 0: Setup
- [x] Fase 1: Mapeamento Territorial (mapa completo dos 94 itens OK — método de extração validado em b4KdEqdDeX — extração de transcrições do escopo desta rodada concluída: 31/31)
- [ ] Fase 2: Composição Blocada (0/N volumes)
- [ ] Fase 3: Integração
- [ ] Fase 4: Validação Final

## Escopo desta Rodada — Módulos 4-7 (31 itens, ~5h45)

Curso completo tem 94 conteúdos / ~28h30 (mapa completo abaixo, mantido para rodadas futuras).
Decisão do expert (10/06/2026): processar primeiro o bloco de copy/persuasão — Módulos 4, 5, 6 e 7
— **começando pelo Módulo 6 (VSLs)**.

| Ordem | Módulo | Itens | Duração | Status |
|-------|--------|-------|---------|--------|
| 1 | Módulo 06 — Video Sales Letters (VSLs) | 8 | ~1h33 | done (8/8) |
| 2 | Módulo 04 — Storytelling e Soft copy | 6 | ~1h53 | done (6/6) |
| 3 | Módulo 05 — Hard Copy | 6 | ~1h14 | done (6/6) |
| 4 | Módulo 07 — Estrutura de Webinários | 11 | ~1h05 | done (11/11) |

Ordem 6→4→5→7 proposta (segue a ordem informada, com Módulo 6 primeiro). Ajustável se o
expert preferir outra sequência.

**Método de extração validado — versão otimizada** (10/06/2026, descoberto na aula 2,
b4KdEq9DeX): NÃO precisa dar play no vídeo. Navegar até a aula → pegar snapshot pra obter
ref do iframe cross-origin do player → no contexto do iframe, dar `fetch()` direto na
playlist `.m3u8` da textstream PT-BR (URL aparece em `browser_network_requests` logo no
carregamento da página, padrão
`{mediaCode}-{timestamp}-textstream_pt_br=1000.m3u8?hdntl=...&app=...`) → playlist é VOD
estática (`#EXT-X-ENDLIST`) e lista TODOS os segmentos `.webvtt` de uma vez → buscar todos
os segmentos em paralelo via `fetch(url, {cache:'force-cache'})` → parsear cada segmento em
cues (cada cue = bloco entre linhas em branco, descartando linha de ID e linha de timing
`-->`) → **dedupe simples: remover cues consecutivos EXATAMENTE iguais** (cada segmento
repete o último cue do segmento anterior como primeiro cue — esse é o único tipo de
duplicação que existe; cues dentro de um segmento não se sobrepõem) → 7 normalizações leves
(`palavra -palavra` → `palavra-palavra` pra hifens partidos tipo "pré -determinado"; `R $`
→ `R$ ` pra moeda partida; `Número %` → `Número%` pra percentuais com espaço espúrio tipo
"80 %" → "80%"; `Número .Número` / `Número ,Número` → `Número.Número` / `Número,Número` pra
separadores de milhar/decimal partidos tipo "R$ 4 .800" → "R$ 4.800" e "R$ 9 ,97" →
"R$ 9,97", introduzido na aula mod04-01; ` .` → `.` pra espaço espúrio antes de ponto final,
tipo "cliente .Icaro" → "cliente.Icaro", introduzido na aula mod04-04 — roda ANTES da
próxima normalização; `.MAIÚSCULA` → `. MAIÚSCULA` pra frases coladas sem espaço após o
ponto final, tipo "vendas .E agora" → "vendas. E agora" e, combinada com a normalização
anterior, "cliente .Icaro" → "cliente.Icaro" → "cliente. Icaro", introduzido na aula
mod04-01; `Q &A` → `Q&A` pra espaço espúrio entre "Q" e "&A" causado por quebra de cue,
introduzido na aula mod07-09) → resultado já sai limpo, sem necessidade de merge por overlap
de palavras nem polimento manual. Elimina os ~35-45s de espera de playback por vídeo.
`yt-dlp` testado e NÃO viável nesse CDN (Akamai retorna 403 — falta sessão/Referer do
browser).

Método legado (usado só na aula 1, b4KdEqdDeX, antes de descobrir o atalho acima): acelerar
playback pra 16x (`video.playbackRate = 16; video.muted = true; video.play();`), aguardar
`ended: true`, capturar segmentos via network requests durante a reprodução, e aplicar
pipeline de limpeza em 4 estágios + polimento manual.

### Progresso de Extração — Módulo 06 (VSLs)

| # | Content ID | Título | Duração | Status | Arquivo |
|---|-----------|--------|---------|--------|---------|
| 1 | b4KdEqdDeX | Introdução aos VSLs | 12:07 | done | sources/transcricoes/mod06-aula01-introducao-aos-vsls.md |
| 2 | b4KdEq9DeX | Componentes de um VSL eficaz | 14:07 | done | sources/transcricoes/mod06-aula02-componentes-de-um-vsl-eficaz.md |
| 3 | E4zDrWzQ7l | O papel da narrativa em um VSL | 12:12 | done | sources/transcricoes/mod06-aula03-o-papel-da-narrativa-em-um-vsl.md |
| 4 | 0Ovq9JPN7j | Criando um Gancho Forte | 11:11 | done | sources/transcricoes/mod06-aula04-criando-um-gancho-forte.md |
| 5 | M7GnV6W8ew | Desenvolvimento do seu VSL | 16:09 | done | sources/transcricoes/mod06-aula05-desenvolvimento-do-seu-vsl.md |
| 6 | 0Ovq9Jld7j | A Importância do Headline | 11:43 | done | sources/transcricoes/mod06-aula06-a-importancia-do-headline.md |
| 7 | EOgYQgnqe6 | O poder na narrativa no VSL | 06:30 | done | sources/transcricoes/mod06-aula07-o-poder-na-narrativa-no-vsl.md |
| 8 | NOwBwYyE7m | Prova Social, Credibilidade e encerramento eficaz | 09:19 | done | sources/transcricoes/mod06-aula08-prova-social-credibilidade-e-encerramento-eficaz.md |

### Progresso de Extração — Módulo 04 (Storytelling e Soft copy)

| # | Content ID | Título | Duração | Status | Arquivo |
|---|-----------|--------|---------|--------|---------|
| 1 | 97BEv06Aep | Storytelling e Soft copy | 28:42 | done | sources/transcricoes/mod04-aula01-storytelling-e-soft-copy.md |
| 2 | 14oRgkv5Op | Os 3 pilares de uma boa Big Idea | 28:15 | done | sources/transcricoes/mod04-aula02-os-3-pilares-de-uma-boa-big-idea.md |
| 3 | NOwBwopM7m | Causa futura e o poder de criar movimentos | 14:08 | done | sources/transcricoes/mod04-aula03-causa-futura-e-o-poder-de-criar-movimentos.md |
| 4 | M7GnV2lBew | O que compõe uma boa história | 18:10 | done | sources/transcricoes/mod04-aula04-o-que-compoe-uma-boa-historia.md |
| 5 | oODd6jpbOP | Porque criamos tantas histórias? | 16:47 | done | sources/transcricoes/mod04-aula05-porque-criamos-tantas-historias.md |
| 6 | V73RpNGpe3 | A nova oportunidade | 06:41 | done | sources/transcricoes/mod04-aula06-a-nova-oportunidade.md |

### Progresso de Extração — Módulo 05 (Hard Copy)

| # | Content ID | Título | Duração | Status | Arquivo |
|---|-----------|--------|---------|--------|---------|
| 1 | 97BEvvJAep | O que você precisa saber sobre Hard Copy | 10:53 | done | sources/transcricoes/mod05-aula01-o-que-voce-precisa-saber-sobre-hard-copy.md |
| 2 | Z72v11xY7N | O segredo para uma copy que converte | 15:18 | done | sources/transcricoes/mod05-aula02-o-segredo-para-uma-copy-que-converte.md |
| 3 | M7qazD9n7x | Copy de Mecanismo | 23:17 | done | sources/transcricoes/mod05-aula03-copy-de-mecanismo.md |
| 4 | RON1ljEY7P | As duas alavancas que vão potencializar seus resultados | 07:14 | done | sources/transcricoes/mod05-aula04-as-duas-alavancas-que-vao-potencializar-seus-resultados.md |
| 5 | 14oRgvk2Op | Os 4 níveis de resistência à compra | 08:01 | done | sources/transcricoes/mod05-aula05-os-4-niveis-de-resistencia-a-compra.md |
| 6 | BeZylkG54w | O momento da grande apoteose | 09:30 | done | sources/transcricoes/mod05-aula06-o-momento-da-grande-apoteose.md |

### Progresso de Extração — Módulo 07 (Estrutura de Webinários)

| # | Content ID | Título | Duração | Status | Arquivo |
|---|-----------|--------|---------|--------|---------|
| 1 | BOnv1BDoOR | Introdução aos Webinários | 13:49 | done | sources/transcricoes/mod07-aula01-introducao-aos-webinarios.md |
| 2 | gOpDPRQrOJ | Webinário ao Vivo vs. Webinário Gravado | 01:52 | done | sources/transcricoes/mod07-aula02-webinario-ao-vivo-vs-webinario-gravado.md |
| 3 | M7qaz6Rm7x | Como escolher o tema certo para seu Webinário | 02:37 | done | sources/transcricoes/mod07-aula03-como-escolher-o-tema-certo-para-seu-webinario.md |
| 4 | 64lNkKXX7j | Definição de Objetivos | 02:38 | done | sources/transcricoes/mod07-aula04-definicao-de-objetivos.md |
| 5 | 37dL1YV67L | Escolhendo o melhor formato para seu Webinário | 01:44 | done | sources/transcricoes/mod07-aula05-escolhendo-o-melhor-formato-para-seu-webinario.md |
| 6 | 94JA3lldOg | Ferramentas essenciais para realizar um Webinário | 02:06 | done | sources/transcricoes/mod07-aula06-ferramentas-essenciais-para-realizar-um-webinario.md |
| 7 | BOnv1kwkOR | Como fazer a audiência participar | 08:33 | done | sources/transcricoes/mod07-aula07-como-fazer-a-audiencia-participar.md |
| 8 | BOnv1kMoOR | A psicologia da apresentação da oferta | 14:28 | done | sources/transcricoes/mod07-aula08-a-psicologia-da-apresentacao-da-oferta.md |
| 9 | 37dL1LyK7L | Q&A e Chat | 09:19 | done | sources/transcricoes/mod07-aula09-qa-e-chat.md |
| 10 | NOwBwBxA7m | Como fazer o follow-up no webinário | 02:33 | done | sources/transcricoes/mod07-aula10-como-fazer-o-follow-up-no-webinario.md |
| 11 | Z72v1vKL7N | Sequência de Emails | 04:59 | done | sources/transcricoes/mod07-aula11-sequencia-de-emails.md |

Módulos 1-3, 8-15 (52 itens restantes) ficam para rodadas futuras — fora do escopo agora.

## Mapa do Curso — 15 Módulos / 94 Conteúdos

### Módulo 01 — Comece por aqui (1 item)
| # | Título | Duração | Content ID | Tipo |
|---|--------|---------|------------|------|
| 01 | Informações importantes sobre a sua Máquina Automática de Vendas | — | RON1bgJJ7P | texto |

### Módulo 02 — Fundamentos (9 vídeos, ~1h35m38s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 02 | Conheça a Máquina Automática de Vendas | 28:13 | x7W8PY5YO2 |
| 03 | O que vou te ensinar nesse curso | 08:46 | 97BE61KAep |
| 04 | Conhecendo os fundamentos da nossa filosofia de trabalho | 15:33 | 94JAbPngOg |
| 05 | As duas regras de ouro para produzir bons resultados | 10:17 | YOmB62nl4d |
| 06 | As 4 perguntas que você deve responder antes de iniciar sua MAV | 09:44 | r48xNRXA4R |
| 07 | A regra de ouro do nosso negócio | 04:22 | 2OM1L5o1O6 |
| 08 | Como construir um "personagem atraente" | 03:00 | x7W8PYxQO2 |
| 09 | A relação entre o "personagem atraente" e a Jornada do Herói | 11:50 | a4RDLAVL7n |
| 10 | Aplicação prática em alguns dos maiores nichos do mercado | 03:53 | PeAAdErJeW |

### Módulo 03 — Funis de vendas (5 vídeos, ~1h08m37s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 11 | O que você aprenderá nesse módulo | 09:43 | Me1BMdRj7Y |
| 12 | As três bases de um funil | 18:24 | y4bknQLkeR |
| 13 | Entendendo o conceito de Escada de Valor | 14:18 | z7rQdynPej |
| 14 | O poder do "personagem atraente" | 10:40 | k45anJJq4l |
| 15 | O nosso segredo e os 3 pilares para um bom método | 15:32 | M7Gn0NNPew |

### Módulo 04 — Storytelling e Soft copy (6 vídeos, ~1h52m43s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 16 | Storytelling e Soft copy | 28:42 | 97BEv06Aep |
| 17 | Os 3 pilares de uma boa Big Idea | 28:15 | 14oRgkv5Op |
| 18 | Causa futura e o poder de criar movimentos | 14:08 | NOwBwopM7m |
| 19 | O que compõe uma boa história | 18:10 | M7GnV2lBew |
| 20 | Porque criamos tantas histórias? | 16:47 | oODd6jpbOP |
| 21 | A nova oportunidade | 06:41 | V73RpNGpe3 |

### Módulo 05 — Hard Copy (6 vídeos, ~1h14m13s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 22 | O que você precisa saber sobre Hard Copy | 10:53 | 97BEvvJAep |
| 23 | O segredo para uma copy que converte | 15:18 | Z72v11xY7N |
| 24 | Copy de Mecanismo | 23:17 | M7qazD9n7x |
| 25 | As duas alavancas que vão potencializar seus resultados | 07:14 | RON1ljEY7P |
| 26 | Os 4 níveis de resistência à compra | 08:01 | 14oRgvk2Op |
| 27 | O momento da grande apoteose | 09:30 | BeZylkG54w |

### Módulo 06 — Video Sales Letters (VSLs) (8 vídeos, ~1h33m18s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 28 | Introdução aos VSLs | 12:07 | b4KdEqdDeX |
| 29 | Componentes de um VSL eficaz | 14:07 | b4KdEq9DeX |
| 30 | O papel da narrativa em um VSL | 12:12 | E4zDrWzQ7l |
| 31 | Criando um Gancho Forte | 11:11 | 0Ovq9JPN7j |
| 32 | Desenvolvimento do seu VSL | 16:09 | M7GnV6W8ew |
| 33 | A Importância do Headline | 11:43 | 0Ovq9Jld7j |
| 34 | O poder na narrativa no VSL | 06:30 | EOgYQgnqe6 |
| 35 | Prova Social, Credibilidade e encerramento eficaz | 09:19 | NOwBwYyE7m |

### Módulo 07 — Estrutura de Webinários (11 vídeos, ~1h04m38s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 36 | Introdução aos Webinários | 13:49 | BOnv1BDoOR |
| 37 | Webinário ao Vivo vs. Webinário Gravado | 01:52 | gOpDPRQrOJ |
| 38 | Como escolher o tema certo para seu Webinário | 02:37 | M7qaz6Rm7x |
| 39 | Definição de Objetivos | 02:38 | 64lNkKXX7j |
| 40 | Escolhendo o melhor formato para seu Webinário | 01:44 | 37dL1YV67L |
| 41 | Ferramentas essenciais para realizar um Webinário | 02:06 | 94JA3lldOg |
| 42 | Como fazer a audiência participar | 08:33 | BOnv1kwkOR |
| 43 | A psicologia da apresentação da oferta | 14:28 | BOnv1kMoOR |
| 44 | Q&A e Chat | 09:19 | 37dL1LyK7L |
| 45 | Como fazer o follow-up no webinário | 02:33 | NOwBwBxA7m |
| 46 | Sequência de Emails | 04:59 | Z72v1vKL7N |

### Módulo 08 — Estruturas de Funis (10 vídeos, ~1h01m00s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 47 | As principais estruturas de um funil de vendas | 09:40 | oODd68zbOP |
| 48 | As diferentes estruturas de funis de vendas - parte 1 | 11:59 | x7W8gA15O2 |
| 49 | parte 2 | 04:50 | x7W8gAR5O2 |
| 50 | parte 3 | 06:03 | M7qazNEj7x |
| 51 | parte 4 | 07:52 | 0Ovq92Dd7j |
| 52 | parte 5 | 04:04 | BeZylMYN4w |
| 53 | parte 6 | 04:41 | RO98zK9Y7P |
| 54 | parte 7 | 03:30 | oODd6ojgOP |
| 55 | parte 8 | 03:19 | BOnv186ZOR |
| 56 | O checklist | 05:02 | M7qaz3zv7x |

### Módulo 09 — Criação de produto e páginas - Hotmart (4 vídeos, ~1h16m14s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 57 | Criando seu produto e área de membros na Hotmart | 35:16 | m7YlMKKDe6 |
| 58 | Criando seu Checkout Personalizado | 11:39 | Z72v232J7N |
| 59 | Criando suas páginas no Hotmart Pages | 18:36 | r48xnPdX4R |
| 60 | Criando seu fluxo de vendas dentro da Hotmart | 10:43 | M7Gn6BQ5ew |

### Módulo 10 — Emails e Mensagens (2 vídeos, ~43m55s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 61 | Listboss e Hotmart Send | 10:27 | o4E5d3Wd4z |
| 62 | Listboss e Active Campaign | 33:28 | YOmB93N64d |

### Módulo 11 — Tráfego e Trackeamento (18 vídeos, ~2h44m49s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 63 | Introdução ao módulo de tráfego pago | 01:40 | V7yRpknMOJ |
| 64 | Como criar seu Gerenciador de Negócios no Facebook | 04:48 | NOwBYL6Y7m |
| 65 | Tracking e API de conversões | 11:53 | 2OM1EVNYO6 |
| 66 | Conhecendo o gerenciador de anúncios | 21:35 | M7qaDxYj7x |
| 67 | Como organizar suas campanhas | 08:30 | a4RDXEdx7n |
| 68 | Públicos personalizados e semelhantes | 05:15 | M7qaDxNv7x |
| 69 | Criando seus melhores públicos no gerenciador | 17:49 | PeAA0EBoeW |
| 70 | O que são e para que servem as UTMs | 09:00 | oODdLbRmOP |
| 71 | Estratégia e tráfego e tipos de campanhas | 03:22 | oODdLborOP |
| 72 | Estrutura campanhas e teste de criativo | 02:45 | y4PvLzal7x |
| 73 | Escala no tráfego pago | 02:39 | r48xnRov4R |
| 74 | Métricas principais e métricas secundárias | 11:26 | gOpDRX1nOJ |
| 75 | Como planejar seu tráfego pago | 04:56 | M7Gn6NP5ew |
| 76 | Testes de criativos e estruturas | 27:44 | Z72v26M27N |
| 77 | Como analisar suas campanhas | 08:21 | ROxvoYLJeD |
| 78 | Como estruturar sua campanha de escala | 03:22 | Me1BxNGX7Y |
| 79 | Otimizações diárias para campanhas de escala | 11:33 | kOXqrgmB4W |
| 80 | Estratégias de tráfego orgânico | 08:11 | ROxvoYXpeD |

### Módulo 12 — Métricas e Otimização de Funil (2 vídeos, ~15m01s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 81 | Métricas e otimização de funil | 10:13 | 0Ovq9oG87j |
| 82 | Médias de mercado e suas métricas | 04:48 | 3eagGwxmOg |

### Módulo 13 — [BÔNUS] Módulo "VIDA REAL" com Ícaro de Carvalho (7 vídeos, ~6h49m27s)
| # | Título | Duração | Content ID |
|---|--------|---------|------------|
| 83 | Criando uma VSL de 6 min | 47:35 | m7YlMnyKe6 |
| 84 | Criando uma VSL de 20 min | 01:51:06 | V4VxXWN972 |
| 85 | Criando VSL para página de vendas MAV (parte 1) | 01:19:02 | RO98zL3m7P |
| 86 | Criando VSL para página de vendas MAV (parte 2) | 01:04:02 | o4E5dVyg4z |
| 87 | Aprovando a Página de vendas da MAV | 25:18 | 146QZ98oOd |
| 88 | Criando ofertas para UPSELL, UPSELL 2 E OTO | 58:18 | 14oRgW8YOp |
| 89 | Storyboard ONM AO VIVO | 24:06 | 37dL16ay7L |

### Módulo 14 — DATAS DAS MENTORIAS AO VIVO (1 item)
| # | Título | Duração | Content ID | Tipo |
|---|--------|---------|------------|------|
| 90 | Anote na agenda | — | ROxvdov0eD | texto |

### Módulo 15 — Mentorias MAV - Turma 01 (4 itens, ~7h14m21s+)
| # | Título | Duração | Content ID | Tipo |
|---|--------|---------|------------|------|
| 91 | Mentoria 01 - 08/04/2025 | 02:32:04 | EOgY3Dvge6 | vídeo |
| 92 | Mentoria 02 - 07/05/2025 | 02:26:12 | k7QRwD02Oy | vídeo |
| 93 | Mentoria MAV 03 - 27/05/25 | — | r48xay1E4R | texto/sem duração visível |
| 94 | Mentoria MAV 04 - 23/06/25 | 02:16:05 | ROxvKovJeD | vídeo |

## Decisões Chave
- Mapa territorial (15 módulos / 94 conteúdos) extraído via DOM scraping (browser_evaluate) em
  10/06/2026 — todos os módulos expandidos, links `a[href*="/content/"]` capturados, Módulo 13
  verificado individualmente (busca direta pelo texto "VIDA REAL")
- Plataforma é Hotmart Club white-label (onovomercado.com) — método de extração de legendas
  (playwright_iframe_16x_dedup, usado em stories-10x) precisa ser validado nesta plataforma antes
  do lote completo
- Aula mod07-aula08 (BOnv1kMoOR, "A psicologia da apresentação da oferta", 14:28) tem duas abas
  "Parte 1" e "Parte 2" no player, com mediaCodes diferentes mas conteúdo praticamente idêntico
  (mesmo início/fim, ~14min cada — duas gravações/takes da mesma aula, não uma divisão em duas
  partes). Decisão: extrair apenas UMA versão como fonte canônica (Parte 2, por ser levemente
  mais completa: 207 cues deduplicados vs. 206 da Parte 1), documentando o caso no header do
  arquivo. Precedente para futuras aulas com múltiplas abas "Parte N" de duração similar.

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
- >20 fontes → processar em batches de 10 (veto condition padrão)
