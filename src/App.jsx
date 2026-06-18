import React, { useState, useEffect } from 'react';
import InputPanel from './components/InputPanel.jsx';
import ProcessingState from './components/ProcessingState.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';

export default function App() {
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

  return (
    <div className="min-h-screen bg-gray-50">
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
