import { Search, RefreshCw, Sun, Moon, Zap, Menu, LogOut, BookOpen, BarChart2, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { timeAgo } from '../../lib/utils';
import type { ThemeMode, AuthUser } from '../../types';

const ROLE_META: Record<string, { Icon: LucideIcon; color: string; label: string }> = {
  reader:   { Icon: BookOpen,  color: 'bg-blue-500',   label: 'Reader' },
  analyst:  { Icon: BarChart2, color: 'bg-violet-500', label: 'Analyst' },
  admin:    { Icon: Shield,    color: 'bg-rose-500',   label: 'Admin' },
};

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  lastSync: string | null;
  onSync: () => void;
  syncing: boolean;
  search: string;
  onSearch: (v: string) => void;
  user: AuthUser;
  onLogout: () => void;
}

export function Header({
  theme, onToggleTheme, onToggleSidebar, lastSync, onSync, syncing, search, onSearch, user, onLogout
}: HeaderProps) {
  const meta = ROLE_META[user.role];
  return (
    <header className="sticky top-0 z-40 h-14 flex items-center gap-3 px-4 border-b border-gray-800/60 dark:bg-gray-950/90 bg-white/90 backdrop-blur-md">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2 mr-2 select-none">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Zap size={14} className="text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-sm dark:text-white text-gray-900 hidden sm:block tracking-tight">
          AI Updates
        </span>
      </div>

      <div className="flex-1 max-w-md relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg dark:bg-gray-800/70 bg-gray-100 dark:border-gray-700 border-gray-200 border dark:text-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {lastSync && (
          <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
            Synced {timeAgo(lastSync)}
          </span>
        )}

        <button
          onClick={onSync}
          disabled={syncing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-60 shadow-sm shadow-violet-500/20"
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          <span className="hidden sm:block">{syncing ? 'Syncing…' : 'Sync Now'}</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg dark:text-gray-400 text-gray-500 dark:hover:text-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center gap-1.5 pl-2 border-l dark:border-gray-800 border-gray-200">
          <div className={`w-6 h-6 rounded-md ${meta.color} flex items-center justify-center flex-shrink-0`}>
            <meta.Icon size={12} className="text-white" />
          </div>
          <span className="text-xs font-medium dark:text-gray-300 text-gray-700 hidden sm:block">{user.name}</span>
          <span className="text-xs dark:text-gray-600 text-gray-400 hidden md:block">·</span>
          <span className="text-xs dark:text-gray-500 text-gray-400 hidden md:block">{meta.label}</span>
          <button
            onClick={onLogout}
            title="Sign out"
            className="ml-0.5 p-1.5 rounded-lg dark:text-gray-500 text-gray-400 dark:hover:text-gray-200 hover:text-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
