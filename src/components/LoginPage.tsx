import { useState } from 'react';
import { Zap, BookOpen, BarChart2, Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AuthUser } from '../types';

interface RoleConfig {
  email: string;
  password: string;
  role: AuthUser['role'];
  name: string;
  Icon: LucideIcon;
  accent: string;
  iconBg: string;
  btnClass: string;
  textAccent: string;
  label: string;
  tagline: string;
  features: string[];
}

const ROLES: RoleConfig[] = [
  {
    email: 'reader@demo.com',
    password: 'reader123',
    role: 'reader',
    name: 'Casey Kim',
    Icon: BookOpen,
    accent: 'border-blue-400 dark:border-blue-600',
    iconBg: 'bg-blue-500',
    btnClass: 'bg-blue-600 hover:bg-blue-500',
    textAccent: 'text-blue-400',
    label: 'Reader',
    tagline: 'Browse AI news & research',
    features: [
      'Full AI news feed access',
      'Filter by company & category',
      'Featured article highlights',
    ],
  },
  {
    email: 'analyst@demo.com',
    password: 'analyst123',
    role: 'analyst',
    name: 'Morgan Lee',
    Icon: BarChart2,
    accent: 'border-violet-400 dark:border-violet-600',
    iconBg: 'bg-violet-500',
    btnClass: 'bg-violet-600 hover:bg-violet-500',
    textAccent: 'text-violet-400',
    label: 'Analyst',
    tagline: 'Research & deep analysis',
    features: [
      'All Reader features',
      'Export articles & reports',
      'Funding tracker & analytics',
    ],
  },
  {
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    Icon: Shield,
    accent: 'border-rose-400 dark:border-rose-600',
    iconBg: 'bg-rose-500',
    btnClass: 'bg-rose-600 hover:bg-rose-500',
    textAccent: 'text-rose-400',
    label: 'Administrator',
    tagline: 'Data sync & source management',
    features: [
      'All Analyst features',
      'Trigger data sync',
      'Manage sources & settings',
    ],
  },
];

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = ROLES.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (found) {
      onLogin({ email: found.email, name: found.name, role: found.role });
    } else {
      setError('Invalid credentials. Use the demo cards above.');
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-50 dark:text-gray-100 text-gray-900 flex flex-col items-center justify-start px-4 py-10">
      {/* Brand */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
          <Zap size={22} className="text-white" fill="currentColor" />
        </div>
        <h1 className="text-3xl font-bold dark:text-white text-gray-900 tracking-tight">AI Updates Dashboard</h1>
        <p className="dark:text-gray-400 text-gray-500 mt-2">Choose your role to access the dashboard</p>
      </div>

      {/* Role cards — PRIMARY */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {ROLES.map(({ role, Icon, accent, iconBg, btnClass, textAccent, label, tagline, features, email: ue, name }) => (
          <div
            key={role}
            onClick={() => onLogin({ email: ue, name, role })}
            className={`dark:bg-gray-900 bg-white rounded-2xl border-2 ${accent} p-6 flex flex-col dark:shadow-black/30 shadow hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <Icon size={22} className="text-white" />
            </div>
            <div className={`text-xs font-bold uppercase tracking-widest ${textAccent} mb-1`}>{label}</div>
            <div className="text-base font-semibold dark:text-gray-100 text-gray-800 mb-3">{tagline}</div>
            <ul className="space-y-2 flex-1 mb-5">
              {features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm dark:text-gray-400 text-gray-600">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${textAccent}`} />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 ${btnClass} text-white font-semibold rounded-lg text-sm transition-colors`}>
              Continue as {label}
            </button>
            <p className="text-center text-xs dark:text-gray-600 text-gray-400 mt-2 font-mono">{ue}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full max-w-sm flex items-center gap-4 mb-6">
        <div className="flex-1 border-t dark:border-gray-800 border-gray-200" />
        <span className="text-xs dark:text-gray-500 text-gray-400 font-medium">or sign in with credentials</span>
        <div className="flex-1 border-t dark:border-gray-800 border-gray-200" />
      </div>

      {/* Email form — secondary */}
      <div className="w-full max-w-sm dark:bg-gray-900 bg-white rounded-2xl border dark:border-white/10 border-gray-200 p-6 shadow-xl dark:shadow-black/30">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1.5">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 dark:bg-gray-800/70 bg-gray-50 border dark:border-gray-700 border-gray-200 rounded-lg text-sm dark:text-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 dark:bg-gray-800/70 bg-gray-50 border dark:border-gray-700 border-gray-200 rounded-lg text-sm dark:text-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400 hover:text-gray-300 transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit"
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors text-sm">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
