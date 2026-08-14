-- Migration: Create recovery_contacts table
-- Author: @data-engineer (Dara)
-- PRD: Launch Command Center - E1.S2

CREATE TABLE IF NOT EXISTS recovery_contacts (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pessoa_id         uuid NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
  campaign_ref      text NOT NULL,
  channel           text NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  contacted_at      timestamptz NOT NULL DEFAULT now(),
  attempt_number    integer NOT NULL DEFAULT 1,
  status            text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'replied')),
  converted_at      timestamptz,
  conversion_value  numeric(10,2),
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_recovery_pessoa ON recovery_contacts (pessoa_id);
CREATE INDEX idx_recovery_campaign ON recovery_contacts (campaign_ref);
CREATE INDEX idx_recovery_status ON recovery_contacts (status);

-- RLS
ALTER TABLE recovery_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on recovery_contacts"
  ON recovery_contacts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on recovery_contacts"
  ON recovery_contacts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on recovery_contacts"
  ON recovery_contacts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service_role all on recovery_contacts"
  ON recovery_contacts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
