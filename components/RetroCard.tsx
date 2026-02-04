
import React from 'react';
import { RetroEntry } from '../types';

interface RetroCardProps {
  data: RetroEntry;
  onChange: (field: keyof RetroEntry, value: string) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export const RetroCard: React.FC<RetroCardProps> = ({ data, onChange, onAnalyze, isAnalyzing }) => {
  return (
    <div className="bg-[#38bdf8] dark:bg-sky-950/20 border-2 border-sky-400 dark:border-sky-900/50 shadow-2xl shadow-sky-100 dark:shadow-none overflow-hidden flex flex-col h-full min-h-[160px] transition-all">
      <div className="bg-sky-700 dark:bg-sky-900 text-white dark:text-sky-400 px-3 py-2 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
        <span>WEEKLY_RETROSPECTIVE_v1.0</span>
        <button 
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`px-3 py-1.5 rounded font-black text-[9px] transition-all uppercase tracking-tight shadow-sm flex items-center gap-2 ${
            isAnalyzing 
              ? 'bg-sky-500/50 text-white cursor-wait' 
              : 'bg-white dark:bg-sky-500 dark:text-sky-950 text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-400'
          }`}
        >
          {isAnalyzing && (
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isAnalyzing ? 'SYNTHESIZING...' : 'AI GENERATE ANALYSIS'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 flex-grow border-t border-sky-400 dark:border-sky-900/50">
        {/* Row 1: Attempted vs Unplanned */}
        <div className="border-r border-b border-sky-400 dark:border-sky-900/50 p-3 bg-sky-200/50 dark:bg-sky-950/30 flex flex-col">
          <label className="text-[9px] font-black text-sky-800 dark:text-sky-400 uppercase mb-1">Milestones Achieved</label>
          <textarea 
            placeholder="Summary of completed scope..."
            value={data.attempted}
            onChange={(e) => onChange('attempted', e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-xs resize-none outline-none leading-snug text-sky-950 dark:text-sky-200 placeholder-sky-700/30 dark:placeholder-sky-500/20 font-medium"
            rows={2}
          />
        </div>
        <div className="border-b border-sky-400 dark:border-sky-900/50 p-3 bg-sky-200/50 dark:bg-sky-950/30 flex flex-col">
          <label className="text-[9px] font-black text-sky-800 dark:text-sky-400 uppercase mb-1">Scope Creep / Surprises</label>
          <textarea 
            placeholder="New high-priority interruptions..."
            value={data.unplanned}
            onChange={(e) => onChange('unplanned', e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-xs resize-none outline-none leading-snug text-sky-950 dark:text-sky-200 placeholder-sky-700/30 dark:placeholder-sky-500/20 font-mono italic"
            rows={2}
          />
        </div>

        {/* Row 2: Weekly Summary */}
        <div className="sm:col-span-2 border-b border-sky-400 dark:border-sky-900/50 p-4 flex flex-col bg-white/20 dark:bg-slate-900/30">
          <label className="text-[9px] font-black text-sky-900 dark:text-sky-500 uppercase mb-1 tracking-widest">Final Synthesis & Key Takeaways</label>
          <textarea 
            placeholder="Deep reflection on process and outcomes..."
            value={data.summary}
            onChange={(e) => onChange('summary', e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-xs md:text-sm resize-none outline-none leading-relaxed text-sky-950 dark:text-sky-100 font-medium"
            rows={5}
          />
        </div>

        {/* Row 3: Retro Actions */}
        <div className="sm:col-span-2 p-4 flex flex-col bg-sky-50/10 dark:bg-sky-950/40">
          <label className="text-[9px] font-black text-sky-900 dark:text-sky-400 uppercase mb-1 tracking-widest">Iteration Strategy (Next Week)</label>
          <textarea 
            placeholder="Specific process improvements..."
            value={data.actions}
            onChange={(e) => onChange('actions', e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-xs md:text-sm resize-none outline-none leading-snug text-sky-950 dark:text-sky-100 font-black"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
