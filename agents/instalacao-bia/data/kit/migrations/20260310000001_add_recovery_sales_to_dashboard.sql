-- Add recovery sales metrics to dashboard
-- Recovery sale = purchase from campaign lead WITHOUT Facebook UTM (utm_source != 'FB')
-- Includes all 3 NDF products: Workshop, Apostila, Gravação
-- Recovery revenue is ALREADY included in total (via v_campaign_sales captura join)
-- This migration just makes recovery visible as separate metrics

CREATE OR REPLACE FUNCTION get_launch_dashboard(p_campaign_ref text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'America/Sao_Paulo')::date;
  v_yesterday date := (now() AT TIME ZONE 'America/Sao_Paulo')::date - 1;
  result json;
BEGIN
  SELECT json_build_object(
    'campaign_ref', p_campaign_ref,
    'updated_at', now(),
    -- TOTAL (all time)
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
        WHERE am.campaign_id IN (SELECT id FROM campanhas WHERE evento_referencia = p_campaign_ref)) ad,
        (SELECT
          SUM(vs.total_sales) AS total_sales, SUM(vs.total_revenue) AS total_revenue,
          SUM(vs.main_revenue) AS main_revenue, SUM(vs.bump1_count) AS bump1_count,
          SUM(vs.bump1_revenue) AS bump1_revenue, SUM(vs.bump2_count) AS bump2_count,
          SUM(vs.bump2_revenue) AS bump2_revenue
        FROM v_campaign_sales vs WHERE vs.campaign_ref = p_campaign_ref) s,
        (SELECT SUM(vl.total_leads) AS total_leads
        FROM v_campaign_leads vl WHERE vl.campaign_ref = p_campaign_ref) l
    ),
    -- YESTERDAY
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
        WHERE campaign_id IN (SELECT id FROM campanhas WHERE evento_referencia = p_campaign_ref)
          AND date = v_yesterday) ad,
        (SELECT COALESCE(SUM(total_sales), 0) AS total_sales, COALESCE(SUM(total_revenue), 0) AS total_revenue,
          COALESCE(SUM(main_revenue), 0) AS main_revenue, COALESCE(SUM(bump1_count), 0) AS bump1_count,
          COALESCE(SUM(bump1_revenue), 0) AS bump1_revenue, COALESCE(SUM(bump2_count), 0) AS bump2_count,
          COALESCE(SUM(bump2_revenue), 0) AS bump2_revenue
        FROM v_campaign_sales WHERE campaign_ref = p_campaign_ref AND sale_date = v_yesterday) s,
        (SELECT COALESCE(SUM(total_leads), 0) AS total_leads
        FROM v_campaign_leads WHERE campaign_ref = p_campaign_ref AND lead_date = v_yesterday) l
    ),
    -- TODAY
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
        WHERE campaign_id IN (SELECT id FROM campanhas WHERE evento_referencia = p_campaign_ref)
          AND date = v_today) ad,
        (SELECT COALESCE(SUM(total_sales), 0) AS total_sales, COALESCE(SUM(total_revenue), 0) AS total_revenue,
          COALESCE(SUM(main_revenue), 0) AS main_revenue, COALESCE(SUM(bump1_count), 0) AS bump1_count,
          COALESCE(SUM(bump1_revenue), 0) AS bump1_revenue, COALESCE(SUM(bump2_count), 0) AS bump2_count,
          COALESCE(SUM(bump2_revenue), 0) AS bump2_revenue
        FROM v_campaign_sales WHERE campaign_ref = p_campaign_ref AND sale_date = v_today) s,
        (SELECT COALESCE(SUM(total_leads), 0) AS total_leads
        FROM v_campaign_leads WHERE campaign_ref = p_campaign_ref AND lead_date = v_today) l
    ),
    -- RECOVERY (contacts + sales)
    'recovery', (
      SELECT json_build_object(
        -- Contact tracking (existing)
        'total_leads', COUNT(*) FILTER (WHERE recovery_status != 'purchased'),
        'not_contacted', COUNT(*) FILTER (WHERE recovery_status = 'not_contacted'),
        'contacted', COUNT(*) FILTER (WHERE recovery_status = 'contacted'),
        'recovered', COUNT(*) FILTER (WHERE recovery_status = 'recovered'),
        'purchased', COUNT(*) FILTER (WHERE recovery_status = 'purchased'),
        -- Recovery sales (NEW) — all time
        'recovery_sales', COALESCE((
          SELECT COUNT(*)
          FROM compras c
          WHERE c.pessoa_id IN (
            SELECT DISTINCT cap.pessoa_id FROM capturas cap
            WHERE SPLIT_PART(cap.evento_referencia, ' | ', 2) = p_campaign_ref
          )
          AND c.status IN ('aprovado', 'Paga', 'aprovada', 'Aprovado')
          AND c.produto_nome ILIKE '%digital do futuro%'
          AND (c.utm_source IS NULL OR c.utm_source != 'FB')
        ), 0),
        'recovery_revenue', COALESCE((
          SELECT ROUND(SUM(c.valor)::numeric, 2)
          FROM compras c
          WHERE c.pessoa_id IN (
            SELECT DISTINCT cap.pessoa_id FROM capturas cap
            WHERE SPLIT_PART(cap.evento_referencia, ' | ', 2) = p_campaign_ref
          )
          AND c.status IN ('aprovado', 'Paga', 'aprovada', 'Aprovado')
          AND c.produto_nome ILIKE '%digital do futuro%'
          AND (c.utm_source IS NULL OR c.utm_source != 'FB')
        ), 0),
        -- Recovery sales YESTERDAY
        'recovery_sales_yesterday', COALESCE((
          SELECT COUNT(*)
          FROM compras c
          WHERE c.pessoa_id IN (
            SELECT DISTINCT cap.pessoa_id FROM capturas cap
            WHERE SPLIT_PART(cap.evento_referencia, ' | ', 2) = p_campaign_ref
          )
          AND c.status IN ('aprovado', 'Paga', 'aprovada', 'Aprovado')
          AND c.produto_nome ILIKE '%digital do futuro%'
          AND (c.utm_source IS NULL OR c.utm_source != 'FB')
          AND (c.created_at AT TIME ZONE 'America/Sao_Paulo')::date = v_yesterday
        ), 0),
        'recovery_revenue_yesterday', COALESCE((
          SELECT ROUND(SUM(c.valor)::numeric, 2)
          FROM compras c
          WHERE c.pessoa_id IN (
            SELECT DISTINCT cap.pessoa_id FROM capturas cap
            WHERE SPLIT_PART(cap.evento_referencia, ' | ', 2) = p_campaign_ref
          )
          AND c.status IN ('aprovado', 'Paga', 'aprovada', 'Aprovado')
          AND c.produto_nome ILIKE '%digital do futuro%'
          AND (c.utm_source IS NULL OR c.utm_source != 'FB')
          AND (c.created_at AT TIME ZONE 'America/Sao_Paulo')::date = v_yesterday
        ), 0),
        -- Recovery sales TODAY
        'recovery_sales_today', COALESCE((
          SELECT COUNT(*)
          FROM compras c
          WHERE c.pessoa_id IN (
            SELECT DISTINCT cap.pessoa_id FROM capturas cap
            WHERE SPLIT_PART(cap.evento_referencia, ' | ', 2) = p_campaign_ref
          )
          AND c.status IN ('aprovado', 'Paga', 'aprovada', 'Aprovado')
          AND c.produto_nome ILIKE '%digital do futuro%'
          AND (c.utm_source IS NULL OR c.utm_source != 'FB')
          AND (c.created_at AT TIME ZONE 'America/Sao_Paulo')::date = v_today
        ), 0),
        'recovery_revenue_today', COALESCE((
          SELECT ROUND(SUM(c.valor)::numeric, 2)
          FROM compras c
          WHERE c.pessoa_id IN (
            SELECT DISTINCT cap.pessoa_id FROM capturas cap
            WHERE SPLIT_PART(cap.evento_referencia, ' | ', 2) = p_campaign_ref
          )
          AND c.status IN ('aprovado', 'Paga', 'aprovada', 'Aprovado')
          AND c.produto_nome ILIKE '%digital do futuro%'
          AND (c.utm_source IS NULL OR c.utm_source != 'FB')
          AND (c.created_at AT TIME ZONE 'America/Sao_Paulo')::date = v_today
        ), 0)
      )
      FROM v_recovery_dashboard
      WHERE campaign_ref = p_campaign_ref
    )
  ) INTO result;

  RETURN result;
END;
$$;
