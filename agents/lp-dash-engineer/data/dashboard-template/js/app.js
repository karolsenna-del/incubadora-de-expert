// Launch Command Center — Main App
// Entry point, orchestrates initialization and auto-refresh

let refreshTimer = null;
let lastUpdate = null;

async function init() {
  // Aguardar Supabase CDN carregar (pode demorar no mobile)
  let retries = 0;
  while (typeof supabase === 'undefined' && retries < 20) {
    await new Promise(r => setTimeout(r, 250));
    retries++;
  }

  if (typeof supabase === 'undefined') {
    showError('Erro ao carregar dependencias. Verifique sua conexao e recarregue.');
    return;
  }

  // Initialize Supabase
  const client = initSupabase();
  if (!client) {
    showError('Supabase nao configurado. Edite js/config.js com suas credenciais.');
    return;
  }

  // Initialize UI
  initTabs();
  initSpendForm();
  initCriativos();
  initTesting();

  // Initial data load
  await refreshDashboard();

  // Start auto-refresh
  startAutoRefresh();
}

async function refreshDashboard() {
  showLoading();
  updateRefreshIndicator(true);

  try {
    // Parallelizar as 2 chamadas (antes era sequencial)
    const [data, leads] = await Promise.all([
      fetchDashboardData(),
      fetchRecoveryLeads().catch(err => {
        console.warn('Recovery leads failed (non-blocking):', err);
        return [];
      })
    ]);

    // Campaign tab
    renderKPICards(data);
    renderMetricsTable(data);

    // Recovery tab
    renderBiaSalesKPIs(data);
    renderRecoveryKPIs(data);
    renderRecoveryList(leads);

    // Update timestamp
    lastUpdate = new Date();
    updateTimestamp();
    updateRefreshIndicator(false);
  } catch (err) {
    console.error('Dashboard refresh failed:', err);
    const isTimeout = err.message && err.message.includes('Timeout');
    const msg = isTimeout
      ? 'Conexao lenta — tente novamente em alguns segundos.'
      : 'Erro ao carregar dados: ' + err.message;
    showError(msg);
    updateRefreshIndicator(false);
  }
}

async function refreshRecoveryTab() {
  try {
    const data = await fetchDashboardData();
    renderBiaSalesKPIs(data);
    renderRecoveryKPIs(data);
    const leads = await fetchRecoveryLeads();
    renderRecoveryList(leads);
  } catch (err) {
    console.error('Recovery refresh failed:', err);
  }
}

function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(refreshDashboard, CONFIG.refreshInterval);
}

function resetAutoRefresh() {
  startAutoRefresh();
}

function updateTimestamp() {
  const el = document.getElementById('last-update');
  if (el && lastUpdate) {
    el.textContent = lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}

function updateRefreshIndicator(isRefreshing) {
  const btn = document.getElementById('refresh-btn');
  if (btn) {
    if (isRefreshing) {
      btn.classList.add('animate-spin');
    } else {
      btn.classList.remove('animate-spin');
    }
  }
}

// Manual refresh handler
function handleManualRefresh() {
  resetAutoRefresh();
  refreshDashboard();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
