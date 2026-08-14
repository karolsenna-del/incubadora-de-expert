# Como a Bia Funciona — Visão Conceitual

> KB do `bia-chief` para consultoria. Explica o que a Bia é e como o pipeline opera, em linguagem de negócio. Genérico — você (aluno) usa a SUA infra, seus números, suas chaves.

---

## O que a Bia é

Uma agente de atendimento/vendas que vive no WhatsApp e responde 24/7. Ela conversa de forma humanizada (mensagens curtas com pausa, como gente digitando), entende o contexto de cada lead, lembra do histórico, e chama um humano quando não dá conta. Não é um chatbot de respostas prontas — é um modelo de IA (Claude, com GPT de reserva) guiado por um prompt que define quem ela é e o que faz.

Roda **100% via WhatsApp Cloud API** (a API oficial da Meta), sem intermediário tipo ManyChat. O cérebro e a orquestração vivem no **n8n**; a memória, no **Supabase**; o painel pro humano assumir, no **Chatwoot**.

---

## O pipeline (o caminho de uma mensagem)

```
Lead manda msg no WhatsApp
  ↓
Meta (Cloud API) → webhook → n8n
  ↓
[WF-INBOUND]   recebe, agrupa mensagens próximas (buffer ~9s),
               descobre quem é o lead (busca no Supabase), trata áudio/imagem
  ↓
[WF-AGENT-CORE] monta o prompt (as 4 camadas + histórico da conversa),
               manda pro Claude, recebe a resposta
  ↓
[WF-OUTBOUND]  quebra a resposta em mensagens curtas, manda com delays
               humanizados via Cloud API, e espelha no Chatwoot
  ↓
Lead recebe (parece pessoa digitando)
```

E o caminho de volta, quando um humano assume:

```
Humano digita no Chatwoot
  ↓
[WF-CHATWOOT-HUMAN] → manda pro WhatsApp do lead via Cloud API
                      e silencia a Bia naquele contato
```

São esses **4 workflows** que este squad instala. Tudo o que está fora disso (recuperação automática de carrinho, boas-vindas pós-compra, disparo em massa) **não é a Bia** — são automações de negócio que usam a Bia, e ficam pra kits futuros.

---

## Memória e buffer (por que ela não se perde)

- **Memória da conversa:** cada troca lead↔Bia é gravada no Supabase (tabela de contexto do agente). A Bia lê o histórico antes de responder, então lembra do que já foi dito. É append-only — nunca sobrescreve, não perde.
- **Buffer:** se o lead manda 3 mensagens seguidas em poucos segundos, a Bia espera ~9s e responde tudo junto, em vez de responder cada uma fragmentada. Mais natural.

---

## Os 5 modos da Bia (`active_agent_id`)

A mesma Bia tem modos diferentes, definidos por um campo no contato (`active_agent_id` na tabela de contatos). Cada modo carrega um objetivo (a camada L3 do prompt):

| Modo | Pra quê serve |
|------|---------------|
| `bia` | Triagem/padrão — quando não se sabe de onde o lead veio. Entende a demanda e direciona |
| `bia-recovery` | Recuperar quem abandonou o checkout |
| `bia-boas-vindas` | Acolher quem acabou de comprar |
| `bia-convite` | Convidar a base pro próximo evento |
| `bia-duvidas` | Lead que chegou pela página com uma dúvida/objeção |

Nesta instalação base, o que importa é o `bia` (triagem). Os outros modos já vêm no prompt, mas só passam a ser usados de verdade quando você instala os kits de negócio (recovery, dispatcher, etc.).

---

## Handoff humano (quando a Bia passa a bola)

Quando a Bia não sabe responder, ou quando você quer intervir, o controle vai pro humano via **Chatwoot**:

1. Toda conversa aparece no Chatwoot em tempo real.
2. Você abre e digita — a resposta vai pro WhatsApp do lead.
3. A Bia **se cala** naquele contato (uma flag de "humano assumiu").
4. Pra devolver pra Bia: limpa a flag no Supabase e reseta o modo (`active_agent_id`).

Sem o Chatwoot, não há para onde mandar a conversa quando a Bia trava — por isso ele é parte obrigatória da instalação.

---

## O que monitorar no dia a dia

- **Chatwoot:** o painel onde você vê todas as conversas e intervém.
- **n8n → Executions:** se um workflow falhou, aparece aqui (vermelho).
- **Supabase:** a fonte de verdade dos contatos (`active_agent_id`, flags) e do histórico.

> Dúvidas sobre as 4 camadas do prompt e como trocar campanha: ver `arquitetura-4-camadas.md`.
