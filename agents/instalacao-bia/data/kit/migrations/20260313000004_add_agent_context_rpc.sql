-- BUG-018: RPC function para n8n ler contexto do agente
-- Sempre retorna JSON object (nunca array vazio), compativel com n8n HTTP Request
CREATE OR REPLACE FUNCTION get_agent_context(p_subscriber_id TEXT, p_agent_id TEXT DEFAULT 'bia')
RETURNS JSON AS $$
  SELECT json_build_object('messages',
    COALESCE(
      (SELECT messages FROM bia_agent_context
       WHERE subscriber_id = p_subscriber_id AND agent_id = p_agent_id),
      '[]'::jsonb
    )
  );
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_agent_context TO anon;
GRANT EXECUTE ON FUNCTION get_agent_context TO authenticated;
