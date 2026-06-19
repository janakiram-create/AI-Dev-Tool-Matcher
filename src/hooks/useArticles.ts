import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_ARTICLES } from '../lib/mockData';
import type { Article } from '../types';

interface Options {
  company?: string | null;
  category?: string | null;
  article_type?: string | null;
  featured?: boolean;
  search?: string;
  limit?: number;
}

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;

export function useArticles(options: Options = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { company, category, article_type, featured, search, limit = 30 } = options;

  useEffect(() => {
    if (USE_MOCK) {
      let filtered = [...MOCK_ARTICLES];
      if (company) filtered = filtered.filter((a) => a.company === company);
      if (category) filtered = filtered.filter((a) => a.category === category);
      if (article_type) filtered = filtered.filter((a) => a.article_type === article_type);
      if (featured !== undefined) filtered = filtered.filter((a) => a.is_featured === featured);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (a) => a.title.toLowerCase().includes(q) || (a.summary ?? '').toLowerCase().includes(q)
        );
      }
      setArticles(filtered.slice(0, limit));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const fetch = async () => {
      try {
        let query = supabase
          .from('ai_articles')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (company) query = query.eq('company', company);
        if (category) query = query.eq('category', category);
        if (article_type) query = query.eq('article_type', article_type);
        if (featured !== undefined) query = query.eq('is_featured', featured);
        if (search) query = query.ilike('title', `%${search}%`);

        const { data, error: err } = await query;
        if (err) throw err;
        if (!cancelled) setArticles(data ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Fetch failed');
          setArticles(MOCK_ARTICLES.slice(0, limit));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    const channel = supabase
      .channel('articles-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ai_articles' }, (payload) => {
        setArticles((prev) => [payload.new as Article, ...prev].slice(0, limit));
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [company, category, article_type, featured, search, limit]);

  return { articles, loading, error };
}
