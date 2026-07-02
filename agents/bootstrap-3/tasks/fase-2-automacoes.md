---
task: "FASE 2 — Automacoes essenciais (Z-API + compras + disparos + recovery)"
responsavel: "@operador-automacoes"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "QG-B3-002 validado (banco core de pe)"
Saida: "Z-API conectado, 3 automacoes vivas (compras e2e, dispatcher e recovery com dry-run), anti-ban configurado"
Checklist:
  - "Passo 2.0: Z-API conectado — mensagem de teste RECEBIDA + credenciais no cofre + anti-ban configurado"
  - "Passo 2.1: compras/onboarding — dry-run e2e (pessoa+compra no banco + boas-vindas recebida) + idempotencia + webhook real conectado"
  - "Passo 2.2: dispatcher — tabelas dispatches_log+blacklist criadas + dry-run validado + 1o disparo real em lista minuscula"
  - "Passo 2.3: recovery — recovery_contacts + trigger de conversao + dry-run validado"
execution_type: "interactive"
---

# FASE 2 — Automacoes essenciais (a maquina liga)

**Agente:** @operador-automacoes · **Gate de saida:** QG-B3-003
**Material:** `data/kit/fase-2/00-zapi.md` · `01-compras.md` · `02-dispatcher.md` · `03-recovery.md` (specs node-a-node com SQL e testes embutidos)

> A ordem tem logica de dependencia: **canal antes de tudo** (2.0), depois quem **escreve** no banco (2.1), depois quem **le** (2.2), depois quem le os **eventos** (2.3).
> **Dry-run antes de producao, SEMPRE.** Regras anti-ban sao lei, nao sugestao.

## Passo 2.0 — Z-API: o canal (~30min)
1. Custo ANTES: ~R$100/mes por instancia. O que e: WhatsApp comum virando canal de API. Limite honesto: nao e a API oficial (essa vem com a Bia)
2. Decisao do numero: RECOMENDAR dedicado (chip ~R$20), nao o pessoal
3. Conta z-api.io → instancia → conectar numero via **QR code**
4. Credenciais (instance ID, token, client-token) → cofre → credential no n8n
5. **Teste real:** enviar texto pro proprio aluno via API → ele confirma que RECEBEU
6. Regras anti-ban configuradas como padrao (intervalo 90-240s aleatorio · pausa a cada 10-15 · limite diario 80-100 · 10+ variacoes · blacklist sempre) — detalhe no `00-zapi.md`

## Passo 2.1 — Compras/onboarding (~45-60min)
1. Montar no n8n por **blocos testaveis** (spec `01-compras.md`): webhook → responde 200 → filtro aprovada → parse (normaliza email/telefone) → upsert pessoa (`onConflict: email`) → dedup por `id_transacao` → insert compra → boas-vindas via Z-API
2. **Dry-run e2e:** curl com payload simulado (dados do PROPRIO aluno) → conferir: pessoa no banco + compra no banco + mensagem no WhatsApp
3. **Teste de idempotencia:** MESMO curl de novo → nada duplica
4. Conectar o webhook real na plataforma do aluno (Hotmart ou equivalente — spec tem o caminho)

## Passo 2.2 — Disparos / dispatcher (~45-60min)
1. Tabelas de sistema (SQL no `02-dispatcher.md`): `dispatches_log` (idempotencia/audit) + `blacklist` (opt-out) — ambas plugadas no padrao do hub
2. Montar o dispatcher: agenda → candidatos do banco → filtro blacklist → envio Z-API (individual e grupo) com cadencia anti-ban → log de CADA envio
3. **Dry-run obrigatorio:** envio desligado → conferir lista que SERIA enviada + log gravado
4. 1o disparo real: lista minuscula (aluno + 2-3 contatos de teste dele)

## Passo 2.3 — Recovery de vendas (~30-45min)
1. Tabela + trigger (SQL no `03-recovery.md`): `recovery_contacts` + **trigger AFTER INSERT em `compras`** que marca convertido (comprou → recovery PARA — mesmo desenho da Arka)
2. Montar o cron: a cada 15min → candidatos (capturou ha N horas + nao comprou + nao contatado + fora da blacklist) → envia resgate via Z-API → marca contatado
3. **Dry-run:** candidato de teste → rodar → conferir marcacao sem envio; depois teste real consigo mesmo
4. **Teste do trigger:** inserir compra do candidato → confirmar que sai da fila na hora

## Gate QG-B3-003 → reporta ao Chief (MAQUINA LIGADA)
Z-API teste recebido · compras e2e + idempotencia · dispatcher dry-run + disparo minusculo OK · recovery dry-run + trigger testado · anti-ban configurado · blacklist ativa · tracker fechado.

Ao fechar: o Chief celebra + aponta o proximo passo da jornada (a Bia, `/instalacaoBia` — que reusa este servidor e este n8n).

## Error Handling

| Cenario | Acao |
|---------|------|
| QR code nao conecta / instancia cai | Reconectar pelo painel Z-API; sessao de WhatsApp e o ponto fragil — monitorar e o normal |
| Mensagem de teste nao chega | Conferir: client-token no header? numero com DDI 55 so digitos? instancia "connected" no painel? |
| Webhook da plataforma nao dispara | Testar primeiro com curl (isola: workflow vs plataforma). Conferir URL https + evento certo marcado na plataforma |
| Compra duplica no teste de idempotencia | Node de busca por `id_transacao` antes do insert — corrigir antes de conectar a plataforma real |
| Aluno quer disparar em massa ja | BLOQUEAR — cadencia anti-ban (a operacao da Arka ja tomou ban; regra e cicatriz) |
| Recovery pegaria quem ja comprou | Corrigir filtro + validar o trigger de conversao antes de ligar o cron |
| Aluno cola credencial no chat | Cofre; regenerar token no painel Z-API se exposto |
| Aluno pergunta "e quando o cliente responde?" | Limite da fase: responder e com a Bia (`/instalacaoBia`, proximo passo). Aqui e outbound |
