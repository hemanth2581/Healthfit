import { Database } from './database';
export type {
  UserProfile,
  Gender,
  Sex,
  Goal,
  FitnessGoal,
  GoalPace,
  ActivityLevel,
  DietType,
  DietPreference,
  CuisinePreference,
  AllergyRestriction,
  WorkoutPreference,
  OnboardingData,
} from './user';

export type HealthTargetsRow = Database['public']['Tables']['health_targets']['Row'];
export type HealthTargetsInsert = Database['public']['Tables']['health_targets']['Insert'];

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
  recommendedBedtime?: string;
  recommendedWakeTime?: string;
}
