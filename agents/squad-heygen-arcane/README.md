# HeyGen Arcane

Squad de produção de vídeos com **clone real do usuário** via MCP do HeyGen — Avatar V audio-driven + voz clonada. Tu grava o áudio, o squad produz o vídeo do teu clone falando com a tua voz, com gesto vindo da entonação automaticamente.

## Ativação

```
/squad-heygen-arcane
```

## Pré-requisito

O squad opera o MCP do HeyGen no Claude Code. Antes do primeiro uso:

1. **Conta HeyGen com plano pago** (Creator+, Avatar V exige credits premium)
2. **Avatar V treinado na UI HeyGen** — botão "Clone a Real Person", vídeo 15s + opcionalmente 30+ fotos pro Personal Model
3. **MCP HeyGen autenticado no Claude Code** na mesma conta onde o avatar foi treinado
4. **Voz clonada (opcional mas recomendado)** — clonada na UI HeyGen

No primeiro uso, o chief registra teus IDs em `data/perfil-usuario.md`. Ver `data/guia-treino-avatar-v.md` se ainda não treinou.

## Agentes

| Agente | Papel |
|--------|-------|
| @heygen-chief | Orquestra o pipeline, valida scripts, conduz gravação e entrega |
| @estrategista-copy-ads | Gera scripts otimizados por look + use case (3 ângulos por padrão) |
| @diretor-look | Escolhe qual look usar (digital twin formal vs selfie casual vs photo avatar) |
| @operador-heygen-mcp | Executa pelo MCP: upload áudio, dispara `create_video_from_avatar`, polling, entrega |

## Pipeline

```
0. Setup do perfil          (Chief)        — 1ª vez, registra IDs    ⚡ QG-HGN-01
1. Processar input          (Estrategista) — identifica use case
2. Gerar scripts            (Estrategista) — 3 ângulos por look
3. Validar scripts          (Chief)        ⚡ QG-HGN-02
4. Diretor escolhe look     (Diretor)      — formal vs casual
5. Orientar gravação        (Chief)        — instrução pra gravar áudio
6. Upload + Produção        (Operador)     ⚡ QG-HGN-03
7. Polling até completed    (Operador)
8. Entrega                  (Operador)     — baixa em ~/Downloads/, abre
```

## Como funciona

Tu invoca o squad com uma ideia/intenção. O Estrategista classifica e gera **3 ângulos de script** por look elegível, otimizados pra HeyGen (sem promessas pesadas, sem entregáveis específicos). O Chief te apresenta, tu escolhe quais gravar. O Diretor confirma qual look vai pra cada script. O Chief orienta a gravação. Tu grava o áudio (Voice Memos do Mac), me passa o caminho. O Operador sobe pra hosting público (catbox.moe), dispara a produção via MCP com `engine: avatar_v`, faz polling até completar, baixa em `~/Downloads/` e abre no player.

## Voz real, gesto real

Quando o áudio é passado como `audioUrl`, o HeyGen **bypassa o TTS** e usa a voz do arquivo direto. Mais que isso: Avatar V é **audio-driven** — a energia e entonação da tua voz controlam os gestos do clone automaticamente. Tu fala forte, ele gesticula. Tu sussurra, ele calma. Motion prompt textual não funciona com Avatar V via MCP (só Avatar IV) — então o áudio é o controle.

## Conhecimento (KB embarcada)

- `data/perfil-usuario.md` — IDs dos avatares/voz do usuário (preenchido no setup)
- `data/receita-mcp-heygen.md` — receita técnica completa (parâmetros, polling, upload)
- `data/guia-treino-avatar-v.md` — como treinar Avatar V na UI HeyGen
- `data/regras-copy-ads.md` — regras de copy (sem promessa pesada, sem entregável específico)

## Use cases

- **Ad curto (UC1)** — Reels 10-30s, hook forte
- **Conteúdo orgânico (UC2)** — Reels 30-90s, reflexivo
- **Long-form (UC3)** — vídeo de treinamento, explainer, até 3 min
- **A/B de look (UC4)** — mesmo áudio em 2+ looks pra testar qual converte
