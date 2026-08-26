# Live Deck Builder — Regras Operacionais

> Regras que nascem de incidentes e aprendizados operacionais.
> Carregar SEMPRE antes de qualquer missao.
> Este arquivo cresce com o tempo. Cada regra deve ter: contexto, motivo e checklist.

## Regra 1 — Navegação nunca dá loop do último slide pro primeiro

**Contexto:** Live 25, primeira missão do worker. A navegação por padrão (`i % slides.length`) voltava pro slide 1 automaticamente depois do último — a Karol só percebeu ao ver o slide 1 de novo no meio da apresentação.
**Motivo:** apresentação ao vivo não pode "sumir" o fim do deck silenciosamente.
**Checklist:** a função de navegação sempre trava (clamp) no último slide — nunca faz wraparound — a menos que a Karol peça o contrário explicitamente.

## Regra 2 — Deck só de texto cansa; adicionar ícone/forma desde a primeira passada

**Contexto:** Live 25 — primeira versão saiu só com tipografia/cor/card, sem nenhum elemento gráfico de apoio (ícone, forma decorativa). Karol sinalizou como "levemente cansativa" mesmo aprovando o resultado.
**Motivo:** sem fotografia (decisão de produto do worker), o peso visual todo cai em tipografia — sem reforço gráfico, o deck fica repetitivo mesmo variando o layout.
**Checklist:** toda missão nova já inclui, na primeira passada (não só quando pedido): ícones de linha simples (SVG leve) em cards/princípios/diagramas, e 1-2 formas decorativas sutis (círculo/arco em cor de marca, baixa opacidade) em slides de quote/título/CTA. Não esperar feedback pra adicionar isso.

## Regra 3 — Confirmar o arquivo exato da logo antes de embutir

**Contexto:** Live 25 — a Karol passou inicialmente `Logo Expert360 - branco/preto.png`, mas era a logo errada; a correta era `LiveExpert360 - fundo transparente.png`, com paleta própria (preto+laranja+azul) diferente da paleta dos 4 tons oficiais do deck.
**Motivo:** logo errada só é percebida depois de publicado — desperdiça uma rodada inteira de ajuste.
**Checklist:** ao receber path de logo pela primeira vez numa sessão, confirmar visualmente com a Karol ("essa aqui, certo?") antes de embutir no deck — não assumir que a primeira logo mencionada em conversa é a definitiva pra esse contexto específico (ex: logo geral da marca vs. logo específica de live).

**Reincidência (Live 27, 25/08):** o mesmo erro aconteceu de novo — a KB (`live-deck-builder-kb.md` secao 3.4) ainda listava só as logos do curso (`Logo Expert360 - branco/preto.png`) como default, sem registrar a correção aprendida na Live 25. A regra existia, mas a fonte de verdade consultada (Foundation KB) não tinha sido atualizada com o aprendizado — causa raiz real do incidente repetir. Corrigido: KB 3.4 agora lista `LiveExpert360 - fundo transparente.png` como default explícito do deck de live, com nota clara de não usar as logos do curso. Licao: quando um incidente de logo for corrigido, atualizar a KB (nao só o rules.md) no mesmo passo — regra sem KB atualizada nao previne reincidência.
