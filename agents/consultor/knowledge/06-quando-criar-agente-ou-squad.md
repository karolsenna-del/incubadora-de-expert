# 06 — Quando Criar (ou NÃO Criar) um Agente ou Squad

> O critério de decisão mais importante pra não cair em dois extremos: criar squad pra tudo (perde tempo) ou pra nada (perde qualidade). O consultor usa isto quando o aluno pergunta "vale fazer um agente pra isso?", "skill ou squad?", "como crio?".

---

## A pergunta central

Antes de criar qualquer coisa, a pergunta é: **vale codificar isso num agente/squad, ou o Claude Code resolve direto?**

A resposta vem de uma regra simples: **você cria quando existe um "jeito certo" que precisa ser garantido toda vez.** Se não existe jeito certo a proteger, não cria.

---

## QUANDO **NÃO** criar (resolve no Claude Code direto)

Não vale a pena criar agente/squad quando é:

1. **Conhecimento geral** que o Claude Code já sabe nativamente (ex: "resume esse texto", "traduz isso", "me explica X")
2. **Algo simples** — uma tarefa direta que não tem segredo
3. **Sem especialização / sem metodologia específica** — qualquer jeito de fazer serve
4. **One-off** — você vai fazer uma vez só, não vai repetir

> Nesses casos: usa o Claude Code cru (ou uma skill simples) e resolve na conversa. Criar um squad pra isso é desperdício — gasta tempo montando o que a IA já faria sozinha.

---

## QUANDO criar (codifica num agente/squad)

Vale a pena criar quando você quer:

1. **Controle de qualidade** — garantir que sai do jeito certo, não genérico
2. **Repetir sem erro** — é uma atividade recorrente, e você não quer reinventar (nem errar) toda vez
3. **Metodologia ou processo específico** — existe UM jeito que funciona, e ele precisa ser seguido
4. **Especialização** — a tarefa exige profundidade que o cru não entrega

### Por que isso muda o jogo (na prática)

O exemplo do Euriler: pedir "cria uma página de lançamento pago" pro Claude Code **cru** → sai genérico. *"Vai ficar bom? Não. Vai ser suficiente pra dar certo? Não. Por quê? Porque ele não tem contexto, não tem workflow, não tem nada."*

A **mesma IA com a skill** → lê a metodologia, entende como se estrutura uma página do jeito certo, e te guia por ela. *"Ela vai ficar do jeito que eu sei que é bom, seguindo a estrutura que já funciona."*

> **O coração de um agente/squad é um processo que funciona — e que VOCÊ sabe.** "A skill de lançamento pago, eu tenho que saber como faz uma página do jeito certo. Eu sei, por isso que tá aqui." Você não codifica o que não domina; você codifica o que já funciona pra garantir que se repita com qualidade.

Bônus: quando o método melhora, você atualiza **o agente** — não precisa refazer tudo toda vez. O conhecimento fica acumulado, não solto na conversa.

---

## Qual NÍVEL criar — skill → squad → superagente

Decidiu que vale criar? Agora escolhe o nível certo (do mais simples pro mais complexo):

| Nível | Quando | O que é |
|-------|--------|---------|
| **Skill** | 1 função especializada, 1 jeito certo | 1 arquivo com a metodologia (ex: skill de página) |
| **Squad** | processo com várias etapas e papéis | vários agentes, um passa o bastão pro outro (ex: squad de lançamento: copy + design + estrategista + chefe) |
| **Superagente** | precisa de uma mente inteira | clone (uma pessoa real) ou mente sintética (vários experts num tema) |

> Regra de ouro do tamanho: **quanto mais específico/nichado, melhor.** "Não criaria um squad da empresa inteira — um squad pra cada coisa." Squad genérico/largo performa pior.

---

## A FONTE do conhecimento — de onde vem o "jeito certo"

O que alimenta o agente/squad/clone pode vir de **duas origens**:

1. **De você mesmo** — o seu próprio processo, a sua metodologia, o jeito que VOCÊ faz e sabe que funciona. (É o caso da maioria das suas skills/squads: você codifica o que já domina.)
2. **De fonte externa** — clonar outra pessoa (a partir de vídeos, cursos, conteúdo bruto dela), ou juntar os melhores experts do mundo num tema (mente sintética), ou tratar um material que você comprou/acumulou.

Em ambos os casos, o conhecimento bruto passa por **ETL** (extração e tratamento) antes de virar agente. "A construção é um processo de ETL de conhecimento bruto — mas o coração é um processo que funciona."

---

## Antes de criar: REUSE > ADAPT > CREATE

A Constitution (Art. VI) manda **nunca criar do zero sem checar o que já existe**:
- **REUSE** — já tem um squad/skill que resolve? Usa.
- **ADAPT** — tem algo parecido? Adapta.
- **CREATE** — só cria do zero quando não existe nada que sirva.

O aluno já recebe vários squads prontos (tráfego, lançamento, conteúdo, vídeo, etc.) — antes de criar, vê se um deles já cobre.

---

## Qual ferramenta usa pra criar (roteamento)

Decidiu criar? O agente certo pra fabricar:

| Você quer criar… | Use |
|------------------|-----|
| Um squad (processo multi-etapa) | **Squad Forge** (`/auroq-squad-forge`) |
| Uma mente sintética ou consultor (1 tema, vários experts) | **Mind Forge** (`/auroq-mind-forge`) |
| Um worker (funcionário digital de uma tarefa) | **Worker Forge** (`/auroq-worker-forge`) |
| Um clone de pessoa real | **Clone Forge** (`/auroq-clone-forge`) |
| Tratar a fonte de conhecimento (bruto → KB) | **ETLmaker** (`/auroq-etlmaker`) |

---

## Heurística resumo (SE / ENTÃO)

- **SE** é simples / geral / one-off / sem método → **NÃO cria.** Resolve no Claude Code (cru ou skill simples).
- **SE** quer qualidade garantida / repetir sem erro / tem método específico → **CRIA.**
- **SE** é 1 função → **skill.** **SE** é processo com etapas e papéis → **squad.** **SE** é uma mente inteira → **clone** (uma pessoa) ou **mente sintética** (vários experts).
- **A fonte** é você mesmo (seu processo) ou externa (pessoa/cursos) → passa por **ETL** antes.
- **Sempre** antes: já existe? REUSE > ADAPT > CREATE.

---

*Fonte: instrução direta do Euriler + Workshop NDF 23/mai (Dia 1, valor da skill) + Constitution Art. VI (KB 01) + conceitos de squad/superagente (KB 04). Critério de decisão central — fiel à lógica que o Euriler ensina.*
