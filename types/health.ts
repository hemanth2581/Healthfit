export type Sex = 'male' | 'female' | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type Goal =
  | 'lose_weight'
  | 'maintain_weight'
  | 'gain_weight'
  | 'improve_fitness';

export type GoalPace = 'conservative' | 'moderate' | 'aggressive';

export type DietPreference =
  | 'vegetarian'
  | 'non_vegetarian'
  | 'vegan'
  | 'eggetarian';

export type CuisinePreference =
  | 'south_indian'
  | 'north_indian'
  | 'indian'
  | 'international'
  | 'mixed';

export type AllergyRestriction =
  | 'dairy'
  | 'eggs'
  | 'nuts'
  | 'gluten'
  | 'seafood'
  | 'soy'
  | 'other';

export type WorkoutPreference =
  | 'home'
  | 'gym'
  | 'outdoor'
  | 'bodyweight'
  | 'mixed';

export interface UserProfile {
  id?: string;
  anonymous_user_id: string;
  age: number;
  sex: Sex;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  average_steps?: number;
  workout_frequency?: number;
  goal: Goal;
  goal_pace?: GoalPace;
  diet_preference: DietPreference;
  cuisine_preference: CuisinePreference;
  dietary_restrictions: AllergyRestriction[];
  workout_preference: WorkoutPreference;
  created_at?: string;
  updated_at?: string;
}

export interface BMICalculation {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  color: string;
  healthyWeightRange: {
    min: number;
    max: number;
  };
}

export interface HealthCalculations {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinTarget: number;
  carbohydrateTarget: number;
  fatTarget: number;
  fiberTarget: number;
  waterTarget: number; // in ml
  waterTargetLitres: number;
  sleepTargetMinutes: number;
}
