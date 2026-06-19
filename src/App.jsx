import React, { useState, useEffect } from 'react';
import InputPanel from './components/InputPanel.jsx';
import ProcessingState from './components/ProcessingState.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import LoginPage from './components/LoginPage.jsx';
import RoleDashboard from './components/RoleDashboard.jsx';
import { Zap, LogOut, Code2, Users, Shield } from 'lucide-react';

const ROLE_META = {
  developer: { Icon: Code2,  color: 'bg-primary-500', label: 'Developer' },
  lead:      { Icon: Users,  color: 'bg-emerald-500', label: 'Team Lead' },
  admin:     { Icon: Shield, color: 'bg-rose-500',    label: 'Admin' },
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auth-devtool');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem('auth-devtool', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth-devtool');
  };

  const [step, setStep] = useState('input'); // 'input' | 'loading' | 'results'
  const [projectTypes, setProjectTypes] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [tools, setTools] = useState([]);
  const [error, setError] = useState(null);

  // Compare
  const [compareTools, setCompareTools] = useState([]);
  const [compareResult, setCompareResult] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  // Compatibility
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [loadingCompatibility, setLoadingCompatibility] = useState(false);

  // Alternatives
  const [alternativesMap, setAlternativesMap] = useState({});
  const [loadingAlternatives, setLoadingAlternatives] = useState(null);

  // Feedback
  const [feedback, setFeedback] = useState({});

  // Saved stacks
  const [savedStacks, setSavedStacks] = useState([]);
  const [savedConfirm, setSavedConfirm] = useState(false);

  // Load saved stacks + handle shared URL
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aipm-saved-stacks');
      if (saved) setSavedStacks(JSON.parse(saved));
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const shared = params.get('stack');
    if (shared) {
      try {
        const decoded = JSON.parse(atob(shared));
        if (decoded.tools?.length) {
          setTools(decoded.tools);
          setProjectTypes(decoded.projectTypes || []);
          setNeeds(decoded.needs || []);
          setStep('results');
        }
      } catch {}
    }
  }, []);

  // Submit — get tool recommendations
  const handleSubmit = async ({ projectTypes: pt, needs: nd, description, existingStack }) => {
    setProjectTypes(pt);
    setNeeds(nd);
    setStep('loading');
    setError(null);
    setCompareTools([]);
    setCompareResult(null);
    setCompatibilityResult(null);
    setAlternativesMap({});
    setFeedback({});

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectTypes: pt, needs: nd, description, existingStack }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '60');
        setError({ type: 'rate_limit', retryAfter });
        setStep('input');
        return;
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();
      const toolList = Array.isArray(data) ? data : data.tools || [];
      setTools(toolList);
      setStep('results');
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        setError({ type: 'timeout' });
      } else {
        setError({ type: 'generic', message: err.message });
      }
      setStep('input');
    }
  };

  // Toggle compare selection (max 3)
  const handleToggleCompare = (tool) => {
    setCompareTools(prev => {
      const already = prev.some(t => t.name === tool.name);
      if (already) return prev.filter(t => t.name !== tool.name);
      if (prev.length >= 3) return [...prev.slice(1), tool];
      return [...prev, tool];
    });
    setCompareResult(null);
  };

  // Run compare
  const handleCompare = async () => {
    if (compareTools.length < 2) return;
    setLoadingCompare(true);
    setCompareResult(null);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: compareTools.map(t => t.name),
          projectTypes,
          context: compareTools.map(t => t.why).join('. '),
        }),
      });
      const data = await res.json();
      setCompareResult(data);
    } catch (err) {
      setCompareResult({ error: err.message });
    } finally {
      setLoadingCompare(false);
    }
  };

  // Check compatibility
  const handleCheckCompatibility = async () => {
    if (tools.length < 2) return;
    setLoadingCompatibility(true);
    setCompatibilityResult(null);
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools: tools.map(t => t.name), projectTypes }),
      });
      const data = await res.json();
      setCompatibilityResult(data);
    } catch (err) {
      setCompatibilityResult({ error: err.message });
    } finally {
      setLoadingCompatibility(false);
    }
  };

  // Get alternatives for a tool
  const handleShowAlternatives = async (tool) => {
    if (alternativesMap[tool.name]) return;
    setLoadingAlternatives(tool.name);
    try {
      const res = await fetch('/api/alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: tool.name,
          toolWhy: tool.why,
          projectTypes,
          needs,
        }),
      });
      const data = await res.json();
      setAlternativesMap(prev => ({ ...prev, [tool.name]: data.alternatives || [] }));
    } catch {
      setAlternativesMap(prev => ({ ...prev, [tool.name]: [] }));
    } finally {
      setLoadingAlternatives(null);
    }
  };

  // Feedback
  const handleFeedback = (toolName, vote) => {
    setFeedback(prev => ({ ...prev, [toolName]: prev[toolName] === vote ? null : vote }));
  };

  // Save stack
  const handleSaveStack = () => {
    const stack = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      projectTypes,
      needs,
      tools,
    };
    const updated = [stack, ...savedStacks].slice(0, 3);
    setSavedStacks(updated);
    try { localStorage.setItem('aipm-saved-stacks', JSON.stringify(updated)); } catch {}
    setSavedConfirm(true);
    setTimeout(() => setSavedConfirm(false), 2000);
  };

  // Share stack as URL
  const handleShareStack = () => {
    const data = { tools, projectTypes, needs };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?stack=${encoded}`;
    navigator.clipboard.writeText(url).catch(() => {});
    history.replaceState({}, '', `?stack=${encoded}`);
  };

  // Load saved stack
  const handleLoadSaved = (stack) => {
    setTools(stack.tools);
    setProjectTypes(stack.projectTypes || []);
    setNeeds(stack.needs || []);
    setCompareTools([]);
    setCompareResult(null);
    setCompatibilityResult(null);
    setAlternativesMap({});
    setFeedback({});
    setStep('results');
  };

  // Delete saved stack
  const handleDeleteSaved = (id) => {
    const updated = savedStacks.filter(s => s.id !== id);
    setSavedStacks(updated);
    try { localStorage.setItem('aipm-saved-stacks', JSON.stringify(updated)); } catch {}
  };

  // Reset
  const handleReset = () => {
    setStep('input');
    setTools([]);
    setCompareTools([]);
    setCompareResult(null);
    setCompatibilityResult(null);
    setAlternativesMap({});
    setFeedback({});
    setError(null);
    history.replaceState({}, '', window.location.pathname);
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const meta = ROLE_META[user.role];
  const RoleIcon = meta.Icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Persistent user bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">AI Dev Tool Matcher</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md ${meta.color} flex items-center justify-center flex-shrink-0`}>
              <RoleIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium hidden sm:block">{user.name}</span>
            <span className="text-xs text-gray-400 hidden md:block">·</span>
            <span className="text-xs font-medium text-gray-400 capitalize hidden md:block">{meta.label}</span>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="ml-1 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {step === 'input' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <RoleDashboard user={user} />
        </div>
      )}
      {step === 'input' && (
        <InputPanel
          onSubmit={handleSubmit}
          error={error}
          isLoading={false}
        />
      )}
      {step === 'loading' && <ProcessingState />}
      {step === 'results' && (
        <ResultsPanel
          tools={tools}
          projectTypes={projectTypes}
          needs={needs}
          compareTools={compareTools}
          onToggleCompare={handleToggleCompare}
          compareResult={compareResult}
          loadingCompare={loadingCompare}
          onCompare={handleCompare}
          onCloseCompare={() => { setCompareResult(null); setLoadingCompare(false); }}
          compatibilityResult={compatibilityResult}
          loadingCompatibility={loadingCompatibility}
          onCheckCompatibility={handleCheckCompatibility}
          onCloseCompatibility={() => { setCompatibilityResult(null); }}
          feedback={feedback}
          onFeedback={handleFeedback}
          alternativesMap={alternativesMap}
          loadingAlternatives={loadingAlternatives}
          onShowAlternatives={handleShowAlternatives}
          savedStacks={savedStacks}
          onSave={handleSaveStack}
          onShare={handleShareStack}
          savedConfirm={savedConfirm}
          onDeleteSaved={handleDeleteSaved}
          onLoadSaved={handleLoadSaved}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
