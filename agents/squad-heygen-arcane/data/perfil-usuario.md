# Perfil do Usuário — HeyGen

> Fonte de verdade dos IDs do HeyGen. O diretor-look e o operador-heygen-mcp leem daqui.
> Atualizado pelo heygen-chief na task `setup-perfil`.

## Conta

- **Email:** ferramentas@arka.education
- **Plano:** Creator (Avatar V habilitado — exige credits premium)
- **MCP:** HeyGen autenticado no Claude Code nessa conta
- **Última verificação:** 21/05/2026

## Avatares (digital twins — Avatar V)

| Nome | look_id (avatarId) | Tipo | Orientação | Engines | Energia |
|------|--------------------|------|-----------|---------|---------|
| Euriler talking head v1 | `c8d0240dbefb48ee9c8b5f46a87fe418` | digital_twin | portrait 720×1280 | avatar_v, avatar_iv | Formal — encara, peso, autoridade |
| Euriler selfie v1 | `22dd561894bd4728bed3599c5df2b6e5` | digital_twin | portrait 720×1280 | avatar_v, avatar_iv | Casual — improviso, conversa |

**Avatar groups:**
- Euriler talking head v1 → group `6e248d207b4b4d8b911d8346ae50de71`
- Euriler selfie v1 → group `a5e9c1ee06414a0c80e9817430b57c40`

Cada group tem também 3 photo_avatars (looks secundários de roupa/pose) — usados pra variação visual, não como look principal de fala longa.

## Vozes

| Nome | voice_id | Idioma | Uso |
|------|----------|--------|-----|
| euriler voz v1 | `f838936dfc58471ca6d538dc566cd2e7` | Português | Voz clonada do Euriler — usar como default voice |

> Nota: o squad usa **áudio gravado pelo usuário** (`audioUrl`) por padrão — isso bypassa o TTS e usa a voz real. O `voice_id` só é usado se o fluxo cair em `script` + TTS (fallback, não recomendado).

## Casamento recomendado (diretor-look)

- **Ângulos de peso** (confronto, inimigo, diagnóstico) → `talking head v1`
- **Ângulos de improviso** (ruminação, insight, provocação) → `selfie v1`

## Template — preencher pra outro usuário

```
## Avatares (digital twins)
| Nome | look_id | Tipo | Orientação | Engines | Energia |
|------|---------|------|-----------|---------|---------|
| {nome} | {look_id} | digital_twin | {portrait/landscape} | {engines} | {formal/casual} |

## Vozes
| Nome | voice_id | Idioma |
|------|----------|--------|
| {nome} | {voice_id} | {idioma} |
```

Pra descobrir os IDs de outra conta: rodar `list_avatar_groups`, `list_avatar_looks` e `list_voices` pelo MCP (a task `setup-perfil` faz isso).
