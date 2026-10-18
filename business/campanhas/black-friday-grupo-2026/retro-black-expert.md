# Retro — Black Expert 2026 (live de fechamento 14/10)

> Roteiro preparado pelo Companion na noite de 14/10, pra fazer com a Karol no dia 15/10 (cerca de 30 min, à tarde).
> Regra: diagnóstico antes de conclusão. Número que não temos fica em branco, sem estimativa.

## Resultado

- **Vendas:** 0 (meta: 4 × R$5.000 = R$20 mil). Carrinho fechou 14/10 às 23h59.
- Condição de amanhã já anunciada: Grupo a R$7.500. **Não estender a Black.**

## O funil, etapa por etapa

| Etapa | Número | Fonte | Status |
|---|---|---|---|
| Convidados por WhatsApp individual | 226 (131 API + 95 1:1) | `vault/.../envios-agendados.log` | ok |
| Mensagens individuais em 14/10 | 4 × 226, todas aceitas pela API, 0 erros (dia_live 9h · cadê você 14h05 · oferta 14h15 · inscrições abertas 17h11, horário de Cuiabá) | log de envio | ok. **Entrega real desconhecida** (ver Achado 2) |
| E-mails | #1 (28/09) · #3 (05/10). #2 não saiu | contexto/cockpit | aberturas: ___ (Resend) |
| Membros no grupo da Black | **47** | Karol (16/10) | ok |
| Membros do grupo de lives gratuitas (também recebeu tudo) | **80** (não sabemos quantos estão nos dois grupos) | Karol (16/10) | ok |
| Presentes na live | **20** | Karol (16/10) | ok |
| Presentes na hora da oferta | **16** (80% de quem entrou ficou até o pitch) | Karol (16/10) | ok |
| Pesquisa "o que pesou?" (15/10 9h) | 226 aceitos pela API, 0 erros | log de envio | respostas: ___ |
| Visitas na página da Black | ___ | GA4 "Gestão pra Tudo" (ver Achado 1) | falta |
| Cliques em "comprar" (pré-checkout) | **0** | CRM `crm_leads`, origem `black_expert_precheckout` | conferido 14/10 ~22h45; o único registro é o teste da Karol de 10/10 |
| Checkouts iniciados na Voomp | **0** | Karol (16/10) | ok |
| Vendas | 0 | — | ok |

**Leitura com os números da live (16/10):**
- **A live segurou bem:** 16 de 20 ficaram até a oferta. O conteúdo prendeu.
- **O gargalo foi o volume antes da live:** 226 convidados viraram 47 no grupo, que viraram 20 na live. A meta de 4 vendas exigia que 1 em cada 4 pessoas no pitch comprasse (25%), uma taxa muito alta pra qualquer oferta.
- **E nenhum dos 16 clicou em comprar.** Então não basta dizer "faltou gente": quem viu a oferta também não chegou nem a abrir o checkout. As respostas da pesquisa vão dizer se foi valor, momento, clareza ou outra coisa.

## Achados técnicos (não explicam o zero, mas cegaram a medição)

1. **A página da Black mede no GA4 errado.** `paginas-vendas/site/black-expert/index.html` usa `G-NB7W76T3RX`, a propriedade "Gestão pra Tudo", que tinha sido removida das outras páginas em 18/09. As visitas existem, só que nessa propriedade. Para a retro: olhar lá. Depois: corrigir para `G-7BNGTVK9EK`.
2. **O CRM não recebe mensagem de WhatsApp desde 02/10.** O último evento em `crm_whatsapp_events` é de 02/10. A causa ainda não foi confirmada: os eventos pararam antes do cancelamento do Dualhook (10/10), e o webhook do app novo também não foi inscrito. Consequências: (a) respostas às mensagens de hoje só estão no app do celular; (b) não temos status de entregue/lido/falhou dos 4 envios.
3. O pré-checkout **funciona**: teste em 14/10 ~22h45 gravou, e o registro de teste foi apagado em seguida. O zero é real.

## Conversas com quem chegou perto (manhã do dia 15)

Pergunta única, sem vender: *"O que te fez não entrar agora?"*

| Pessoa | Onde esquentou (live / respondeu / 1:1 / BLACK no Insta) | Resposta |
|---|---|---|
Fonte: planilha operacional do CRM (coluna Observação), preenchida pela Karol em 16/10. Os nomes ficam só no CRM.

| Lead | Onde esquentou | O que disse | Próximo passo |
|---|---|---|---|
| 1. Consultora de amamentação (comprou workshop antigo) | assistiu a live inteira | Acha que a área dela só funciona presencial. Já tinha ouvido a oferta do VIP (R$1.500) em fev/26 e sumiu | contato 17/10 |
| 2. Lead do pré-diagnóstico, morando fora | veio na live, saiu antes da oferta e pediu o valor | Pausa no presencial até 03/2027, quer atender mais online; "o valor da Incubadora não cabe" | alternativas na mesa: recorte da Validação ou VIP |
| 3. Participante das lives semanais | grupo | "Momento inviável". Mesmo se a dedicação coubesse, o valor ainda impediria. Ainda não se sabe se é orçamento ou percepção de retorno | sem data |
| 4. Lead do pré-diagnóstico | conversa depois da Black | Não entendeu como a mentoria funciona porque não viu a live | precisa da explicação |
| 5. Investidor em ativos reais | WhatsApp | Já investiu em outro programa e só decide depois de implementar e ver resultado até o fim do ano. Quer **apoio pra estruturar e executar, não conteúdo novo** | sem data |
| 6. Lead adicionada à mão | conversa depois da Black | "Não é o momento" | sem data |
| 7. Colega da agência (CLT, curso presencial de milhas na 4ª turma) | veio na live e amou | Valor não cabe agora (momento pessoal e financeiro). Karol prometeu uma proposta com tempo e valor menores | definir a proposta |
| 8. Aluno do Sprint | assistiu, achou "super completo" | Perguntou como fica pra quem já fez o Sprint. Proposta enviada: continuação de 6 meses por R$3.000 | aguardando resposta |

> Também em `agents/vendedor-expert/data/vendedor-expert-aprendizados.md` (14/10): uma lead respondeu em áudio longo e recebeu a resposta por escrito (regra nova: espelhar o formato).

**Padrões nas respostas:**
- Valor ou momento apareceu em 4 das 7 que não compraram (2, 3, 6, 7). Em 2 delas há outro sinal junto: a 3 não deixou claro se é orçamento ou retorno percebido, e a 7 é CLT querendo renda extra, ou seja, está no começo.
- Os outros 3 motivos não são preço: crença de que a área só funciona presencial (1), não entendeu a oferta (4), já está em outro programa e quer execução, não conteúdo (5).
- A lead 1 já tinha recebido uma oferta de R$1.500 em fevereiro e também não comprou. O ticket mais baixo sozinho não destravou.
- A Karol já está improvisando uma versão menor na conversa: recorte da Validação (2), proposta menor prometida (7), continuação de 6 meses por R$3.000 (8).

**16/10:** Karol ofereceu o curso gravado Expert360º pra lead 2 (Franciele) e pra lead 7 (Camila, colega da agência). Camila foi cadastrada no CRM em 17/10 como lead própria, e as duas ofertas ficaram registradas no histórico.

**Ponto a conferir:** a anotação da lead 7 está na única linha `black_expert_precheckout` da planilha, com nome "Karol". Pelo conferido em 14/10 às 22h45, essa é a linha do teste de 10/10. Outro agente provavelmente usou essa linha pra anotar a conversa. O funil fica em **0 cliques**, a não ser que a colega também se chame Karol e tenha clicado. Arrumar o CRM: tirar a anotação da linha de teste e cadastrar a colega com a origem certa.

## As 3 perguntas da retro

1. **O que funcionou?** (Karol, 16/10) A oferta, na leitura dela, foi excelente. 20 pessoas na live foi motivo de alegria. A apresentação teve energia e empolgação, e 16 de 20 ficaram até o pitch.
2. **O que não funcionou?** (Karol, 16/10) "Não sei o que não funcionou." Hipótese dela: a necessidade da lead não está dando match com o que ela oferece. Os poucos leads disseram que não tinham dinheiro e a conversa acabou ali.
3. **O que muda na próxima oferta?** (Karol, 16/10, **em análise, não decidido**) A persona ainda está fora do digital e não compra R$5 mil no offline (só móveis). Ideia: enxugar a oferta, voltar pra 6 meses, reduzir a jornada e cobrar menos. Talvez só a Validação, sem Posicionamento e Escala.

## Hipóteses para testar com os dados (não são conclusões)

- **Público:** base fria ou pequena demais para uma oferta de R$5 mil numa live só.
- **Aquecimento:** grupo montado em cerca de 15 dias. Se houve pouca interação no grupo, faltou relação antes da oferta.
- **Oferta e pitch:** quem viu a oferta não sentiu urgência ou clareza (mas aí esperaríamos alguns cliques na página).
- **Canal:** venda de ticket alto costuma fechar no 1:1. O Vendedor Expert/Secreto rodou na noite do dia 14: quantas conversas aconteceram? ___

## Decisões a tomar (dia 15 ou depois)

- [x] O que fazer com quem demonstrou interesse. **Decidido 16/10:** antes de redesenhar o Grupo, testar no 1:1 um formato menor (Validação, 6 meses) com as leads quentes (2, 7 e 8, mais quem fizer sentido). O Grupo a R$7.500 fica como está até o teste dar resposta.
- [x] Definir o formato do teste: o que entra, duração e preço (Karol) — Incubadora Express, 17/10
- [x] Mandar a explicação da mentoria pra lead 4, que não viu a live (confirmado na weekly 18/10)
- [x] Arrumar a linha de teste do CRM que recebeu a anotação da lead 7 (confirmado na weekly 18/10)
- [ ] Corrigir o GA4 da página (Gestor de Infra)
- [ ] Religar o webhook do WhatsApp no CRM (Gestor de Infra)
- [x] Registrar o aprendizado no log de decisões (16/10)
- [x] **18/10 (com o Clone Euriler):** Sessão Estratégica como método único, nenhum funil novo por 60 dias, meta de 3 sessões por semana, só 2 opções na sessão (Sprint R$5.000 pra quem não tem tempo · Incubadora Express R$2.500). Detalhe em `log-decisoes.md` (18/10)
- [ ] Oferecer a Incubadora Express às 3 leads combinadas, incluindo a 7, até 23/10 (lead 8: continuação do Sprint já oferecida · lead 2: Expert360º + sessão avulsa já oferecidos)
- [x] Lead 5: página do Sprint enviada (18/10). Nova conversa combinada pro fim do ano (marcar data exata no CRM)
- [ ] Leads 1, 3 e 6: entram na lista de convites 1 a 1
- [ ] Convites 1 a 1 pra base: 5 por dia útil a partir de 19/10. Na sexta, 23/10, contar quantos viraram sessão e recalibrar
- [ ] Tráfego pago: nada até 30/10. Nessa data, decidir com os números de 2 semanas de convite. Só entra se a base acabar antes das 3 sessões por semana ou se as sessões começarem a fechar venda. Se entrar, o anúncio leva pro mini-treinamento → WhatsApp → sessão (sem funil novo). Antes: assistir à trilha de Tráfego
