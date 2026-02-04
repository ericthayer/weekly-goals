
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface PlannerEntry {
  date: string;
  goal: string;
  appointments: string;
  actionItems: string;
}

export interface DailyEntry {
  completed: boolean;
  goal: string;
  log: string;
  unplanned: string;
}

export interface RetroEntry {
  attempted: string;
  unplanned: string;
  summary: string;
  actions: string;
}

export interface WeeklyData {
  planner: Record<DayOfWeek, PlannerEntry>;
  daily: Record<DayOfWeek, DailyEntry>;
  retro: RetroEntry;
}
