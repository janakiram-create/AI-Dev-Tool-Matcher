import React, { useState } from 'react';
import { Zap, HelpCircle, X } from 'lucide-react';
import ChipSelector from './ChipSelector.jsx';

const PROJECT_TYPES = ['Web App', 'Mobile', 'API', 'Data', 'AI/ML', 'DevOps'];
const NEEDS = ['Database', 'Auth', 'Hosting', 'Testing', 'Monitoring', 'Payments', 'Real-time', 'Storage', 'Email', 'Search', 'Analytics', 'CI/CD'];
const EXISTING_STACK_OPTIONS = ['React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Go', 'Ruby', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes'];

export default function InputPanel({ onSubmit, error, isLoading }) {
  const [projectTypes, setProjectTypes] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [description, setDescription] = useState('');
  const [existingStack, setExistingStack] = useState([]);
  const [showExisting, setShowExisting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const canSubmit = projectTypes.length > 0 || needs.length > 0;
  const descWarn = description.length > 0 && description.length < 20;

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ projectTypes, needs, description, existingStack });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <Zap size={12} />
          AI-Powered · Instant Recommendations
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
          Find the right tools for<br />your project — in 30 seconds
        </h1>
        <p className="text-gray-500 text-lg">
          Describe your project once. Get expert recommendations with match scores and reasoning.
        </p>
      </div>

      {/* Form card */}
      <div className="w-full max-w-2xl card p-7 space-y-6">
        {/* Error display */}
        {error && (
          <div className={`rounded-lg px-4 py-3 text-sm flex items-start gap-2 ${
            error.type === 'rate_limit' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
            error.type === 'timeout' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <X size={14} className="mt-0.5 shrink-0" />
            <span>
              {error.type === 'timeout' && 'Taking longer than expected. Please try again.'}
              {error.type === 'rate_limit' && `Too many requests. Try again in ${error.retryAfter}s.`}
              {error.type === 'generic' && `Something went wrong: ${error.message}`}
            </span>
          </div>
        )}

        {/* Project type */}
        <ChipSelector
          label="Project Type"
          options={PROJECT_TYPES}
          selected={projectTypes}
          onToggle={val => toggle(projectTypes, setProjectTypes, val)}
        />

        {/* Needs */}
        <ChipSelector
          label="What do you need?"
          options={NEEDS}
          selected={needs}
          onToggle={val => toggle(needs, setNeeds, val)}
        />

        {/* Existing stack */}
        <div>
          <button
            onClick={() => setShowExisting(v => !v)}
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 hover:text-primary-600 transition-colors"
          >
            Already using something? (optional)
            <span className="text-gray-400">{showExisting ? '−' : '+'}</span>
          </button>
          {showExisting && (
            <div className="mt-2">
              <ChipSelector
                label=""
                options={EXISTING_STACK_OPTIONS}
                selected={existingStack}
                onToggle={val => toggle(existingStack, setExistingStack, val)}
              />
              {existingStack.length > 0 && (
                <p className="text-xs text-primary-600 mt-1.5">
                  Recommendations will be compatible with: {existingStack.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Describe your project <span className="normal-case font-normal text-gray-400">(optional)</span>
            </p>
            <span className={`text-xs ${description.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
              {description.length}/500
            </span>
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. A SaaS platform for small teams with real-time collaboration, user auth, and a REST API..."
            rows={3}
            maxLength={500}
            className="w-full text-sm text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
          />
          {descWarn && (
            <p className="text-xs text-amber-600 mt-1">
              Longer description = better recommendations
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            title={!canSubmit ? 'Select at least one project type or need' : ''}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
              canSubmit && !isLoading
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Zap size={15} />
            Find My Tools
            <span className="text-xs opacity-60 hidden sm:inline ml-1">⌘ Enter</span>
          </button>

          {/* How it works tooltip */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <HelpCircle size={16} />
            </button>
            {showTooltip && (
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl z-10">
                <p className="font-semibold mb-1">How does this work?</p>
                <p className="text-gray-300 leading-relaxed">
                  Your project context is sent to Claude ({' '}
                  <span className="font-mono text-primary-300">claude-sonnet-4-6</span>), which analyses
                  your needs and ranks tools by compatibility, community, and best fit.
                </p>
                <div className="absolute bottom-[-5px] right-4 w-2.5 h-2.5 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        </div>

        {!canSubmit && (
          <p className="text-xs text-gray-400 text-center -mt-2">
            Select at least one project type or need to continue
          </p>
        )}
      </div>

      {/* Social proof */}
      <p className="text-xs text-gray-400 mt-5">
        Powered by Claude · Trusted by developers worldwide
      </p>
    </div>
  );
}
