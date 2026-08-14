-- Tally Integration: forms catalog + submissions store
-- Todas as respostas de todos os forms do Tally ficam aqui

-- 1. Catalogo de formularios
CREATE TABLE IF NOT EXISTS tally_forms (
  id text PRIMARY KEY,                    -- ID do Tally (ex: '5BL0rP')
  name text NOT NULL,
  status text NOT NULL DEFAULT 'PUBLISHED',
  form_type text NOT NULL DEFAULT 'pesquisa', -- nps, obrigado, pesquisa, feedback, etc
  url text,
  total_submissions int NOT NULL DEFAULT 0,
  webhook_id text,                        -- ID do webhook no Tally (pra gerenciar)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Todas as submissions
CREATE TABLE IF NOT EXISTS tally_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tally_submission_id text UNIQUE NOT NULL, -- ID original do Tally (dedup)
  form_id text NOT NULL REFERENCES tally_forms(id),
  submitted_at timestamptz NOT NULL,
  is_completed boolean NOT NULL DEFAULT true,
  answers jsonb NOT NULL DEFAULT '{}',     -- normalizado: {"pergunta": "resposta"}
  raw_answers jsonb NOT NULL DEFAULT '[]', -- payload bruto do Tally
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indices
CREATE INDEX idx_tally_submissions_form_id ON tally_submissions(form_id);
CREATE INDEX idx_tally_submissions_submitted_at ON tally_submissions(submitted_at DESC);
CREATE INDEX idx_tally_forms_form_type ON tally_forms(form_type);

-- RLS
ALTER TABLE tally_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tally_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_tally_forms" ON tally_forms FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_tally_submissions" ON tally_submissions FOR SELECT TO anon USING (true);
CREATE POLICY "service_all_tally_forms" ON tally_forms FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_tally_submissions" ON tally_submissions FOR ALL TO service_role USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_tally_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tally_forms_updated_at
  BEFORE UPDATE ON tally_forms
  FOR EACH ROW EXECUTE FUNCTION update_tally_forms_updated_at();
