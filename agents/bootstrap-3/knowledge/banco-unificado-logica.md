# A Logica do Banco de Dados Unificado

> KB conceitual do Bootstrap 3 — usada pelo @b3-chief pra consultoria (antes,
> durante e depois do setup). Destilada da arquitetura REAL do Supabase da Arka
> (47 tabelas, 46k pessoas, 18k compras), traduzida pro momento do aluno.

---

## Tese central: 1 banco, N consumidores

O aluno tem **um unico projeto Supabase** que serve a operacao digital INTEIRA: captura de leads, compras de todas as plataformas, automacoes, e (depois) a Bia e o que mais vier. Nao e um banco por ferramenta — e UM banco com a verdade, e as ferramentas orbitando.

Por que isso importa: quando os dados moram juntos, qualquer pergunta do negocio vira UMA consulta. "Quem capturou na campanha X e nunca comprou?" "Quanto cada campanha vendeu?" "Quem comprou A mas nao B?" Com dados espalhados (um CRM aqui, uma planilha ali, a plataforma de pagamento la), essas perguntas viram tarde de trabalho manual — ou nunca sao respondidas.

## As 3 camadas

### 🧱 Camada 1 — CORE (o que o Bootstrap 3 cria)

Dados-FATO que sobrevivem a qualquer mudanca de ferramenta, produto ou estrategia:

| Tabela | O que e |
|---|---|
| `pessoas` | HUB — toda pessoa que tocou o negocio. 1 linha por ser humano. Email = identidade |
| `capturas` | Diario de leads — cada form/LP preenchido, com atribuicao (UTMs, campanha) |
| `compras` | Livro-caixa — cada pagamento, de qualquer plataforma, normalizado |

Caracteristicas: fato puro ("compra aconteceu", "lead se cadastrou") · nao depende de qual ferramenta processou · schema estavel por anos.

### 🤖 Camada 2 — SISTEMAS (cada automacao/app traz as suas)

Cada sistema que roda POR CIMA do core tem tabelas proprias, conectadas ao hub via `pessoa_id` (ou phone normalizado). A Fase 2 ja cria as primeiras:

| Sistema | Tabelas | Conexao com o core |
|---|---|---|
| Dispatcher | `disparos_agendados`, `dispatches_log`, `blacklist` | `pessoa_id` / phone |
| Recovery | `recovery_contacts` | `pessoa_id` direto |
| Bia (depois) | `bia_*` (vem com `/instalacaoBia`) | match por phone/email |

Regra de ouro: **se o sistema for desligado, o core nao quebra** — as tabelas dele viram historico. E sistema NUNCA escreve identidade no core (le e linka; quem escreve pessoa e o fluxo dono do upsert).

### 📊 Camada 3 — DERIVADA (calculo, nao fato)

Views, dashboards, metricas. Nao guarda fato novo — calcula em cima das camadas 1 e 2. Pode ser dropada e recriada sem perda. O aluno chega aqui naturalmente quando quiser relatorios.

## Como decidir onde algo entra (perguntas-teste)

| Pergunta | Resposta → Camada |
|---|---|
| "Se eu desligar a ferramenta hoje, esse dado ainda faz sentido amanha?" | SIM → Core · NAO → Sistema |
| "Posso recalcular isso do zero a partir de outras tabelas?" | SIM → Derivada |
| "E um webhook de pagamento ou form de captura escrevendo?" | Tende a Core |
| "Tem um app/automacao especifico que e dono disso?" | Sistema |

## Os 5 principios (e a dor real de onde cada um veio)

1. **Email e a chave universal.** `trim().toLowerCase()` antes de TODO insert/match. Upsert por `onConflict: email`. *Dor de origem: sem isso, a mesma pessoa vira 5 registros — compras espalhadas, dashboard mentindo, automacao mandando mensagem duplicada.*

2. **Telefone normalizado: so digitos com DDI 55.** *Dor de origem: o banco da Arka convive ate hoje com `(85) 99996-7696` e `5585999967696` — lookups por telefone falham conforme o formato. O aluno nasce sem essa divida.*

3. **Fatos sao append-only.** Compra nao se edita: cancelamento e linha NOVA com status proprio. *Dor de origem: historico imutavel ja salvou fechamento de ciclo e auditoria de atribuicao na Arka. Editar fato = apagar a verdade.*

4. **RLS service-role only.** Frontend nunca toca o banco direto — fala com servidor, servidor fala com banco. *Dor de origem: anon key com acesso = banco publico na internet, lista de clientes exposta.*

5. **Sistemas nao escrevem no core.** Camada 2 le e linka via `pessoa_id`. *Dor de origem: quando todo mundo escreve identidade, ninguem e dono — e o core apodrece junto com o pior workflow.*

## Como o banco cresce sem virar bagunca

O do aluno nasce com 3 tabelas. O da Arka tem 47 — e continua saudavel porque TODA tabela nova seguiu a mesma regra: aponta pro hub, nao duplica identidade, pertence a um sistema com dono claro.

Quando o aluno quiser a tabela do nicho dele (`agendamentos`, `aulas_assistidas`, `pedidos_orcamento`...):
1. Coluna `pessoa_id` referenciando `pessoas`
2. ZERO colunas de identidade propria (email/nome/telefone moram no hub)
3. RLS igual ao core
4. Um sistema dono (quem escreve nela?)

## Perguntas tipicas do aluno (respostas curtas)

**"Por que nao uso um CRM pronto?"** — Pode usar, pra interface. Mas a VERDADE mora no teu banco: o CRM e consumidor, nao dono. CRM troca, dado fica. (E CRM pronto custa por usuario/mes pra sempre — o teu banco e ~gratis no Supabase ate escala consideravel.)

**"O que acontece quando a mesma pessoa compra 2x?"** — `pessoas`: a MESMA linha (status ja era comprador). `compras`: linha nova. E exatamente assim que se responde "quantos clientes recorrentes eu tenho?" com 1 query.

**"Posso usar esse banco pra outra coisa (outro projeto)?"** — Mesmo NEGOCIO, sim — e a tese (1 banco, N consumidores). Negocio SEPARADO (outra empresa, white-label, cliente): projeto Supabase separado.

**"Quando entra a Bia nisso?"** — A Bia (`/instalacaoBia`) chega depois, criando as tabelas `bia_*` dela na Camada 2 — no MESMO banco, plugada no MESMO hub, morando no MESMO servidor da Fase 0. E o melhor exemplo de como o desenho cresce: sistema novo, core intacto.
