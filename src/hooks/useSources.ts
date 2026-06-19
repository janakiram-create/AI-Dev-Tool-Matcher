import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_SOURCES } from '../lib/mockData';
import type { Source } from '../types';

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;

export function useSources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      setSources(MOCK_SOURCES);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('ai_sources')
          .select('*')
          .eq('is_active', true)
          .order('article_count', { ascending: false });
        setSources(data ?? MOCK_SOURCES);
      } catch {
        setSources(MOCK_SOURCES);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { sources, loading };
}
