# Checklist — Pré-Produção HeyGen Arcane

> O operador-heygen-mcp roda esta checklist antes de disparar qualquer produção.
> Cada item falso bloqueia o disparo até ser resolvido.

## Perfil e conta

- [ ] `data/perfil-usuario.md` tem ao menos um avatar look_id registrado
- [ ] MCP HeyGen autenticado (`get_current_user` retorna a conta certa)
- [ ] Plano da conta é pago (Creator+) — Avatar V exige credits premium
- [ ] O look escolhido tem `avatar_v` em `supported_api_engines`

## Script e gravação

- [ ] Script validado pelo usuário (QG-HGN-02 cumprido)
- [ ] Áudio gravado e o caminho do arquivo é válido
- [ ] Mapeamento áudio ↔ script ↔ look confirmado com o usuário

## Upload

- [ ] Áudio copiado pra path estável (`/tmp/heygen-audio/`)
- [ ] Áudio subido pra URL pública (catbox.moe ou fallback)
- [ ] URL pública testada — abre e baixa o arquivo

## Chamada de produção

- [ ] `avatarId` = look_id correto (do mapeamento)
- [ ] `audioUrl` = URL pública (não caminho local)
- [ ] `engine` = `{"type": "avatar_v"}` explícito
- [ ] `aspectRatio` definido (9:16 Reels / 16:9 long-form)
- [ ] `resolution` = "1080p"
- [ ] `title` descritivo preenchido
- [ ] `script` e `voiceId` NÃO passados junto com `audioUrl` (mutuamente exclusivos)

## Custo

- [ ] Só o que o usuário aprovou está sendo produzido (sem lote no escuro)
