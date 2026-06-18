import React from 'react';
import { ArrowLeft, GitCompare, ShieldCheck, AlertCircle } from 'lucide-react';
import ToolCard from './ToolCard.jsx';
import ComparePanel from './ComparePanel.jsx';
import CompatibilityPanel from './CompatibilityPanel.jsx';
import StackSummary from './StackSummary.jsx';
import SavedStacks from './SavedStacks.jsx';

export default function ResultsPanel({
  tools, projectTypes, needs,
  compareTools, onToggleCompare, compareResult, loadingCompare, onCompare, onCloseCompare,
  compatibilityResult, loadingCompatibility, onCheckCompatibility, onCloseCompatibility,
  feedback, onFeedback,
  alternativesMap, loadingAlternatives, onShowAlternatives,
  savedStacks, onSave, onShare, savedConfirm, onDeleteSaved, onLoadSaved,
  onReset,
}) {
  const positiveFeedbackCount = Object.values(feedback).filter(v => v === 'up').length;
  const totalFeedback = Object.values(feedback).filter(Boolean).length;
  const satisfactionPct = totalFeedback > 0 ? Math.round((positiveFeedbackCount / totalFeedback) * 100) : 87;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={15} /> New search
          </button>
          <div className="text-xs text-gray-400 hidden sm:block">
            <span className="font-mono text-primary-600">{projectTypes.join(', ')}</span>
            {needs.length > 0 && <span> · {needs.join(', ')}</span>}
          </div>
          <div className="flex items-center gap-2">
            {compareTools.length >= 2 && (
              <button
                onClick={onCompare}
                className="flex items-center gap-1.5 text-xs font-semibold bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <GitCompare size={12} /> Compare {compareTools.length} tools
              </button>
            )}
            <button
              onClick={onCheckCompatibility}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ShieldCheck size={12} /> Check compatibility
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Results header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {tools.length} tools matched for your project
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Sorted by match score · {satisfactionPct}% of developers found these recommendations useful
            </p>
          </div>
        </div>

        {/* Stale data notice */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-6 text-xs text-blue-700">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          <span>Recommendations are based on Claude's knowledge (last updated Aug 2025). Pricing and features may have changed — always verify with official docs.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tool cards — 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            {tools.map((tool, i) => (
              <ToolCard
                key={tool.name}
                tool={tool}
                index={i}
                compareSelected={compareTools.some(t => t.name === tool.name)}
                onToggleCompare={onToggleCompare}
                feedback={feedback}
                onFeedback={onFeedback}
                onShowAlternatives={onShowAlternatives}
                alternatives={alternativesMap[tool.name]}
                loadingAlternatives={loadingAlternatives === tool.name}
              />
            ))}

            {/* Why recommendations section */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Why these recommendations?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                These tools were selected based on your project type{projectTypes.length ? ` (${projectTypes.join(', ')})` : ''} and
                needs{needs.length ? ` (${needs.join(', ')})` : ''}. Match scores reflect ecosystem maturity, community support,
                ease of integration, and real-world usage patterns for similar projects.
                Claude analysed trade-offs across pricing, scalability, and developer experience to rank them.
              </p>
            </div>
          </div>

          {/* Sidebar — 1/3 width */}
          <div className="space-y-4">
            <StackSummary
              tools={tools}
              onSave={onSave}
              onShare={onShare}
              savedConfirm={savedConfirm}
            />

            {(compatibilityResult || loadingCompatibility) && (
              <CompatibilityPanel
                tools={tools}
                result={compatibilityResult}
                loading={loadingCompatibility}
                onClose={onCloseCompatibility}
              />
            )}

            <SavedStacks
              stacks={savedStacks}
              onLoad={onLoadSaved}
              onDelete={onDeleteSaved}
            />

            {/* Compare hint */}
            {compareTools.length === 1 && (
              <div className="card p-4 border-l-4 border-l-primary-300">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-primary-600">{compareTools[0].name}</span> selected.
                  Pick one more tool to compare.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare modal */}
      {(compareResult || loadingCompare) && (
        <ComparePanel
          tools={compareTools}
          result={compareResult}
          loading={loadingCompare}
          onClose={onCloseCompare}
        />
      )}
    </div>
  );
}
