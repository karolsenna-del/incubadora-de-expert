-- Append a message to bia_agent_context (upsert: create row if not exists, append to messages array)
CREATE OR REPLACE FUNCTION append_agent_context(
  p_subscriber_id TEXT,
  p_agent_id TEXT,
  p_role TEXT,
  p_content TEXT
) RETURNS void AS $$
DECLARE
  new_msg JSONB;
BEGIN
  new_msg := jsonb_build_object(
    'role', p_role,
    'content', p_content,
    'timestamp', now()::TEXT
  );

  -- Try update first (append to existing messages array)
  UPDATE bia_agent_context
  SET messages = messages || new_msg,
      created_at = now()
  WHERE subscriber_id = p_subscriber_id AND agent_id = p_agent_id;

  -- If no row existed, insert new
  IF NOT FOUND THEN
    INSERT INTO bia_agent_context (subscriber_id, agent_id, messages, created_at)
    VALUES (p_subscriber_id, p_agent_id, jsonb_build_array(new_msg), now());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
