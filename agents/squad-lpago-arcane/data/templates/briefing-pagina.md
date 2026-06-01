# Template — Briefing da Página de Vendas

> **KB do Squad LPago Arcane — Templates/Playbooks**
> Tratamento: built from scratch (baseado em data/metodo/03-pagina-vendas.md — exemplo concreto NDF é importado em data/exemplos/briefing-pagina-ndf.md na Fase 4c)
> Carregado por: copy-pagina

---

## Para Que Serve Este Template

Output do agente `copy-pagina`: um briefing completo da página de vendas, seção por seção (das 12 seções do método), com prompts explícitos do que cada bloco precisa entregar e checklist de validação contra as Regras Cardinais.

Este briefing é o que vai pro page builder (Framer, Lovable, WordPress) ou pro humano que vai montar visualmente. Copy fechada, hierarquia visual indicada, CTAs marcados.

> "90% do resultado vem da primeira dobra. Tudo até o botão de compra tem que aparecer na primeira tela do celular." (data/metodo/09)

---

## Pré-Requisitos

- [ ] `documento-mestre.md` fechado (proposta, público, oferta, preço definidos)
- [ ] Headline trabalhada — formato `[Tempo] + [Resultado] + [Mecanismo]`
- [ ] 4 inimigos da conversão internalizados (texto centralizado, caixa larga, blocos gigantes, dobra com carga cognitiva)
- [ ] Mobile first — 99% do tráfego no celular

---

## 0. Setup do Briefing

```
Nicho / Subnicho: {...}
Avatar resumido: {público específico do documento-mestre}
Proposta principal: {1 frase do documento-mestre}
Headline trabalhada: {3 versões pra testar nos criativos — não na página (RC-006)}

Inimigos a evitar (RC-005 / data/metodo/03):
- Inimigo #1: Texto centralizado em excesso
- Inimigo #2: Caixa de texto > 12-13 palavras/linha
- Inimigo #3: Blocos > 3-4 linhas
- Inimigo #4: Dobra com alta carga cognitiva
```

---

## As 12 Seções da Página

### Seção 1 — Hero (Primeira Dobra)

> **A SEÇÃO MAIS IMPORTANTE.** 90% do resultado vem daqui. Headline + subheadline + CTA + escassez + (preço se cabe) precisam aparecer na PRIMEIRA TELA DO CELULAR.

**Entregáveis obrigatórios:**

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Headline (H1) | `[Tempo] + [Resultado] + [Mecanismo]`. Profissional. Não parecer gratuito. | {...} |
| Subheadline | Reforça resultado em linguagem técnica. Resolve "por que devo acreditar?" | {...} |
| CTA principal | Verbo de ação + objeto concreto. Ex: "Garantir minha vaga" / "Quero entrar" | {...} |
| Escassez visível | Lote atual, vagas, contagem regressiva, "fecha sexta 23h59" | {...} |
| Preço (se cabe) | Ancorado: "De R$97 por R$47" — Hotmart mostra setinha de desconto. Preço real do ingresso = RC-015 Preço da Escala (faixa R$27-R$67, default R$38) | {...} |
| Prova rápida | 1 logo / 1 número / 1 depoimento curto se possível | {...} |

**Validação:**
- [ ] Tudo cabe na primeira tela do iPhone (375px)?
- [ ] Headline não usa palavra genérica ("transformação", "qualidade de vida")?
- [ ] CTA é verbo + objeto, não "saiba mais"?

---

### Seção 2 — Sistema/Mecanismo

> Apresenta o **mecanismo único** da proposta. Tangível, com nome próprio, com diagrama se possível.

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Nome do mecanismo | Termo técnico, próprio. Não genérico. | {...} |
| Contraste | "Antes (jeito tradicional)" vs "Depois (com o sistema)" | {...} |
| Diagrama / framework | Imagem que mostra o sistema visualmente | {ref/descrição} |
| 1-3 provas concretas | Cases, números, métricas com quem usou | {...} |

---

### Seção 3 — Identificação (Dor + Ruminação + Virada)

> Esta seção responde "você entende MEU problema?" Cita ruminações literais do público.

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Bullet de ruminações (3-5) | "Você já se pegou pensando..." Frases LITERAIS do que ele fala pra si mesmo | {...} |
| Diagnóstico (1 frase) | Por que o problema acontece (técnico, não emocional) | {...} |
| Virada | "A boa notícia é que existe um caminho específico pra resolver isso" | {...} |

---

### Seção 4 — Autoridade (Depoimentos)

> Prova social. 3-7 depoimentos com foto + nome + resultado específico.

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Depoimento 1 | Foto + nome + 1-2 frases com número/resultado concreto | {...} |
| Depoimento 2 | Idem | {...} |
| Depoimento 3 | Idem | {...} |
| Depoimentos extras (se houver) | Até 7 total | {...} |

**Validação:**
- [ ] Tem foto real?
- [ ] Tem número/resultado específico, não "mudou minha vida"?

---

### Seção 5 — Conteúdo (Cards Tangíveis)

> Cada card = uma entrega específica. Não "você vai aprender X" — "você vai sair com Y, Z, W". Pílulas tangíveis.

| Card | O Que Entrega | Sua Resposta |
|------|---------------|--------------|
| Card 1 | Sistema/método/framework com nome | {...} |
| Card 2 | Idem | {...} |
| Card 3 | Idem | {...} |
| Card 4-N | Idem | {...} |

**Validação:**
- [ ] Cards usam termos específicos ("Sistema de 3 ciclos hormonais"), não genéricos ("emagrecimento")?

---

### Seção 6 — Oferta (Preço + Checklist do Que Inclui)

> Aparece DEPOIS de construir valor. Nunca antes. Lista explícita do que está incluso.

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Preço com ancoragem | "De R$X por R$Y" + parcelas | {...} |
| Lote atual + escassez | "Lote 2 de 4 — restam X vagas" | {...} |
| Checklist de inclusos | 5-10 itens. Cada um com ✓ + descrição curta | {...} |
| Order bump | Gravação do evento (RC-016) | {gravação por R$X} |
| Garantia | 7 ou 14 dias. Visível e clara (RC-016 / VOL-05) | {...} |
| CTA | Mesmo verbo do hero | {...} |

**Validação:**
- [ ] Preço dentro da faixa do método (R$27-R$67 sweet spot R$38-R$57; default R$38) com plano de teste OU justificativa de nicho premium (RC-015 — Preço da Escala)?
- [ ] Order bump configurado (RC-016)?
- [ ] Garantia visível?

---

### Seção 7 — Sobre Você (Expert)

> Apresentação curta. Foco em CREDENCIAIS RELEVANTES pro problema, não bio completa.

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Foto profissional | — | {ref} |
| Posicionamento (1 linha) | "Quem é + o que faz + pra quem" | {...} |
| 3-5 credenciais relevantes | Números, conquistas, resultados que conectam com o problema | {...} |

---

### Seção 8 — Matadora de Objeções

> Cada objeção do público vira uma resposta direta e específica. 3-7 objeções.

| Objeção | Resposta | Sua Resposta |
|---------|----------|--------------|
| "Não tenho tempo" | {...} | {...} |
| "Não sei se é pra mim" | {...} | {...} |
| "É caro" | {...} | {...} |
| "E se não funcionar comigo?" | {...} | {...} |
| {outras específicas do nicho} | {...} | {...} |

---

### Seção 9 — FAQ

> Perguntas técnicas que sobraram. 5-10 perguntas curtas e diretas.

| Pergunta | Resposta |
|----------|----------|
| Quando é o evento? | {data + horários} |
| É ao vivo? | {sim, com gravação como order bump} |
| Posso assistir depois? | {via gravação, se comprou order bump} |
| Como funciona o acesso? | {...} |
| Tem certificado? | {se aplicável} |
| {outras específicas} | {...} |

---

### Seção 10 — CTA Final

> Última chance antes do rodapé. Reforça escassez + preço + benefício principal.

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Headline curta | "Última chance de garantir sua vaga" / "Lote 2 fecha sexta" | {...} |
| Reforço de valor | 3 bullets do que mais importa | {...} |
| CTA final | Mesmo verbo do hero, com cor de destaque | {...} |

---

### Seção 11 — Suporte

> Como falar com alguém. Reduz fricção de quem ainda tem dúvida.

```
- E-mail: {...}
- WhatsApp: {...} — atendimento {dias e horários}
- Tempo de resposta: {ex: até 1h em horário comercial}
```

---

### Seção 12 — Garantia

> Pode aparecer em outras seções também (oferta), mas tem espaço próprio. Reduz risco percebido.

| Elemento | Prompt | Sua Resposta |
|----------|--------|--------------|
| Selo visual | Imagem de "garantia X dias" | {ref} |
| Texto da garantia | Específica, sem letras miúdas. Reembolso simples. | {...} |
| Como solicitar | 1-2 passos | {...} |

---

## Checklist de Validação Final (RCs)

| Check | Status |
|-------|--------|
| RC-005: Página converte > página bonita. Mobile-first. Carga cognitiva baixa | {🟢/🟡/🔴} |
| RC-006: Headlines testadas nos CRIATIVOS, não na página | {🟢/🟡/🔴} |
| RC-015: Ingresso = Preço da Escala (faixa R$27-R$67 sweet spot R$38-R$57, default R$38, ajustar via teste; fora da faixa exige justificativa de nicho premium) | {🟢/🟡/🔴} |
| RC-016: Order bump configurado | {🟢/🟡/🔴} |
| Primeira dobra completa no mobile (headline + sub + CTA + escassez)? | {🟢/🟡/🔴} |
| Sem vídeo de vendas na página (regra LP)? | {🟢/🟡/🔴} |
| Campo de cupom REMOVIDO do checkout? | {🟢/🟡/🔴} |
| Linhas ≤ 12-13 palavras? | {🟢/🟡/🔴} |
| Parágrafos ≤ 3-4 linhas? | {🟢/🟡/🔴} |
| Connect Rate testado (>75%)? | {🟢/🟡/🔴} |
| Clarity / Hotjar instalado? | {🟢/🟡/🔴} |

**Bloqueio:** se qualquer item crítico (mobile, RC-005, RC-016, primeira dobra) é 🔴, NÃO subir página. Corrigir primeiro.

---

## Estrutura "Pergunta → Resposta → Nova Pergunta"

Cada seção responde a pergunta da anterior e abre a próxima. Validar:

| Seção | Afirma | Pergunta que Abre | Resposta na Próxima |
|-------|--------|-------------------|---------------------|
| 1. Hero | "Domine X com Y" | "Por que devo acreditar?" | 2. Sistema (mecanismo + provas) |
| 2. Sistema | "Funciona porque..." | "Mas você entende MEU caso?" | 3. Identificação |
| 3. Identificação | "Eu te entendo, e tem caminho" | "Quem é você?" | 4. Autoridade |
| 4. Autoridade | "Outros já fizeram" | "O que vou receber?" | 5. Conteúdo |
| 5. Conteúdo | "Você sai com X, Y, Z" | "Quanto custa?" | 6. Oferta |
| 6. Oferta | "R$X com tudo isso" | "E se não der certo?" | 12. Garantia / 8. Objeções |
| 7. Sobre você | "Sou eu, posso te guiar" | "E se eu tiver dúvida X?" | 8. Objeções / 9. FAQ |

---

## Output Esperado Deste Briefing

1. Documento .md completo com todas as 12 seções preenchidas
2. Headlines e textos finais (não placeholders)
3. Hierarquia visual indicada (H1, H2, body, CTA)
4. Referências de imagem listadas (mesmo que sejam placeholders pra design)
5. Checklist de validação 100% verde

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
