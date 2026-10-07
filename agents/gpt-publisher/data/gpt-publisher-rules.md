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

## Regra 3 — Conta pessoal (Plus) não compartilha mais GPT novo; Custom GPTs serão aposentados

**Contexto:** Em 06/10/2026, ao publicar a LIA Agro na conta Plus da Karol, o GPT Builder só ofereceu "Apenas eu" com o aviso "Já não é possível partilhar GPTs publicamente". A Central de Ajuda da OpenAI (artigo 8554397, "Creating and editing GPTs") diz: contas pessoais (Free, Go, Plus, Pro) não podem criar nem publicar GPTs novos; GPTs existentes continuam usáveis e editáveis. A OpenAI vai aposentar Custom GPTs em favor de **Plugins** — o editor mostra "Migre os seus GPTs para plugins até 11 de dezembro; os não migrados deixarão de estar disponíveis".
**Motivo:** O fluxo "criar GPT novo e mandar o link" deixou de existir pra conta pessoal, e todo GPT (inclusive os 6 do Expert360º e o ExpertViral) tem prazo pra virar plugin.
**Checklist:**
- Antes de prometer link pra aluna/cliente, avisar que GPT novo em conta pessoal fica só pra própria Karol
- Não tentar contornar (outra conta, outro navegador) sem decisão da Karol
- GPT existente ainda pode ser editado (Instructions/Knowledge) — atualizações dos 6 GPTs legados seguem possíveis até a aposentadoria
- Migração pra plugins até 11/12: decisão de produto da Karol, registrar no backlog
- **Plugin não resolve compartilhamento em conta pessoal (checado 06/10/2026):** a ajuda da OpenAI ("Hosting a plugin with ChatGPT Sites", artigo 20001547) diz que usuários Pro e de conta pessoal não conseguem compartilhar plugin com outras pessoas, nem por convite nem por link. Compartilhar plugin só funciona entre membros de um workspace Business ou Enterprise, e depende da permissão "Share plugins". A migração GPT → plugin transforma as Instructions numa skill e leva o Knowledge, mas não leva o compartilhamento, e o plugin migrado começa privado.
