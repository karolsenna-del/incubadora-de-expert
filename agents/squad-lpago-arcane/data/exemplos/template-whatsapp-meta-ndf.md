# Template WhatsApp Boas-Vindas Meta API — NDF (Exemplo Real)

> **EXEMPLO REAL — Workshop NDF do Euriler**
> Este é exemplo extraído de um lançamento real (Workshop NDF, R$27, 1-2 dias).
> Use como referência de estrutura, voz, timing, cronograma.
> NÃO copie literalmente — adapte ao contexto do aluno.
>
> Carregado por: copywriter-mensagens
>
> Fonte original: capturada em 2026-05-08 (build time)

---

# Template WhatsApp — Boas-Vindas NDF

> Template pra aprovacao Meta. Dispara automaticamente quando lead compra o workshop.
> Status: APROVADO (Meta) — 10/03/2026. Disparo automatico via orquestrador no workflow de compras.

---

## Dados do Template

| Campo | Valor |
|-------|-------|
| Nome | `boas_vindas_workshop_ndf` |
| Categoria | Marketing (Meta reclassificou de Utility) |
| Idioma | pt_BR |
| Header | Video (`video-template-boas-vindas.mp4`) |
| Body | Texto sem variaveis |
| Buttons | 2x Quick Reply ("Entrar no grupo" + "Saber formato aulas") |
| Flow ManyChat | `content20260310133909_372659` — "[TEMPLATE] API BOAS VINDAS - NDF" |
| Tag nos botoes | `RECEBEU_BOAS_VINDAS_NDF` (ID: `83030108`) |

**Nota:** Utility e melhor que Marketing pra boas-vindas pos-compra — e transacional (confirmacao de compra), tem taxa de aprovacao mais alta e custo menor por msg.

---

## Header — Video (20-30 seg)

Euriler grava no celular, vertical, sem edicao.

```
[CELEBRACAO — 5 seg]
"Fala! Aqui é o Euriler. Parabéns por garantir sua vaga
no Workshop Negócio Digital do Futuro! Decisão incrível."

[EXPECTATIVA — 10 seg]
"Sábado dia 16 e domingo dia 17 vão ser dois dias que vão
mudar a forma como você enxerga seu negócio. Eu vou montar
tudo na sua frente, ao vivo — o sistema completo de IA
funcionando."

[CONEXAO COM BIA — 5 seg]
"Esse número aqui é da Bia, da minha equipe. Qualquer
dúvida que você tiver sobre o evento — horário, como
acessar, o que vai ter — é só falar com ela aqui.
Te espero lá dentro!"
```

**Dicas de gravacao:**
- Celular na vertical (formato WhatsApp)
- Olhando direto pra camera
- Tom de celebracao — ele acabou de comprar, comemore com ele
- Energia positiva, sorriso genuino
- Sem cenario produzido — escritorio ou lugar simples
- Sem edicao — autenticidade > producao

---

## Body — Texto

```
{{1}}, inscrição confirmada! 🎉

📅 Seu acesso ao *Workshop Negócio Digital do Futuro* já chegou — *sábado e domingo, 23 e 24 de maio*, das 10h às 19h, ao vivo online.

Eu sou a *Bia*, trabalho no atendimento do Euriler. Tô aqui pra te passar os *próximos passos* e fico à disposição pra dúvidas e o que precisar 😊

⚠️ *Importante:* o workshop é *100% ao vivo* e não terá replay. Se organiza pra estar presente no dia, tá?

📌 *Próximos passos:*
1️⃣ Entre no *grupo oficial* do workshop caso ainda não tenha entrado
2️⃣ Se você não adquiriu o workshop em *formato aulas*, fala comigo aqui que te explico como funciona

🔗 O link de acesso vai ser enviado no *grupo oficial do WhatsApp* e no seu *email*. Te envio aqui também na véspera.

Salva já esse contato — ele é *oficial e de confiança* ✅
```

**Nota:** {{1}} = first name. Se vier vazio, fica ", inscricao confirmada!" — flui natural.
**Nota 2:** "formato aulas" = gancho pro upsell da gravacao. Bia conduz a conversa quando o lead clica.

---

## Buttons (Quick Reply)

```
Botao 1: Entrar no grupo
Botao 2: Saber formato aulas
```

Ambos abrem janela de 24h. A Bia assume com contexto de boas-vindas.
- **Entrar no grupo** → Bia manda o link do grupo WhatsApp do evento
- **Saber formato aulas** → Bia explica sobre a gravacao (upsell natural, conforme prompt L3)

---

## Por Que Funciona

| Elemento | Principio |
|----------|-----------|
| Video do Euriler | Humaniza, celebra a decisao, gera conexao |
| Tom de celebracao | Reforco positivo — pessoa sente que fez a coisa certa |
| Info essencial no body | Data + horario + formato — elimina ansiedade |
| Apresenta a Bia | Prepara o terreno pra interacao futura |
| "E so me chamar" | Canal aberto, sem pressao |
| Botao "Entrar no grupo" | CTA principal — garante que lead entra no grupo onde vao os avisos |
| Botao "Saber formato aulas" | Gatilho de upsell natural — lead se auto-qualifica |
| Categoria Utility | Maior taxa de aprovacao + menor custo/msg |

---

## Alternativa: Sem Video

Se o video atrasar, pode submeter versao texto-only:

```
Nome: boas_vindas_workshop_ndf_v2
Categoria: Utility
Header: Nenhum
Body: [mesmo texto acima]
Button: Tenho uma dúvida!
```

Funciona, mas perde a forca do video com o Euriler.

---

## Proximos Passos

1. [x] Euriler grava video de boas-vindas (20-30 seg)
2. [x] Submeter template no ManyChat (Settings > WhatsApp > Templates)
3. [x] Aguardar aprovacao Meta — APROVADO (10/03/2026)
4. [x] Criar flow ManyChat pro orquestrador (`content20260310133909_372659`)
5. [x] Configurar workflow de compras pra disparar template quando "compra aprovada"
6. [x] Teste API — sucesso (subscriber `727409982`)
7. [ ] Teste end-to-end com compra real Hotmart

---

*Snapshot: 2026-05-08 — versão 1.0.0 — fonte: campanha NDF Workshop (lançamento real Euriler)*
