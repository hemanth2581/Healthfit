export interface DailyProgress {
  id?: string;
  anonymous_user_id: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface WeightLog {
  id?: string;
  anonymous_user_id: string;
  weight_kg: number;
  logged_at: string;
  notes?: string;
}

export interface WaterLog {
  id?: string;
  anonymous_user_id: string;
  amount_ml: number;
  logged_at: string;
}

export interface SleepLog {
  id?: string;
  anonymous_user_id: string;
  sleep_start: string;
  sleep_end: string;
  duration_minutes: number;
  quality_rating?: 1 | 2 | 3 | 4 | 5;
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
  }[];
  weightHistory: WeightLog[];
  waterHistory: { date: string; totalMl: number; targetMl: number }[];
  sleepHistory: { date: string; durationHours: number; targetHours: number }[];
  currentStreak: number;
  bestStreak: number;
}
