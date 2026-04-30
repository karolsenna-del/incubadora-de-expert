// Launch Command Center — Metrics
// Fetches and processes campaign metrics from Supabase

const FETCH_TIMEOUT_MS = 15000; // 15s timeout for mobile

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${label} demorou mais de ${ms/1000}s`)), ms)
    )
  ]);
}

async function fetchDashboardData() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase not initialized');
  }

  const params = CONFIG.launchSlug
    ? { p_launch_slug: CONFIG.launchSlug }
    : { p_campaign_ref: CONFIG.campaignRef };

  const { data, error } = await withTimeout(
    client.rpc('get_launch_dashboard', params),
    FETCH_TIMEOUT_MS,
    'get_launch_dashboard'
  );

  if (error) {
    console.error('RPC error:', error);
    throw error;
  }

  console.log('Dashboard data:', data);
  return data;
}

async function saveManualSpend(date, spend) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase not initialized');
  }

  // Get campaign_id first
  const { data: campaign } = await client
    .from('campanhas')
    .select('id')
    .eq('evento_referencia', CONFIG.campaignRef)
    .single();

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  const { data, error } = await client
    .from('ad_metrics')
    .upsert({
      date: date,
      campaign_id: campaign.id,
      spend: spend,
      source: 'manual'
    }, {
      onConflict: 'date,campaign_id'
    });

  if (error) {
    console.error('Save error:', error);
    throw error;
  }

  return data;
}

async function fetchRecoveryLeads() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase not initialized');
  }

  const { data, error } = await withTimeout(
    client
      .from('v_recovery_dashboard')
      .select('*')
      .eq('campaign_ref', CONFIG.campaignRef)
      .neq('recovery_status', 'purchased')
      .order('first_capture_at', { ascending: false })
      .limit(50),
    FETCH_TIMEOUT_MS,
    'recovery_leads'
  );

  if (error) {
    console.error('Recovery fetch error:', error);
    throw error;
  }

  return data || [];
}

async function markAsContacted(pessoaId, channel) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase not initialized');
  }

  // Check existing attempts
  const { data: existing } = await client
    .from('recovery_contacts')
    .select('attempt_number')
    .eq('pessoa_id', pessoaId)
    .eq('campaign_ref', CONFIG.campaignRef)
    .order('attempt_number', { ascending: false })
    .limit(1);

  const nextAttempt = existing && existing.length > 0
    ? existing[0].attempt_number + 1
    : 1;

  const { error } = await client
    .from('recovery_contacts')
    .insert({
      pessoa_id: pessoaId,
      campaign_ref: CONFIG.campaignRef,
      channel: channel,
      attempt_number: nextAttempt,
      status: 'sent'
    });

  if (error) {
    console.error('Contact error:', error);
    throw error;
  }
}

async function markAsRecovered(pessoaId) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase not initialized');
  }

  // Find the most recent contact record to update
  const { data: latest } = await client
    .from('recovery_contacts')
    .select('id')
    .eq('pessoa_id', pessoaId)
    .eq('campaign_ref', CONFIG.campaignRef)
    .is('converted_at', null)
    .order('contacted_at', { ascending: false })
    .limit(1)
    .single();

  if (!latest) {
    throw new Error('No contact record found for this lead');
  }

  const { error } = await client
    .from('recovery_contacts')
    .update({
      converted_at: new Date().toISOString(),
      conversion_value: CONFIG.defaultConversionValue
    })
    .eq('id', latest.id);

  if (error) {
    console.error('Recovery error:', error);
    throw error;
  }
}
