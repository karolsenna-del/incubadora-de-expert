/**
 * Conduz Agro — recebe os envios dos formularios (diagnostico-interativo.html,
 * pre-diagnostico-vendas.html, ficha-inscricao.html e raio-x-conversa.html) e
 * grava cada um na aba certa da planilha.
 *
 * Setup: ver `SETUP-PLANILHAS.md` na mesma pasta.
 *
 * Desde 27/09: o cabecalho de cada aba e o texto exato de cada pergunta, na ordem
 * do formulario, e as respostas de multipla escolha sao gravadas com o texto da
 * opcao escolhida. Se mudar alguma pergunta/opcao num HTML, mudar aqui tambem.
 *
 * Colunas: key = campo do payload ("respostas.T1a" = payload.respostas.T1a);
 * opcoes = multipla escolha que chega como pontos (3 = 1a opcao, 2 = 2a, 1 = 3a);
 * valores = <select> cujo value difere do texto mostrado; fixo = valor inicial.
 */

var FORMS = {
  pre_diagnostico: {
    tab: "Pré-Diagnóstico Vendas",
    cols: [
      {key: "_timestamp", header: "Data e hora do envio"},
      {key: "nome", header: "Qual seu nome?"},
      {key: "email", header: "Qual seu e-mail?"},
      {key: "whatsapp", header: "Qual seu WhatsApp?"},
      {key: "atuacao", header: "Qual sua área de atuação?"},
      {key: "tempo", header: "Há quanto tempo você atua nesse mercado?"},
      {key: "faturamento", header: "Qual seu faturamento mensal aproximado hoje?"},
      {key: "dificuldade", header: "Qual sua maior dificuldade hoje pra conduzir seus atendimentos?"},
      {key: "urgencia", header: "Numa escala de 1 a 10, qual sua urgência em resolver isso?"},
      {key: "t_fechada", header: "Você entende o processo completo de regularização de um imóvel rural?", opcoes: [
        "Sim, domino todas as etapas com segurança",
        "Tenho conhecimento, mas com dúvidas em algumas fases",
        "Tenho dificuldade em entender o processo completo"]},
      {key: "t_aberta", header: "Me conta uma situação real recente em que essa parte técnica pesou — o que aconteceu?"},
      {key: "e_fechada", header: "Você sente de fato segurança em todos os serviços que oferece?", opcoes: [
        "Sim, absolutamente",
        "Às vezes, dependendo da complexidade, fico um pouco inseguro",
        "Na maioria das vezes sinto-me inseguro. Fico com receio de entregar algo incorreto para o produtor."]},
      {key: "e_aberta", header: "Qual foi a última vez que você sentiu essa insegurança com um produtor? O que rolou?"},
      {key: "c_fechada", header: "Na sua comunicação com o produtor, você explica a regularização como obrigação ou como oportunidade?", opcoes: [
        "Explico como oportunidade, conectando com ganhos financeiros e segurança patrimonial",
        "Às vezes explico como oportunidade, mas ainda foco muito no lado obrigatório",
        "Explico mais como obrigação, cumprimento de exigências ou burocracia"]},
      {key: "c_aberta", header: "Pensa na sua última conversa sobre isso com um produtor — como foi? O que você sentiu que travou ou funcionou?"},
      {key: "trava_sinalizada", header: "Trava sinalizada (leitura automática do formulário)"}
    ],
    antigo: {
      "Timestamp": "_timestamp", "Nome": "nome", "Email": "email", "WhatsApp": "whatsapp",
      "Área de Atuação": "atuacao", "Tempo de Mercado": "tempo", "Faturamento": "faturamento",
      "Maior Dificuldade": "dificuldade", "Urgência (1-10)": "urgencia",
      "Resposta Técnica (contexto)": "t_aberta", "Resposta Emocional (contexto)": "e_aberta",
      "Resposta Condução (contexto)": "c_aberta", "Trava Sinalizada": "trava_sinalizada"
    }
  },

  diagnostico_completo: {
    tab: "Diagnóstico Completo",
    cols: [
      {key: "_timestamp", header: "Data e hora do envio"},
      {key: "nome", header: "Qual seu nome?"},
      {key: "email", header: "Qual seu e-mail?"},
      {key: "respostas.T1a", header: "Você entende o processo completo de regularização de um imóvel rural?", opcoes: ["Sim, domino todas as etapas com segurança","Tenho conhecimento, mas com dúvidas em algumas fases","Tenho dificuldade em entender o processo completo"]},
      {key: "respostas.T1b", header: "Você sabe identificar e corrigir inconsistências nos documentos dos imóveis rurais (CCIR, ITR, CIB, CAR)?", opcoes: ["Sim, faço análise técnica e ajustes","Sei o básico, mas não aprofundo","Tenho dificuldade"]},
      {key: "respostas.T2a", header: "Você utiliza diagnóstico e consegue transformá-lo em solução para o cliente?", opcoes: ["Sim, conduzo do problema à solução","Consigo parcialmente","Tenho dificuldade em aplicar"]},
      {key: "respostas.T2b", header: "Você consegue definir a melhor estratégia de regularização para cada caso?", opcoes: ["Sim, analiso e direciono com segurança","Tenho dúvidas na decisão","Não sei definir"]},
      {key: "respostas.T3a", header: "Você se mantém atualizado sobre normas e mudanças envolvendo regularização de imóveis/crédito rural?", opcoes: ["Sim, acompanho constantemente","Às vezes acompanho","Não acompanho"]},
      {key: "respostas.T4a", header: "Você sabe como o CAR, CCIR, ITR, matrícula, documentos de posse ou contratos agrícolas impactam o crédito rural?", opcoes: ["Sim, explico claramente ao cliente","Entendo parcialmente","Não sei relacionar"]},
      {key: "respostas.T4b", header: "Quando chega alguma demanda que o produtor já solicita diretamente o que precisa ser feito (ex: retificação nº matrícula CAR), como você procede na execução?", opcoes: ["Mesmo que ele só solicita a retificação nº matrícula, eu acabo analisando todo o CAR","Faço o que ele pediu, mas pergunto se não tem algo a mais pra ajustar","Executo o que o produtor solicitou"]},
      {key: "respostas.E1a", header: "Você sente de fato segurança em todos os serviços que oferece?", opcoes: ["Sim, absolutamente","Às vezes, dependendo da complexidade, fico um pouco inseguro","Na maioria das vezes sinto-me inseguro. Fico com receio de entregar algo incorreto para o produtor."]},
      {key: "respostas.E1b", header: "Você acredita que pode prosperar com os serviços técnicos de regularização/crédito rural que oferece hoje?", opcoes: ["Sim, com certeza","Acredito que sim, mas falta ter mais confiança para mostrar meu valor","Não, tenho que aprender sempre mais porque sinto-me que nunca sei o suficiente."]},
      {key: "respostas.E2a", header: "Como você se sente ao saber que o produtor rural fechou demanda com o outro técnico depois de ter vindo conversar com você sobre o caso?", opcoes: ["Aceito numa boa","Fico me questionando o porque ele fechou com o outro, o que eu fiz ou não fiz/falei de diferente do outro técnico, mas acabo me conformando","Fico desanimado e pensativo bastante tempo/dias sobre a situação"]},
      {key: "respostas.E2b", header: "O que você sente quando o cliente acha que seu serviço é barato?", opcoes: ["Reforço o valor da minha entrega e aproveito a percepção positiva","Fico em dúvida se estou cobrando certo","Me sinto desconfortável e começo a questionar meu próprio valor ou preço"]},
      {key: "respostas.E3a", header: "Quando você tem uma ideia que pode melhorar seu negócio, o que costuma acontecer?", opcoes: ["Coloco em prática rapidamente, mesmo que simples","Anoto e deixo para fazer quando tiver mais tempo/organização","Penso bastante, mas dificilmente tiro do papel"]},
      {key: "respostas.E3b", header: "Quando você precisa tomar uma decisão importante no seu negócio, como age?", opcoes: ["Decido com base nas informações que tenho e sigo","Penso bastante antes de decidir","Adio a decisão esperando mais segurança ou “o momento certo”"]},
      {key: "respostas.E4a", header: "Em relação ao medo de errar ao tentar algo novo, como você se comporta?", opcoes: ["Vejo o erro como parte do processo e sigo","Tento me preparar ao máximo para evitar erros","Evito tentar para não correr o risco de errar"]},
      {key: "respostas.E4b", header: "Como você reage quando algo não sai exatamente como você planejou?", opcoes: ["Ajusto a rota e sigo em frente","Fico frustrado(a), mas continuo","Travo ou desanimo, adiando a ideia ou desistindo"]},
      {key: "respostas.E5a", header: "Quando você se compara com outros profissionais do agro, o que acontece?", opcoes: ["Uso como referência para evoluir e me posicionar melhor","Às vezes me comparo, mas sigo fazendo o meu","Me comparo e isso me faz recuar ou duvidar da minha capacidade"]},
      {key: "respostas.E5b", header: "Você se sente confortável ao gravar vídeos, postar fotos ou aparecer nas redes sociais?", opcoes: ["Sim, me posiciono com naturalidade e consistência","Consigo aparecer, mas ainda com insegurança ou sem frequência","Evito aparecer por não me sentir à vontade ou preparado(a)"]},
      {key: "respostas.E6a", header: "Como você se sente ao apresentar um orçamento ao produtor?", opcoes: ["Apresento com segurança, explicando o valor e conduzindo a decisão","Apresento, mas fico inseguro(a) sobre o preço e com receio da reação","Me sinto desconfortável, evito ou acabo reduzindo o valor para facilitar o fechamento"]},
      {key: "respostas.E6b", header: "Você costuma conceder descontos rapidamente ao negociar com o produtor?", opcoes: ["Não, sustento o valor explicando a entrega e o benefício do serviço","Às vezes cedo, dependendo da situação ou da pressão do produtor","Sim, cedo facilmente para não perder o cliente ou evitar desconforto"]},
      {key: "respostas.E7a", header: "O que mais tira o seu sono atualmente em relação ao seu trabalho?", opcoes: ["Tenho clareza do que preciso fazer e sigo com segurança nas decisões","Algumas situações me preocupam, mas consigo administrar","Sinto preocupação constante, insegurança ou sobrecarga que trava minhas ações"]},
      {key: "respostas.C1a", header: "Na sua comunicação com o produtor, você explica a regularização como obrigação ou como oportunidade?", opcoes: ["Explico como oportunidade, conectando com ganhos financeiros e segurança patrimonial","Às vezes explico como oportunidade, mas ainda foco muito no lado obrigatório","Explico mais como obrigação, cumprimento de exigências ou burocracia"]},
      {key: "respostas.C1b", header: "Como você explica o valor do seu serviço ao produtor?", opcoes: ["Conecto o valor à entrega, explicando o que será feito, os riscos envolvidos, os benefícios e a segurança que o serviço proporciona ao produtor","Explico o que está incluído no serviço, mas ainda tenho dificuldade para demonstrar o valor além das atividades que serão executadas","Foco principalmente no preço e no que será entregue, deixando que o produtor avalie se o investimento vale a pena"]},
      {key: "respostas.C2a", header: "Quais são seus passos ao conduzir o primeiro atendimento com um produtor que deseja regularizar o imóvel?", opcoes: ["Tenho um processo claro: levanto a situação do imóvel, identifico inconsistências, explico riscos e oportunidades e conduzo para a solução","Faço algumas perguntas e explico de forma geral, mas sem um padrão bem definido","Não tenho um processo estruturado, vou conduzindo conforme a conversa acontece"]},
      {key: "respostas.C2b", header: "Ao conversar com o produtor sobre uma demanda de regularização, você busca compreender também os fatores financeiros, familiares, patrimoniais e emocionais que podem influenciar a decisão?", opcoes: ["Sim, procuro entender esses fatores e considero como eles influenciam a situação e a decisão do produtor","Percebo alguns desses fatores, mas normalmente concentro a conversa na questão técnica e na solução do serviço","Não costumo abordar esses aspectos, fico focado principalmente na demanda técnica apresentada pelo produtor"]},
      {key: "respostas.C3a", header: "Quando o produtor diz que seu serviço está caro, como você reage?", opcoes: ["Pergunto o que ele considerou caro, entendo a objeção e reforço o valor, a entrega e os riscos envolvidos antes de falar em preço","Explico novamente o que está incluído no serviço, mas fico inseguro(a) e considero negociar o valor","Fico preocupado(a) em perder o cliente e rapidamente ofereço desconto ou reduzo o preço para tentar fechar"]},
      {key: "respostas.C3b", header: "Após apresentar sua explicação ao produtor, você consegue conduzir a conversa até uma decisão?", opcoes: ["Sim, faço perguntas, esclareço dúvidas e conduzo naturalmente para o próximo passo, sem pressionar o produtor","Tenho dificuldade para avançar depois da explicação, pois fico com receio de parecer insistente ou pressionar o produtor","Após explicar o serviço, prefiro deixar o produtor à vontade e aguardo que ele tome a iniciativa de retornar"]},
      {key: "respostas.C4a", header: "Você busca entender o perfil do produtor antes de definir como conduzir a conversa?", opcoes: ["Sim, identifico o perfil, o momento e as necessidades do produtor e adapto minha comunicação e condução","Percebo algumas diferenças entre os produtores, mas ainda tenho dificuldade para adaptar minha abordagem","Conduzo praticamente todos da mesma forma, pois ainda não domino a leitura de comportamento e perfil do produtor"]},
      {key: "respostas.C4b", header: "Como você costuma se comunicar com o produtor durante um atendimento?", opcoes: ["Faço perguntas, pratico escuta ativa e adapto minha linguagem, traduzindo o técnico para uma explicação simples e conectada à realidade do produtor","Faço perguntas e procuro ouvir, mas ainda utilizo bastante linguagem técnica ou tenho dificuldade para adaptar a explicação ao perfil do produtor","Explico principalmente o que precisa ser feito, utilizando uma linguagem mais técnica para demonstrar meu entendimento; e falo mais do que perguntando ou investigando o cenário do produtor"]},
      {key: "respostas.C5a", header: "Como você costuma proceder quando surgem conflitos entre pessoas durante um atendimento ou negociação?", opcoes: ["Escuto os envolvidos, mantenho a neutralidade e busco conduzir a situação para uma solução","Tento apaziguar a situação, mas fico desconfortável e nem sempre sei como conduzir o conflito","Evito me envolver ou tomar uma posição, deixando que os envolvidos resolvam entre si para não gerar desgaste"]},
      {key: "respostas.C5b", header: "Quando o produtor diz que o prazo para realizar o serviço é muito demorado, como você reage?", opcoes: ["Explico o que determina esse prazo, mostro os riscos de fazer de forma apressada e conduzo o produtor para uma decisão segura","Explico que o prazo é necessário, mas tenho dificuldade para lidar quando ele insiste que está demorando","Fico preocupado(a) em perder o cliente e procuro reduzir o prazo ou deixo o produtor decidir se quer seguir em frente"]},
      {key: "indice_geral", header: "Resultado — Índice Geral (%)"},
      {key: "tecnica", header: "Resultado — Técnica (%)"},
      {key: "emocional", header: "Resultado — Emocional (%)"},
      {key: "conducao", header: "Resultado — Condução (%)"},
      {key: "trava_principal", header: "Resultado — Trava Principal"},
      {key: "trava_secundaria", header: "Resultado — Trava Secundária"},
      {key: "forca_principal", header: "Resultado — Força Principal"},
      {key: "perfil", header: "Resultado — Perfil"}
    ],
    antigo: {
      "Timestamp": "_timestamp", "Nome": "nome", "Email": "email",
      "Índice Geral (%)": "indice_geral", "Técnica (%)": "tecnica", "Emocional (%)": "emocional",
      "Condução (%)": "conducao", "Trava Principal": "trava_principal",
      "Trava Secundária": "trava_secundaria", "Força Principal": "forca_principal",
      "Perfil": "perfil", "Respostas (JSON)": "respostas"
    }
  },

  ficha_inscricao: {
    tab: "Ficha de Inscrição",
    cols: [
      {key: "_timestamp", header: "Data e hora do envio"},
      {key: "nome", header: "Seu nome"},
      {key: "email", header: "Seu e-mail"},
      {key: "usoNumero", header: "Esse é o seu 1º ou 2º uso?", valores: {
        "1": "1º uso",
        "2": "2º uso (último)"}},
      {key: "produtor", header: "Nome do produtor / cliente envolvido no caso"},
      {key: "contexto", header: "Contexto do caso"},
      {key: "trava", header: "Qual a trava que você percebe?"},
      {key: "jaTentou", header: "O que você já tentou fazer?"},
      {key: "urgencia", header: "Urgência", valores: {
        "Ainda essa semana": "Preciso resolver ainda essa semana",
        "Próximas 2 semanas": "Tenho até 2 semanas",
        "Não é urgente": "Não é urgente, quero só organizar o próximo passo"}}
    ],
    antigo: {
      "Timestamp": "_timestamp", "Nome": "nome", "Email": "email", "Uso Nº (1 ou 2)": "usoNumero",
      "Produtor/Cliente": "produtor", "Contexto do Caso": "contexto", "Trava Percebida": "trava",
      "O Que Já Tentou": "jaTentou", "Urgência": "urgencia"
    }
  },

  raio_x: {
    tab: "Raio-X de Conversas",
    cols: [
      {key: "_timestamp", header: "Data e hora do envio"},
      {key: "nome", header: "Seu nome"},
      {key: "email", header: "Seu e-mail"},
      {key: "produtor", header: "Produtor envolvido (opcional)"},
      {key: "contexto", header: "Contexto rápido"},
      {key: "_prints_links", header: "A conversa — print(s) da tela (links)"},
      {key: "conversa", header: "Resumo da conversa (opcional se já anexou print)"},
      {key: "percepcao", header: "O que você já percebe que pode ter dado errado (opcional)"},
      {key: "status", header: "Status da Análise", fixo: "Pendente"}
    ],
    antigo: {
      "Timestamp": "_timestamp", "Nome": "nome", "Email": "email", "Produtor": "produtor",
      "Contexto": "contexto", "Conversa (colada)": "conversa", "Percepção Prévia do Aluno": "percepcao",
      "Prints (links)": "_prints_links", "Status da Análise": "status"
    }
  }
};

var RAIO_X_PRINTS_FOLDER = "Conduz Agro — Prints do Raio-X";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ok: false, error: "payload invalido"});
  }

  // Envio sem _form conhecido cai no Diagnóstico Completo (mesmo comportamento de antes)
  var form = FORMS[payload._form] || FORMS.diagnostico_completo;
  delete payload._timestamp;
  if (form === FORMS.raio_x) payload._prints_links = salvarPrints(payload);

  var sheet = getOrCreateSheet(ss, form.tab, headersDe(form));
  sheet.appendRow(form.cols.map(function(col) { return valorDe(col, payload, new Date()); }));

  return respond({ok: true});
}

function headersDe(form) {
  return form.cols.map(function(c) { return c.header; });
}

function lerCampo(p, key) {
  return key.split(".").reduce(function(obj, k) { return obj == null ? undefined : obj[k]; }, p);
}

function valorDe(col, p, timestamp) {
  if (col.key === "_timestamp") return p._timestamp != null && p._timestamp !== "" ? p._timestamp : timestamp;
  var v = lerCampo(p, col.key);
  if (v == null || v === "") return col.fixo || "";
  if (col.opcoes && typeof v === "number") return col.opcoes[3 - v] || v;
  if (col.valores && col.valores[String(v)]) return col.valores[String(v)];
  return v;
}

function salvarPrints(p) {
  if (!p.prints || !p.prints.length) return "";
  var folder = getOrCreateFolder(RAIO_X_PRINTS_FOLDER);
  var links = [];
  p.prints.forEach(function(file, i) {
    try {
      var blob = Utilities.newBlob(Utilities.base64Decode(file.data), file.mimeType || "image/png",
        (p.nome || "aluno") + "_" + new Date().getTime() + "_" + i + "_" + (file.filename || "print.png"));
      var driveFile = folder.createFile(blob);
      driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      links.push(driveFile.getUrl());
    } catch (err) {
      links.push("[erro ao salvar print " + (i + 1) + "]");
    }
  });
  return links.join("\n");
}

function getOrCreateFolder(name) {
  var it = DriveApp.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(name);
}

/**
 * Rode uma vez manualmente (Executar → migrarTodasAsAbas) pra trocar o cabeçalho
 * antigo de cada aba pelas perguntas completas e reposicionar as respostas já
 * gravadas. No Diagnóstico Completo, o antigo "Respostas (JSON)" vira uma coluna
 * por pergunta. Aba já migrada é pulada.
 */
function migrarTodasAsAbas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(FORMS).forEach(function(id) { migrarAba(ss, FORMS[id]); });
}

function migrarAba(ss, form) {
  var sheet = ss.getSheetByName(form.tab);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var oldHeader = data[0];
  if (oldHeader[0] !== "Timestamp") return; // já migrada

  var novas = [headersDe(form)];
  for (var r = 1; r < data.length; r++) {
    var p = {};
    oldHeader.forEach(function(h, i) {
      var key = form.antigo[h];
      if (!key) return;
      var v = data[r][i];
      if (key === "respostas" && typeof v === "string" && v) {
        try { v = JSON.parse(v); } catch (err) { v = {}; }
      }
      p[key] = v;
    });
    novas.push(form.cols.map(function(col) {
      if (col.fixo) return lerCampo(p, col.key) || "";
      return valorDe(col, p, "");
    }));
  }

  sheet.clearContents();
  sheet.getRange(1, 1, novas.length, novas[0].length).setValues(novas);
  sheet.getRange(1, 1, 1, novas[0].length).setFontWeight("bold").setWrap(true);
  sheet.setFrozenRows(1);
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setWrap(true);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Rode esta função uma vez manualmente (Executar → testSetup) pra criar as
 * 4 abas com cabeçalho antes do primeiro envio real.
 */
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(FORMS).forEach(function(id) { getOrCreateSheet(ss, FORMS[id].tab, headersDe(FORMS[id])); });
}
