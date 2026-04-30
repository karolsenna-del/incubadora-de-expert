// Launch Command Center — Supabase Client
// Initializes the Supabase client for data access

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
  if (!sbClient) {
    return initSupabase();
  }
  return sbClient;
}
