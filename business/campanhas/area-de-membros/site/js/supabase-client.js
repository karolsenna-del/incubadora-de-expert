// Área de Membros — Supabase Client
// Mesmo padrao do Launch Command Center (lp-dash-engineer/data/dashboard-template)

let sbClient = null;

function initSupabase() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) {
    console.error('Supabase credentials not configured. Update js/config.js');
    return null;
  }
  sbClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  return sbClient;
}

function getSupabase() {
  if (!sbClient) return initSupabase();
  return sbClient;
}
