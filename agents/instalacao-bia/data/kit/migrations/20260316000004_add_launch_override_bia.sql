-- Add launch_slug override to bia_purchases
-- Allows explicit assignment of upsells to correct launch
-- when buyer purchased main product in a previous launch cycle

-- 1. Add column
ALTER TABLE bia_purchases ADD COLUMN IF NOT EXISTS launch_slug text;

-- 2. Move 7 upsells from old workshop buyers to ndf-0314
-- These people bought the workshop before the 13/03 22h cutoff
-- but bought gravacao/apostila (upsell) after the cutoff
UPDATE bia_purchases SET launch_slug = 'ndf-0314'
WHERE hotmart_transaction IN (
  'HP1947784830',  -- maraysa_zimmermann: gravacao 13/03 22:11, workshop 10/03
  'HP2640348174',  -- juliane.psicologia: gravacao 13/03 23:16, workshop 27/02
  'HP3265008533',  -- kamilegevu: gravacao 14/03 08:19, pessoa desde jan/26
  'HP0515977642',  -- alexandrocavalini: gravacao 14/03 09:00, pessoa desde jan/26
  'HP4151362730',  -- meire_cuin: gravacao 14/03 10:05, workshop 05/03
  'HP1347374043',  -- jv.mainardes: apostila 14/03 11:41, workshop 08/03
  'HP1910139090'   -- master@imperium: apostila 14/03 15:28, workshop 02/03
);

-- 3. Update RPC to respect launch_slug override
CREATE OR REPLACE FUNCTION get_launch_dashboard(
  p_campaign_ref text DEFAULT NULL,
  p_launch_slug text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET statement_timeout = '15s'
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'America/Sao_Paulo')::date;
  v_yesterday date := (now() AT TIME ZONE 'America/Sao_Paulo')::date - 1;
  v_campaign_ref text;
  v_start_date date;
  v_end_date date;
  v_start_ts timestamptz;
  v_end_ts timestamptz;
  result json;
BEGIN
  IF p_launch_slug IS NOT NULL THEN
    SELECT
      l.evento_referencia,
      CASE
        WHEN (l.start_at AT TIME ZONE 'America/Sao_Paulo')::time = '00:00:00'
        THEN (l.start_at AT TIME ZONE 'America/Sao_Paulo')::date
        ELSE (l.start_at AT TIME ZONE 'America/Sao_Paulo')::date + 1
      END,
      CASE
        WHEN l.end_at IS NULL THEN '2099-12-31'::date
        ELSE (l.end_at AT TIME ZONE 'America/Sao_Paulo')::date
      END,
      l.start_at,
      COALESCE(l.end_at, '2099-12-31T00:00:00Z'::timestamptz)
    INTO v_campaign_ref, v_start_date, v_end_date, v_start_ts, v_end_ts
    FROM launches l
    WHERE l.slug = p_launch_slug;

    IF v_campaign_ref IS NULL THEN
      RAISE EXCEPTION 'Launch not found: %', p_launch_slug;
    END IF;
  ELSIF p_campaign_ref IS NOT NULL THEN
    v_campaign_ref := p_campaign_ref;
    v_start_date := '2000-01-01'::date;
    v_end_date := '2099-12-31'::date;
    v_start_ts := '2000-01-01T00:00:00Z'::timestamptz;
    v_end_ts := '2099-12-31T00:00:00Z'::timestamptz;
  ELSE
    RAISE EXCEPTION 'Either p_campaign_ref or p_launch_slug is required';
  END IF;

  SELECT json_build_object(
    'campaign_ref', v_campaign_ref,
    'launch_slug', p_launch_slug,
    'updated_at', now(),
    'total', (
      SELECT json_build_object(
        'spend', COALESCE(ad.spend, 0),
        'impressions', COALESCE(ad.impressions, 0),
        'clicks', COALESCE(ad.clicks, 0),
        'reach', COALESCE(ad.reach, 0),
        'landing_page_views', COALESCE(ad.lpv, 0),
        'frequency', COALESCE(ad.freq, 0),
        'link_clicks', COALESCE(ad.link_clicks, 0),
        'cpm', CASE WHEN COALESCE(ad.impressions, 0) > 0
          THEN ROUND((COALESCE(ad.spend, 0) / ad.impressions) * 1000, 2) ELSE 0 END,
        'ctr', CASE WHEN COALESCE(ad.impressions, 0) > 0
          THEN ROUND((ad.clicks::numeric / ad.impressions) * 100, 2) ELSE 0 END,
        'connect_rate', CASE WHEN COALESCE(ad.link_clicks, 0) > 0
          THEN ROUND((COALESCE(ad.lpv, 0)::numeric / ad.link_clicks) * 100, 2) ELSE 0 END,
        'sales', COALESCE(s.total_sales, 0),
        'revenue', COALESCE(s.total_revenue, 0),
        'main_revenue', COALESCE(s.main_revenue, 0),
        'bump1_count', COALESCE(s.bump1_count, 0),
        'bump1_revenue', COALESCE(s.bump1_revenue, 0),
        'bump2_count', COALESCE(s.bump2_count, 0),
        'bump2_revenue', COALESCE(s.bump2_revenue, 0),
        'leads', COALESCE(l.total_leads, 0),
        'cost_per_sale', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(COALESCE(ad.spend, 0) / s.total_sales, 2) ELSE 0 END,
        'avg_ticket', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(COALESCE(s.total_revenue, 0) / s.total_sales, 2) ELSE 0 END,
        'page_conversion', CASE WHEN COALESCE(ad.lpv, 0) > 0
          THEN ROUND((COALESCE(s.total_sales, 0)::numeric / ad.lpv) * 100, 2) ELSE 0 END,
        'checkout_conversion', CASE WHEN COALESCE(l.total_leads, 0) > 0
          THEN ROUND((COALESCE(s.total_sales, 0)::numeric / l.total_leads) * 100, 2) ELSE 0 END,
        'ob_total_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(((COALESCE(s.bump1_count, 0) + COALESCE(s.bump2_count, 0))::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'ob_apostila_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND((COALESCE(s.bump1_count, 0)::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'ob_gravacao_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND((COALESCE(s.bump2_count, 0)::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'roi', CASE WHEN COALESCE(ad.spend, 0) > 0
          THEN ROUND(COALESCE(s.total_revenue, 0) / ad.spend, 2) ELSE 0 END
      )
      FROM
        (SELECT
          SUM(am.spend) AS spend, SUM(am.impressions) AS impressions,
          SUM(am.clicks) AS clicks, SUM(am.reach) AS reach,
          SUM(am.landing_page_views) AS lpv, SUM(am.link_clicks) AS link_clicks,
          AVG(am.frequency) AS freq
        FROM ad_metrics am
        WHERE am.campaign_id IN (SELECT id FROM campanhas WHERE evento_referencia = v_campaign_ref)
          AND am.date >= v_start_date AND am.date <= v_end_date) ad,
        (SELECT
          SUM(vs.total_sales) AS total_sales, SUM(vs.total_revenue) AS total_revenue,
          SUM(vs.main_revenue) AS main_revenue, SUM(vs.bump1_count) AS bump1_count,
          SUM(vs.bump1_revenue) AS bump1_revenue, SUM(vs.bump2_count) AS bump2_count,
          SUM(vs.bump2_revenue) AS bump2_revenue
        FROM v_campaign_sales vs
        WHERE vs.campaign_ref IN (v_campaign_ref, 'Direto')
          AND vs.sale_date >= v_start_date AND vs.sale_date <= v_end_date) s,
        (SELECT SUM(vl.total_leads) AS total_leads
        FROM v_campaign_leads vl
        WHERE vl.campaign_ref = v_campaign_ref
          AND vl.lead_date >= v_start_date AND vl.lead_date <= v_end_date) l
    ),
    'yesterday', (
      SELECT json_build_object(
        'spend', COALESCE(ad.spend, 0),
        'revenue', COALESCE(s.total_revenue, 0),
        'sales', COALESCE(s.total_sales, 0),
        'leads', COALESCE(l.total_leads, 0),
        'cost_per_sale', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(COALESCE(ad.spend, 0) / s.total_sales, 2) ELSE 0 END,
        'avg_ticket', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(COALESCE(s.total_revenue, 0) / s.total_sales, 2) ELSE 0 END,
        'checkout_conversion', CASE WHEN COALESCE(l.total_leads, 0) > 0
          THEN ROUND((COALESCE(s.total_sales, 0)::numeric / l.total_leads) * 100, 2) ELSE 0 END,
        'bump1_count', COALESCE(s.bump1_count, 0),
        'bump2_count', COALESCE(s.bump2_count, 0),
        'landing_page_views', COALESCE(ad.lpv, 0),
        'link_clicks', COALESCE(ad.link_clicks, 0),
        'page_conversion', CASE WHEN COALESCE(ad.lpv, 0) > 0
          THEN ROUND((COALESCE(s.total_sales, 0)::numeric / ad.lpv) * 100, 2) ELSE 0 END,
        'connect_rate', CASE WHEN COALESCE(ad.link_clicks, 0) > 0
          THEN ROUND((COALESCE(ad.lpv, 0)::numeric / ad.link_clicks) * 100, 2) ELSE 0 END,
        'cpm', CASE WHEN COALESCE(ad.impressions, 0) > 0
          THEN ROUND((ad.spend / ad.impressions) * 1000, 2) ELSE 0 END,
        'ctr', CASE WHEN COALESCE(ad.impressions, 0) > 0
          THEN ROUND((ad.clicks::numeric / ad.impressions) * 100, 2) ELSE 0 END,
        'ob_total_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(((COALESCE(s.bump1_count, 0) + COALESCE(s.bump2_count, 0))::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'ob_apostila_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND((COALESCE(s.bump1_count, 0)::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'ob_gravacao_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND((COALESCE(s.bump2_count, 0)::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'roi', CASE WHEN COALESCE(ad.spend, 0) > 0
          THEN ROUND(COALESCE(s.total_revenue, 0) / ad.spend, 2) ELSE 0 END
      )
      FROM
        (SELECT COALESCE(SUM(spend), 0) AS spend, COALESCE(SUM(impressions), 0) AS impressions,
          COALESCE(SUM(clicks), 0) AS clicks, COALESCE(SUM(landing_page_views), 0) AS lpv,
          COALESCE(SUM(link_clicks), 0) AS link_clicks
        FROM ad_metrics
        WHERE campaign_id IN (SELECT id FROM campanhas WHERE evento_referencia = v_campaign_ref)
          AND date = v_yesterday
          AND v_yesterday >= v_start_date AND v_yesterday <= v_end_date) ad,
        (SELECT COALESCE(SUM(total_sales), 0) AS total_sales, COALESCE(SUM(total_revenue), 0) AS total_revenue,
          COALESCE(SUM(main_revenue), 0) AS main_revenue, COALESCE(SUM(bump1_count), 0) AS bump1_count,
          COALESCE(SUM(bump1_revenue), 0) AS bump1_revenue, COALESCE(SUM(bump2_count), 0) AS bump2_count,
          COALESCE(SUM(bump2_revenue), 0) AS bump2_revenue
        FROM v_campaign_sales
        WHERE campaign_ref IN (v_campaign_ref, 'Direto')
          AND sale_date = v_yesterday
          AND v_yesterday >= v_start_date AND v_yesterday <= v_end_date) s,
        (SELECT COALESCE(SUM(total_leads), 0) AS total_leads
        FROM v_campaign_leads
        WHERE campaign_ref = v_campaign_ref
          AND lead_date = v_yesterday
          AND v_yesterday >= v_start_date AND v_yesterday <= v_end_date) l
    ),
    'today', (
      SELECT json_build_object(
        'spend', COALESCE(ad.spend, 0),
        'revenue', COALESCE(s.total_revenue, 0),
        'sales', COALESCE(s.total_sales, 0),
        'leads', COALESCE(l.total_leads, 0),
        'cost_per_sale', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(COALESCE(ad.spend, 0) / s.total_sales, 2) ELSE 0 END,
        'avg_ticket', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(COALESCE(s.total_revenue, 0) / s.total_sales, 2) ELSE 0 END,
        'checkout_conversion', CASE WHEN COALESCE(l.total_leads, 0) > 0
          THEN ROUND((COALESCE(s.total_sales, 0)::numeric / l.total_leads) * 100, 2) ELSE 0 END,
        'bump1_count', COALESCE(s.bump1_count, 0),
        'bump2_count', COALESCE(s.bump2_count, 0),
        'landing_page_views', COALESCE(ad.lpv, 0),
        'link_clicks', COALESCE(ad.link_clicks, 0),
        'page_conversion', CASE WHEN COALESCE(ad.lpv, 0) > 0
          THEN ROUND((COALESCE(s.total_sales, 0)::numeric / ad.lpv) * 100, 2) ELSE 0 END,
        'connect_rate', CASE WHEN COALESCE(ad.link_clicks, 0) > 0
          THEN ROUND((COALESCE(ad.lpv, 0)::numeric / ad.link_clicks) * 100, 2) ELSE 0 END,
        'cpm', CASE WHEN COALESCE(ad.impressions, 0) > 0
          THEN ROUND((ad.spend / ad.impressions) * 1000, 2) ELSE 0 END,
        'ctr', CASE WHEN COALESCE(ad.impressions, 0) > 0
          THEN ROUND((ad.clicks::numeric / ad.impressions) * 100, 2) ELSE 0 END,
        'ob_total_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND(((COALESCE(s.bump1_count, 0) + COALESCE(s.bump2_count, 0))::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'ob_apostila_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND((COALESCE(s.bump1_count, 0)::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'ob_gravacao_pct', CASE WHEN COALESCE(s.total_sales, 0) > 0
          THEN ROUND((COALESCE(s.bump2_count, 0)::numeric / s.total_sales) * 100, 1) ELSE 0 END,
        'roi', CASE WHEN COALESCE(ad.spend, 0) > 0
          THEN ROUND(COALESCE(s.total_revenue, 0) / ad.spend, 2) ELSE 0 END
      )
      FROM
        (SELECT COALESCE(SUM(spend), 0) AS spend, COALESCE(SUM(impressions), 0) AS impressions,
          COALESCE(SUM(clicks), 0) AS clicks, COALESCE(SUM(landing_page_views), 0) AS lpv,
          COALESCE(SUM(link_clicks), 0) AS link_clicks
        FROM ad_metrics
        WHERE campaign_id IN (SELECT id FROM campanhas WHERE evento_referencia = v_campaign_ref)
          AND date = v_today
          AND v_today >= v_start_date AND v_today <= v_end_date) ad,
        (SELECT COALESCE(SUM(total_sales), 0) AS total_sales, COALESCE(SUM(total_revenue), 0) AS total_revenue,
          COALESCE(SUM(main_revenue), 0) AS main_revenue, COALESCE(SUM(bump1_count), 0) AS bump1_count,
          COALESCE(SUM(bump1_revenue), 0) AS bump1_revenue, COALESCE(SUM(bump2_count), 0) AS bump2_count,
          COALESCE(SUM(bump2_revenue), 0) AS bump2_revenue
        FROM v_campaign_sales
        WHERE campaign_ref IN (v_campaign_ref, 'Direto')
          AND sale_date = v_today
          AND v_today >= v_start_date AND v_today <= v_end_date) s,
        (SELECT COALESCE(SUM(total_leads), 0) AS total_leads
        FROM v_campaign_leads
        WHERE campaign_ref = v_campaign_ref
          AND lead_date = v_today
          AND v_today >= v_start_date AND v_today <= v_end_date) l
    ),
    'recovery', (
      SELECT json_build_object(
        'total_leads', COALESCE(rc.total_leads, 0),
        'not_contacted', COALESCE(rc.not_contacted, 0),
        'contacted', COALESCE(rc.contacted, 0),
        'recovered', COALESCE(rc.recovered, 0),
        'purchased', COALESCE(rc.purchased, 0),
        'recovery_sales', COALESCE(bp.recovery_sales, 0),
        'recovery_revenue', COALESCE(bp.recovery_revenue, 0),
        'recovery_sales_yesterday', COALESCE(bp.recovery_sales_yesterday, 0),
        'recovery_revenue_yesterday', COALESCE(bp.recovery_revenue_yesterday, 0),
        'recovery_sales_today', COALESCE(bp.recovery_sales_today, 0),
        'recovery_revenue_today', COALESCE(bp.recovery_revenue_today, 0),
        'upsell_sales', COALESCE(bp.upsell_sales, 0),
        'upsell_revenue', COALESCE(bp.upsell_revenue, 0),
        'upsell_sales_yesterday', COALESCE(bp.upsell_sales_yesterday, 0),
        'upsell_revenue_yesterday', COALESCE(bp.upsell_revenue_yesterday, 0),
        'upsell_sales_today', COALESCE(bp.upsell_sales_today, 0),
        'upsell_revenue_today', COALESCE(bp.upsell_revenue_today, 0),
        'bia_total_sales', COALESCE(bp.recovery_sales, 0) + COALESCE(bp.upsell_sales, 0),
        'bia_total_revenue', COALESCE(bp.recovery_revenue, 0) + COALESCE(bp.upsell_revenue, 0)
      )
      FROM
        (SELECT
          COUNT(*) FILTER (WHERE recovery_status != 'purchased') AS total_leads,
          COUNT(*) FILTER (WHERE recovery_status = 'not_contacted') AS not_contacted,
          COUNT(*) FILTER (WHERE recovery_status = 'contacted') AS contacted,
          COUNT(*) FILTER (WHERE recovery_status = 'recovered') AS recovered,
          COUNT(*) FILTER (WHERE recovery_status = 'purchased') AS purchased
        FROM v_recovery_dashboard
        WHERE campaign_ref = v_campaign_ref
          AND (first_capture_at AT TIME ZONE 'America/Sao_Paulo')::date >= v_start_date
          AND (first_capture_at AT TIME ZONE 'America/Sao_Paulo')::date <= v_end_date) rc,
        -- bia_purchases: use launch_slug override when set, otherwise timestamp range
        (SELECT
          COUNT(*) FILTER (WHERE attribution IN ('bia_direct', 'bia_assisted')) AS recovery_sales,
          ROUND(COALESCE(SUM(value_cents) FILTER (WHERE attribution IN ('bia_direct', 'bia_assisted')), 0) / 100.0, 2) AS recovery_revenue,
          COUNT(*) FILTER (WHERE attribution IN ('bia_direct', 'bia_assisted') AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_yesterday) AS recovery_sales_yesterday,
          ROUND(COALESCE(SUM(value_cents) FILTER (WHERE attribution IN ('bia_direct', 'bia_assisted') AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_yesterday), 0) / 100.0, 2) AS recovery_revenue_yesterday,
          COUNT(*) FILTER (WHERE attribution IN ('bia_direct', 'bia_assisted') AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_today) AS recovery_sales_today,
          ROUND(COALESCE(SUM(value_cents) FILTER (WHERE attribution IN ('bia_direct', 'bia_assisted') AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_today), 0) / 100.0, 2) AS recovery_revenue_today,
          COUNT(*) FILTER (WHERE attribution = 'bia_upsell') AS upsell_sales,
          ROUND(COALESCE(SUM(value_cents) FILTER (WHERE attribution = 'bia_upsell'), 0) / 100.0, 2) AS upsell_revenue,
          COUNT(*) FILTER (WHERE attribution = 'bia_upsell' AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_yesterday) AS upsell_sales_yesterday,
          ROUND(COALESCE(SUM(value_cents) FILTER (WHERE attribution = 'bia_upsell' AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_yesterday), 0) / 100.0, 2) AS upsell_revenue_yesterday,
          COUNT(*) FILTER (WHERE attribution = 'bia_upsell' AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_today) AS upsell_sales_today,
          ROUND(COALESCE(SUM(value_cents) FILTER (WHERE attribution = 'bia_upsell' AND (purchased_at AT TIME ZONE 'America/Sao_Paulo')::date = v_today), 0) / 100.0, 2) AS upsell_revenue_today
        FROM bia_purchases
        WHERE status = 'approved'
          AND (
            -- If launch_slug is explicitly set, use it
            (launch_slug IS NOT NULL AND launch_slug = p_launch_slug)
            OR
            -- Otherwise, use timestamp range
            (launch_slug IS NULL AND purchased_at >= v_start_ts AND purchased_at < v_end_ts)
          )) bp
    )
  ) INTO result;

  RETURN result;
END;
$$;
