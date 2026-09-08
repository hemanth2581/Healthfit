import { Database } from './database';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'] & {
  target_weight?: number;
  cuisine?: string;
  points?: number;
  streak?: number;
};

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'] & {
  target_weight?: number;
  cuisine?: string;
  points?: number;
  streak?: number;
};

export type Gender = 'male' | 'female' | 'other';
export type Sex = Gender;

export type Goal =
  | 'lose_weight'
  | 'maintain_weight'
  | 'gain_weight'
  | 'fat_loss'
  | 'muscle_gain'
  | 'maintenance'
  | 'improve_fitness';

export type FitnessGoal = Goal;
export type GoalPace = 'conservative' | 'moderate' | 'aggressive';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active'
  | 'light'
  | 'moderate'
  | 'extra_active';

export type DietType =
  | 'vegetarian'
  | 'non_vegetarian'
  | 'vegan'
  | 'eggetarian'
  | 'keto'
  | 'mediterranean'
  | 'balanced';

export type DietPreference = DietType;

export type CuisinePreference =
  | 'south_indian'
  | 'north_indian'
  | 'indian'
  | 'continental'
  | 'mediterranean'
  | 'asian'
  | 'international'
  | 'mixed'
  | 'any';

export type AllergyRestriction =
  | 'dairy'
  | 'nuts'
  | 'peanuts'
  | 'gluten'
  | 'soy'
  | 'egg'
  | 'eggs'
  | 'seafood'
  | 'shellfish'
  | 'wheat'
  | 'other';

export type WorkoutPreference =
  | 'home'
  | 'gym'
  | 'outdoor'
  | 'bodyweight'
  | 'mixed';

export interface UserProfile {
  id?: string;
  user_id?: string;
  anonymous_user_id?: string;
  email?: string;
  full_name?: string;
  name?: string;
  avatar_url?: string;
  age: number;
  gender?: Gender | string;
  sex?: Gender | string;
  height?: number;
  height_cm?: number;
  height_unit?: 'cm' | 'ft';
  weight?: number;
  weight_kg?: number;
  weight_unit?: 'kg' | 'lbs';
  target_weight?: number;
  target_weight_kg?: number;
  goal?: Goal | string;
  goal_pace?: GoalPace | string;
  activity_level?: ActivityLevel | string;
  average_steps?: number;
  workout_frequency?: number;
  diet_type?: DietType | string;
  diet_preference?: DietType | string;
  cuisine?: string;
  cuisine_preference?: CuisinePreference | string;
  allergies?: string[];
  dietary_restrictions?: string[];
  workout_preference?: WorkoutPreference | string;
  points?: number;
  streak?: number;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingData {
  name?: string;
  full_name?: string;
  age: number;
  gender?: Gender | string;
  sex?: Gender | string;
  height: number;
  height_cm?: number;
  height_unit?: 'cm' | 'ft';
  weight: number;
  weight_kg?: number;
  weight_unit?: 'kg' | 'lbs';
  target_weight?: number;
  target_weight_kg?: number;
  goal: Goal | string;
  activity_level: ActivityLevel | string;
  diet_type?: DietType | string;
  diet_preference?: DietType | string;
  cuisine?: string;
  cuisine_preference?: CuisinePreference | string;
  allergies?: string[];
  dietary_restrictions?: string[];
  workout_preference?: WorkoutPreference | string;
}
