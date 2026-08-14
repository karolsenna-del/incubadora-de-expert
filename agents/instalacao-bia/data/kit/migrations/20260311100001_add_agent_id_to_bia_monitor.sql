-- ============================================================================
-- Add agent_id to bia_conversations and bia_journeys
-- Enables per-agent analysis in Bia Monitor (recovery, boas-vindas, convite)
-- ============================================================================

-- 1. Add agent_id to bia_conversations
ALTER TABLE bia_conversations ADD COLUMN agent_id TEXT DEFAULT 'bia';
CREATE INDEX idx_bia_conv_agent ON bia_conversations(agent_id);

-- 2. Add agent_id to bia_journeys
ALTER TABLE bia_journeys ADD COLUMN agent_id TEXT DEFAULT 'bia';
CREATE INDEX idx_bia_journey_agent ON bia_journeys(agent_id);

-- 3. RLS: anon read access for bia_conversations (dashboard reads via anon key)
CREATE POLICY "anon_read_bia_conversations" ON bia_conversations
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_journeys" ON bia_journeys
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_scores" ON bia_scores
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_flags" ON bia_flags
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_moments" ON bia_moments
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_reviews" ON bia_reviews
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_messages" ON bia_messages
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_golden_dataset" ON bia_golden_dataset
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_prompt_versions" ON bia_prompt_versions
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_bia_judge_calibration" ON bia_judge_calibration
  FOR SELECT TO anon USING (true);

-- 4. Function: get daily metrics filtered by agent_id
-- Replicates bia_daily_metrics view logic but with agent filter
CREATE OR REPLACE FUNCTION get_agent_daily_metrics(p_agent_id TEXT)
RETURNS TABLE (
  dia DATE,
  total_conversas BIGINT,
  conversoes BIGINT,
  score_medio NUMERIC,
  avg_persona NUMERIC,
  avg_metodo NUMERIC,
  avg_precisao NUMERIC,
  avg_empatia NUMERIC,
  avg_resultado NUMERIC,
  flags_criticas BIGINT,
  flags_altas BIGINT,
  momentos_extraordinarios BIGINT,
  latencia_media NUMERIC,
  tokens_total BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
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
  WHERE c.agent_id = p_agent_id
  GROUP BY DATE(c.started_at)
  ORDER BY dia DESC
  LIMIT 30;
$$;
