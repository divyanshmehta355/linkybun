CREATE OR REPLACE FUNCTION get_link_analytics(p_profile_id uuid)
RETURNS TABLE (
  link_id uuid,
  title text,
  total_clicks bigint,
  clicks_last_7_days json
) AS $$
BEGIN
  RETURN QUERY
  WITH link_list AS (
    SELECT public.links.id, public.links.title FROM public.links WHERE public.links.profile_id = p_profile_id
  ),
  daily_clicks AS (
    SELECT 
      c.link_id,
      date_trunc('day', c.created_at)::date AS click_date,
      count(*) AS daily_count
    FROM public.clicks c
    WHERE c.link_id IN (SELECT id FROM link_list)
      AND c.created_at >= (now() - interval '7 days')
    GROUP BY c.link_id, date_trunc('day', c.created_at)::date
  ),
  total_clicks_agg AS (
    SELECT 
      c.link_id,
      count(*) AS total_count
    FROM public.clicks c
    WHERE c.link_id IN (SELECT id FROM link_list)
    GROUP BY c.link_id
  )
  SELECT 
    l.id,
    l.title,
    COALESCE(tc.total_count, 0) AS total_clicks,
    COALESCE(
      (
        SELECT json_agg(json_build_object('date', dc.click_date, 'clicks', dc.daily_count) ORDER BY dc.click_date)
        FROM daily_clicks dc
        WHERE dc.link_id = l.id
      ), 
      '[]'::json
    ) AS clicks_last_7_days
  FROM link_list l
  LEFT JOIN total_clicks_agg tc ON tc.link_id = l.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
