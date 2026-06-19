import { Newspaper, CalendarDays, Radio, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { KPIData } from '../../types';

interface KPICardsProps {
  kpi: KPIData;
  loading: boolean;
}

export function KPICards({ kpi, loading }: KPICardsProps) {
  const cards = [
    {
      label: 'Articles This Week',
      value: kpi.articles_this_week.toLocaleString(),
      subtext: `${kpi.total_articles.toLocaleString()} total`,
      icon: Newspaper,
      color: '#818CF8',
      trend: +12,
    },
    {
      label: 'Published Today',
      value: kpi.articles_today.toString(),
      subtext: 'across all sources',
      icon: CalendarDays,
      color: '#34D399',
      trend: +5,
      live: true,
    },
    {
      label: 'Active Sources',
      value: `${kpi.active_sources}`,
      subtext: 'of 13 monitored',
      icon: Radio,
      color: '#60A5FA',
      trend: 0,
    },
    {
      label: 'Total Funding Tracked',
      value: formatCurrency(kpi.total_funding_usd),
      subtext: 'last 90 days',
      icon: DollarSign,
      color: '#FB923C',
      trend: +18,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative rounded-xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white p-4 overflow-hidden group hover:border-gray-700/80 transition-colors"
        >
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{ background: `radial-gradient(ellipse at top left, ${card.color}, transparent 70%)` }}
          />

          <div className="flex items-start justify-between mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${card.color}20` }}
            >
              <card.icon size={16} style={{ color: card.color }} />
            </div>
            {card.live && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping absolute" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                LIVE
              </span>
            )}
            {card.trend !== 0 && !card.live && (
              <span className={`flex items-center gap-0.5 text-[10px] font-medium ${card.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(card.trend)}%
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-7 w-20 rounded dark:bg-gray-800 bg-gray-100 animate-pulse" />
              <div className="h-3.5 w-28 rounded dark:bg-gray-800 bg-gray-100 animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold dark:text-white text-gray-900 tabular-nums leading-none mb-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{card.subtext}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
