import { Code2, Users, Shield, Search, Package, Layers, UserCheck, Plus } from 'lucide-react';

const MOCK_TEAM_STACKS = [
  { name: 'Frontend Stack', tools: ['React', 'Tailwind', 'Vercel'], members: 4, updated: '2h ago', color: 'bg-blue-500' },
  { name: 'Backend API', tools: ['Node.js', 'PostgreSQL', 'Railway'], members: 3, updated: '1d ago', color: 'bg-green-500' },
  { name: 'Mobile App', tools: ['React Native', 'Firebase', 'Expo'], members: 2, updated: '3d ago', color: 'bg-purple-500' },
];

const ADMIN_STATS = [
  { label: 'Total Queries', value: '2,847', Icon: Search },
  { label: 'Tools in DB', value: '148', Icon: Package },
  { label: 'Categories', value: '12', Icon: Layers },
  { label: 'Active Users', value: '64', Icon: UserCheck },
];

function DeveloperDashboard({ user }) {
  return (
    <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-center gap-4 mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
        <Code2 className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-primary-800">Developer Mode — {user.name}</p>
        <p className="text-xs text-primary-600 mt-0.5">Personal AI-powered tool recommendations for your projects</p>
      </div>
      <span className="ml-auto text-xs text-primary-600 bg-white border border-primary-200 px-2.5 py-1 rounded-lg font-medium hidden sm:block flex-shrink-0">
        Solo Plan
      </span>
    </div>
  );
}

function LeadDashboard({ user }) {
  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Team Workspace — {user.name}</h2>
          <p className="text-xs text-gray-500">5 members · 3 shared stacks</p>
        </div>
        <button className="ml-auto flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors flex-shrink-0">
          <Plus className="w-3 h-3" />
          New Stack
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MOCK_TEAM_STACKS.map(({ name, tools, members, updated, color }) => (
          <div key={name} className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-emerald-200 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-5 h-5 rounded-md ${color} flex items-center justify-center`}>
                <Layers className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">{name}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {tools.map(t => (
                <span key={t} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-600">{t}</span>
              ))}
            </div>
            <div className="text-xs text-gray-400">{members} members · {updated}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ user }) {
  return (
    <div className="bg-white border border-rose-100 rounded-xl p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Admin Overview</h2>
          <p className="text-xs text-gray-500">Platform analytics — last 24h</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Live
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ADMIN_STATS.map(({ label, value, Icon: SIcon }) => (
          <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <SIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {['Manage Tools', 'View Query Log', 'User Sessions', 'Export Data'].map(a => (
          <button key={a} className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RoleDashboard({ user }) {
  if (user.role === 'developer') return <DeveloperDashboard user={user} />;
  if (user.role === 'lead')      return <LeadDashboard user={user} />;
  if (user.role === 'admin')     return <AdminDashboard user={user} />;
  return null;
}
