# Guia — Treinar um Avatar V no HeyGen

> O squad produz vídeo, não treina avatar. O treino é feito UMA VEZ na UI do HeyGen,
> antes do primeiro uso do squad. Este guia é pra quem ainda não tem avatar treinado.

## O que é o Avatar V

Avatar V é o modelo de avatar do HeyGen que cria uma **identidade digital persistente** a partir de um vídeo curto. Ele aprende teus gestos, expressões e maneirismos específicos, e depois anima qualquer foto tua com esse movimento. Suporta vídeos de até **3 minutos** — serve pra ad, conteúdo e long-form.

## Por que o treino é na UI (não pelo MCP)

O treino exige gravar vídeo, gravar consentimento e escolher looks visualmente. O MCP não conduz esse fluxo bem. **Treina na UI, produz pelo MCP** (que é o que o squad faz).

## Passo a passo do treino

### 1. Gravar o vídeo base (15 segundos)

- HeyGen → seção **Avatars** → botão **"Clone a Real Person"**
- Seguir os prompts: gravar e enviar um clipe de ~15 segundos
- Esse clipe é tudo que o Avatar V precisa pra aprender teu movimento

### 2. Criar os looks

- Tocar em **"edit look"**
- Escolher um **base look**: foto close-up ou meio-corpo, rosto visível, tu bem na imagem
- Dá pra criar mais de um look (ex: um formal "talking head", um casual "selfie")

### 3. Treinar o Personal Model (opcional, recomendado)

- Subir **30+ fotos** (aceita 10-80)
- Variar: ângulos (frente, lado, 45°), expressões (sério, sorrindo), iluminação, distância
- Leva 15-20 min de processamento
- Resultado: fidelidade visual bem melhor

## Pré-requisitos da conta

- **Plano pago** (Creator+). Avatar V consome credits premium. No free não roda.
- A conta onde o avatar é treinado tem que ser **a mesma** onde o MCP do HeyGen está autenticado no Claude Code — senão o squad não enxerga o avatar.

## Depois do treino

Quando o avatar estiver `completed` na UF, voltar pro squad e rodar `*setup` — o heygen-chief lista os IDs pelo MCP e registra em `data/perfil-usuario.md`. A partir daí o pipeline roda.

## Voz

Opcional mas recomendado: clonar a voz na UI do HeyGen também. Mas o squad usa por padrão **áudio gravado pelo usuário** (a voz real, via `audioUrl`) — então a voz clonada do HeyGen é mais um fallback do que necessidade.

## Referências

- HeyGen — Avatar V: https://www.heygen.com/avatars/avatar-v
- Guia oficial de criação: https://community.heygen.com/public/resources/how-to-use-avatar-v-to-create-a-realistic-ai-avatar-from-a-15-second-video
