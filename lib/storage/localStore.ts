import { HealthCalculations, UserProfile } from '@/types/health';
import { WeeklyPlan } from '@/types/nutrition';
import { DailyProgress, SleepLog, WaterLog, WeightLog } from '@/types/progress';
import { getTodayDateString } from '../utils/dates';

const STORAGE_KEYS = {
  PROFILE: 'healthfit_profile',
  METRICS: 'healthfit_metrics',
  WEEKLY_PLAN: 'healthfit_weekly_plan',
  DAILY_PROGRESS: 'healthfit_daily_progress',
  WEIGHT_LOGS: 'healthfit_weight_logs',
  WATER_LOGS: 'healthfit_water_logs',
  SLEEP_LOGS: 'healthfit_sleep_logs',
};

function dispatchStorageEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('healthfit_storage'));
  }
}

export const localStore = {
  // Profile
  getProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error saving profile to localStorage', e);
    }
  },

  // Health Metrics
  getMetrics(): HealthCalculations | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.METRICS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setMetrics(metrics: HealthCalculations): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error saving metrics to localStorage', e);
    }
  },

  // Weekly Plan
  getWeeklyPlan(): WeeklyPlan | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setWeeklyPlan(plan: WeeklyPlan): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(plan));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error saving weekly plan to localStorage', e);
    }
  },

  // Daily Progress
  getTodayProgress(userId: string): DailyProgress {
    const todayStr = getTodayDateString();
    if (typeof window === 'undefined') {
      return {
        anonymous_user_id: userId,
        progress_date: todayStr,
        breakfast_completed: false,
        morning_snack_completed: false,
        lunch_completed: false,
        evening_snack_completed: false,
        dinner_completed: false,
        workout_completed: false,
        water_completed_ml: 0,
        sleep_completed_minutes: 0,
        completion_percentage: 0,
      };
    }

    try {
      const allProgressStr = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
      const allProgress: Record<string, DailyProgress> = allProgressStr ? JSON.parse(allProgressStr) : {};

      if (allProgress[todayStr]) {
        return allProgress[todayStr];
      }

      const initial: DailyProgress = {
        anonymous_user_id: userId,
        progress_date: todayStr,
        breakfast_completed: false,
        morning_snack_completed: false,
        lunch_completed: false,
        evening_snack_completed: false,
        dinner_completed: false,
        workout_completed: false,
        water_completed_ml: 0,
        sleep_completed_minutes: 0,
        completion_percentage: 0,
      };
      allProgress[todayStr] = initial;
      localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(allProgress));
      return initial;
    } catch {
      return {
        anonymous_user_id: userId,
        progress_date: todayStr,
        breakfast_completed: false,
        morning_snack_completed: false,
        lunch_completed: false,
        evening_snack_completed: false,
        dinner_completed: false,
        workout_completed: false,
        water_completed_ml: 0,
        sleep_completed_minutes: 0,
        completion_percentage: 0,
      };
    }
  },

  saveTodayProgress(progress: DailyProgress): void {
    if (typeof window === 'undefined') return;
    try {
      const allProgressStr = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
      const allProgress: Record<string, DailyProgress> = allProgressStr ? JSON.parse(allProgressStr) : {};
      
      let score = 0;
      if (progress.breakfast_completed) score += 1;
      if (progress.morning_snack_completed) score += 1;
      if (progress.lunch_completed) score += 1;
      if (progress.evening_snack_completed) score += 1;
      if (progress.dinner_completed) score += 1;
      if (progress.workout_completed) score += 1;
      if (progress.water_completed_ml >= 2000) score += 1;

      progress.completion_percentage = Math.round((score / 7) * 100);
      progress.updated_at = new Date().toISOString();

      allProgress[progress.progress_date] = progress;
      localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(allProgress));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error saving progress to localStorage', e);
    }
  },

  getAllProgress(): Record<string, DailyProgress> {
    if (typeof window === 'undefined') return {};
    try {
      const all = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
      return all ? JSON.parse(all) : {};
    } catch {
      return {};
    }
  },

  getProgressHistory(): DailyProgress[] {
    const all = this.getAllProgress();
    return Object.values(all);
  },

  // Weight Logs
  getWeightLogs(): WeightLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const logs = localStorage.getItem(STORAGE_KEYS.WEIGHT_LOGS);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },
  addWeightLog(log: WeightLog): void {
    if (typeof window === 'undefined') return;
    try {
      const logs = this.getWeightLogs();
      logs.unshift(log);
      localStorage.setItem(STORAGE_KEYS.WEIGHT_LOGS, JSON.stringify(logs));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error saving weight log', e);
    }
  },

  // Water Logs
  getWaterLogs(): WaterLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const logs = localStorage.getItem(STORAGE_KEYS.WATER_LOGS);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },
  addWaterLog(log: WaterLog): void {
    if (typeof window === 'undefined') return;
    try {
      const logs = this.getWaterLogs();
      logs.unshift(log);
      localStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(logs));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error saving water log', e);
    }
  },

  // Sleep Logs
  getSleepLogs(): SleepLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const logs = localStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },
  addSleepLog(log: SleepLog): void {
    if (typeof window === 'undefined') return;
    try {
      const logs = this.getSleepLogs();
      logs.unshift(log);
      localStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(logs));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error saving sleep log', e);
    }
  },

  // Clear / Reset all data
  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      dispatchStorageEvent();
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  },
};

export default localStore;
