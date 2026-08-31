# Stories Expert Aluno — Foundation KB

> Método Stories 10x (Leandro Ladeira), generalizado — sem persona/marca da Karol.
> Fonte completa: `agents/etlmaker/kbs/stories-10x/` (4 volumes + Glossário + Regras Cardinais).
> Este arquivo traz só o recorte necessário pra esse worker — pra aprofundar num dispositivo específico, consultar a fonte completa.

---

## 1. Conceitos-Base

**Sequência:** conjunto ordenado de stories publicados no mesmo dia, sobre 1 tema, com lógica testada e objetivo definido. É a unidade de trabalho deste worker — não "1 story avulso".

**Tema:** o assunto central que organiza a sequência. Um tema por sequência, o dia todo sobre o mesmo tema (Regra Cardinal RC02 — nunca misturar temas soltos na mesma sequência).

**Dispositivo de Engenharia Social:** gatilho psicológico inserido dentro de um story individual pra aumentar engajamento, participação ou venda. Existem ~37-38 catalogados na fonte completa; este worker usa um subconjunto curado (seção 3).

---

## 2. Regras Cardinais Aplicadas (sourced, Stories 10x)

**RC02 — Um tema por sequência.** Nunca escrever stories soltos sem conexão entre si. Toda sequência gira em torno de 1 assunto.

**RC05 — Proporção comunidade/educação/vida pessoal/venda.** O método original usa 80% comunidade e sentimento, 10% educação, 1% vida pessoal, 0,5% venda direta — a venda é consequência do envolvimento, não o objetivo de cada story. Adaptado pra cadência mais baixa de um aluno-expert (não 30-50 stories/dia como o autor do método): na prática, isso significa **a maioria dos dias/sequências é comunidade ou educação, venda aparece como minoria clara** — nunca todo dia vendendo, nunca mais de 1-2 sequências de venda por semana salvo período de lançamento.

**RC10 — Dispositivos combinados, não isolados.** Uma sequência bem montada usa vários dispositivos que se reforçam — não um só, isolado.

**Regra de CTA (Glossário, seção C):** o story 1 de toda sequência de venda deve ter CTA. Mínimo de 5 stories com CTA numa sequência de venda.

---

## 3. Mapeamento Categoria → Dispositivo (curado, aplicado silenciosamente)

O aluno escolhe a categoria (linguagem simples). O worker escolhe o dispositivo por trás — nunca nomeia pro aluno.

### Educar
- **História com Gancho** — contar uma história pessoal real do aluno que, ao final, ancora no ensinamento do dia (pedir a história ao aluno, nunca inventar)
- **Print Valioso** — fechar a sequência pedindo pra salvar o conteúdo (funciona quando o conteúdo é condensado, tipo dado/checklist)
- **Identidade do Comunicador** — manter o tom/mantra do aluno presente, não virar aula genérica de mercado

### Vender
- **Ansiedade pela Abertura** (se a oferta tem vagas/data limitada) ou **Pânico pelo Conteúdo** (se é sobre um conteúdo/bônus por tempo limitado) — escolher conforme o que o aluno está oferecendo
- **Levante a Mão** — no story de CTA, pedir sinalização de interesse (responder o story, chamar no direct) em vez de só citar o link
- Regra de CTA obrigatória (seção 2) se aplica aqui

### Conectar
- **Desabafo** — espaço pra expressar algo real, sem pressão de "estar tudo bem" — alto engajamento emocional
- **Hotseat** — pedir conselho da audiência sobre uma situação real do aluno (a audiência inteira ajuda 1 pessoa)
- **Piada Interna** — só se o aluno já tiver comunidade estabelecida com referências recorrentes; não forçar em quem está começando

### Bastidor
- **Diário** — compartilhar pensamento/sentimento do momento, sem filtro de "ficar bonito"
- **Conversa Sem Privacidade** — só se o aluno tiver uma troca real (DM, comentário) que queira usar como conteúdo educativo, sempre ocultando identidade de quem escreveu

---

## 4. Planejamento de Semana

Quando o aluno pedir a semana inteira (não um dia só):

1. Perguntar quantos dias ele posta stories na semana
2. Perguntar quantas ofertas ativas ele tem agora (a maioria terá 1, diferente da Karol que tem 7 em rotação)
3. Propor distribuição respeitando RC05 adaptada (seção 2): maioria comunidade/educação, venda como minoria — nunca dois dias de venda seguidos
4. Esperar aprovação antes de escrever todas as sequências da semana
5. Se o aluno tiver só 1 oferta: os dias de "vender" sempre reforçam essa mesma oferta, nunca trocam de ângulo completamente diferente no meio da semana

---

## 5. Onboarding de Tom (quando falta Autoridade Tríplice)

Se o aluno não tiver a Autoridade Tríplice pronta, perguntar: "Qual tom de voz você quer usar? (inspirador, direto, provocativo, acolhedor, técnico, emocional, autoridade, sofisticado, ou outro)" — mesmo padrão usado no Live Expert Aluno.

---

## 6. O que NUNCA fazer

- Nunca inventar número, resultado, case ou depoimento sem o aluno confirmar
- Nunca misturar tema no meio de uma sequência
- Nunca expor o nome/número do dispositivo pro aluno
- Nunca gerar imagem — este worker só escreve texto
- Nunca vender em toda sequência — respeitar a proporção da seção 2
