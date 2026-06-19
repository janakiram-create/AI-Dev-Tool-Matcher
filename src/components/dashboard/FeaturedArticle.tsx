import { Clock, ExternalLink, Star } from 'lucide-react';
import { timeAgo } from '../../lib/utils';
import type { Article } from '../../types';

interface FeaturedArticleProps {
  article: Article | undefined;
  loading: boolean;
}

export function FeaturedArticle({ article, loading }: FeaturedArticleProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="h-4 w-24 rounded dark:bg-gray-800 bg-gray-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-full rounded dark:bg-gray-800 bg-gray-100 animate-pulse" />
            <div className="h-6 w-3/4 rounded dark:bg-gray-800 bg-gray-100 animate-pulse" />
          </div>
          <div className="h-4 w-full rounded dark:bg-gray-800 bg-gray-100 animate-pulse" />
          <div className="h-4 w-2/3 rounded dark:bg-gray-800 bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <a
      href={article.url === '#' ? undefined : article.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => article.url === '#' && e.preventDefault()}
      className="group block rounded-2xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white overflow-hidden hover:border-gray-700 dark:hover:border-gray-700 transition-all hover:shadow-xl dark:hover:shadow-black/40 duration-200 cursor-pointer"
    >
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${article.source_color}, ${article.source_color}80)`,
        }}
      />

      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
            style={{ background: article.source_color }}
          >
            <span>{article.source_name[0]}</span>
            {article.source_name}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-400">
            <Star size={9} fill="currentColor" />
            Featured
          </span>
          {article.company && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{article.company}</span>
          )}
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <Clock size={11} />
            {timeAgo(article.published_at)}
            {article.read_time && <span className="ml-2">{article.read_time} min read</span>}
          </div>
        </div>

        <h2 className="text-xl lg:text-2xl font-bold dark:text-white text-gray-900 leading-snug mb-3 group-hover:text-violet-400 dark:group-hover:text-violet-300 transition-colors">
          {article.title}
        </h2>

        {article.summary && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3 lg:line-clamp-2">
            {article.summary}
          </p>
        )}

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Read Article <ExternalLink size={11} />
          </div>
        </div>
      </div>
    </a>
  );
}
