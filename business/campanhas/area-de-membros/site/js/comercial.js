// Painel Comercial da Karol (11/11/2026) — só ela usa (o banco também bloqueia por RLS).
// Site estático: HTML + JS puro + Supabase JS. Tabelas: crm_leads (etapa do funil), crm_etapas (histórico), crm_followups (anotações).
// Doc de trabalho: business/processos/painel-comercial.md

const COM_EMAIL = 'karolsenna@incubadoradeexpert.com.br';

// Ordem do funil. perdido e descartado ficam fora da régua (rank -1).
const COM_ETAPAS = [
  { id: 'novo', nome: 'Novo' },
  { id: 'abordado', nome: 'Abordado' },
  { id: 'respondeu', nome: 'Em conversa' },
  { id: 'sessao', nome: 'Sessão' },
  { id: 'proposta', nome: 'Proposta' },
  { id: 'aluno', nome: 'Aluno' },
  { id: 'perdido', nome: 'Perdido' },
];
const COM_RANK = { novo: 0, abordado: 1, respondeu: 2, sessao: 3, proposta: 4, aluno: 5 };
const COM_NOME_ETAPA = Object.fromEntries(COM_ETAPAS.map((e) => [e.id, e.nome]).concat([['descartado', 'Descartado']]));

const COM_ORIGENS = {
  garimpo_instagram: 'Garimpo (Instagram)',
  sessao_estrategica: 'Sessão estratégica',
  webinar_metodo_1h: 'Método em 1 hora',
  grupo_whatsapp: 'Grupo do WhatsApp',
  dualhook_whatsapp: 'WhatsApp (chegou sozinho)',
  black_expert_manual: 'Black Expert',
  comprador_outro_produto: 'Comprou outro produto',
  prospeccao_ativa: 'Prospecção ativa',
  compra_direta: 'Compra direta',
};
const COM_FONTES = { painel: 'você, no painel', fila: 'você, ao abordar', whatsapp: 'mensagem no WhatsApp', diagnostico: 'pré-diagnóstico', matricula: 'compra / matrícula', voomp: 'venda na Voomp', migracao: 'importação (data aproximada)', garimpo: 'Garimpo' };
const COM_PRIO = { Alta: 1, 'Média': 2, Baixa: 3 };
const DIA = 86400000;

// =====================================================================
// LÓGICA PURA (testável fora do navegador)
// =====================================================================

function comOrigemNome(o) { return COM_ORIGENS[o] || (o ? String(o).replace(/_/g, ' ') : 'Sem origem'); }

// Período: 'tudo' | '7' | '30' | '90' | 'ano' -> [inicio, fim) em ms
function comPeriodo(p, agora) {
  const fim = agora + 1;
  if (p === 'tudo') return [0, fim];
  if (p === 'ano') { const d = new Date(agora); return [new Date(d.getFullYear(), 0, 1).getTime(), fim]; }
  return [agora - Number(p) * DIA, fim];
}

// historico: [{lead_id, etapa, em, aproximada}] -> Map lead_id -> linhas em ordem de data
function comAgruparHistorico(historico) {
  const m = new Map();
  for (const h of historico) {
    if (!m.has(h.lead_id)) m.set(h.lead_id, []);
    m.get(h.lead_id).push({ ...h, t: new Date(h.em).getTime() });
  }
  for (const lista of m.values()) lista.sort((a, b) => a.t - b.t);
  return m;
}

function comMediana(v) {
  if (!v.length) return null;
  const s = [...v].sort((a, b) => a - b), k = Math.floor(s.length / 2);
  return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2;
}

// Indicadores do funil no período, para os leads escolhidos.
// Contagem = leads que ENTRARAM na etapa no período (1 por lead).
// Passagem = dos que entraram na etapa no período, quantos chegaram à próxima ou além (em qualquer data depois).
function comIndicadores(leads, porLead, periodo) {
  const [ini, fim] = periodo;
  const ids = new Set(leads.map((l) => l.id));
  const entrou = { abordado: new Set(), respondeu: new Set(), sessao: new Set(), proposta: new Set(), aluno: new Set(), perdido: new Set() };
  const temposAluno = [], temposResposta = [];
  const novosIds = [], novosAlunoIds = [];
  for (const [id, hist] of porLead) {
    if (!ids.has(id)) continue;
    const primeiro = hist[0];
    if (primeiro && primeiro.t >= ini && primeiro.t < fim) {
      novosIds.push(id);
      if (hist.some((h) => h.etapa === 'aluno')) novosAlunoIds.push(id);
    }
    for (const h of hist) {
      if (h.t >= ini && h.t < fim && entrou[h.etapa]) entrou[h.etapa].add(id);
    }
    const aluno = hist.find((h) => h.etapa === 'aluno');
    if (aluno && !aluno.aproximada && aluno.t >= ini && aluno.t < fim && primeiro && primeiro !== aluno) {
      temposAluno.push({ id, dias: (aluno.t - primeiro.t) / DIA });
    }
    const abord = hist.find((h) => h.etapa === 'abordado');
    const resp = hist.find((h) => h.etapa === 'respondeu');
    if (abord && resp && !resp.aproximada && resp.t >= abord.t && resp.t >= ini && resp.t < fim) temposResposta.push({ id, dias: (resp.t - abord.t) / DIA });
  }
  const novosNoPeriodo = novosIds.length;
  const rankMax = (id) => Math.max(-1, ...(porLead.get(id) || []).map((h) => (h.etapa in COM_RANK ? COM_RANK[h.etapa] : -1)));
  const passagem = (etapa, proxima) => {
    const base = [...entrou[etapa]];
    if (!base.length) return null;
    const foramIds = base.filter((id) => rankMax(id) >= COM_RANK[proxima]);
    const ficaramIds = base.filter((id) => rankMax(id) < COM_RANK[proxima]);
    return { base: base.length, foram: foramIds.length, taxa: foramIds.length / base.length, foramIds, ficaramIds };
  };
  const media = (v) => (v.length ? v.reduce((a, b) => a + b.dias, 0) / v.length : null);
  return {
    ids: Object.fromEntries(Object.entries(entrou).map(([k, s]) => [k, [...s]])),
    novosIds,
    novosAlunoIds,
    abordagens: entrou.abordado.size,
    respostas: entrou.respondeu.size,
    sessoes: entrou.sessao.size,
    propostas: entrou.proposta.size,
    vendas: entrou.aluno.size,
    perdidos: entrou.perdido.size,
    passagens: {
      resposta: passagem('abordado', 'respondeu'),
      sessao: passagem('respondeu', 'sessao'),
      venda: passagem('sessao', 'aluno'),
    },
    novos: novosNoPeriodo,
    conversaoLead: novosNoPeriodo ? novosAlunoIds.length / novosNoPeriodo : null,
    tempoAluno: { media: media(temposAluno), mediana: comMediana(temposAluno.map((x) => x.dias)), n: temposAluno.length, lista: temposAluno },
    tempoResposta: { media: media(temposResposta), n: temposResposta.length, lista: temposResposta },
  };
}

// Fila de abordagem: leads Novos com mensagem pronta, por prioridade e score
function comFila(leads) {
  return leads
    .filter((l) => l.etapa === 'novo' && l.garimpo && String(l.garimpo.Copy || '').trim())
    .sort((a, b) => (COM_PRIO[a.garimpo['Prioridade de abordagem']] || 9) - (COM_PRIO[b.garimpo['Prioridade de abordagem']] || 9)
      || (Number(b.garimpo['Score de Fit (0-4)']) || 0) - (Number(a.garimpo['Score de Fit (0-4)']) || 0));
}

function comPct(x) { return x == null ? '—' : Math.round(x * 100) + '%'; }
function comDias(x) { return x == null ? '—' : (x < 1 ? 'menos de 1 dia' : Math.round(x) + (Math.round(x) === 1 ? ' dia' : ' dias')); }
function comDataBR(iso) { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('pt-BR', { timeZone: 'America/Cuiaba' }); }
function comHaQuanto(iso, agora) {
  if (!iso) return '';
  const d = Math.floor((agora - new Date(iso).getTime()) / DIA);
  return d <= 0 ? 'hoje' : d === 1 ? 'há 1 dia' : 'há ' + d + ' dias';
}
function comInsta(s) { return String(s || '').trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/.*$/, '').toLowerCase(); }
// 5565999991234 -> (65) 99999-1234 ; número de fora do Brasil fica com +
function comFoneBonito(s) {
  const d = String(s || '').replace(/\D/g, '');
  const m = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  return m ? '(' + m[1] + ') ' + m[2] + '-' + m[3] : d ? '+' + d : '';
}
function comFone(s) { const d = String(s || '').replace(/\D/g, ''); return d.length >= 10 ? (d.length <= 11 ? '55' + d : d) : ''; }

if (typeof module !== 'undefined') {
  module.exports = { COM_RANK, comPeriodo, comAgruparHistorico, comIndicadores, comFila, comMediana, comPct, comDias, comInsta, comFone };
}

// =====================================================================
// TELA
// =====================================================================

if (typeof window !== 'undefined') {
  (function () {
    let sb = null;
    let leads = [], historico = [], porLead = new Map();
    let filtroPeriodo = '30', filtroOrigem = '', busca = '', abaAtual = 'indicadores';
    const limitePorColuna = {};
    let fila = [], filaPos = 0, filaSessao = { enviados: 0, descartados: 0 };
    let arrastando = null;
    let detalhes = {};

    const $ = (s) => document.querySelector(s);
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    async function lerTudo(tabela, colunas, ordem) {
      const todos = [];
      for (let de = 0; ; de += 1000) {
        const { data, error } = await sb.from(tabela).select(colunas).order(ordem).range(de, de + 999);
        if (error) throw error;
        todos.push(...data);
        if (data.length < 1000) return todos;
      }
    }

    async function carregar() {
      [leads, historico] = await Promise.all([
        lerTudo('crm_leads', 'id,nome,instagram,email,telefone,origem,origem_detalhe,etapa,etapa_em,etapa_fonte,garimpo,produto,valor_venda,motivo_perda,diagnostico_em,created_at,resumo_ia,link_sessao,nicho', 'created_at'),
        lerTudo('crm_etapas', 'lead_id,etapa,em,fonte,aproximada', 'em'),
      ]);
      porLead = comAgruparHistorico(historico);
    }

    const leadsFiltrados = () => leads.filter((l) => !filtroOrigem || l.origem === filtroOrigem);
    const nomeLead = (l) => l.nome || (l.instagram ? '@' + comInsta(l.instagram) : l.email || comFoneBonito(l.telefone) || 'Sem nome');

    // ---------- esqueleto ----------
    function montar() {
      $('#com-raiz').innerHTML =
        '<nav class="com-abas">' +
        '<button class="com-aba ativa" data-aba="indicadores" type="button">Indicadores</button>' +
        '<button class="com-aba" data-aba="leads" type="button">Leads</button>' +
        '<button class="com-aba" data-aba="abordar" type="button">Abordar <span id="com-fila-n" class="com-pilula"></span></button>' +
        '</nav>' +
        '<section id="aba-indicadores" class="com-painel"></section>' +
        '<section id="aba-leads" class="com-painel" hidden></section>' +
        '<section id="aba-abordar" class="com-painel" hidden></section>' +
        '<div id="com-aviso" class="com-aviso" role="status" aria-live="polite"></div>';
      document.querySelectorAll('.com-aba').forEach((b) => (b.onclick = () => abrirAba(b.dataset.aba)));
      const pedida = new URLSearchParams(location.search).get('aba');
      if (['indicadores', 'leads', 'abordar'].includes(pedida)) abaAtual = pedida;
    }

    function abrirAba(aba) {
      abaAtual = aba;
      document.querySelectorAll('.com-aba').forEach((b) => b.classList.toggle('ativa', b.dataset.aba === aba));
      document.querySelectorAll('.com-painel').forEach((p) => (p.hidden = p.id !== 'aba-' + aba));
      if (aba === 'abordar' && !fila.length) { fila = comFila(leads); filaPos = 0; }
      render();
    }

    let avisoTimer;
    function aviso(t, erro) {
      const a = $('#com-aviso');
      a.textContent = t; a.className = 'com-aviso visivel' + (erro ? ' erro' : '');
      clearTimeout(avisoTimer); avisoTimer = setTimeout(() => (a.className = 'com-aviso'), erro ? 7000 : 3500);
    }

    function filtrosHtml(comPeriodoSel) {
      const origens = [...new Set(leads.map((l) => l.origem).filter(Boolean))].sort((a, b) => comOrigemNome(a).localeCompare(comOrigemNome(b)));
      return '<div class="com-filtros">' +
        (comPeriodoSel ? '<label>Período<select id="f-periodo">' +
          [['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias'], ['ano', 'Este ano'], ['tudo', 'Desde o início']]
            .map(([v, t]) => '<option value="' + v + '"' + (v === filtroPeriodo ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label>' : '') +
        '<label>Origem<select id="f-origem"><option value="">Todas</option>' +
        origens.map((o) => '<option value="' + esc(o) + '"' + (o === filtroOrigem ? ' selected' : '') + '>' + esc(comOrigemNome(o)) + '</option>').join('') +
        '</select></label></div>';
    }
    function ligarFiltros() {
      const p = $('#f-periodo'), o = $('#f-origem'), b = $('#f-busca');
      if (p) p.onchange = () => { filtroPeriodo = p.value; render(); };
      if (o) o.onchange = () => { filtroOrigem = o.value; render(); };
      if (b) b.oninput = () => { busca = b.value; renderQuadro(true); };
    }

    // ---------- Indicadores ----------
    function renderIndicadores() {
      const agora = Date.now();
      const base = leadsFiltrados();
      const ind = comIndicadores(base, porLead, comPeriodo(filtroPeriodo, agora));
      const p = ind.passagens;
      const etapasFunil = [
        { nome: 'Abordagens', chave: 'abordagens', n: ind.abordagens, pass: p.resposta, rotulo: 'responderam' },
        { nome: 'Respostas', chave: 'respostas', n: ind.respostas, pass: p.sessao, rotulo: 'foram pra sessão' },
        { nome: 'Sessões', chave: 'sessoes', n: ind.sessoes, pass: p.venda, rotulo: 'compraram' },
        { nome: 'Vendas', chave: 'vendas', n: ind.vendas },
      ];
      const maior = Math.max(1, ...etapasFunil.map((e) => e.n));
      const agoraPorEtapa = COM_ETAPAS.map((e) => ({ ...e, n: base.filter((l) => l.etapa === e.id).length }));
      const temAproximada = historico.some((h) => h.aproximada);

      const porOrigem = {};
      for (const l of leads) {
        const o = l.origem || '';
        porOrigem[o] = porOrigem[o] || { leads: [], conversa: [], sessao: [], aluno: [] };
        const r = Math.max(-1, ...(porLead.get(l.id) || []).map((h) => (h.etapa in COM_RANK ? COM_RANK[h.etapa] : -1)));
        porOrigem[o].leads.push(l.id);
        if (r >= 2) porOrigem[o].conversa.push(l.id);
        if (r >= 3) porOrigem[o].sessao.push(l.id);
        if (r >= 5) porOrigem[o].aluno.push(l.id);
      }

      // ---- quem está por trás de cada número ----
      const per = comPeriodo(filtroPeriodo, agora);
      const nomePeriodo = { 7: 'nos últimos 7 dias', 30: 'nos últimos 30 dias', 90: 'nos últimos 90 dias', ano: 'neste ano', tudo: 'desde o início' }[filtroPeriodo];
      const naEtapa = (id, etapa) => {
        const hs = (porLead.get(id) || []).filter((h) => h.etapa === etapa);
        return hs.find((h) => h.t >= per[0] && h.t < per[1]) || hs[hs.length - 1];
      };
      const item = (id, etapa, extra) => {
        const h = etapa ? naEtapa(id, etapa) : (porLead.get(id) || [])[0];
        return { id, t: h ? h.t : 0, quando: h ? comDataBR(h.em) + (h.aproximada ? ' (aprox.)' : '') : '', extra: extra || '' };
      };
      const itens = (ids, etapa) => ids.map((id) => item(id, etapa));
      const passagemGrupos = (etapa, pass, sim, nao) => pass
        ? [{ nome: sim, itens: itens(pass.foramIds, etapa) }, { nome: nao, itens: itens(pass.ficaramIds, etapa) }]
        : [{ nome: '', itens: itens(ind.ids[etapa], etapa) }];
      const venda = (id) => { const l = leads.find((x) => x.id === id) || {}; return [l.produto, l.valor_venda != null ? 'R$ ' + Number(l.valor_venda).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''].filter(Boolean).join(' · '); };
      const novosNao = ind.novosIds.filter((id) => !ind.novosAlunoIds.includes(id));
      detalhes = {
        abordagens: { titulo: 'Abordagens', sub: 'Quem você abordou ' + nomePeriodo + '. Data = dia da abordagem.', grupos: passagemGrupos('abordado', p.resposta, 'Responderam', 'Ainda não responderam') },
        respostas: { titulo: 'Respostas', sub: 'Quem entrou em conversa ' + nomePeriodo + '. Data = dia da resposta.', grupos: passagemGrupos('respondeu', p.sessao, 'Foram pra sessão', 'Ainda não foram pra sessão') },
        sessoes: { titulo: 'Sessões', sub: 'Quem fez sessão ' + nomePeriodo + '. Data = dia da sessão.', grupos: passagemGrupos('sessao', p.venda, 'Compraram', 'Ainda não compraram') },
        vendas: { titulo: 'Vendas', sub: 'Quem virou aluno ' + nomePeriodo + '. Data = dia da compra.', grupos: [{ nome: '', itens: ind.ids.aluno.map((id) => item(id, 'aluno', venda(id))) }] },
        leadAluno: { titulo: 'Do lead ao aluno', sub: 'Leads que entraram ' + nomePeriodo + '. Data = dia em que o lead entrou.', grupos: [{ nome: 'Viraram aluno', itens: itens(ind.novosAlunoIds, null) }, { nome: 'Ainda não viraram aluno', itens: itens(novosNao, null) }] },
        tempoAluno: { titulo: 'Tempo até virar aluno', sub: 'Vendas ' + nomePeriodo + ' com data certa. Ao lado, os dias entre entrar como lead e comprar.', grupos: [{ nome: '', itens: ind.tempoAluno.lista.map((x) => item(x.id, 'aluno', comDias(x.dias))) }] },
        tempoResposta: { titulo: 'Tempo até responder', sub: 'Respostas ' + nomePeriodo + ' com data certa. Ao lado, os dias entre a abordagem e a resposta.', grupos: [{ nome: '', itens: ind.tempoResposta.lista.map((x) => item(x.id, 'respondeu', comDias(x.dias))) }] },
      };
      for (const e of agoraPorEtapa) {
        detalhes['agora:' + e.id] = { titulo: e.nome + ' agora', sub: 'Quem está nessa etapa hoje' + (filtroOrigem ? ' (origem: ' + comOrigemNome(filtroOrigem) + ')' : '') + '. Data = dia em que chegou nela.',
          grupos: [{ nome: '', itens: base.filter((l) => l.etapa === e.id).map((l) => ({ id: l.id, t: new Date(l.etapa_em).getTime() || 0, quando: comDataBR(l.etapa_em), extra: '' })) }] };
      }
      const nomesNivel = { leads: 'Leads', conversa: 'Chegaram a conversar', sessao: 'Chegaram à sessão', aluno: 'Viraram aluno' };
      for (const [o, v] of Object.entries(porOrigem)) {
        for (const nivel of Object.keys(nomesNivel)) {
          detalhes['org:' + o + ':' + nivel] = { titulo: comOrigemNome(o) + ' · ' + nomesNivel[nivel], sub: 'Desde o início. Data = dia em que o lead entrou.', grupos: [{ nome: '', itens: itens(v[nivel], null) }] };
        }
      }
      const num = (n, chave) => (n ? '<button type="button" class="com-num" data-det="' + esc(chave) + '" aria-label="Ver quem são">' + n + '</button>' : '0');

      $('#aba-indicadores').innerHTML = filtrosHtml(true) +
        '<div class="com-cartoes">' +
        cartao('Abordagens', ind.abordagens, 'mensagens que você mandou', false, ind.abordagens && 'abordagens') +
        cartao('Respostas', ind.respostas, p.resposta ? comPct(p.resposta.taxa) + ' dos abordados responderam' : 'de quem você abordou', false, ind.respostas && 'respostas') +
        cartao('Sessões', ind.sessoes, p.sessao ? comPct(p.sessao.taxa) + ' das conversas viraram sessão' : 'pré-diagnóstico / sessão', false, ind.sessoes && 'sessoes') +
        cartao('Vendas', ind.vendas, p.venda ? comPct(p.venda.taxa) + ' das sessões viraram venda' : 'viraram aluno', true, ind.vendas && 'vendas') +
        cartao('Do lead ao aluno', comPct(ind.conversaoLead), ind.novos ? 'de ' + ind.novos + ' leads que entraram no período' : 'nenhum lead novo no período', false, ind.novos && 'leadAluno') +
        cartao('Tempo até virar aluno', comDias(ind.tempoAluno.media), ind.tempoAluno.n ? 'média de ' + ind.tempoAluno.n + (ind.tempoAluno.n === 1 ? ' venda' : ' vendas') + (ind.tempoAluno.n > 2 ? ' · mediana ' + comDias(ind.tempoAluno.mediana) : '') : 'conta a partir das próximas vendas', false, ind.tempoAluno.n && 'tempoAluno') +
        '</div>' +
        '<section class="com-bloco"><h3>Funil do período</h3><div class="com-funil">' +
        etapasFunil.map((e) => '<' + (e.n ? 'button type="button" data-det="' + e.chave + '"' : 'div') + ' class="com-funil-linha' + (e.n ? ' clicavel' : '') + '"><span class="com-funil-nome">' + e.nome + '</span>' +
          '<span class="com-funil-trilho"><span class="com-funil-barra' + (e.nome === 'Vendas' ? ' destaque' : '') + '" style="width:' + Math.max(e.n ? 2 : 0, Math.round((e.n / maior) * 100)) + '%"></span></span>' +
          '<b class="com-funil-n">' + e.n + '</b>' +
          (e.pass ? '<small class="com-funil-pass">' + comPct(e.pass.taxa) + ' ' + e.rotulo + ' <span>(' + e.pass.foram + ' de ' + e.pass.base + ')</span></small>' : '<small class="com-funil-pass"></small>') +
          '</' + (e.n ? 'button' : 'div') + '>').join('') +
        '</div>' +
        (ind.tempoResposta.n ? '<p class="com-nota">Quem responde leva em média ' + comDias(ind.tempoResposta.media) + ' depois da abordagem (' + num(ind.tempoResposta.n, 'tempoResposta') + ' respostas).</p>' : '') +
        '<p class="com-nota">Clique em qualquer número pra ver quem são as pessoas.</p>' +
        '</section>' +
        '<section class="com-bloco"><h3>Onde estão os leads agora</h3><div class="com-agora">' +
        agoraPorEtapa.map((e) => '<button type="button" class="com-agora-item" data-det="agora:' + e.id + '"><b>' + e.n + '</b><small>' + e.nome + '</small></button>').join('') +
        '</div></section>' +
        '<section class="com-bloco"><h3>Por origem (desde o início)</h3><div class="com-rolagem"><table class="com-tabela"><thead><tr><th>Origem</th><th>Leads</th><th>Em conversa</th><th>Sessão</th><th>Aluno</th></tr></thead><tbody>' +
        Object.entries(porOrigem).sort((a, b) => b[1].leads.length - a[1].leads.length).map(([o, v]) =>
          '<tr><td>' + esc(comOrigemNome(o)) + '</td>' + ['leads', 'conversa', 'sessao', 'aluno'].map((k) => '<td>' + num(v[k].length, 'org:' + o + ':' + k) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table></div><p class="com-nota">"Em conversa", "Sessão" e "Aluno" contam quem chegou até essa etapa em algum momento.</p></section>' +
        (temAproximada ? '<p class="com-nota">Leads trazidos da planilha e do CRM antigo têm datas aproximadas (a última data registrada). Daqui pra frente cada mudança de etapa guarda o dia certo, e o tempo até virar aluno só usa vendas com data certa.</p>' : '');
      ligarFiltros();
      document.querySelectorAll('#aba-indicadores [data-det]').forEach((b) => (b.onclick = () => abrirLista(b.dataset.det)));
    }
    function cartao(titulo, valor, sub, destaque, chave) {
      const tag = chave ? 'button type="button" data-det="' + chave + '"' : 'div';
      return '<' + tag + ' class="com-cartao' + (destaque ? ' destaque' : '') + (chave ? ' clicavel' : '') + '"><small>' + esc(titulo) + '</small><b>' + esc(valor) + '</b><span>' + esc(sub) + '</span>' +
        (chave ? '<i class="com-ver">Ver quem →</i>' : '') + '</' + (chave ? 'button' : 'div') + '>';
    }

    // ---------- Lista de pessoas por trás de um número ----------
    function abrirLista(chave) {
      const d = detalhes[chave];
      if (!d) return;
      const total = d.grupos.reduce((s, g) => s + g.itens.length, 0);
      const linha = (it) => {
        const l = leads.find((x) => x.id === it.id);
        if (!l) return '';
        const insta = comInsta(l.instagram || (l.garimpo || {})['@']);
        return '<li><button type="button" class="com-lista-item" data-id="' + l.id + '">' +
          '<span class="com-lista-quem"><b>' + esc(nomeLead(l)) + '</b><small>' + (insta && l.nome ? '@' + esc(insta) + ' · ' : '') + esc(comOrigemNome(l.origem)) + '</small></span>' +
          '<span class="com-lista-info"><span class="com-tag">' + esc(COM_NOME_ETAPA[l.etapa] || l.etapa) + '</span><small>' + esc([it.quando, it.extra].filter(Boolean).join(' · ')) + '</small></span>' +
          '</button></li>';
      };
      const fundo = document.createElement('div');
      fundo.className = 'com-modal-fundo lista';
      fundo.innerHTML = '<div class="com-modal com-modal-lista" role="dialog" aria-modal="true" aria-label="' + esc(d.titulo) + '">' +
        '<div class="com-modal-topo"><div><h2>' + esc(d.titulo) + ' <span class="com-lista-total">' + total + '</span></h2><small>' + esc(d.sub) + ' A etiqueta mostra a etapa de hoje.</small></div>' +
        '<button type="button" class="com-fechar" aria-label="Fechar">×</button></div>' +
        d.grupos.map((g) => (g.nome ? '<h4>' + esc(g.nome) + ' <span class="com-lista-total">' + g.itens.length + '</span></h4>' : '') +
          (g.itens.length ? '<ul class="com-lista">' + g.itens.slice().sort((a, b) => b.t - a.t).map(linha).join('') + '</ul>' : '<p class="com-nota">Ninguém.</p>')).join('') +
        '</div>';
      document.body.appendChild(fundo);
      const fechar = () => { fundo.remove(); document.removeEventListener('keydown', tecla); };
      const tecla = (ev) => { if (ev.key === 'Escape' && modalDoTopo() === fundo) fechar(); };
      document.addEventListener('keydown', tecla);
      fundo.onclick = (ev) => { if (ev.target === fundo) fechar(); };
      fundo.querySelector('.com-fechar').onclick = fechar;
      fundo.querySelectorAll('.com-lista-item').forEach((b) => (b.onclick = () => abrirLead(b.dataset.id)));
      fundo.querySelector('.com-fechar').focus();
    }
    const modalDoTopo = () => [...document.querySelectorAll('.com-modal-fundo')].pop();

    // ---------- Quadro de leads ----------
    function renderQuadro(soColunas) {
      const agora = Date.now();
      const termo = busca.trim().toLowerCase();
      const base = leadsFiltrados().filter((l) => !termo || [l.nome, l.instagram, l.email, l.telefone].some((x) => String(x || '').toLowerCase().includes(termo)));
      if (!soColunas) {
        $('#aba-leads').innerHTML = '<div class="com-filtros">' + filtrosHtml(false).replace('<div class="com-filtros">', '').replace(/<\/div>$/, '') +
          '<label class="com-busca">Buscar<input id="f-busca" type="search" placeholder="nome, @, e-mail ou telefone" value="' + esc(busca) + '"></label></div>' +
          '<p class="com-nota com-so-desktop">Arraste o card pra mudar de etapa, ou clique nele pra ver tudo e mudar por lá.</p>' +
          '<p class="com-nota com-so-celular">Toque no card pra ver tudo e mudar a etapa. Deslize pro lado pra ver as outras colunas.</p>' +
          '<div id="com-quadro" class="com-quadro"></div>';
        ligarFiltros();
      }
      $('#com-quadro').innerHTML = COM_ETAPAS.map((e) => {
        const daEtapa = base.filter((l) => l.etapa === e.id).sort((a, b) => new Date(b.etapa_em) - new Date(a.etapa_em));
        const lim = limitePorColuna[e.id] || 40;
        return '<div class="com-coluna" data-etapa="' + e.id + '"><div class="com-coluna-topo"><b>' + e.nome + '</b><span>' + daEtapa.length + '</span></div><div class="com-coluna-cards">' +
          daEtapa.slice(0, lim).map((l) => cardLead(l, agora)).join('') +
          (daEtapa.length > lim ? '<button type="button" class="com-mais" data-etapa="' + e.id + '">Mostrar mais ' + Math.min(40, daEtapa.length - lim) + '</button>' : '') +
          (daEtapa.length ? '' : '<p class="com-vazio">Nenhum lead</p>') +
          '</div></div>';
      }).join('');
      document.querySelectorAll('.com-card').forEach((c) => {
        c.onclick = () => abrirLead(c.dataset.id);
        c.ondragstart = (ev) => { arrastando = c.dataset.id; c.classList.add('arrastando'); ev.dataTransfer.effectAllowed = 'move'; };
        c.ondragend = () => { arrastando = null; c.classList.remove('arrastando'); };
      });
      document.querySelectorAll('.com-coluna').forEach((col) => {
        col.ondragover = (ev) => { if (arrastando) { ev.preventDefault(); col.classList.add('alvo'); } };
        col.ondragleave = () => col.classList.remove('alvo');
        col.ondrop = (ev) => { ev.preventDefault(); col.classList.remove('alvo'); if (arrastando) mudarEtapa(arrastando, col.dataset.etapa); };
      });
      document.querySelectorAll('.com-mais').forEach((b) => (b.onclick = () => { limitePorColuna[b.dataset.etapa] = (limitePorColuna[b.dataset.etapa] || 40) + 40; renderQuadro(true); }));
    }
    function cardLead(l, agora) {
      const g = l.garimpo || {};
      const prio = g['Prioridade de abordagem'];
      return '<div class="com-card" draggable="true" data-id="' + l.id + '" tabindex="0">' +
        '<b>' + esc(nomeLead(l)) + '</b>' +
        (l.instagram && l.nome ? '<small>@' + esc(comInsta(l.instagram)) + '</small>' : '') +
        '<div class="com-card-rodape"><span class="com-tag">' + esc(comOrigemNome(l.origem)) + '</span>' +
        (prio && l.etapa === 'novo' ? '<span class="com-tag prio-' + esc(prio === 'Média' ? 'media' : prio.toLowerCase()) + '">' + esc(prio) + '</span>' : '') +
        '<span class="com-quando">' + comHaQuanto(l.etapa_em, agora) + '</span></div></div>';
    }

    async function mudarEtapa(id, etapa, extra) {
      const l = leads.find((x) => x.id === id);
      if (!l || (l.etapa === etapa && !extra)) return true;
      const antes = l.etapa;
      const dados = { etapa, etapa_fonte: (extra && extra.fonte) || 'painel', ...(extra && extra.campos) };
      const { data, error } = await sb.from('crm_leads').update(dados).eq('id', id).select('etapa,etapa_em,etapa_fonte,garimpo,produto,valor_venda,motivo_perda').single();
      if (error) { aviso('Não salvou: ' + error.message, true); return false; }
      Object.assign(l, data);
      if (antes !== etapa) {
        const novo = { lead_id: id, etapa, em: data.etapa_em, fonte: data.etapa_fonte, aproximada: false };
        historico.push(novo);
        porLead = comAgruparHistorico(historico);
        if (!(extra && extra.silencioso)) aviso(nomeLead(l) + ' → ' + COM_NOME_ETAPA[etapa]);
      }
      if (abaAtual === 'leads') renderQuadro(true);
      return true;
    }

    // ---------- Ficha do lead ----------
    async function abrirLead(id) {
      const l = leads.find((x) => x.id === id);
      if (!l) return;
      const g = l.garimpo || {};
      const insta = comInsta(l.instagram || g['@']);
      const fone = comFone(l.telefone);
      const hist = (porLead.get(id) || []).slice().reverse();
      const fundo = document.createElement('div');
      fundo.className = 'com-modal-fundo';
      fundo.innerHTML = '<div class="com-modal" role="dialog" aria-modal="true" aria-label="Lead">' +
        '<div class="com-modal-topo"><div><h2>' + esc(nomeLead(l)) + '</h2><small>' + esc(comOrigemNome(l.origem)) + (l.origem_detalhe ? ' · ' + esc(l.origem_detalhe) : '') + '</small></div>' +
        '<button type="button" class="com-fechar" aria-label="Fechar">×</button></div>' +
        '<div class="com-links">' +
        (insta ? '<a href="https://www.instagram.com/' + esc(insta) + '/" target="_blank" rel="noopener">Instagram @' + esc(insta) + '</a>' : '') +
        (fone ? '<a href="https://wa.me/' + fone + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
        (l.email ? '<a href="mailto:' + esc(l.email) + '">' + esc(l.email) + '</a>' : '') +
        (l.link_sessao ? '<a href="' + esc(l.link_sessao) + '" target="_blank" rel="noopener">Sessão</a>' : '') +
        '</div>' +
        '<label class="com-campo">Etapa<select id="m-etapa">' + COM_ETAPAS.concat([{ id: 'descartado', nome: 'Descartado' }]).map((e) => '<option value="' + e.id + '"' + (e.id === l.etapa ? ' selected' : '') + '>' + e.nome + '</option>').join('') + '</select></label>' +
        '<div class="com-linha2" id="m-aluno"' + (l.etapa === 'aluno' ? '' : ' hidden') + '>' +
        '<label class="com-campo">Produto<input id="m-produto" value="' + esc(l.produto || '') + '" placeholder="ex.: Método VIP"></label>' +
        '<label class="com-campo">Valor (R$)<input id="m-valor" inputmode="decimal" value="' + esc(l.valor_venda == null ? '' : String(l.valor_venda).replace('.', ',')) + '"></label></div>' +
        '<label class="com-campo" id="m-perda"' + (l.etapa === 'perdido' ? '' : ' hidden') + '>Por que perdeu?<input id="m-motivo" value="' + esc(l.motivo_perda || '') + '" placeholder="ex.: achou caro, sumiu"></label>' +
        '<button type="button" class="com-btn com-btn-primario" id="m-salvar">Salvar</button>' +
        (g['Fato-gancho'] ? '<h4>Gancho</h4><p>' + esc(g['Fato-gancho']) + '</p>' : '') +
        (g.Bio ? '<h4>Bio</h4><p>' + esc(g.Bio) + '</p>' : '') +
        (g.Copy ? '<h4>Mensagem de abordagem</h4><p class="com-pre">' + esc(g.Copy) + '</p>' : '') +
        (l.resumo_ia ? '<h4>Resumo</h4><p class="com-pre">' + esc(l.resumo_ia) + '</p>' : '') +
        '<h4>Anotações</h4><div id="m-notas"><p class="com-nota">Carregando…</p></div>' +
        '<div class="com-nova-nota"><textarea id="m-nota" rows="2" placeholder="O que aconteceu? (ex.: respondeu no direct, quer saber preço)"></textarea>' +
        '<label class="com-campo">Próximo contato<input id="m-prox" type="date"></label>' +
        '<button type="button" class="com-btn" id="m-anotar">Anotar</button></div>' +
        '<h4>Caminho no funil</h4><ol class="com-hist">' +
        hist.map((h) => '<li><b>' + esc(COM_NOME_ETAPA[h.etapa] || h.etapa) + '</b> <span>' + comDataBR(h.em) + (h.aproximada ? ' (aprox.)' : '') + ' · ' + esc(COM_FONTES[h.fonte] || h.fonte) + '</span></li>').join('') +
        '</ol></div>';
      document.body.appendChild(fundo);
      const fechar = () => { fundo.remove(); document.removeEventListener('keydown', tecla); };
      const tecla = (ev) => { if (ev.key === 'Escape' && modalDoTopo() === fundo) fechar(); };
      document.addEventListener('keydown', tecla);
      fundo.onclick = (ev) => { if (ev.target === fundo) fechar(); };
      fundo.querySelector('.com-fechar').onclick = fechar;
      const selEtapa = fundo.querySelector('#m-etapa');
      selEtapa.onchange = () => {
        fundo.querySelector('#m-aluno').hidden = selEtapa.value !== 'aluno';
        fundo.querySelector('#m-perda').hidden = selEtapa.value !== 'perdido';
      };
      fundo.querySelector('#m-salvar').onclick = async () => {
        const campos = {};
        if (selEtapa.value === 'aluno') {
          campos.produto = fundo.querySelector('#m-produto').value.trim() || null;
          const v = fundo.querySelector('#m-valor').value.trim().replace(/\./g, '').replace(',', '.');
          campos.valor_venda = v ? Number(v) : null;
          if (v && isNaN(campos.valor_venda)) return aviso('Valor inválido', true);
        }
        if (selEtapa.value === 'perdido') campos.motivo_perda = fundo.querySelector('#m-motivo').value.trim() || null;
        const ok = await mudarEtapa(id, selEtapa.value, { campos });
        if (ok) {
          aviso('Salvo'); fechar();
          // a lista aberta por trás ficou velha: fecha e redesenha os números
          document.querySelectorAll('.com-modal-fundo.lista').forEach((x) => x.remove());
          if (abaAtual === 'indicadores') renderIndicadores();
        }
      };
      fundo.querySelector('#m-anotar').onclick = async () => {
        const txt = fundo.querySelector('#m-nota').value.trim();
        const prox = fundo.querySelector('#m-prox').value;
        if (!txt && !prox) return;
        const { error } = await sb.from('crm_followups').insert({ lead_id: id, autor: 'Karol', observacao: txt || null, proximo_contato_em: prox ? prox + 'T12:00:00-04:00' : null, origem_registro: 'painel_comercial' });
        if (error) return aviso('Não anotou: ' + error.message, true);
        fundo.querySelector('#m-nota').value = ''; fundo.querySelector('#m-prox').value = '';
        aviso('Anotado'); carregarNotas(id, fundo);
      };
      carregarNotas(id, fundo);
      selEtapa.focus();
    }
    async function carregarNotas(id, fundo) {
      const { data, error } = await sb.from('crm_followups').select('created_at,autor,observacao,proximo_contato_em').eq('lead_id', id).order('created_at', { ascending: false }).limit(30);
      const alvo = fundo.querySelector('#m-notas');
      if (!alvo) return;
      if (error) { alvo.innerHTML = '<p class="com-nota">Não consegui ler as anotações.</p>'; return; }
      alvo.innerHTML = data.length ? '<ul class="com-notas">' + data.map((n) => '<li><span>' + comDataBR(n.created_at) + (n.autor ? ' · ' + esc(n.autor) : '') + '</span>' +
        (n.observacao ? '<p>' + esc(n.observacao) + '</p>' : '') + (n.proximo_contato_em ? '<small>Próximo contato: ' + comDataBR(n.proximo_contato_em) + '</small>' : '') + '</li>').join('') + '</ul>'
        : '<p class="com-nota">Nenhuma anotação ainda.</p>';
    }

    // ---------- Abordar (fila) ----------
    function renderAbordar() {
      const el = $('#aba-abordar');
      const restantes = Math.max(fila.length - filaPos, 0);
      const topo = '<div class="com-fila-topo"><span>' + filaSessao.enviados + ' enviadas · ' + filaSessao.descartados + ' descartadas nesta sessão · <b>' + restantes + ' na fila</b></span></div>';
      if (filaPos >= fila.length) {
        el.innerHTML = topo + '<div class="com-fila-cartao com-fila-fim"><h2>Fila zerada</h2><p>Todo lead novo com mensagem pronta já foi abordado ou descartado. Quando o Garimpo trouxer mais, eles aparecem aqui.</p></div>';
        return;
      }
      const l = fila[filaPos], g = l.garimpo || {};
      const insta = comInsta(l.instagram || g['@']);
      const prio = g['Prioridade de abordagem'];
      el.innerHTML = topo + '<div class="com-fila-cartao">' +
        '<div class="com-fila-quem"><div><h2>' + esc(l.nome || '@' + insta) + '</h2><small>@' + esc(insta) + '</small></div>' +
        (prio ? '<span class="com-tag prio-' + esc(prio === 'Média' ? 'media' : prio.toLowerCase()) + '">Prioridade ' + esc(prio) + '</span>' : '') + '</div>' +
        (g['Fato-gancho'] ? '<p class="com-gancho">' + esc(g['Fato-gancho']) + '</p>' : '') +
        '<label class="com-campo">Mensagem (pode ajustar antes de copiar)<textarea id="fila-texto" rows="8">' + esc(g.Copy) + '</textarea></label>' +
        '<div class="com-fila-botoes">' +
        '<button type="button" class="com-btn com-btn-primario" id="fila-copiar">1. Copiar e abrir perfil</button>' +
        '<button type="button" class="com-btn com-btn-escuro" id="fila-enviei">2. Enviei</button>' +
        '<button type="button" class="com-btn" id="fila-descartar">Descartar</button>' +
        '<button type="button" class="com-btn" id="fila-pular">Pular por agora</button>' +
        '</div><p class="com-nota">No Instagram: "Enviar mensagem" → colar → enviar. Depois volte aqui e clique em "Enviei".</p></div>';
      const botoes = el.querySelectorAll('.com-fila-botoes button');
      const texto = el.querySelector('#fila-texto');
      el.querySelector('#fila-copiar').onclick = async () => {
        try { await navigator.clipboard.writeText(texto.value); } catch (e) { texto.select(); document.execCommand('copy'); }
        window.open('https://www.instagram.com/' + insta + '/', 'instagram');
        aviso('Mensagem copiada');
      };
      const gravar = async (etapa) => {
        botoes.forEach((b) => (b.disabled = true));
        const campos = {};
        if (etapa === 'abordado' && texto.value !== g.Copy) campos.garimpo = { ...g, Copy: texto.value }; // guarda o texto que foi de fato
        const ok = await mudarEtapa(l.id, etapa, { fonte: 'fila', campos, silencioso: true });
        botoes.forEach((b) => (b.disabled = false));
        if (!ok) return;
        if (etapa === 'abordado') filaSessao.enviados++; else filaSessao.descartados++;
        aviso((etapa === 'abordado' ? 'Abordado: ' : 'Descartado: ') + (l.nome || '@' + insta));
        filaPos++; atualizarPilula(); renderAbordar();
      };
      el.querySelector('#fila-enviei').onclick = () => gravar('abordado');
      el.querySelector('#fila-descartar').onclick = () => gravar('descartado');
      el.querySelector('#fila-pular').onclick = () => { fila.push(fila.splice(filaPos, 1)[0]); renderAbordar(); };
    }
    function atualizarPilula() {
      const n = comFila(leads).length;
      const p = $('#com-fila-n');
      if (p) p.textContent = n ? String(n) : '';
    }

    function render() {
      atualizarPilula();
      if (abaAtual === 'indicadores') renderIndicadores();
      else if (abaAtual === 'leads') renderQuadro(false);
      else renderAbordar();
    }

    document.addEventListener('DOMContentLoaded', async () => {
      sb = getSupabase();
      const raiz = $('#com-raiz');
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { window.location.href = 'index.html?volta=comercial'; return; }
      if ((session.user.email || '').toLowerCase() !== COM_EMAIL) {
        raiz.innerHTML = '<div class="com-restrita"><h1>Página restrita</h1></div>';
        return;
      }
      $('#com-email').textContent = session.user.email;
      montar();
      try { await carregar(); } catch (e) { raiz.insertAdjacentHTML('afterbegin', '<p class="com-erro">Não consegui carregar os leads: ' + esc(e.message || e) + '</p>'); return; }
      abrirAba(abaAtual);
    });
  })();
}
