# APIs de Geracao de Imagem

## Providers Suportados

| Provider | Custo aproximado | Qualidade | Quando usar |
|----------|------------------|-----------|-------------|
| OpenAI gpt-image-2 | $0.04-0.20/imagem | Alta | Default — melhor pra colagens e composicoes |
| Google Gemini | Free tier ate certo limite | Alta | Quando ja tem conta Google/Gemini |
| Nano Banana (Higgsfield) | Variavel | Alta | Quando ja tem conta Higgsfield |

## Como Configurar

### OpenAI gpt-image

```bash
# 1. Pegar chave em https://platform.openai.com/api-keys
# 2. Salvar em ~/.carrossel-arcane/config/api.yaml:
mkdir -p ~/.carrossel-arcane/config
cat > ~/.carrossel-arcane/config/api.yaml <<EOF
provider: openai
api_key: sk-proj-XXXXXXXXX
model: gpt-image-2
EOF
chmod 600 ~/.carrossel-arcane/config/api.yaml
```

### Google Gemini

```bash
# Pegar chave em https://aistudio.google.com/apikey
cat > ~/.carrossel-arcane/config/api.yaml <<EOF
provider: gemini
api_key: XXXXXXXXX
model: gemini-2.0-flash-image
EOF
chmod 600 ~/.carrossel-arcane/config/api.yaml
```

### Nano Banana (Higgsfield)

Usa skill `higgsfield-generate` ja instalada. Sem config adicional necessaria se ja configurado.

## Como Chamar (exemplos)

### OpenAI gpt-image-2

```bash
API_KEY=$(grep api_key ~/.carrossel-arcane/config/api.yaml | cut -d' ' -f2)

curl -s https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "editorial collage, central figure...",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
  }' | jq -r '.data[0].b64_json' | base64 -d > /tmp/slide-image.png
```

### Gemini

```bash
API_KEY=$(grep api_key ~/.carrossel-arcane/config/api.yaml | cut -d' ' -f2)

curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-image:generateContent?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "editorial collage..."}]}]
  }'
# extrair imagem da response e salvar
```

## Prompt Engineering pra Slides

### Estrutura de prompt

```
{estilo geral}, {composicao}, {elementos especificos}, {paleta de cores},
{tipografia se houver texto na imagem}, {detalhes tecnicos}
```

### Exemplo (slide tipo "comparacao")

```
editorial magazine collage, split screen comparison, left side showing old
typewriter, right side showing modern laptop, neutral color palette
(beige, black, white), high contrast, professional photography style,
1080x1080
```

### Exemplo (slide tipo "hero")

```
clean studio product shot, single object centered, soft natural lighting,
white background, minimalist aesthetic, magazine quality, 1080x1080
```

### Erros comuns

- Prompts muito vagos ("uma imagem legal pra esse slide") → IA inventa qualquer coisa
- Demandar muitos elementos ("3 robos + 2 ceos + paisagem + texto") → composicao caotica
- Texto dentro da imagem AI → IA escreve errado, melhor texto via template HTML

## Custos Estimados

Pra um carrossel de 10 slides com 5 imagens AI:
- gpt-image-2 (high): 5 * $0.17 = $0.85 (~R$4)
- Gemini: free se ainda tem quota
- Nano Banana: depende do plano Higgsfield

## Fallback

Se API falha (erro de rede, cota esgotada, etc):
- Logar erro
- Avisar aluno: "API {provider} falhou: {erro}. Posso pular essa imagem ou tu envias manual?"
- Continuar producao sem travar
