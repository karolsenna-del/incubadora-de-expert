# Expert-Stories — Regras Operacionais

> Nascem de incidentes e ajustes confirmados pela Karol. Arquivo vazio no Day 1 — cresce com
> o uso. Carregar SEMPRE antes de qualquer missão.

---

## Regras Ativas

## [14/08/2026] — Corpo do Story curto e fonte grande
**Origem:** Primeira imagem gerada (Inimigo Comum, template `story-texto`, modifier
`cta-grande`) saiu com corpo de 3 parágrafos em fonte 34px — Karol reportou "texto muito
longo com fonte muito pequena".
**Regra:** No template `story-texto` (qualquer modifier), o corpo/texto de apoio deve ser
1 frase curta (no máximo 2 linhas), fonte a partir de ~44-46px. Stories se lê em segundos —
não empilhar parágrafos. Se o argumento precisa de mais desenvolvimento, cortar pro essencial
em vez de reduzir a fonte pra caber.
**Aplica quando:** Gerando imagem de Story via Squad Carrossel Arcane, template
`story-texto`, qualquer modifier com slot de corpo (`texto-corrido`, `cta-grande`).

## [14/08/2026] — Story usa fonte de sistema, não a identidade de marca do carrossel
**Origem:** Karol perguntou se a fonte da primeira imagem (Inter/Lato/Bree Serif, identidade
do Card Tweet Dark) era nativa do Instagram — não é. Ela pediu fonte nativa "pra ficar mais
natural".
**Regra:** No template `story-texto`, usar stack de fonte de sistema
(`-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial,
sans-serif`) em vez das fontes de marca (Inter/Lato/Bree Serif) usadas no carrossel/feed. Sem
itálico serifado nos destaques — só peso bold + laranja. Mantém fundo preto, texto branco,
laranja de destaque (isso continua igual). **Isso é específico de Stories** — não mudar a
identidade de marca do carrossel/feed (Card Tweet Dark e demais templates), que continua com
Inter/Lato/Bree Serif normalmente.
**Aplica quando:** Gerando qualquer imagem com o template `story-texto`.
**Confirmado (14/08):** o estilo usado equivale ao "Classic" nativo do Instagram (fonte de
sistema, sem serifa, sem itálico) — fica como padrão fixo dos Stories. Variar pra outros
estilos nativos (Modern serifado, Neon, Typewriter, Strong condensada bold) é decisão
futura, caso a caso — não é o padrão.

## [14/08/2026] — Day Off pode ter mais de 1 Story no dia
**Origem:** Karol trouxe 2 momentos genuínos pro Day Off de 15/08 (natação da filha de manhã,
amiga que chegou da Polônia pro churrasco à tarde/noite) e perguntou se podia postar os dois.
**Regra:** Day Off (e Stories em geral) não está limitado a 1 post por dia como o feed —
pode ter mais de um momento no mesmo dia quando fizer sentido pro que realmente aconteceu.
Isso não é override (não tem formato concorrendo), é só reconhecer que Stories é sequência
de momentos, não post único.
**Aplica quando:** O dia (especialmente Day Off) tiver mais de um momento genuíno pra
registrar.

## [18/08/2026] — Story da live de quarta é conteúdo do tema, não convite — e usa os assets reais da pasta da live
**Origem:** Karol apontou que os roteiros das lives semanais (Expert360º) ficam em
`business/campanhas/lives-semanais/live-N-roteiro.md`, com pasta `assets/` contendo fotos/vídeos
reais usados na narrativa da live (ex: `live-26-foto-blazer.jpg`, `live-26-foto-bebe.jpg`).
Pediu pra sempre puxar Story dali — mas corrigiu que o Story de quarta NÃO é convite/divulgação
("de divulgação eu já postei"), é conteúdo sobre o tema da live.
**Regra:** Pro compromisso fixo de quarta (live Expert360º, 15h-16h), montar o Story a partir
do roteiro (`lives-semanais/live-N-roteiro.md`) + assets reais (`lives-semanais/assets/`) —
foto real + trecho literal da história/tese da live como legenda, ensinando o tema, não
convidando pra assistir. SEM CTA de "vem assistir"/horário — a divulgação da live é feita à
parte, por fora deste worker. Pode virar sequência de 2-3 Stories (foto 1 + citação, foto 2 +
citação, fechamento em texto com a frase-âncora/tese) quando o roteiro tiver mais de um
momento real reaproveitável — mesmo princípio do Day Off (mais de 1 Story no dia quando fizer
sentido). Isso é 🔴 quando usa foto real da pasta assets, mesmo sendo texto+foto já existente
(não gerada do zero) — não fabricar frase que não esteja no roteiro.
**Aplica quando:** Todo compromisso de quarta-feira (live Expert360º) — checar
`business/campanhas/lives-semanais/live-N-roteiro.md` e a pasta `assets/` correspondente antes
de perguntar à Karol o que postar. Se a pasta de assets da semana não tiver foto/vídeo real,
perguntar à Karol antes de usar template genérico de texto.

**Objetivo do slot (alinhado 18/08, após a Karol perguntar "serve pra quê?"):** é o mesmo
objetivo do formato **Você no Game** do catálogo — prova de autoridade via bastidor real
("estar no jogo"), NÃO engajamento nem venda. Por isso:
- Sempre contextualizar que é dela, de hoje, do que ela ensinou/contou na live (ex: "Hoje, na
  live do Expert360º, contei essa história.") — nunca soltar citação/foto sem dizer de onde
  vem
- Fechar apontando o ensinamento/frase-âncora que ela entregou, como prova de profundidade —
  não como CTA
- Postar depois da live acontecer (15h-16h), não antes — mesmo que o conteúdo tenha sido
  produzido com antecedência a partir do roteiro fechado, a intenção é "o que foi falado", não
  teaser pré-live

## [21/08/2026] — Levantada de Mão usa 2 vagas fixas, não pergunta mais o número real
**Origem:** Karol vinha sendo perguntada toda vez ("qual o número real de vagas hoje?") pra
não inventar prova numérica. Ela decidiu fixar o número em vez de responder isso a cada
missão — motivado também por destravar a automação diária (menos pontos em que o worker
precisa parar e esperar resposta dela).
**Regra:** Usar **2 vagas** como padrão fixo em todo texto de Levantada de Mão (Domingo,
Terça, Quinta), sem perguntar de novo — até o dia em que a Karol mudar esse número
explicitamente.
**Aplica quando:** Escrevendo qualquer texto de Levantada de Mão que mencione número de
vagas disponíveis.

## [21/08/2026] — Banco de histórias reais existe e pode alimentar formatos 🔴 baseados em texto
**Origem:** Karol perguntou se os formatos não davam pra puxar do banco de histórias que o
Squad Conteúdo Arcane já mantém (`docs/producao-conteudo/karol/historias-trajetoria.md` e
`historias-mentorias-atendidas.md`) — achado confirmado, os dois arquivos existem, com
histórias reais catalogadas (usadas e disponíveis) e regra clara de "usar sem inventar
detalhe".
**Regra:** Antes de tratar **De Volta ao Passado** ou **Depoimento ou Bastidor** como 🔴
bloqueado esperando conteúdo novo da Karol, checar primeiro se já existe história disponível
nesses dois bancos que sirva sem precisar de foto/vídeo novo. Se servir, o formato pode ser
gerado como 🟢/🟡 (texto sobre fundo, sem esperar produção nova dela) — reclassificação
proposta, ainda não aplicada na tabela oficial de `rotina-stories-formatos.md` (pendente
aprovação dela). **Day Off, Você no Game e Atualização continuam 🔴 de verdade** — exigem
foto/vídeo do momento específico, os bancos de texto não resolvem esses.
**Aplica quando:** Decidindo um formato 🔴 do catálogo rotativo, antes de perguntar à Karol
por conteúdo novo.

## [14/08/2026] — Frase-ponte do Day Off é opcional, não obrigatória
**Origem:** No Story da amiga da Polônia, a frase-ponte original ("O que parece simples pra
você pode ser desafiador pra quem te acompanha.") não encaixou — a história era sobre presença
e amizade, não sobre estabilidade/tempo livre que a frase pressupõe. Karol pediu pra tirar.
**Regra:** A frase-ponte do formato Day Off só entra quando a cena realmente carrega esse
contraste (rotina estável / tempo livre / vida pós-corrida vs. audiência ainda na correria).
Quando a história tem peso próprio (ex: relação pessoal, amizade, família) sem precisar da
moldura de "simples pra mim, difícil pra quem me acompanha", deixar a história falar sozinha.
**Aplica quando:** Escrevendo o texto de apoio de qualquer Story de Day Off.

---

## Formato de Entrada

```
## [DATA] — [TÍTULO DA REGRA]
**Origem:** [o que aconteceu]
**Regra:** [o que fazer / não fazer]
**Aplica quando:** [condição]
```
