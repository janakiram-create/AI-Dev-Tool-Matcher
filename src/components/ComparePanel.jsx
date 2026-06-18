import React from 'react';
import { X, Trophy, AlertCircle } from 'lucide-react';

export default function ComparePanel({ tools, result, loading, onClose }) {
  const toolKeys = tools.map((_, i) => `tool_${String.fromCharCode(97 + i)}_value`);
  const toolLabels = tools.map(t => (typeof t === 'string' ? t : t.name));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tool Comparison</h2>
            <p className="text-sm text-gray-500">{toolLabels.join(' vs ')}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-mono animate-pulse">Generating comparison...</p>
          </div>
        ) : result ? (
          <div className="p-6 space-y-6">
            {/* Comparison table */}
            {result.comparison_table?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Side-by-Side</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase w-1/3">Attribute</th>
                        {toolLabels.map(label => (
                          <th key={label} className="text-left px-4 py-2.5 text-xs font-semibold text-primary-600 uppercase">
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {result.comparison_table.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 font-medium text-gray-700">{row.attribute}</td>
                          {toolKeys.map(key => (
                            <td key={key} className="px-4 py-2.5 text-gray-600">{row[key] || '—'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Decision guide */}
            {result.decision_guide?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Choose X if...</h3>
                <div className="space-y-2">
                  {result.decision_guide.map((item, i) => (
                    <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="shrink-0 mt-0.5">
                        <span className="inline-block w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 mb-0.5">{item.scenario}</p>
                        <p className="text-xs text-primary-600 font-semibold">→ Use {item.recommended_tool}</p>
                        <p className="text-xs text-gray-500">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final verdict */}
            {result.final_verdict && (
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={16} className="text-primary-600" />
                  <h3 className="text-sm font-semibold text-primary-800">Final Verdict</h3>
                </div>
                <p className="font-bold text-primary-700 text-base mb-1">{result.final_verdict.winner}</p>
                <p className="text-sm text-primary-700 mb-3">{result.final_verdict.reason}</p>
                {result.final_verdict.caveats?.length > 0 && (
                  <div className="space-y-1">
                    {result.final_verdict.caveats.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <AlertCircle size={12} className="text-primary-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-primary-600">{c}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Migration path */}
            {result.migration_path?.steps?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                  Migration Path <span className="text-gray-400 normal-case">{result.migration_path.from} → {result.migration_path.to}</span>
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
                    result.migration_path.complexity === 'High' ? 'bg-red-50 text-red-600 border-red-200' :
                    result.migration_path.complexity === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                    'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    {result.migration_path.complexity} complexity
                  </span>
                </div>
                <ol className="space-y-2">
                  {result.migration_path.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
