# Política de Privacidade — App postador-conteudo (Instagram)

**Última atualização:** 13 de setembro de 2026

**Publicada em:** https://membros.incubadoradeexpert.com.br/privacidade.html

---

## 1. Identificação

Este aplicativo ("App", `postador-conteudo`, exibido como "api-IG" na tela de permissões do Instagram) é operado por **Karoline Franzini de Carvalho Senna**, responsável pela **Incubadora de Expert**, com sede no Brasil.

Contato: karolsenna@incubadoradeexpert.com.br

---

## 2. O que este App faz

Este App acessa a API do Instagram (Meta) pra automatizar 3 tarefas na conta do Instagram da Incubadora de Expert (`@karolsenna._`):

1. **Publicar conteúdo** — posts e carrosséis agendados
2. **Responder automaticamente por Direct** quando alguém manda uma palavra-chave específica (ex: "GRUPO", "LIVE") — envia de volta o link da oferta ou grupo correspondente
3. **Responder automaticamente por Direct (Private Reply) quando alguém comenta** uma palavra-chave num post/Reels público — mesmo mecanismo do item 2, canal diferente

Não é um aplicativo público de terceiros — é uma automação de uso interno, operada exclusivamente pela própria titular da conta comercial, sem interface para outras empresas ou contas usarem.

---

## 3. Dados coletados

Este App **não coleta nem armazena dados pessoais de quem interage** (quem comenta ou manda Direct). O processamento é feito em tempo real, sem persistência:

- **Texto do comentário ou da mensagem recebida** — lido apenas pra checar se bate com uma palavra-gatilho cadastrada; não é salvo em nenhum banco de dados
- **ID do comentário/conversa** (fornecido pela própria API da Meta) — usado só pra endereçar a resposta automática; não é armazenado após o envio
- **Token de acesso** da conta comercial da titular, necessário pra autenticar as chamadas à API

Nenhum dado de quem comenta ou manda mensagem é retido, analisado, vendido ou usado pra qualquer finalidade além de responder aquela interação pontual.

---

## 4. Permissões utilizadas

O App utiliza as seguintes permissões da Meta:

- `instagram_business_basic` — informações básicas da conta comercial autenticada
- `instagram_content_publish` — publicar posts e carrosséis
- `instagram_business_manage_messages` — ler e responder mensagens diretas (Direct) enviadas à conta
- `instagram_manage_comments` — ler comentários em posts/Reels próprios e responder via Private Reply

---

## 5. Armazenamento de dados

O token de acesso é armazenado como variável de ambiente segura na infraestrutura de hospedagem (Vercel), nunca exposto no código-fonte público nem no lado do cliente. Nenhum dado de terceiros (quem comenta ou manda Direct) é armazenado — o processamento é feito em tempo real e descartado após a resposta.

---

## 6. Compartilhamento de dados

Este App **não compartilha nenhum dado** com terceiros. As únicas chamadas de rede são entre o App e a API oficial da Meta (`graph.instagram.com` / `graph.facebook.com`).

---

## 7. Direitos do usuário

Quem comenta ou manda Direct pra conta não tem dado nenhum retido — não há o que solicitar exclusão, já que nada é armazenado além do necessário pra responder em tempo real. Para dúvidas, entre em contato pelo e-mail: karolsenna@incubadoradeexpert.com.br

---

## 8. Alterações nesta política

Esta política pode ser atualizada periodicamente. A data de última atualização estará sempre indicada no topo deste documento.

---

## 9. Contato

**Incubadora de Expert**
E-mail: karolsenna@incubadoradeexpert.com.br
Site: incubadoradeexpert.com.br
