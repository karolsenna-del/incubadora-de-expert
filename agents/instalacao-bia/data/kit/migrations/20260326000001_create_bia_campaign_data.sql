-- Migration: Create bia_campaign_data table
-- Purpose: Move L4 campaign data from n8n staticData to Supabase

CREATE TABLE IF NOT EXISTS bia_campaign_data (
  agent_id TEXT PRIMARY KEY,
  campaign_text TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: service_role bypass (n8n uses service_role key)
ALTER TABLE bia_campaign_data ENABLE ROW LEVEL SECURITY;

-- Simple RPC to get campaign data with agent_id fallback to 'bia'
CREATE OR REPLACE FUNCTION get_campaign_data(p_agent_id TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT campaign_text 
  FROM bia_campaign_data 
  WHERE agent_id = p_agent_id OR agent_id = 'bia'
  ORDER BY CASE WHEN agent_id = p_agent_id THEN 0 ELSE 1 END
  LIMIT 1;
$$;
