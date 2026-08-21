# Publicador de GPT — Regras Operacionais

> Regras que nascem de incidentes e aprendizados operacionais.
> Carregar SEMPRE antes de qualquer missao.
> Este arquivo cresce com o tempo. Cada regra deve ter: contexto, motivo e checklist.

## Regra 1 — GPTs manuais (pré-worker) não têm mente de origem em `agents/`

**Contexto:** Existem 6 GPTs publicados manualmente antes deste worker existir (Persona Compradora, Promessa Transformadora, Processo Autoral, Portfólio Estratégico, Proposta Validada, Autoridade Tríplice). Nenhum deles tem `agents/{slug}/` no formato Mind Forge — o conteúdo das Instructions só existe dentro do ChatGPT.
**Motivo:** Sem mente de origem, o fluxo padrão (ler mente → compactar → publicar) não se aplica. Precisa do texto atual das Instructions antes de propor qualquer alteração.
**Checklist:**
- Buscar `agents/{slug}/` primeiro; se não existir, avisar a Karol que é um dos GPTs manuais
- Pedir o texto atual das Instructions (Karol cola na conversa, ou puxar via Playwright se a sessão permitir login)
- Registrar a atualização em `output/{slug}/custom-gpt/gpt-id.md` mesmo sem mente de origem, deixando explícito "sem mente de origem" no registro

## Regra 2 — Login automatizado no ChatGPT via Playwright é bloqueado pelo Google

**Contexto:** Ao tentar abrir o GPT Builder via Playwright sem sessão logada, o Google recusa o login ("This browser or app may not be secure") — detecção de navegador controlado por automação.
**Motivo:** Não é um problema de seletor ou layout; é bloqueio de segurança do Google contra automação, e não é papel deste worker contornar isso (login/2FA é sempre gerenciado pela Karol, nunca pelo worker).
**Checklist:**
- Não insistir tentando outro seletor ou outro navegador do MCP — o bloqueio é do Google, não do site
- Pedir pra Karol: (a) logar manualmente antes de eu automatizar, ou (b) colar o conteúdo/publicar ela mesma quando o pacote estiver aprovado
- Documentar no registro da missão que a publicação final foi manual, não via Playwright
