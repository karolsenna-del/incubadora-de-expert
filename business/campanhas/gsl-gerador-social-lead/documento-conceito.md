# GSL — Gerador Social Lead

**Status:** conceito em avaliação  
**Data:** 29/09/2026  
**Responsável pela decisão de produto:** Karol Senna

## 1. Ideia central

O GSL é uma ferramenta de pesquisa e priorização de potenciais clientes no Instagram. A proposta não é entregar milhares de nomes genéricos, mas encontrar um volume utilizável de perfis, indicar quais têm maior aderência à persona e preparar uma abordagem personalizada para revisão humana.

## 2. Problema que resolve

A prospecção social manual exige que o expert:

- pesquise hashtags e publicações uma a uma;
- abra e avalie cada perfil;
- leia bio e conteúdo para descobrir se há aderência;
- evite concorrentes, parceiros, clientes e perfis pessoais;
- pense em uma abordagem diferente para cada pessoa;
- registre os contatos sem duplicar o CRM.

O GSL transforma essas etapas em um processo organizado, rastreável e assistido por IA.

## 3. Proposta preliminar

> Encontre até 100 potenciais clientes no Instagram, descubra quem tem maior aderência à sua oferta e receba uma abordagem personalizada para cada perfil.

A promessa deve falar em **potenciais clientes ou oportunidades identificadas**, não garantir que todos os perfis coletados sejam leads qualificados.

## 4. Volume definido para o MVP

A referência observada no mercado prometia até 10.000 perfis. Para a persona da Karol, foi definido que **50 a 100 perfis por pesquisa ou campanha** já formam uma entrega útil e atrativa.

A qualidade da seleção e da priorização importa mais que o volume bruto.

## 5. Entradas do usuário

O usuário informa:

- descrição da persona;
- oferta ou objetivo da prospecção;
- hashtags relacionadas ao nicho;
- palavras ou expressões esperadas na bio;
- opcionalmente, o link de uma publicação pública de concorrente para analisar comentaristas;
- critérios de exclusão;
- tom desejado para a abordagem.

## 6. Fontes de descoberta consideradas

### 6.1 Hashtags

Localizar publicações associadas às hashtags escolhidas e usar seus autores como perfis candidatos.

### 6.2 Palavras na bio

As palavras da bio funcionam principalmente como **filtro e qualificação depois da descoberta do perfil**. A API oficial do Instagram não oferece busca irrestrita de todos os perfis por qualquer termo da biografia.

### 6.3 Comentaristas de uma publicação

A partir do link público de uma publicação, identificar perfis que comentaram e avaliar se correspondem à persona. Esse sinal pode ser mais valioso que uma hashtag porque demonstra interesse real no assunto abordado.

## 7. Funcionamento esperado

1. Receber persona, oferta e fontes de busca.
2. Descobrir até 100 perfis públicos.
3. Normalizar nome, usuário, URL, bio e origem da descoberta.
4. Remover duplicidades internas e contatos já existentes no CRM.
5. Aplicar palavras-chave e critérios de exclusão.
6. Avaliar bio, categoria, atividade e sinais públicos disponíveis.
7. Classificar o tipo de perfil e calcular a aderência.
8. Apresentar os perfis por ordem de prioridade.
9. Gerar um rascunho de abordagem baseado em fatos verificáveis.
10. Aguardar revisão humana antes de qualquer registro ou contato.

## 8. Dados mínimos por perfil

- nome público;
- nome de usuário;
- URL do perfil;
- bio pública;
- categoria pública, quando disponível;
- origem da descoberta: hashtag, termo ou publicação;
- termo ou sinal encontrado;
- quantidade pública de seguidores, quando disponível;
- atividade recente, quando verificável;
- motivo de aderência;
- classificação;
- score de prioridade;
- sugestão de ângulo de conversa;
- rascunho da primeira abordagem;
- status de revisão;
- indicação de duplicidade no CRM.

## 9. Classificação dos perfis

O sistema não deve tratar todo perfil encontrado como lead. Categorias mínimas:

- potencial cliente aderente;
- potencial cliente com pouco contexto;
- concorrente;
- parceiro possível;
- aluno ou cliente existente;
- perfil pessoal;
- conta comunitária;
- perfil inadequado ou sem evidência suficiente.

## 10. Critérios preliminares de priorização

O score deve considerar separadamente:

- aderência à persona;
- presença do problema ou interesse relacionado à oferta;
- atuação profissional compatível;
- maturidade aparente;
- atividade recente;
- existência de um contexto verdadeiro para iniciar conversa;
- riscos de classificação incorreta;
- duplicidade ou relacionamento prévio.

O score ajuda a ordenar; não substitui a decisão humana.

## 11. Copy personalizada

A abordagem deve usar somente sinais públicos, atuais e verificáveis do perfil.

### Regras

- não inventar interação prévia;
- não usar elogio genérico como falsa personalização;
- não presumir dor, renda, necessidade ou intenção de compra;
- mencionar apenas um sinal real da bio, do conteúdo ou do comentário;
- fazer uma pergunta curta que abra conversa;
- adequar a mensagem à categoria e ao nível de aderência;
- nunca enviar automaticamente por padrão.

### Estrutura sugerida

1. Contexto real que levou ao perfil.
2. Observação específica e verificável.
3. Conexão breve com o tema da oferta.
4. Pergunta simples, sem pressão comercial.

## 12. Como ferramentas semelhantes provavelmente operam

A solução de referência aceita hashtags, palavras da bio e links de posts de concorrentes, além de informar qualificação por perfil e geração de mensagem personalizada.

O funcionamento mais provável é uma combinação de:

1. coleta de autores de publicações por hashtag;
2. coleta de usuários que comentaram em uma publicação;
3. enriquecimento de cada perfil com dados públicos;
4. filtragem por palavras da bio;
5. IA para classificação e priorização;
6. IA para gerar a abordagem.

A imagem observada confirma as funcionalidades prometidas, mas não revela a tecnologia, o fornecedor de dados nem a forma exata de coleta.

## 13. Limitações técnicas identificadas

- A API oficial da Meta permite alguns usos relacionados a hashtags, mas não uma busca livre e irrestrita por palavras em biografias.
- Acesso em escala a comentaristas de publicações arbitrárias de concorrentes normalmente depende de scraping ou fornecedor externo de dados.
- Scraping pode sofrer bloqueios, mudanças de interface, limites de requisição e restrições dos termos da plataforma.
- Perfis privados, removidos ou com pouco conteúdo não permitem qualificação confiável.
- Dados públicos podem estar desatualizados ou ser insuficientes.
- “10.000 leads” geralmente significa perfis brutos coletados, não 10.000 oportunidades realmente qualificadas.

## 14. Privacidade, consentimento e segurança

O GSL deve:

- coletar somente dados públicos necessários;
- registrar a origem da descoberta;
- evitar dados sensíveis ou inferências pessoais;
- não contornar login, CAPTCHA ou bloqueios da plataforma;
- oferecer revisão e exclusão dos dados;
- respeitar pedidos de não contato e opt-out;
- manter perfis pessoais ou sem contexto comercial fora da prospecção;
- não enviar mensagens sem autorização explícita do usuário;
- considerar LGPD, termos da plataforma e política de privacidade antes da disponibilização aos alunos.

## 15. Caminhos técnicos possíveis

### Opção A — MVP assistido

- O usuário fornece hashtags e links.
- A ferramenta coleta uma amostra limitada de perfis públicos por operação assistida.
- O GSL filtra, qualifica, prioriza e gera as copies.
- Menor custo e risco; ideal para validar a utilidade antes de escalar.

### Opção B — Fornecedor de dados

- Um serviço externo realiza a descoberta e o enriquecimento.
- O GSL recebe os dados estruturados e executa a qualificação.
- Facilita escala, mas adiciona custo, dependência e necessidade de avaliar conformidade.

### Opção C — Coleta própria em escala

- Infraestrutura própria de scraping, filas, sessões e proxies.
- Maior controle, mas também maior complexidade, manutenção e risco de bloqueio.
- Não recomendada para a primeira versão.

## 16. Custos e papel da IA

### Validação interna

É possível construir um MVP quase sem custo recorrente usando:

- execução local;
- planilha ou banco local;
- coleta limitada e assistida;
- revisão humana;
- Claude Code ou Codex para desenvolver o software.

### Ferramenta para alunos

Uma plataforma automática não é integralmente gratuita. Pode exigir:

- hospedagem;
- banco de dados;
- coleta ou fornecedor de dados;
- processamento de IA;
- monitoramento e manutenção.

A assinatura do ChatGPT ou do Claude Code pode ajudar a **desenvolver** o GSL, mas não fornece gratuitamente um motor de IA embutido para todos os alunos. O uso contínuo normalmente exigirá API paga, modelo local ou que cada usuário conecte sua própria conta compatível.

## 17. Papel do Claude Code

O Claude Code consegue construir:

- interface;
- banco de dados;
- filtros;
- deduplicação;
- score;
- integração com CRM;
- geração das copies;
- testes e documentação.

Ele não fornece, por si só, os dados do Instagram. A fonte e a política de coleta precisam ser definidas separadamente.

## 18. Escopo recomendado para a primeira versão

### Incluído

- uma rede inicial: Instagram;
- entrada de persona e oferta;
- hashtags;
- link de uma publicação pública;
- palavras da bio usadas como filtro;
- limite de até 100 perfis por pesquisa;
- classificação e score;
- rascunho personalizado;
- revisão humana;
- exportação para planilha;
- verificação de duplicidade no CRM, quando integrado.

### Fora do MVP

- disparo automático de mensagens;
- promessa de quantidade de vendas;
- coleta de dados privados;
- contorno de mecanismos de proteção;
- operação em múltiplas redes;
- 10.000 perfis por campanha;
- enriquecimento com dados sensíveis;
- CRM alterado sem aprovação.

## 19. Critérios de validação do MVP

A primeira versão será considerada útil se:

- trouxer perfis reais e acessíveis;
- reduzir o tempo de pesquisa manual;
- separar claramente perfis aderentes e inadequados;
- justificar o score com evidências;
- produzir copies que não pareçam genéricas;
- evitar duplicados;
- permitir revisão antes de qualquer ação;
- manter rastreabilidade da origem.

## 20. Decisões já tomadas

- Nome provisório: **GSL — Gerador Social Lead**.
- Público inicial: experts e alunos da Karol.
- Rede inicial: Instagram.
- Volume desejado: 50 a 100 perfis por pesquisa ou campanha.
- Prioridade: qualidade e aderência, não volume bruto.
- Palavras da bio serão usadas como filtro após a descoberta.
- A copy será personalizada com fatos verificáveis.
- Não haverá disparo automático por padrão.
- Claude Code pode desenvolver a ferramenta, mas não substitui a fonte dos dados nem o motor de IA em produção.

## 21. Decisões pendentes

Antes da construção, ainda será necessário decidir:

- se o MVP será apenas interno ou entregue aos alunos;
- qual fonte autorizada será usada para obter perfis;
- se comentaristas de posts entrarão na primeira versão;
- quais critérios e pesos formarão o score;
- quais campos serão integrados ao CRM;
- onde a ferramenta será hospedada;
- como a IA funcionará em produção;
- qual será a política de retenção e exclusão dos dados;
- quem fará a revisão final das abordagens.

## 22. Próximo passo recomendado

Criar um protótipo controlado com uma única pesquisa real:

- uma persona;
- uma oferta;
- três hashtags;
- um post público de referência;
- até 50 perfis;
- classificação manual comparada ao score do GSL;
- dez abordagens revisadas pela Karol;
- nenhum envio automático.

Esse teste valida a qualidade da descoberta, da priorização e da copy antes de investir em escala ou infraestrutura.