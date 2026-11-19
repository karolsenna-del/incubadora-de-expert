/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) do
 * Plano de Aplicação Diária: 48 semanas, 5 atividades de 15 min cada.
 * As sessões são quinzenais, então cada sessão abre uma quinzena de 2
 * semanas que trabalha o tema dela: a semana 2N-1 e a 2N vêm DEPOIS da
 * sessão N (nunca antes — corrigido 18/11/2026: na versão de 24 semanas o
 * aluno chegava na atividade do Simulador, da S6, na semana 6, antes da S6
 * acontecer). Tom tático na Etapa 1 (S1-S8, semanas 1-16), reflexivo na
 * Etapa 2 (S9-S24, semanas 17-48).
 *
 * Cada atividade tem um TIPO de dinâmica (não é só "escreva sobre X"):
 * 🎧 Áudio de Mentalidade · ✍️ Escrita · 🪞 Treino no Espelho ·
 * 🎯 Desafio Rápido · 🧪 Teste/Autoavaliação · 👥 Avaliação com Terceiros ·
 * 🎭 Simulação · 💭 Reflexão — variedade pedida pela Karol em 24/08 pra dar
 * textura e efeito de gamificação à trilha.
 *
 * Conteúdo é RASCUNHO MEU, derivado dos objetivos já aprovados de cada
 * sessão em design-sessoes.md — precisa de validação da Milena antes de
 * distribuir aos alunos (mesma ressalva das outras ferramentas com fala).
 *
 * Formato fixo — não duplica, é a mesma trilha pra todo aluno.
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

function criarPlanoAplicacaoDiaria() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Plano de Aplicação Diária";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 50);
  sh.setColumnWidth(2, 90);
  sh.setColumnWidth(3, 190);
  for (var c = 4; c <= 8; c++) sh.setColumnWidth(c, 250);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:C1").merge().setValue("PLANO DE APLICAÇÃO DIÁRIA — 12 MESES")
    .setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.getRange("D1:H1").merge();
  sh.getRange("A1:H1").setBackground(COR_OLIVE_DEEP);
  sh.setRowHeight(1, 32);

  sh.getRange("A2:C2").merge().setValue("Conduz Agro — 5 atividades de 15 min por semana (não diário corrido). Cada sessão abre uma quinzena: as 2 semanas seguintes trabalham o tema dela. RASCUNHO — validar com a Milena antes de distribuir. Etapa 1 (S1-S8, semanas 1-16): tom tático, ação imediata. Etapa 2 (S9-S24, semanas 17-48): tom reflexivo, aprofundamento.")
    .setFontColor(COR_GOLD).setFontStyle("italic").setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.getRange("D2:H2").merge();
  sh.getRange("A2:H2").setBackground(COR_GOLD_TINT);
  sh.setRowHeight(2, 44);

  sh.getRange("A3:C3").merge().setValue("🎧 Áudio de Mentalidade   ✍️ Escrita   🪞 Treino no Espelho   🎯 Desafio Rápido   🧪 Teste/Autoavaliação   👥 Avaliação com Terceiros   🎭 Simulação   💭 Reflexão")
    .setFontColor(COR_INK_SOFT).setFontSize(8.5).setHorizontalAlignment("center").setWrap(true);
  sh.getRange("D3:H3").merge();
  sh.getRange("A3:H3").setBackground(COR_PAPER);
  sh.setRowHeight(3, 22);

  var headers = [["Sem.", "Depois da", "Tema da quinzena", "Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5"]];
  sh.getRange("A4:H4").setValues(headers)
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10)
    .setHorizontalAlignment("center");
  sh.getRange("C4").setHorizontalAlignment("left");
  sh.setRowHeight(4, 26);

  var semanas = [
    [1,"S1","Nomear seu papel atual",[
      "💭 Releia seu resultado do Diagnóstico e escreva 1 frase sobre sua trava principal",
      "🎯 Observe 1 atendimento real hoje e note se agiu como executor ou condutor",
      "✍️ Liste 3 momentos da semana em que se sentiu insegura",
      "🎭 Escolha 1 produtor real e ensaie mentalmente como nomearia seu papel nesse caso",
      "👥 Compartilhe com alguém de confiança 1 insight do diagnóstico e peça a opinião dela"]],
    [2,"S2","Rota Personalizada Conduz Agro",[
      "✍️ Releia seu plano de 12 meses e escreva a meta do mês 1 num post-it",
      "💭 Escreva o que \"condução\" significa pra você, com suas próprias palavras",
      "🧪 Autoavaliação rápida — marque de 1 a 5 cada um dos 6 pilares do método (técnica, comunicação, condução, negociação, posicionamento e segurança)",
      "🎯 Agende na agenda física os horários das próximas 4 sessões",
      "🎧 Ouça um áudio curto sobre autoridade e condução, anote 1 frase que ficou"]],
    [3,"S3","Segurança interna essencial",[
      "🎯 Aplique o Círculo de Controle numa situação de pressão real de hoje",
      "🪞 Antes de 1 atendimento, respire fundo 3x no espelho e repita em voz alta sua postura de condutora",
      "💭 Note 1 pensamento de insegurança e responda com 1 fato concreto",
      "🎯 Repita hoje 1 ação que só depende de você, do Círculo de Controle",
      "✍️ Revise a semana por escrito: em que momento você agiu apesar do medo?"]],
    [4,"S4","Leitura do produtor essencial",[
      "🎭 Em 1 atendimento, pergunte \"o que está por trás disso?\" antes de responder",
      "🧪 Use a Leitura do Produtor pra identificar o perfil de 1 cliente real",
      "✍️ Preencha o Mapa do Caso rápido pra 1 atendimento em andamento",
      "💭 Anote 1 risco que o produtor ainda não percebeu no caso dele",
      "👥 Pergunte a um colega como ele lê perfis de produtor — compare com o seu"]],
    [5,"S5","Comunicação de valor essencial",[
      "✍️ Antes de explicar algo técnico, escreva a versão \"simples\" primeiro",
      "🎯 Em 1 conversa, siga a ordem: abertura → escuta → diagnóstico → orientação",
      "🪞 Traduza 1 termo técnico em voz alta, pro espelho, como se explicasse pra um leigo",
      "🎭 Pratique 1 abertura de conversa em voz alta antes de ligar pra alguém",
      "👥 Peça feedback de alguém sobre como você explicou algo essa semana"]],
    [6,"S6","Condução de objeções essencial",[
      "🎭 Use o Simulador de Conversas pra treinar 1 objeção que te assusta",
      "🎯 Na próxima objeção de preço real, pergunte \"o que te preocupa nisso?\"",
      "✍️ Escreva 1 resposta pronta pra objeção de \"vou pensar\"",
      "🪞 Pratique ficar em silêncio 3 segundos depois de dizer o preço, no espelho",
      "💭 Revise: alguma objeção dessa semana era sobre outra coisa, não preço?"]],
    [7,"S7","Posicionamento e precificação essencial",[
      "✍️ Preencha 1 linha do Mapa de Posicionamento (Eu sou)",
      "🧪 Preencha o Mapa de Valor Percebido pra 1 tarefa técnica comum sua",
      "🎯 Reescreva sua proposta comercial padrão com a nova estrutura",
      "🎯 Envie a proposta reformulada pra 1 cliente real",
      "💭 Releia o que mudou entre a proposta antiga e a nova"]],
    [8,"S8","Aplicação real + checkpoint",[
      "🎭 Aplique o método completo (S1-S7) num atendimento real hoje",
      "🧪 Registre no Checklist de Evidências sua 2ª marcação",
      "✍️ Escreva o que já mudou desde a S1 até hoje",
      "👥 Conte pra alguém de confiança o resultado comercial concreto que você conseguiu",
      "🎧 Ouça algo inspirador e descanse — feche a Etapa 1 antes do aprofundamento"]],
    [9,"S9","Travas mais profundas",[
      "✍️ Escreva sobre 1 crença de não-merecimento que ainda aparece",
      "💭 Revise 1 caso da Etapa 1 e identifique o padrão de trava",
      "🎯 Note quando a procrastinação apareceu essa semana e por quê",
      "🪞 Diga em voz alta, pro espelho, 1 frase pra substituir a crença limitante identificada",
      "💭 Essa trava mudou desde a S1?"]],
    [10,"S10","IE aplicada + reconhecendo valor",[
      "✍️ Liste 3 casos recentes em que você evitou risco/perda pro produtor",
      "🎯 Pratique autorregulação: antes de reagir a pressão, conte até 5",
      "💭 Observe 1 momento de calma sob pressão essa semana",
      "🧪 Atualize sua lista de valor entregue com 1 caso novo",
      "🪞 Reconheça em voz alta, pro espelho, 1 coisa que você fez bem essa semana"]],
    [11,"S11","Leitura de cenário complexo",[
      "🎯 Em 1 caso real, mapeie todas as pessoas envolvidas na decisão",
      "✍️ Identifique documentos e interesses de cada parte de 1 caso",
      "🎭 Pratique manter neutralidade numa conversa com interesses divergentes",
      "💭 Anote 1 conflito familiar que você percebeu num atendimento",
      "💭 Você conseguiu não tomar partido essa semana?"]],
    [12,"S12","Diagnóstico avançado + checkpoint",[
      "🧪 Preencha o Mapa do Caso avançado pra 1 situação complexa real",
      "🧪 Registre sua 3ª marcação no Checklist de Evidências",
      "✍️ Compare seu diagnóstico de hoje com o da S1",
      "💭 Escreva 1 aprendizado da sub-fase de aprofundamento emocional",
      "🎧 Ouça algo leve e descanse antes de entrar na sub-fase de comunicação"]],
    [13,"S13","Comunicação de valor avançada",[
      "🧪 Use a Leitura do Produtor pra adaptar a comunicação a 1 perfil difícil",
      "🪞 Pratique comunicar 1 risco real sem soar alarmista, no espelho",
      "✍️ Traduza um caso técnico complexo pra linguagem simples",
      "🎯 Atualize seu modelo de comunicação com 1 caso real recente",
      "👥 Peça feedback sobre como você comunicou algo difícil essa semana"]],
    [14,"S14","Simulação integral",[
      "🎭 Simule mentalmente 1 atendimento complexo do início ao fim",
      "✍️ Monte seu banco de perguntas de escuta com 3 perguntas novas",
      "🎯 Aplique o Roteiro de Condução completo num caso real",
      "💭 Revise onde você travou na simulação e por quê",
      "✍️ Refine seu roteiro de escuta com o que aprendeu"]],
    [15,"S15","Objeções complexas e conversas difíceis",[
      "🎭 Use o Simulador de Conversas numa objeção mais difícil",
      "🎯 Pratique manter a condução sob pressão real de um caso",
      "💭 Identifique 1 momento em que precisou encaminhar pra outro profissional",
      "✍️ Monte um plano de mediação pra 1 caso com conflito real",
      "💭 Você manteve a condução mesmo sob pressão essa semana?"]],
    [16,"S16","Do impasse ao próximo passo + checkpoint",[
      "🎭 Use o Simulador de Conversas revisitado numa objeção real recente",
      "🧪 Registre sua 4ª marcação no Checklist de Evidências",
      "🎯 Formalize responsabilidades e próximo passo de 1 caso real",
      "✍️ Compare sua condução de objeções hoje com a da S6",
      "👥 Celebre a evolução da sub-fase com alguém de confiança"]],
    [17,"S17","Território de Autoridade",[
      "✍️ Revise sua identidade profissional definida na S7",
      "🪞 Observe sua postura e voz no espelho antes de 1 atendimento real",
      "✍️ Liste 3 provas concretas da sua autoridade acumuladas até agora",
      "🎯 Ajuste 1 detalhe de presença (tom, postura) num atendimento",
      "💭 Você parece mais condutora hoje do que na S7?"]],
    [18,"S18","Mapa de Posicionamento + Comunicação",[
      "🧪 Duplique a aba do Mapa de Posicionamento e comece a revisão",
      "✍️ Atualize \"Eu resolvo\" com evidência de um caso real recente",
      "✍️ Atualize \"Qual valor entrego\" com um resultado mensurável",
      "💭 Compare a versão S7 com a versão S18 lado a lado",
      "👥 Compartilhe com alguém o que mudou na sua percepção de valor"]],
    [19,"S19","Precificação avançada",[
      "🎯 Reformule 1 proposta comercial de maior complexidade",
      "🪞 Pratique sustentar um preço mais alto sem se justificar, no espelho",
      "🧪 Adicione 1 linha nova ao Mapa de Valor Percebido",
      "🎭 Negocie 1 condição de pagamento sem baixar o valor do serviço",
      "💭 Você cobrou mais essa semana do que cobraria há 6 meses?"]],
    [20,"S20","Limites e posicionamento + checkpoint",[
      "✍️ Revise seus limites de disponibilidade e prazo de resposta",
      "🎯 Diga não a 1 pedido fora do seu escopo essa semana",
      "✍️ Atualize o plano de posicionamento 30/60/90 com o que já alcançou",
      "🧪 Registre sua 5ª marcação no Checklist de Evidências",
      "🎧 Celebre a evolução da sub-fase — ouça algo que te inspire"]],
    [21,"S21","Revisão da jornada completa",[
      "✍️ Releia seu diagnóstico da S1 e compare com quem você é hoje",
      "✍️ Escreva 3 mudanças concretas de postura desde o início",
      "✍️ Escreva 3 mudanças de comunicação desde o início",
      "✍️ Escreva 3 mudanças de condução/negociação desde o início",
      "🎯 Monte seu relatório de evolução antes x depois"]],
    [22,"S22","Aplicação em caso real final",[
      "🎯 Escolha o caso mais complexo do ano pra aplicar o método completo",
      "🎯 Use o Destrava Condução (2º uso) se precisar de apoio nesse caso",
      "🎭 Aplique diagnóstico → escuta → tradução → solução → proposta",
      "✍️ Registre como você conduziu as objeções desse caso final",
      "✍️ Escreva o relatório de aplicação do caso real final"]],
    [23,"S23","Construção do Protocolo Pessoal",[
      "✍️ Escreva sua versão de \"Abrir\" no seu Protocolo Pessoal",
      "✍️ Escreva sua versão de \"Ouvir, Investigar, Diagnosticar\"",
      "✍️ Escreva sua versão de \"Orientar, Propor, Negociar\"",
      "✍️ Escreva sua versão de \"Decidir, Conduzir, Acompanhar\"",
      "🪞 Releia o protocolo em voz alta, pro espelho, e ajuste o que não soa como você"]],
    [24,"S24","Indicadores finais + continuidade",[
      "🧪 Finalize o Checklist de Evidências com a 6ª e última marcação",
      "✍️ Escreva seus indicadores de evolução mais importantes",
      "🎯 Monte seu plano de continuidade pros próximos 3 meses",
      "👥 Grave (ou escreva) seu depoimento sobre a jornada",
      "🎧 Celebre — você chegou ao fim dos 12 meses, ouça algo especial"]]
  ];

  // 2ª semana de cada quinzena (mesma ordem das sessões). Texto idêntico ao do
  // Diário de Aplicação (apps-script-diario-aplicacao.gs, SEGUNDA_SEMANA).
  var segundaSemana = [
    // S1
    ["✍️ Liste as tarefas da sua semana e marque quais foram de executora e quais foram de condutora",
     "🎯 Em 1 atendimento, antes de responder a pergunta técnica, pergunte ao produtor qual é o objetivo dele com aquilo",
     "🪞 Diga em voz alta, pro espelho, como você se apresenta hoje e depois como quer se apresentar daqui a 12 meses",
     "💭 Releia suas anotações da semana passada: qual momento de insegurança se repetiu?",
     "🧪 De 0 a 10, quanto do seu trabalho hoje é execução e quanto é condução?"],
    // S2
    ["🎯 Faça hoje a 1ª ação da prioridade nº 1 do seu Plano Personalizado",
     "💭 Releia a barreira previsível do seu Plano Personalizado: ela já apareceu? Como você respondeu?",
     "👥 Conte pra alguém da sua casa a meta dos próximos meses e combine como essa pessoa pode te apoiar",
     "🎯 Reserve na agenda os 15 min da trilha nos 5 dias da próxima semana, sempre no mesmo horário",
     "🧪 Pegue o pilar com a nota mais baixa da sua autoavaliação e escreva 1 atitude pra subir 1 ponto"],
    // S3
    ["✍️ Escreva o pior cenário de 1 situação que te dá medo no trabalho e o que você faria se ele acontecesse",
     "🎯 Num caso com cobrança do produtor, mostre a ele 1 coisa que não depende de você (banco, cartório, órgão) e qual é o seu próximo passo",
     "🪞 Antes de uma ligação difícil, ensaie no espelho a primeira frase com voz firme",
     "💭 Qual medo apareceu mais nessa quinzena? Ele virou realidade?",
     "👥 Pergunte a alguém de confiança em que situação ela te vê mais segura no trabalho"],
    // S4
    ["🧪 Use a Leitura do Produtor em 2 clientes diferentes e compare os perfis",
     "🎯 Abra 1 conversa com a frase de abertura sugerida pro perfil desse produtor",
     "✍️ Preencha a Parte 2 do Mapa do Caso (Plano de Condução) pro caso que você mapeou na semana passada",
     "🎭 Antes de 1 atendimento, ensaie as 3 perguntas que vai fazer pra entender a demanda real",
     "💭 Qual erro comum de algum perfil de produtor você já cometeu sem perceber?"],
    // S5
    ["🎯 Consulte o Roteiro de Condução antes de 1 conversa e faça a etapa de escuta sem pular",
     "🎯 Num atendimento, explique o risco que o produtor evita com o seu serviço antes de falar de prazo ou preço",
     "✍️ Reescreva 1 mensagem de WhatsApp que você sempre manda, trocando o termo técnico pela explicação simples",
     "🎭 Grave um áudio explicando 1 serviço seu em até 1 minuto, ouça e regrave cortando o que for técnico demais",
     "💭 Em qual conversa da quinzena você falou mais do que ouviu?"],
    // S6
    ["🎭 Volte ao Simulador de Conversas e treine uma objeção diferente da semana passada",
     "✍️ Liste as 3 objeções que você mais ouve e escreva sua resposta pra cada uma",
     "🎯 Use sua resposta pronta pro \"vou pensar\" numa conversa real",
     "🪞 Diga o valor de 1 serviço seu em voz alta, no espelho, sem desconto nem justificativa, 5 vezes seguidas",
     "👥 Pergunte a um colega qual objeção ele mais ouve e como responde. Compare com a sua"],
    // S7
    ["✍️ Complete o Mapa de Posicionamento: Eu resolvo, Para quem, Como faço e Qual valor entrego",
     "🎯 Atualize a apresentação do seu WhatsApp ou Instagram com a frase do Mapa de Posicionamento",
     "🧪 Preencha o Mapa de Valor Percebido pra mais 1 serviço seu",
     "🪞 Apresente sua proposta reformulada em voz alta, pro espelho, como se fosse pro produtor",
     "💭 Como o cliente reagiu à proposta nova? Algo precisa mudar no modelo?"],
    // S8
    ["🎯 Aplique o método completo em mais 1 atendimento, num tipo de serviço diferente do da semana passada",
     "✍️ Anote os números da Etapa 1: quantas propostas enviou, quantas fechou e se cobrou mais",
     "💭 Qual ferramenta da Etapa 1 você mais usou e qual deixou de lado? Por quê?",
     "🎯 Escolha 1 hábito da Etapa 1 pra manter toda semana daqui pra frente",
     "🪞 Diga em voz alta, pro espelho, o que você conquistou na Etapa 1"],
    // S9
    ["🧪 Registre 1 trava no Mapa Pessoal de Padrões: situação, efeito comercial e como você respondeu",
     "💭 De onde vem a crença que você identificou na semana passada? Quem te ensinou isso?",
     "✍️ Escreva o que você faria nos seus atendimentos se essa trava não existisse",
     "🎯 Faça hoje a tarefa que você vem adiando por causa da trava",
     "👥 Pergunte a alguém próximo se percebe essa trava em você, e em que situação"],
    // S10
    ["💭 Releia 1 situação de pressão recente: o que você sentiu no corpo antes de reagir?",
     "✍️ Escreva o que o produtor teria perdido em 1 caso se você não tivesse feito o seu trabalho",
     "🎯 Numa conversa tensa, nomeie a emoção do produtor antes de responder (\"entendo que isso te preocupa\")",
     "💭 Em que situação você ainda diminui o valor do que faz (\"é só um papel\", \"é rapidinho\")?",
     "👥 Peça a 1 cliente satisfeito que conte o que mudou pra ele depois do seu trabalho"],
    // S11
    ["🧪 Leia o Roteiro de Mediação de Conflitos e marque a situação difícil que mais se parece com um caso seu",
     "💭 Num caso com várias pessoas, quem decide de fato e quem só influencia?",
     "🎭 Ensaie a abertura de uma reunião com mais de 1 envolvido, usando o Roteiro de Mediação",
     "✍️ Escreva os limites da sua atuação num caso com conflito familiar: o que é seu e o que é de advogado ou outro profissional",
     "💭 Que interesse escondido apareceu num caso nessa quinzena?"],
    // S12
    ["✍️ Preencha a Parte 2 (Plano de Condução) do Mapa do Caso avançado que você fez na semana passada",
     "💭 Releia seu Mapa Pessoal de Padrões: qual trava apareceu menos nessa sub-fase?",
     "🎯 Use o Círculo de Controle num caso complexo em andamento",
     "🪞 Diga em voz alta, pro espelho, como você reage hoje a uma pressão que antes te travava",
     "👥 Conte pra alguém de confiança 1 mudança emocional que você percebeu em si"],
    // S13
    ["🧪 Registre no Banco de Comunicação 2 argumentos de valor que funcionaram em casos reais",
     "🎯 Comunique 1 risco real a um produtor usando a frase que você treinou no espelho",
     "✍️ Reescreva 1 explicação sua pra 2 perfis diferentes de produtor",
     "💭 Em qual conversa da quinzena o produtor entendeu de primeira? O que você fez diferente?",
     "🎭 Explique 1 caso complexo em até 2 minutos pra alguém de fora do agro"],
    // S14
    ["🎯 Use 1 pergunta nova do seu banco de escuta num atendimento real",
     "🎭 Simule em voz alta o fechamento de um atendimento complexo: proposta, objeção e próximo passo",
     "💭 Compare 1 atendimento de hoje com 1 do começo do programa: o que mudou no seu jeito de conduzir?",
     "👥 Peça a alguém que faça o papel do produtor e simule 1 atendimento completo com você",
     "✍️ Escreva o passo do Roteiro de Condução que você mais pula, e por quê"],
    // S15
    ["🎭 Treine no Simulador de Conversas uma situação de Conflito Familiar",
     "✍️ Escreva o que você diria a um produtor que culpa você por um atraso do banco ou do cartório",
     "💭 Qual conversa difícil você evitou nessa quinzena? O que te fez evitar?",
     "🎯 Tenha hoje a conversa difícil que você estava evitando",
     "🪞 Treine no espelho como dizer \"isso não é comigo, mas te indico quem resolve\""],
    // S16
    ["💭 Em qual caso a conversa travou sem próximo passo? O que faltou?",
     "🎯 Mande hoje uma mensagem de próximo passo pra 1 caso parado",
     "🧪 Atualize na Central de Condução o próximo checkpoint de todos os casos em andamento",
     "🪞 Treine no espelho como encerrar uma conversa com data e responsável definidos",
     "💭 Qual objeção ainda te tira do eixo? O que falta pra ela deixar de tirar?"],
    // S17
    ["👥 Pergunte a 2 clientes por que eles te escolheram",
     "✍️ Escreva como você quer ser lembrada pelos produtores da sua região",
     "🎯 Num atendimento, recomende com firmeza o caminho que você acredita ser o certo, em vez de listar opções",
     "💭 Que situação ainda te faz agir como executora em vez de condutora?",
     "🪞 Grave um vídeo curto se apresentando e assista: você passa autoridade?"],
    // S18
    ["✍️ Revise \"Para quem\" e \"Como faço\" na cópia nova do Mapa de Posicionamento",
     "🎯 Use a nova frase de \"Qual valor entrego\" numa conversa real",
     "🎯 Atualize sua apresentação (WhatsApp, Instagram, mensagem de boas-vindas) com o posicionamento revisado",
     "💭 Que tipo de cliente você não quer mais atender? Por quê?",
     "🧪 Leia o Mapa revisado em voz alta: soa como você ou como um texto bonito?"],
    // S19
    ["✍️ Calcule quanto tempo leva 1 serviço seu do início ao fim e compare com o que você cobra",
     "🎯 Envie a proposta reformulada de maior complexidade pro cliente",
     "🎭 Ensaie a resposta pra \"tá caro\" num caso de valor alto",
     "💭 Qual serviço seu está mais barato do que deveria? O que te impede de ajustar?",
     "👥 Pergunte a um colega quanto ele cobra por um serviço parecido com o seu"],
    // S20
    ["🎯 Avise 1 cliente do seu horário de atendimento e do seu prazo de resposta",
     "💭 Qual pedido fora do escopo você ainda aceita por medo de perder o cliente?",
     "✍️ Escreva a frase que você vai usar pra cobrar um serviço extra que antes fazia de graça",
     "🪞 Treine no espelho como dizer não sem pedir desculpas",
     "👥 Conte pra alguém da sua casa os limites de horário que você definiu e peça ajuda pra manter"],
    // S21
    ["💭 Qual foi o momento mais difícil desses meses e o que te fez continuar?",
     "✍️ Escreva o que você diria pra você mesma no primeiro dia do programa",
     "👥 Pergunte a alguém próximo que mudança percebeu em você desde o começo",
     "🧪 Dê de novo uma nota de 1 a 5 pros 6 pilares e compare com a nota que você deu na S2",
     "🪞 Leia em voz alta, pro espelho, o seu relatório antes x depois"],
    // S22
    ["🧪 Atualize o Mapa do Caso do caso final com o registro de como ele terminou",
     "🎯 Feche o caso final com responsabilidades e próximo passo por escrito",
     "💭 Qual foi o momento mais difícil do caso final e como você conduziu?",
     "👥 Peça ao produtor do caso final um retorno sobre como foi ser atendido por você",
     "✍️ Compare esse caso com o primeiro caso que você mapeou na S4"],
    // S23
    ["🎯 Use seu Protocolo Pessoal num atendimento real, do Abrir ao Acompanhar",
     "✍️ Ajuste o passo do protocolo que não funcionou no atendimento",
     "💭 Qual passo do protocolo é mais seu, que ninguém te ensinou?",
     "👥 Mostre seu protocolo a alguém de confiança e peça 1 sugestão",
     "🧪 Releia seu protocolo e marque o passo em que você ainda se sente mais fraca"],
    // S24
    ["🎯 Marque na agenda as datas de revisão do seu plano de continuidade",
     "💭 Qual foi a maior virada desses 12 meses?",
     "✍️ Escreva uma carta pra você ler daqui a 1 ano",
     "👥 Agradeça a quem te apoiou durante o programa e conte o que mudou",
     "🪞 Diga em voz alta, pro espelho, quem você é como profissional hoje"]
  ];

  var row = 5;
  semanas.forEach(function(w, i){
    var isEtapa2 = w[0] >= 9;
    var bg = isEtapa2 ? COR_OLIVE_TINT : COR_PAPER;
    [w[3], segundaSemana[i]].forEach(function(atividades, k){
      var rowRange = sh.getRange(row, 1, 1, 8);
      rowRange.setBackground(bg)
        .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
        .setVerticalAlignment("top").setWrap(true);
      if (k === 0) rowRange.setBorder(true, null, null, null, null, null, COR_OLIVE, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

      sh.getRange(row, 1).setValue(2 * w[0] - 1 + k).setFontColor(COR_INK_SOFT).setFontSize(10).setHorizontalAlignment("center");
      sh.getRange(row, 2).setValue(w[1] + (k === 0 ? " · 1ª sem." : " · 2ª sem.")).setFontWeight("bold").setFontColor(COR_GOLD).setFontSize(10).setHorizontalAlignment("center");
      sh.getRange(row, 3).setValue(w[2]).setFontWeight("bold").setFontColor(COR_INK).setFontSize(10);
      for (var d = 0; d < 5; d++) {
        sh.getRange(row, 4 + d).setValue(atividades[d]).setFontColor(COR_INK).setFontSize(10);
      }
      sh.setRowHeight(row, 70);
      row++;
    });
  });

  sh.setFrozenRows(4);
  sh.setFrozenColumns(3);
}
