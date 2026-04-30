// Launch Command Center — Testing System
// Price Lab (sequential price testing) + Page Lab (Meta A/B registration)

// =============================================
// DATA LAYER
// =============================================

async function fetchPriceTests() {
  const client = getSupabase();
  const { data, error } = await client
    .from('price_tests')
    .select('*')
    .eq('campaign_ref', CONFIG.campaignRef)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchPriceTestResults(testId) {
  const client = getSupabase();
  const { data, error } = await client.rpc('get_price_test_results', {
    p_test_id: testId
  });
  if (error) throw error;
  return data;
}

async function insertPriceTest(test) {
  const client = getSupabase();
  const { data, error } = await client
    .from('price_tests')
    .insert({
      campaign_ref: CONFIG.campaignRef,
      test_name: test.test_name,
      product_type: test.product_type,
      price_from: test.price_from,
      price_to: test.price_to,
      control_start: test.control_start,
      control_end: test.control_end,
      treatment_start: test.treatment_start
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function endPriceTest(id, winner, reason) {
  const client = getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { error } = await client
    .from('price_tests')
    .update({
      treatment_end: today,
      status: 'completed',
      winner: winner,
      decision_reason: reason || null
    })
    .eq('id', id);
  if (error) throw error;
}

async function fetchPageTests() {
  const client = getSupabase();
  const { data, error } = await client
    .from('page_tests')
    .select('*')
    .eq('campaign_ref', CONFIG.campaignRef)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function insertPageTest(test) {
  const client = getSupabase();
  const { data, error } = await client
    .from('page_tests')
    .insert({
      campaign_ref: CONFIG.campaignRef,
      test_name: test.test_name,
      variable_tested: test.variable_tested,
      variable_detail: test.variable_detail || null,
      variant_a_label: test.variant_a_label,
      variant_b_label: test.variant_b_label,
      variant_a_url: test.variant_a_url || null,
      variant_b_url: test.variant_b_url || null,
      meta_experiment_id: test.meta_experiment_id || null,
      start_date: test.start_date
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function endPageTest(id, winner, lift, reason) {
  const client = getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { error } = await client
    .from('page_tests')
    .update({
      end_date: today,
      status: 'completed',
      winner: winner,
      winner_lift: lift || null,
      decision_reason: reason || null
    })
    .eq('id', id);
  if (error) throw error;
}

// =============================================
// INIT & TAB MANAGEMENT
// =============================================

let activeLabTab = 'price';

function initTesting() {
  document.querySelector('[data-tab="lab"]')?.addEventListener('click', () => {
    loadLabTab();
  });
}

async function loadLabTab() {
  renderLabSubTabs();
  if (activeLabTab === 'price') {
    await loadPriceLab();
  } else {
    await loadPageLab();
  }
}

function renderLabSubTabs() {
  const container = document.getElementById('lab-subtabs');
  if (!container) return;

  const priceActive = activeLabTab === 'price';
  const pageActive = activeLabTab === 'page';

  container.innerHTML = `
    <div class="flex gap-2 mb-6">
      <button onclick="switchLabTab('price')"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors ${priceActive ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}">
        Price Lab
      </button>
      <button onclick="switchLabTab('page')"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors ${pageActive ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}">
        Page Lab
      </button>
    </div>
  `;
}

function switchLabTab(tab) {
  activeLabTab = tab;
  loadLabTab();
}

// =============================================
// PRICE LAB
// =============================================

async function loadPriceLab() {
  const container = document.getElementById('lab-content');
  container.innerHTML = '<p class="text-gray-500 text-center py-8">Carregando...</p>';

  try {
    const tests = await fetchPriceTests();
    const running = tests.find(t => t.status === 'running');

    if (running) {
      const results = await fetchPriceTestResults(running.id);
      renderPriceComparison(results);
    } else {
      renderNoPriceTest();
    }

    renderPriceHistory(tests.filter(t => t.status === 'completed'));
  } catch (err) {
    console.error('Price Lab load failed:', err);
    container.innerHTML = '<p class="text-red-400 text-center py-8">Erro ao carregar Price Lab</p>';
  }
}

function renderNoPriceTest() {
  const container = document.getElementById('lab-content');
  container.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-gray-700 p-8 mb-6 text-center">
      <p class="text-gray-400 mb-5">Nenhum teste de preco ativo.</p>
      <button onclick="showPriceForm()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
        + Novo Teste de Preco
      </button>
    </div>
  `;
}

function showPriceForm() {
  const container = document.getElementById('lab-content');
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];

  container.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-indigo-500/50 p-6 mb-6">
      <h3 class="text-sm font-medium text-white mb-4">Novo Teste de Preco</h3>
      <form id="price-test-form" class="space-y-4">
        <div>
          <label class="text-xs text-gray-400 block mb-2">Produto</label>
          <div class="flex gap-3">
            <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="radio" name="product_type" value="main" checked class="accent-indigo-500"> Principal
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="radio" name="product_type" value="bump_apostila" class="accent-indigo-500"> Apostila
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="radio" name="product_type" value="bump_gravacao" class="accent-indigo-500"> Gravacao
            </label>
          </div>
        </div>
        <div class="flex items-end gap-3">
          <div class="flex-1">
            <label class="text-xs text-gray-400 block mb-1">De (R$)</label>
            <input type="number" name="price_from" step="0.01" min="0" placeholder="28.00" required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
          <div class="text-gray-500 pb-2 text-lg">→</div>
          <div class="flex-1">
            <label class="text-xs text-gray-400 block mb-1">Para (R$)</label>
            <input type="number" name="price_to" step="0.01" min="0" placeholder="38.00" required autofocus
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-400 block mb-1">Preco antigo rodou de</label>
            <input type="date" name="control_start" value="${threeDaysAgo}" required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Ate</label>
            <input type="date" name="control_end" value="${yesterday}" required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
        </div>
        <div>
          <label class="text-xs text-gray-400 block mb-1">Preco novo comecou em</label>
          <input type="date" name="treatment_start" value="${today}" required
            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            Registrar Teste
          </button>
          <button type="button" onclick="loadPriceLab()" class="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('price-test-form').addEventListener('submit', handleCreatePriceTest);
}

async function handleCreatePriceTest(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Criando...';

  const priceFrom = parseFloat(form.price_from.value);
  const priceTo = parseFloat(form.price_to.value);
  const productType = form.product_type.value;

  const productLabels = { main: 'Principal', bump_apostila: 'Apostila', bump_gravacao: 'Gravacao' };
  const productLabel = productLabels[productType] || productType;

  try {
    await insertPriceTest({
      test_name: productLabel + ' R$' + priceFrom.toFixed(0) + ' → R$' + priceTo.toFixed(0),
      product_type: productType,
      price_from: priceFrom,
      price_to: priceTo,
      control_start: form.control_start.value,
      control_end: form.control_end.value,
      treatment_start: form.treatment_start.value
    });
    await loadPriceLab();
  } catch (err) {
    console.error('Create price test failed:', err);
    btn.textContent = 'Erro — tente novamente';
    setTimeout(() => { btn.disabled = false; btn.textContent = 'Registrar Teste'; }, 2000);
  }
}

function renderPriceComparison(results) {
  const container = document.getElementById('lab-content');
  const test = results.test;
  const ctrl = results.control;
  const treat = results.treatment;
  const conf = results.confidence;

  const metrics = [
    { label: 'Vendas',      key: 'sales',          format: 'int',      upGood: true },
    { label: 'Receita',     key: 'revenue',         format: 'currency', upGood: true },
    { label: 'Ticket Med',  key: 'avg_ticket',      format: 'currency', upGood: true },
    { label: 'Leads',       key: 'leads',           format: 'int',      upGood: true },
    { label: 'Conversao',   key: 'conversion',      format: 'pct',      upGood: true },
    { label: 'CPA',         key: 'cpa',             format: 'currency', upGood: false },
    { label: 'RPM',         key: 'rpm',             format: 'currency', upGood: true, highlight: true },
    { label: 'Gasto',       key: 'spend',           format: 'currency', neutral: true },
    { label: 'OB Rate',     key: 'ob_rate',         format: 'pct',      upGood: true },
    { label: 'Vendas/Dia',  key: 'daily_avg_sales', format: 'dec1',     upGood: true },
    { label: 'Bump Rev',    key: 'bump_revenue',    format: 'currency', upGood: true },
    { label: 'LPV',         key: 'lpv',             format: 'int',      neutral: true },
  ];

  const statusBadge = test.status === 'running'
    ? '<span class="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">Rodando</span>'
    : '<span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">Encerrado</span>';

  const confColors = {
    insufficient: 'bg-red-900/50 border-red-700 text-red-300',
    early: 'bg-orange-900/50 border-orange-700 text-orange-300',
    trending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
    indicative: 'bg-blue-900/50 border-blue-700 text-blue-300',
    conclusive: 'bg-green-900/50 border-green-700 text-green-300'
  };
  const confLabels = {
    insufficient: 'INSUFICIENTE',
    early: 'DADOS INICIAIS',
    trending: 'TENDENCIA',
    indicative: 'INDICATIVO',
    conclusive: 'CONCLUSIVO'
  };

  container.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-4">
      <div class="px-4 py-3 border-b border-gray-700 bg-gray-850">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 class="text-sm font-medium text-white">${test.name} ${statusBadge}</h3>
            <p class="text-xs text-gray-400 mt-0.5">
              ${test.product_type} | Controle: ${fmtDateShort(test.control_start)}–${fmtDateShort(test.control_end)} (${ctrl.days}d)
              | Tratamento: ${fmtDateShort(test.treatment_start)}–${fmtDateShort(test.treatment_end)} (${treat.days}d)
            </p>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="py-2.5 px-4 text-left text-gray-400 text-xs font-medium">Metrica</th>
              <th class="py-2.5 px-4 text-right text-gray-400 text-xs font-medium">R$${test.price_from} (Ctrl)</th>
              <th class="py-2.5 px-4 text-right text-gray-400 text-xs font-medium">R$${test.price_to} (Treat)</th>
              <th class="py-2.5 px-4 text-right text-gray-400 text-xs font-medium">Delta</th>
            </tr>
          </thead>
          <tbody>
            ${metrics.map(m => {
              const cVal = Number(ctrl[m.key]) || 0;
              const tVal = Number(treat[m.key]) || 0;
              const delta = calcDelta(cVal, tVal);
              const deltaClass = m.neutral ? 'text-gray-500' : getDeltaColor(delta, m.upGood);
              const rowBg = m.highlight ? 'bg-indigo-900/20' : '';
              const labelCls = m.highlight ? ' font-bold text-indigo-300' : ' text-gray-300';
              return `
                <tr class="border-b border-gray-700/50 ${rowBg}">
                  <td class="py-2 px-4 text-sm${labelCls}">${m.highlight ? '★ ' : ''}${m.label}</td>
                  <td class="py-2 px-4 text-white text-right font-mono text-sm">${fmtVal(cVal, m.format)}</td>
                  <td class="py-2 px-4 text-white text-right font-mono text-sm">${fmtVal(tVal, m.format)}</td>
                  <td class="py-2 px-4 text-right font-mono text-sm ${deltaClass}">${m.neutral ? '—' : fmtDelta(delta)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="rounded-xl border p-4 mb-4 ${confColors[conf.level] || confColors.insufficient}">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-bold uppercase">${confLabels[conf.level] || 'INSUFICIENTE'}</span>
        <span class="text-xs opacity-75">— min ${conf.min_sample} vendas por periodo</span>
      </div>
      <p class="text-xs opacity-90">${conf.recommendation}</p>
    </div>

    ${test.status === 'running' ? `
      <div class="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <p class="text-xs text-gray-400 mb-3">Encerrar teste:</p>
        <div class="flex flex-wrap gap-2 mb-3">
          <button onclick="promptEndPriceTest('${test.id}', 'control')" class="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs rounded-lg transition-colors">
            Controle Venceu (R$${test.price_from})
          </button>
          <button onclick="promptEndPriceTest('${test.id}', 'treatment')" class="px-4 py-2 bg-green-800 hover:bg-green-700 text-white text-xs rounded-lg transition-colors">
            Tratamento Venceu (R$${test.price_to})
          </button>
          <button onclick="promptEndPriceTest('${test.id}', 'inconclusive')" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors">
            Inconclusivo
          </button>
        </div>
      </div>
    ` : `
      <button onclick="showPriceForm()" class="mb-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
        + Novo Teste
      </button>
    `}
    <div class="px-1 mb-2">
      <p class="text-xs text-gray-600">★ RPM (Receita por 1000 Page Views) = metrica decisora. Combina conversao + ticket medio.</p>
    </div>
  `;
}

async function promptEndPriceTest(id, winner) {
  const reason = prompt('Motivo da decisao (opcional):');
  if (reason === null) return; // cancelled
  try {
    await endPriceTest(id, winner, reason);
    await loadPriceLab();
  } catch (err) {
    console.error('End price test failed:', err);
    alert('Erro ao encerrar teste');
  }
}

function renderPriceHistory(tests) {
  const historyEl = document.getElementById('lab-history');
  if (!historyEl) return;
  if (!tests || tests.length === 0) {
    historyEl.innerHTML = '';
    return;
  }

  const winnerLabel = { control: 'Controle', treatment: 'Tratamento', inconclusive: 'Empate' };
  const winnerColor = { control: 'text-yellow-400', treatment: 'text-green-400', inconclusive: 'text-gray-400' };

  historyEl.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-700 bg-gray-850">
        <h3 class="text-sm font-medium text-gray-300">Historico — Price Lab</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Teste</th>
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Periodo</th>
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Vencedor</th>
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Motivo</th>
              <th class="py-2 px-4 text-right text-gray-400 text-xs font-medium"></th>
            </tr>
          </thead>
          <tbody>
            ${tests.map(t => `
              <tr class="border-b border-gray-700/50 hover:bg-gray-750">
                <td class="py-2 px-4 text-white text-sm">${t.test_name}</td>
                <td class="py-2 px-4 text-gray-400 text-sm">${fmtDateShort(t.control_start)} – ${fmtDateShort(t.treatment_end)}</td>
                <td class="py-2 px-4 text-sm ${winnerColor[t.winner] || 'text-gray-400'}">${winnerLabel[t.winner] || '—'}</td>
                <td class="py-2 px-4 text-gray-400 text-sm truncate max-w-[200px]">${t.decision_reason || '—'}</td>
                <td class="py-2 px-4 text-right">
                  <button onclick="viewPriceTest('${t.id}')" class="text-indigo-400 hover:text-indigo-300 text-xs">Ver</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function viewPriceTest(id) {
  try {
    const results = await fetchPriceTestResults(id);
    renderPriceComparison(results);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('View price test failed:', err);
  }
}

// =============================================
// PAGE LAB
// =============================================

async function loadPageLab() {
  const container = document.getElementById('lab-content');
  container.innerHTML = '<p class="text-gray-500 text-center py-8">Carregando...</p>';

  try {
    const tests = await fetchPageTests();
    const running = tests.find(t => t.status === 'running');

    if (running) {
      renderPageTestActive(running);
    } else {
      renderNoPageTest();
    }

    renderPageHistory(tests.filter(t => t.status === 'completed'));
  } catch (err) {
    console.error('Page Lab load failed:', err);
    container.innerHTML = '<p class="text-red-400 text-center py-8">Erro ao carregar Page Lab</p>';
  }
}

function renderNoPageTest() {
  const container = document.getElementById('lab-content');
  container.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-gray-700 p-8 mb-6 text-center">
      <p class="text-gray-400 mb-2">Nenhum teste de pagina ativo.</p>
      <p class="text-xs text-gray-500 mb-5">Use Teste A/B nativo do Meta Ads (Experiments) pra testar paginas. Registre aqui pra manter historico.</p>
      <button onclick="showPageForm()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
        + Registrar Teste de Pagina
      </button>
    </div>
  `;
}

const PAGE_VARIABLE_LABELS = {
  full_page: 'Pagina inteira',
  headline: 'Headline',
  button: 'Botao / CTA',
  section: 'Secao',
  layout: 'Layout',
  other: 'Outro'
};

function showPageForm() {
  const container = document.getElementById('lab-content');
  const today = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-indigo-500/50 p-6 mb-6">
      <h3 class="text-sm font-medium text-white mb-4">Registrar Teste de Pagina</h3>
      <form id="page-test-form" class="space-y-4">
        <div>
          <label class="text-xs text-gray-400 block mb-2">O que testou?</label>
          <div class="flex flex-wrap gap-2">
            ${Object.entries(PAGE_VARIABLE_LABELS).map(([val, label], i) => `
              <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="radio" name="variable_tested" value="${val}" ${i === 0 ? 'checked' : ''} class="accent-indigo-500"> ${label}
              </label>
            `).join('')}
          </div>
        </div>
        <div>
          <label class="text-xs text-gray-400 block mb-1">Detalhe (o que mudou exatamente)</label>
          <input type="text" name="variable_detail" placeholder="Ex: Headline urgencia vs curiosidade"
            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-400 block mb-1">Variante A (label)</label>
            <input type="text" name="variant_a_label" placeholder="LP atual (v2)" required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Variante B (label)</label>
            <input type="text" name="variant_b_label" placeholder="LP nova (v3)" required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-400 block mb-1">URL Variante A (opcional)</label>
            <input type="url" name="variant_a_url" placeholder="https://..."
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">URL Variante B (opcional)</label>
            <input type="url" name="variant_b_url" placeholder="https://..."
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-400 block mb-1">ID Experimento Meta Ads (opcional)</label>
            <input type="text" name="meta_experiment_id" placeholder="23851234567890"
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Data inicio</label>
            <input type="date" name="start_date" value="${today}" required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            Registrar
          </button>
          <button type="button" onclick="loadPageLab()" class="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('page-test-form').addEventListener('submit', handleCreatePageTest);
}

async function handleCreatePageTest(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Registrando...';

  const varDetail = form.variable_detail.value;
  const varLabel = PAGE_VARIABLE_LABELS[form.variable_tested.value] || form.variable_tested.value;
  const testName = varDetail || (varLabel + ': ' + form.variant_a_label.value + ' vs ' + form.variant_b_label.value);

  try {
    await insertPageTest({
      test_name: testName,
      variable_tested: form.variable_tested.value,
      variable_detail: varDetail,
      variant_a_label: form.variant_a_label.value,
      variant_b_label: form.variant_b_label.value,
      variant_a_url: form.variant_a_url.value,
      variant_b_url: form.variant_b_url.value,
      meta_experiment_id: form.meta_experiment_id.value,
      start_date: form.start_date.value
    });
    await loadPageLab();
  } catch (err) {
    console.error('Create page test failed:', err);
    btn.textContent = 'Erro';
    setTimeout(() => { btn.disabled = false; btn.textContent = 'Registrar'; }, 2000);
  }
}

function renderPageTestActive(test) {
  const container = document.getElementById('lab-content');
  const varLabel = PAGE_VARIABLE_LABELS[test.variable_tested] || test.variable_tested;

  container.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-6">
      <div class="px-4 py-3 border-b border-gray-700 bg-gray-850">
        <h3 class="text-sm font-medium text-white">
          ${test.test_name}
          <span class="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">Rodando</span>
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">${varLabel} | Inicio: ${fmtDateShort(test.start_date)}</p>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-900 rounded-lg p-3">
            <p class="text-xs text-gray-400 mb-1">Variante A</p>
            <p class="text-sm text-white font-medium">${test.variant_a_label}</p>
            ${test.variant_a_url ? `<a href="${test.variant_a_url}" target="_blank" class="text-xs text-indigo-400 hover:text-indigo-300 break-all">${test.variant_a_url}</a>` : ''}
          </div>
          <div class="bg-gray-900 rounded-lg p-3">
            <p class="text-xs text-gray-400 mb-1">Variante B</p>
            <p class="text-sm text-white font-medium">${test.variant_b_label}</p>
            ${test.variant_b_url ? `<a href="${test.variant_b_url}" target="_blank" class="text-xs text-indigo-400 hover:text-indigo-300 break-all">${test.variant_b_url}</a>` : ''}
          </div>
        </div>
        ${test.meta_experiment_id ? `
          <p class="text-xs text-gray-400">Meta Experiment ID: <span class="text-gray-300 font-mono">${test.meta_experiment_id}</span></p>
        ` : ''}
        <div class="border-t border-gray-700 pt-3 mt-3">
          <p class="text-xs text-gray-400 mb-3">Quando o Meta declarar vencedor:</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <button onclick="promptEndPageTest('${test.id}', 'a', '${test.variant_a_label}')" class="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors">
              A Venceu (${test.variant_a_label})
            </button>
            <button onclick="promptEndPageTest('${test.id}', 'b', '${test.variant_b_label}')" class="px-4 py-2 bg-green-800 hover:bg-green-700 text-white text-xs rounded-lg transition-colors">
              B Venceu (${test.variant_b_label})
            </button>
            <button onclick="promptEndPageTest('${test.id}', 'inconclusive', '')" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors">
              Inconclusivo
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function promptEndPageTest(id, winner, winnerLabel) {
  const lift = prompt('Lift observado (ex: +14% conversao):') || '';
  const reason = prompt('Motivo da decisao (ex: Meta declarou significancia):') || '';
  try {
    await endPageTest(id, winner, lift, reason);
    await loadPageLab();
  } catch (err) {
    console.error('End page test failed:', err);
    alert('Erro ao encerrar teste');
  }
}

function renderPageHistory(tests) {
  const historyEl = document.getElementById('lab-history');
  if (!historyEl) return;

  // If price lab already rendered history, append. Otherwise set.
  if (activeLabTab !== 'page') return;

  if (!tests || tests.length === 0) {
    historyEl.innerHTML = '';
    return;
  }

  const winnerLabel = { a: 'A', b: 'B', inconclusive: 'Empate' };
  const winnerColor = { a: 'text-blue-400', b: 'text-green-400', inconclusive: 'text-gray-400' };

  historyEl.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-700 bg-gray-850">
        <h3 class="text-sm font-medium text-gray-300">Historico — Page Lab</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Teste</th>
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Variavel</th>
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Periodo</th>
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Vencedor</th>
              <th class="py-2 px-4 text-left text-gray-400 text-xs font-medium">Lift</th>
            </tr>
          </thead>
          <tbody>
            ${tests.map(t => `
              <tr class="border-b border-gray-700/50 hover:bg-gray-750">
                <td class="py-2 px-4 text-white text-sm">${t.test_name}</td>
                <td class="py-2 px-4 text-gray-400 text-sm">${PAGE_VARIABLE_LABELS[t.variable_tested] || t.variable_tested}</td>
                <td class="py-2 px-4 text-gray-400 text-sm">${fmtDateShort(t.start_date)} – ${fmtDateShort(t.end_date)}</td>
                <td class="py-2 px-4 text-sm ${winnerColor[t.winner] || 'text-gray-400'}">${winnerLabel[t.winner] || '—'}</td>
                <td class="py-2 px-4 text-gray-400 text-sm">${t.winner_lift || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// =============================================
// HELPERS
// =============================================

function calcDelta(ctrl, treat) {
  if (!ctrl || ctrl === 0) return treat > 0 ? 100 : 0;
  return ((treat - ctrl) / ctrl) * 100;
}

function getDeltaColor(delta, upGood) {
  if (Math.abs(delta) < 5) return 'text-yellow-400';
  const isPositive = delta > 0;
  const isGood = upGood ? isPositive : !isPositive;
  return isGood ? 'text-green-400' : 'text-red-400';
}

function fmtVal(val, format) {
  const num = Number(val) || 0;
  if (format === 'currency') return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (format === 'pct') return num.toFixed(1) + '%';
  if (format === 'dec1') return num.toFixed(1);
  return num.toLocaleString('pt-BR');
}

function fmtDelta(delta) {
  const sign = delta > 0 ? '+' : '';
  return sign + delta.toFixed(1) + '%';
}

function fmtDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
