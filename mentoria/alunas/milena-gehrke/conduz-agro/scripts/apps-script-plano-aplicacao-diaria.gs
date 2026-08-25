/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) do
 * Plano de Aplicação Diária: 24 semanas (1 por sessão), 5 atividades de
 * 15 min cada, sincronizadas com o tema da sessão em curso. Tom tático na
 * Etapa 1 (meses 1-4), reflexivo na Etapa 2 (meses 5-12).
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

  sh.getRange("A1:H1").merge().setValue("PLANO DE APLICAÇÃO DIÁRIA — 12 MESES")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2:H2").merge().setValue("Conduz Agro — 5 atividades de 15 min por semana (não diário corrido), sincronizadas com a sessão em curso. RASCUNHO — validar com a Milena antes de distribuir. Etapa 1 (semanas 1-8): tom tático, ação imediata. Etapa 2 (semanas 9-24): tom reflexivo, aprofundamento.")
    .setBackground(COR_GOLD_TINT).setFontColor(COR_GOLD).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 44);

  sh.getRange("A3:H3").merge().setValue("🎧 Áudio de Mentalidade   ✍️ Escrita   🪞 Treino no Espelho   🎯 Desafio Rápido   🧪 Teste/Autoavaliação   👥 Avaliação com Terceiros   🎭 Simulação   💭 Reflexão")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontSize(8.5).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(3, 22);

  var headers = [["#", "Sessão", "Tema da semana", "Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5"]];
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
    [2,"S2","Pilares da autoridade + plano 12 meses",[
      "✍️ Releia seu plano de 12 meses e escreva a meta do mês 1 num post-it",
      "💭 Escreva o que \"condução\" significa pra você, com suas próprias palavras",
      "🧪 Autoavaliação rápida — marque de 1 a 5 cada um dos 6 pilares do método",
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
      "🧪 Registre no Checklist de Evidências sua 1ª marcação",
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
      "🧪 Registre sua 2ª marcação no Checklist de Evidências",
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
      "🧪 Registre sua 3ª marcação no Checklist de Evidências",
      "🎯 Formalize responsabilidades e próximo passo de 1 caso real",
      "✍️ Compare sua condução de objeções hoje com a da S6",
      "👥 Celebre a evolução da sub-fase com alguém de confiança"]],
    [17,"S17","Posicionamento avançado",[
      "✍️ Revise sua identidade profissional definida na S7",
      "🪞 Observe sua postura e voz no espelho antes de 1 atendimento real",
      "✍️ Liste 3 provas concretas da sua autoridade acumuladas até agora",
      "🎯 Ajuste 1 detalhe de presença (tom, postura) num atendimento",
      "💭 Você parece mais condutora hoje do que na S7?"]],
    [18,"S18","Mapa de Posicionamento revisado",[
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
      "🧪 Registre sua 4ª marcação no Checklist de Evidências",
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
      "🧪 Finalize o Checklist de Evidências com a 5ª e última marcação",
      "✍️ Escreva seus indicadores de evolução mais importantes",
      "🎯 Monte seu plano de continuidade pros próximos 3 meses",
      "👥 Grave (ou escreva) seu depoimento sobre a jornada",
      "🎧 Celebre — você chegou ao fim dos 12 meses, ouça algo especial"]]
  ];

  var row = 5;
  semanas.forEach(function(w){
    var isEtapa2 = w[0] >= 9;
    var bg = isEtapa2 ? COR_OLIVE_TINT : COR_PAPER;
    var rowRange = sh.getRange(row, 1, 1, 8);
    rowRange.setBackground(bg)
      .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
      .setVerticalAlignment("top").setWrap(true);

    sh.getRange(row, 1).setValue(w[0]).setFontColor(COR_INK_SOFT).setFontSize(9).setHorizontalAlignment("center");
    sh.getRange(row, 2).setValue(w[1]).setFontWeight("bold").setFontColor(COR_GOLD).setFontSize(9.5).setHorizontalAlignment("center");
    sh.getRange(row, 3).setValue(w[2]).setFontWeight("bold").setFontColor(COR_INK).setFontSize(9.5);
    for (var d = 0; d < 5; d++) {
      sh.getRange(row, 4 + d).setValue(w[3][d]).setFontColor(COR_INK).setFontSize(9);
    }
    sh.setRowHeight(row, 70);
    row++;
  });

  sh.setFrozenRows(4);
  sh.setFrozenColumns(3);
}
