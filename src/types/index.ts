export interface Article {
  id: string;
  source_id: string | null;
  source_name: string;
  source_color: string;
  title: string;
  summary: string | null;
  url: string;
  image_url: string | null;
  author: string | null;
  published_at: string;
  category: string;
  tags: string[];
  company: string | null;
  article_type: 'news' | 'research' | 'blog' | 'announcement' | 'funding';
  read_time: number;
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export interface Source {
  id: string;
  name: string;
  slug: string;
  url: string;
  rss_url: string | null;
  company: string | null;
  category: string;
  color: string;
  icon_letter: string | null;
  is_active: boolean;
  article_count: number;
  last_synced_at: string | null;
  created_at: string;
}

export interface FundingRound {
  id: string;
  company_name: string;
  amount: string;
  amount_usd: number | null;
  investors: string[];
  round_type: string;
  sector: string | null;
  announced_at: string;
  article_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  article_count: number;
}

export interface SyncLog {
  id: string;
  source_name: string | null;
  articles_fetched: number;
  articles_new: number;
  status: string;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

export interface KPIData {
  total_articles: number;
  articles_today: number;
  articles_this_week: number;
  active_sources: number;
  total_funding_usd: number;
  latest_sync: string | null;
}

export type ThemeMode = 'dark' | 'light';

export type UserRole = 'reader' | 'analyst' | 'admin';

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

export type FilterTab =
  | 'all'
  | 'today'
  | 'featured'
  | 'research'
  | 'funding'
  | string;
