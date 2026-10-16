/**
 * Conduz Agro — Diário de Aplicação do aluno. Arquivo pessoal, 1 cópia por
 * aluno, onde ele marca e registra as atividades de 15 min do Plano de
 * Aplicação Diária (mesmas 24 semanas × 5 atividades de
 * `apps-script-plano-aplicacao-diaria.gs` — texto das atividades idêntico).
 *
 * Gera 2 abas:
 *  · "Atividades" — as 120 atividades com quadradinho de ✓ e contador de
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
    ["🧪 Autoavaliação rápida — marque de 1 a 5 cada um dos 6 pilares do método","O nome de cada um dos 6 pilares e a sua nota de 1 a 5"],
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

function criarDiarioAplicacao() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var total = SEMANAS.length * 5;
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

  sh.getRange("A2:F2").merge().setValue("15 minutos, 5 dias por semana, sempre ligados à sessão em curso. Fez a atividade? Marca o quadradinho. O que você descobriu nela vai na aba \"Dia a dia\".")
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

  sh.getRange("A4:F4").setValues([["Feito", "Sem.", "Sessão", "Tema da semana", "Dia", "Atividade (15 min)"]])
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  sh.getRange("D4").setHorizontalAlignment("left");
  sh.getRange("F4").setHorizontalAlignment("left");
  sh.setRowHeight(4, 26);

  var linhas = [];
  SEMANAS.forEach(function(w){
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
  for (var i = 0; i < SEMANAS.length; i++) {
    var r = primeira + i * 5;
    sh.getRange(r, 1, 5, 6).setBackground(SEMANAS[i][0] >= 9 ? COR_OLIVE_TINT : COR_WHITE);
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
  SEMANAS.forEach(function(w){
    var isEtapa2 = w[0] >= 9;
    sh.getRange(row, 1, 1, 5).merge()
      .setValue("SEMANA " + w[0] + "  ·  " + w[1] + "  ·  " + w[2] + (isEtapa2 ? "   (Etapa 2)" : "   (Etapa 1)"))
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
