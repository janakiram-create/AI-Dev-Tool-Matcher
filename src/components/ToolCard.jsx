import React, { useState } from 'react';
import { ExternalLink, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, GitCompare } from 'lucide-react';

const CATEGORY_COLORS = {
  Database: '#3B82F6',
  Auth: '#F97316',
  Authentication: '#F97316',
  Hosting: '#10B981',
  Testing: '#8B5CF6',
  Monitoring: '#EF4444',
  Payments: '#F59E0B',
  'Real-time': '#06B6D4',
  Realtime: '#06B6D4',
  Storage: '#6366F1',
  Email: '#EC4899',
  Analytics: '#14B8A6',
  Search: '#84CC16',
  CI: '#64748B',
  'CI/CD': '#64748B',
  Framework: '#534AB7',
  default: '#6B7280',
};

const CONFIDENCE_CONFIG = {
  high:   { label: 'High confidence',   cls: 'bg-green-50 text-green-700 border-green-200' },
  medium: { label: 'Medium confidence', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  low:    { label: 'Low confidence',    cls: 'bg-red-50 text-red-600 border-red-200' },
};

export default function ToolCard({ tool, index, compareSelected, onToggleCompare, feedback, onFeedback, onShowAlternatives, alternatives, loadingAlternatives }) {
  const [altOpen, setAltOpen] = useState(false);
  const catColor = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS.default;
  const conf = CONFIDENCE_CONFIG[tool.confidence] || CONFIDENCE_CONFIG.medium;
  const fb = feedback[tool.name];

  const handleAlt = () => {
    if (!altOpen && !alternatives) onShowAlternatives(tool);
    setAltOpen(v => !v);
  };

  return (
    <div
      className={`card p-5 animate-fade-up transition-all ${compareSelected ? 'ring-2 ring-primary-500' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md text-white shrink-0"
            style={{ backgroundColor: catColor }}
          >
            {tool.category}
          </span>
          <h3 className="font-semibold text-gray-900 text-base truncate">{tool.name}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {tool.free_tier && (
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md font-medium">
              Free tier
            </span>
          )}
          <span className={`text-xs border px-2 py-0.5 rounded-md font-medium ${conf.cls}`}>
            {conf.label}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm text-gray-500 mb-3">{tool.tagline}</p>

      {/* Match score */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 font-medium">Match score</span>
          <span className="text-sm font-bold text-primary-600">{tool.match_score}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="score-bar h-full rounded-full"
            style={{ '--bar-width': `${tool.match_score}%`, backgroundColor: catColor }}
          />
        </div>
      </div>

      {/* Why it fits */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-100">
        <p className="text-xs text-gray-500 font-medium mb-0.5">Why it fits</p>
        <p className="text-sm text-gray-700">{tool.why}</p>
      </div>

      {/* Tags + best for */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tool.tags?.map(tag => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span><span className="font-medium text-gray-700">Best for:</span> {tool.best_for}</span>
        <span className="text-gray-400">{tool.pricing_tier}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={tool.docs_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink size={12} /> Docs
        </a>

        <button
          onClick={() => onToggleCompare(tool)}
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            compareSelected
              ? 'bg-primary-500 text-white border-primary-500'
              : 'text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
          }`}
        >
          <GitCompare size={12} /> Compare
        </button>

        <button
          onClick={handleAlt}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          Alternatives {altOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onFeedback(tool.name, 'up')}
            className={`p-1.5 rounded-lg transition-colors ${fb === 'up' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-500'}`}
            title="Helpful"
          >
            <ThumbsUp size={13} />
          </button>
          <button
            onClick={() => onFeedback(tool.name, 'down')}
            className={`p-1.5 rounded-lg transition-colors ${fb === 'down' ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            title="Not helpful"
          >
            <ThumbsDown size={13} />
          </button>
        </div>
      </div>

      {/* Alternatives panel */}
      {altOpen && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          {loadingAlternatives ? (
            <p className="text-sm text-gray-400 font-mono animate-pulse">Loading alternatives...</p>
          ) : alternatives ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alternatives to {tool.name}</p>
              {alternatives.map((alt, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-900">{alt.name}</span>
                    <div className="flex gap-1">
                      {alt.free_tier && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">Free</span>}
                      <span className="text-xs text-gray-500">{alt.pricing_tier}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{alt.tagline}</p>
                  <p className="text-xs text-gray-700 mb-2">{alt.why_different}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium text-green-700 mb-1">Pros vs {tool.name}</p>
                      {alt.pros_vs_original?.map((p, j) => <p key={j} className="text-gray-600">+ {p}</p>)}
                    </div>
                    <div>
                      <p className="font-medium text-red-600 mb-1">Cons vs {tool.name}</p>
                      {alt.cons_vs_original?.map((c, j) => <p key={j} className="text-gray-600">− {c}</p>)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">Use when: {alt.best_when}</p>
                  {alt.docs_url && (
                    <a href={alt.docs_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
                      View docs →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No alternatives loaded.</p>
          )}
        </div>
      )}
    </div>
  );
}
