-- bia_handoffs — registro de handoffs humanos. O OUTBOUND grava quando um
-- humano assume a conversa (status 'aberto'); fecha quando resolve.
-- Espelha a tabela de produção.

CREATE TABLE IF NOT EXISTS bia_handoffs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id   TEXT NOT NULL,
  subscriber_name TEXT,
  phone           TEXT,
  agent_id        TEXT NOT NULL DEFAULT 'bia',
  reason          TEXT NOT NULL DEFAULT 'handoff_ia',
  status          TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto','resolvido','expirado')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  resolved_at     TIMESTAMPTZ,
  resolved_by     TEXT,
  notas           TEXT
);

CREATE INDEX IF NOT EXISTS idx_bia_handoffs_status
  ON bia_handoffs (status) WHERE status = 'aberto';

ALTER TABLE bia_handoffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bia_handoffs_service_all" ON bia_handoffs
  FOR ALL USING (true) WITH CHECK (true);
