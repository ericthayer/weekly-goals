
import React, { useRef } from 'react';
import { DayOfWeek, PlannerEntry } from '../types';

interface PlannerCardProps {
  day: DayOfWeek;
  data: PlannerEntry;
  onChange: (field: keyof PlannerEntry, value: string) => void;
  onSuggest?: () => void;
}

export const PlannerCard: React.FC<PlannerCardProps> = ({ day, data, onChange, onSuggest }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Shared focus styles for consistency and accessibility
  const focusStyles = "focus:bg-white dark:focus:bg-slate-950 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:ring-1 focus:ring-slate-400/50 dark:focus:ring-slate-700/50 transition-all duration-200 rounded";

  // Simple Markdown-style formatting helper
  const applyFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.actionItems;
    const selectedText = text.substring(start, end);
    
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newText = before + prefix + selectedText + suffix + after;
    onChange('actionItems', newText);
    
    // Maintain focus and update cursor position after React re-render
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const hasGoal = data.goal.trim().length > 0;

  return (
    <div className="bg-slate-200 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-colors group">
      <div className="bg-slate-400 dark:bg-slate-800 text-white dark:text-slate-400 px-3 py-1.5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest transition-colors">
        <span>{day}</span>
        <span className="opacity-40 group-hover:opacity-100 transition-opacity">PLANNER_MODULE</span>
      </div>
      
      <div className="grid grid-cols-[60px_1fr] xs:grid-cols-[80px_1fr] flex-grow border-t border-slate-300 dark:border-slate-800">
        {/* Row 1: Date & Goal */}
        <div className="border-r border-b border-slate-300 dark:border-slate-800 p-2 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Date</label>
          <input 
            type="text" 
            placeholder="01/01"
            value={data.date}
            onChange={(e) => onChange('date', e.target.value)}
            className={`w-full bg-transparent border-none px-1 py-0.5 text-sm font-mono font-medium outline-none text-slate-700 dark:text-slate-300 ${focusStyles}`}
          />
        </div>
        <div className="border-b border-slate-300 dark:border-slate-800 p-2 flex flex-col bg-white dark:bg-slate-900">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase mb-1">Critical Goal</label>
          <textarea 
            placeholder="Primary focus..."
            value={data.goal}
            onChange={(e) => onChange('goal', e.target.value)}
            className={`w-full bg-transparent border-none p-1 text-xs md:text-sm resize-none outline-none leading-tight text-slate-800 dark:text-slate-200 font-medium ${focusStyles}`}
            rows={2}
          />
        </div>

        {/* Row 2: Appointments & Actions */}
        <div className="border-r border-slate-300 dark:border-slate-800 p-2 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Syncs</label>
          <textarea 
            placeholder="Meets..."
            value={data.appointments}
            onChange={(e) => onChange('appointments', e.target.value)}
            className={`w-full bg-transparent border-none p-1 text-[10px] resize-none outline-none leading-snug text-slate-600 dark:text-slate-400 font-mono ${focusStyles}`}
            rows={3}
          />
        </div>
        <div className="p-2 flex flex-col bg-white dark:bg-slate-900 group/actions">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase">Action Items & Technical Specs</label>
              {hasGoal && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" title="AI suggestions available based on your goal"></span>
              )}
            </div>
            <div className="flex items-center gap-1.5 opacity-0 group-hover/actions:opacity-100 transition-opacity">
              {/* Simple Formatting Toolbar */}
              <button 
                type="button"
                onClick={() => applyFormatting('**', '**')}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold h-6 w-6 flex items-center justify-center transition-colors"
                title="Bold"
              >
                B
              </button>
              <button 
                type="button"
                onClick={() => applyFormatting('• ')}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold h-6 w-6 flex items-center justify-center transition-colors"
                title="Bullet"
              >
                •
              </button>
              <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1"></div>
              <button 
                type="button"
                onClick={onSuggest}
                className={`text-[9px] font-black hover:underline uppercase tracking-tighter transition-colors ${hasGoal ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-600'}`}
                disabled={!hasGoal}
              >
                AI SUGGEST
              </button>
            </div>
          </div>
          <textarea 
            ref={textareaRef}
            placeholder="• Feature X implementation&#10;• Debug Y"
            value={data.actionItems}
            onChange={(e) => onChange('actionItems', e.target.value)}
            className={`w-full bg-transparent border-none p-1 text-[11px] resize-none outline-none leading-snug text-slate-700 dark:text-slate-300 ${focusStyles}`}
            rows={4}
          />
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Supports Markdown formatting</span>
          </div>
        </div>
      </div>
    </div>
  );
};
