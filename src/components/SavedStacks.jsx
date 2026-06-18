import React from 'react';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

export default function SavedStacks({ stacks, onLoad, onDelete }) {
  if (!stacks.length) return null;

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Clock size={14} className="text-gray-400" /> Saved Stacks
      </h3>
      <div className="space-y-2">
        {stacks.map(stack => (
          <div
            key={stack.id}
            className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 group"
          >
            <button
              onClick={() => onLoad(stack)}
              className="flex items-center gap-2 min-w-0 flex-1 text-left hover:text-primary-600 transition-colors"
            >
              <ChevronRight size={12} className="text-gray-400 group-hover:text-primary-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {stack.projectTypes?.join(', ') || 'General project'} — {stack.tools?.length || 0} tools
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(stack.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </button>
            <button
              onClick={() => onDelete(stack.id)}
              className="p-1.5 text-gray-300 hover:text-red-400 transition-colors shrink-0 ml-2"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
