# LIA e REGIA no Claude: teste e pontos de atenção

Milena, os agentes saíram do ChatGPT e agora são skills do Claude. Funcionam no plano grátis, sem gastar com créditos nem com assinatura. Cada aluno instala uma vez na própria conta (o passo a passo está em `como-instalar-lia-e-regia`).

Antes de mandar para os alunos, instale as duas na sua conta, teste e me devolva o que precisar mudar. As respostas técnicas que você deu no roteiro da REGIA já estão dentro dela.

## 1. Como testar (uns 30 minutos)

Instale `lia-agro.zip` e `regia.zip` seguindo o guia. Abra uma conversa nova para cada teste e anote o que achou.

**REGIA**
1. "REGIA, oi." → Ela deve se apresentar com as 6 opções.
2. "REGIA, tenho um imóvel para crédito rural. Matrícula 100 ha, CCIR 96 ha, ITR 102 ha, CAR 98 ha." → Deve cruzar as áreas, marcar verde, amarelo ou vermelho e dizer o que investigar.
3. "REGIA, um de três irmãos quer vender a parte dele da fazenda, que está em condomínio." → Deve levantar a diferença entre fração ideal e área individualizada.
4. "REGIA, depois do georreferenciamento apareceu sobreposição no CAR. O que faço?" → Deve investigar a origem antes de mandar corrigir o CAR.
5. Mande uma foto ou PDF de uma matrícula (sem dado de cliente real, ou com os dados tampados). → Ela deve listar o que leu e pedir sua confirmação antes de usar.

**LIA**
6. "LIA, o produtor disse que está caro." → Ela deve perguntar a causa antes de responder.
7. "LIA, vou ter reunião com uma família: o pai não quer dividir e os filhos querem." → Ela deve separar o interesse de cada um da solução técnica.
8. "LIA, me explica CCIR para eu falar com o produtor." → Linguagem simples: o que é, por que importa, o que muda.

Em cada teste, a pergunta é: **ela respondeu como você responderia?** Onde não respondeu, escreva o que você diria no lugar.

## 2. Pontos para você dar atenção

**REGIA**
- **Tom das respostas do roteiro.** Várias respostas parecem ter passado pelo ChatGPT (negrito, "Na prática, eu…", frases muito redondas). O conteúdo está bom, mas a REGIA tende a falar do mesmo jeito, e a ideia era ela ter o seu tom, os seus termos e os seus exemplos. Se puder, reescreva com as suas palavras, principalmente os blocos 3 a 9, e conte um caso real seu (sem nome) em cada um.
- **Um trecho que não era seu.** No bloco 3 tinha uma fala do ChatGPT colada junto ("Exatamente. Eu deixaria sua resposta mais alinhada…"). Tirei da REGIA. Confira se não ficou nada mais assim.
- **Pergunta sem resposta.** No bloco 2, a pergunta era se existe uma diferença de área que você considera normal antes de virar alerta. A resposta que veio fala do código do CCIR e do CIB. Enquanto você não responder, a REGIA trata toda diferença como "precisa verificar" até descobrir a origem. Se você trabalha com alguma tolerância, me diga qual.
- **Prazo legal do georreferenciamento.** Conferi o Decreto nº 12.689/2025: a exigência foi para 21/10/2029. Mas há um projeto de lei na Câmara (PL 1664/2025) propondo levar para 2030. A REGIA avisa que o prazo pode mudar; quando mudar, me avise para atualizar.
- **Limites.** No questionário você não respondeu o que ela nunca deve fazer, então os limites atuais foram definidos por nós: não dar conclusão jurídica, não garantir crédito nem prazo de cartório ou do INCRA, não citar cliente nem valores. Confirme se é isso.

**LIA**
- **Ainda não foi validada por você.** Ela junta numa só o agente do método e o preparador de conversas difíceis. Confirme se é para ficar junto.
- **Limites.** A regra de não citar nomes de clientes nem valores foi copiada da REGIA, sem você confirmar para a LIA.
- **Simulador de negociação.** O documento de apoio sugeria a LIA fazer o papel do produtor numa negociação de treino e depois avaliar o técnico. Não entrou porque você não pediu. Quer como 8ª opção?

**As duas**
- **O conteúdo fica visível.** Como é skill no plano grátis, quem abrir o arquivo consegue ler as instruções e a base inteira. Não tem como controlar quem usa nem por quanto tempo. É o preço de não ter custo. Se um dia quiser proteger o método, o caminho é uma página com código de acesso (essa tem custo de IA).
- **Limite do plano grátis.** O Claude grátis tem um limite de mensagens por período. Veja no teste se ele atrapalha uma conversa de diagnóstico completa.

## 3. Como me devolver

Pode ser em áudio ou texto, do jeito que for mais fácil: o número do teste, o que ela respondeu de errado e o que você diria. Com isso eu ajusto as duas e refaço os arquivos para os alunos.
