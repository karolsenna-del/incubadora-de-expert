---
task: "Setup Trafego — Configuracao Base"
responsavel: "@lt-traffic-ops"
atomic_layer: "task"
Entrada: "Pagina pronta + criativos prontos"
Saida: "5 ativos configurados (Perfil, Pagina, Insta, BM, Conta) + Pixel + API Conversoes funcionando"
execution_type: "interactive"
---

# Task: Setup Tráfego — Configuração Base

**Task ID:** squad-low-ticket-arcane/setup-trafego
**Owner:** lt-traffic-ops

---

## Conceito

Antes de subir QUALQUER campanha, 5 ativos precisam estar prontos. Isolar tudo: 1 conta de anuncio por oferta, 1 pixel por oferta, 1 dominio por oferta. NUNCA misturar lancamento + perpetuo na mesma BM.

---

## Checklist 5 Ativos

### 1. Perfil Facebook

| Requisito | Detalhe |
|-----------|---------|
| Antigo | Perfil aquecido > perfil novo |
| Limpo | Nunca banido |
| Atividade | Movimentado |

### 2. Página Comercial

| Requisito | Detalhe |
|-----------|---------|
| Antiga | Página antiga > nova |
| Score integridade | Alto |
| Limite anúncios | 250/página/mês |
| Workaround | Múltiplas páginas, mesmo Insta vinculado via BM |

### 3. Instagram

| Requisito | Detalhe |
|-----------|---------|
| Vinculado à página | Sim |
| Vinculado à BM | Sim |
| Quantidade | 1 Insta por BM |

### 4. Business Manager (BM)

| Requisito | Detalhe |
|-----------|---------|
| Quantidade | 1 BM por produto/operação |
| Contas | Até ~10 contas/BM |

### 5. Conta de Anúncios

| Requisito | Detalhe |
|-----------|---------|
| Fuso | América/São Paulo (GMT-3) |
| Moeda | BRL |
| Pagamento | Cartão de crédito (NÃO PIX — pode pausar) |
| Quantidade | 1 conta por oferta |

**Dica:** Conta Simples converte cash → cartão crédito pra anúncios.

---

## Pixel + API de Conversões

### Plugin Recomendado

**Pixel Your Site (PYS)** — alternativa: PixelCat se PYS bugar.

### 3 Componentes

| Componente | Onde | O que configurar |
|-----------|------|-----------------|
| **Pixel ID** | Página de vendas (HEAD) | Script do pixel no código |
| **API Token** | Hotmart | Token de conversão (NÃO é o Pixel ID) |
| **Eventos** | Hotmart | View Content + Initiate Checkout + Purchase |

### Configuração na Hotmart

- Selecionar **"Apenas Pagamentos Imediatos"** (sem PIX gerado/não pago)
- Tirar boleto (só PIX) — boleto gera métrica falsa
- Evento de conversão: **"compras no site"** (NUNCA personalizado)
- Correspondência Avançada manual + automática ON

### Verificação

| Ferramenta | Uso |
|-----------|-----|
| **Meta Pixel Helper** (extensão Chrome) | Ícone azul + número verde = OK |
| Aba anônima | Se Pixel Helper bugar com cache |

### Pixel Virgem vs Aquecido

| Tipo | Comportamento |
|------|---------------|
| **Virgem** | Sem dados, lento. ~100 eventos pra começar a funcionar |
| **Aquecido** | Alto volume. Pode decidir em 24h (vs 48h padrão) |

---

## Configuração da Coluna no Gerenciador

Apagar TODAS as colunas padrão e configurar pré-definição com:

1. Visualização da página de destino (quantidade)
2. Custo por visualização (CVP)
3. Finalização de compra (quantidade)
4. Custo por finalização
5. Resultado / compras (quantidade)
6. Custo por resultado (CPA)
7. ROAS de compra
8. Connect Rate (coluna customizada calculada)
9. Data de criação (rastrear idade dos conjuntos)

Salvar como pré-definição.

---

## Princípios

> "Eu juro pra vocês, a gente não tem nenhum tipo de traqueamento. O TM, SCK e tal. Eu jogo a oferta limpa na fase azul, sem order bump, sem nada. E qual o ambiente que eu analiso? Naquelas métricas do gerenciador de anúncios."

> "Eu fiquei multimilionário com uma BM só."

> "1 conta de anúncio por oferta, 1 pixel por oferta, 1 domínio por oferta — TUDO isolado."

---

## Anti-Padrões

| AP | Detectar |
|----|----------|
| Misturar lançamento + perpétuo na mesma BM | Métricas completamente diferentes |
| Usar PIX como pagamento da Meta | Pode pausar campanha quando saldo acabar |
| Boleto Hotmart ON | Métrica falsa no pixel |
| Evento "ver conteúdo" otimizado | Meta busca curiosos, não compradores |
| Evento personalizado | NUNCA — usar "compras no site" |
| Múltiplos produtos numa BM | Contamina pixel |
| Fuso ou moeda diferente | Pode invalidar dados |
| Conta nova começar campanha sem aquecer | Não gasta — fazer Reconhecimento primeiro |

---

## Workflow de Aquecimento de Conta Nova

Se conta não gasta:
1. Duplicar conjuntos dentro da campanha
2. Duplicar campanha inteira (reativar 00:03)
3. Criar campanha de Reconhecimento/Alcance pra aquecer

**CPM altíssima:** criar conta nova + pixel novo. Conta fresca pode ter CPM melhor.

---

## Output

```yaml
setup_completo:
  perfil_fb: ativo
  pagina_comercial: ativa
  instagram_vinculado: true
  bm: criada
  conta_anuncio:
    fuso: "America/Sao_Paulo"
    moeda: BRL
    pagamento: "Cartão de crédito"
  pixel:
    id: "{numero}"
    instalado_em: "pagina (HEAD)"
    api_conversoes: configurada
    eventos: ["ViewContent", "InitiateCheckout", "Purchase"]
    pix_imediato: ON
    boleto: OFF
    correspondencia_avancada: ON
  meta_pixel_helper: verificado_OK
  coluna_gerenciador: configurada (FF3X)
```

---

## Handoff

→ `tasks/fase-3D.md` — Subir ABO Testadora 1-1-1, primeiros 3 dias

---

**Task Status:** Production Ready
