import { useState, useEffect } from 'react';
import { Clock, RefreshCw, Hash } from 'lucide-react';
import { timeAgo } from '../../lib/utils';
import type { Source } from '../../types';

const TRENDING_TAGS = [
  'GPT-5', 'Claude', 'Gemini', 'Llama 4', 'multimodal',
  'reasoning', 'open-source', 'fine-tuning', 'RAG', 'agents',
  'vision', 'EU AI Act', 'on-device', 'inference', 'safety',
];

function SyncCountdown({ lastSync }: { lastSync: string | null }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const tick = () => {
      if (!lastSync) return;
      const elapsed = Math.floor((Date.now() - new Date(lastSync).getTime()) / 1000);
      const next = Math.max(0, 1800 - elapsed);
      setSeconds(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastSync]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = lastSync
    ? Math.min(100, ((Date.now() - new Date(lastSync).getTime()) / 1000 / 1800) * 100)
    : 0;

  return (
    <div className="rounded-xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw size={13} className="text-violet-400" />
        <p className="text-xs font-semibold dark:text-white text-gray-900">Next Sync</p>
      </div>
      <div className="text-2xl font-mono font-bold dark:text-white text-gray-900 mb-2 tabular-nums">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <div className="h-1.5 rounded-full dark:bg-gray-800 bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-500 mt-1.5">
        {lastSync ? `Last synced ${timeAgo(lastSync)}` : 'Never synced'}
      </p>
    </div>
  );
}

interface RightPanelProps {
  sources: Source[];
  lastSync: string | null;
}

export function RightPanel({ sources, lastSync }: RightPanelProps) {
  return (
    <aside className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pb-6 pt-5">
      <SyncCountdown lastSync={lastSync} />

      <div className="rounded-xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b dark:border-gray-800/60 border-gray-200">
          <Clock size={13} className="text-gray-400" />
          <p className="text-xs font-semibold dark:text-white text-gray-900">Source Status</p>
        </div>
        <div className="divide-y dark:divide-gray-800/40 divide-gray-100">
          {sources.slice(0, 10).map((src) => {
            const lastSyncMs = src.last_synced_at ? Date.now() - new Date(src.last_synced_at).getTime() : null;
            const healthy = lastSyncMs !== null && lastSyncMs < 3600000;
            return (
              <div key={src.slug} className="flex items-center gap-2.5 px-4 py-2.5">
                <span
                  className="w-4 h-4 rounded text-[8px] font-bold text-white flex items-center justify-center flex-shrink-0"
                  style={{ background: src.color }}
                >
                  {src.icon_letter}
                </span>
                <span className="text-xs dark:text-gray-300 text-gray-700 flex-1 truncate">{src.name}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      healthy ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-[10px] text-gray-500">
                    {src.last_synced_at ? timeAgo(src.last_synced_at) : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border dark:border-gray-800/60 border-gray-200 dark:bg-gray-900 bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <Hash size={13} className="text-gray-400" />
          <p className="text-xs font-semibold dark:text-white text-gray-900">Trending Topics</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_TAGS.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-600 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
