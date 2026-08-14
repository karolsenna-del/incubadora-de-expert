-- ============================================
-- MIGRATION: bia_whatsapp_contacts
-- Substitui ManyChat como fonte de subscriber data.
-- Armazena contatos WhatsApp com routing de agente,
-- tags, e IDs do Chatwoot pra sync CRM.
-- ============================================
-- Contexto: Migracao Cloud API direto (sem ManyChat)
-- Conta 07 (convite) primeiro, conta 08 depois.
-- ============================================

CREATE TABLE IF NOT EXISTS bia_whatsapp_contacts (
  phone               TEXT PRIMARY KEY,          -- Telefone normalizado (ex: 5511986148815)
  phone_number_id     TEXT NOT NULL,             -- Meta Phone Number ID (identifica a conta: 07 ou 08)
  wa_id               TEXT,                      -- WhatsApp ID (geralmente = phone sem +)
  nome                TEXT DEFAULT 'Lead',       -- Nome do contato (profile.name do WhatsApp)
  active_agent_id     TEXT DEFAULT 'bia',        -- Agent routing (bia, bia-recovery, bia-boas-vindas, bia-convite)
  tags                TEXT[] DEFAULT '{}',       -- Tags (substitui tags ManyChat)
  chatwoot_contact_id BIGINT,                    -- ID do contato no Chatwoot (pra sync)
  chatwoot_conversation_id BIGINT,               -- ID da conversa ativa no Chatwoot
  pessoa_id           UUID,                      -- FK pra tabela pessoas (Supabase)
  last_message_at     TIMESTAMPTZ,               -- Timestamp da ultima mensagem recebida
  is_human_takeover   BOOLEAN DEFAULT FALSE,     -- Flag de atendimento humano ativo
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Index pra busca por phone_number_id (roteamento por conta)
CREATE INDEX IF NOT EXISTS idx_bwc_phone_number_id ON bia_whatsapp_contacts(phone_number_id);

-- Index pra busca por active_agent_id
CREATE INDEX IF NOT EXISTS idx_bwc_active_agent_id ON bia_whatsapp_contacts(active_agent_id);

-- Index pra busca por chatwoot_contact_id (sync reverso)
CREATE INDEX IF NOT EXISTS idx_bwc_chatwoot_contact_id ON bia_whatsapp_contacts(chatwoot_contact_id);

-- Index pra busca por pessoa_id (join com pessoas)
CREATE INDEX IF NOT EXISTS idx_bwc_pessoa_id ON bia_whatsapp_contacts(pessoa_id);

-- Trigger pra atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_bwc_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bwc_updated_at
  BEFORE UPDATE ON bia_whatsapp_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_bwc_updated_at();

-- RLS: service_role tem acesso total, anon pode ler
ALTER TABLE bia_whatsapp_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access" ON bia_whatsapp_contacts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_read_access" ON bia_whatsapp_contacts
  FOR SELECT
  TO anon
  USING (true);
