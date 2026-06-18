import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function CompatibilityPanel({ tools, result, loading, onClose }) {
  const toolNames = tools.map(t => (typeof t === 'string' ? t : t.name));

  return (
    <div className="card p-5 border-l-4 border-l-primary-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Stack Compatibility Check</h3>
          <p className="text-xs text-gray-500 mt-0.5">{toolNames.join(', ')}</p>
        </div>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <X size={14} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 font-mono animate-pulse">Checking compatibility...</p>
      ) : result ? (
        <div className="space-y-4">
          {/* Overall status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${result.compatible ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {result.compatible
              ? <><CheckCircle2 size={16} /><span className="text-sm font-semibold">All tools are compatible</span></>
              : <><AlertTriangle size={16} /><span className="text-sm font-semibold">{result.potential_conflicts?.length || 0} potential conflict(s) found</span></>
            }
          </div>

          {/* Conflicts */}
          {result.potential_conflicts?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conflicts</p>
              {result.potential_conflicts.map((c, i) => (
                <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-yellow-800 mb-1">{c.tool_a} ↔ {c.tool_b}</p>
                  <p className="text-xs text-yellow-700 mb-1.5">{c.issue}</p>
                  <p className="text-xs text-yellow-600"><span className="font-medium">Fix:</span> {c.solution}</p>
                </div>
              ))}
            </div>
          )}

          {/* Integration notes */}
          {result.integration_notes?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Integration Notes</p>
              {result.integration_notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <Info size={12} className="text-primary-400 mt-0.5 shrink-0" />
                  {note}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
