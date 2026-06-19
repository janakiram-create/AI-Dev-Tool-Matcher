import { useState } from 'react';
import { Zap, Code2, Users, Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const ROLES = [
  {
    email: 'dev@demo.com',
    password: 'dev123',
    role: 'developer',
    name: 'Alex Rivera',
    Icon: Code2,
    accent: 'border-primary-300 bg-primary-50',
    iconBg: 'bg-primary-500',
    btnClass: 'bg-primary-500 hover:bg-primary-600',
    textAccent: 'text-primary-600',
    label: 'Solo Developer',
    tagline: 'Personal tool matching',
    features: [
      'AI-powered tool recommendations',
      'Compare up to 3 tools side-by-side',
      'Save & share your stack',
    ],
  },
  {
    email: 'lead@demo.com',
    password: 'lead123',
    role: 'lead',
    name: 'Jordan Smith',
    Icon: Users,
    accent: 'border-emerald-300 bg-emerald-50',
    iconBg: 'bg-emerald-500',
    btnClass: 'bg-emerald-500 hover:bg-emerald-600',
    textAccent: 'text-emerald-700',
    label: 'Team Lead',
    tagline: 'Team workspace & collaboration',
    features: [
      'All Developer features',
      'Shared team stack gallery',
      'Team-wide compatibility checks',
    ],
  },
  {
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    Icon: Shield,
    accent: 'border-rose-300 bg-rose-50',
    iconBg: 'bg-rose-500',
    btnClass: 'bg-rose-500 hover:bg-rose-600',
    textAccent: 'text-rose-700',
    label: 'Administrator',
    tagline: 'Platform analytics & control',
    features: [
      'Usage stats & query analytics',
      'Manage tool catalog',
      'View all user sessions',
    ],
  },
];

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = ROLES.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (found) {
      onLogin({ email: found.email, name: found.name, role: found.role });
    } else {
      setError('Invalid credentials. Use the demo cards above.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4 py-10">
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Zap size={12} /> AI-Powered · Instant Recommendations
        </div>
        <h1 className="text-3xl font-bold text-gray-900">AI Dev Tool Matcher</h1>
        <p className="text-gray-500 mt-2">Choose your role to get personalized tool recommendations</p>
      </div>

      {/* Role cards — PRIMARY */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {ROLES.map(({ role, Icon, accent, iconBg, btnClass, textAccent, label, tagline, features, email: ue, name }) => (
          <div
            key={role}
            className={`bg-white rounded-2xl border-2 ${accent} p-6 flex flex-col shadow hover:shadow-md transition-all cursor-pointer group`}
            onClick={() => onLogin({ email: ue, name, role })}
          >
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className={`text-xs font-bold uppercase tracking-widest ${textAccent} mb-1`}>{label}</div>
            <div className="text-base font-semibold text-gray-800 mb-3">{tagline}</div>
            <ul className="space-y-2 flex-1 mb-5">
              {features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${textAccent}`} />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 ${btnClass} text-white font-semibold rounded-lg text-sm transition-colors`}>
              Continue as {label}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2 font-mono">{ue}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full max-w-sm flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or sign in with credentials</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Email form — secondary */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
                placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit"
            className="w-full py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors text-sm">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
