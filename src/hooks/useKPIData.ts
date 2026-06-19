import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_KPI } from '../lib/mockData';
import type { KPIData } from '../types';

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;

export function useKPIData() {
  const [kpi, setKpi] = useState<KPIData>(MOCK_KPI);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const weekStart = new Date(Date.now() - 7 * 86400000);

        const [totalRes, todayRes, weekRes, sourcesRes, fundingRes, syncRes] = await Promise.all([
          supabase.from('ai_articles').select('id', { count: 'exact', head: true }),
          supabase.from('ai_articles').select('id', { count: 'exact', head: true }).gte('published_at', todayStart.toISOString()),
          supabase.from('ai_articles').select('id', { count: 'exact', head: true }).gte('published_at', weekStart.toISOString()),
          supabase.from('ai_sources').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('ai_funding').select('amount_usd'),
          supabase.from('ai_sync_logs').select('started_at').order('started_at', { ascending: false }).limit(1),
        ]);

        const total_funding_usd = (fundingRes.data ?? []).reduce((s, r) => s + (r.amount_usd ?? 0), 0);

        setKpi({
          total_articles: totalRes.count ?? 0,
          articles_today: todayRes.count ?? 0,
          articles_this_week: weekRes.count ?? 0,
          active_sources: sourcesRes.count ?? 0,
          total_funding_usd,
          latest_sync: syncRes.data?.[0]?.started_at ?? null,
        });
      } catch {
        setKpi(MOCK_KPI);
      } finally {
        setLoading(false);
      }
    };

    fetch();
    const interval = setInterval(fetch, 60000);
    return () => clearInterval(interval);
  }, []);

  return { kpi, loading };
}
