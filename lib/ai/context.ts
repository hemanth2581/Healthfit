import { UserProfile, HealthCalculations } from '@/types/health';
import { WeeklyPlan, DayDietPlan } from '@/types/nutrition';
import { DailyProgress } from '@/types/progress';

export interface HealthFitChatContext {
  profile?: {
    age?: number;
    sex?: string;
    height_cm?: number;
    weight_kg?: number;
    activity_level?: string;
    goal?: string;
    goal_pace?: string;
    diet_preference?: string;
    cuisine_preference?: string;
    dietary_restrictions?: string[];
    workout_preference?: string;
  } | null;
  todayProgress?: any;
  metrics?: {
    bmi?: number;
    bmiCategory?: string;
    bmr?: number;
    tdee?: number;
    targetCalories?: number;
    proteinTarget?: number;
    carbsTarget?: number;
    fatTarget?: number;
    fiberTarget?: number;
    waterTarget?: number;
    sleepTargetMinutes?: number;
  } | null;
  today?: {
    dayName?: string;
    totalPlannedCalories?: number;
    waterTargetMl?: number;
    waterCompletedMl?: number;
    sleepTargetMinutes?: number;
    sleepCompletedMinutes?: number;
    workoutTitle?: string;
    workoutDurationMinutes?: number;
    workoutCompleted?: boolean;
    meals?: {
      mealType: string;
      mealName: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      completed: boolean;
      foods: {
        name: string;
        quantity: number;
        unit: string;
        calories: number;
        protein: number;
      }[];
    }[];
  } | null;
  weeklyOverview?: {
    avgCalories?: number;
    avgProtein?: number;
    totalDays?: number;
  } | null;
}

export type UserContext = HealthFitChatContext;

/**
 * Builds a structured sanitized context object from application state
 */
export function buildSanitizedAiContext(
  profile: UserProfile | null,
  metrics: HealthCalculations | null,
  weeklyPlan: WeeklyPlan | null,
  progress: DailyProgress | null,
  todayPlan?: DayDietPlan | null
): HealthFitChatContext {
  const context: HealthFitChatContext = {};

  if (profile) {
    context.profile = {
      age: profile.age,
      sex: profile.sex,
      height_cm: profile.height_cm,
      weight_kg: profile.weight_kg,
      activity_level: profile.activity_level,
      goal: profile.goal,
      goal_pace: profile.goal_pace,
      diet_preference: profile.diet_preference,
      cuisine_preference: profile.cuisine_preference,
      dietary_restrictions: profile.dietary_restrictions || [],
      workout_preference: profile.workout_preference,
    };
  }

  if (metrics) {
    context.metrics = {
      bmi: metrics.bmi,
      bmiCategory: metrics.bmiCategory,
      bmr: metrics.bmr,
      tdee: metrics.tdee,
      targetCalories: metrics.targetCalories,
      proteinTarget: metrics.proteinTarget,
      carbsTarget: metrics.carbohydrateTarget,
      fatTarget: metrics.fatTarget,
      fiberTarget: metrics.fiberTarget,
      waterTarget: metrics.waterTarget,
      sleepTargetMinutes: metrics.sleepTargetMinutes,
    };
  }

  if (todayPlan) {
    context.today = {
      dayName: todayPlan.dayName,
      totalPlannedCalories: todayPlan.totalCalories,
      waterTargetMl: todayPlan.waterTargetMl,
      waterCompletedMl: progress?.water_completed_ml || 0,
      sleepTargetMinutes: todayPlan.sleepTargetMinutes,
      sleepCompletedMinutes: progress?.sleep_completed_minutes || 0,
      workoutTitle: todayPlan.workoutPlan?.title,
      workoutDurationMinutes: todayPlan.workoutPlan?.durationMinutes,
      workoutCompleted: Boolean(progress?.workout_completed),
      meals: todayPlan.meals.map((m) => {
        const key = `${m.mealType}_completed` as keyof DailyProgress;
        const isCompleted = progress ? Boolean(progress[key]) : false;
        return {
          mealType: m.mealType,
          mealName: m.mealName,
          calories: m.totalCalories,
          protein: m.protein,
          carbs: m.carbs,
          fat: m.fat,
          completed: isCompleted,
          foods: m.foodItems.map((f) => ({
            name: f.name,
            quantity: f.quantity,
            unit: f.unit,
            calories: f.calories,
            protein: f.protein,
          })),
        };
      }),
    };
  }

  if (weeklyPlan) {
    context.weeklyOverview = {
      avgCalories: weeklyPlan.summary.avgCalories,
      avgProtein: weeklyPlan.summary.avgProtein,
      totalDays: weeklyPlan.days.length,
    };
  }

  return context;
}

/**
 * Formats the context object into a concise markdown context block for the LLM
 */
export function formatContextForPrompt(ctx: HealthFitChatContext): string {
  if (!ctx.profile && !ctx.metrics && !ctx.today) {
    return 'User has not created a personalized health profile yet. Guide them to onboarding if they ask about personalized targets.';
  }

  const parts: string[] = [];

  if (ctx.profile) {
    const p = ctx.profile;
    parts.push(`### USER PROFILE
• Physical: ${p.age || 'N/A'} yrs old, ${p.sex || 'N/A'}, ${p.weight_kg || 'N/A'} kg, ${p.height_cm || 'N/A'} cm
• Activity: ${(p.activity_level || 'N/A').replace('_', ' ')}
• Primary Goal: ${(p.goal || 'N/A').replace('_', ' ')} (Pace: ${p.goal_pace || 'standard'})
• Diet: ${p.diet_preference || 'Standard'} | Cuisine: ${p.cuisine_preference || 'Global'}
• Allergies/Exclusions: ${p.dietary_restrictions && p.dietary_restrictions.length > 0 ? p.dietary_restrictions.join(', ') : 'None'}`);
  }

  if (ctx.metrics) {
    const m = ctx.metrics;
    parts.push(`### CALCULATED TARGETS (HEALTHFIT GROUND TRUTH)
• BMI: ${m.bmi} (${m.bmiCategory})
• BMR: ${m.bmr} kcal | TDEE: ${m.tdee} kcal
• Target Calories: ${m.targetCalories} kcal/day
• Daily Macros: Protein: ${m.proteinTarget}g, Carbs: ${m.carbsTarget}g, Fat: ${m.fatTarget}g, Fiber: ${m.fiberTarget}g
• Hydration Target: ${m.waterTarget} mL/day
• Sleep Target: ${m.sleepTargetMinutes} minutes (${Math.round((m.sleepTargetMinutes || 480) / 60)} hours)/night`);
  }

  if (ctx.today) {
    const t = ctx.today;
    const mealsStr = (t.meals || [])
      .map((m) => {
        const foodList = m.foods.map((f) => `${f.name} (${f.quantity} ${f.unit})`).join(', ');
        const status = m.completed ? '✅ Completed' : '⏳ Pending';
        return `  - **${m.mealType.toUpperCase()}**: ${m.mealName} [${m.calories} kcal, ${m.protein}g protein] (${status})\n    Ingredients: ${foodList}`;
      })
      .join('\n');

    parts.push(`### TODAY'S ACTIVE PLAN (${t.dayName || 'Today'})
• Meals Scheduled (${t.totalPlannedCalories} kcal total):
${mealsStr}
• Hydration Progress: ${t.waterCompletedMl} / ${t.waterTargetMl} mL logged
• Sleep Logged: ${t.sleepCompletedMinutes} / ${t.sleepTargetMinutes} mins
• Workout: ${t.workoutTitle || 'Rest Day'} (${t.workoutDurationMinutes || 0} mins) — ${t.workoutCompleted ? '✅ Finished' : '⏳ Not done yet'}`);
  }

  return parts.join('\n\n');
}
