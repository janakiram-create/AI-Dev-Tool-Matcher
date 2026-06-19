import { LayoutDashboard, Clock, Star, BookOpen, TrendingUp, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Source, FilterTab } from '../../types';

const NAV_ITEMS = [
  { id: 'all', label: 'All Updates', icon: LayoutDashboard },
  { id: 'today', label: 'Today', icon: Clock },
  { id: 'featured', label: 'Featured', icon: Star },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'funding', label: 'Funding', icon: TrendingUp },
] as const;

const CATEGORIES = [
  { slug: 'models', label: 'Models & Research', color: '#818CF8' },
  { slug: 'products', label: 'Products & APIs', color: '#34D399' },
  { slug: 'funding', label: 'Funding & Business', color: '#FB923C' },
  { slug: 'open-source', label: 'Open Source', color: '#60A5FA' },
  { slug: 'regulation', label: 'Regulation', color: '#F472B6' },
] as const;

interface SidebarProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  activeSource: string | null;
  onSourceChange: (slug: string | null) => void;
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  activeTab, onTabChange, activeSource, onSourceChange, sources, isOpen, onClose,
}: SidebarProps) {
  const companySources = sources.filter((s) => s.category === 'company');
  const mediaSources = sources.filter((s) => s.category === 'media');

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-14 z-30 h-screen lg:h-[calc(100vh-3.5rem)] w-60 flex-shrink-0 flex flex-col',
          'dark:bg-gray-950 bg-white border-r dark:border-gray-800/60 border-gray-200',
          'overflow-y-auto transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-3 space-y-0.5 pt-4 lg:pt-3">
          <div className="flex items-center justify-between px-2 pb-1 lg:hidden">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</span>
            <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-200">
              <X size={14} />
            </button>
          </div>

          <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Explore
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onTabChange(id); onSourceChange(null); onClose(); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === id && !activeSource
                  ? 'bg-violet-600/15 text-violet-400 dark:text-violet-300'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              )}
            >
              <Icon size={15} />
              {label}
              {activeTab === id && !activeSource && (
                <ChevronRight size={12} className="ml-auto opacity-60" />
              )}
            </button>
          ))}
        </div>

        <SourceGroup
          title="AI Companies"
          sources={companySources}
          activeSource={activeSource}
          onSelect={(slug) => { onSourceChange(slug); onTabChange('all'); onClose(); }}
        />

        <SourceGroup
          title="Media & Research"
          sources={mediaSources}
          activeSource={activeSource}
          onSelect={(slug) => { onSourceChange(slug); onTabChange('all'); onClose(); }}
        />

        <div className="p-3 border-t dark:border-gray-800/60 border-gray-200 mt-auto pb-6">
          <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Categories
          </p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { onTabChange(cat.slug); onSourceChange(null); onClose(); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors',
                activeTab === cat.slug
                  ? 'bg-gray-800/60 dark:text-gray-200 text-gray-900'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/40'
              )}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

function SourceGroup({
  title, sources, activeSource, onSelect,
}: {
  title: string;
  sources: Source[];
  activeSource: string | null;
  onSelect: (slug: string | null) => void;
}) {
  return (
    <div className="p-3 border-t dark:border-gray-800/60 border-gray-200 space-y-0.5">
      <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </p>
      {sources.map((src) => (
        <button
          key={src.slug}
          onClick={() => onSelect(activeSource === src.slug ? null : src.slug)}
          className={cn(
            'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors',
            activeSource === src.slug
              ? 'bg-violet-600/15 dark:text-violet-300 text-violet-700'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/40'
          )}
        >
          <span
            className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: src.color }}
          >
            {src.icon_letter}
          </span>
          <span className="truncate">{src.name}</span>
          <span className="ml-auto text-[10px] text-gray-600 tabular-nums">{src.article_count}</span>
        </button>
      ))}
    </div>
  );
}
