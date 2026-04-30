// Launch Command Center — Creative Scoreboard
// Shows per-ad performance: which creatives are selling and at what cost

async function fetchCreativeScoreboard() {
  const client = getSupabase();
  const { data, error } = await client.rpc('get_creative_scoreboard', {
    p_campaign_ref: CONFIG.campaignRef
  });
  if (error) throw error;
  return data || [];
}

function initCriativos() {
  document.querySelector('[data-tab="criativos"]')?.addEventListener('click', () => {
    loadCriativosTab();
  });
}

async function loadCriativosTab() {
  const container = document.getElementById('criativos-content');
  container.innerHTML = '<p class="text-gray-500 text-center py-8">Carregando criativos...</p>';

  try {
    const creatives = await fetchCreativeScoreboard();
    if (creatives.length === 0) {
      container.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhum dado de criativo ainda. Os dados aparecem apos o proximo sync do Meta Ads (a cada 15min).</p>';
      return;
    }
    renderCreativeScoreboard(creatives, container);
  } catch (err) {
    console.error('Criativos load failed:', err);
    container.innerHTML = '<p class="text-red-400 text-center py-8">Erro ao carregar criativos: ' + err.message + '</p>';
  }
}

function renderCreativeScoreboard(creatives, container) {
  // Find best RPM for highlighting
  const withSales = creatives.filter(c => c.sales > 0);
  const bestRpm = withSales.length > 0 ? Math.max(...withSales.map(c => c.rpm)) : 0;
  const avgCpa = withSales.length > 0
    ? withSales.reduce((s, c) => s + c.cost_per_sale, 0) / withSales.length
    : 0;

  container.innerHTML = `
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-700 bg-gray-850 flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-300">Scoreboard de Criativos</h3>
        <button onclick="loadCriativosTab()" class="text-gray-400 hover:text-white text-xs transition-colors">Atualizar</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700 text-xs">
              <th class="py-2.5 px-3 text-left text-gray-400 font-medium">Criativo</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">Vendas</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">Gasto</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">CPA</th>
              <th class="py-2.5 px-3 text-right text-indigo-400 font-medium">RPM *</th>
              <th class="py-2.5 px-3 text-right text-yellow-400 font-medium">Hook %</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">CTR</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">Connect</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">Conv.</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">LPV</th>
              <th class="py-2.5 px-3 text-right text-gray-400 font-medium">CPC</th>
            </tr>
          </thead>
          <tbody>
            ${creatives.map((c, i) => {
              const isBest = c.rpm === bestRpm && c.sales > 0;
              const noSales = c.sales === 0;
              const rowClass = isBest ? 'bg-indigo-900/20' : noSales ? 'opacity-50' : '';
              const badge = isBest ? '<span class="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-900 text-green-300">TOP</span>' : '';
              const cpaColor = c.sales > 0 ? (c.cost_per_sale <= avgCpa ? 'text-green-400' : 'text-red-400') : 'text-gray-500';

              return `
                <tr class="border-b border-gray-700 ${rowClass}">
                  <td class="py-2.5 px-3 text-white text-sm font-medium">${c.ad_name}${badge}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm ${c.sales > 0 ? 'text-green-400' : 'text-gray-500'}">${c.sales}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm text-white">${fmtCur(c.spend)}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm ${cpaColor}">${c.sales > 0 ? fmtCur(c.cost_per_sale) : '—'}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm ${isBest ? 'text-indigo-300 font-bold' : 'text-white'}">${c.sales > 0 ? fmtCur(c.rpm) : '—'}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm text-yellow-300">${c.hook_rate > 0 ? c.hook_rate + '%' : '—'}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm text-gray-300">${c.ctr}%</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm text-gray-300">${c.connect_rate}%</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm text-gray-300">${c.sales > 0 ? c.page_conversion + '%' : '—'}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm text-gray-400">${c.lpv}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-sm text-gray-400">${fmtCur(c.cpc)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="px-4 py-2 border-t border-gray-700 bg-gray-850">
        <p class="text-xs text-gray-500">* RPM = Receita por 1000 Page Views. Hook % = views de 3s / impressoes. CPA = Custo por Aquisicao. Criativos sem venda ficam esmaecidos.</p>
      </div>
    </div>
  `;
}

function fmtCur(val) {
  const num = Number(val) || 0;
  return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
