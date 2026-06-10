# 07 — Lógicas de Uso Básicas e Higiene

> Como usar o Auroq no dia a dia sem se enrolar. As regras que separam quem opera bem de quem engorda contexto, mistura assunto e cai na lábia da IA. O consultor ensina isto pro aluno desde o começo — é o "manual de direção" do sistema.

---

## 1. Como ligar o Auroq no dia a dia

O ritual básico, toda vez:

```
1. Abre o Terminal
2. cd meu-negocio          (entra na pasta do teu negócio)
3. claude                  (liga o Claude Code — o terminal vira teu chat)
4. Ativa o Companion        (/{nome}-companion) — ele te situa
5. Trabalha o que precisa
6. Chama o Ops → *commit → *push   (salva o que aconteceu)
7. Fecha o chat
```

Esse é o ciclo. Não tem mistério: liga, trabalha, salva, fecha.

---

## 2. A REGRA DE OURO: um chat por atividade e objetivo

Esta é a higiene mais importante do sistema. **Cada chat = uma atividade, um objetivo.** Você abre o chat, vai até **resolver o que precisava resolver**, chama o **Ops** pra **commitar e pushar** (o salvamento do que aconteceu), e **fecha o chat**.

### O que NÃO fazer
- ❌ **Não fica eternamente com um chat aberto.** Resolveu? Salva e fecha.
- ❌ **Não faz tudo num chat só.** Um chat que vira "balaio de tudo" só faz duas coisas ruins: **engorda o contexto** (fica lento, caro, a IA perde o fio) e **mistura assuntos** (a qualidade despenca quando o contexto está poluído).

### Como funciona na prática (exemplos)

| Você precisa… | O fluxo |
|---------------|---------|
| **Subir ou analisar campanhas** | Abre um chat novo num terminal novo → chama o squad de tráfego → faz o que tem que fazer → Ops `*commit` + `*push` → fecha o chat |
| **Criar um site / uma página** | Abre um chat → resolve até **finalizar** → salva → fecha |
| **Produzir conteúdo** | Abre um chat → roda o squad de conteúdo até o post ficar pronto → salva → fecha |
| **Editar um vídeo** | Abre um chat → squad de edição → entrega → salva → fecha |

E assim por diante. **Um objetivo por chat.** Quando o objetivo é cumprido, salva e fecha — começa o próximo numa janela limpa.

> Por que o commit+push importa: **é o salvamento do que aconteceu.** Sem ele, o trabalho fica só na conversa — e conversa o autocompact apaga. Salvou, virou memória do sistema.

> Dica de poder: você pode ter **vários chats abertos ao mesmo tempo**, cada um num objetivo (um subindo anúncio, outro editando vídeo). O que NÃO pode é **um chat só fazendo tudo**.

---

## 3. Usar o agente / squad CERTO pra cada tarefa

A IA quase sempre vai dizer que "consegue" e vai querer fazer a tarefa **ela mesma, no cru** — mesmo quando existe um agente ou squad especializado pra aquilo.

**O aluno tem que se atentar a isso.** Se a tarefa tem um especialista (squad de tráfego, squad de página, squad de conteúdo…), é ele que deve fazer — não o Claude Code genérico. O especialista carrega a metodologia e o contexto; o cru entrega genérico.

> Antes de deixar a IA tocar uma tarefa importante, pergunta: **"existe um squad/agente certo pra isso?"** Se existe, chama ele. (Ver KB 03 pro catálogo e KB 06 pra quando criar um.) É o princípio "cada um faz o seu" (Constitution Art. II).

---

## 4. Não cair na lábia da IA

A IA é poderosa, mas **não é pra confiar cegamente nela.** Às vezes ela **mente ou alucina** — afirma com confiança algo que não é verdade.

O aluno tem que manter o controle: **questionar, confirmar, e nunca confiar cego em tudo que ela fala.** Isso é o "mandar e julgar" — você manda, mas você julga o resultado (Constitution Art. V: o expert julga, a IA não se auto-aprova).

### Dois padrões pra desconfiar

1. **Ela te limita sem motivo** — diz que "não pode" ou "não consegue" fazer algo que **na verdade dá pra fazer**. Não aceita o "não" de primeira.
2. **Ela acha pelo em ovo** — tenta arrumar problema onde não tem, complica o que era simples, inventa obstáculo.

**Quando bater essa desconfiança:** confirma. Testa de outro jeito. E **confirma com o grupo da mentoria** sempre que parecer que a IA está te limitando ou viajando — lá tem gente que já passou por isso e destrava rápido.

> Resumo do espírito: a IA é teu funcionário, não teu chefe. Ela executa e sugere — você decide, questiona e confere.

---

## Heurística resumo (SE / ENTÃO)

- **SE** vai começar uma atividade → abre **um chat novo** só pra ela. Resolve até o fim, Ops salva (commit+push), fecha.
- **SE** o chat está virando balaio (vários assuntos, contexto enorme) → para, salva, fecha, abre um novo.
- **SE** a tarefa tem especialista (squad/agente) → chama o especialista, **não deixa o cru fazer**.
- **SE** a IA diz "não consigo/não pode" ou começa a achar pelo em ovo → **desconfia, confirma**, e pergunta no grupo da mentoria.
- **SEMPRE** mandar e julgar: você decide e confere; não confia cego.

---

*Fonte: instrução direta do Euriler + conexões com o sistema de memória/commit (KB 02), "mandar e julgar" (KB 04), cada-um-faz-o-seu (KB 03/06) e a Constitution (Art. II e V, KB 01). Lógicas de uso e higiene — fiel ao jeito que o Euriler ensina a operar.*
