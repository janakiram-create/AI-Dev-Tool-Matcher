import { Download, Bookmark, BarChart2, Shield, Database, RefreshCw, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import type { AuthUser } from '../types';

const SOURCES_HEALTH = [
  { name: 'OpenAI Blog', status: 'ok', last: '14m ago', count: 48 },
  { name: 'Anthropic News', status: 'ok', last: '22m ago', count: 31 },
  { name: 'Google DeepMind', status: 'ok', last: '1h ago', count: 27 },
  { name: 'Hugging Face Blog', status: 'warn', last: '3h ago', count: 12 },
  { name: 'ArXiv CS.AI', status: 'ok', last: '45m ago', count: 104 },
];

function ReaderDashboard({ user }: { user: AuthUser }) {
  return (
    <div className="dark:bg-blue-950/30 bg-blue-50 border dark:border-blue-900 border-blue-100 rounded-xl p-4 flex items-center gap-4 mb-5">
      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold dark:text-blue-200 text-blue-900">Welcome, {user.name}</p>
        <p className="text-xs dark:text-blue-400 text-blue-600 mt-0.5">Browse the latest AI news, research, and funding updates</p>
      </div>
      <span className="ml-auto text-xs dark:text-blue-400 text-blue-600 dark:bg-blue-900/40 bg-white dark:border-blue-800 border border-blue-100 px-2.5 py-1 rounded-lg font-medium hidden sm:block flex-shrink-0">
        Reader Access
      </span>
    </div>
  );
}

function AnalystDashboard({ user }: { user: AuthUser }) {
  return (
    <div className="dark:bg-violet-950/30 bg-violet-50 border dark:border-violet-900 border-violet-100 rounded-xl p-5 mb-5">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold dark:text-violet-200 text-violet-900">Analyst Workspace — {user.name}</h2>
          <p className="text-xs dark:text-violet-400 text-violet-600">Advanced data access &amp; export capabilities</p>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 text-xs font-medium dark:bg-violet-900/50 bg-white dark:border-violet-700 border border-violet-200 dark:text-violet-300 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors">
            <Bookmark className="w-3.5 h-3.5" />
            Saved (12)
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Articles saved', value: '12' },
          { label: 'Reports exported', value: '4' },
          { label: 'Custom filters', value: '3' },
          { label: 'Data coverage', value: '7 days' },
        ].map(({ label, value }) => (
          <div key={label} className="dark:bg-violet-900/30 bg-white dark:border-violet-800 border border-violet-100 rounded-xl p-3">
            <div className="text-xl font-bold dark:text-violet-200 text-violet-900">{value}</div>
            <div className="text-xs dark:text-violet-400 text-violet-600 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ user, onSync, syncing }: { user: AuthUser; onSync: () => void; syncing: boolean }) {
  return (
    <div className="dark:bg-rose-950/20 bg-rose-50 border dark:border-rose-900 border-rose-100 rounded-xl p-5 mb-5">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold dark:text-rose-200 text-rose-900">Data Management — {user.name}</h2>
          <p className="text-xs dark:text-rose-400 text-rose-600">Source health, ingestion control &amp; system status</p>
        </div>
        <button
          onClick={onSync}
          disabled={syncing}
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 flex-shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing…' : 'Sync All Sources'}
        </button>
      </div>

      <div className="dark:bg-gray-900/50 bg-white rounded-xl border dark:border-gray-800 border-rose-100 overflow-hidden">
        <div className="px-4 py-2 border-b dark:border-gray-800 border-rose-100 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 dark:text-gray-400 text-gray-500" />
          <span className="text-xs font-medium dark:text-gray-300 text-gray-600">Source Status</span>
        </div>
        <div className="divide-y dark:divide-gray-800 divide-rose-50">
          {SOURCES_HEALTH.map(({ name, status, last, count }) => (
            <div key={name} className="flex items-center gap-3 px-4 py-2.5">
              {status === 'ok'
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                : <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              }
              <span className="text-xs dark:text-gray-300 text-gray-700 font-medium flex-1">{name}</span>
              <span className="text-xs dark:text-gray-500 text-gray-400 hidden sm:block">{count} articles</span>
              <span className="text-xs dark:text-gray-600 text-gray-400">{last}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface RoleDashboardProps {
  user: AuthUser;
  onSync: () => void;
  syncing: boolean;
}

export default function RoleDashboard({ user, onSync, syncing }: RoleDashboardProps) {
  if (user.role === 'reader')   return <ReaderDashboard user={user} />;
  if (user.role === 'analyst')  return <AnalystDashboard user={user} />;
  if (user.role === 'admin')    return <AdminDashboard user={user} onSync={onSync} syncing={syncing} />;
  return null;
}
