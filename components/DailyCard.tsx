
import React from 'react';
import { DayOfWeek, DailyEntry } from '../types';

interface DailyCardProps {
  day: DayOfWeek;
  data: DailyEntry;
  onChange: (field: keyof DailyEntry, value: string | boolean) => void;
  onSuggest?: () => void;
}

export const DailyCard: React.FC<DailyCardProps> = ({ day, data, onChange, onSuggest }) => {
  const handleExport = () => {
    const content = `
${day.toUpperCase()} DAILY JOURNAL
===========================
Status: ${data.completed ? 'COMPLETED' : 'IN PROGRESS'}
Goal: ${data.goal || 'No goal set'}

DAILY LOG (OUTCOMES/FINDINGS):
-----------------------------
${data.log || 'No entries'}

UNPLANNED ACTION ITEMS:
-----------------------
${data.unplanned || 'None'}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${day.toLowerCase()}_log_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Shared focus styles for better accessibility and visual feedback
  const focusStyles = "focus:bg-white dark:focus:bg-slate-900 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:ring-1 focus:ring-teal-500/50 transition-all duration-200";

  return (
    <div className="bg-[#ccfbf1] dark:bg-emerald-950/20 border-2 border-teal-200 dark:border-teal-900/50 shadow-sm overflow-hidden flex flex-col h-full min-h-[160px] transition-colors group">
      <div className="bg-teal-600 dark:bg-teal-900 text-white dark:text-teal-400 px-3 py-1.5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span>{day}</span>
          <span className="opacity-40 font-bold group-hover:opacity-100 transition-opacity">LOG_UNIT</span>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white/20 dark:bg-white/5 hover:bg-white/40 dark:hover:bg-teal-800/40 text-white px-2 py-0.5 rounded text-[9px] transition-all flex items-center gap-1 border border-white/10 dark:border-teal-700/30"
          title="Export as Text File"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          EXPORT
        </button>
      </div>

      <div className="grid grid-cols-[40px_1fr] xs:grid-cols-[50px_1fr] flex-grow border-t border-teal-200 dark:border-teal-900/50">
        {/* Row 1: Checkbox & Daily Goal */}
        <div className="border-r border-b border-teal-200 dark:border-teal-900/50 p-2 bg-[#bbf7ed] dark:bg-teal-950/40 flex items-center justify-center">
          <input 
            type="checkbox"
            checked={data.completed}
            onChange={(e) => onChange('completed', e.target.checked)}
            className="w-5 h-5 rounded border-teal-300 dark:border-teal-800 text-teal-600 dark:bg-slate-900 focus:ring-teal-500 cursor-pointer"
            aria-label={`Mark ${day} as completed`}
          />
        </div>
        <div className="border-b border-teal-200 dark:border-teal-900/50 p-2 flex flex-col relative group/suggest bg-white dark:bg-slate-900/50">
          <div className="flex justify-between items-start">
            <label className="text-[9px] font-black text-teal-600/80 dark:text-teal-500/60 uppercase mb-1">Execution Goal</label>
            {onSuggest && (
               <button 
                onClick={onSuggest}
                className="text-[9px] text-teal-700 dark:text-teal-400 font-black hover:underline opacity-0 group-hover/suggest:opacity-100 transition-opacity uppercase tracking-tighter"
               >
                 AI SUGGEST
               </button>
            )}
          </div>
          <input 
            type="text" 
            placeholder="Focus of today's sprint..."
            value={data.goal}
            onChange={(e) => onChange('goal', e.target.value)}
            className={`w-full bg-transparent border-none rounded px-1 py-0.5 text-xs md:text-sm outline-none font-bold text-slate-800 dark:text-slate-200 ${focusStyles}`}
          />
        </div>

        {/* Row 2: Daily Log */}
        <div className="col-span-2 border-b border-teal-200 dark:border-teal-900/50 p-2 flex flex-col bg-white/40 dark:bg-slate-950/20">
          <label className="text-[9px] font-black text-teal-600/80 dark:text-teal-500/60 uppercase mb-1">Sprint Log / Telemetry</label>
          <textarea 
            placeholder="Successes, obstacles, findings..."
            value={data.log}
            onChange={(e) => onChange('log', e.target.value)}
            className={`w-full bg-transparent border-none rounded p-1 text-[11px] resize-none outline-none leading-snug text-slate-700 dark:text-slate-300 ${focusStyles}`}
            rows={3}
          />
        </div>

        {/* Row 3: Unplanned Items */}
        <div className="col-span-2 p-2 flex flex-col bg-white/10 dark:bg-transparent">
          <label className="text-[9px] font-black text-teal-600/80 dark:text-teal-500/60 uppercase mb-1">Anomalies / Debt</label>
          <textarea 
            placeholder="Unplanned tasks encountered..."
            value={data.unplanned}
            onChange={(e) => onChange('unplanned', e.target.value)}
            className={`w-full bg-transparent border-none rounded p-1 text-[11px] resize-none outline-none leading-snug text-slate-600 dark:text-slate-400 font-mono italic ${focusStyles}`}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};
