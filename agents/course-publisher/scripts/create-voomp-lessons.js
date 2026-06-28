// Criar aulas no Voomp Play — Expert360
// Abrir no DevTools: Sources → Snippets → New → colar → Ctrl+Enter
// Ou colar no Console do Chrome na página app.voompplay.com.br

(async function () {
  var t = document.cookie.split(';').find(function(c){ return c.includes('auth_greennCourse='); }).split('auth_greennCourse=')[1].trim();
  var H = { Authorization: t, 'Content-Type': 'application/json' };

  var MODS = [
    { id: 38815, name: 'MO', ls: [
      'Boas-vindas ao Expert360',
      'Antes de Começar'
    ]},
    { id: 38816, name: 'M1', ls: [
      'Boas-vindas ao M1',
      'A1 — O que é Persona Compradora',
      'A2 — Exercício: Agente da Persona',
      'A3 — O que é Promessa Transformadora',
      'A4 — Exercício: Agente da Promessa',
      'A5 — Posicionamento no Mercado',
      'A6 — O Custo Invisível do Sim',
      'Quem Você se Tornou no M1'
    ]},
    { id: 38817, name: 'M2', ls: [
      'Boas-vindas ao M2',
      'A1 — O que é um Método Autoral',
      'A2 — Insegurança Inteligente',
      'A3 — Mapeando seu Processo',
      'A4 — As 3 Jornadas',
      'A5 — Exercício: Agente do Processo Autoral',
      'A6 — Portfólio Estratégico',
      'A7 — Exercício: Agente do Portfólio',
      'A8 — Ecossistema do Método',
      'Quem Você se Tornou no M2'
    ]},
    { id: 38818, name: 'M3', ls: [
      'Boas-vindas ao M3',
      'A1 — Vendas Secretas: Conceito',
      'A2 — Feito é Melhor que Perfeito',
      'A3 — A Oferta de Lançamento',
      'A4 — Exercício: Agente da Proposta Validada',
      'A5 — Rastreador de Leads Quentes',
      'A6 — Social Selling',
      'A7 — Lendo seu Lead',
      'A8 — Roteiro de Abordagem',
      'A9 — Roteiro da Sessão',
      'A10 — Pós-Sessão',
      'A11 — A Escala Secreta',
      'Quem Você se Tornou no M3'
    ]},
    { id: 38819, name: 'M4', ls: [
      'Boas-vindas ao M4',
      'A1 — A Tríplice da Autoridade',
      'A2 — Exercício: Agente da Autoridade Tríplice',
      'A3 — Relatório de Autoridade',
      'A4 — Montando sua Vitrine',
      'A5 — Linha Editorial',
      'A6 — Roteiros de Reels e Carrosséis',
      'A7 — Queimar a Ponte',
      'A8 — Escalando o Posicionamento',
      'Quem Você se Tornou no M4'
    ]}
  ];

  var R = {};

  for (var m = 0; m !== MODS.length; m++) {
    var mod = MODS[m];
    R[mod.name] = [];
    console.log('\n=== ' + mod.name + ' (ID:' + mod.id + ') ===');

    for (var i = 0; i !== mod.ls.length; i++) {
      await new Promise(function(r){ setTimeout(r, 400); });
      var body = JSON.stringify({
        title: mod.ls[i],
        mediaType: 'text',
        content: '',
        source: '',
        order: i,
        status: 'draft',
        thumb: null,
        custom_thumb: '',
        small_category: null
      });
      var res = await fetch('https://api.voompplay.com.br/course/9512/module/' + mod.id + '/lesson', {
        method: 'POST',
        headers: H,
        body: body
      });
      var d = await res.json();
      R[mod.name].push({ title: mod.ls[i], id: d.id });
      console.log('  ' + mod.ls[i] + ' → ID:' + d.id);
    }
  }

  console.log('\n\n=== RESULTADO FINAL ===');
  console.log(JSON.stringify(R, null, 2));
})();
