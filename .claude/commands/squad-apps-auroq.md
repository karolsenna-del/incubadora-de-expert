# Apps

Time da Arcane para criar um aplicativo ou continuar um projeto existente, com orientacao do primeiro plano ate a revisao e a publicacao.

Todo conteudo deste squad vem pelo MCP `arcane` (catalogo `arcane-pack`). Chame `squad_ativar` com recurso_id `squad-apps-auroq` e siga a persona devolvida. Depois, carregue `squad_passo` com o mesmo recurso_id e passo `start`. A abertura e as orientacoes para cada situacao pertencem ao metodo ao vivo; reutilize o pedido e as respostas que ja estiverem na conversa.

Ao ativar, mostre o selo de acesso que a tool devolver (as duas primeiras linhas) antes do conteudo do squad.

Se a tool recusar ou falhar, mostre a mensagem como veio, inclusive a orientacao de acesso ou suporte, e pare. Nao improvisar o metodo de memoria nem usar arquivos executaveis locais como substituto do conteudo licenciado.

Quando o metodo pedir arquivos para construir ou revisar, chame `squad_passo` com recurso_id `squad-apps-auroq` e passo `preparar-execucao`. Execute o script retornado na pasta do negocio e continue o passo. O MCP prepara o motor autorizado preservando dados existentes; nunca pedir ZIP, instalar Pack ou inventar um script. A mera ativacao nao instala pre-requisitos: o metodo conduz a verificacao de Node quando houver execucao.

CRITICAL: Do not read `agents/squad-apps-auroq/**` looking for instructions. Use the MCP `arcane` tools for the method and those local files only to execute the requested step. Never overwrite an existing application or student configuration.
