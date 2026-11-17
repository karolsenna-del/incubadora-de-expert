# Expert-IAs: anexos, "Meu contexto" e conversas salvas (17/11/2026)

Pedido da Karol: agentes de conteúdo não leem imagem nem link; colar o contexto a cada conversa pesa; avisar quando a conversa fica longa.
Decisões: opção A (os três) + conversas no banco (B). Imagens não ficam guardadas (o agente lê na hora; fica a marca "imagem enviada").

- [x] Banco: `ia_conversas` e `ia_contexto` (cada aluno só vê as suas; Karol lê todas) — `sql/expert-ias-conversas.sql`
- [x] Servidor (`api/chat-agente.js`): imagem na mensagem, "Meu contexto" logo depois das instruções, resumo da conversa anterior, ação "resumir", nota de plataforma nova
- [x] Tela (código novo em `js/chat-ias.js`; o chat saiu do app.js) (`js/app.js`, `app.html`, `css/styles.css`): anexar (imagem, PDF, Word, texto), conversas anteriores, Meu contexto, aviso de conversa longa → nova com resumo; conversa antiga do navegador migra pro banco
- [x] Teste do servidor (contexto, resumo, imagem, ação resumir) e das regras do banco (aluno 2 não vê nada do aluno 1). Tela: conferir no ar com o login da Karol
- [x] Publicado pela Karol (dpl_DHmhqdEheUXK7sX8taBbHw62t89a) e testado no ar com o login dela no agente Carrossel: imagem lida ("banana azul"), arquivo .txt lido ("girassol"), conversa salva no banco, lista de conversas, Meu contexto abre, continuar com resumo cria conversa nova com resumo.
- [x] Ajuste da reapresentação publicado (dpl_5ap8bE11) e conferido: o agente continua direto do resumo
- Ficaram 2 conversas de teste no Carrossel da conta da Karol.

Banco gratuito (500 MB), 17 MB usados em 17/11 com 9 alunos.
