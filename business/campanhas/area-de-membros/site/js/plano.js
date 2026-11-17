// Expert Plan dentro do Painel Comercial (16/11/2026). Aba "Plano" + meta da semana na aba Abordar.
// Contas iguais às da planilha M5.1 (business/campanhas/expert360-curso/materiais/M5/_gerar-expert-plan.py).
// Plano guardado em plano_expert (1 linha, JSON). Realizado: CRM (vendas, abordagens, sessões, anotações) e financeiro (caixa).
// Doc de trabalho: business/processos/painel-comercial.md

const PLANO_FUNIS = ['Vendas Secretas', 'Lives Secretas', 'Mini-treinamento', 'VSL', 'Venda por mensagem'];
const PLANO_ESTAGIOS = ['', '1 · Vendas Secretas', '2 · + Lives Secretas', '3 · + Mini-treinamento', '4 · + Venda por mensagem', '5 · + VSL'];
// Produto Ao vivo: de onde vêm as vendas em cada estágio (VS, Lives, Mini, VSL, Mensagem)
const PLANO_DIST = { 1: [1, 0, 0, 0, 0], 2: [0.6, 0.4, 0, 0, 0], 3: [0.4, 0.35, 0.25, 0, 0], 4: [0.3, 0.3, 0.2, 0, 0.2], 5: [0.3, 0.3, 0.2, 0, 0.2] };
const PLANO_DIST_GRAVADO = [0, 0, 0, 0.7, 0.3]; // só no estágio 5
// Origem do lead no CRM -> funil do plano (pra contar as vendas reais por funil)
const PLANO_ORIGEM_FUNIL = {
  sessao_estrategica: 0, garimpo_instagram: 5, prospeccao_ativa: 0, black_expert_manual: 0,
  grupo_whatsapp: 1, webinar_metodo_1h: 2, comprador_outro_produto: 3, compra_direta: 3, dualhook_whatsapp: 4,
};
const PLANO_MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// arredonda pra cima sem cair no erro de conta quebrada (1,8/0,2 = 9,000000000000002)
function planoCeil(x) { return x > 0 && isFinite(x) ? Math.ceil(x - 1e-9) : 0; }
function planoDiv(a, taxa) { return taxa > 0 ? planoCeil(a / taxa) : 0; }

// '2026-12' + i -> '2027-01'
function planoMesChave(inicio, i) {
  const [a, m] = inicio.split('-').map(Number);
  const d = new Date(a, m - 1 + i, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function planoMesNome(chave) { const [a, m] = chave.split('-'); return PLANO_MESES[Number(m) - 1] + '/' + a.slice(2); }

// Taxas do Garimpo (frio). Ponto de partida: conta da Karol, 45 abordagens frias -> 1 sessão marcada (17/11/2026)
function planoFrio(p) {
  const f = (p.taxas && p.taxas.frio) || {};
  return { porDia: Number(f.porDia ?? 8) || 0, sessao: Number(f.sessao ?? 1 / 45), comparece: Number(f.comparece ?? 0.8), fecha: Number(f.fecha ?? 0.2) };
}

// Tudo o que o plano pede, mês a mês
function planoCalcular(p) {
  const T = p.taxas, sem = p.semanasMes || 4;
  const meses = [];
  for (let i = 0; i < p.meses; i++) {
    const s = Number(p.estagio[i]) || 1;
    const funil = [0, 0, 0, 0, 0];
    let faturamento = 0, vendas = 0, gravadoFora = false;
    for (const pr of p.produtos) {
      const v = Number(pr.vendas[i]) || 0;
      faturamento += v * (Number(pr.preco) || 0);
      vendas += v;
      if (!v) continue;
      if (pr.tipo === 'Ao vivo') PLANO_DIST[s].forEach((d, j) => (funil[j] += v * d));
      else if (pr.tipo === 'Gravado') { if (s === 5) PLANO_DIST_GRAVADO.forEach((d, j) => (funil[j] += v * d)); else gravadoFora = true; }
      else funil[4] += v;
    }
    const vs = {}, lv = {}, mi = {}, ms = {}, vl = {};
    vs.vendas = funil[0]; vs.realizadas = planoDiv(vs.vendas, T.vs.fecha); vs.agendadas = planoDiv(vs.realizadas, T.vs.comparece);
    vs.conversas = planoDiv(vs.agendadas, T.vs.aceita); vs.abordagens = planoDiv(vs.conversas, T.vs.responde);
    lv.vendas = funil[1]; lv.realizadas = planoDiv(lv.vendas, T.lives.fecha); lv.agendadas = planoDiv(lv.realizadas, T.lives.comparece);
    lv.assistiram = planoDiv(lv.agendadas, T.lives.pede); lv.novos = planoDiv(lv.assistiram, T.lives.assiste); lv.convites = planoDiv(lv.novos, T.lives.entra);
    lv.lives = lv.vendas ? Number(T.lives.porMes) || 0 : 0; lv.porLive = lv.lives ? planoCeil(lv.assistiram / lv.lives) : 0;
    mi.vendas = funil[2]; mi.realizadas = planoDiv(mi.vendas, T.mini.fecha); mi.agendadas = planoDiv(mi.realizadas, T.mini.comparece);
    mi.leads = planoDiv(mi.agendadas, T.mini.agenda); mi.visitantes = planoDiv(mi.leads, T.mini.vira);
    ms.vendas = funil[4]; ms.conversas = planoDiv(ms.vendas, T.msg.fecha); ms.levantadas = planoDiv(ms.conversas, T.msg.conversa);
    vl.vendas = funil[3]; vl.visitantes = planoDiv(vl.vendas, T.vsl.compra);
    // Garimpo (abordagem fria): conta de frente pra trás, pela capacidade de abordar; as vendas são extra, por cima da meta
    const F = planoFrio(p), ao = p.produtos.filter((q) => q.tipo === 'Ao vivo' && Number(q.vendas[i]) > 0);
    const ticket = ao.length ? ao.reduce((a, q) => a + q.preco * q.vendas[i], 0) / ao.reduce((a, q) => a + Number(q.vendas[i]), 0) : 0;
    const fr = { abordagens: F.porDia * 5 * sem };
    fr.agendadas = fr.abordagens * F.sessao; fr.realizadas = fr.agendadas * F.comparece; fr.vendas = fr.realizadas * F.fecha; fr.faturamento = fr.vendas * ticket;
    const sessoesMes = vs.agendadas + lv.agendadas + mi.agendadas + fr.agendadas;
    const followMes = Math.max(0, vs.realizadas + lv.realizadas + mi.realizadas + fr.realizadas - (vs.vendas + lv.vendas + mi.vendas + fr.vendas));
    const semana = {
      frias: F.porDia * 5,
      friasDia: F.porDia,
      abordagens: planoCeil(vs.abordagens / sem),
      lives: lv.lives / sem,
      convites: planoCeil(lv.convites / sem),
      visitantesMini: planoCeil(mi.visitantes / sem),
      levantadas: planoCeil(ms.levantadas / sem),
      conversasMsg: planoCeil(ms.conversas / sem),
      visitantesVsl: planoCeil(vl.visitantes / sem),
      sessoes: planoCeil(sessoesMes / sem),
      followups: planoCeil(followMes / sem),
    };
    semana.cabe = semana.sessoes <= (Number(p.capacidade) || 0);
    semana.abordagensDia = planoCeil(semana.abordagens / 5);
    meses.push({ chave: planoMesChave(p.inicio, i), estagio: s, faturamento, vendas, funil, gravadoFora, vs, lv, mi, ms, vl, fr, sessoesMes, followMes, semana });
  }
  let acc = 0;
  for (const m of meses) { acc += m.faturamento; m.acumulado = acc; }
  return { meses, meta: acc };
}

// Realizado por mês: vendas (CRM, etapa Aluno) por produto e por funil; caixa (financeiro)
function planoRealizado(p, leads, historico, lancamentos) {
  const r = {};
  const mes = (iso) => String(iso || '').slice(0, 7);
  const garante = (k) => (r[k] = r[k] || { vendas: 0, porProduto: {}, outros: 0, porFunil: [0, 0, 0, 0, 0, 0], caixa: 0 });
  const primeiraVenda = new Map();
  for (const h of historico) if (h.etapa === 'aluno' && !primeiraVenda.has(h.lead_id)) primeiraVenda.set(h.lead_id, h.em);
  for (const l of leads) {
    const em = primeiraVenda.get(l.id);
    if (!em) continue;
    const x = garante(mes(em));
    x.vendas++;
    const nome = String(l.produto || '').toLowerCase();
    const pr = nome && p.produtos.find((q) => (q.chaves || [q.nome]).some((c) => nome.includes(String(c).toLowerCase())));
    if (pr) x.porProduto[pr.nome] = (x.porProduto[pr.nome] || 0) + 1; else x.outros++;
    const f = PLANO_ORIGEM_FUNIL[l.origem];
    if (f != null) x.porFunil[f]++;
  }
  for (const l of lancamentos) {
    const v = Number(l.valor_bruto) || 0;
    garante(mes(l.data_caixa || l.data_competencia)).caixa += l.natureza === 'estorno' ? -Math.abs(v) : v;
  }
  return r;
}

// Segunda-feira 00h da semana de 'agora'
function planoInicioSemana(agora) {
  const d = new Date(agora); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

// Feito na semana: abordagens e sessões (histórico de etapas) e follow-ups (anotações do CRM)
// leads (opcional): separa abordagem fria (Garimpo) da quente
function planoSemanaFeita(historico, followups, agora, leads) {
  const ini = planoInicioSemana(agora);
  const frio = new Set((leads || []).filter((l) => l.origem === 'garimpo_instagram').map((l) => l.id));
  const ids = (etapa) => new Set(historico.filter((h) => h.etapa === etapa && new Date(h.em).getTime() >= ini).map((h) => h.lead_id));
  const conta = (etapa) => ids(etapa).size;
  const abord = [...ids('abordado')];
  return {
    abordagens: abord.filter((id) => !frio.has(id)).length,
    frias: abord.filter((id) => frio.has(id)).length,
    sessoes: conta('sessao'),
    followups: new Set(followups.filter((f) => new Date(f.created_at).getTime() >= ini).map((f) => f.lead_id)).size,
  };
}

if (typeof module !== 'undefined') {
  module.exports = { planoCalcular, planoRealizado, planoSemanaFeita, planoMesChave, planoInicioSemana, planoCeil };
}

// =====================================================================
// TELA
// =====================================================================

if (typeof window !== 'undefined') {
  window.Plano = (function () {
    let sb = null, plano = null, salvo = '', lancamentos = [], followups = [], ctx = null, el = null;
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const brl = (n) => 'R$ ' + Math.round(Number(n) || 0).toLocaleString('pt-BR');
    const pct = (x) => (x == null ? '—' : (Math.round(x * 1000) / 10).toLocaleString('pt-BR') + '%');
    const num1 = (x) => (Math.round(x * 10) / 10).toLocaleString('pt-BR');
    const mesAtual = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };

    async function carregar(cliente) {
      sb = cliente;
      const { data, error } = await sb.from('plano_expert').select('dados').eq('id', 'atual').maybeSingle();
      if (error) throw error;
      plano = data ? data.dados : null;
      salvo = JSON.stringify(plano);
      const desde = [plano ? plano.inicio : '9999-12', mesAtual()].sort()[0] + '-01';
      const umaSemana = new Date(planoInicioSemana(Date.now()) - 86400000).toISOString();
      const [fin, fu] = await Promise.all([
        sb.from('fin_lancamentos').select('natureza,valor_bruto,data_caixa,data_competencia').in('natureza', ['receita', 'estorno']).gte('data_caixa', desde).limit(5000),
        sb.from('crm_followups').select('lead_id,created_at').gte('created_at', umaSemana).limit(5000),
      ]);
      if (fin.error) throw fin.error;
      lancamentos = fin.data || [];
      followups = fu.error ? [] : fu.data || [];
    }

    const mudou = () => JSON.stringify(plano) !== salvo;

    // linha curta pra aba Abordar
    function semanaHtml(historico, leads) {
      if (!plano) return '';
      const calc = planoCalcular(plano);
      const m = calc.meses.find((x) => x.chave === mesAtual());
      if (!m) return '';
      const f = planoSemanaFeita(historico, followups, Date.now(), leads);
      return '<div class="pl-semana-linha">Meta da semana: <b>' + f.abordagens + ' de ' + m.semana.abordagens + '</b> abordagens quentes · <b>' + f.frias + ' de ' + m.semana.frias + '</b> frias (Garimpo) · <b>' +
        f.sessoes + ' de ' + m.semana.sessoes + '</b> sessões · <b>' + f.followups + ' de ' + m.semana.followups + '</b> follow-ups</div>';
    }

    function render(alvo, contexto) {
      el = alvo; ctx = contexto;
      if (!plano) { el.innerHTML = '<div class="com-bloco"><h3>Plano</h3><p>Nenhum plano gravado ainda.</p></div>'; return; }
      const calc = planoCalcular(plano);
      const real = planoRealizado(plano, ctx.leads, ctx.historico, lancamentos);
      const agoraMes = mesAtual();
      const chaves = calc.meses.map((m) => m.chave);
      const cab = '<th></th>' + chaves.map((k) => '<th' + (k === agoraMes ? ' class="pl-agora"' : '') + '>' + planoMesNome(k) + '</th>').join('');
      const passou = (k) => k <= agoraMes;

      el.innerHTML =
        '<div class="pl-barra"><span id="pl-estado">' + (mudou() ? 'Alterações não salvas' : 'Plano salvo') + '</span>' +
        '<button type="button" class="com-btn com-btn-primario" id="pl-salvar"' + (mudou() ? '' : ' disabled') + '>Salvar plano</button></div>' +
        blocoMes(calc, real, agoraMes) +
        blocoEstrategico(calc, real, cab, chaves, agoraMes, passou) +
        blocoTatico(calc, real, cab, chaves, passou) +
        blocoRotina(calc, cab) +
        blocoTaxas();
      ligar();
    }

    function blocoMes(calc, real, agoraMes) {
      let m = calc.meses.find((x) => x.chave === agoraMes);
      const antes = !m && agoraMes < plano.inicio;
      if (!m) m = antes ? calc.meses[0] : calc.meses[calc.meses.length - 1];
      const hoje = new Date(), diasMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
      const r = real[m.chave] || { caixa: 0, vendas: 0 };
      const f = planoSemanaFeita(ctx.historico, followups, Date.now(), ctx.leads);
      const sem = m.semana;
      if (antes) {
        return '<section class="com-bloco"><h3>O plano começa em ' + planoMesNome(plano.inicio) + '</h3>' +
          '<div class="com-cartoes">' +
          card('Meta de ' + planoMesNome(m.chave), brl(m.faturamento), m.vendas + ' vendas planejadas', true) +
          card('Meta dos ' + plano.meses + ' meses', brl(calc.meta), 'até ' + planoMesNome(calc.meses[calc.meses.length - 1].chave)) +
          card('Abordagens quentes por semana', sem.abordagens, sem.abordagensDia + ' por dia útil, pra quem já te conhece') +
          card('Abordagens frias por semana', sem.frias, sem.friasDia + ' por dia útil no Garimpo') +
          card('Sessões por semana', sem.sessoes, (sem.cabe ? 'cabe' : 'passou') + ' na sua agenda (' + plano.capacidade + ' por semana)') +
          '</div><p class="com-nota">Esta semana até agora: ' + f.abordagens + ' abordagens quentes · ' + f.frias + ' frias · ' + f.sessoes + ' sessões · ' + f.followups + ' follow-ups.</p></section>';
      }
      const falta = Math.max(0, m.faturamento - r.caixa);
      const diasRest = diasMes - hoje.getDate() + 1, semRest = Math.max(1, Math.ceil(diasRest / 7));
      const situacao = r.caixa >= m.faturamento ? 'Meta do mês batida!' : r.caixa >= m.faturamento * (hoje.getDate() / diasMes) ? 'No ritmo' : 'Abaixo do ritmo: acelere as abordagens e os follow-ups';
      return '<section class="com-bloco"><h3>Este mês (' + planoMesNome(m.chave) + ')</h3>' +
        '<div class="com-cartoes">' +
        card('Meta do mês', brl(m.faturamento), m.vendas + ' vendas planejadas') +
        card('Entrou no caixa', brl(r.caixa), r.vendas + ' vendas novas no CRM', true) +
        card('Falta', brl(falta), situacao) +
        card('Falta por semana', brl(falta / semRest), semRest + (semRest === 1 ? ' semana' : ' semanas') + ' até o fim do mês') +
        '</div><h3>Esta semana</h3><div class="com-cartoes">' +
        card('Abordagens quentes', f.abordagens + ' de ' + sem.abordagens, sem.abordagensDia + ' por dia útil') +
        card('Abordagens frias', f.frias + ' de ' + sem.frias, sem.friasDia + ' por dia útil no Garimpo') +
        card('Sessões', f.sessoes + ' de ' + sem.sessoes, sem.cabe ? 'cabe na sua agenda' : 'passou da sua agenda (' + plano.capacidade + ')') +
        card('Follow-ups', f.followups + ' de ' + sem.followups, 'quem fez sessão e não fechou') +
        '</div></section>';
    }
    function card(t, v, s, destaque) {
      return '<div class="com-cartao' + (destaque ? ' destaque' : '') + '"><small>' + esc(t) + '</small><b>' + esc(v) + '</b><span>' + esc(s) + '</span></div>';
    }

    function blocoEstrategico(calc, real, cab, chaves, agoraMes, passou) {
      const linhas = plano.produtos.map((pr, i) =>
        '<tr><td class="pl-prod"><input class="pl-in pl-nome" data-p="' + i + '" data-c="nome" value="' + esc(pr.nome) + '" aria-label="Produto">' +
        '<span class="pl-prod-linha"><input class="pl-in pl-preco" type="number" min="0" step="1" data-p="' + i + '" data-c="preco" value="' + esc(pr.preco) + '" aria-label="Preço">' +
        '<select class="pl-in" data-p="' + i + '" data-c="tipo" aria-label="Tipo">' + ['Ao vivo', 'Gravado', 'Por mensagem'].map((t) => '<option' + (t === pr.tipo ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>' +
        '<button type="button" class="pl-tirar" data-tirar="' + i + '" aria-label="Tirar ' + esc(pr.nome) + '">×</button></span></td>' +
        chaves.map((k, j) => {
          const rv = real[k] && real[k].porProduto[pr.nome];
          return '<td><input class="pl-in pl-n" type="number" min="0" step="1" data-p="' + i + '" data-m="' + j + '" value="' + esc(pr.vendas[j] || 0) + '" aria-label="Vendas de ' + esc(pr.nome) + ' em ' + planoMesNome(k) + '">' +
            (passou(k) ? '<small class="pl-real">' + (rv || 0) + ' feitas</small>' : '') + '</td>';
        }).join('') + '</tr>').join('');
      const rodape =
        '<tr class="pl-total"><td>Faturamento planejado</td>' + calc.meses.map((m) => '<td>' + brl(m.faturamento) + '</td>').join('') + '</tr>' +
        '<tr><td>Acumulado</td>' + calc.meses.map((m) => '<td>' + brl(m.acumulado) + '</td>').join('') + '</tr>' +
        '<tr><td>Extra esperado do Garimpo</td>' + calc.meses.map((m) => '<td>' + brl(m.fr.faturamento) + '<small class="pl-real">' + num1(m.fr.vendas) + ' venda</small></td>').join('') + '</tr>' +
        '<tr class="pl-realizado"><td>Entrou no caixa</td>' + calc.meses.map((m) => '<td>' + (passou(m.chave) ? brl((real[m.chave] || {}).caixa || 0) : '') + '</td>').join('') + '</tr>' +
        '<tr><td>Situação</td>' + calc.meses.map((m) => {
          if (!passou(m.chave)) return '<td></td>';
          const c = (real[m.chave] || {}).caixa || 0;
          return '<td>' + (c >= m.faturamento ? '<span class="pl-ok">Batida</span>' : m.chave === agoraMes ? 'Em andamento' : '<span class="pl-ruim">Abaixo</span>') + '</td>';
        }).join('') + '</tr>';
      return '<section class="com-bloco"><h3>1. Estratégico: produtos e vendas por mês</h3>' +
        '<p class="com-nota">Meta dos ' + plano.meses + ' meses: <b>' + brl(calc.meta) + '</b>. Mude preço, tipo ou vendas e clique em "Salvar plano". Nos meses que já começaram, embaixo de cada número aparece quantas vendas o CRM tem daquele produto.</p>' +
        '<div class="com-rolagem"><table class="com-tabela pl-tabela"><thead><tr>' + cab.replace('<th></th>', '<th>Produto · preço · tipo</th>') + '</tr></thead><tbody>' + linhas + rodape + '</tbody></table></div>' +
        '<button type="button" class="com-btn" id="pl-add">+ Produto</button></section>';
    }

    function blocoTatico(calc, real, cab, chaves, passou) {
      const est = '<tr><td>Estágio de funis</td>' + calc.meses.map((m, j) => '<td><select class="pl-in" data-est="' + j + '" aria-label="Estágio em ' + planoMesNome(m.chave) + '">' +
        [1, 2, 3, 4, 5].map((s) => '<option value="' + s + '"' + (s === m.estagio ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td>').join('') + '</tr>';
      const linhas = PLANO_FUNIS.map((f, j) => {
        if (!calc.meses.some((m) => m.funil[j]) && !chaves.some((k) => passou(k) && real[k] && real[k].porFunil[j])) return '';
        return '<tr><td>' + f + '</td>' + calc.meses.map((m) => '<td>' + (m.funil[j] ? num1(m.funil[j]) : '—') +
          (passou(m.chave) ? '<small class="pl-real">' + ((real[m.chave] || { porFunil: [] }).porFunil[j] || 0) + ' feitas</small>' : '') + '</td>').join('') + '</tr>';
      }).join('');
      const frioLinha = '<tr><td>Garimpo (abordagem fria, extra)</td>' + calc.meses.map((m) => '<td>' + num1(m.fr.vendas) +
        (passou(m.chave) ? '<small class="pl-real">' + ((real[m.chave] || { porFunil: [] }).porFunil[5] || 0) + ' feitas</small>' : '') + '</td>').join('') + '</tr>';
      const aviso = calc.meses.some((m) => m.gravadoFora) ? '<p class="com-nota pl-ruim">Produto Gravado só entra a partir do estágio 5 (com VSL): nos meses abaixo dele, essas vendas não têm funil.</p>' : '';
      return '<section class="com-bloco"><h3>2. Tático: de qual funil vem cada venda</h3>' +
        '<p class="com-nota">Estágios: ' + PLANO_ESTAGIOS.slice(1).join(' · ') + '. Os funis entram um de cada vez; a venda planejada se divide entre os funis ativos no mês. O Garimpo fica por fora: a conta dele parte de quantas abordagens frias você faz por dia, e as vendas dele são extra, por cima da meta.</p>' +
        '<div class="com-rolagem"><table class="com-tabela pl-tabela"><thead><tr>' + cab + '</tr></thead><tbody>' + est + linhas + frioLinha + '</tbody></table></div>' + aviso +
        '<p class="com-nota">Vendas feitas por funil, pela origem do lead no CRM: sessão, prospecção e Black = Vendas Secretas; Garimpo = abordagem fria; Grupo do WhatsApp = Lives; Método em 1 hora = Mini-treinamento; WhatsApp (chegou sozinho) = mensagem; compra direta = VSL.</p></section>';
    }

    function blocoRotina(calc, cab) {
      const itens = [
        ['Abordar pessoas que você conhece (quente)', (m) => m.semana.abordagens],
        ['Abordar no Garimpo (fria)', (m) => m.semana.frias],
        ['Abordagens quentes por dia útil', (m) => m.semana.abordagensDia],
        ['Fazer Lives Secretas', (m) => m.semana.lives, num1],
        ['Convidar pessoas pro grupo das lives', (m) => m.semana.convites],
        ['Levar visitantes à página do mini-treinamento', (m) => m.semana.visitantesMini],
        ['Gerar levantadas de mão (conteúdo com chamada pra conversa)', (m) => m.semana.levantadas],
        ['Conduzir conversas de venda por mensagem', (m) => m.semana.conversasMsg],
        ['Levar visitantes à página da VSL', (m) => m.semana.visitantesVsl],
        ['Fazer sessões de venda', (m) => m.semana.sessoes, null, true],
        ['Fazer follow-up de quem não fechou na sessão', (m) => m.semana.followups, null, true],
      ];
      const linhas = itens.filter(([, f]) => calc.meses.some((m) => f(m))).map(([nome, f, fmt, forte]) =>
        '<tr' + (forte ? ' class="pl-total"' : '') + '><td>' + nome + '</td>' + calc.meses.map((m) => '<td>' + (fmt || String)(f(m)) + '</td>').join('') + '</tr>').join('');
      const agenda = '<tr><td>Agenda (até <input class="pl-in pl-n" type="number" min="1" step="1" id="pl-cap" value="' + esc(plano.capacidade) + '" aria-label="Sessões por semana que cabem"> sessões por semana)</td>' +
        calc.meses.map((m) => '<td>' + (m.semana.cabe ? '<span class="pl-ok">Cabe</span>' : '<span class="pl-ruim">Passou</span>') + '</td>').join('') + '</tr>';
      const extra = '<tr><td>Pessoas assistindo por live</td>' + calc.meses.map((m) => '<td>' + (m.lv.porLive || '—') + '</td>').join('') + '</tr>';
      return '<section class="com-bloco"><h3>3. Operacional: sua semana-padrão em cada mês</h3>' +
        '<p class="com-nota">A conta de trás pra frente: das vendas planejadas até quantas abordagens, sessões e follow-ups por semana (mês de ' + esc(plano.semanasMes) + ' semanas, 1 sessão por venda). "Passou" = volte um estágio ou ajuste as vendas naquele mês.</p>' +
        '<div class="com-rolagem"><table class="com-tabela pl-tabela"><thead><tr>' + cab + '</tr></thead><tbody>' + linhas + agenda + (calc.meses.some((m) => m.lv.porLive) ? extra : '') + '</tbody></table></div></section>';
    }

    function blocoTaxas() {
      // taxas reais dos últimos 90 dias, pelo mesmo cálculo da aba Indicadores
      let ind = null;
      let indF = null;
      try {
        const per = comPeriodo('90', Date.now());
        ind = comIndicadores(ctx.leads.filter((l) => l.origem !== 'garimpo_instagram'), ctx.porLead, per);
        indF = comIndicadores(ctx.leads.filter((l) => l.origem === 'garimpo_instagram'), ctx.porLead, per);
      } catch (e) { /* sem indicadores */ }
      const ps = ind ? ind.passagens : {}, pf = indF ? indF.passagens : {};
      const real = (x) => (x ? pct(x.taxa) + ' <small>(' + x.foram + ' de ' + x.base + ')</small>' : '—');
      const T = Object.assign({}, plano.taxas, { frio: planoFrio(plano) });
      const grupos = [
        ['Vendas Secretas', 'vs', [['responde', 'Responde a abordagem', real(ps.resposta)], ['aceita', 'Aceita a sessão', null], ['comparece', 'Comparece na sessão', null], ['fecha', 'Fecha (na sessão ou no follow-up)', real(ps.venda)]],
          ps.sessao ? 'Real, de conversa pra sessão feita (aceita × comparece): ' + real(ps.sessao) + '.' : ''],
        ['Garimpo (abordagem fria)', 'frio', [['sessao', 'Abordagem vira sessão marcada'], ['comparece', 'Comparece na sessão'], ['fecha', 'Fecha (na sessão ou no follow-up)']],
          'Começou pela sua conta: 45 abordagens frias → 1 sessão marcada.' + (pf.resposta ? ' Real, abordagem → resposta: ' + real(pf.resposta) + '.' : '')],
        ['Lives Secretas', 'lives', [['entra', 'Convidado entra no grupo'], ['assiste', 'Assiste à live'], ['pede', 'Pede sessão depois da live'], ['comparece', 'Comparece na sessão'], ['fecha', 'Fecha']]],
        ['Mini-treinamento', 'mini', [['vira', 'Visitante vira lead'], ['agenda', 'Lead agenda sessão'], ['comparece', 'Comparece na sessão'], ['fecha', 'Fecha']]],
        ['Venda por mensagem', 'msg', [['conversa', 'Levantada de mão vira conversa'], ['fecha', 'Fecha na conversa']]],
        ['VSL', 'vsl', [['compra', 'Visitante compra na página']]],
      ];
      return '<section class="com-bloco"><h3>Taxas do plano x reais</h3>' +
        '<p class="com-nota">O plano usa estas taxas pra fazer a conta. Vendas Secretas é abordagem quente (quem já te conhece): resposta de 50%, da planilha, e fechamento de 20%, o seu real. Os "reais" de Vendas Secretas não contam o Garimpo, que tem as taxas dele. As outras são as de pior cenário da planilha, até ter dado seu. "Real" = últimos 90 dias.</p>' +
        '<div class="pl-taxas">' + grupos.map(([nome, g, itens, nota]) =>
          '<div class="pl-taxa-grupo"><h4>' + nome + '</h4>' + itens.map(([k, rotulo, r]) =>
            '<label class="pl-taxa"><span>' + rotulo + '</span><span class="pl-taxa-in"><input class="pl-in pl-n" type="number" min="0" max="100" step="0.1" data-tx="' + g + '.' + k + '" value="' + esc(Math.round(T[g][k] * 1000) / 10) + '">%</span>' +
            (r ? '<small>real: ' + r + '</small>' : '') + '</label>').join('') +
          (g === 'frio' ? '<label class="pl-taxa"><span>Abordagens frias por dia útil</span><span class="pl-taxa-in"><input class="pl-in pl-n" type="number" min="0" step="1" data-tx="frio.porDia" value="' + esc(T.frio.porDia) + '"></span></label>' : '') +
          (g === 'lives' ? '<label class="pl-taxa"><span>Lives por mês</span><span class="pl-taxa-in"><input class="pl-in pl-n" type="number" min="0" step="1" data-tx="lives.porMes" value="' + esc(T.lives.porMes) + '"></span></label>' : '') +
          (nota ? '<small class="pl-taxa-nota">' + nota + '</small>' : '') + '</div>').join('') + '</div></section>';
    }

    function ligar() {
      // refaz a tela depois da troca e devolve o cursor pro campo em que ela estava (Tab entre os campos)
      const chave = (a) => ['data-p', 'data-m', 'data-c', 'data-est', 'data-tx'].filter((k) => a.hasAttribute(k)).map((k) => '[' + k + '="' + a.getAttribute(k) + '"]').join('') || (a.id ? '#' + a.id : '');
      const recalc = () => setTimeout(() => {
        const a = document.activeElement, k = a && el.contains(a) ? chave(a) : '';
        render(el, ctx);
        const n = k && el.querySelector(k); if (n) n.focus();
      }, 0);
      el.querySelectorAll('[data-p]').forEach((i) => (i.onchange = () => {
        const pr = plano.produtos[Number(i.dataset.p)];
        if (i.dataset.m != null) pr.vendas[Number(i.dataset.m)] = Math.max(0, Math.round(Number(i.value) || 0));
        else if (i.dataset.c === 'preco') pr.preco = Math.max(0, Number(i.value) || 0);
        else pr[i.dataset.c] = i.value;
        if (i.dataset.c === 'nome') pr.chaves = [i.value];
        recalc();
      }));
      el.querySelectorAll('[data-est]').forEach((s) => (s.onchange = () => { plano.estagio[Number(s.dataset.est)] = Number(s.value); recalc(); }));
      el.querySelectorAll('[data-tx]').forEach((t) => (t.onchange = () => {
        const [g, k] = t.dataset.tx.split('.');
        const v = Math.max(0, Number(t.value) || 0);
        if (!plano.taxas[g]) plano.taxas[g] = planoFrio(plano);
        plano.taxas[g][k] = k === 'porMes' || k === 'porDia' ? Math.round(v) : Math.min(v, 100) / 100;
        recalc();
      }));
      el.querySelectorAll('[data-tirar]').forEach((b) => (b.onclick = () => {
        const pr = plano.produtos[Number(b.dataset.tirar)];
        if (pr.vendas.some((v) => v) && !b.dataset.certeza) { b.dataset.certeza = '1'; b.textContent = 'tirar?'; return; }
        plano.produtos.splice(Number(b.dataset.tirar), 1); recalc();
      }));
      const cap = el.querySelector('#pl-cap');
      if (cap) cap.onchange = () => { plano.capacidade = Math.max(1, Math.round(Number(cap.value) || 1)); recalc(); };
      el.querySelector('#pl-add').onclick = () => {
        plano.produtos.push({ nome: 'Produto novo', preco: 0, tipo: 'Ao vivo', chaves: ['Produto novo'], vendas: Array(plano.meses).fill(0) });
        recalc();
      };
      el.querySelector('#pl-salvar').onclick = salvar;
    }

    async function salvar() {
      const b = el.querySelector('#pl-salvar'); b.disabled = true;
      const { error } = await sb.from('plano_expert').upsert({ id: 'atual', dados: plano, atualizado_em: new Date().toISOString() });
      if (error) { b.disabled = false; ctx.aviso('Não salvou: ' + error.message, true); return; }
      salvo = JSON.stringify(plano);
      ctx.aviso('Plano salvo');
      render(el, ctx);
    }

    window.addEventListener('beforeunload', (e) => { if (plano && mudou()) { e.preventDefault(); e.returnValue = ''; } });

    return { carregar, render, semanaHtml };
  })();
}
