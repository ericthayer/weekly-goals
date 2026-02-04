
import { WeeklyData, DayOfWeek } from './types';

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const INITIAL_WEEKLY_DATA: WeeklyData = {
  planner: DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { date: '', goal: '', appointments: '', actionItems: '' }
  }), {} as Record<DayOfWeek, any>),
  daily: DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { completed: false, goal: '', log: '', unplanned: '' }
  }), {} as Record<DayOfWeek, any>),
  retro: {
    attempted: '',
    unplanned: '',
    summary: '',
    actions: ''
  }
};
