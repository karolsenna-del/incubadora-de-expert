// Painel financeiro da Karol — só ela usa (o banco também bloqueia por RLS).
// Site estático: HTML + JS puro + Supabase JS. Tabelas: fin_lancamentos, fin_regras, fin_config.

const FIN_EMAIL = 'karolsenna@incubadoradeexpert.com.br';
const FIN_CATEGORIAS = ['Ferramentas e software', 'Tráfego e anúncios', 'Equipe e serviços', 'Taxas e tarifas', 'Impostos (DAS)', 'Educação', 'Outros PJ'];
// Categorias da vida pessoal (aba Pessoal, Karol 03/11)
const FIN_CATEGORIAS_PF = ['Mercado', 'Alimentação', 'Casa e contas', 'Saúde', 'Beleza e cuidados', 'Filhos', 'Roupas e compras', 'Transporte', 'Viagens', 'Assinaturas', 'Educação', 'Presentes', 'Juros e tarifas', 'Outros PF'];
const FIN_PRODUTOS = ['Método VIP', 'Sprint do Método', 'Incubadora Express', 'Grupo', 'Individual', 'Expert360º', 'Diagnóstico Ferramentas', 'Método Express/Destrava Expert', 'Comissões de afiliada', 'Outros'];
// Conta = onde o dinheiro está; pix/cartão/boleto vão no campo Meio (Karol, 01/11)
const FIN_CONTAS = ['voomp', 'conta_pj', 'conta_pf', 'cartao_pf'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_LONGO = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// =====================================================================
// LÓGICA PURA (testável fora do navegador)
// =====================================================================

function finSemAcento(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// "R$ 1.409,15" -> 1409.15 ; "1409.15" -> 1409.15 ; "-12,50" -> -12.5 ; "(12,50)" -> -12.5
function finNumero(txt) {
  if (typeof txt === 'number') return txt;
  let s = String(txt == null ? '' : txt).trim();
  if (!s) return NaN;
  let neg = false;
  if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
  if (/-/.test(s)) neg = true;
  s = s.replace(/[^0-9.,]/g, '');
  if (!s) return NaN;
  const ultVirg = s.lastIndexOf(','), ultPonto = s.lastIndexOf('.');
  if (ultVirg > -1 && ultPonto > -1) {
    if (ultVirg > ultPonto) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (ultVirg > -1) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (ultPonto > -1) {
    // só ponto: "1.409" (milhar) vs "12.50" (decimal)
    const depois = s.length - ultPonto - 1;
    if (depois === 3 && (s.match(/\./g) || []).length >= 1 && !/^0\./.test(s)) s = s.replace(/\./g, '');
  }
  const n = parseFloat(s);
  if (isNaN(n)) return NaN;
  return neg ? -Math.abs(n) : n;
}

// aceita dd/mm/aaaa, dd/mm/aa, aaaa-mm-dd, aaaammdd(...) -> 'aaaa-mm-dd' ou null
function finData(txt) {
  const s = String(txt || '').trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4}|\d{2})/);
  if (m) {
    const ano = m[3].length === 2 ? '20' + m[3] : m[3];
    return ano + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
  }
  m = s.match(/^(\d{4})(\d{2})(\d{2})/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  return null;
}

function finArred(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

function finBRL(n) {
  const v = Number(n) || 0;
  return (v < 0 ? '-R$ ' : 'R$ ') + Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function finDataBR(iso) {
  if (!iso) return '—';
  const [a, m, d] = String(iso).slice(0, 10).split('-');
  return d + '/' + m + '/' + a;
}

function finHoje() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ---------- OFX ----------
function parseOFX(texto) {
  const blocos = String(texto || '').split(/<STMTTRN>/i).slice(1);
  const linhas = [];
  const tag = (b, nome) => {
    const m = b.match(new RegExp('<' + nome + '>([^<\\r\\n]*)', 'i'));
    return m ? m[1].trim() : '';
  };
  blocos.forEach(b => {
    const data = finData(tag(b, 'DTPOSTED'));
    const valor = finNumero(tag(b, 'TRNAMT'));
    const descricao = (tag(b, 'MEMO') || tag(b, 'NAME')).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (data && !isNaN(valor)) linhas.push({ data, descricao, valor });
  });
  return linhas;
}

// ---------- CSV ----------
function finSplitCSV(texto) {
  const t = String(texto || '').replace(/^﻿/, '');
  const primeira = t.split(/\r?\n/).find(l => l.trim()) || '';
  const sep = (primeira.match(/;/g) || []).length >= (primeira.match(/,/g) || []).length && primeira.includes(';') ? ';' : ',';
  const linhas = [];
  let campo = '', linha = [], aspas = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (aspas) {
      if (c === '"') { if (t[i + 1] === '"') { campo += '"'; i++; } else aspas = false; }
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === sep) { linha.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && t[i + 1] === '\n') i++;
      linha.push(campo); campo = '';
      if (linha.some(x => x.trim())) linhas.push(linha);
      linha = [];
    } else campo += c;
  }
  linha.push(campo);
  if (linha.some(x => x.trim())) linhas.push(linha);
  return { sep, linhas };
}

function finAcharColunas(cabecalho) {
  const h = cabecalho.map(x => finSemAcento(x).toLowerCase().trim());
  const achar = padroes => h.findIndex(x => padroes.some(p => p.test(x)));
  return {
    data: achar([/^data/, /^date/]),
    desc: achar([/^descri/, /^title/, /^estabelecimento/, /^historico/, /^lancamento/, /^description/, /^memo/, /^name/]),
    valor: achar([/^valor/, /^amount/, /^value/])
  };
}

function finLinhasDoCSV(linhas, cols) {
  const out = [];
  linhas.forEach(l => {
    const data = finData(l[cols.data]);
    const valor = finNumero(l[cols.valor]);
    if (data && !isNaN(valor)) out.push({ data, descricao: String(l[cols.desc] || '').replace(/\s+/g, ' ').trim(), valor });
  });
  return out;
}

// devolve { cabecalho, linhas(corpo), cols, resultado|null }
function parseCSV(texto) {
  const { linhas } = finSplitCSV(texto);
  if (!linhas.length) return { cabecalho: [], corpo: [], cols: { data: -1, desc: -1, valor: -1 }, resultado: null };
  const cabecalho = linhas[0];
  const corpo = linhas.slice(1);
  const cols = finAcharColunas(cabecalho);
  const ok = cols.data > -1 && cols.desc > -1 && cols.valor > -1;
  return { cabecalho, corpo, cols, resultado: ok ? finLinhasDoCSV(corpo, cols) : null };
}

// Fatura: compra tem de ficar positiva. Se a maioria vier negativa (OFX/alguns bancos), inverte.
function finNormalizarSinal(linhas, forcarInverter) {
  const neg = linhas.filter(l => l.valor < 0).length;
  const pos = linhas.filter(l => l.valor > 0).length;
  const inverter = forcarInverter === null || forcarInverter === undefined ? neg > pos : forcarInverter;
  return { linhas: linhas.map(l => ({ ...l, valor: inverter ? -l.valor : l.valor })), invertido: inverter };
}

const FIN_RE_PAGAMENTO = /PAGAMENTO\s+(DE\s+)?(FATURA|RECEBIDO|EFETUADO|ON[- ]?LINE)|PGTO\s+(FATURA|RECEBIDO)|SALDO\s+ANTERIOR|ESTORNO|PAGTO\s+FATURA/i;

// separa o que entra na prévia do que é ignorado (pagamento de fatura, estorno, valor <= 0)
function finSepararFatura(linhas) {
  const validas = [], ignoradas = [];
  linhas.forEach(l => {
    const d = finSemAcento(l.descricao).toUpperCase();
    if (l.valor <= 0 || FIN_RE_PAGAMENTO.test(d)) ignoradas.push(l); else validas.push(l);
  });
  return { validas, ignoradas };
}

function finPadrao(descricao) {
  return String(descricao || '').toUpperCase()
    .replace(/\b(PARC(ELA)?\.?\s*)?\d{1,2}\s*\/\s*\d{1,2}\b/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function finAcharRegra(descricao, regras) {
  const d = String(descricao || '').toUpperCase();
  let melhor = null;
  (regras || []).forEach(r => {
    if (r.padrao && d.includes(r.padrao) && (!melhor || r.padrao.length > melhor.padrao.length)) melhor = r;
  });
  return melhor;
}

function finHash(txt) {
  let h = 5381;
  for (let i = 0; i < txt.length; i++) h = ((h * 33) ^ txt.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// origem_id estável; linhas idênticas no mesmo arquivo ganham sufixo -1, -2...
function finIdsFatura(linhas) {
  const vistos = {};
  return linhas.map(l => {
    const base = finHash(l.data + '|' + String(l.descricao).toUpperCase() + '|' + l.valor.toFixed(2));
    const n = vistos[base] || 0;
    vistos[base] = n + 1;
    return 'f' + base + (n ? '-' + n : '');
  });
}

// ---------- Extrato Voomp (colado) ----------
function parseVoomp(texto) {
  const regData = /^\d{2}\/\d{2}\/\d{4}$/;
  const registros = [];
  let atual = null;
  String(texto || '').split(/\r?\n/).forEach(bruta => {
    if (!bruta.trim()) return;
    const celulas = bruta.split('\t').map(c => c.trim());
    if (regData.test(celulas[0]) && celulas.length > 1) {
      const vi = celulas.findIndex((c, i) => i > 1 && /R\$/.test(c));
      const ult = celulas[celulas.length - 1];
      const disp = celulas.length > 2 && regData.test(ult) ? ult : '';
      const id = (celulas.slice(2).find(c => /^\d{5,}$/.test(c))) || '';
      const prodIdx = celulas.findIndex((c, i) => i >= 2 && c && c !== id && !/R\$/.test(c) && !regData.test(c));
      const celValor = vi > -1 ? celulas[vi] : '';
      atual = {
        dataPag: finData(celulas[0]),
        tipoTxt: celulas[1],
        id,
        produto: prodIdx > -1 ? celulas[prodIdx] : '',
        liquido: celValor ? Math.abs(finNumero(celValor)) : NaN,
        meio: finMeio(celValor),
        disponivel: disp ? finData(disp) : null
      };
      registros.push(atual);
    } else if (atual && !atual.meio && finMeio(bruta)) {
      atual.meio = finMeio(bruta);
    } else if (atual && isNaN(atual.liquido) && /R\$/.test(bruta)) {
      atual.liquido = Math.abs(finNumero(bruta));
      atual.meio = atual.meio || finMeio(bruta);
    }
  });
  return registros;
}

function finMeio(txt) {
  const s = finSemAcento(txt).toLowerCase();
  if (/\bpix\b/.test(s)) return 'pix';
  if (/cartao|credito/.test(s)) return 'cartao';
  if (/boleto/.test(s)) return 'boleto';
  return '';
}

// transforma o registro colado em lançamento (sem o bruto: o bruto/taxa entram na prévia)
function voompParaLancamento(r) {
  const t = finSemAcento(r.tipoTxt).toLowerCase();
  const base = { dono: 'PJ', conta: 'voomp', origem: 'voomp', data_competencia: r.dataPag, taxa: 0, observacao: null, meio: r.meio || null, produto: null, categoria: null };
  if (isNaN(r.liquido) || !r.dataPag) return null;
  if (/taxa/.test(t) && /saque/.test(t)) {
    return { ...base, natureza: 'despesa', data_caixa: r.dataPag, descricao: 'Taxa de saque Voomp', categoria: 'Taxas e tarifas', meio: null, valor_bruto: r.liquido, origem_id: 'taxa-saque-' + r.dataPag };
  }
  if (/saque/.test(t)) {
    return { ...base, natureza: 'transferencia', data_caixa: r.dataPag, descricao: 'Saque da Voomp', conta_destino: 'conta_pj', observacao: 'Voomp → conta PJ', valor_bruto: r.liquido, origem_id: 'saque-' + r.dataPag };
  }
  if (/reembolso|estorno/.test(t)) {
    return { ...base, natureza: 'estorno', data_caixa: r.dataPag, descricao: 'Reembolso Voomp #' + r.id, produto: r.produto || null, valor_bruto: r.liquido, origem_id: r.id + '-reembolso' };
  }
  if (/comiss/.test(t)) {
    return { ...base, natureza: 'receita', data_caixa: r.disponivel || r.dataPag, descricao: 'Comissão Voomp' + (r.id ? ' #' + r.id : ''), produto: 'Comissões de afiliada', valor_bruto: r.liquido, origem_id: r.id || ('comissao-' + r.dataPag + '-' + r.liquido.toFixed(2)) };
  }
  if (/venda/.test(t)) {
    return { ...base, natureza: 'receita', data_caixa: r.disponivel, descricao: 'Venda Voomp #' + r.id, produto: r.produto || null, valor_bruto: r.liquido, origem_id: r.id };
  }
  return null;
}

// ---------- Cálculos ----------
function finAno(iso) { return iso ? Number(String(iso).slice(0, 4)) : null; }
function finMes(iso) { return iso ? Number(String(iso).slice(5, 7)) - 1 : null; }
const fn = x => Number(x) || 0;

// Quanto tem numa conta hoje (Karol, 02/11): o que já liberou de venda − reembolsos − despesas pagas dela
// − transferências que saíram dela + transferências que chegaram nela. "A liberar" = venda que ainda não liberou.
function finSaldoConta(lancs, conta, hoje) {
  let disponivel = 0, aLiberar = 0;
  lancs.forEach(l => {
    const dia = l.data_caixa || l.data_competencia;
    if (l.natureza === 'receita' && l.conta === conta) {
      if (l.data_caixa && l.data_caixa <= hoje) disponivel += fn(l.valor_liquido); else aLiberar += fn(l.valor_liquido);
    } else if (dia > hoje) {
      return;
    } else if (l.natureza === 'estorno' && l.conta === conta) disponivel -= fn(l.valor_liquido);
    else if (l.natureza === 'despesa' && l.conta === conta) disponivel -= fn(l.valor_bruto);
    else if (l.natureza === 'transferencia') {
      if (l.conta === conta) disponivel -= fn(l.valor_bruto);
      if (l.conta_destino === conta) disponivel += fn(l.valor_bruto);
    }
  });
  return { disponivel: finArred(disponivel), aLiberar: finArred(aLiberar) };
}

// Repasse da PJ pra Karol (Karol, 02/11): ela zera a conta PJ no fim de cada mês.
// Repasse = transferência PJ → conta_pf que não é reembolso de despesa. Aporte = transferência conta_pf → PJ (cobriu do bolso).
const finEhRepasse = l => l.natureza === 'transferencia' && l.dono === 'PJ' && l.conta_destino === 'conta_pf' && !String(l.origem_id || '').startsWith('reembolso-');
const finEhAporte = l => l.natureza === 'transferencia' && l.dono === 'PJ' && l.conta === 'conta_pf' && l.conta_destino === 'conta_pj';

// Movimento na conta PJ (caixa), fora repasse/aporte: { data, valor } ou null.
// Receita fora da Voomp entra quando cai; despesa PJ sai quando foi paga (no cartão/conta PF: na data do reembolso); saque da Voomp entra.
function finMovPJ(l, hoje) {
  const sinal = l.natureza === 'receita' ? 1 : l.natureza === 'estorno' ? -1 : 0;
  let data = null, valor = 0;
  if (sinal && l.conta !== 'voomp' && l.conta !== 'conta_pf') { data = l.data_caixa; valor = sinal * fn(l.valor_liquido); }
  else if (l.natureza === 'despesa' && l.dono === 'PJ' && l.conta !== 'voomp') {
    data = (l.conta === 'cartao_pf' || l.conta === 'conta_pf') ? l.reembolso_em : l.data_caixa; valor = -fn(l.valor_bruto);
  } else if (l.natureza === 'transferencia' && l.conta_destino === 'conta_pj' && l.conta !== 'conta_pf') { data = l.data_caixa; valor = fn(l.valor_bruto); }
  return data && data <= hoje ? { data, valor } : null;
}
// Repasse líquido (repasse − aporte) já acontecido: { data, valor } ou null
function finRepasseLiq(l, hoje) {
  const v = finEhRepasse(l) ? fn(l.valor_bruto) : finEhAporte(l) ? -fn(l.valor_bruto) : 0;
  return v && l.data_caixa && l.data_caixa <= hoje ? { data: l.data_caixa, valor: v } : null;
}

function finResumo(lancs, ano, hoje) {
  const z = () => Array(12).fill(0);
  const r = { faturamento: z(), recebido: z(), aReceber: z(), despesas: z(), lucro: z(), entradasPJ: z(), pagamentosPJ: z(), movPJ: z(), repasse: z() };
  const inicioAno = ano + '-01-01';
  r.saldoInicial = 0;
  lancs.forEach(l => {
    const sinal = l.natureza === 'receita' ? 1 : l.natureza === 'estorno' ? -1 : 0;
    if (sinal) {
      if (l.dono === 'PJ' && finAno(l.data_competencia) === ano) r.faturamento[finMes(l.data_competencia)] += sinal * fn(l.valor_bruto);
      if (l.data_caixa && l.data_caixa <= hoje && finAno(l.data_caixa) === ano) r.recebido[finMes(l.data_caixa)] += sinal * fn(l.valor_liquido);
      if (l.natureza === 'receita' && (!l.data_caixa || l.data_caixa > hoje)) {
        const ref = l.data_caixa || l.data_competencia;
        if (finAno(ref) === ano) r.aReceber[finMes(ref)] += fn(l.valor_liquido);
      }
    } else if (l.natureza === 'despesa' && l.dono === 'PJ' && finAno(l.data_competencia) === ano) {
      r.despesas[finMes(l.data_competencia)] += fn(l.valor_bruto);
    }
    const mv = finMovPJ(l, hoje), rp = finRepasseLiq(l, hoje);
    if (mv) { if (mv.data < inicioAno) r.saldoInicial += mv.valor; else if (finAno(mv.data) === ano) { const mm = finMes(mv.data); r.movPJ[mm] += mv.valor; if (mv.valor >= 0) r.entradasPJ[mm] += mv.valor; else r.pagamentosPJ[mm] -= mv.valor; } }
    if (rp) { if (rp.data < inicioAno) r.saldoInicial -= rp.valor; else if (finAno(rp.data) === ano) r.repasse[finMes(rp.data)] += rp.valor; }
  });
  r.saldoInicial = finArred(r.saldoInicial);
  for (let m = 0; m < 12; m++) {
    ['faturamento', 'recebido', 'aReceber', 'despesas', 'entradasPJ', 'pagamentosPJ', 'movPJ', 'repasse'].forEach(k => r[k][m] = finArred(r[k][m]));
    // Lucro (Karol, 02/11): competência pura = faturamento (data da venda) − despesas (data da compra). Caixa fica nas linhas da conta PJ.
    r.lucro[m] = finArred(r.faturamento[m] - r.despesas[m]);
  }
  const soma = a => finArred(a.reduce((x, y) => x + y, 0));
  r.totais = { faturamento: soma(r.faturamento), recebido: soma(r.recebido), despesas: soma(r.despesas), lucro: soma(r.lucro), entradasPJ: soma(r.entradasPJ), pagamentosPJ: soma(r.pagamentosPJ), movPJ: soma(r.movPJ), repasse: soma(r.repasse) };
  // Saldo na conta PJ (Karol, 02/11): saldo do mês anterior + movimento da conta − repasse pra ela. Mês que não chegou fica vazio.
  const mesHoje = finAno(hoje) === ano ? finMes(hoje) : finAno(hoje) > ano ? 11 : -1;
  let acum = r.saldoInicial;
  r.saldo = r.movPJ.map((v, m) => { acum = finArred(acum + v - r.repasse[m]); return m <= mesHoje ? acum : null; });
  r.totais.saldo = mesHoje >= 0 ? r.saldo[mesHoje] : r.saldoInicial;
  r.voomp = finSaldoConta(lancs, 'voomp', hoje);
  // Teto do MEI pelo caixa (Karol, 02/11): valor bruto das receitas PJ pela data em que o dinheiro entrou, menos estornos.
  // usado = o que já entrou até hoje; previsto = usado + o que ainda vai entrar neste ano.
  r.teto = { usado: 0, previsto: 0 };
  lancs.forEach(l => {
    const sinal = l.natureza === 'receita' ? 1 : l.natureza === 'estorno' ? -1 : 0;
    if (!sinal || l.dono !== 'PJ' || !l.data_caixa || finAno(l.data_caixa) !== ano) return;
    r.teto.previsto += sinal * fn(l.valor_bruto);
    if (l.data_caixa <= hoje) r.teto.usado += sinal * fn(l.valor_bruto);
  });
  r.teto.usado = finArred(r.teto.usado); r.teto.previsto = finArred(r.teto.previsto);
  r.totais.aReceber = finArred(lancs.reduce((s, l) => s + (l.natureza === 'receita' && (!l.data_caixa || l.data_caixa > hoje) ? fn(l.valor_liquido) : 0), 0));
  return r;
}

function finVendasPorProduto(lancs, ano, mes /* 0-11 ou null */) {
  const mapa = {};
  lancs.forEach(l => {
    if (l.natureza !== 'receita' && l.natureza !== 'estorno') return;
    if (l.dono !== 'PJ') return;
    if (finAno(l.data_competencia) !== ano) return;
    if (mes !== null && mes !== undefined && finMes(l.data_competencia) !== mes) return;
    const s = l.natureza === 'receita' ? 1 : -1;
    const p = l.produto || 'Sem produto';
    const o = mapa[p] || (mapa[p] = { produto: p, qtd: 0, bruto: 0, taxas: 0, liquido: 0 });
    // Venda parcelada (origem_id termina em -pNN): só a parcela 1 conta como venda; o valor de todas soma (Karol, 02/11)
    const parc = /-p(\d+)$/.exec(l.origem_id || '');
    o.qtd += (!parc || Number(parc[1]) === 1) ? s : 0; o.bruto += s * fn(l.valor_bruto); o.taxas += s * fn(l.taxa); o.liquido += s * fn(l.valor_liquido);
  });
  const lista = Object.values(mapa).map(o => ({ ...o, bruto: finArred(o.bruto), taxas: finArred(o.taxas), liquido: finArred(o.liquido), ticket: o.qtd > 0 ? finArred(o.bruto / o.qtd) : 0 }))
    .sort((a, b) => b.bruto - a.bruto);
  const tot = lista.reduce((t, o) => ({ qtd: t.qtd + o.qtd, bruto: t.bruto + o.bruto, taxas: t.taxas + o.taxas, liquido: t.liquido + o.liquido }), { qtd: 0, bruto: 0, taxas: 0, liquido: 0 });
  const total = { produto: 'Total', qtd: tot.qtd, bruto: finArred(tot.bruto), taxas: finArred(tot.taxas), liquido: finArred(tot.liquido), ticket: tot.qtd > 0 ? finArred(tot.bruto / tot.qtd) : 0 };
  return { lista, total };
}

// Pessoal (PF), pelo caixa (Karol, 03/11): entra = repasse da PJ (menos aporte) + venda da PJ que caiu na conta PF
// + receita PF lançada; sai = gastos PF (cartão no vencimento da fatura, pix no dia). O reembolso das despesas PJ
// pagas no cartão pessoal não entra: é dinheiro da empresa que passa pela PF e sai na fatura.
function finResumoPF(lancs, ano, hoje) {
  const z = () => Array(12).fill(0);
  const r = { repasse: z(), vendaPJ: z(), outras: z(), entradas: z(), gastos: z(), sobra: z(), acumulada: z(), cats: {} };
  const noAno = d => d && d <= hoje && finAno(d) === ano;
  lancs.forEach(l => {
    const rp = finRepasseLiq(l, hoje);
    if (rp) { if (finAno(rp.data) === ano) r.repasse[finMes(rp.data)] += rp.valor; return; }
    const dia = l.data_caixa || l.data_competencia;
    if (!noAno(dia)) return;
    const m = finMes(dia), sinal = l.natureza === 'receita' ? 1 : l.natureza === 'estorno' ? -1 : 0;
    if (sinal && l.dono === 'PJ' && l.conta === 'conta_pf') r.vendaPJ[m] += sinal * fn(l.valor_liquido);
    else if (sinal && l.dono === 'PF') r.outras[m] += sinal * fn(l.valor_liquido);
    else if (l.natureza === 'despesa' && l.dono === 'PF') {
      const c = l.categoria || 'Outros PF';
      (r.cats[c] = r.cats[c] || z())[m] += fn(l.valor_bruto);
      r.gastos[m] += fn(l.valor_bruto);
    }
  });
  let acum = 0;
  const mesHoje = finAno(hoje) === ano ? finMes(hoje) : finAno(hoje) > ano ? 11 : -1;
  for (let m = 0; m < 12; m++) {
    ['repasse', 'vendaPJ', 'outras', 'gastos'].forEach(k => r[k][m] = finArred(r[k][m]));
    Object.keys(r.cats).forEach(c => r.cats[c][m] = finArred(r.cats[c][m]));
    r.entradas[m] = finArred(r.repasse[m] + r.vendaPJ[m] + r.outras[m]);
    r.sobra[m] = finArred(r.entradas[m] - r.gastos[m]);
    acum = finArred(acum + r.sobra[m]);
    r.acumulada[m] = m <= mesHoje ? acum : null;
  }
  const soma = a => finArred(a.reduce((x, y) => x + (y || 0), 0));
  r.totais = { repasse: soma(r.repasse), vendaPJ: soma(r.vendaPJ), outras: soma(r.outras), entradas: soma(r.entradas), gastos: soma(r.gastos), sobra: soma(r.sobra) };
  r.totaisCat = {}; Object.keys(r.cats).forEach(c => r.totaisCat[c] = soma(r.cats[c]));
  r.ordemCats = Object.keys(r.cats).sort((a, b) => r.totaisCat[b] - r.totaisCat[a]);
  return r;
}

function finCSVRelatorio(linhas) {
  const esc = v => { const s = String(v == null ? '' : v); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const cab = ['Data da compra', 'Descrição', 'Categoria', 'Valor (R$)', 'Fatura (vencimento)', 'Reembolsado em'];
  const corpo = linhas.map(l => [finDataBR(l.data_competencia), l.descricao, l.categoria || '', fn(l.valor_bruto).toFixed(2).replace('.', ','), l.data_caixa ? finDataBR(l.data_caixa) : '', l.reembolso_em ? finDataBR(l.reembolso_em) : ''].map(esc).join(';'));
  const total = linhas.reduce((s, l) => s + fn(l.valor_bruto), 0);
  corpo.push(['', 'TOTAL', '', total.toFixed(2).replace('.', ','), '', ''].join(';'));
  return '﻿' + [cab.join(';')].concat(corpo).join('\r\n');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { finNumero, finData, finBRL, finDataBR, parseOFX, parseCSV, finNormalizarSinal, finSepararFatura, finPadrao, finAcharRegra, finIdsFatura, parseVoomp, voompParaLancamento, finResumo, finResumoPF, finVendasPorProduto, finCSVRelatorio, finLinhasDoCSV };
}

// =====================================================================
// INTERFACE
// =====================================================================
if (typeof document !== 'undefined') {
  (function () {
    const $ = (s, el) => (el || document).querySelector(s);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const opts = (lista, sel) => lista.map(v => '<option value="' + esc(v) + '"' + (v === sel ? ' selected' : '') + '>' + esc(v) + '</option>').join('');
    const hoje = finHoje();
    const anoAtual = Number(hoje.slice(0, 4));

    let sb = null;
    const estado = { lancs: [], regras: [], config: {}, fatura: null, voomp: null, ano: anoAtual, vAno: anoAtual, vMes: '', fAno: anoAtual, fMes: '', fNat: '', fDono: '', pAno: anoAtual };

    // ---------- modal próprio (nada de alert/confirm/prompt) ----------
    function modal(titulo, corpoHtml, botoes) {
      return new Promise(resolve => {
        const fundo = document.createElement('div');
        fundo.className = 'fin-modal-fundo';
        fundo.innerHTML = '<div class="fin-modal" role="dialog" aria-modal="true"><h3>' + esc(titulo) + '</h3><div class="fin-modal-corpo">' + corpoHtml + '</div><div class="fin-modal-acoes"></div></div>';
        const acoes = $('.fin-modal-acoes', fundo);
        const fechar = v => { fundo.remove(); resolve(v); };
        (botoes || [{ texto: 'OK', valor: true, primario: true }]).forEach(b => {
          const el = document.createElement('button');
          el.type = 'button';
          el.className = 'fin-btn' + (b.primario ? ' fin-btn-primario' : '') + (b.perigo ? ' fin-btn-perigo' : '');
          el.textContent = b.texto;
          el.onclick = () => fechar(b.valor === 'coletar' ? coletar(fundo) : b.valor);
          acoes.appendChild(el);
        });
        document.body.appendChild(fundo);
        const primeiro = $('input,select,textarea', fundo);
        if (primeiro) primeiro.focus();
      });
    }
    function coletar(fundo) {
      const o = {};
      fundo.querySelectorAll('[name]').forEach(el => { o[el.name] = el.value; });
      return o;
    }
    const aviso = (titulo, msg) => modal(titulo, '<p>' + esc(msg) + '</p>');
    const confirmar = (titulo, msg, textoOk) => modal(titulo, '<p>' + esc(msg) + '</p>', [{ texto: 'Cancelar', valor: false }, { texto: textoOk || 'Confirmar', valor: true, primario: true }]);
    const pedirData = (titulo, msg, padrao) => modal(titulo, '<p>' + esc(msg) + '</p><label class="fin-campo">Data<input type="date" name="data" value="' + esc(padrao || hoje) + '"></label>',
      [{ texto: 'Cancelar', valor: null }, { texto: 'Confirmar', valor: 'coletar', primario: true }]).then(r => (r && r.data) ? r.data : null);

    // ---------- dados ----------
    async function carregarTudo() {
      let todos = [], de = 0;
      for (;;) {
        const { data, error } = await sb.from('fin_lancamentos').select('*').order('data_competencia', { ascending: false }).range(de, de + 999);
        if (error) throw error;
        todos = todos.concat(data);
        if (data.length < 1000) break;
        de += 1000;
      }
      estado.lancs = todos;
      const r1 = await sb.from('fin_regras').select('*');
      if (r1.error) throw r1.error;
      estado.regras = r1.data;
      const r2 = await sb.from('fin_config').select('*');
      if (r2.error) throw r2.error;
      estado.config = {};
      r2.data.forEach(c => { estado.config[c.chave] = c.valor; });
    }
    async function recarregar() {
      try { await carregarTudo(); } catch (e) { await aviso('Não consegui carregar', e.message || String(e)); }
      renderTudo();
    }

    // ---------- abas ----------
    function abrirAba(nome) {
      document.querySelectorAll('.fin-aba').forEach(b => b.classList.toggle('ativa', b.dataset.aba === nome));
      document.querySelectorAll('.fin-painel').forEach(p => { p.hidden = p.id !== 'aba-' + nome; });
    }

    function anosDisponiveis() {
      const s = new Set([anoAtual]);
      estado.lancs.forEach(l => { if (l.data_competencia) s.add(finAno(l.data_competencia)); });
      return Array.from(s).sort((a, b) => b - a);
    }
    const selAnos = sel => anosDisponiveis().map(a => '<option value="' + a + '"' + (a === sel ? ' selected' : '') + '>' + a + '</option>').join('');
    const selMeses = sel => '<option value="">Todos os meses</option>' + MESES_LONGO.map((m, i) => '<option value="' + i + '"' + (String(i) === String(sel) ? ' selected' : '') + '>' + m + '</option>').join('');

    // ---------- 1. RESUMO ----------
    function renderResumo() {
      const r = finResumo(estado.lancs, estado.ano, hoje);
      const teto = Number(estado.config.teto_mei_anual) || 0;
      const pct = teto ? (r.teto.usado / teto) * 100 : 0;
      const pctPrev = teto ? (r.teto.previsto / teto) * 100 : 0;
      const falta = teto - r.teto.usado;
      const cor = pct > 100 ? 'estourou' : (pct > 80 || pctPrev > 100) ? 'atencao' : '';
      const max = Math.max(1, ...r.faturamento, ...r.recebido);
      const barras = MESES.map((m, i) => '<div class="fin-barra-col"><div class="fin-barras"><span class="fin-b-fat" style="height:' + Math.max(0, r.faturamento[i] / max * 100) + '%" title="Faturamento ' + esc(finBRL(r.faturamento[i])) + '"></span><span class="fin-b-rec" style="height:' + Math.max(0, r.recebido[i] / max * 100) + '%" title="Recebido ' + esc(finBRL(r.recebido[i])) + '"></span></div><small>' + m + '</small></div>').join('');
      const linha = (nome, arr, tot, cls) => '<tr class="' + (cls || '') + '"><th>' + nome + '</th>' + arr.map(v => v === null ? '<td>—</td>' : '<td class="' + (v < 0 ? 'neg' : '') + '">' + esc(finBRL(v)) + '</td>').join('') + '<td><b>' + esc(finBRL(tot)) + '</b></td></tr>';
      const soma = a => finArred(a.reduce((x, y) => x + y, 0));
      const secao = t => '<tr class="fin-secao"><th>' + t + '</th>' + MESES.map(() => '<td></td>').join('') + '<td></td></tr>';
      $('#aba-resumo').innerHTML =
        '<div class="fin-filtros"><label>Ano <select id="res-ano">' + selAnos(estado.ano) + '</select></label></div>' +
        '<div class="fin-cartoes">' +
        cartao('Faturamento do ano', r.totais.faturamento) + cartao('Recebido do ano', r.totais.recebido) +
        cartao('Despesas PJ do ano', r.totais.despesas) + cartao('Lucro do ano', r.totais.lucro) + cartao('A receber (total)', r.totais.aReceber) +
        cartao('Saldo na conta PJ', r.totais.saldo) +
        '<div class="fin-cartao"><small>Saldo na Voomp (pra sacar)</small><b>' + esc(finBRL(r.voomp.disponivel)) + '</b><small>a liberar ' + esc(finBRL(r.voomp.aLiberar)) + '</small></div>' + '</div>' +
        '<div class="fin-teto ' + cor + '"><div class="fin-teto-topo"><b>Teto do MEI</b><button class="fin-btn fin-btn-mini" id="btn-teto" type="button">Editar teto</button></div>' +
        '<div class="fin-teto-barra"><div style="width:' + Math.min(100, pct) + '%"></div></div>' +
        '<p>Já entrou ' + esc(finBRL(r.teto.usado)) + ' de ' + esc(finBRL(teto)) + ' (' + pct.toFixed(1).replace('.', ',') + '%) — ' +
        (falta >= 0 ? 'faltam ' + esc(finBRL(falta)) : 'passou ' + esc(finBRL(-falta))) + '</p>' +
        (r.teto.previsto > r.teto.usado ? '<p>Com o que ainda entra este ano: ' + esc(finBRL(r.teto.previsto)) + ' (' + pctPrev.toFixed(1).replace('.', ',') + '%)</p>' : '') +
        (pct > 100 ? '<p class="fin-teto-aviso">Atenção: passou do teto do MEI.</p>' : pctPrev > 100 ? '<p class="fin-teto-aviso">Com o que ainda entra este ano, passa do teto do MEI.</p>' : pct > 80 ? '<p class="fin-teto-aviso">Já passou de 80% do teto.</p>' : '') +
        '<small>Conta pelo caixa: valor bruto das vendas pela data em que o dinheiro entrou, menos reembolsos.</small><br>' +
        (estado.config.teto_mei_obs ? '<small>' + esc(estado.config.teto_mei_obs) + '</small>' : '') + '</div>' +
        '<h3>Mês a mês</h3><div class="fin-grafico">' + barras + '</div><p class="fin-legenda"><span class="fin-b-fat"></span> Faturamento <span class="fin-b-rec"></span> Recebido</p>' +
        '<div class="fin-rolagem"><table class="fin-tabela"><thead><tr><th></th>' + MESES.map(m => '<th>' + m + '</th>').join('') + '<th>Ano</th></tr></thead><tbody>' +
        secao('Lucro (data da venda e da compra)') +
        linha('Faturamento', r.faturamento, r.totais.faturamento) + linha('Despesas PJ', r.despesas, r.totais.despesas) +
        linha('Lucro', r.lucro, r.totais.lucro, 'fin-linha-total') +
        secao('Caixa da conta PJ (entrada e saída de dinheiro)') +
        linha('Entradas na conta PJ', r.entradasPJ, r.totais.entradasPJ) + linha('Pagamentos PJ', r.pagamentosPJ.map(v => -v), -r.totais.pagamentosPJ) +
        linha('Movimento do mês', r.movPJ, r.totais.movPJ) + linha('Repasse pra você (PF)', r.repasse.map(v => -v), -r.totais.repasse) +
        linha('Saldo na conta PJ', r.saldo, r.totais.saldo, 'fin-linha-total') +
        secao('Recebimentos (todas as contas)') +
        linha('Recebido', r.recebido, r.totais.recebido) + linha('A receber', r.aReceber, soma(r.aReceber)) + '</tbody></table></div>' +
        '<p class="fin-nota">Lucro = faturamento (valor bruto na data da venda) − despesas PJ (na data da compra; parcela do cartão no mês da fatura). Caixa da conta PJ: entradas (vendas fora da Voomp e saques da Voomp) − pagamentos (despesas PJ; as do cartão pessoal no dia do reembolso) = movimento do mês. Saldo na conta PJ = saldo do mês anterior + movimento − repasse pra você' + (r.saldoInicial ? ' (começa o ano com ' + esc(finBRL(r.saldoInicial)) + ')' : '') + '; na coluna Ano, o saldo de hoje. Repasse negativo = você cobriu despesa da empresa do seu bolso. O dinheiro na Voomp fica de fora até o saque. Recebido = líquido, só o que já caiu até hoje, em qualquer conta (Voomp, PJ e PF).</p>';
      $('#res-ano').onchange = e => { estado.ano = Number(e.target.value); renderResumo(); };
      $('#btn-teto').onclick = editarTeto;
    }
    const cartao = (t, v) => '<div class="fin-cartao"><small>' + t + '</small><b>' + esc(finBRL(v)) + '</b></div>';

    async function editarTeto() {
      const r = await modal('Teto anual do MEI',
        '<label class="fin-campo">Valor (R$)<input name="teto" inputmode="decimal" value="' + esc(String(estado.config.teto_mei_anual || '').replace('.', ',')) + '"></label>' +
        '<label class="fin-campo">Observação<textarea name="obs" rows="3">' + esc(estado.config.teto_mei_obs || '') + '</textarea></label>',
        [{ texto: 'Cancelar', valor: null }, { texto: 'Salvar', valor: 'coletar', primario: true }]);
      if (!r) return;
      const v = finNumero(r.teto);
      if (isNaN(v) || v <= 0) { await aviso('Valor inválido', 'Digite o teto em reais, por exemplo 81000.'); return; }
      const { error } = await sb.from('fin_config').upsert([{ chave: 'teto_mei_anual', valor: String(v) }, { chave: 'teto_mei_obs', valor: r.obs || '' }], { onConflict: 'chave' });
      if (error) { await aviso('Não salvou', error.message); return; }
      await recarregar();
    }

    // ---------- PESSOAL (PF) ----------
    function renderPessoal() {
      const r = finResumoPF(estado.lancs, estado.pAno, hoje);
      const linha = (nome, arr, tot, cls) => '<tr class="' + (cls || '') + '"><th>' + esc(nome) + '</th>' + arr.map(v => v === null ? '<td>—</td>' : '<td class="' + (v < 0 ? 'neg' : '') + '">' + esc(finBRL(v)) + '</td>').join('') + '<td><b>' + esc(tot === null ? '—' : finBRL(tot)) + '</b></td></tr>';
      const secao = t => '<tr class="fin-secao"><th>' + t + '</th>' + MESES.map(() => '<td></td>').join('') + '<td></td></tr>';
      const acHoje = r.acumulada.filter(v => v !== null);
      const novo = (titulo, natureza) => ({ titulo, natureza, dono: 'PF', data_competencia: hoje, data_caixa: hoje, descricao: '', produto: '', categoria: '', conta: 'conta_pf', meio: 'pix', valor_bruto: '', taxa: 0, observacao: '' });
      $('#aba-pessoal').innerHTML =
        '<div class="fin-filtros"><label>Ano <select id="p-ano">' + selAnos(estado.pAno) + '</select></label></div>' +
        '<div class="fin-acoes"><button class="fin-btn fin-btn-primario" id="p-gasto" type="button">Lançar gasto (pix)</button><button class="fin-btn" id="p-receita" type="button">Lançar receita (pix)</button></div>' +
        '<div class="fin-cartoes">' + cartao('Entrou no ano', r.totais.entradas) + cartao('Gastou no ano', r.totais.gastos) + cartao('Sobrou no ano', r.totais.sobra) +
        cartao('Veio da PJ', finArred(r.totais.repasse + r.totais.vendaPJ)) + '</div>' +
        '<div class="fin-rolagem"><table class="fin-tabela"><thead><tr><th></th>' + MESES.map(m => '<th>' + m + '</th>').join('') + '<th>Ano</th></tr></thead><tbody>' +
        secao('Entrou') +
        linha('Repasse da PJ', r.repasse, r.totais.repasse) + linha('Venda da PJ paga na sua conta', r.vendaPJ, r.totais.vendaPJ) + linha('Outras receitas', r.outras, r.totais.outras) +
        linha('Total que entrou', r.entradas, r.totais.entradas, 'fin-linha-total') +
        secao('Gastou') +
        r.ordemCats.map(c => linha(c, r.cats[c], r.totaisCat[c])).join('') +
        linha('Total gasto', r.gastos, r.totais.gastos, 'fin-linha-total') +
        secao('Sobra') +
        linha('Sobra do mês', r.sobra, r.totais.sobra) + linha('Sobra acumulada', r.acumulada, acHoje.length ? acHoje[acHoje.length - 1] : null, 'fin-linha-total') +
        '</tbody></table></div>' +
        '<p class="fin-nota">Pelo dia em que o dinheiro entrou ou saiu: cartão no vencimento da fatura, pix no dia. Repasse da PJ já desconta o que você cobriu da empresa do seu bolso. O reembolso das despesas da empresa pagas no seu cartão não entra aqui: é dinheiro da empresa que só passa pela sua conta. Pra trocar a categoria de um gasto, edite na aba Lançamentos (Dono = PF). Gasto no cartão entra pela fatura (aba PF x PJ, marcando PF).</p>';
      $('#p-ano').onchange = e => { estado.pAno = Number(e.target.value); renderPessoal(); };
      $('#p-gasto').onclick = () => formLancamento(null, novo('Gasto pessoal', 'despesa'));
      $('#p-receita').onclick = () => formLancamento(null, novo('Receita pessoal', 'receita'));
    }

    // ---------- 2. VENDAS POR PRODUTO ----------
    function renderVendas() {
      const { lista, total } = finVendasPorProduto(estado.lancs, estado.vAno, estado.vMes === '' ? null : Number(estado.vMes));
      const lin = o => '<tr><th>' + esc(o.produto) + '</th><td>' + o.qtd + '</td><td>' + esc(finBRL(o.bruto)) + '</td><td>' + esc(finBRL(o.taxas)) + '</td><td>' + esc(finBRL(o.liquido)) + '</td><td>' + esc(finBRL(o.ticket)) + '</td></tr>';
      $('#aba-vendas').innerHTML =
        '<div class="fin-filtros"><label>Ano <select id="v-ano">' + selAnos(estado.vAno) + '</select></label><label>Mês <select id="v-mes">' + selMeses(estado.vMes) + '</select></label></div>' +
        '<div class="fin-rolagem"><table class="fin-tabela"><thead><tr><th>Produto</th><th>Vendas</th><th>Faturamento bruto</th><th>Taxas</th><th>Líquido</th><th>Ticket médio</th></tr></thead><tbody>' +
        (lista.length ? lista.map(lin).join('') : '<tr><td colspan="6">Nenhuma venda nesse período.</td></tr>') +
        (lista.length ? '<tr class="fin-linha-total">' + lin(total).slice(4) : '') + '</tbody></table></div>' +
        '<p class="fin-nota">Venda conta +1, reembolso conta −1. Pela data da venda.</p>';
      $('#v-ano').onchange = e => { estado.vAno = Number(e.target.value); renderVendas(); };
      $('#v-mes').onchange = e => { estado.vMes = e.target.value; renderVendas(); };
    }

    // ---------- 3. PF x PJ ----------
    function renderPfPj() {
      $('#aba-pfpj').innerHTML =
        '<section class="fin-bloco"><h3>Importar fatura do cartão pessoal</h3>' +
        '<p>Escolha o arquivo da fatura (.csv ou .ofx), marque o que é da empresa (PJ) e salve.</p>' +
        '<input type="file" id="f-arquivo" accept=".csv,.ofx,.txt"><div id="f-area"></div></section>' +
        '<section class="fin-bloco" id="reembolso-area"></section>';
      $('#f-arquivo').onchange = lerArquivoFatura;
      renderReembolso();
      renderPreviaFatura();
    }

    async function lerArquivoFatura(e) {
      const arq = e.target.files[0];
      if (!arq) return;
      const texto = await arq.text();
      estado.fatura = { nome: arq.name, vencimento: '', inverter: null, itens: null, csv: null };
      if (/\.ofx$/i.test(arq.name) || /<STMTTRN>/i.test(texto)) {
        const linhas = parseOFX(texto);
        if (!linhas.length) { await aviso('Arquivo vazio', 'Não achei lançamentos nesse OFX.'); estado.fatura = null; return renderPreviaFatura(); }
        estado.fatura.brutas = linhas;
      } else {
        const csv = parseCSV(texto);
        if (!csv.cabecalho.length) { await aviso('Arquivo vazio', 'Não achei linhas nesse CSV.'); estado.fatura = null; return renderPreviaFatura(); }
        estado.fatura.csv = csv;
        if (csv.resultado) estado.fatura.brutas = csv.resultado;
      }
      montarItensFatura();
      renderPreviaFatura();
    }

    function montarItensFatura() {
      const f = estado.fatura;
      if (!f || !f.brutas) { if (f) f.itens = null; return; }
      const norm = finNormalizarSinal(f.brutas, f.inverter);
      f.invertidoAuto = norm.invertido;
      const sep = finSepararFatura(norm.linhas);
      f.ignoradas = sep.ignoradas.length;
      const ids = finIdsFatura(sep.validas);
      f.itens = sep.validas.map((l, i) => {
        const regra = finAcharRegra(l.descricao, estado.regras);
        return { ...l, origem_id: ids[i], dono: regra ? regra.dono : null, categoria: regra ? (regra.categoria || (regra.dono === 'PF' ? 'Outros PF' : 'Outros PJ')) : 'Outros PJ', daRegra: !!regra };
      });
    }

    function renderPreviaFatura() {
      const area = $('#f-area');
      if (!area) return;
      const f = estado.fatura;
      if (!f) { area.innerHTML = ''; return; }
      let html = '<p><b>' + esc(f.nome) + '</b></p>';
      if (f.csv && !f.csv.resultado) {
        const ops = (sel) => '<option value="-1">— escolha —</option>' + f.csv.cabecalho.map((c, i) => '<option value="' + i + '"' + (i === sel ? ' selected' : '') + '>' + esc(c || 'coluna ' + (i + 1)) + '</option>').join('');
        html += '<p>Não reconheci as colunas sozinha. Escolha quais são:</p><div class="fin-filtros"><label>Data <select id="m-data">' + ops(f.csv.cols.data) + '</select></label><label>Descrição <select id="m-desc">' + ops(f.csv.cols.desc) + '</select></label><label>Valor <select id="m-valor">' + ops(f.csv.cols.valor) + '</select></label></div><button class="fin-btn" id="m-ok" type="button">Usar essas colunas</button>';
        area.innerHTML = html;
        $('#m-ok').onclick = async () => {
          const cols = { data: Number($('#m-data').value), desc: Number($('#m-desc').value), valor: Number($('#m-valor').value) };
          if (cols.data < 0 || cols.desc < 0 || cols.valor < 0) { await aviso('Faltou escolher', 'Escolha as três colunas.'); return; }
          const res = finLinhasDoCSV(f.csv.corpo, cols);
          if (!res.length) { await aviso('Nada encontrado', 'Com essas colunas não achei nenhuma linha válida.'); return; }
          f.csv.cols = cols; f.csv.resultado = res; f.brutas = res;
          montarItensFatura(); renderPreviaFatura();
        };
        return;
      }
      if (!f.itens) { area.innerHTML = html; return; }
      const marcados = f.itens.filter(i => i.dono === 'PJ');
      const totalPJ = marcados.reduce((s, i) => s + i.valor, 0);
      html += '<div class="fin-filtros"><label>Vencimento da fatura<input type="date" id="f-venc" value="' + esc(f.vencimento) + '"></label>' +
        '<label class="fin-check"><input type="checkbox" id="f-inv"' + (f.invertidoAuto ? ' checked' : '') + '> Valores negativos são as compras</label></div>' +
        '<p>' + f.itens.length + ' compras na prévia' + (f.ignoradas ? ' · ' + f.ignoradas + ' ignoradas (pagamento de fatura, estorno ou valor negativo)' : '') + '.</p>' +
        '<div class="fin-rolagem"><table class="fin-tabela"><thead><tr><th>Data</th><th>Descrição</th><th>Valor</th><th>PJ ou PF</th><th>Categoria</th></tr></thead><tbody>' +
        f.itens.map((it, i) => '<tr><td>' + finDataBR(it.data) + '</td><td>' + esc(it.descricao) + (it.daRegra ? ' <small class="fin-tag">regra</small>' : '') + '</td><td>' + esc(finBRL(it.valor)) + '</td>' +
          '<td class="fin-pjpf"><button type="button" class="fin-btn fin-btn-mini' + (it.dono === 'PJ' ? ' fin-btn-primario' : '') + '" data-i="' + i + '" data-d="PJ">PJ</button><button type="button" class="fin-btn fin-btn-mini' + (it.dono === 'PF' ? ' fin-btn-primario' : '') + '" data-i="' + i + '" data-d="PF">PF</button></td>' +
          '<td><select data-cat="' + i + '"' + (it.dono ? '' : ' disabled') + '>' + opts(it.dono === 'PF' ? FIN_CATEGORIAS_PF : FIN_CATEGORIAS, it.categoria) + '</select></td></tr>').join('') +
        '</tbody></table></div>' +
        '<p><b>' + marcados.length + '</b> marcadas como PJ, total <b>' + esc(finBRL(totalPJ)) + '</b> · <b>' + f.itens.filter(i => i.dono === 'PF').length + '</b> como PF (vão pra aba Pessoal).</p>' +
        '<button class="fin-btn fin-btn-primario" id="f-salvar" type="button">Salvar fatura</button>';
      area.innerHTML = html;
      area.querySelectorAll('button[data-d]').forEach(b => b.onclick = () => { const it = f.itens[b.dataset.i]; if (it.dono !== b.dataset.d) { it.dono = b.dataset.d; const lista = it.dono === 'PF' ? FIN_CATEGORIAS_PF : FIN_CATEGORIAS; if (!lista.includes(it.categoria)) it.categoria = it.dono === 'PF' ? 'Outros PF' : 'Outros PJ'; } renderPreviaFatura(); });
      area.querySelectorAll('select[data-cat]').forEach(s => s.onchange = () => { f.itens[s.dataset.cat].categoria = s.value; });
      $('#f-venc').onchange = e => { f.vencimento = e.target.value; };
      $('#f-inv').onchange = e => { f.inverter = e.target.checked; montarItensFatura(); renderPreviaFatura(); };
      $('#f-salvar').onclick = salvarFatura;
    }

    async function salvarFatura() {
      const f = estado.fatura;
      if (!f.vencimento) { await aviso('Falta o vencimento', 'Informe a data de vencimento da fatura: é o dia em que o dinheiro saiu.'); return; }
      const marcados = f.itens.filter(i => i.dono === 'PJ');
      const pfs = f.itens.filter(i => i.dono === 'PF');
      const naoMarcadas = f.itens.filter(i => !i.dono).length;
      if (!marcados.length && !pfs.length) { await aviso('Nada marcado', 'Marque PJ ou PF em pelo menos uma compra.'); return; }
      const ok = await confirmar('Salvar fatura', marcados.length + ' despesas PJ (' + finBRL(marcados.reduce((s, i) => s + i.valor, 0)) + ') e ' + pfs.length + ' gastos pessoais (' + finBRL(pfs.reduce((s, i) => s + i.valor, 0)) + ') serão gravados. ' + (naoMarcadas ? naoMarcadas + ' compras sem marcação ficam de fora. ' : '') + 'As marcações PJ/PF viram regras para as próximas faturas.', 'Salvar');
      if (!ok) return;
      if (marcados.length || pfs.length) {
        // PF também é gravado (aba Pessoal, Karol 03/11); id com pf- pra nunca bater com o da PJ
        const rows = marcados.concat(pfs).map(i => ({ natureza: 'despesa', dono: i.dono, data_competencia: i.data, data_caixa: f.vencimento, descricao: i.descricao, produto: null, categoria: i.categoria, conta: 'cartao_pf', meio: 'cartao', valor_bruto: finArred(i.valor), taxa: 0, origem: 'fatura', origem_id: i.dono === 'PF' ? 'pf-' + i.origem_id : i.origem_id, observacao: null }));
        const { error } = await sb.from('fin_lancamentos').upsert(rows, { onConflict: 'origem,origem_id', ignoreDuplicates: true });
        if (error) { await aviso('Não salvou as despesas', error.message); return; }
      }
      const mapaRegras = {};
      f.itens.filter(i => i.dono).forEach(i => { const p = finPadrao(i.descricao); if (p) mapaRegras[p] = { padrao: p, dono: i.dono, categoria: i.categoria || null, atualizado_em: new Date().toISOString() }; });
      const regras = Object.values(mapaRegras);
      if (regras.length) {
        const { error } = await sb.from('fin_regras').upsert(regras, { onConflict: 'padrao' });
        if (error) { await aviso('Despesas salvas, regras não', error.message); }
      }
      estado.fatura = null;
      $('#f-arquivo').value = '';
      await recarregar();
      await aviso('Fatura salva', marcados.length + ' despesas PJ e ' + pfs.length + ' gastos pessoais gravados. Veja o reembolso logo abaixo.');
    }

    // reembolso
    function pendentesReembolso() {
      return estado.lancs.filter(l => l.natureza === 'despesa' && l.dono === 'PJ' && (l.conta === 'cartao_pf' || l.conta === 'conta_pf') && !l.reembolso_em);
    }
    function renderReembolso() {
      const area = $('#reembolso-area');
      if (!area) return;
      const grupos = {};
      pendentesReembolso().forEach(l => {
        const k = l.data_caixa ? l.data_caixa.slice(0, 7) : 'sem-data';
        (grupos[k] = grupos[k] || []).push(l);
      });
      const chaves = Object.keys(grupos).sort();
      let html = '<h3>Reembolso do mês</h3>';
      if (!chaves.length) html += '<p>Nada para reembolsar: a empresa não te deve nada agora.</p>';
      chaves.forEach(k => {
        const itens = grupos[k].sort((a, b) => a.data_competencia.localeCompare(b.data_competencia));
        const total = finArred(itens.reduce((s, l) => s + fn(l.valor_bruto), 0));
        const nome = k === 'sem-data' ? 'Sem data de fatura' : MESES_LONGO[Number(k.slice(5)) - 1] + ' de ' + k.slice(0, 4);
        html += '<div class="fin-reembolso"><div class="fin-reembolso-topo"><b>Fatura de ' + esc(nome) + '</b><span>A empresa te deve <b>' + esc(finBRL(total)) + '</b></span></div>' +
          '<div class="fin-rolagem"><table class="fin-tabela"><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr></thead><tbody>' +
          itens.map(l => '<tr><td>' + finDataBR(l.data_competencia) + '</td><td>' + esc(l.descricao) + '</td><td>' + esc(l.categoria || '') + '</td><td>' + esc(finBRL(l.valor_bruto)) + '</td></tr>').join('') + '</tbody></table></div>' +
          '<div class="fin-acoes"><button class="fin-btn" type="button" data-rel="' + k + '">Baixar relatório</button>' +
          (k === 'sem-data' ? '' : '<button class="fin-btn fin-btn-primario" type="button" data-pago="' + k + '">Marcar reembolso feito</button>') + '</div></div>';
      });
      area.innerHTML = html;
      area.querySelectorAll('[data-rel]').forEach(b => b.onclick = () => baixarRelatorio(b.dataset.rel, grupos[b.dataset.rel]));
      area.querySelectorAll('[data-pago]').forEach(b => b.onclick = () => marcarReembolso(b.dataset.pago, grupos[b.dataset.pago]));
    }

    function baixarRelatorio(k, itens) {
      const csv = finCSVRelatorio(itens.slice().sort((a, b) => a.data_competencia.localeCompare(b.data_competencia)));
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url; a.download = 'reembolso-pj-' + k + '.csv';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    async function marcarReembolso(k, itens) {
      const data = await pedirData('Reembolso feito', 'Em que dia a empresa devolveu o dinheiro para você?', hoje);
      if (!data) return;
      const total = finArred(itens.reduce((s, l) => s + fn(l.valor_bruto), 0));
      const ids = itens.map(l => l.id);
      const up = await sb.from('fin_lancamentos').update({ reembolso_em: data }).in('id', ids);
      if (up.error) { await aviso('Não salvou', up.error.message); return; }
      const oid = 'reembolso-' + k;
      const ex = await sb.from('fin_lancamentos').select('id,valor_bruto').eq('origem', 'manual').eq('origem_id', oid).maybeSingle();
      let erro = null;
      if (ex.data) erro = (await sb.from('fin_lancamentos').update({ valor_bruto: finArred(fn(ex.data.valor_bruto) + total) }).eq('id', ex.data.id)).error;
      else erro = (await sb.from('fin_lancamentos').insert({ natureza: 'transferencia', dono: 'PJ', data_competencia: data, data_caixa: data, descricao: 'Reembolso PJ → Karol', conta: 'conta_pj', conta_destino: 'conta_pf', meio: null, valor_bruto: total, taxa: 0, origem: 'manual', origem_id: oid, observacao: null })).error;
      if (erro) { await aviso('Marquei as despesas, mas a transferência falhou', erro.message); }
      await recarregar();
    }

    // ---------- 4. LANÇAMENTOS ----------
    function lancFiltrados() {
      return estado.lancs.filter(l => {
        if (finAno(l.data_competencia) !== estado.fAno) return false;
        if (estado.fMes !== '' && finMes(l.data_competencia) !== Number(estado.fMes)) return false;
        if (estado.fNat && l.natureza !== estado.fNat) return false;
        if (estado.fDono && l.dono !== estado.fDono) return false;
        return true;
      });
    }
    const NAT_NOME = { receita: 'Receita', estorno: 'Estorno', despesa: 'Despesa', transferencia: 'Transferência' };

    function renderLanc() {
      const lista = lancFiltrados();
      $('#aba-lanc').innerHTML =
        '<div class="fin-filtros"><label>Ano <select id="l-ano">' + selAnos(estado.fAno) + '</select></label><label>Mês <select id="l-mes">' + selMeses(estado.fMes) + '</select></label>' +
        '<label>Tipo <select id="l-nat"><option value="">Todos</option>' + Object.keys(NAT_NOME).map(n => '<option value="' + n + '"' + (estado.fNat === n ? ' selected' : '') + '>' + NAT_NOME[n] + '</option>').join('') + '</select></label>' +
        '<label>Dono <select id="l-dono"><option value="">Todos</option><option value="PJ"' + (estado.fDono === 'PJ' ? ' selected' : '') + '>PJ</option><option value="PF"' + (estado.fDono === 'PF' ? ' selected' : '') + '>PF</option></select></label></div>' +
        '<div class="fin-acoes"><button class="fin-btn fin-btn-primario" id="l-novo" type="button">Novo lançamento</button><button class="fin-btn" id="l-voomp" type="button">Colar extrato da Voomp</button></div>' +
        '<div id="voomp-area"></div>' +
        '<p>' + lista.length + ' lançamentos.</p>' +
        '<div class="fin-rolagem"><table class="fin-tabela"><thead><tr><th>Data</th><th>Caixa</th><th>Tipo</th><th>Dono</th><th>Descrição</th><th>Produto / categoria</th><th>Bruto</th><th>Taxa</th><th>Líquido</th><th></th></tr></thead><tbody>' +
        (lista.length ? lista.map(l => '<tr><td>' + finDataBR(l.data_competencia) + '</td><td>' + finDataBR(l.data_caixa) + '</td><td>' + NAT_NOME[l.natureza] + '</td><td>' + l.dono + '</td><td>' + esc(l.descricao) + '</td><td>' + esc(l.produto || l.categoria || '') + '</td><td>' + esc(finBRL(l.valor_bruto)) + '</td><td>' + esc(finBRL(l.taxa)) + '</td><td>' + esc(finBRL(l.valor_liquido)) + '</td><td class="fin-acoes-linha"><button class="fin-btn fin-btn-mini" type="button" data-ed="' + l.id + '">Editar</button><button class="fin-btn fin-btn-mini fin-btn-perigo" type="button" data-ex="' + l.id + '">Excluir</button></td></tr>').join('') : '<tr><td colspan="10">Nenhum lançamento nesse filtro.</td></tr>') +
        '</tbody></table></div>';
      $('#l-ano').onchange = e => { estado.fAno = Number(e.target.value); renderLanc(); };
      $('#l-mes').onchange = e => { estado.fMes = e.target.value; renderLanc(); };
      $('#l-nat').onchange = e => { estado.fNat = e.target.value; renderLanc(); };
      $('#l-dono').onchange = e => { estado.fDono = e.target.value; renderLanc(); };
      $('#l-novo').onclick = () => formLancamento(null);
      $('#l-voomp').onclick = () => { renderVoompEntrada(); };
      document.querySelectorAll('[data-ed]').forEach(b => b.onclick = () => formLancamento(estado.lancs.find(l => l.id === b.dataset.ed)));
      document.querySelectorAll('[data-ex]').forEach(b => b.onclick = () => excluirLanc(estado.lancs.find(l => l.id === b.dataset.ex)));
      renderPreviaVoomp();
    }

    async function formLancamento(l, padrao) {
      const v = l || padrao || { natureza: 'receita', dono: 'PJ', data_competencia: hoje, data_caixa: '', descricao: '', produto: '', categoria: '', conta: 'conta_pj', meio: 'pix', valor_bruto: '', taxa: 0, observacao: '' };
      const num = x => x === '' || x == null ? '' : String(x).replace('.', ',');
      const corpo =
        '<div class="fin-form">' +
        '<label class="fin-campo">Tipo<select name="natureza">' + Object.keys(NAT_NOME).map(n => '<option value="' + n + '"' + (v.natureza === n ? ' selected' : '') + '>' + NAT_NOME[n] + '</option>').join('') + '</select></label>' +
        '<label class="fin-campo">Dono<select name="dono"><option' + (v.dono === 'PJ' ? ' selected' : '') + '>PJ</option><option' + (v.dono === 'PF' ? ' selected' : '') + '>PF</option></select></label>' +
        '<label class="fin-campo">Data da venda/compra<input type="date" name="data_competencia" value="' + esc(v.data_competencia) + '"></label>' +
        '<label class="fin-campo">Data do recebimento/pagamento<input type="date" name="data_caixa" value="' + esc(v.data_caixa || '') + '"></label>' +
        '<label class="fin-campo fin-larga">Descrição<input name="descricao" value="' + esc(v.descricao) + '"></label>' +
        '<label class="fin-campo">Produto<input name="produto" list="lista-produtos" value="' + esc(v.produto || '') + '"></label>' +
        '<label class="fin-campo">Categoria<input name="categoria" list="lista-categorias" value="' + esc(v.categoria || '') + '"></label>' +
        '<label class="fin-campo">Conta<select name="conta"><option value=""></option>' + opts(FIN_CONTAS, v.conta) + '</select></label>' +
        '<label class="fin-campo">Para qual conta (só transferência)<select name="conta_destino"><option value=""></option>' + opts(FIN_CONTAS, v.conta_destino) + '</select></label>' +
        '<label class="fin-campo">Meio<input name="meio" placeholder="pix, cartao, boleto" value="' + esc(v.meio || '') + '"></label>' +
        '<label class="fin-campo">Valor bruto (R$)<input name="valor_bruto" inputmode="decimal" value="' + esc(num(v.valor_bruto)) + '"></label>' +
        '<label class="fin-campo">Taxa (R$)<input name="taxa" inputmode="decimal" value="' + esc(num(v.taxa)) + '"></label>' +
        '<label class="fin-campo fin-larga">Observação<textarea name="observacao" rows="2">' + esc(v.observacao || '') + '</textarea></label></div>';
      const r = await modal(l && l.id ? 'Editar lançamento' : (v.titulo || 'Novo lançamento'), corpo, [{ texto: 'Cancelar', valor: null }, { texto: 'Salvar', valor: 'coletar', primario: true }]);
      if (!r) return;
      const bruto = finNumero(r.valor_bruto), taxa = r.taxa.trim() ? finNumero(r.taxa) : 0;
      if (!r.descricao.trim() || !r.data_competencia || isNaN(bruto) || bruto < 0 || isNaN(taxa) || taxa < 0) {
        await aviso('Confira os campos', 'Descrição, data da venda/compra e valor bruto são obrigatórios; valores não podem ser negativos.');
        return formLancamento(l ? { ...v, ...r, valor_bruto: r.valor_bruto, taxa: r.taxa } : null, { ...v, ...r, valor_bruto: r.valor_bruto, taxa: r.taxa });
      }
      const dados = { natureza: r.natureza, dono: r.dono, data_competencia: r.data_competencia, data_caixa: r.data_caixa || null, descricao: r.descricao.trim(), produto: r.produto.trim() || null, categoria: r.categoria.trim() || null, conta: r.conta || null, conta_destino: r.natureza === 'transferencia' ? (r.conta_destino || null) : null, meio: r.meio.trim() || null, valor_bruto: finArred(bruto), taxa: finArred(taxa), observacao: r.observacao.trim() || null };
      const q = l && l.id ? sb.from('fin_lancamentos').update(dados).eq('id', l.id) : sb.from('fin_lancamentos').insert({ ...dados, origem: 'manual', origem_id: null });
      const { error } = await q;
      if (error) { await aviso('Não salvou', error.message); return; }
      await recarregar();
    }

    async function excluirLanc(l) {
      if (!l) return;
      const ok = await modal('Excluir lançamento', '<p>Excluir "' + esc(l.descricao) + '" (' + esc(finBRL(l.valor_bruto)) + ', ' + finDataBR(l.data_competencia) + ")? Isso não tem volta.</p>", [{ texto: 'Cancelar', valor: false }, { texto: 'Excluir', valor: true, perigo: true }]);
      if (!ok) return;
      const { error } = await sb.from('fin_lancamentos').delete().eq('id', l.id);
      if (error) { await aviso('Não excluiu', error.message); return; }
      await recarregar();
    }

    // colar extrato Voomp
    function renderVoompEntrada() {
      $('#voomp-area').innerHTML = '<div class="fin-bloco"><h3>Colar extrato da Voomp</h3><p>Copie as linhas da tela de extrato da Voomp e cole aqui.</p><textarea id="voomp-texto" rows="6" placeholder="29/10/2026&#9;Venda&#9;1879697&#9;Método VIP&#9;R$ 1.409,15 Cartão de crédito&#9;29/11/2026"></textarea><div class="fin-acoes"><button class="fin-btn fin-btn-primario" id="voomp-ler" type="button">Ver prévia</button></div></div>';
      $('#voomp-ler').onclick = async () => {
        const regs = parseVoomp($('#voomp-texto').value);
        const itens = [], ignorados = [];
        // A Voomp lança um reembolso em 2 linhas (líquido + taxa) com o mesmo ID: junta numa só, com o total devolvido
        regs.forEach(r => {
          const l = voompParaLancamento(r);
          if (!l) { ignorados.push(r); return; }
          const igual = l.natureza === 'estorno' && itens.find(i => i.origem_id === l.origem_id);
          if (igual) { igual.valor_bruto = finArred(igual.valor_bruto + l.valor_bruto); igual.liquido = igual.valor_bruto; return; }
          itens.push({ ...l, liquido: r.liquido, brutoDigitado: '' });
        });
        if (!itens.length) { await aviso('Nada reconhecido', 'Não achei linhas no formato do extrato (data, tipo, ID, produto, valor, disponível em).'); return; }
        const ex = await sb.from('fin_lancamentos').select('origem_id').eq('origem', 'voomp');
        const jaTem = new Set((ex.data || []).map(x => x.origem_id));
        estado.voomp = { itens: itens.map(i => ({ ...i, existe: jaTem.has(i.origem_id) })), ignorados: ignorados.length };
        renderPreviaVoomp();
      };
    }

    function renderPreviaVoomp() {
      const area = $('#voomp-area');
      const vp = estado.voomp;
      if (!area || !vp) return;
      if (!$('#voomp-texto')) area.innerHTML = '';
      const prev = document.createElement('div');
      prev.id = 'voomp-previa';
      prev.className = 'fin-bloco';
      const novos = vp.itens.filter(i => !i.existe);
      prev.innerHTML = '<h3>Prévia do extrato</h3><p>' + novos.length + ' novos · ' + (vp.itens.length - novos.length) + ' já estavam gravados (serão ignorados)' + (vp.ignorados ? ' · ' + vp.ignorados + ' linhas de tipo desconhecido ignoradas' : '') + '.</p>' +
        '<p class="fin-nota">O valor colado é o líquido. Para vendas, digite o valor bruto (preço cheio) se souber; a taxa vira bruto − líquido. Sem bruto, fica bruto = líquido e a observação avisa para conferir.</p>' +
        '<div class="fin-rolagem"><table class="fin-tabela"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Produto</th><th>Líquido</th><th>Bruto</th><th>Caixa</th><th></th></tr></thead><tbody>' +
        vp.itens.map((i, n) => '<tr class="' + (i.existe ? 'fin-ja' : '') + '"><td>' + finDataBR(i.data_competencia) + '</td><td>' + NAT_NOME[i.natureza] + '</td><td>' + esc(i.descricao) + '</td><td>' + esc(i.produto || '') + '</td><td>' + esc(finBRL(i.liquido)) + '</td><td>' +
          (i.natureza === 'receita' && !i.existe ? '<input class="fin-input-mini" inputmode="decimal" data-bruto="' + n + '" value="' + esc(i.brutoDigitado) + '" placeholder="opcional">' : '—') + '</td><td>' + finDataBR(i.data_caixa) + '</td><td>' + (i.existe ? 'já existe' : '') + '</td></tr>').join('') + '</tbody></table></div>' +
        '<div class="fin-acoes"><button class="fin-btn" id="voomp-cancelar" type="button">Descartar</button><button class="fin-btn fin-btn-primario" id="voomp-gravar" type="button"' + (novos.length ? '' : ' disabled') + '>Gravar ' + novos.length + ' lançamentos</button></div>';
      area.appendChild(prev);
      prev.querySelectorAll('[data-bruto]').forEach(inp => inp.oninput = () => { vp.itens[inp.dataset.bruto].brutoDigitado = inp.value; });
      $('#voomp-cancelar').onclick = () => { estado.voomp = null; area.innerHTML = ''; };
      $('#voomp-gravar').onclick = gravarVoomp;
    }

    async function gravarVoomp() {
      const vp = estado.voomp;
      const rows = [];
      for (const i of vp.itens.filter(x => !x.existe)) {
        let bruto = i.liquido, taxa = 0, obs = i.observacao;
        if (i.natureza === 'receita') {
          const b = finNumero(i.brutoDigitado);
          if (i.brutoDigitado && !isNaN(b)) {
            if (b < i.liquido) { await aviso('Bruto menor que o líquido', 'Confira o bruto da venda ' + i.origem_id + ': não pode ser menor que o líquido.'); return; }
            bruto = finArred(b); taxa = finArred(b - i.liquido);
          } else obs = 'bruto/taxa a conferir (valor colado é o líquido)';
        }
        const { liquido, brutoDigitado, existe, ...limpo } = i;
        rows.push({ ...limpo, valor_bruto: bruto, taxa, observacao: obs });
      }
      const { error } = await sb.from('fin_lancamentos').upsert(rows, { onConflict: 'origem,origem_id', ignoreDuplicates: true });
      if (error) { await aviso('Não gravou', error.message); return; }
      estado.voomp = null;
      await recarregar();
      await aviso('Extrato gravado', rows.length + ' lançamentos novos.');
    }

    // ---------- geral ----------
    function renderTudo() {
      renderResumo(); renderVendas(); renderLanc(); renderPessoal();
      const pf = $('#aba-pfpj');
      if (pf && pf.querySelector('#reembolso-area')) renderReembolso(); else renderPfPj();
    }

    function montarEsqueleto() {
      $('#fin-raiz').innerHTML =
        '<nav class="fin-abas"><button class="fin-aba ativa" data-aba="resumo" type="button">Resumo</button><button class="fin-aba" data-aba="vendas" type="button">Vendas por produto</button><button class="fin-aba" data-aba="pfpj" type="button">PF x PJ</button><button class="fin-aba" data-aba="lanc" type="button">Lançamentos</button><button class="fin-aba" data-aba="pessoal" type="button">Pessoal (PF)</button></nav>' +
        '<section class="fin-painel" id="aba-resumo"></section><section class="fin-painel" id="aba-vendas" hidden></section><section class="fin-painel" id="aba-pfpj" hidden></section><section class="fin-painel" id="aba-lanc" hidden></section><section class="fin-painel" id="aba-pessoal" hidden></section>' +
        '<datalist id="lista-produtos">' + FIN_PRODUTOS.map(p => '<option value="' + esc(p) + '">').join('') + '</datalist><datalist id="lista-categorias">' + FIN_CATEGORIAS.concat(FIN_CATEGORIAS_PF).map(p => '<option value="' + esc(p) + '">').join('') + '</datalist>';
      document.querySelectorAll('.fin-aba').forEach(b => b.onclick = () => abrirAba(b.dataset.aba));
    }

    document.addEventListener('DOMContentLoaded', async () => {
      sb = getSupabase();
      const raiz = $('#fin-raiz');
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { window.location.href = 'index.html'; return; }
      if ((session.user.email || '').toLowerCase() !== FIN_EMAIL) {
        raiz.innerHTML = '<div class="fin-restrita"><h1>Página restrita</h1></div>';
        return;
      }
      $('#fin-email').textContent = session.user.email;
      montarEsqueleto();
      try { await carregarTudo(); } catch (e) { raiz.insertAdjacentHTML('afterbegin', '<p class="fin-erro">Não consegui carregar os dados: ' + esc(e.message || e) + '. As tabelas já foram criadas no banco?</p>'); }
      renderTudo();
    });
  })();
}
