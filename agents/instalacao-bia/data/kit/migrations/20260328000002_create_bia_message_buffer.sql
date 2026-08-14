-- ============================================
-- MIGRATION: bia_message_buffer
-- Substitui staticData.global.buffers do WF-INBOUND
-- por buffer atomico no Supabase.
-- Resolve: race condition, timeouts 68-86s, 3.7% error rate.
-- ============================================

-- === Table: bia_message_buffer ===
-- Cada linha = um grupo de mensagens do mesmo subscriber
-- dentro de uma janela de buffer (9 segundos).
-- Mensagens sao appendadas atomicamente via RPC.

CREATE TABLE IF NOT EXISTS bia_message_buffer (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id   TEXT NOT NULL,
  execution_id    TEXT NOT NULL,
  messages        JSONB NOT NULL DEFAULT '[]'::jsonb,
  status          TEXT NOT NULL DEFAULT 'buffering',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  collected_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 seconds')
);

-- Busca rapida por subscriber ativo
CREATE INDEX idx_bmb_subscriber_status
  ON bia_message_buffer(subscriber_id, status)
  WHERE status = 'buffering';

-- Cleanup de expirados
CREATE INDEX idx_bmb_expires
  ON bia_message_buffer(expires_at)
  WHERE status = 'buffering';

-- === RPC: buffer_message ===
-- Atomic append. Se existe buffer 'buffering' pro subscriber, appenda.
-- Se nao existe, cria novo. Retorna execution_id do owner.

CREATE OR REPLACE FUNCTION buffer_message(
  p_subscriber_id TEXT,
  p_execution_id TEXT,
  p_message JSONB
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_buffer_id UUID;
  v_owner_exec TEXT;
BEGIN
  -- Find or create buffer (atomic with row lock)
  SELECT id, execution_id INTO v_buffer_id, v_owner_exec
  FROM bia_message_buffer
  WHERE subscriber_id = p_subscriber_id AND status = 'buffering'
  FOR UPDATE;

  IF v_buffer_id IS NOT NULL THEN
    -- Append to existing buffer
    UPDATE bia_message_buffer
    SET messages = messages || jsonb_build_array(p_message),
        expires_at = now() + interval '30 seconds'
    WHERE id = v_buffer_id;
  ELSE
    -- Create new buffer
    v_owner_exec := p_execution_id;
    INSERT INTO bia_message_buffer (subscriber_id, execution_id, messages, status, expires_at)
    VALUES (
      p_subscriber_id,
      p_execution_id,
      jsonb_build_array(p_message),
      'buffering',
      now() + interval '30 seconds'
    )
    RETURNING id INTO v_buffer_id;
  END IF;

  RETURN json_build_object(
    'buffer_id', v_buffer_id,
    'owner_execution_id', v_owner_exec
  );
END;
$$;

-- === RPC: collect_buffer ===
-- Coleta todas as mensagens, marca como 'collected'.
-- FOR UPDATE SKIP LOCKED: so uma execucao coleta.

CREATE OR REPLACE FUNCTION collect_buffer(
  p_subscriber_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_messages JSONB;
  v_count INT;
  v_last_ts BIGINT;
BEGIN
  -- Atomic: seleciona e marca como collected
  UPDATE bia_message_buffer
  SET status = 'collected', collected_at = now()
  WHERE id = (
    SELECT id FROM bia_message_buffer
    WHERE subscriber_id = p_subscriber_id AND status = 'buffering'
    ORDER BY created_at DESC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING messages INTO v_messages;

  IF v_messages IS NULL THEN
    RETURN json_build_object(
      'found', false,
      'messages', '[]'::jsonb,
      'count', 0
    );
  END IF;

  v_count := jsonb_array_length(v_messages);

  -- Checar se buffer ainda ta ativo (ultima msg < 5s atras)
  v_last_ts := (v_messages -> (v_count - 1) ->> 'ts')::bigint;

  RETURN json_build_object(
    'found', true,
    'messages', v_messages,
    'count', v_count,
    'last_ts', v_last_ts
  );
END;
$$;

-- === Cleanup function ===
CREATE OR REPLACE FUNCTION cleanup_message_buffers()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE bia_message_buffer
  SET status = 'expired'
  WHERE status = 'buffering' AND expires_at < now();

  DELETE FROM bia_message_buffer
  WHERE status IN ('collected', 'expired')
    AND created_at < now() - interval '1 hour';
END;
$$;

-- === RLS ===
ALTER TABLE bia_message_buffer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_buffer" ON bia_message_buffer
  FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT EXECUTE ON FUNCTION buffer_message TO service_role;
GRANT EXECUTE ON FUNCTION collect_buffer TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_message_buffers TO service_role;
