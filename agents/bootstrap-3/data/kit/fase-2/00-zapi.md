# FASE 2 · Passo 2.0 — Z-API: o canal WhatsApp da maquina

> Conduzido pelo @operador-automacoes. Pre-requisito de TODA a Fase 2:
> as 3 automacoes terminam mandando mensagem — sem canal, nao ha automacao.
> Doc oficial da API (detalhes de endpoint): developer.z-api.io

---

## O que e (explicar pro aluno ANTES de contratar)

O Z-API transforma um **WhatsApp comum** num canal controlavel por API: o n8n passa a conseguir enviar mensagens por aquele numero — individual e em grupo.

**Custo: ~R$100/mes por instancia** (1 instancia = 1 numero). Falar o preco ANTES.

**O que ele NAO e (honestidade):** nao e a API oficial da Meta. E um numero comum automatizado — funciona muito bem pra outbound (e o que a operacao da Arka usa pra disparos), mas:
1. Exige **disciplina de cadencia** (regras anti-ban abaixo — sao lei)
2. A sessao pode cair e precisar reconectar via QR (normal, monitoravel)
3. Quem **conversa/responde** e a Bia, que vem depois com a API oficial (`/instalacaoBia`). Aqui e so a maquina FALANDO.

## Decisao do numero (antes de criar a instancia)

**RECOMENDADO: numero dedicado** (chip novo ~R$20 ou numero virtual) — nao o pessoal do aluno.
Motivo: se o numero tiver problema, o WhatsApp pessoal continua intacto. Registrar a decisao no tracker (inclusive se o aluno insistir no pessoal — decisao informada e dele).

> Numero novo = "esquentar" antes: usar normalmente por alguns dias (conversas reais,
> entrar em grupos) antes do primeiro disparo. Numero recem-criado disparando = flag classica.

## Passo a passo

1. **Conta:** z-api.io → criar conta → assinar plano (1 instancia)
2. **Instancia:** criar instancia → painel mostra **Instance ID** e **Token**; em conta/seguranca pegar tambem o **Client-Token** (token de conta exigido em todas as chamadas)
3. **Cofre:** os 3 valores vao DIRETO pro cofre (vault `Claude`, item **"{Prefixo} - Z-API"**) — nunca pro chat. Padrao sugerido: campos nomeados `instance_id`, `token`, `client_token`. Mas o aluno pode salvar do jeito dele (inclusive tudo nas NOTAS do item) — o operador faz parsing robusto e aceita as duas formas. Esses 3 valores so o aluno pega no painel; e o fluxo (b) do Principio 1 (`knowledge/principios-operacionais.md`)
4. **Conectar o numero:** painel da instancia → QR Code → ler com o WhatsApp do numero **dedicado (cobaia, nunca o pessoal)** (igual WhatsApp Web). Status deve ficar **connected**
   > A sessao Z-API pode cair (normal) e precisa religar via QR. Antes de QUALQUER disparo (Passos 2.1–2.3), checar `connected` na instancia — disparar com sessao caida e erro silencioso.
5. **Credential no n8n:** Header Auth com `Client-Token` (o operador monta junto; Instance ID e Token entram na URL dos requests)

## Teste real (obrigatorio — gate)

Enviar um texto pro WhatsApp do PROPRIO aluno:

```bash
curl -s -X POST "https://api.z-api.io/instances/{INSTANCE_ID}/token/{TOKEN}/send-text" \
  -H "Client-Token: {CLIENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"phone": "55DDDNUMERO", "message": "Teste do Bootstrap 3 — canal vivo."}'
```

✅ Passou se: o aluno CONFIRMA que a mensagem chegou no celular dele. Resposta 200 sem mensagem entregue NAO fecha o teste.

> Pra grupos: mesmo endpoint de envio, usando o **ID do grupo** no campo `phone`
> (lista de grupos/IDs disponivel no painel ou via endpoint de chats — ver doc oficial).
> O dispatcher (Passo 2.2) usa isso.

## REGRAS ANTI-BAN (lei, nao sugestao)

> Origem: cicatriz real. A operacao da Arka **ja tomou ban** disparando em massa sem cadencia.
> Numero banido = canal morto + lista orfa. Essas regras ja nascem configuradas no dispatcher.

| Regra | Valor |
|---|---|
| Intervalo entre mensagens individuais | **Aleatorio 90-240s** (nunca fixo, nunca menor) |
| Pausa longa | A cada **10-15 mensagens**, pausa de varios minutos |
| Limite diario | **80-100 mensagens individuais/dia** por numero |
| Variacoes de texto | **Minimo 10 variacoes reais** da mesma mensagem (mesmo texto N vezes = flag) |
| Blacklist/opt-out | Consultada **SEMPRE** antes de cada envio. Pediu pra sair = saiu de TUDO |
| Horario | Janela humana (08h-21h). Madrugada e flag |
| Numero novo | Esquentar dias antes do 1o disparo; comecar com volume minusculo e subir devagar |

## Checklist do passo

- [ ] Custo informado e aceito (~R$100/mes)
- [ ] Decisao do numero registrada no tracker (dedicado ou pessoal)
- [ ] Instancia criada + numero conectado (status connected)
- [ ] 3 credenciais no cofre (item "{Prefixo} - Z-API": instance_id, token, client_token — campos ou notas)
- [ ] Credential montada no n8n
- [ ] Teste real: mensagem RECEBIDA pelo aluno
- [ ] Regras anti-ban apresentadas e aceitas
