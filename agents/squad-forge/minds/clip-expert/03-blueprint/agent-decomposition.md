# Agent Decomposition — Clip Expert

## clip-chief (Orchestrator)

**Por que existe:** Todo squad Auroq precisa de 1 orquestrador que não executa tasks técnicas — só roteia e conduz o único touchpoint humano do processo (Karol revisando e aprovando os cortes, PU-clip-expert-013). Também é quem faz o handoff formal pra fila do Postador (PU-clip-expert-014), porque essa decisão de "aprovado, pode entrar na fila" é do dono do processo, não de um agente técnico.

## garimpeiro (Tier 1)

**Por que existe:** Agrupa os passos 3 e 4 do process map — detecção de live nova, ingestão do vídeo bruto, transcrição condicional e pontuação de trechos. Esses passos são fortemente acoplados em sequência (sem transcrição não dá pra pontuar) e usam ferramentas do mesmo "mundo" (Drive, Supabase, whisper, Expert Viral). Separado do cortador porque a expertise é distinta: garimpeiro "entende conteúdo" (o que é um trecho bom), cortador "produz mídia" (como transformar um timestamp em arquivo pronto).

## cortador (Tier 1)

**Por que existe:** Passo 5 do process map — corte, legenda via Stylist, entrega e notificação. Tecnicamente é outro domínio (ffmpeg, encoding, e-mail) do que "entender o que é um bom trecho". Juntar os dois num agente só criaria um agente genérico demais, sem responsabilidade única clara.

## Por que não mais agentes

O processo tem 16 PUs, complexidade "standard" (16-30 PUs → 2-4 agentes esperados). 3 agentes cobre isso sem fragmentar demais — cada um tem responsabilidade única e nenhum PU-STEP ficou órfão.

## Por que não menos agentes (1 agente só)

Um agente monolítico misturaria "entender conteúdo" (garimpeiro) com "produzir mídia" (cortador) com "conduzir aprovação humana" (clip-chief) — três expertises e três níveis de autoridade diferentes (agent-only, agent-only, hybrid). Separar deixa cada quality gate (QG-CE-01 nota mínima, QG-CE-02 aprovação humana) claramente amarrado a um responsável.
