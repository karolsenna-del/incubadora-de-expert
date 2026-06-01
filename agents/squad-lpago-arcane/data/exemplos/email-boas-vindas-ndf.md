# Email Boas-Vindas — Compra Confirmada NDF (Exemplo Real)

> **EXEMPLO REAL — Workshop NDF do Euriler**
> Este é exemplo extraído de um lançamento real (Workshop NDF, R$27, 1-2 dias).
> Use como referência de estrutura, voz, timing, cronograma.
> NÃO copie literalmente — adapte ao contexto do aluno.
>
> Carregado por: copywriter-mensagens
>
> Fonte original: capturada em 2026-05-08 (build time)

---

# Email Boas-Vindas — Compra Confirmada NDF

> Template pra criar no MailerLite (Automations > Email step)
> Trigger: subscriber adicionado ao group "Compradores NDF"
> Automacao ID: 184668655639856712

---

## Configuracao no MailerLite

### Automacao
- **Nome:** Boas-vindas NDF - Compra Confirmada
- **Trigger:** When subscriber joins group "Compradores NDF"
- **Step 1:** Send email (abaixo)
- **Status:** Ativar apos configurar

### Sender
- **From:** Euriler Jube
- **Email:** euriler@euriler.com.br
- **Reply-to:** euriler@euriler.com.br

---

## Email

### Subject
```
Parabens, {$name}! Sua vaga no {$workshop_nome} esta confirmada
```

### Preheader
```
Agora faz isso pra garantir a melhor experiencia no evento
```

### Corpo (plain text — sem HTML pesado)

```
{$name}, parabens pela decisao!

Sua vaga no {$workshop_nome} esta confirmada.

Antes de tudo, duas coisas rapidas:

1. RESPONDE esse email com um "oi" — isso garante que meus proximos
   emails vao cair na sua caixa de entrada (e nao em promocoes).

2. Se caiu em promocoes, ARRASTA pra caixa de entrada principal.

Beleza, agora o que importa...


DADOS DO SEU EVENTO
--------------------

Workshop: {$workshop_nome}
Data: {$workshop_data}
Horario: {$workshop_horario}
Formato: Ao vivo, online (link enviado na vespera)


SEU PROXIMO PASSO (IMPORTANTE)
------------------------------

Pra ter a experiencia completa, entra agora no nosso grupo exclusivo
de WhatsApp. E por la que vou enviar:

- Link da sala do evento
- Materiais exclusivos
- Avisos importantes

>> ENTRAR NO GRUPO DO WHATSAPP: {$grupo_whatsapp}

Esse grupo e silencioso (so admin posta). Nada de spam.


O QUE ESPERAR
--------------

Esse workshop e um dia inteiro de conteudo profundo e pratico.

Voce vai sair do outro lado sabendo exatamente como usar Marketing + IA
pra construir seu negocio digital — sem depender de lancador, sem equipe
cara, sem complicacao.

Anota na agenda. Programa um alarme. Nao perca.


DUVIDAS?
---------

Responde esse email que meu time responde rapido. Ou me chama no
WhatsApp que a Bia (minha assistente IA) te ajuda na hora.


Te vejo la!

Forte abraco,
Euriler Jube


P.S.: Entra no grupo do WhatsApp AGORA — e por la que tudo acontece:
{$grupo_whatsapp}
```

---

## Custom Fields (ja criados no MailerLite)

Esses campos sao preenchidos via API quando o subscriber e adicionado.
Pra cada lancamento, basta trocar os valores no n8n.

| Field | Key | Valor atual (23-24/05) |
|-------|-----|---------------------|
| workshop_nome | `workshop_nome` | Workshop Negocio Digital do Futuro |
| workshop_data | `workshop_data` | Sabado e Domingo, 23 e 24 de maio de 2026 |
| workshop_horario | `workshop_horario` | 10h as 19h |
| grupo_whatsapp | `grupo_whatsapp` | https://www.grupify.com.br/r/workshop-ndf |
| link_vendas | `link_vendas` | https://pay.hotmart.com/F104435999M |

---

## Integracao: Hotmart → n8n → MailerLite

### Fluxo
```
Hotmart webhook (compra aprovada)
  → webhook do orquestrador (workflow de compras)
  → [NOVO STEP] POST https://connect.mailerlite.com/api/subscribers
     {
       "email": "{{email_comprador}}",
       "fields": {
         "name": "{{nome_comprador}}",
         "workshop_nome": "Workshop Negocio Digital do Futuro",
         "workshop_data": "Sabado e Domingo, 23 e 24 de maio de 2026",
         "workshop_horario": "10h as 19h",
         "grupo_whatsapp": "https://www.grupify.com.br/r/workshop-ndf",
         "link_vendas": "https://pay.hotmart.com/F104435999M"
       },
       "groups": ["184668618430088860"]
     }
  → MailerLite automation triggers (group "Compradores NDF")
  → Email de boas-vindas enviado automaticamente
```

### Headers do request pro MailerLite
```
Authorization: Bearer [API_KEY do vault]
Content-Type: application/json
```

### Exemplo curl pra teste
```bash
curl -X POST "https://connect.mailerlite.com/api/subscribers" \
  -H "Authorization: Bearer [API_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@teste.com",
    "fields": {
      "name": "Teste",
      "workshop_nome": "Workshop Negocio Digital do Futuro",
      "workshop_data": "Sabado e Domingo, 23 e 24 de maio de 2026",
      "workshop_horario": "10h as 19h",
      "grupo_whatsapp": "https://www.grupify.com.br/r/workshop-ndf",
      "link_vendas": "https://pay.hotmart.com/F104435999M"
    },
    "groups": ["184668618430088860"]
  }'
```

---

## Diferenças vs email antigo do AC

| Aspecto | AC antigo | MailerLite novo |
|---------|-----------|-----------------|
| Subject | "Vaga Pendente" (generico) | "Parabens, {nome}! Sua vaga confirmada" (pessoal) |
| Corpo | 4 emails identicos com subject diferente | 1 email completo que resolve tudo |
| Dados do evento | Hardcoded (datas fixas) | Custom fields (troca por lancamento) |
| Link grupo | SendFlow (morta) | Grupify (ativo) |
| Urgencia fake | "Voce sera cancelado" | Sem urgencia — tom de celebracao |
| CTA | Entrar no grupo | Entrar no grupo + responder email |
| Deliverability | Pedia "responde sim" | Pede "responde oi" (mais natural) |

---

## Checklist pra ativar

- [ ] Criar email no MailerLite dashboard (copiar texto acima)
- [ ] Configurar trigger: "When subscriber joins group Compradores NDF"
- [ ] Configurar sender: euriler@euriler.com.br
- [ ] Adicionar step no orquestrador de compras: POST subscriber no MailerLite
- [ ] Testar com email de teste
- [ ] Ativar automacao

---

*Snapshot: 2026-05-08 — versão 1.0.0 — fonte: campanha NDF Workshop (lançamento real Euriler)*
