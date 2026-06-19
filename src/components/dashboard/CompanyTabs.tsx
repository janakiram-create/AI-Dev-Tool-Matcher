import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { timeAgo, cn } from '../../lib/utils';
import type { Article } from '../../types';

const COMPANIES = [
  { name: 'OpenAI', color: '#10B981' },
  { name: 'Anthropic', color: '#F97316' },
  { name: 'Google', color: '#4285F4' },
  { name: 'Meta', color: '#1877F2' },
  { name: 'Microsoft', color: '#00A4EF' },
  { name: 'NVIDIA', color: '#76B900' },
  { name: 'Hugging Face', color: '#F59E0B' },
];

interface CompanyTabsProps {
  articles: Article[];
  loading: boolean;
}

export function CompanyTabs({ articles, loading }: CompanyTabsProps) {
  const [activeCompany, setActiveCompany] = useState('OpenAI');

  const company = COMPANIES.find((c) => c.name === activeCompany)!;
  const filtered = articles.filter((a) => a.company === activeCompany).slice(0, 4);

  return (
    <div className="rounded-2xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-4 pb-0">
        <h2 className="text-sm font-semibold dark:text-white text-gray-900 mr-2">By Company</h2>
        <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
          {COMPANIES.map((c) => {
            const count = articles.filter((a) => a.company === c.name).length;
            return (
              <button
                key={c.name}
                onClick={() => setActiveCompany(c.name)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap',
                  activeCompany === c.name
                    ? 'border-current text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                )}
                style={activeCompany === c.name ? { color: c.color, borderColor: c.color } : {}}
              >
                <span
                  className="w-4 h-4 rounded text-[8px] font-bold text-white flex items-center justify-center flex-shrink-0"
                  style={{ background: c.color }}
                >
                  {c.name[0]}
                </span>
                {c.name}
                {count > 0 && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-600">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t dark:border-gray-800/60 border-gray-200" />

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg dark:bg-gray-800 bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No recent articles from {activeCompany}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((article) => (
              <a
                key={article.id}
                href={article.url === '#' ? undefined : article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => article.url === '#' && e.preventDefault()}
                className="group flex items-start gap-3 p-3 rounded-xl dark:hover:bg-gray-800/60 hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-1 rounded-full self-stretch flex-shrink-0 mt-0.5"
                  style={{ background: company.color, minHeight: '2.5rem' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium dark:text-gray-200 text-gray-800 leading-snug line-clamp-2 group-hover:text-violet-400 dark:group-hover:text-violet-300 transition-colors">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500">{timeAgo(article.published_at)}</span>
                    <span className="text-[10px] text-gray-600">·</span>
                    <span className="text-[10px] text-gray-500">{article.read_time} min read</span>
                    {article.tags[0] && (
                      <>
                        <span className="text-[10px] text-gray-600">·</span>
                        <span className="text-[10px] text-gray-500">{article.tags[0]}</span>
                      </>
                    )}
                  </div>
                </div>
                <ExternalLink size={12} className="text-gray-600 opacity-0 group-hover:opacity-60 flex-shrink-0 mt-0.5 transition-opacity" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
