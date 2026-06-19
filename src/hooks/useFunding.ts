import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_FUNDING } from '../lib/mockData';
import type { FundingRound } from '../types';

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;

export function useFunding(limit = 10) {
  const [rounds, setRounds] = useState<FundingRound[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      setRounds(MOCK_FUNDING);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('ai_funding')
          .select('*')
          .order('announced_at', { ascending: false })
          .limit(limit);
        setRounds(data ?? MOCK_FUNDING);
      } catch {
        setRounds(MOCK_FUNDING);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [limit]);

  return { rounds, loading };
}
