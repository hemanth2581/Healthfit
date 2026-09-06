import { DietPreference, CuisinePreference, AllergyRestriction } from './health';

export type FoodCategory =
  | 'carbohydrates'
  | 'protein'
  | 'vegetables'
  | 'fruits'
  | 'nuts_seeds'
  | 'dairy_alternatives'
  | 'fats_oils'
  | 'beverages';

export type MealType =
  | 'breakfast'
  | 'morning_snack'
  | 'lunch'
  | 'evening_snack'
  | 'dinner'
  | 'bedtime_snack';

export interface FoodItem {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string; // 'g' | 'ml' | 'piece' | 'cup'
  calories: number; // kcal per serving
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  category: FoodCategory;
  dietTypes: DietPreference[];
  cuisines: CuisinePreference[];
  allergens: AllergyRestriction[];
  glycemicIndex?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface MealFoodPortion {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Meal {
  id?: string;
  mealType: MealType;
  mealName: string;
  timingHint?: string;
  foodItems: MealFoodPortion[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  instructions?: string;
}

export interface DayDietPlan {
  id?: string;
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  date?: string;
  meals: Meal[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterTargetMl: number;
  sleepTargetMinutes: number;
  workoutPlan?: DailyWorkout;
}

export interface DailyWorkout {
  title: string;
  focus: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  estimatedBurnCalories: number;
  exercises: {
    name: string;
    sets?: number;
    reps?: string;
    duration?: string;
    restSeconds?: number;
    notes?: string;
  }[];
  cooldown?: string;
}

export interface WeeklyPlan {
  days: DayDietPlan[];
  generatedAt: string;
  summary: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
    avgFiber: number;
  };
}
