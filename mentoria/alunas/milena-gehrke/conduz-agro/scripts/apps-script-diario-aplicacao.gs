/**
 * Conduz Agro — Diário de Aplicação do aluno. Arquivo pessoal, 1 cópia por
 * aluno, onde ele marca e registra as atividades de 15 min do Plano de
 * Aplicação Diária (mesmas 48 semanas × 5 atividades de
 * `apps-script-plano-aplicacao-diaria.gs` — texto das atividades idêntico).
 * Sessões quinzenais: as semanas 2N-1 e 2N vêm DEPOIS da sessão N
 * (corrigido 18/11/2026 — antes eram 24 semanas e a atividade do Simulador,
 * da S6, caía na semana 6, antes da S6 acontecer).
 *
 * Gera 2 abas:
 *  · "Atividades" — as 240 atividades com quadradinho de ✓ e contador de
 *    progresso no topo. Linha marcada fica riscada.
 *  · "Dia a dia" — 1 linha por atividade, agrupada por semana: data, a
 *    atividade, O QUE ANOTAR (cada atividade pede um registro diferente —
 *    lista de 3, frase, antes x depois…) e o campo em branco do aluno.
 *
 * A coluna "O que anotar" é RASCUNHO MEU, derivada do texto de cada
 * atividade — validar com a Milena antes de distribuir (mesma ressalva do
 * Plano de Aplicação Diária).
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_PAPER = "#F5F0E6";
var COR_PAPER_DEEP = "#E4DBC4";
var COR_RULE = "#D9CDB0";
var COR_GOLD = "#B07A16";
var COR_GOLD_TINT = "#F3E6C8";
var COR_OLIVE_TINT = "#E9EEDD";
var COR_WHITE = "#FFFFFF";

// [nº, sessão, tema, [[atividade, o que anotar] × 5]]
var SEMANAS = [
  [1,"S1","Nomear seu papel atual",[
    ["💭 Releia seu resultado do Diagnóstico e escreva 1 frase sobre sua trava principal","A frase da sua trava principal, em 1 linha"],
    ["🎯 Observe 1 atendimento real hoje e note se agiu como executor ou condutor","Qual atendimento · Executor ou condutor? · O que te fez agir assim"],
    ["✍️ Liste 3 momentos da semana em que se sentiu insegura","1) …  2) …  3) … — o que estava acontecendo em cada momento"],
    ["🎭 Escolha 1 produtor real e ensaie mentalmente como nomearia seu papel nesse caso","Qual produtor/caso · A frase que você usaria pra nomear seu papel"],
    ["👥 Compartilhe com alguém de confiança 1 insight do diagnóstico e peça a opinião dela","Com quem falou · O insight que contou · O que a pessoa respondeu"]]],
  [2,"S2","Rota Personalizada Conduz Agro",[
    ["✍️ Releia seu plano de 12 meses e escreva a meta do mês 1 num post-it","A meta do mês 1 (a mesma do post-it)"],
    ["💭 Escreva o que \"condução\" significa pra você, com suas próprias palavras","Sua definição de condução, com suas palavras"],
    ["🧪 Autoavaliação rápida — marque de 1 a 5 cada um dos 6 pilares do método (técnica, comunicação, condução, negociação, posicionamento e segurança)","A sua nota de 1 a 5 em cada pilar: técnica, comunicação, condução, negociação, posicionamento e segurança"],
    ["🎯 Agende na agenda física os horários das próximas 4 sessões","Data e horário das próximas 4 sessões"],
    ["🎧 Ouça um áudio curto sobre autoridade e condução, anote 1 frase que ficou","A frase que ficou com você · Por que ela marcou"]]],
  [3,"S3","Segurança interna essencial",[
    ["🎯 Aplique o Círculo de Controle numa situação de pressão real de hoje","A situação · O que estava no seu controle · O que não estava"],
    ["🪞 Antes de 1 atendimento, respire fundo 3x no espelho e repita em voz alta sua postura de condutora","Qual atendimento · Como você entrou nele depois do ritual"],
    ["💭 Note 1 pensamento de insegurança e responda com 1 fato concreto","O pensamento de insegurança · O fato concreto que responde a ele"],
    ["🎯 Repita hoje 1 ação que só depende de você, do Círculo de Controle","A ação que você repetiu · Como foi"],
    ["✍️ Revise a semana por escrito: em que momento você agiu apesar do medo?","O momento em que agiu apesar do medo · O que aconteceu depois"]]],
  [4,"S4","Leitura do produtor essencial",[
    ["🎭 Em 1 atendimento, pergunte \"o que está por trás disso?\" antes de responder","Qual atendimento · O que o produtor respondeu à pergunta"],
    ["🧪 Use a Leitura do Produtor pra identificar o perfil de 1 cliente real","Qual cliente · O perfil identificado · O sinal que te mostrou isso"],
    ["✍️ Preencha o Mapa do Caso rápido pra 1 atendimento em andamento","Qual caso · O que ficou mais claro depois de preencher o Mapa"],
    ["💭 Anote 1 risco que o produtor ainda não percebeu no caso dele","Qual caso · O risco que o produtor ainda não viu"],
    ["👥 Pergunte a um colega como ele lê perfis de produtor — compare com o seu","Quem · Como ele lê os perfis · O que é diferente do seu jeito"]]],
  [5,"S5","Comunicação de valor essencial",[
    ["✍️ Antes de explicar algo técnico, escreva a versão \"simples\" primeiro","O assunto técnico · A versão simples que você escreveu"],
    ["🎯 Em 1 conversa, siga a ordem: abertura → escuta → diagnóstico → orientação","Qual conversa · Em qual etapa foi mais difícil seguir a ordem"],
    ["🪞 Traduza 1 termo técnico em voz alta, pro espelho, como se explicasse pra um leigo","O termo técnico · Como você traduziu"],
    ["🎭 Pratique 1 abertura de conversa em voz alta antes de ligar pra alguém","A abertura que ensaiou · Como a conversa começou de verdade"],
    ["👥 Peça feedback de alguém sobre como você explicou algo essa semana","Quem deu o feedback · O que a pessoa disse"]]],
  [6,"S6","Condução de objeções essencial",[
    ["🎭 Use o Simulador de Conversas pra treinar 1 objeção que te assusta","A objeção que treinou · A resposta que funcionou melhor"],
    ["🎯 Na próxima objeção de preço real, pergunte \"o que te preocupa nisso?\"","Qual cliente · O que ele respondeu quando você perguntou"],
    ["✍️ Escreva 1 resposta pronta pra objeção de \"vou pensar\"","Sua resposta pronta pra \"vou pensar\""],
    ["🪞 Pratique ficar em silêncio 3 segundos depois de dizer o preço, no espelho","Como foi sustentar os 3 segundos · O que sentiu"],
    ["💭 Revise: alguma objeção dessa semana era sobre outra coisa, não preço?","A objeção · Sobre o que ela era de verdade"]]],
  [7,"S7","Posicionamento e precificação essencial",[
    ["✍️ Preencha 1 linha do Mapa de Posicionamento (Eu sou)","Sua linha \"Eu sou\""],
    ["🧪 Preencha o Mapa de Valor Percebido pra 1 tarefa técnica comum sua","A tarefa técnica · O valor que o produtor percebe nela"],
    ["🎯 Reescreva sua proposta comercial padrão com a nova estrutura","O que mudou na proposta padrão (antes → depois)"],
    ["🎯 Envie a proposta reformulada pra 1 cliente real","Pra quem enviou · Como o cliente reagiu"],
    ["💭 Releia o que mudou entre a proposta antiga e a nova","As 3 principais diferenças entre a proposta antiga e a nova"]]],
  [8,"S8","Aplicação real + checkpoint",[
    ["🎭 Aplique o método completo (S1-S7) num atendimento real hoje","Qual atendimento · O que funcionou · Onde travou"],
    ["🧪 Registre no Checklist de Evidências sua 2ª marcação","Seu total nesta marcação · O indicador que mais subiu"],
    ["✍️ Escreva o que já mudou desde a S1 até hoje","O que já mudou desde a S1 (pode ser em tópicos)"],
    ["👥 Conte pra alguém de confiança o resultado comercial concreto que você conseguiu","Pra quem contou · O resultado comercial concreto"],
    ["🎧 Ouça algo inspirador e descanse — feche a Etapa 1 antes do aprofundamento","O que ouviu · A Etapa 1 resumida em 1 frase"]]],
  [9,"S9","Travas mais profundas",[
    ["✍️ Escreva sobre 1 crença de não-merecimento que ainda aparece","A crença · Em que situação ela aparece"],
    ["💭 Revise 1 caso da Etapa 1 e identifique o padrão de trava","Qual caso · O padrão de trava que você enxerga"],
    ["🎯 Note quando a procrastinação apareceu essa semana e por quê","Quando apareceu · O que você estava evitando"],
    ["🪞 Diga em voz alta, pro espelho, 1 frase pra substituir a crença limitante identificada","A crença antiga · A frase nova que substitui"],
    ["💭 Essa trava mudou desde a S1?","Como ela era na S1 · Como está hoje"]]],
  [10,"S10","IE aplicada + reconhecendo valor",[
    ["✍️ Liste 3 casos recentes em que você evitou risco/perda pro produtor","1) …  2) …  3) … — o risco ou a perda que você evitou em cada caso"],
    ["🎯 Pratique autorregulação: antes de reagir a pressão, conte até 5","A situação de pressão · Como você reagiu depois de contar até 5"],
    ["💭 Observe 1 momento de calma sob pressão essa semana","O momento · O que te ajudou a manter a calma"],
    ["🧪 Atualize sua lista de valor entregue com 1 caso novo","O caso novo · O valor que você entregou"],
    ["🪞 Reconheça em voz alta, pro espelho, 1 coisa que você fez bem essa semana","O que você fez bem essa semana"]]],
  [11,"S11","Leitura de cenário complexo",[
    ["🎯 Em 1 caso real, mapeie todas as pessoas envolvidas na decisão","Qual caso · Quem participa da decisão (nome e papel de cada um)"],
    ["✍️ Identifique documentos e interesses de cada parte de 1 caso","Cada parte do caso · Documentos que ela tem · O que ela quer"],
    ["🎭 Pratique manter neutralidade numa conversa com interesses divergentes","Qual conversa · Como você manteve a neutralidade"],
    ["💭 Anote 1 conflito familiar que você percebeu num atendimento","O conflito · Como ele afeta o caso"],
    ["💭 Você conseguiu não tomar partido essa semana?","Sim ou não · O momento em que foi mais difícil"]]],
  [12,"S12","Diagnóstico avançado + checkpoint",[
    ["🧪 Preencha o Mapa do Caso avançado pra 1 situação complexa real","Qual situação · O que o Mapa avançado mostrou que o rápido não mostrava"],
    ["🧪 Registre sua 3ª marcação no Checklist de Evidências","Seu total nesta marcação · O indicador que mais subiu"],
    ["✍️ Compare seu diagnóstico de hoje com o da S1","Como era seu diagnóstico na S1 · Como está hoje"],
    ["💭 Escreva 1 aprendizado da sub-fase de aprofundamento emocional","O aprendizado, em poucas linhas"],
    ["🎧 Ouça algo leve e descanse antes de entrar na sub-fase de comunicação","O que ouviu · Com que energia você entra na próxima sub-fase"]]],
  [13,"S13","Comunicação de valor avançada",[
    ["🧪 Use a Leitura do Produtor pra adaptar a comunicação a 1 perfil difícil","O perfil · O que você adaptou na comunicação"],
    ["🪞 Pratique comunicar 1 risco real sem soar alarmista, no espelho","O risco · A frase que você usou pra comunicar"],
    ["✍️ Traduza um caso técnico complexo pra linguagem simples","Qual caso · A versão em linguagem simples"],
    ["🎯 Atualize seu modelo de comunicação com 1 caso real recente","Qual caso · O que mudou no seu modelo"],
    ["👥 Peça feedback sobre como você comunicou algo difícil essa semana","Quem deu o feedback · O que a pessoa disse"]]],
  [14,"S14","Simulação integral",[
    ["🎭 Simule mentalmente 1 atendimento complexo do início ao fim","Qual atendimento · Os pontos-chave do início ao fim"],
    ["✍️ Monte seu banco de perguntas de escuta com 3 perguntas novas","1) …  2) …  3) … — suas 3 perguntas novas de escuta"],
    ["🎯 Aplique o Roteiro de Condução completo num caso real","Qual caso · A etapa mais fácil · A etapa mais difícil"],
    ["💭 Revise onde você travou na simulação e por quê","Onde travou · Por quê"],
    ["✍️ Refine seu roteiro de escuta com o que aprendeu","O que entrou e o que saiu do seu roteiro de escuta"]]],
  [15,"S15","Objeções complexas e conversas difíceis",[
    ["🎭 Use o Simulador de Conversas numa objeção mais difícil","A objeção · A resposta que funcionou"],
    ["🎯 Pratique manter a condução sob pressão real de um caso","Qual caso · Como você manteve a condução"],
    ["💭 Identifique 1 momento em que precisou encaminhar pra outro profissional","Qual caso · Pra quem encaminhou (ou encaminharia) e por quê"],
    ["✍️ Monte um plano de mediação pra 1 caso com conflito real","Qual caso · Os passos do seu plano de mediação"],
    ["💭 Você manteve a condução mesmo sob pressão essa semana?","Sim ou não · O momento mais difícil"]]],
  [16,"S16","Do impasse ao próximo passo + checkpoint",[
    ["🎭 Use o Simulador de Conversas revisitado numa objeção real recente","A objeção real · Como você responde a ela hoje"],
    ["🧪 Registre sua 4ª marcação no Checklist de Evidências","Seu total nesta marcação · O indicador que mais subiu"],
    ["🎯 Formalize responsabilidades e próximo passo de 1 caso real","Qual caso · Quem faz o quê · Próximo passo e data"],
    ["✍️ Compare sua condução de objeções hoje com a da S6","Como você conduzia objeções na S6 · Como conduz hoje"],
    ["👥 Celebre a evolução da sub-fase com alguém de confiança","Com quem celebrou · O que vocês celebraram"]]],
  [17,"S17","Território de Autoridade",[
    ["✍️ Revise sua identidade profissional definida na S7","Sua identidade da S7 · O que você mudaria nela hoje"],
    ["🪞 Observe sua postura e voz no espelho antes de 1 atendimento real","O que você notou na sua postura e na sua voz"],
    ["✍️ Liste 3 provas concretas da sua autoridade acumuladas até agora","1) …  2) …  3) … — provas concretas da sua autoridade"],
    ["🎯 Ajuste 1 detalhe de presença (tom, postura) num atendimento","O detalhe que ajustou · Que diferença fez"],
    ["💭 Você parece mais condutora hoje do que na S7?","Sim ou não · O que mostra isso"]]],
  [18,"S18","Mapa de Posicionamento + Comunicação",[
    ["🧪 Duplique a aba do Mapa de Posicionamento e comece a revisão","Duplicou? · O primeiro ponto que você quer revisar"],
    ["✍️ Atualize \"Eu resolvo\" com evidência de um caso real recente","Sua nova linha \"Eu resolvo\" · O caso que comprova"],
    ["✍️ Atualize \"Qual valor entrego\" com um resultado mensurável","Sua nova linha \"Qual valor entrego\" · O resultado mensurável"],
    ["💭 Compare a versão S7 com a versão S18 lado a lado","As principais diferenças entre a versão S7 e a S18"],
    ["👥 Compartilhe com alguém o que mudou na sua percepção de valor","Com quem · O que mudou na sua percepção de valor"]]],
  [19,"S19","Precificação avançada",[
    ["🎯 Reformule 1 proposta comercial de maior complexidade","Qual proposta · O que mudou nela"],
    ["🪞 Pratique sustentar um preço mais alto sem se justificar, no espelho","O preço que treinou · Como se sentiu dizendo sem se justificar"],
    ["🧪 Adicione 1 linha nova ao Mapa de Valor Percebido","A tarefa · O valor percebido"],
    ["🎭 Negocie 1 condição de pagamento sem baixar o valor do serviço","Qual negociação · A condição que ofereceu · O valor que manteve"],
    ["💭 Você cobrou mais essa semana do que cobraria há 6 meses?","Sim ou não · Quanto cobra hoje · Quanto cobraria há 6 meses"]]],
  [20,"S20","Limites e posicionamento + checkpoint",[
    ["✍️ Revise seus limites de disponibilidade e prazo de resposta","Seus limites de disponibilidade · Seu prazo de resposta"],
    ["🎯 Diga não a 1 pedido fora do seu escopo essa semana","O pedido · Como você disse não · Como a pessoa reagiu"],
    ["✍️ Atualize o plano de posicionamento 30/60/90 com o que já alcançou","O que já alcançou nos 30 · 60 · 90 dias"],
    ["🧪 Registre sua 5ª marcação no Checklist de Evidências","Seu total nesta marcação · O indicador que mais subiu"],
    ["🎧 Celebre a evolução da sub-fase — ouça algo que te inspire","O que ouviu · O que você celebra nessa sub-fase"]]],
  [21,"S21","Revisão da jornada completa",[
    ["✍️ Releia seu diagnóstico da S1 e compare com quem você é hoje","Quem você era na S1 · Quem você é hoje"],
    ["✍️ Escreva 3 mudanças concretas de postura desde o início","1) …  2) …  3) … — mudanças de postura"],
    ["✍️ Escreva 3 mudanças de comunicação desde o início","1) …  2) …  3) … — mudanças de comunicação"],
    ["✍️ Escreva 3 mudanças de condução/negociação desde o início","1) …  2) …  3) … — mudanças de condução/negociação"],
    ["🎯 Monte seu relatório de evolução antes x depois","Os principais pontos do seu relatório antes x depois"]]],
  [22,"S22","Aplicação em caso real final",[
    ["🎯 Escolha o caso mais complexo do ano pra aplicar o método completo","O caso escolhido · Por que ele é o mais complexo"],
    ["🎯 Use o Destrava Condução (2º uso) se precisar de apoio nesse caso","Usou? · Em que ponto do caso"],
    ["🎭 Aplique diagnóstico → escuta → tradução → solução → proposta","O que fez em cada etapa: diagnóstico · escuta · tradução · solução · proposta"],
    ["✍️ Registre como você conduziu as objeções desse caso final","As objeções que apareceram · Como conduziu cada uma"],
    ["✍️ Escreva o relatório de aplicação do caso real final","Os principais pontos do relatório do caso final"]]],
  [23,"S23","Construção do Protocolo Pessoal",[
    ["✍️ Escreva sua versão de \"Abrir\" no seu Protocolo Pessoal","Rascunho da sua versão de \"Abrir\""],
    ["✍️ Escreva sua versão de \"Ouvir, Investigar, Diagnosticar\"","Rascunho da sua versão de \"Ouvir · Investigar · Diagnosticar\""],
    ["✍️ Escreva sua versão de \"Orientar, Propor, Negociar\"","Rascunho da sua versão de \"Orientar · Propor · Negociar\""],
    ["✍️ Escreva sua versão de \"Decidir, Conduzir, Acompanhar\"","Rascunho da sua versão de \"Decidir · Conduzir · Acompanhar\""],
    ["🪞 Releia o protocolo em voz alta, pro espelho, e ajuste o que não soa como você","O que ajustou depois de ler em voz alta"]]],
  [24,"S24","Indicadores finais + continuidade",[
    ["🧪 Finalize o Checklist de Evidências com a 6ª e última marcação","Seu total final · Quanto subiu desde a S1"],
    ["✍️ Escreva seus indicadores de evolução mais importantes","Seus indicadores de evolução mais importantes"],
    ["🎯 Monte seu plano de continuidade pros próximos 3 meses","O que você vai fazer no mês 1 · mês 2 · mês 3"],
    ["👥 Grave (ou escreva) seu depoimento sobre a jornada","Gravou ou escreveu? · Se escreveu, cole aqui"],
    ["🎧 Celebre — você chegou ao fim dos 12 meses, ouça algo especial","O que ouviu · Uma frase pra você sobre esses 12 meses"]]]
];

// 2ª semana de cada quinzena, na ordem das sessões: [[atividade, o que anotar] × 5]
var SEGUNDA_SEMANA = [
  // S1
  [["✍️ Liste as tarefas da sua semana e marque quais foram de executora e quais foram de condutora","Suas tarefas da semana · Executora (E) ou condutora (C) em cada uma"],
   ["🎯 Em 1 atendimento, antes de responder a pergunta técnica, pergunte ao produtor qual é o objetivo dele com aquilo","Qual atendimento · O objetivo que o produtor contou"],
   ["🪞 Diga em voz alta, pro espelho, como você se apresenta hoje e depois como quer se apresentar daqui a 12 meses","Sua apresentação de hoje · A de daqui a 12 meses"],
   ["💭 Releia suas anotações da semana passada: qual momento de insegurança se repetiu?","O momento que se repetiu · O que ele tem em comum com os outros"],
   ["🧪 De 0 a 10, quanto do seu trabalho hoje é execução e quanto é condução?","Execução: __/10 · Condução: __/10 · Por que deu esse número"]],
  // S2
  [["🎯 Faça hoje a 1ª ação da prioridade nº 1 do seu Plano Personalizado","A ação · O que aconteceu"],
   ["💭 Releia a barreira previsível do seu Plano Personalizado: ela já apareceu? Como você respondeu?","A barreira · Apareceu? · Como você respondeu"],
   ["👥 Conte pra alguém da sua casa a meta dos próximos meses e combine como essa pessoa pode te apoiar","Com quem falou · O apoio que vocês combinaram"],
   ["🎯 Reserve na agenda os 15 min da trilha nos 5 dias da próxima semana, sempre no mesmo horário","Os dias e o horário reservados"],
   ["🧪 Pegue o pilar com a nota mais baixa da sua autoavaliação e escreva 1 atitude pra subir 1 ponto","O pilar · A nota · A atitude"]],
  // S3
  [["✍️ Escreva o pior cenário de 1 situação que te dá medo no trabalho e o que você faria se ele acontecesse","A situação · O pior cenário · O que você faria"],
   ["🎯 Num caso com cobrança do produtor, mostre a ele 1 coisa que não depende de você (banco, cartório, órgão) e qual é o seu próximo passo","Qual caso · O que estava fora do seu controle · O próximo passo que você comunicou"],
   ["🪞 Antes de uma ligação difícil, ensaie no espelho a primeira frase com voz firme","A ligação · A primeira frase · Como ela saiu na hora"],
   ["💭 Qual medo apareceu mais nessa quinzena? Ele virou realidade?","O medo · Virou realidade? Sim ou não · O que aconteceu de fato"],
   ["👥 Pergunte a alguém de confiança em que situação ela te vê mais segura no trabalho","Quem · O que a pessoa disse"]],
  // S4
  [["🧪 Use a Leitura do Produtor em 2 clientes diferentes e compare os perfis","Cliente 1 e o perfil · Cliente 2 e o perfil · O que muda na abordagem"],
   ["🎯 Abra 1 conversa com a frase de abertura sugerida pro perfil desse produtor","Qual produtor e perfil · A frase que usou · Como ele reagiu"],
   ["✍️ Preencha a Parte 2 do Mapa do Caso (Plano de Condução) pro caso que você mapeou na semana passada","Qual caso · O próximo passo definido"],
   ["🎭 Antes de 1 atendimento, ensaie as 3 perguntas que vai fazer pra entender a demanda real","As 3 perguntas · Qual delas revelou mais"],
   ["💭 Qual erro comum de algum perfil de produtor você já cometeu sem perceber?","O perfil · O erro · O que você faria diferente"]],
  // S5
  [["🎯 Consulte o Roteiro de Condução antes de 1 conversa e faça a etapa de escuta sem pular","Qual conversa · O que você ouviu que antes não teria ouvido"],
   ["🎯 Num atendimento, explique o risco que o produtor evita com o seu serviço antes de falar de prazo ou preço","Qual atendimento · O risco que você explicou · Como o produtor reagiu"],
   ["✍️ Reescreva 1 mensagem de WhatsApp que você sempre manda, trocando o termo técnico pela explicação simples","A mensagem antiga · A mensagem nova"],
   ["🎭 Grave um áudio explicando 1 serviço seu em até 1 minuto, ouça e regrave cortando o que for técnico demais","O serviço · O que você cortou na 2ª versão"],
   ["💭 Em qual conversa da quinzena você falou mais do que ouviu?","Qual conversa · O que você deixou de perguntar"]],
  // S6
  [["🎭 Volte ao Simulador de Conversas e treine uma objeção diferente da semana passada","A objeção · A resposta que funcionou melhor"],
   ["✍️ Liste as 3 objeções que você mais ouve e escreva sua resposta pra cada uma","1) objeção → resposta  2) …  3) …"],
   ["🎯 Use sua resposta pronta pro \"vou pensar\" numa conversa real","Qual cliente · O que ele respondeu"],
   ["🪞 Diga o valor de 1 serviço seu em voz alta, no espelho, sem desconto nem justificativa, 5 vezes seguidas","O valor · Em qual repetição saiu firme"],
   ["👥 Pergunte a um colega qual objeção ele mais ouve e como responde. Compare com a sua","Quem · A objeção e a resposta dele · O que você aproveitaria"]],
  // S7
  [["✍️ Complete o Mapa de Posicionamento: Eu resolvo, Para quem, Como faço e Qual valor entrego","As 4 linhas preenchidas (pode ser rascunho)"],
   ["🎯 Atualize a apresentação do seu WhatsApp ou Instagram com a frase do Mapa de Posicionamento","Apresentação antiga · Apresentação nova"],
   ["🧪 Preencha o Mapa de Valor Percebido pra mais 1 serviço seu","O serviço · O valor que o produtor percebe nele"],
   ["🪞 Apresente sua proposta reformulada em voz alta, pro espelho, como se fosse pro produtor","O trecho em que travou · Como ajustou"],
   ["💭 Como o cliente reagiu à proposta nova? Algo precisa mudar no modelo?","A reação · O ajuste no modelo"]],
  // S8
  [["🎯 Aplique o método completo em mais 1 atendimento, num tipo de serviço diferente do da semana passada","Qual atendimento e serviço · O que funcionou · Onde travou"],
   ["✍️ Anote os números da Etapa 1: quantas propostas enviou, quantas fechou e se cobrou mais","Propostas enviadas · Fechadas · Cobrou mais? Quanto"],
   ["💭 Qual ferramenta da Etapa 1 você mais usou e qual deixou de lado? Por quê?","Mais usada · Deixada de lado · Por quê"],
   ["🎯 Escolha 1 hábito da Etapa 1 pra manter toda semana daqui pra frente","O hábito · Em que dia e horário"],
   ["🪞 Diga em voz alta, pro espelho, o que você conquistou na Etapa 1","A frase que você disse"]],
  // S9
  [["🧪 Registre 1 trava no Mapa Pessoal de Padrões: situação, efeito comercial e como você respondeu","A trava · A situação · O efeito comercial"],
   ["💭 De onde vem a crença que você identificou na semana passada? Quem te ensinou isso?","A crença · De onde ela vem"],
   ["✍️ Escreva o que você faria nos seus atendimentos se essa trava não existisse","O que faria diferente"],
   ["🎯 Faça hoje a tarefa que você vem adiando por causa da trava","A tarefa · Como foi fazer"],
   ["👥 Pergunte a alguém próximo se percebe essa trava em você, e em que situação","Quem · O que a pessoa percebeu"]],
  // S10
  [["💭 Releia 1 situação de pressão recente: o que você sentiu no corpo antes de reagir?","A situação · O que sentiu · Como reagiu"],
   ["✍️ Escreva o que o produtor teria perdido em 1 caso se você não tivesse feito o seu trabalho","O caso · O que ele teria perdido (prazo, dinheiro, documento)"],
   ["🎯 Numa conversa tensa, nomeie a emoção do produtor antes de responder (\"entendo que isso te preocupa\")","A conversa · A emoção que você nomeou · O que mudou depois"],
   ["💭 Em que situação você ainda diminui o valor do que faz (\"é só um papel\", \"é rapidinho\")?","A situação · A frase que você usa"],
   ["👥 Peça a 1 cliente satisfeito que conte o que mudou pra ele depois do seu trabalho","Quem · O que ele contou"]],
  // S11
  [["🧪 Leia o Roteiro de Mediação de Conflitos e marque a situação difícil que mais se parece com um caso seu","A situação do roteiro · O caso parecido"],
   ["💭 Num caso com várias pessoas, quem decide de fato e quem só influencia?","Qual caso · Quem decide · Quem influencia"],
   ["🎭 Ensaie a abertura de uma reunião com mais de 1 envolvido, usando o Roteiro de Mediação","A abertura ensaiada"],
   ["✍️ Escreva os limites da sua atuação num caso com conflito familiar: o que é seu e o que é de advogado ou outro profissional","Qual caso · O que é seu · O que não é"],
   ["💭 Que interesse escondido apareceu num caso nessa quinzena?","O caso · O interesse escondido"]],
  // S12
  [["✍️ Preencha a Parte 2 (Plano de Condução) do Mapa do Caso avançado que você fez na semana passada","Qual caso · O próximo passo e quem faz"],
   ["💭 Releia seu Mapa Pessoal de Padrões: qual trava apareceu menos nessa sub-fase?","A trava · Por que você acha que diminuiu"],
   ["🎯 Use o Círculo de Controle num caso complexo em andamento","Qual caso · O que estava no seu controle · O que não estava"],
   ["🪞 Diga em voz alta, pro espelho, como você reage hoje a uma pressão que antes te travava","A pressão · Como você reage hoje"],
   ["👥 Conte pra alguém de confiança 1 mudança emocional que você percebeu em si","Quem · A mudança"]],
  // S13
  [["🧪 Registre no Banco de Comunicação 2 argumentos de valor que funcionaram em casos reais","Argumento 1 · Argumento 2 · Em qual caso cada um funcionou"],
   ["🎯 Comunique 1 risco real a um produtor usando a frase que você treinou no espelho","Qual produtor · A frase · Como ele reagiu"],
   ["✍️ Reescreva 1 explicação sua pra 2 perfis diferentes de produtor","Os 2 perfis · O que muda em cada versão"],
   ["💭 Em qual conversa da quinzena o produtor entendeu de primeira? O que você fez diferente?","A conversa · O que fez diferente"],
   ["🎭 Explique 1 caso complexo em até 2 minutos pra alguém de fora do agro","Pra quem · Onde a pessoa se perdeu"]],
  // S14
  [["🎯 Use 1 pergunta nova do seu banco de escuta num atendimento real","A pergunta · O que o produtor revelou"],
   ["🎭 Simule em voz alta o fechamento de um atendimento complexo: proposta, objeção e próximo passo","Qual caso · Onde a simulação travou"],
   ["💭 Compare 1 atendimento de hoje com 1 do começo do programa: o que mudou no seu jeito de conduzir?","O que mudou"],
   ["👥 Peça a alguém que faça o papel do produtor e simule 1 atendimento completo com você","Quem · O que a pessoa achou"],
   ["✍️ Escreva o passo do Roteiro de Condução que você mais pula, e por quê","O passo · Por que você pula"]],
  // S15
  [["🎭 Treine no Simulador de Conversas uma situação de Conflito Familiar","A situação · A resposta que funcionou"],
   ["✍️ Escreva o que você diria a um produtor que culpa você por um atraso do banco ou do cartório","A fala que você usaria"],
   ["💭 Qual conversa difícil você evitou nessa quinzena? O que te fez evitar?","A conversa · O que te fez evitar"],
   ["🎯 Tenha hoje a conversa difícil que você estava evitando","A conversa · Como foi"],
   ["🪞 Treine no espelho como dizer \"isso não é comigo, mas te indico quem resolve\"","Como você disse · Como soou"]],
  // S16
  [["💭 Em qual caso a conversa travou sem próximo passo? O que faltou?","Qual caso · O que faltou"],
   ["🎯 Mande hoje uma mensagem de próximo passo pra 1 caso parado","Qual caso · O que mandou · O que responderam"],
   ["🧪 Atualize na Central de Condução o próximo checkpoint de todos os casos em andamento","Quantos casos atualizou · Qual estava mais atrasado"],
   ["🪞 Treine no espelho como encerrar uma conversa com data e responsável definidos","A frase de encerramento"],
   ["💭 Qual objeção ainda te tira do eixo? O que falta pra ela deixar de tirar?","A objeção · O que falta"]],
  // S17
  [["👥 Pergunte a 2 clientes por que eles te escolheram","Cliente 1 e o motivo · Cliente 2 e o motivo"],
   ["✍️ Escreva como você quer ser lembrada pelos produtores da sua região","A frase"],
   ["🎯 Num atendimento, recomende com firmeza o caminho que você acredita ser o certo, em vez de listar opções","Qual atendimento · O que recomendou · Como o produtor recebeu"],
   ["💭 Que situação ainda te faz agir como executora em vez de condutora?","A situação · Por quê"],
   ["🪞 Grave um vídeo curto se apresentando e assista: você passa autoridade?","O que passou bem · O que ajustaria"]],
  // S18
  [["✍️ Revise \"Para quem\" e \"Como faço\" na cópia nova do Mapa de Posicionamento","Nova linha \"Para quem\" · Nova linha \"Como faço\""],
   ["🎯 Use a nova frase de \"Qual valor entrego\" numa conversa real","A conversa · Como o produtor reagiu"],
   ["🎯 Atualize sua apresentação (WhatsApp, Instagram, mensagem de boas-vindas) com o posicionamento revisado","O que você atualizou"],
   ["💭 Que tipo de cliente você não quer mais atender? Por quê?","O tipo de cliente · Por quê"],
   ["🧪 Leia o Mapa revisado em voz alta: soa como você ou como um texto bonito?","O trecho que não soa como você · O ajuste"]],
  // S19
  [["✍️ Calcule quanto tempo leva 1 serviço seu do início ao fim e compare com o que você cobra","O serviço · Horas gastas · Valor cobrado · Quanto dá por hora"],
   ["🎯 Envie a proposta reformulada de maior complexidade pro cliente","Pra quem · Como reagiu"],
   ["🎭 Ensaie a resposta pra \"tá caro\" num caso de valor alto","A resposta"],
   ["💭 Qual serviço seu está mais barato do que deveria? O que te impede de ajustar?","O serviço · O que te impede"],
   ["👥 Pergunte a um colega quanto ele cobra por um serviço parecido com o seu","Quem · O valor · Como fica o seu em comparação"]],
  // S20
  [["🎯 Avise 1 cliente do seu horário de atendimento e do seu prazo de resposta","Qual cliente · Como ele reagiu"],
   ["💭 Qual pedido fora do escopo você ainda aceita por medo de perder o cliente?","O pedido · O medo"],
   ["✍️ Escreva a frase que você vai usar pra cobrar um serviço extra que antes fazia de graça","O serviço extra · A frase"],
   ["🪞 Treine no espelho como dizer não sem pedir desculpas","A frase · Como soou"],
   ["👥 Conte pra alguém da sua casa os limites de horário que você definiu e peça ajuda pra manter","Com quem · O combinado"]],
  // S21
  [["💭 Qual foi o momento mais difícil desses meses e o que te fez continuar?","O momento · O que te fez continuar"],
   ["✍️ Escreva o que você diria pra você mesma no primeiro dia do programa","O recado pra você do primeiro dia"],
   ["👥 Pergunte a alguém próximo que mudança percebeu em você desde o começo","Quem · O que a pessoa percebeu"],
   ["🧪 Dê de novo uma nota de 1 a 5 pros 6 pilares e compare com a nota que você deu na S2","Nota de hoje em cada pilar · Quanto subiu desde a S2"],
   ["🪞 Leia em voz alta, pro espelho, o seu relatório antes x depois","O trecho que mais te marcou"]],
  // S22
  [["🧪 Atualize o Mapa do Caso do caso final com o registro de como ele terminou","Qual caso · Como terminou"],
   ["🎯 Feche o caso final com responsabilidades e próximo passo por escrito","Quem faz o quê · Próximo passo e data"],
   ["💭 Qual foi o momento mais difícil do caso final e como você conduziu?","O momento · Como conduziu"],
   ["👥 Peça ao produtor do caso final um retorno sobre como foi ser atendido por você","O que o produtor disse"],
   ["✍️ Compare esse caso com o primeiro caso que você mapeou na S4","O que mudou na sua condução"]],
  // S23
  [["🎯 Use seu Protocolo Pessoal num atendimento real, do Abrir ao Acompanhar","Qual atendimento · O passo que funcionou melhor"],
   ["✍️ Ajuste o passo do protocolo que não funcionou no atendimento","O passo · Como ficou depois do ajuste"],
   ["💭 Qual passo do protocolo é mais seu, que ninguém te ensinou?","O passo · Por que ele é seu"],
   ["👥 Mostre seu protocolo a alguém de confiança e peça 1 sugestão","Quem · A sugestão"],
   ["🧪 Releia seu protocolo e marque o passo em que você ainda se sente mais fraca","O passo · O que você vai treinar nele"]],
  // S24
  [["🎯 Marque na agenda as datas de revisão do seu plano de continuidade","As datas marcadas"],
   ["💭 Qual foi a maior virada desses 12 meses?","A virada · Quando ela aconteceu"],
   ["✍️ Escreva uma carta pra você ler daqui a 1 ano","Escreveu? · Onde guardou"],
   ["👥 Agradeça a quem te apoiou durante o programa e conte o que mudou","A quem agradeceu · O que contou"],
   ["🪞 Diga em voz alta, pro espelho, quem você é como profissional hoje","A frase que você disse"]]
];

// Abre cada sessão em 2 semanas: [nº da semana, sessão, tema, atividades, nº da sessão, 1ª ou 2ª semana]
function semanasDoAno_() {
  var lista = [];
  SEMANAS.forEach(function(w, i){
    lista.push([2 * w[0] - 1, w[1], w[2], w[3], w[0], 1]);
    lista.push([2 * w[0], w[1], w[2], SEGUNDA_SEMANA[i], w[0], 2]);
  });
  return lista;
}

function criarDiarioAplicacao() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var total = semanasDoAno_().length * 5;
  criarAbaAtividades_(ss, total);
  criarAbaDiaADia_(ss);
  removerAbaPadraoVazia_(ss);
  ss.setActiveSheet(ss.getSheetByName("Atividades"));
}

function criarAbaAtividades_(ss, total) {
  var nome = "Atividades";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome, 0);

  sh.setColumnWidth(1, 60);
  sh.setColumnWidth(2, 60);
  sh.setColumnWidth(3, 60);
  sh.setColumnWidth(4, 230);
  sh.setColumnWidth(5, 60);
  sh.setColumnWidth(6, 520);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:F1").merge().setValue("PLANO DE APLICAÇÃO DIÁRIA — CONDUZ AGRO")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(14)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  sh.setRowHeight(1, 34);

  sh.getRange("A2:F2").merge().setValue("15 minutos, 5 dias por semana. Cada sessão abre 2 semanas de atividades sobre o tema dela: comece a semana só depois da sessão indicada. Fez a atividade? Marca o quadradinho. O que você descobriu nela vai na aba \"Dia a dia\".")
    .setBackground(COR_GOLD_TINT).setFontColor(COR_INK_SOFT).setFontStyle("italic").setFontSize(9.5)
    .setHorizontalAlignment("center").setVerticalAlignment("middle").setWrap(true);
  sh.setRowHeight(2, 36);

  var primeira = 5, ultima = primeira + total - 1;
  // Sem vírgula/ponto-e-vírgula de propósito: planilha em pt-BR dá erro de
  // análise com separador em inglês — SUMPRODUCT de 1 argumento funciona em qualquer localidade
  var faixa = 'A' + primeira + ':A' + ultima;
  sh.getRange("A3:F3").merge()
    .setFormula('=SUMPRODUCT(' + faixa + '*1)&" de ' + total + ' atividades feitas  ·  "&INT(SUMPRODUCT(' + faixa + '*1)*100/' + total + ')&"%"')
    .setBackground(COR_PAPER).setFontColor(COR_OLIVE_DEEP).setFontWeight("bold").setFontSize(11)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  sh.setRowHeight(3, 28);

  sh.getRange("A4:F4").setValues([["Feito", "Sem.", "Depois da", "Tema da quinzena", "Dia", "Atividade (15 min)"]])
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  sh.getRange("D4").setHorizontalAlignment("left");
  sh.getRange("F4").setHorizontalAlignment("left");
  sh.setRowHeight(4, 26);

  var semanas = semanasDoAno_();
  var linhas = [];
  semanas.forEach(function(w){
    for (var d = 0; d < 5; d++) linhas.push([false, w[0], w[1], w[2], "Dia " + (d + 1), w[3][d][0]]);
  });
  var corpo = sh.getRange(primeira, 1, total, 6);
  corpo.setValues(linhas)
    .setFontColor(COR_INK).setFontSize(10).setVerticalAlignment("middle").setWrap(true)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(primeira, 1, total, 1).insertCheckboxes().setHorizontalAlignment("center");
  sh.getRange(primeira, 2, total, 1).setHorizontalAlignment("center").setFontColor(COR_INK_SOFT);
  sh.getRange(primeira, 3, total, 1).setHorizontalAlignment("center").setFontWeight("bold").setFontColor(COR_GOLD);
  sh.getRange(primeira, 4, total, 1).setFontWeight("bold");
  sh.getRange(primeira, 5, total, 1).setHorizontalAlignment("center").setFontColor(COR_INK_SOFT);

  // Fundo por etapa + linha grossa separando as semanas
  for (var i = 0; i < semanas.length; i++) {
    var r = primeira + i * 5;
    sh.getRange(r, 1, 5, 6).setBackground(semanas[i][4] >= 9 ? COR_OLIVE_TINT : COR_WHITE);
    sh.getRange(r, 1, 1, 6).setBorder(true, null, null, null, null, null, COR_OLIVE, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  }
  sh.setRowHeightsForced(primeira, total, 34);

  // Linha marcada fica riscada e apagada
  var regra = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied("=$A" + primeira + "=TRUE")
    .setStrikethrough(true).setFontColor("#A39A88").setBackground(COR_PAPER_DEEP)
    .setRanges([sh.getRange(primeira, 2, total, 5)])
    .build();
  sh.setConditionalFormatRules([regra]);

  sh.setFrozenRows(4);
}

function criarAbaDiaADia_(ss) {
  var nome = "Dia a dia";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome, 1);

  sh.setColumnWidth(1, 60);
  sh.setColumnWidth(2, 95);
  sh.setColumnWidth(3, 300);
  sh.setColumnWidth(4, 240);
  sh.setColumnWidth(5, 460);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:E1").merge().setValue("DIA A DIA — O QUE EU FIZ E O QUE EU DESCOBRI")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(14)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  sh.setRowHeight(1, 34);

  sh.getRange("A2:E2").merge().setValue("Coloque a data do dia em que fez a atividade e escreva na última coluna. A coluna \"O que anotar\" mostra o que registrar: tem atividade que pede uma lista de 3, outra pede uma frase, outra pede o antes e o depois. Não precisa de texto bonito, o que importa é ficar registrado.")
    .setBackground(COR_GOLD_TINT).setFontColor(COR_INK_SOFT).setFontStyle("italic").setFontSize(9.5)
    .setHorizontalAlignment("center").setVerticalAlignment("middle").setWrap(true);
  sh.setRowHeight(2, 48);

  sh.getRange("A3:E3").setValues([["Dia", "Data", "Atividade", "O que anotar", "Minha anotação"]])
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10)
    .setHorizontalAlignment("left").setVerticalAlignment("middle");
  sh.getRange("A3:B3").setHorizontalAlignment("center");
  sh.setRowHeight(3, 26);

  var row = 4;
  semanasDoAno_().forEach(function(w){
    var isEtapa2 = w[4] >= 9;
    sh.getRange(row, 1, 1, 5).merge()
      .setValue("SEMANA " + w[0] + "  ·  depois da " + w[1] + " (" + w[5] + "ª semana)  ·  " + w[2] + (isEtapa2 ? "   (Etapa 2)" : "   (Etapa 1)"))
      .setBackground(isEtapa2 ? COR_OLIVE : COR_GOLD).setFontColor(COR_PAPER)
      .setFontWeight("bold").setFontSize(10.5).setVerticalAlignment("middle");
    sh.setRowHeight(row, 26);
    row++;

    var linhas = [];
    for (var d = 0; d < 5; d++) linhas.push(["Dia " + (d + 1), "", w[3][d][0], w[3][d][1], ""]);
    var bloco = sh.getRange(row, 1, 5, 5);
    bloco.setValues(linhas)
      .setFontSize(10).setVerticalAlignment("top").setWrap(true)
      .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID);
    sh.getRange(row, 1, 5, 1).setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setHorizontalAlignment("center");
    sh.getRange(row, 2, 5, 1).setBackground(COR_WHITE).setHorizontalAlignment("center")
      .setNumberFormat("dd/mm/yyyy")
      .setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false)
        .setHelpText("Digite a data no formato dd/mm/aaaa").build());
    sh.getRange(row, 3, 5, 1).setBackground(COR_PAPER).setFontColor(COR_INK);
    sh.getRange(row, 4, 5, 1).setBackground(COR_PAPER).setFontColor(COR_GOLD).setFontStyle("italic");
    sh.getRange(row, 5, 5, 1).setBackground(COR_WHITE).setFontColor(COR_INK);
    sh.setRowHeightsForced(row, 5, 90);
    row += 5;
  });

  sh.setFrozenRows(3);
}

// Planilha nova vem com "Página1"/"Sheet1" vazia — tira só se estiver em branco
function removerAbaPadraoVazia_(ss) {
  ["Página1", "Sheet1", "Planilha1"].forEach(function(n){
    var s = ss.getSheetByName(n);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
}
