# Infraestrutura — Visão Geral (Enxuta)

> **KB do Squad LPago Arcane — Método Euriler Jubé**
> Tratamento: enxuto / corte forte (1413L original → ~250L)
> Fonte: KB LP Master 2026 — VOL-05 Infraestrutura e Ferramentas
> Carregado por: estrategista-chief
>
> **Por que enxuto:** Detalhes operacionais de ferramenta específica (Cartpanda, Logzz, Hotmart, ConvertKit, MailerLite, ManyChat) estão FORA do escopo do squad. O estrategista-chief precisa saber QUE infra deve estar pronta antes de venda começar — não como configurar cada ferramenta. Configuração de tool específica fica pra tech-ops do nicho do aluno.

---

## O Que É Infra e Por Que Importa

INFRA é a parte operacional do lançamento. Nasce do que precisa acontecer (eventos, comunicações, vendas) e dos pontos de contato com leads.

Pense num palco: você precisa do **palco** (página), do **microfone** (email + WhatsApp), das **luzes** (tráfego), da **câmera** (produção de vídeo) e do **sistema de som** funcionando (pagamento, checkout, área de membros).

### REGRA CARDINAL: Infra pronta ANTES de vender

> **Toda a infra precisa estar funcionando ANTES de começar a vender.** Nada de "vou arrumando enquanto roda". Testa tudo, compra de teste, fluxo inteiro de ponta a ponta — só depois liga os anúncios.

---

## O Caminho do Lead (Para Que a Infra Existe)

```
1.  Vê seu anúncio              → tráfego
2.  Clica e chega na página     → página
3.  Deixa email (opcional)      → formulário/squeeze
4.  Compra ingresso             → checkout
5.  Recebe email de boas-vindas → automação email
6.  Recebe template WhatsApp    → API individual
7.  Entra no grupo do WhatsApp  → comunidade
8.  Recebe sequência antecipação → grupo + API + email
9.  Assiste workshop ao vivo    → evento (Zoom)
10. Compra produto principal    → checkout produto
11. Recebe acesso               → área de membros
12. Pos-evento (7 dias)         → grupo + API + email
```

Sua INFRA precisa sustentar este fluxo inteiro. Cada peça é um elo da corrente. Se uma falha, o lead escapa.

---

## Categorias Necessárias (Sem Detalhar Ferramenta Específica)

### 1. Página de Vendas
- Hospedagem da página + domínio próprio
- Pixel de tracking (Meta) instalado e disparando
- Mobile-first testado de ponta a ponta
- Microsoft Clarity ou similar instalado pra mapa de calor
- Connect Rate >75%
- Página separada do checkout (página vende, checkout processa)

### 2. Checkout / Pagamento
- Cartão + PIX (mínimo)
- Order Bump configurado (RC-016 — obrigatório, tipicamente gravação do evento)
- Campo de cupom REMOVIDO (otimização validada)
- Recuperação de carrinho ativa
- Confirmação de compra dispara webhook

### 3. Email Marketing + Automação
- Plataforma com automação por comportamento e segmentação
- Custom fields pra dados do workshop (data, horário, link grupo, link vendas)
- Templates: confirmação de compra, lembretes pré-evento, comunicação pós-evento
- Integração com checkout (compra dispara automação)

### 4. WhatsApp Grupo
- Ferramenta de criação + disparo (gestão de comunidade)
- Capacidade de marcar pessoas por arroba (silencioso)
- Permite envio de mensagens, vídeos, áudios, imagens

### 5. WhatsApp Individual (API Oficial Meta)
- Número verificado e quality rating bom
- Templates Meta aprovados (Marketing + Utility, conforme uso)
- Capacidade de disparar templates com header (vídeo/imagem) + body com parâmetros + buttons
- Limites de envio crescem com uso e qualidade
- **Canal mais poderoso do funil pós-compra**

### 6. Tráfego / Anúncios
- Business Manager configurado
- Conta de anúncios com forma de pagamento ativa
- Pixel marcando todos os eventos relevantes (Lead, InitiateCheckout, Purchase)
- Catálogo / públicos personalizados (visitantes, compradores, lookalikes)

### 7. Produção de Vídeo
- Celular com câmera de qualidade
- Microfone (lavalier ou similar)
- Editor (CapCut, Captions, Premiere)
- Iluminação básica

### 8. Plataforma do Evento
- Zoom (ou similar) com gravação automática habilitada
- Webinar mode pra controle de audiência
- Plano com capacidade suficiente pra audiência projetada

### 9. IA (Aceleradores)
- Claude (ou similar) pra copy, análise, ideias, anúncios estruturados
- Ferramentas de avatar/voz IA pra anúncios (HeyGen, ElevenLabs, Veo, Kling)
- Geração de imagens (Midjourney ou similar) pra criativos

### 10. Área de Membros / Entrega
- Plataforma de entrega do produto principal (depende do produto: aulas gravadas, mentoria, comunidade)

---

## Stack de Referência (Validada Pelo Euriler)

| Categoria | Ferramentas Validadas |
|-----------|----------------------|
| Página | Framer, Lovable, WordPress |
| Checkout | Hotmart, Kiwify, Eduzz, Hubla |
| Email | ActiveCampaign, MailerLite, Mailchimp |
| WhatsApp Grupo | Z-API, DevsApp, Mensageiro |
| WhatsApp Individual | ManyChat + API Oficial Meta |
| Tráfego | Meta Ads (BM + Gerenciador) |
| Vídeo | iPhone + microfone (HollyLand/Rode) + CapCut/Captions |
| Design | Canva |
| IA Geral | Claude |
| IA Anúncios | HeyGen, ElevenLabs, Veo 3, Kling |
| Análise Página | Microsoft Clarity |
| Plataforma Evento | Zoom |

> Detalhes de configuração de cada ferramenta vivem fora do escopo do squad. Aluno deve usar tech-ops do nicho dele ou agente especializado pra setup.

---

## Checklist Mínimo Antes de Ligar Anúncios

- [ ] Página publicada e mobile-first testada
- [ ] Domínio configurado e SSL ativo
- [ ] Pixel disparando todos os eventos
- [ ] Checkout funcionando ponta a ponta (compra de teste real)
- [ ] Order Bump configurado e ativo
- [ ] Email de confirmação de compra disparando automaticamente
- [ ] Custom fields configurados nos contatos (workshop_nome, data, horário, link grupo, link vendas)
- [ ] Grupo WhatsApp criado e com link de convite ativo
- [ ] Template Meta de boas-vindas aprovado (header vídeo + body + buttons)
- [ ] Sequência de antecipação programada (grupo + API + email)
- [ ] Zoom com gravação automática testado
- [ ] Microsoft Clarity (ou similar) ativo na página
- [ ] BM verificado e quality rating do número WhatsApp em verde
- [ ] Recuperação de carrinho ativa
- [ ] Time alinhado (suporte, design, dev — quem responde o quê)

Se algum item está desmarcado: **NÃO LIGUE OS ANÚNCIOS**. Conserta primeiro, vende depois.

---

## O Que O Squad NÃO Cobre (E Não Deveria)

- Tutoriais passo-a-passo de Cartpanda, Logzz, ManyChat, Hotmart, MailerLite — depende da ferramenta escolhida pelo aluno
- Configuração de webhooks e integrações específicas — escopo de tech-ops
- Verificação de número WhatsApp na Meta — fluxo Meta direto
- Aprovação de templates Meta — escopo do operador
- Setup de domínio e DNS — escopo de infra do aluno
- Configuração de pixel avançado (custom conversions, eventos avançados) — escopo de gestor de tráfego

O squad gera planos de lançamento, copy de página, roteiros de anúncios, sequências de mensagens e diagnósticos. Operação de infra é responsabilidade do aluno + tech-ops dele.

---
**Última atualização:** 2026-05-08
**Versão:** 1.0.0
