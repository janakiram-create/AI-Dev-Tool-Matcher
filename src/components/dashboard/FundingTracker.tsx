import { ExternalLink, TrendingUp } from 'lucide-react';
import { timeAgo, formatCurrency } from '../../lib/utils';
import type { FundingRound } from '../../types';

const ROUND_COLORS: Record<string, string> = {
  'Series A': '#818CF8',
  'Series B': '#60A5FA',
  'Series C': '#34D399',
  'Series D': '#FB923C',
  'Series E': '#F472B6',
  'Series F': '#A78BFA',
  Strategic: '#F59E0B',
  Seed: '#6EE7B7',
};

interface FundingTrackerProps {
  rounds: FundingRound[];
  loading: boolean;
}

export function FundingTracker({ rounds, loading }: FundingTrackerProps) {
  return (
    <div className="rounded-2xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-800/60 border-gray-200">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-amber-400" />
          <h2 className="text-sm font-semibold dark:text-white text-gray-900">Funding Tracker</h2>
        </div>
        <span className="text-xs text-gray-500">Recent rounds</span>
      </div>

      {loading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg dark:bg-gray-800 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="divide-y dark:divide-gray-800/60 divide-gray-100">
          {rounds.map((round) => (
            <a
              key={round.id}
              href={round.article_url === '#' ? undefined : round.article_url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => (!round.article_url || round.article_url === '#') && e.preventDefault()}
              className="group flex items-center gap-4 px-5 py-3.5 dark:hover:bg-gray-800/40 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-xl dark:bg-gray-800 bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-bold dark:text-gray-200 text-gray-700">
                    {round.company_name[0]}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold dark:text-gray-100 text-gray-900 group-hover:text-violet-400 dark:group-hover:text-violet-300 transition-colors">
                    {round.company_name}
                  </p>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${ROUND_COLORS[round.round_type] ?? '#6366F1'}20`,
                      color: ROUND_COLORS[round.round_type] ?? '#6366F1',
                    }}
                  >
                    {round.round_type}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                  {round.investors.slice(0, 3).join(' · ')}
                  {round.investors.length > 3 && ` +${round.investors.length - 3}`}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold dark:text-emerald-400 text-emerald-600">{round.amount}</p>
                {round.amount_usd && (
                  <p className="text-[10px] text-gray-500">{formatCurrency(round.amount_usd)}</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] text-gray-500">{timeAgo(round.announced_at)}</span>
                <ExternalLink size={10} className="text-gray-600 opacity-0 group-hover:opacity-60 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
