import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Share2, Bookmark, Check } from 'lucide-react';

export default function StackSummary({ tools, onSave, onShare, savedConfirm }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyAsText = () => {
    const text = tools.map(t => `• ${t.name} (${t.category}) — ${t.match_score}% match`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">Your Stack Summary</span>
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
            {tools.length} tools
          </span>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100">
          <div className="px-5 py-3 space-y-2">
            {tools.map((tool, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs text-gray-400 w-4 text-right">{i + 1}.</span>
                  <span className="font-medium text-sm text-gray-800 truncate">{tool.name}</span>
                  <span className="text-xs text-gray-400 truncate hidden sm:block">{tool.category}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {tool.free_tier && (
                    <span className="text-xs text-green-600 font-medium">Free</span>
                  )}
                  <span className="text-xs font-semibold text-primary-600">{tool.match_score}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex-wrap">
            <button
              onClick={copyAsText}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors bg-white"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy as text'}
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors bg-white"
            >
              <Share2 size={12} /> Share stack
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-600 border border-primary-200 hover:border-primary-400 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors bg-white"
            >
              <Bookmark size={12} />
              {savedConfirm ? 'Saved!' : 'Save stack'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
