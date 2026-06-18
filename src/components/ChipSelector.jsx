import React from 'react';

export default function ChipSelector({ label, options, selected, onToggle, colorMap = {} }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = selected.includes(opt);
          const color = colorMap[opt];
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`chip ${active ? 'chip-active' : 'chip-inactive'}`}
              style={active && color ? { backgroundColor: color, borderColor: color } : {}}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
