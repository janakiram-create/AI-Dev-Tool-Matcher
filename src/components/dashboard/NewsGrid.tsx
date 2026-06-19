import { ArticleCard } from './ArticleCard';
import { cn } from '../../lib/utils';
import type { Article, Source } from '../../types';

const SOURCE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'OpenAI', label: 'OpenAI' },
  { id: 'Anthropic', label: 'Anthropic' },
  { id: 'Google', label: 'Google' },
  { id: 'Meta', label: 'Meta' },
  { id: 'Microsoft', label: 'Microsoft' },
  { id: 'NVIDIA', label: 'NVIDIA' },
  { id: 'Hugging Face', label: 'HuggingFace' },
];

interface NewsGridProps {
  articles: Article[];
  loading: boolean;
  sources: Source[];
  activeCompany: string;
  onCompanyChange: (company: string) => void;
}

export function NewsGrid({ articles, loading, sources, activeCompany, onCompanyChange }: NewsGridProps) {
  const sourceMap = Object.fromEntries(sources.map((s) => [s.name, s.color]));
  const enriched = articles.map((a) => ({
    ...a,
    source_color: sourceMap[a.source_name] ?? a.source_color,
  }));

  const nonFeatured = enriched.filter((a) => !a.is_featured);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold dark:text-white text-gray-900">Latest News</h2>
        <span className="text-xs text-gray-500">{loading ? '…' : `${nonFeatured.length} articles`}</span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {SOURCE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onCompanyChange(tab.id)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex-shrink-0',
              activeCompany === tab.id
                ? 'bg-violet-600 text-white'
                : 'dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-600 dark:hover:bg-gray-700 hover:bg-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : nonFeatured.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <p className="text-sm">No articles found</p>
          <p className="text-xs mt-1">Try a different filter or sync sources</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {nonFeatured.map((article, i) => (
            <div
              key={article.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 5) * 40}ms`, animationFillMode: 'both' }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
