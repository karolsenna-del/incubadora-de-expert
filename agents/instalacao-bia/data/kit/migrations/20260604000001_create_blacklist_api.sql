-- blacklist_api — opt-out geral da Bia (lead escreve "Sair").
-- Lida pelo INBOUND (Apply OptOut) e pelo AGENT-CORE antes de responder.
-- Espelha a tabela de produção. Os workflows acessam via service_role (bypassa RLS).

CREATE TABLE IF NOT EXISTS blacklist_api (
  phone      TEXT PRIMARY KEY,
  reason     TEXT DEFAULT 'opt-out',
  source     TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blacklist_api ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON blacklist_api
  FOR ALL TO service_role USING (true) WITH CHECK (true);
