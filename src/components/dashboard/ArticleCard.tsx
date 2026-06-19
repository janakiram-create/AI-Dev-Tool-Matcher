import { Clock, ExternalLink } from 'lucide-react';
import { timeAgo, truncate } from '../../lib/utils';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <a
      href={article.url === '#' ? undefined : article.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => article.url === '#' && e.preventDefault()}
      className="group block rounded-xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white overflow-hidden hover:border-gray-700 dark:hover:border-gray-700 hover:border-gray-300 transition-all hover:shadow-lg dark:hover:shadow-black/30 hover:shadow-gray-200/60 hover:-translate-y-0.5 duration-200"
    >
      <div className="h-0.5 w-full" style={{ background: article.source_color }} />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold text-white flex-shrink-0"
            style={{ background: article.source_color }}
          >
            {article.source_name[0]}
          </span>
          <span className="text-[11px] font-medium text-gray-500 truncate">{article.source_name}</span>
          <span className="ml-auto text-[10px] text-gray-600 flex-shrink-0 flex items-center gap-1">
            <Clock size={9} />
            {timeAgo(article.published_at)}
          </span>
        </div>

        <h3 className="text-sm font-semibold dark:text-gray-100 text-gray-900 leading-snug mb-1.5 group-hover:text-violet-400 dark:group-hover:text-violet-300 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {!compact && article.summary && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
            {truncate(article.summary, 120)}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1 flex-wrap">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-600 flex-shrink-0">
            <span>{article.read_time} min</span>
            <ExternalLink size={9} className="opacity-0 group-hover:opacity-60 transition-opacity" />
          </div>
        </div>
      </div>
    </a>
  );
}
