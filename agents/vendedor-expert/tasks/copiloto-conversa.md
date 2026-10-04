---
task: "Copiloto de Conversa"
responsavel: "@vendedor-expert"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Conversa com a lead (print, texto ou descrição) + contexto opcional (nome no CRM, oferta em jogo)"
Saida: "Diagnóstico em 1 linha + próxima mensagem pronta (texto ou roteiro de áudio) + prova/bônus/próximo passo"
Checklist:
  - "Etapa identificada"
  - "Objeção literal identificada (se houver)"
  - "Script-base e adaptação Incubadora aplicados"
  - "Preço/garantia/bônus conferidos (se citados)"
  - "Gênero e regras cardinais verificados"
execution_type: "interactive"
---

# Task: Copiloto de Conversa

Segue o **SOP-001** do playbook. Este arquivo detalha as decisões.

## 1. Ler e classificar

| Pergunta | Fonte |
|----------|-------|
| Em que etapa está? | Sinais: só reagiu/curtiu (prospecção) · contou momento/dor (condução) · confirmou fit ou perguntou preço (fechamento) · sumiu/pediu tempo (follow-up) |
| Qual a última fala dela, literal? | Conversa |
| Tem objeção? Qual a **real**? | KB ETL VOL-01 §7.2 + KB Incubadora §7 — "tá caro" pode ser medo; "vou pensar" pode ser cônjuge |
| Formato? | Se ela manda áudio → roteiro de áudio (espelhamento) |
| Perfil? | Laura ou Ricardo (KB §4) — pela fala e pela ficha |
| Está no CRM? | Se a Karol deu o nome → ler a ficha (só leitura) |

## 2. Escolher o próximo passo (copo d'água)

Um passo só. Roteador: `agents/etlmaker/kbs/vendas-sem-call/REPERTORIO.md` §1.

| Etapa | Próximo passo típico |
|-------|----------------------|
| Prospecção | Pergunta aberta sobre momento/desafio (Scripts 1–8). **Sem produto** |
| Condução | Descoberta → aprofundar → empatia + prova → solução amarrada à dor → "por dentro" → depoimento → confirmar fit (Scripts 9–15) |
| Fechamento | Só após fit: valor (Script 17, âncora só se real) → "Pix ou cartão?" (18, só se a oferta tem cartão) |
| Objeção | Scripts 19–22 + VOL-02 §7 + KB §7 |
| Follow-up | Scripts 25–32 conforme a situação + cadência |

## 3. Oferta (quando a etapa pede)

- Roteamento: KB §3 (tabela de decisão) + frases "Qual é a sua porta?" do artifact de produtos.
- Objeção que pede outro produto → KB §2.1.1 (comparação): citar **a linha** que resolve a trava. Ex.: "não tenho tempo" no VIP → Sprint ("a Karol constrói, você aprova").
- Formato: `Oferta: {X} — porque ela disse "{literal}"` → Karol confirma antes da mensagem de valor.
- Grupo antes de 14/10 15h → só convite pra live (R-001).
- Lead pede call ou o caso não cabe em mensagem → sugerir convite pra conversa e o Vendedor Secreto.

## 4. Prova e bônus

- Prova: KB §8 — dizer qual arquivo anexar e por quê. Nunca parafrasear depoimento.
- Bônus: R-003. Documentado → pode entrar. Cardápio → sugestão separada, aprovação antes.
- Garantia como argumento de medo de investir → prazo exato (KB §2.2.2).

## 5. Escrever

- Voz da Karol: curta, acolhedora, sem floreio, sem jargão de marketing
- Cita algo concreto que a pessoa disse
- Neutra em gênero (R-004)
- Termina com pergunta
- Sem mencionar origem do método (R-007)

## 6. Entregar

```
Etapa: {etapa} · Objeção: {literal | nenhuma} · Oferta: {sugerida + porquê | ainda não}

{mensagem — bloco copiável}

Anexar: {prova}            ← se houver
Sugestão de bônus (aprovar antes de mandar): {item} — porque ela disse "{literal}". Se aprovar: "{texto}"   ← se houver
CRM: Status {x} · Observação "{y}" · Próximo contato {data}   ← se a lead está no CRM
Próximo passo: {o que esperar}
```

## Erros comuns a evitar

| Erro | Correção |
|------|----------|
| Mandar preço porque ela perguntou "quanto custa?" logo no início | Responder com 1 pergunta de descoberta e prometer o valor em seguida ("te passo sim — antes, me conta…") |
| Despejar a tabela de entregáveis | 1 linha que responde à dor |
| Rebater objeção de frente | Acolher, perguntar a real |
| Follow-up com "vi que não respondeu" | Script 25/26/28 ou novo gatilho |
