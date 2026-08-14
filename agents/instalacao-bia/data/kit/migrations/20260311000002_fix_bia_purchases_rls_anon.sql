-- Fix: bia_purchases RLS blocks anon reads, which breaks get_launch_dashboard
-- The dashboard function is SECURITY DEFINER but PostgREST runs it as the calling role
-- Solution: Add anon read policy for bia_purchases (read-only, no sensitive data exposed)

CREATE POLICY "anon_read_bia_purchases" ON bia_purchases
  FOR SELECT
  TO anon
  USING (true);
