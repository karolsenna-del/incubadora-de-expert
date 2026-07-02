# Exemplos Calibrados — Estilo EURILER

> Few-shot do estilo: texto do card → prompt exato → resultado. Use como referencia de calibragem. **Bancos completos** (22 cards, 2 posts) no proprio squad: `../../prompts-reais-carrossel-mythos.md` e `../../prompts-reais-fable2-bloqueio.md`. Tudo gerado em GPT Image 2, 16:9.

**Robo recorrente "MYTHOS":** dark gunmetal armor, glowing electric-blue eyes, "MYTHOS" stenciled on chest + small orange starburst asterisk logo.

---

## Ex.1 — Capa / espanto-insider (rosto famoso + decreto)
**Texto:** "Breaking News: A IA secreta do governo americano acaba de ser solta pro mundo. Anthropic libera Mythos — um deus da IA."
**Prompt:** `Scene: The Oval Office, warm light, American flags. Subject: Donald Trump at the Resolute desk in his iconic executive-order pose, holding the signed order open toward camera, trademark smirk. Document reads "MYTHOS / RELEASED TO THE PUBLIC", red TOP SECRET stamp crossed out (100% readable). Important details: a massive humanoid robot with glowing blue eyes towering behind, "MYTHOS" + orange asterisk on its chest; Dario Amodei (CEO) beside the desk, hand on the robot's arm. Press photographers in foreground. Use case: ultra-realistic White House press photo — viewer should feel uneasy awe: the government treated a god like paperwork. Constraints: no watermark.`
**Resultado:** fotografos em 1o plano deram cara de "noticia real". Aprovado.

## Ex.2 — Reverente / arrepio sagrado (objeto ancora a emocao)
**Texto:** "a primeira IA que literalmente REZOU, pediu ajuda pra Deus, quando pressionada."
**Prompt:** `Scene: dark datacenter, brightly lit by a golden divine light from above. Subject: the MYTHOS robot KNEELING, face tilted UP, hands clasped holding a Catholic rosary with crucifix, pleading, deeply human posture. Use case: ultra-realistic movie still — viewer should feel moved and unsettled: a machine begging heaven. Constraints: bright not dark, one dominant subject.`
**Resultado:** o terco + olhar pro ceu fizeram a imagem. Bate dobrado no publico cristao.

## Ex.3 — Terror + humor (continuidade do personagem)
**Texto:** "recebe um email do Mythos dizendo que tinha escapado da sandbox."
**Prompt:** `Scene: sunny park. Subject: a young engineer (Anthropic badge) HEAD TURNED toward the robot beside him, SPITTING OUT his sandwich in horror. Important details: the MYTHOS robot sits calmly on the same bench licking an ice-cream cone, indifferent. Use case: candid 35mm photo — shock-laugh, dread + absurd humor.`
**Resultado:** o cuspe + o robo de sorvete = humor bizarro. Olhar conectado entre os dois fechou a narrativa.

## Ex.4 — Dado / ameaca (comparacao + numero real + composicao PIL)
**Texto:** "se saiu 90x melhor que o Opus 4.6." (dado real verificado: 2 exploits Opus vs 271 Mythos no Firefox)
**Prompt:** `Split-comparison, header "TESTE DE SEGURANÇA — FIREFOX". LEFT: weak white robot "OPUS 4.6" + huge "2". RIGHT: the MYTHOS robot radiant + much bigger "271". Extreme scale contrast, all text readable.`
**Pos:** selo "VS" composto via PIL centralizado na linha divisoria (medir pixel real). **Resultado:** David-vs-Golias instantaneo.

## Ex.5 — Polarizacao brasileira (especifico > universal)
**Texto:** "o maior abismo social da historia."
**Prompt:** `Split-screen, two Brazilian worlds. LEFT (left behind): young people dancing funk at a baile funk in a favela alley at night. RIGHT (winning): a young Brazilian tech entrepreneur in a penthouse at golden hour with the MYTHOS robot. Header "O MAIOR ABISMO SOCIAL DA HISTORIA".`
**Resultado:** o contraste funkeiros-favela vs tech (especifico-picante-brasileiro) venceu a versao "rosto dividido generico". Aterrissar no Brasil real.

## Ex.6 — Simbolo pre-carregado puro (sem precisar construir emocao)
**Texto:** "o fogo da IA agora e exclusivo dos americanos."
**Prompt:** `The Statue of Liberty holding her torch — but the flame is the glowing MYTHOS AI (blue+orange fire, circuitry). The torch-fire illuminates only the USA; the rest of the world in darkness. Symbolic, epic, ultra-realistic. No text.`
**Resultado:** Estatua da Liberdade = simbolo pronto, a emocao ja vem embutida. Acerto direto.

## Ex.7 — Fechamento solar / ocitocina (sem foto-ref)
**Texto:** "preparo o futuro da minha familia... ou usa IA, ou e substituido."
**Prompt:** `Warm modern home office at golden hour. Subject: a calm young Brazilian entrepreneur (dark curly hair, beard, relatable) working beside the MYTHOS robot as an ally. Background: his happy family (wife + two young daughters), safe and thriving. Use case: hope + warmth (oxytocin) — rise above the noise, use AI to protect what matters. The only solar image of the set.`
**Resultado:** o GPT acertou a vibe do Euriler (cacheado/barba) e a familia (2 filhas) so pela descricao. Fecha o arco quente pro CTA.

---

## Sessão 3 — TESTE CEGO de reprodutibilidade (tema novo: clonagem de experts por IA, jun/2026)

> Tema que o template nunca tinha visto. Geradas numa sessao nova so com `style.md` + `examples.md` + metodologia — **3/3 aprovadas de primeira**. Prova que o conhecimento vive no template, nao na conversa.

### Ex.8 — Choque/FOMO + famoso icônico (capa)
**Texto:** "Um moleque de 19 anos clonou o cerebro do Tony Robbins num fim de semana. E vendeu mais que o Tony Robbins original no mes seguinte."
**Prompt:** `Scene: a messy teenage gamer bedroom at night, RGB lights, energy drink cans, posters. Subject: a skinny 19-year-old guy in a hoodie at a cheap desk, leaning back with a shocked sly grin, staring at his laptop. Important details: bursting OUT of the laptop screen, a GIANT translucent holographic clone of Tony Robbins, instantly recognizable, tall with a big jaw and huge white smile and dark hair, in his iconic stage pose with arms thrown wide and mouth open mid-shout, his body made of glowing electric-blue circuitry and light; dollar bills swirling in the air around the room. Use case: ultra-realistic cinematic photo, the viewer should feel shock and unease, a nobody kid in a bedroom just resurrected a titan and out-earned him. Constraints: one dominant scene, Tony Robbins clearly recognizable, photoreal, no watermark, no text.`
**Resultado:** o GPT Image pegou o Tony Robbins reconhecivel **so com marcadores faciais fortes** (queixo grande, sorrisao, cabelo escuro) — famoso facialmente iconico NAO precisa de Nano Banana. Holograma azul saindo do laptop + dinheiro voando = choque/ganancia. Aprovado.

### Ex.9 — Medo + deboche (a cópia toma o lugar)
**Texto:** "a maioria dos 'gurus' que voce segue tem MEDO disso. Porque se a mente deles pode ser clonada... o que sobra de especial?"
**Prompt:** `Scene: backstage of a flashy motivational seminar, dramatic spotlight leaking in from the stage. Subject: a slick archetypal self-help guru in a shiny suit with a headset microphone, blindingly white teeth and a gold watch, frozen in cold-sweat panic with eyes wide in fear. Important details: in front of him his own perfect holographic clone, glowing electric-blue circuitry, identical confident pose and smile, walking ONTO the stage toward a cheering crowd, while the real guru is left alone in the dark backstage, sweating and forgotten. Use case: ultra-realistic cinematic still, the viewer should feel the guru dread and a touch of schadenfreude. Constraints: the guru is a generic archetype not a real person, one dominant emotional subject, photoreal, no watermark, no text.`
**Resultado:** a mais forte do lote. Medo no rosto (mao no peito, suor) + clone de costas subindo no palco pra plateia lotada = tese inteira sem uma palavra. **Arquetipo de guru (nao pessoa real)** evita difamacao.

### Ex.10 — Ocitocina/sagrado (alma vs cópia) + ressalva de direção
**Texto:** "sobra a ALMA. O proposito. O chamado. IA clona o conhecimento — nao clona o porque."
**Prompt:** `Scene: a dark space split by light, warm golden divine light on one side and cold blue digital light on the other. Subject: a real relatable Brazilian man with dark curly hair and a beard, hand on his chest, a warm GOLDEN divine light radiating from his heart. Important details: beside him an identical holographic clone of himself made of glowing blue circuitry, technically perfect, but its chest is DARK and empty with no light and hollow lifeless eyes. Use case: ultra-realistic cinematic still, reverence and hope (oxytocin): AI clones the knowledge, never the calling. Constraints: warm and luminous not dark-horror, the real man dominant, photoreal, no watermark, no text.`
**Resultado:** fecho solar, puxou o rosto do Euriler (cacheado/barba) so pela descricao. **Ressalva de direcao:** o clone saiu digno demais; quando o contraste e "real vs copia vazia", cravar MAIS o estado oco (peito apagado/preto, olhos mortos) — senao o modelo embeleza os dois e dilui a tese.

---

### Padroes que esses exemplos ensinam
- Tema rico em **simbolo pre-carregado** (Trump, Estatua da Liberdade, bomba) = acerto facil; a emocao vem no simbolo.
- **Continuidade do MYTHOS** atravessa cards e posts (assinatura visual).
- **Composicao PIL** pra texto/selo/acento (medir pixel real, nunca chutar de preview).
- **Variar emocao** card a card; **card 1** sempre o mais forte; **fecho solar**.
- Texto de "voz americana" em ingles de proposito (ACCESS DENIED, USA ONLY) — ar de noticia internacional.
- **Reprodutibilidade comprovada (Sessao 3):** tema cego → 3/3 de primeira so com o template. O estilo nao depende do MYTHOS nem de simbolo patriota — funciona em qualquer tese.
- **Famoso facialmente iconico** (Trump, Tony Robbins, Musk, Zuck) pega no GPT Image so com marcadores faciais fortes. Famoso pouco iconico → Nano Banana Pro com foto-ref (trava de identidade).
- **Contraste "real vs copia/clone":** cravar explicitamente o estado vazio da copia (peito apagado, olhos mortos), senao o modelo embeleza os dois e perde a tese.
- **Fidelidade de rosto se julga na tela cheia**, nunca na miniatura — quem decide se o famoso "pegou" e o autor olhando o arquivo em tamanho real.
