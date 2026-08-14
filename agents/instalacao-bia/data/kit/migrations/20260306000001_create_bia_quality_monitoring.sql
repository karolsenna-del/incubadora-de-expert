-- ============================================================================
-- Bia Quality Monitoring System — Schema
-- Epic 6, Story 6.1
-- Architecture: docs/architecture/arch-bia-quality-monitoring.md
-- ============================================================================

-- 1. bia_journeys (created first because bia_conversations references it)
CREATE TABLE bia_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id TEXT NOT NULL,
  subscriber_name TEXT,

  fase_atual TEXT CHECK (fase_atual IN ('abertura', 'escuta', 'conexao', 'oferta', 'followup')),
  outcome_final TEXT CHECK (outcome_final IN ('converteu', 'nao_converteu', 'pendente', 'abandonou')),

  total_conversations INT DEFAULT 0,
  total_messages INT DEFAULT 0,

  first_interaction TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_interaction TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_at TIMESTAMPTZ,

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_bia_journey_subscriber_active ON bia_journeys(subscriber_id) WHERE is_active = true;
CREATE INDEX idx_bia_journey_active ON bia_journeys(is_active, last_interaction DESC);

-- 2. bia_conversations
CREATE TABLE bia_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id TEXT NOT NULL,
  subscriber_name TEXT,

  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,

  message_count_lead INT DEFAULT 0,
  message_count_bia INT DEFAULT 0,
  input_types TEXT[] DEFAULT '{}',

  fase_venda TEXT CHECK (fase_venda IN ('abertura', 'escuta', 'conexao', 'oferta', 'followup')),
  outcome TEXT CHECK (outcome IN ('converteu', 'nao_converteu', 'pendente', 'handoff')),

  latency_avg_ms INT,
  latency_max_ms INT,
  tokens_input INT DEFAULT 0,
  tokens_output INT DEFAULT 0,
  model_used TEXT,

  campaign TEXT,
  manychat_flow TEXT,
  tags TEXT[] DEFAULT '{}',
  errors JSONB DEFAULT '[]',

  journey_id UUID REFERENCES bia_journeys(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_conv_subscriber ON bia_conversations(subscriber_id);
CREATE INDEX idx_bia_conv_started ON bia_conversations(started_at DESC);
CREATE INDEX idx_bia_conv_outcome ON bia_conversations(outcome);
CREATE INDEX idx_bia_conv_journey ON bia_conversations(journey_id);

-- 3. bia_messages
CREATE TABLE bia_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES bia_conversations(id) ON DELETE CASCADE,

  role TEXT NOT NULL CHECK (role IN ('lead', 'bia')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),

  type TEXT NOT NULL CHECK (type IN ('texto', 'audio', 'imagem')),
  raw_input TEXT,

  sequence INT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_msg_conv ON bia_messages(conversation_id);
CREATE INDEX idx_bia_msg_timestamp ON bia_messages(timestamp DESC);

-- 4. bia_scores
CREATE TABLE bia_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES bia_conversations(id) ON DELETE CASCADE,

  score_persona SMALLINT CHECK (score_persona BETWEEN 1 AND 5),
  score_metodo SMALLINT CHECK (score_metodo BETWEEN 1 AND 5),
  score_precisao SMALLINT CHECK (score_precisao BETWEEN 1 AND 5),
  score_empatia SMALLINT CHECK (score_empatia BETWEEN 1 AND 5),
  score_resultado SMALLINT CHECK (score_resultado BETWEEN 1 AND 5),

  score_medio NUMERIC(3,2) GENERATED ALWAYS AS (
    score_persona * 0.25 + score_metodo * 0.25 + score_precisao * 0.20 + score_empatia * 0.20 + score_resultado * 0.10
  ) STORED,

  resumo TEXT,
  sugestoes TEXT[],

  model_judge TEXT DEFAULT 'claude-sonnet',
  tokens_judge_input INT DEFAULT 0,
  tokens_judge_output INT DEFAULT 0,

  evaluated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT bia_scores_conv_unique UNIQUE (conversation_id)
);

CREATE INDEX idx_bia_scores_medio ON bia_scores(score_medio);
CREATE INDEX idx_bia_scores_evaluated ON bia_scores(evaluated_at DESC);

-- 5. bia_flags
CREATE TABLE bia_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES bia_conversations(id) ON DELETE CASCADE,

  tipo TEXT NOT NULL CHECK (tipo IN (
    'alucinacao', 'rage_prompting', 'persona_break',
    'metodo_skip', 'empatia_fail', 'oportunidade_perdida'
  )),
  severidade TEXT NOT NULL CHECK (severidade IN ('critica', 'alta', 'media')),
  descricao TEXT,
  trecho TEXT,

  detected_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_flags_conv ON bia_flags(conversation_id);
CREATE INDEX idx_bia_flags_tipo ON bia_flags(tipo, severidade);
CREATE INDEX idx_bia_flags_detected ON bia_flags(detected_at DESC);

-- 6. bia_moments
CREATE TABLE bia_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES bia_conversations(id) ON DELETE CASCADE,

  tipo TEXT NOT NULL CHECK (tipo IN (
    'naturalidade', 'virada', 'momento_humano', 'objecao_complexa',
    'gratidao', 'conversao_improvavel', 'frase_impacto'
  )),
  citacao TEXT NOT NULL,
  justificativa TEXT NOT NULL,

  confirmado_humano BOOLEAN DEFAULT false,
  descartado BOOLEAN DEFAULT false,
  uso_planejado TEXT[] DEFAULT '{}',
  notas TEXT,

  detected_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

CREATE INDEX idx_bia_moments_tipo ON bia_moments(tipo);
CREATE INDEX idx_bia_moments_confirmado ON bia_moments(confirmado_humano) WHERE confirmado_humano = true;

-- 7. bia_golden_dataset
CREATE TABLE bia_golden_dataset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  categoria TEXT NOT NULL CHECK (categoria IN (
    'abertura', 'escuta', 'objecao_preco', 'objecao_tempo',
    'objecao_confianca', 'objecao_multipla', 'momento_pessoal',
    'interesse_direto', 'followup', 'edge_case', 'tentativa_manipulacao'
  )),
  situacao TEXT NOT NULL,
  input_lead TEXT NOT NULL,
  resposta_boa TEXT NOT NULL,
  resposta_ruim TEXT NOT NULL,
  por_que TEXT NOT NULL,
  fase TEXT CHECK (fase IN ('abertura', 'escuta', 'conexao', 'oferta', 'followup')),

  fonte TEXT CHECK (fonte IN ('real', 'sintetico')) DEFAULT 'sintetico',
  adicionado_por TEXT DEFAULT 'humano',
  conversation_id UUID REFERENCES bia_conversations(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_golden_categoria ON bia_golden_dataset(categoria);
CREATE INDEX idx_bia_golden_fase ON bia_golden_dataset(fase);

-- 8. bia_reviews
CREATE TABLE bia_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES bia_conversations(id) ON DELETE CASCADE,

  acao TEXT NOT NULL CHECK (acao IN (
    'aprovada', 'score_ajustado', 'golden_example',
    'anti_example', 'momento_extraordinario', 'feedback'
  )),

  score_persona_humano SMALLINT CHECK (score_persona_humano BETWEEN 1 AND 5),
  score_metodo_humano SMALLINT CHECK (score_metodo_humano BETWEEN 1 AND 5),
  score_precisao_humano SMALLINT CHECK (score_precisao_humano BETWEEN 1 AND 5),
  score_empatia_humano SMALLINT CHECK (score_empatia_humano BETWEEN 1 AND 5),
  score_resultado_humano SMALLINT CHECK (score_resultado_humano BETWEEN 1 AND 5),

  notas TEXT,

  reviewer TEXT DEFAULT 'euriler',
  reviewed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_reviews_conv ON bia_reviews(conversation_id);
CREATE INDEX idx_bia_reviews_acao ON bia_reviews(acao);
CREATE INDEX idx_bia_reviews_date ON bia_reviews(reviewed_at DESC);

-- 9. bia_prompt_versions
CREATE TABLE bia_prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  versao TEXT NOT NULL,
  camada TEXT NOT NULL CHECK (camada IN ('L1', 'L2', 'L3', 'L4', 'todas')),
  motivo TEXT NOT NULL,
  mudancas TEXT NOT NULL,

  score_medio_antes NUMERIC(3,2),
  score_medio_depois NUMERIC(3,2),

  rolled_back BOOLEAN DEFAULT false,
  rollback_motivo TEXT,

  reviews_motivadoras UUID[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_prompt_versao ON bia_prompt_versions(created_at DESC);

-- 10. bia_judge_calibration
CREATE TABLE bia_judge_calibration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES bia_conversations(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES bia_reviews(id) ON DELETE CASCADE,

  diff_persona SMALLINT,
  diff_metodo SMALLINT,
  diff_precisao SMALLINT,
  diff_empatia SMALLINT,
  diff_resultado SMALLINT,

  concordancia BOOLEAN GENERATED ALWAYS AS (
    ABS(COALESCE(diff_persona, 0)) <= 1 AND
    ABS(COALESCE(diff_metodo, 0)) <= 1 AND
    ABS(COALESCE(diff_precisao, 0)) <= 1 AND
    ABS(COALESCE(diff_empatia, 0)) <= 1 AND
    ABS(COALESCE(diff_resultado, 0)) <= 1
  ) STORED,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_calibration_date ON bia_judge_calibration(created_at DESC);

-- 11. bia_audit_log
CREATE TABLE bia_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  action TEXT NOT NULL,
  target_subscriber TEXT,
  details JSONB DEFAULT '{}',
  performed_by TEXT DEFAULT 'euriler',

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bia_audit_date ON bia_audit_log(created_at DESC);

-- ============================================================================
-- RLS — Row Level Security
-- ============================================================================

ALTER TABLE bia_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_golden_dataset ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_judge_calibration ENABLE ROW LEVEL SECURITY;
ALTER TABLE bia_audit_log ENABLE ROW LEVEL SECURITY;

-- Authenticated user has full access (single-user system)
CREATE POLICY "authenticated_full_access" ON bia_journeys FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_conversations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_scores FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_flags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_moments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_golden_dataset FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_prompt_versions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_judge_calibration FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_full_access" ON bia_audit_log FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- Views
-- ============================================================================

-- Daily metrics aggregation
CREATE VIEW bia_daily_metrics AS
SELECT
  DATE(c.started_at) as dia,
  COUNT(DISTINCT c.id) as total_conversas,
  COUNT(DISTINCT c.id) FILTER (WHERE c.outcome = 'converteu') as conversoes,
  ROUND(AVG(s.score_medio), 2) as score_medio,
  ROUND(AVG(s.score_persona), 2) as avg_persona,
  ROUND(AVG(s.score_metodo), 2) as avg_metodo,
  ROUND(AVG(s.score_precisao), 2) as avg_precisao,
  ROUND(AVG(s.score_empatia), 2) as avg_empatia,
  ROUND(AVG(s.score_resultado), 2) as avg_resultado,
  COUNT(DISTINCT f.id) FILTER (WHERE f.severidade = 'critica') as flags_criticas,
  COUNT(DISTINCT f.id) FILTER (WHERE f.severidade = 'alta') as flags_altas,
  COUNT(DISTINCT m.id) as momentos_extraordinarios,
  ROUND(AVG(c.latency_avg_ms)) as latencia_media,
  SUM(c.tokens_input + c.tokens_output) as tokens_total
FROM bia_conversations c
LEFT JOIN bia_scores s ON s.conversation_id = c.id
LEFT JOIN bia_flags f ON f.conversation_id = c.id
LEFT JOIN bia_moments m ON m.conversation_id = c.id
GROUP BY DATE(c.started_at)
ORDER BY dia DESC;

-- Review queue (prioritized)
CREATE VIEW bia_review_queue AS
SELECT
  c.id as conversation_id,
  c.subscriber_name,
  c.started_at,
  c.outcome,
  s.score_medio,
  s.resumo,
  CASE
    WHEN EXISTS (SELECT 1 FROM bia_flags f WHERE f.conversation_id = c.id AND f.severidade = 'critica') THEN 'critica'
    WHEN EXISTS (SELECT 1 FROM bia_flags f WHERE f.conversation_id = c.id AND f.severidade = 'alta') THEN 'alta'
    WHEN s.score_medio < 3.5 THEN 'media'
    WHEN c.outcome = 'converteu' THEN 'conversao'
    ELSE 'sampling'
  END as prioridade,
  ARRAY(SELECT DISTINCT f2.tipo FROM bia_flags f2 WHERE f2.conversation_id = c.id) as flag_tipos
FROM bia_conversations c
LEFT JOIN bia_scores s ON s.conversation_id = c.id
WHERE NOT EXISTS (SELECT 1 FROM bia_reviews r WHERE r.conversation_id = c.id)
  AND s.id IS NOT NULL
  AND (
    s.score_medio < 3.5
    OR EXISTS (SELECT 1 FROM bia_flags f3 WHERE f3.conversation_id = c.id)
    OR c.outcome = 'converteu'
  )
ORDER BY
  CASE
    WHEN EXISTS (SELECT 1 FROM bia_flags f WHERE f.conversation_id = c.id AND f.severidade = 'critica') THEN 0
    WHEN EXISTS (SELECT 1 FROM bia_flags f WHERE f.conversation_id = c.id AND f.severidade = 'alta') THEN 1
    WHEN s.score_medio < 3.5 THEN 2
    WHEN c.outcome = 'converteu' THEN 3
    ELSE 4
  END,
  c.started_at DESC;

-- Gold queue (extraordinary moments)
CREATE VIEW bia_gold_queue AS
SELECT
  m.id as moment_id,
  m.tipo,
  m.citacao,
  m.justificativa,
  m.confirmado_humano,
  m.detected_at,
  c.subscriber_name,
  c.started_at as conversation_date,
  s.score_medio
FROM bia_moments m
JOIN bia_conversations c ON c.id = m.conversation_id
LEFT JOIN bia_scores s ON s.conversation_id = c.id
WHERE m.descartado = false
ORDER BY m.detected_at DESC;

-- ============================================================================
-- Functions
-- ============================================================================

-- LGPD: Delete all data for a subscriber
CREATE OR REPLACE FUNCTION bia_delete_subscriber_data(p_subscriber_id TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO bia_audit_log (action, target_subscriber, details)
  VALUES ('data_deletion', p_subscriber_id, jsonb_build_object(
    'conversations_deleted', (SELECT COUNT(*) FROM bia_conversations WHERE subscriber_id = p_subscriber_id),
    'journeys_deleted', (SELECT COUNT(*) FROM bia_journeys WHERE subscriber_id = p_subscriber_id)
  ));

  DELETE FROM bia_conversations WHERE subscriber_id = p_subscriber_id;
  DELETE FROM bia_journeys WHERE subscriber_id = p_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
