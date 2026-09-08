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
      profiles: {
        Row: {
          id: string;
          user_id: string;
          age: number;
          gender: string;
          height: number;
          height_unit: string;
          weight: number;
          weight_unit: string;
          goal: string;
          activity_level: string;
          diet_type: string;
          allergies: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age: number;
          gender: string;
          height: number;
          height_unit?: string;
          weight: number;
          weight_unit?: string;
          goal: string;
          activity_level: string;
          diet_type: string;
          allergies?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age?: number;
          gender?: string;
          height?: number;
          height_unit?: string;
          weight?: number;
          weight_unit?: string;
          goal?: string;
          activity_level?: string;
          diet_type?: string;
          allergies?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      health_targets: {
        Row: {
          id: string;
          user_id: string;
          bmi: number;
          bmr: number;
          tdee: number;
          daily_calories: number;
          protein_target: number;
          carbs_target: number;
          fat_target: number;
          water_target: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bmi: number;
          bmr: number;
          tdee: number;
          daily_calories: number;
          protein_target: number;
          carbs_target: number;
          fat_target: number;
          water_target: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bmi?: number;
          bmr?: number;
          tdee?: number;
          daily_calories?: number;
          protein_target?: number;
          carbs_target?: number;
          fat_target?: number;
          water_target?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      diet_plans: {
        Row: {
          id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_date: string;
          end_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          diet_plan_id: string;
          day_date: string;
          meal_type: string;
          meal_time: string;
          title: string;
          description: string | null;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          diet_plan_id: string;
          day_date: string;
          meal_type: string;
          meal_time: string;
          title: string;
          description?: string | null;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          diet_plan_id?: string;
          day_date?: string;
          meal_type?: string;
          meal_time?: string;
          title?: string;
          description?: string | null;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      meal_items: {
        Row: {
          id: string;
          meal_id: string;
          food_name: string;
          quantity: number;
          unit: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_id: string;
          food_name: string;
          quantity: number;
          unit?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_id?: string;
          food_name?: string;
          quantity?: number;
          unit?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      daily_tasks: {
        Row: {
          id: string;
          user_id: string;
          task_date: string;
          task_type: string;
          title: string;
          description: string | null;
          scheduled_time: string | null;
          points: number;
          required: boolean;
          completed: boolean;
          completed_at: string | null;
          meal_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_date: string;
          task_type: string;
          title: string;
          description?: string | null;
          scheduled_time?: string | null;
          points?: number;
          required?: boolean;
          completed?: boolean;
          completed_at?: string | null;
          meal_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_date?: string;
          task_type?: string;
          title?: string;
          description?: string | null;
          scheduled_time?: string | null;
          points?: number;
          required?: boolean;
          completed?: boolean;
          completed_at?: string | null;
          meal_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      daily_progress: {
        Row: {
          id: string;
          user_id: string;
          progress_date: string;
          total_tasks: number;
          completed_tasks: number;
          points_earned: number;
          water_intake: number;
          water_target: number;
          day_completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          progress_date: string;
          total_tasks?: number;
          completed_tasks?: number;
          points_earned?: number;
          water_intake?: number;
          water_target?: number;
          day_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          progress_date?: string;
          total_tasks?: number;
          completed_tasks?: number;
          points_earned?: number;
          water_intake?: number;
          water_target?: number;
          day_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_completed_date: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed_date?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
