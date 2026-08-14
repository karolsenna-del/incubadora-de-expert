-- Fix: recovery_contacts.converted_at never updated
-- Problem: When a recovery lead buys, converted_at stays NULL
-- Solution: (1) Add 'converted' to status check, (2) Backfill, (3) Trigger

-- ============================================================
-- STEP 0: Add 'converted' to allowed status values
-- ============================================================

ALTER TABLE recovery_contacts
  DROP CONSTRAINT recovery_contacts_status_check;

ALTER TABLE recovery_contacts
  ADD CONSTRAINT recovery_contacts_status_check
  CHECK (status IN ('sent', 'delivered', 'read', 'replied', 'converted'));

-- ============================================================
-- STEP 1: Backfill — mark recovery contacts as converted
-- where the person bought AFTER being contacted
-- ============================================================

UPDATE recovery_contacts rc
SET
  converted_at = first_purchase.purchased_at,
  conversion_value = first_purchase.valor,
  status = 'converted'
FROM (
  SELECT DISTINCT ON (c.pessoa_id)
    c.pessoa_id,
    c.created_at AS purchased_at,
    c.valor
  FROM compras c
  WHERE c.is_order_bump = false
    AND c.status IN ('aprovado', 'Paga', 'aprovada', 'Aprovado')
    AND c.id_transacao IS NOT NULL
  ORDER BY c.pessoa_id, c.created_at ASC
) first_purchase
WHERE rc.pessoa_id = first_purchase.pessoa_id
  AND rc.converted_at IS NULL
  AND first_purchase.purchased_at > rc.contacted_at;

-- ============================================================
-- STEP 2: Trigger — auto-update on new purchases
-- ============================================================

CREATE OR REPLACE FUNCTION fn_recovery_mark_converted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.is_order_bump = true THEN
    RETURN NEW;
  END IF;

  IF NEW.status NOT IN ('aprovado', 'Paga', 'aprovada', 'Aprovado') THEN
    RETURN NEW;
  END IF;

  UPDATE recovery_contacts
  SET
    converted_at = NEW.created_at,
    conversion_value = NEW.valor,
    status = 'converted'
  WHERE pessoa_id = NEW.pessoa_id
    AND converted_at IS NULL
    AND contacted_at < NEW.created_at
    AND id = (
      SELECT id FROM recovery_contacts
      WHERE pessoa_id = NEW.pessoa_id
        AND converted_at IS NULL
        AND contacted_at < NEW.created_at
      ORDER BY contacted_at DESC
      LIMIT 1
    );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_recovery_mark_converted ON compras;

CREATE TRIGGER trg_recovery_mark_converted
  AFTER INSERT ON compras
  FOR EACH ROW
  EXECUTE FUNCTION fn_recovery_mark_converted();
