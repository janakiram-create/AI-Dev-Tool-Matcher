import React, { useState, useEffect } from 'react';

const STEPS = [
  'Parsing project context...',
  'Scanning tool ecosystem...',
  'Scoring compatibility...',
  'Ranking by match...',
  'Generating insights...',
];

export default function ProcessingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex(i => (i + 1) % STEPS.length);
    }, 1400);
    const dotTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => { clearInterval(stepTimer); clearInterval(dotTimer); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-xl bg-primary-100 animate-ping opacity-40" />
        <div className="relative w-20 h-20 rounded-xl bg-primary-500 flex items-center justify-center">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Analysing your stack</h2>
        <p className="text-sm text-gray-500 font-mono min-w-[240px]">{STEPS[stepIndex]}{dots}</p>
      </div>

      <div className="w-64 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-700"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-400"
            style={{ animation: `pulse-dot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
