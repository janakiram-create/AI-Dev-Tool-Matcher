import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { KPICards } from './components/dashboard/KPICards';
import { FeaturedArticle } from './components/dashboard/FeaturedArticle';
import { NewsGrid } from './components/dashboard/NewsGrid';
import { CompanyTabs } from './components/dashboard/CompanyTabs';
import { FundingTracker } from './components/dashboard/FundingTracker';
import { RightPanel } from './components/dashboard/RightPanel';
import { useArticles } from './hooks/useArticles';
import { useSources } from './hooks/useSources';
import { useKPIData } from './hooks/useKPIData';
import { useFunding } from './hooks/useFunding';
import LoginPage from './components/LoginPage';
import RoleDashboard from './components/RoleDashboard';
import type { ThemeMode, FilterTab, AuthUser } from './types';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('auth-updates-dash');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleLogin = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem('auth-updates-dash', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth-updates-dash');
  };

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('ai-dash-theme') as ThemeMode) ?? 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [activeCompany, setActiveCompany] = useState('all');
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ai-dash-theme', theme);
  }, [theme]);

  const articleOptions = useMemo(() => {
    const opts: Parameters<typeof useArticles>[0] = { limit: 40 };
    if (activeTab === 'today') {
      // We'll filter client-side from full set
    } else if (activeTab === 'featured') {
      opts.featured = true;
    } else if (activeTab === 'research') {
      opts.article_type = 'research';
    } else if (activeTab === 'funding') {
      opts.article_type = 'funding';
    } else if (!['all', 'today', 'featured', 'research', 'funding'].includes(activeTab)) {
      opts.category = activeTab;
    }
    if (activeCompany !== 'all') opts.company = activeCompany;
    if (search) opts.search = search;
    return opts;
  }, [activeTab, activeCompany, search]);

  const { articles, loading: articlesLoading } = useArticles(articleOptions);
  const { sources, loading: sourcesLoading } = useSources();
  const { kpi, loading: kpiLoading } = useKPIData();
  const { rounds, loading: fundingLoading } = useFunding(8);

  const activeSourceObj = sources.find((s) => s.slug === activeSource);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (activeSource) {
      result = result.filter((a) => a.source_name === activeSourceObj?.name);
    }

    if (activeTab === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      result = result.filter((a) => new Date(a.published_at) >= todayStart);
    }

    return result;
  }, [articles, activeSource, activeSourceObj, activeTab]);

  const featuredArticle = filteredArticles.find((a) => a.is_featured) ?? filteredArticles[0];

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/sync', { method: 'POST' });
    } catch {
      // silent — sync will happen anyway
    }
    await new Promise((r) => setTimeout(r, 1500));
    setSyncing(false);
  };

  const showFunding = activeTab === 'all' || activeTab === 'funding' || activeTab === 'today';
  const showCompanyTabs = activeTab === 'all' || activeTab === 'today';

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-50 dark:text-gray-100 text-gray-900">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        lastSync={kpi.latest_sync}
        onSync={handleSync}
        syncing={syncing}
        search={search}
        onSearch={setSearch}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSource={activeSource}
          onSourceChange={setActiveSource}
          sources={sources}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 px-4 lg:px-6 py-5 space-y-6 max-w-screen-2xl">
          {activeSource && (
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: activeSourceObj?.color }}
              >
                {activeSourceObj?.icon_letter}
              </span>
              <h1 className="text-lg font-bold dark:text-white text-gray-900">
                {activeSourceObj?.name}
              </h1>
              <span className="text-sm text-gray-500">{activeSourceObj?.article_count} articles</span>
              <button
                onClick={() => setActiveSource(null)}
                className="ml-2 text-xs text-gray-500 hover:text-gray-300 underline"
              >
                Clear
              </button>
            </div>
          )}

          <RoleDashboard user={user} onSync={handleSync} syncing={syncing} />

          <KPICards kpi={kpi} loading={kpiLoading} />

          {featuredArticle && (
            <FeaturedArticle
              article={featuredArticle}
              loading={articlesLoading}
            />
          )}

          <NewsGrid
            articles={filteredArticles}
            loading={articlesLoading}
            sources={sources}
            activeCompany={activeCompany}
            onCompanyChange={(c) => {
              setActiveCompany(c);
              if (c !== 'all') setActiveTab('all');
            }}
          />

          {showCompanyTabs && (
            <CompanyTabs articles={articles} loading={articlesLoading} />
          )}

          {showFunding && (
            <FundingTracker rounds={rounds} loading={fundingLoading} />
          )}
        </main>

        <RightPanel sources={sources} lastSync={kpi.latest_sync} />
      </div>
    </div>
  );
}
