export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users_profiles: {
        Row: {
          id: string;
          anonymous_user_id: string;
          age: number | null;
          sex: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          activity_level: string | null;
          goal: string | null;
          diet_preference: string | null;
          cuisine_preference: string | null;
          dietary_restrictions: Json | null;
          workout_preference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          anonymous_user_id: string;
          age?: number | null;
          sex?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?: string | null;
          goal?: string | null;
          diet_preference?: string | null;
          cuisine_preference?: string | null;
          dietary_restrictions?: Json | null;
          workout_preference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          anonymous_user_id?: string;
          age?: number | null;
          sex?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?: string | null;
          goal?: string | null;
          diet_preference?: string | null;
          cuisine_preference?: string | null;
          dietary_restrictions?: Json | null;
          workout_preference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      health_metrics: {
        Row: {
          id: string;
          anonymous_user_id: string;
          weight_kg: number | null;
          height_cm: number | null;
          bmi: number | null;
          bmi_category: string | null;
          bmr: number | null;
          tdee: number | null;
          target_calories: number | null;
          protein_target_g: number | null;
          carbs_target_g: number | null;
          fat_target_g: number | null;
          fiber_target_g: number | null;
          water_target_ml: number | null;
          sleep_target_minutes: number | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          anonymous_user_id: string;
          weight_kg?: number | null;
          height_cm?: number | null;
          bmi?: number | null;
          bmi_category?: string | null;
          bmr?: number | null;
          tdee?: number | null;
          target_calories?: number | null;
          protein_target_g?: number | null;
          carbs_target_g?: number | null;
          fat_target_g?: number | null;
          fiber_target_g?: number | null;
          water_target_ml?: number | null;
          sleep_target_minutes?: number | null;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          anonymous_user_id?: string;
          weight_kg?: number | null;
          height_cm?: number | null;
          bmi?: number | null;
          bmi_category?: string | null;
          bmr?: number | null;
          tdee?: number | null;
          target_calories?: number | null;
          protein_target_g?: number | null;
          carbs_target_g?: number | null;
          fat_target_g?: number | null;
          fiber_target_g?: number | null;
          water_target_ml?: number | null;
          sleep_target_minutes?: number | null;
          recorded_at?: string;
        };
      };
      diet_plans: {
        Row: {
          id: string;
          anonymous_user_id: string;
          plan_date: string;
          day_name: string;
          total_calories: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          fiber_g: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          anonymous_user_id: string;
          plan_date: string;
          day_name: string;
          total_calories?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          anonymous_user_id?: string;
          plan_date?: string;
          day_name?: string;
          total_calories?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          created_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          diet_plan_id: string;
          meal_type: string | null;
          meal_name: string | null;
          food_items: Json | null;
          calories: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          fiber_g: number | null;
        };
        Insert: {
          id?: string;
          diet_plan_id: string;
          meal_type?: string | null;
          meal_name?: string | null;
          food_items?: Json | null;
          calories?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
        };
        Update: {
          id?: string;
          diet_plan_id?: string;
          meal_type?: string | null;
          meal_name?: string | null;
          food_items?: Json | null;
          calories?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
        };
      };
      daily_progress: {
        Row: {
          id: string;
          anonymous_user_id: string;
          progress_date: string;
          breakfast_completed: boolean;
          morning_snack_completed: boolean;
          lunch_completed: boolean;
          evening_snack_completed: boolean;
          dinner_completed: boolean;
          workout_completed: boolean;
          water_completed_ml: number;
          sleep_completed_minutes: number;
          completion_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          anonymous_user_id: string;
          progress_date: string;
          breakfast_completed?: boolean;
          morning_snack_completed?: boolean;
          lunch_completed?: boolean;
          evening_snack_completed?: boolean;
          dinner_completed?: boolean;
          workout_completed?: boolean;
          water_completed_ml?: number;
          sleep_completed_minutes?: number;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          anonymous_user_id?: string;
          progress_date?: string;
          breakfast_completed?: boolean;
          morning_snack_completed?: boolean;
          lunch_completed?: boolean;
          evening_snack_completed?: boolean;
          dinner_completed?: boolean;
          workout_completed?: boolean;
          water_completed_ml?: number;
          sleep_completed_minutes?: number;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      weight_logs: {
        Row: {
          id: string;
          anonymous_user_id: string;
          weight_kg: number;
          logged_at: string;
        };
        Insert: {
          id?: string;
          anonymous_user_id: string;
          weight_kg: number;
          logged_at?: string;
        };
        Update: {
          id?: string;
          anonymous_user_id?: string;
          weight_kg?: number;
          logged_at?: string;
        };
      };
    };
  };
}
