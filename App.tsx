
import React, { useState, useEffect, useRef } from 'react';
import { DAYS, INITIAL_WEEKLY_DATA } from './constants';
import { WeeklyData, DayOfWeek, PlannerEntry, DailyEntry, RetroEntry } from './types';
import { PlannerCard } from './components/PlannerCard';
import { DailyCard } from './components/DailyCard';
import { RetroCard } from './components/RetroCard';
import { summarizeWeek, suggestActionItems, suggestDailyGoal } from './services/geminiService';

const App: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData>(() => {
    const saved = localStorage.getItem('dev-journal-data');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_DATA;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('dev-journal-theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<number | null>(null);

  // Theme Persistence
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dev-journal-theme', theme);
  }, [theme]);

  // Centralized Persistence with Debounce (Auto-save behavior)
  useEffect(() => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = window.setTimeout(() => {
      localStorage.setItem('dev-journal-data', JSON.stringify(weeklyData));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    };
  }, [weeklyData]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const updatePlanner = (day: DayOfWeek, field: keyof PlannerEntry, value: string) => {
    setWeeklyData(prev => ({
      ...prev,
      planner: {
        ...prev.planner,
        [day]: { ...prev.planner[day], [field]: value }
      }
    }));
  };

  const clearPlannerDay = (day: DayOfWeek) => {
    if (window.confirm(`Clear all planner entries for ${day}?`)) {
      setWeeklyData(prev => ({
        ...prev,
        planner: {
          ...prev.planner,
          [day]: { date: '', goal: '', appointments: '', actionItems: '' }
        }
      }));
    }
  };

  const updateDaily = (day: DayOfWeek, field: keyof DailyEntry, value: string | boolean) => {
    setWeeklyData(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        [day]: { ...prev.daily[day], [field]: value }
      }
    }));
  };

  const clearDailyDay = (day: DayOfWeek) => {
    if (window.confirm(`Clear all daily entries for ${day}?`)) {
      setWeeklyData(prev => ({
        ...prev,
        daily: {
          ...prev.daily,
          [day]: { completed: false, goal: '', log: '', unplanned: '' }
        }
      }));
    }
  };

  const updateRetro = (field: keyof RetroEntry, value: string) => {
    setWeeklyData(prev => ({
      ...prev,
      retro: { ...prev.retro, [field]: value }
    }));
  };

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { summary, actions } = await summarizeWeek(weeklyData);
      setWeeklyData(prev => ({
        ...prev,
        retro: {
          ...prev.retro,
          summary,
          actions
        }
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggestDailyActions = async (day: DayOfWeek) => {
    const goal = weeklyData.daily[day].goal;
    if (!goal) return;
    const suggestions = await suggestActionItems(goal);
    if (suggestions.length > 0) {
      const currentLog = weeklyData.daily[day].log;
      // Fixed typo: removed space in variable name 'formattedSuggestions'
      const formattedSuggestions = suggestions.map(s => `• ${s}`).join('\n');
      updateDaily(day, 'log', currentLog ? `${currentLog}\n\nSuggested Actions:\n${formattedSuggestions}` : `Suggested Actions:\n${formattedSuggestions}`);
    }
  };

  const handleSuggestDailyGoal = async (day: DayOfWeek) => {
    const plannerGoal = weeklyData.planner[day].goal;
    if (!plannerGoal) return;
    const suggestedGoal = await suggestDailyGoal(plannerGoal);
    if (suggestedGoal) {
      updateDaily(day, 'goal', suggestedGoal);
    }
  };

  const handleSuggestPlannerActions = async (day: DayOfWeek) => {
    const goal = weeklyData.planner[day].goal;
    if (!goal) return;
    const suggestions = await suggestActionItems(goal);
    if (suggestions.length > 0) {
      const currentItems = weeklyData.planner[day].actionItems;
      const formattedSuggestions = suggestions.map(s => `• ${s}`).join('\n');
      updatePlanner(day, 'actionItems', currentItems ? `${currentItems}\n${formattedSuggestions}` : formattedSuggestions);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all entries for this week?')) {
      setWeeklyData(INITIAL_WEEKLY_DATA);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8 flex flex-col items-center transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="w-full max-w-7xl mb-6 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
              Dev Journal<span className="text-teal-500">.</span>
            </h1>
            
            {/* Simple Icon Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M22 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs md:text-sm uppercase tracking-[0.2em]">
            Weekly Systems Engineering Log
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : saveStatus === 'saved' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              {saveStatus === 'saving' ? 'Auto-saving...' : saveStatus === 'saved' ? 'Progress Persistent' : 'Local Storage Active'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 md:self-end">
          <button 
            onClick={handleClearAll}
            className="px-3 py-1.5 md:px-5 md:py-2 bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-black text-[10px] md:text-xs rounded uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            Purge Cache
          </button>
          <button 
            className="px-3 py-1.5 md:px-5 md:py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-[10px] md:text-xs rounded uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
            onClick={() => window.print()}
          >
            Export to PDF
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
        {/* Left Side: Weekly Planning */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200 dark:border-slate-800">
            <h2 className="font-black uppercase text-xs tracking-[0.3em] text-slate-400 dark:text-slate-500">Structure / Strategy</h2>
            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">INPUT AREA</span>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {DAYS.map((day) => (
              <PlannerCard 
                key={day} 
                day={day} 
                data={weeklyData.planner[day]}
                onChange={(f, v) => updatePlanner(day, f, v)}
                onSuggest={() => handleSuggestPlannerActions(day)}
                onClear={() => clearPlannerDay(day)}
              />
            ))}
          </div>
        </section>

        {/* Right Side: Daily Execution + Retro */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b-2 border-teal-200/50 dark:border-teal-900/30">
            <h2 className="font-black uppercase text-xs tracking-[0.3em] text-teal-600/70 dark:text-teal-400/50">Execution / Logs</h2>
            <span className="text-[10px] font-bold text-teal-500/50 dark:text-teal-400/30">REAL-TIME TRACKING</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DAYS.map((day) => (
              <DailyCard 
                key={day} 
                day={day} 
                data={weeklyData.daily[day]}
                onChange={(f, v) => updateDaily(day, f, v)}
                onSuggest={() => handleSuggestDailyActions(day)}
                onSuggestGoal={() => handleSuggestDailyGoal(day)}
                onClear={() => clearDailyDay(day)}
              />
            ))}
            <div className="sm:col-span-2 mt-4 md:mt-8">
               <div className="flex items-center justify-between pb-2 border-b-2 border-sky-200/50 dark:border-sky-900/30 mb-6">
                <h2 className="font-black uppercase text-xs tracking-[0.3em] text-sky-600/70 dark:text-sky-400/50">Post-Mortem / Retro</h2>
                <span className="text-[10px] font-bold text-sky-500/50 dark:text-sky-400/30">AI SYNTHESIS AVAILABLE</span>
              </div>
              <RetroCard 
                data={weeklyData.retro}
                onChange={updateRetro}
                onAnalyze={handleAIAnalyze}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full max-w-7xl mt-12 md:mt-24 py-10 border-t border-slate-200 dark:border-slate-800 text-center print:hidden">
        <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">
          Engineered by Gemini AI • React Infrastructure • Local Cache Powered
        </p>
      </footer>
    </div>
  );
};

export default App;
