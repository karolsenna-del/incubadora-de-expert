# Arquitetura do Prompt — As 4 Camadas

> KB do `bia-chief` para consultoria. Explica como o "cérebro" da Bia é montado em camadas, o que muda quando, e como trocar campanha sem mexer no código.

---

## Por que camadas

O prompt da Bia não é um texto único. É montado em 4 camadas independentes, empilhadas. Isso separa o que quase nunca muda (regras de WhatsApp) do que muda toda campanha (produto, data, oferta). Assim você troca a oferta sem arriscar quebrar a personalidade dela.

| Camada | Nome | O que tem | Muda com que frequência |
|--------|------|-----------|--------------------------|
| **L1** | Plataforma | Regras de formato WhatsApp, segurança, anti-"cara de robô", limite de mensagens | Quase nunca |
| **L2** | Persona | Quem a Bia é: nome, jeito de falar, valores, o que nunca faz | Só se trocar a identidade dela |
| **L3** | Objetivo | A missão do modo ativo: como conduzir a conversa (triagem, recovery, etc.) | Quando muda a missão |
| **L4** | Campanha | Os dados do que ela está oferecendo: produto, links, objeções, prova social | A cada campanha |

L1 + L2 + L3 ficam no **system prompt** (dentro do workflow AGENT-CORE, no node "Configuracao do Agente"). L4 fica numa **tabela do Supabase** (`bia_campaign_data`) e é injetada em tempo de execução.

---

## A regra de ouro: campanha muda na L4, não no código

Quando você troca a oferta (novo produto, novo link, nova prova social), você **edita a L4 no Supabase** — não mexe no prompt do workflow. L1/L2/L3 ficam intactos.

Por quê: se você editasse o prompt do workflow toda campanha, ia arriscar quebrar a sintaxe (um erro mata a Bia) e perder a personalidade. Mantendo a campanha na L4, a troca é segura e reversível.

---

## A regra que evita matar a Bia: nada de preço fixo no prompt

Preço muda por lote, oferta e cupom. Se você cravar "R$ X" no prompt, ele fica desatualizado sem ninguém perceber e a Bia passa a mentir o preço.

Em vez disso: a Bia trabalha com "desconto especial" e **links que já têm o desconto aplicado**. Se o preço muda, você troca só o link. Se o lead pergunta o preço cheio, ela direciona pra página de vendas.

---

## Datas: dinâmicas, nunca hardcoded

Se a Bia menciona data de evento, essa data **não fica escrita no prompt**. Ela vem de uma tabela do Supabase (`workshop_config`) e é substituída em runtime, via placeholders tipo `{{data_full_text}}`.

Pra trocar a data do evento (= virar o ciclo), você atualiza essa tabela (script `workshop-cycle.mjs shift` ou edição direta no Supabase). Todos os modos da Bia passam a falar a data nova na hora, sem reimportar nada.

> Por isso: **não substitua os `{{data_*}}` manualmente** ao customizar os prompts. Eles são preenchidos sozinhos. Os outros placeholders (`{{NOME_AGENTE}}`, `{{NOME_EXPERT}}`, etc.) você troca uma vez, na instalação.

---

## Como devolver o controle pra Bia (depois do handoff)

Quando um humano assume uma conversa pelo Chatwoot, a Bia para de responder aquele contato. Pra ela voltar a atender:

1. Limpar a flag de "humano assumiu" no contato (Supabase).
2. Resetar o modo: `active_agent_id` de volta pro modo certo (geralmente `bia`).

Enquanto a flag estiver ligada, a Bia respeita e fica calada — de propósito, pra não atropelar o atendimento humano.

---

## Resumo prático (perguntas frequentes)

| Quero… | Mexo em… |
|--------|----------|
| Trocar o produto/oferta que a Bia vende | L4 no Supabase (`bia_campaign_data`) |
| Mudar a data do evento | Tabela `workshop_config` (não o prompt) |
| Mudar como a Bia fala (tom, nome) | L2 (system prompt) — com cuidado e validando o JS |
| Mudar a estratégia de conversa de um modo | L3 do modo (system prompt) |
| Devolver uma conversa pra Bia após assumir | Limpar flag + resetar `active_agent_id` no Supabase |
| Mudar regra de formato (ex: tamanho das mensagens) | L1 (system prompt) — raríssimo |

> Toda alteração no system prompt (L1/L2/L3) exige validar o JS (`node -c`) antes de salvar e fazer o cache cycle depois. Ver `data/kit/regras.md`.
