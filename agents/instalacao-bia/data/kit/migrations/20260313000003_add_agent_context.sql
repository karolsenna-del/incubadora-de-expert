-- BUG-016: Tabela para historico conversacional da Bia (substitui staticData.conversations)
-- Cada subscriber+agent tem uma unica linha com array de mensagens JSONB
-- Resolve race condition de last-writer-wins no staticData compartilhado

CREATE TABLE IF NOT EXISTS bia_agent_context (
  subscriber_id TEXT NOT NULL,
  agent_id TEXT NOT NULL DEFAULT 'bia',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (subscriber_id, agent_id)
);

-- Index pra queries por updated_at (analytics/cleanup futuro)
CREATE INDEX IF NOT EXISTS idx_bia_agent_context_updated
  ON bia_agent_context(updated_at DESC);

-- RLS: service_role bypassa, anon precisa pra dashboard
ALTER TABLE bia_agent_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_agent_context" ON bia_agent_context FOR SELECT TO anon USING (true);
CREATE POLICY "anon_write_agent_context" ON bia_agent_context FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_agent_context" ON bia_agent_context FOR UPDATE TO anon USING (true);
