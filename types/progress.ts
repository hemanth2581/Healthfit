import { Database } from './database';

export type DailyProgressRow = Database['public']['Tables']['daily_progress']['Row'];
export type DailyProgressInsert = Database['public']['Tables']['daily_progress']['Insert'];

export type SleepQuality = 'poor' | 'below_average' | 'average' | 'good' | 'excellent';

export interface DailyProgress {
  id?: string;
  user_id?: string;
  anonymous_user_id?: string;
  progress_date: string; // YYYY-MM-DD
  breakfast_completed: boolean;
  morning_snack_completed: boolean;
  lunch_completed: boolean;
  evening_snack_completed: boolean;
  dinner_completed: boolean;
  workout_completed: boolean;
  water_completed_ml: number;
  sleep_completed_minutes: number;
  completion_percentage: number;
  day_completed?: boolean;
  points_awarded?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WeightLog {
  id?: string;
  user_id?: string;
  anonymous_user_id?: string;
  weight_kg: number;
  logged_at: string;
  notes?: string;
}

export interface WaterLog {
  id?: string;
  user_id?: string;
  anonymous_user_id?: string;
  amount_ml: number;
  logged_at: string;
}

export interface SleepLog {
  id?: string;
  user_id?: string;
  anonymous_user_id?: string;
  sleep_start: string;
  sleep_end: string;
  duration_minutes: number;
  quality?: SleepQuality;
  quality_rating?: 1 | 2 | 3 | 4 | 5;
  logged_at: string;
  notes?: string;
}

export interface WorkoutLog {
  id?: string;
  user_id?: string;
  anonymous_user_id?: string;
  workout_title: string;
  duration_minutes: number;
  calories_burned: number;
  exercises_completed: string[];
  logged_at: string;
  notes?: string;
}

export interface ProgressSummary {
  todayProgress: DailyProgress;
  weeklyAdherence: {
    day: string;
    percentage: number;
    waterMl: number;
    sleepHours: number;
    caloriesAdherence: number;
    workoutDone?: boolean;
  }[];
  weightHistory: WeightLog[];
  waterHistory: { date: string; totalMl: number; targetMl: number }[];
  sleepHistory: { date: string; durationHours: number; targetHours: number }[];
  currentStreak: number;
  bestStreak: number;
  totalPoints: number;
}
