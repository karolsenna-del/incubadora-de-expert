// Launch Command Center — UI Rendering
// Handles all DOM manipulation and rendering

// --- Formatting helpers ---

function formatCurrency(value) {
  const num = Number(value) || 0;
  return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(value) {
  const num = Number(value) || 0;
  return num.toFixed(1) + '%';
}

function formatInteger(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR');
}

function formatROI(value) {
  const num = Number(value) || 0;
  return num.toFixed(2) + 'x';
}

// --- Tab switching ---

function initTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update tab buttons
      document.querySelectorAll('[data-tab]').forEach(b => {
        b.classList.remove('border-indigo-500', 'text-indigo-400');
        b.classList.add('border-transparent', 'text-gray-400');
      });
      btn.classList.remove('border-transparent', 'text-gray-400');
      btn.classList.add('border-indigo-500', 'text-indigo-400');

      // Update tab panels
      document.querySelectorAll('[data-panel]').forEach(panel => {
        panel.classList.add('hidden');
      });
      document.querySelector(`[data-panel="${target}"]`).classList.remove('hidden');
    });
  });
}

// --- KPI Cards ---

function renderKPICards(data) {
  const total = data.total || {};

  const cards = [
    { id: 'kpi-revenue', label: 'Receita Total', value: formatCurrency(total.revenue), icon: 'dollar-sign', color: 'text-green-400' },
    { id: 'kpi-spend', label: 'Gasto Total', value: formatCurrency(total.spend), icon: 'trending-down', color: 'text-red-400' },
    { id: 'kpi-roi', label: 'ROI', value: formatROI(total.roi), icon: 'bar-chart-3', color: total.roi >= 1 ? 'text-green-400' : 'text-red-400' },
    { id: 'kpi-sales', label: 'Vendas', value: formatInteger(total.sales), icon: 'shopping-cart', color: 'text-indigo-400' },
  ];

  const container = document.getElementById('kpi-cards');
  container.innerHTML = cards.map(card => `
    <div class="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <span class="text-gray-400 text-sm font-medium">${card.label}</span>
        <i data-lucide="${card.icon}" class="${card.color} w-5 h-5"></i>
      </div>
      <div class="text-2xl font-bold ${card.color}">${card.value}</div>
    </div>
  `).join('');

  lucide.createIcons();
}

// --- Metrics Table ---

function renderMetricsTable(data) {
  const total = data.total || {};
  const yesterday = data.yesterday || {};
  const today = data.today || {};
  const recovery = data.recovery || {};

  const metrics = [
    { label: 'Gasto', format: formatCurrency, key: 'spend' },
    { label: 'Receita', format: formatCurrency, key: 'revenue' },
    { label: 'Vendas', format: formatInteger, key: 'sales' },
    { label: 'Custo por Venda', format: formatCurrency, key: 'cost_per_sale' },
    { label: 'Ticket Medio', format: formatCurrency, key: 'avg_ticket' },
    { label: 'ROI', format: formatROI, key: 'roi' },
    { label: 'CPM', format: formatCurrency, key: 'cpm' },
    { label: 'CTR', format: formatPercent, key: 'ctr' },
    { label: 'Connect Rate', format: formatPercent, key: 'connect_rate' },
    { label: 'Views da Pagina', format: formatInteger, key: 'landing_page_views' },
    { label: 'Conversao Pagina', format: formatPercent, key: 'page_conversion' },
    { label: 'Leads', format: formatInteger, key: 'leads' },
    { label: 'Conversao Checkout', format: formatPercent, key: 'checkout_conversion' },
    { label: 'OB Total %', format: formatPercent, key: 'ob_total_pct' },
    { label: 'OB Apostila %', format: formatPercent, key: 'ob_apostila_pct' },
    { label: 'OB Gravacao %', format: formatPercent, key: 'ob_gravacao_pct' },
  ];

  // Bia sales rows (from recovery object, different data shape)
  const biaRows = [
    {
      label: 'Bia Recovery',
      total: formatInteger(recovery.recovery_sales) + ' / ' + formatCurrency(recovery.recovery_revenue),
      yesterday: formatInteger(recovery.recovery_sales_yesterday) + ' / ' + formatCurrency(recovery.recovery_revenue_yesterday),
      today: formatInteger(recovery.recovery_sales_today) + ' / ' + formatCurrency(recovery.recovery_revenue_today),
    },
    {
      label: 'Bia Upsell Apostila',
      total: formatInteger(recovery.upsell_apostila_sales) + ' / ' + formatCurrency(recovery.upsell_apostila_revenue),
      yesterday: formatInteger(recovery.upsell_apostila_sales_yesterday) + ' / ' + formatCurrency(recovery.upsell_apostila_revenue_yesterday),
      today: formatInteger(recovery.upsell_apostila_sales_today) + ' / ' + formatCurrency(recovery.upsell_apostila_revenue_today),
    },
    {
      label: 'Bia Upsell Gravacao',
      total: formatInteger(recovery.upsell_gravacao_sales) + ' / ' + formatCurrency(recovery.upsell_gravacao_revenue),
      yesterday: formatInteger(recovery.upsell_gravacao_sales_yesterday) + ' / ' + formatCurrency(recovery.upsell_gravacao_revenue_yesterday),
      today: formatInteger(recovery.upsell_gravacao_sales_today) + ' / ' + formatCurrency(recovery.upsell_gravacao_revenue_today),
    },
    {
      label: 'Bia Total',
      total: formatInteger(recovery.bia_total_sales) + ' / ' + formatCurrency(recovery.bia_total_revenue),
      yesterday: formatInteger((recovery.recovery_sales_yesterday || 0) + (recovery.upsell_sales_yesterday || 0)) + ' / ' + formatCurrency((recovery.recovery_revenue_yesterday || 0) + (recovery.upsell_revenue_yesterday || 0)),
      today: formatInteger((recovery.recovery_sales_today || 0) + (recovery.upsell_sales_today || 0)) + ' / ' + formatCurrency((recovery.recovery_revenue_today || 0) + (recovery.upsell_revenue_today || 0)),
    },
  ];

  const tbody = document.getElementById('metrics-tbody');
  tbody.innerHTML = metrics.map(m => `
    <tr class="border-b border-gray-700 hover:bg-gray-750">
      <td class="py-3 px-4 text-gray-300 font-medium">${m.label}</td>
      <td class="py-3 px-4 text-white text-right font-mono">${m.format(total[m.key])}</td>
      <td class="py-3 px-4 text-gray-400 text-right font-mono">${m.format(yesterday[m.key])}</td>
      <td class="py-3 px-4 text-gray-400 text-right font-mono">${m.format(today[m.key])}</td>
    </tr>
  `).join('') + `
    <tr class="border-b border-gray-600"><td colspan="4" class="py-2 px-4 text-xs text-gray-500 uppercase tracking-wider font-medium">Vendas da Bia</td></tr>
  ` + biaRows.map(r => `
    <tr class="border-b border-gray-700 hover:bg-gray-750">
      <td class="py-3 px-4 text-gray-300 font-medium">${r.label}</td>
      <td class="py-3 px-4 text-white text-right font-mono">${r.total}</td>
      <td class="py-3 px-4 text-gray-400 text-right font-mono">${r.yesterday}</td>
      <td class="py-3 px-4 text-gray-400 text-right font-mono">${r.today}</td>
    </tr>
  `).join('');
}

// --- Recovery Panel ---

function renderBiaSalesKPIs(data) {
  const recovery = data.recovery || {};

  const cards = [
    { label: 'Recovery Vendas', value: formatInteger(recovery.recovery_sales), sub: formatCurrency(recovery.recovery_revenue), color: 'text-green-400' },
    { label: 'Upsell Vendas', value: formatInteger(recovery.upsell_sales), sub: formatCurrency(recovery.upsell_revenue), color: 'text-purple-400' },
    { label: 'Bia Total Vendas', value: formatInteger(recovery.bia_total_sales), sub: formatCurrency(recovery.bia_total_revenue), color: 'text-indigo-400' },
    { label: 'Hoje', value: formatInteger((recovery.recovery_sales_today || 0) + (recovery.upsell_sales_today || 0)) + ' vendas', sub: formatCurrency((recovery.recovery_revenue_today || 0) + (recovery.upsell_revenue_today || 0)), color: 'text-yellow-400' },
  ];

  const container = document.getElementById('bia-sales-cards');
  container.innerHTML = cards.map(card => `
    <div class="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <span class="text-gray-400 text-sm font-medium block mb-2">${card.label}</span>
      <div class="text-2xl font-bold ${card.color}">${card.value}</div>
      <div class="text-sm text-gray-500 mt-1">${card.sub}</div>
    </div>
  `).join('');
}

function renderRecoveryKPIs(data) {
  const recovery = data.recovery || {};
  const totalNonBuyers = (recovery.not_contacted || 0) + (recovery.contacted || 0) + (recovery.recovered || 0);
  const recoveryRate = totalNonBuyers > 0
    ? ((recovery.recovered || 0) / totalNonBuyers * 100).toFixed(1)
    : '0.0';

  const cards = [
    { label: 'Leads sem Compra', value: formatInteger(totalNonBuyers), color: 'text-yellow-400' },
    { label: 'Contactados', value: formatInteger(recovery.contacted), color: 'text-blue-400' },
    { label: 'Recuperados', value: formatInteger(recovery.recovered), color: 'text-green-400' },
    { label: 'Taxa Recup.', value: recoveryRate + '%', color: 'text-indigo-400' },
  ];

  const container = document.getElementById('recovery-kpi-cards');
  container.innerHTML = cards.map(card => `
    <div class="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <span class="text-gray-400 text-sm font-medium block mb-2">${card.label}</span>
      <div class="text-2xl font-bold ${card.color}">${card.value}</div>
    </div>
  `).join('');
}

function renderRecoveryList(leads) {
  const container = document.getElementById('recovery-list');

  if (!leads || leads.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Nenhum lead para recuperar</p>';
    return;
  }

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-700 text-left">
            <th class="py-3 px-4 text-gray-400 text-sm font-medium">Nome</th>
            <th class="py-3 px-4 text-gray-400 text-sm font-medium">Email</th>
            <th class="py-3 px-4 text-gray-400 text-sm font-medium">Telefone</th>
            <th class="py-3 px-4 text-gray-400 text-sm font-medium">Captura</th>
            <th class="py-3 px-4 text-gray-400 text-sm font-medium">Status</th>
            <th class="py-3 px-4 text-gray-400 text-sm font-medium">Acoes</th>
          </tr>
        </thead>
        <tbody>
          ${leads.map(lead => `
            <tr class="border-b border-gray-700 hover:bg-gray-750" data-pessoa-id="${lead.pessoa_id}">
              <td class="py-3 px-4 text-white text-sm">${lead.nome || '—'}</td>
              <td class="py-3 px-4 text-gray-300 text-sm">${lead.email || '—'}</td>
              <td class="py-3 px-4 text-gray-300 text-sm">${lead.telefone || '—'}</td>
              <td class="py-3 px-4 text-gray-400 text-sm">${formatDate(lead.first_capture_at)}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.recovery_status)}">
                  ${getStatusLabel(lead.recovery_status)}
                </span>
              </td>
              <td class="py-3 px-4">
                ${renderLeadActions(lead)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Bind action buttons
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', handleLeadAction);
  });
}

function getStatusColor(status) {
  const colors = {
    'not_contacted': 'bg-gray-700 text-gray-300',
    'contacted': 'bg-blue-900 text-blue-300',
    'recovered': 'bg-green-900 text-green-300',
  };
  return colors[status] || colors['not_contacted'];
}

function getStatusLabel(status) {
  const labels = {
    'not_contacted': 'Novo',
    'contacted': 'Contactado',
    'recovered': 'Recuperado',
  };
  return labels[status] || 'Novo';
}

function renderLeadActions(lead) {
  if (lead.recovery_status === 'recovered') {
    return '<span class="text-green-400 text-sm">Convertido</span>';
  }

  if (lead.recovery_status === 'contacted') {
    return `<button data-action="recover" data-pessoa-id="${lead.pessoa_id}"
      class="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg transition-colors">
      Recuperado
    </button>`;
  }

  return `
    <div class="flex gap-2">
      <button data-action="contact" data-pessoa-id="${lead.pessoa_id}" data-channel="whatsapp"
        class="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg transition-colors">
        WhatsApp
      </button>
      <button data-action="contact" data-pessoa-id="${lead.pessoa_id}" data-channel="email"
        class="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors">
        Email
      </button>
    </div>
  `;
}

async function handleLeadAction(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  const pessoaId = btn.dataset.pessoaId;

  btn.disabled = true;
  btn.textContent = '...';

  try {
    if (action === 'contact') {
      await markAsContacted(pessoaId, btn.dataset.channel);
    } else if (action === 'recover') {
      await markAsRecovered(pessoaId);
    }

    // Refresh recovery data
    await refreshRecoveryTab();
  } catch (err) {
    console.error('Action failed:', err);
    btn.textContent = 'Erro';
    setTimeout(() => { btn.disabled = false; btn.textContent = action === 'contact' ? btn.dataset.channel : 'Recuperado'; }, 2000);
  }
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// --- Loading / Error States ---

function showLoading() {
  document.getElementById('kpi-cards').innerHTML = Array(4).fill(`
    <div class="bg-gray-800 rounded-xl p-5 border border-gray-700 animate-pulse">
      <div class="h-4 bg-gray-700 rounded w-24 mb-3"></div>
      <div class="h-8 bg-gray-700 rounded w-32"></div>
    </div>
  `).join('');
}

function showError(message) {
  document.getElementById('kpi-cards').innerHTML = `
    <div class="col-span-full bg-red-900/30 border border-red-700 rounded-xl p-5 text-center">
      <p class="text-red-400">${message}</p>
      <button onclick="refreshDashboard()" class="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm transition-colors">
        Tentar novamente
      </button>
    </div>
  `;
}

// --- Spend Form ---

function initSpendForm() {
  const form = document.getElementById('spend-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = form.querySelector('[name="spend-date"]').value;
    const spend = parseFloat(form.querySelector('[name="spend-value"]').value);

    if (!date || isNaN(spend) || spend <= 0) {
      alert('Preencha data e valor valido');
      return;
    }

    if (new Date(date) > new Date()) {
      alert('Data nao pode ser futura');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    try {
      await saveManualSpend(date, spend);
      form.reset();
      btn.textContent = 'Salvo!';
      setTimeout(() => { btn.textContent = 'Salvar'; btn.disabled = false; }, 2000);
      await refreshDashboard();
    } catch (err) {
      btn.textContent = 'Erro';
      setTimeout(() => { btn.textContent = 'Salvar'; btn.disabled = false; }, 2000);
    }
  });
}
