import { supabase, isSupabaseConfigured } from './client';
import { UserProfile, ProfileRow } from '@/types/user';
import { HealthCalculations, HealthTargetsRow } from '@/types/health';
import { WeeklyPlan } from '@/types/nutrition';
import { DailyProgress, WaterLog, SleepLog, WeightLog } from '@/types/progress';
import { calculateAllTargets } from '../nutrition/calculations';
import { generate7DayPlan } from '../nutrition/dietGenerator';
import { getAnonymousUserId, getClientUserId } from '../storage/anonymousUser';
import { localStore } from '../storage/localStore';
import { getTodayDateString } from '../utils/dates';

export async function getCurrentUserId(): Promise<string> {
  return getAnonymousUserId();
}

/**
 * 1. USER PROFILE OPERATIONS
 */
export async function getProfile(userId?: string): Promise<UserProfile | null> {
  const targetId = userId || getClientUserId();
  const cached = localStore.getProfile();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetId)
        .maybeSingle();

      if (!error && data) {
        const merged: UserProfile = {
          ...cached,
          ...(data as any),
          user_id: targetId,
        };
        localStore.setProfile(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Supabase getProfile error, falling back to local storage:', err);
    }
  }

  return cached;
}

export async function saveProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  const targetId = userId || getClientUserId();
  const existing = localStore.getProfile() || ({} as UserProfile);
  const updated: UserProfile = {
    ...existing,
    ...profile,
    user_id: targetId,
    updated_at: new Date().toISOString(),
  };

  localStore.setProfile(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').upsert(
        {
          id: updated.id || crypto.randomUUID(),
          user_id: targetId,
          age: updated.age,
          gender: updated.gender || updated.sex || 'male',
          height: updated.height || updated.height_cm || 170,
          height_unit: updated.height_unit || 'cm',
          weight: updated.weight || updated.weight_kg || 70,
          weight_unit: updated.weight_unit || 'kg',
          goal: updated.goal || 'lose_weight',
          activity_level: updated.activity_level || 'moderately_active',
          diet_type: updated.diet_type || updated.diet_preference || 'vegetarian',
          allergies: (updated.allergies || updated.dietary_restrictions || []) as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } catch (err) {
      console.warn('Supabase saveProfile error:', err);
    }
  }

  return updated;
}

export const updateProfile = saveProfile;
export const updateUserProfile = saveProfile;

export async function exportAllUserData(userId?: string) {
  const targetId = userId || getClientUserId();
  const [profile, metrics, weeklyPlan, todayProgress, waterLogs, sleepLogs, weightLogs] = await Promise.all([
    getProfile(targetId),
    getHealthMetrics(targetId),
    getWeeklyPlan(targetId),
    getDailyProgress(targetId),
    getWaterLogs(targetId),
    getSleepLogs(targetId),
    getWeightHistory(targetId),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    userId: targetId,
    profile,
    metrics,
    weeklyPlan,
    todayProgress,
    waterLogs,
    sleepLogs,
    weightLogs,
  };
}

/**
 * 2. HEALTH METRICS OPERATIONS
 */
export async function getHealthMetrics(userId?: string): Promise<HealthCalculations | null> {
  const targetId = userId || getClientUserId();
  const cached = localStore.getMetrics();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('health_targets')
        .select('*')
        .eq('user_id', targetId)
        .maybeSingle();

      if (!error && data) {
        const d = data as any;
        const metrics: HealthCalculations = {
          bmi: d.bmi,
          bmiCategory: d.bmi < 18.5 ? 'Underweight' : d.bmi < 25 ? 'Normal weight' : d.bmi < 30 ? 'Overweight' : 'Obese',
          bmr: d.bmr,
          tdee: d.tdee,
          targetCalories: d.daily_calories || d.target_calories,
          proteinTarget: d.protein_target || d.protein_target_g,
          carbohydrateTarget: d.carbs_target || d.carbs_target_g || Math.round((d.daily_calories * 0.5) / 4),
          fatTarget: d.fat_target || d.fat_target_g || Math.round((d.daily_calories * 0.25) / 9),
          fiberTarget: 30,
          waterTarget: d.water_target || 2500,
          waterTargetLitres: Math.round(((d.water_target || 2500) / 1000) * 10) / 10,
          sleepTargetMinutes: 480,
        };
        localStore.setMetrics(metrics);
        return metrics;
      }
    } catch (err) {
      console.warn('Supabase getHealthMetrics error:', err);
    }
  }

  return cached;
}

export async function saveHealthMetrics(userId: string, metrics: HealthCalculations): Promise<void> {
  const targetId = userId || getClientUserId();
  localStore.setMetrics(metrics);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('health_targets').upsert(
        {
          id: crypto.randomUUID(),
          user_id: targetId,
          bmi: metrics.bmi,
          bmr: metrics.bmr,
          tdee: metrics.tdee,
          daily_calories: metrics.targetCalories,
          protein_target: metrics.proteinTarget,
          carbs_target: metrics.carbohydrateTarget,
          fat_target: metrics.fatTarget,
          water_target: metrics.waterTarget,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } catch (err) {
      console.warn('Supabase saveHealthMetrics error:', err);
    }
  }
}

/**
 * 3. DAILY PROGRESS OPERATIONS
 */
export async function getDailyProgress(userId?: string, date?: string): Promise<DailyProgress> {
  const targetId = userId || getClientUserId();
  const dateStr = date || getTodayDateString();
  const cached = localStore.getTodayProgress(targetId);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', targetId)
        .eq('progress_date', dateStr)
        .maybeSingle();

      if (!error && data) {
        const row = data as any;
        const progress: DailyProgress = {
          id: row.id,
          user_id: targetId,
          anonymous_user_id: targetId,
          progress_date: dateStr,
          breakfast_completed: row.breakfast_completed || false,
          morning_snack_completed: row.morning_snack_completed || false,
          lunch_completed: row.lunch_completed || false,
          evening_snack_completed: row.evening_snack_completed || false,
          dinner_completed: row.dinner_completed || false,
          workout_completed: row.workout_completed || false,
          water_completed_ml: row.water_completed_ml || 0,
          sleep_completed_minutes: row.sleep_completed_minutes || 0,
          completion_percentage: row.completion_percentage || 0,
          day_completed: row.day_completed || false,
          points_awarded: row.points_awarded || 0,
        };
        localStore.saveTodayProgress(progress);
        return progress;
      }
    } catch (err) {
      console.warn('Supabase getDailyProgress error:', err);
    }
  }

  return cached;
}

export async function saveDailyProgress(userId: string, progress: DailyProgress): Promise<void> {
  const targetId = userId || getClientUserId();
  localStore.saveTodayProgress(progress);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('daily_progress').upsert(
        {
          id: progress.id || crypto.randomUUID(),
          user_id: targetId,
          progress_date: progress.progress_date,
          breakfast_completed: progress.breakfast_completed,
          morning_snack_completed: progress.morning_snack_completed,
          lunch_completed: progress.lunch_completed,
          evening_snack_completed: progress.evening_snack_completed,
          dinner_completed: progress.dinner_completed,
          workout_completed: progress.workout_completed,
          water_completed_ml: progress.water_completed_ml,
          sleep_completed_minutes: progress.sleep_completed_minutes,
          completion_percentage: progress.completion_percentage,
          day_completed: Boolean(progress.day_completed),
          points_earned: progress.points_awarded || 0,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: 'user_id,progress_date' }
      );
    } catch (err) {
      console.warn('Supabase saveDailyProgress error:', err);
    }
  }
}

export const syncDailyProgressToSupabase = async (
  userId: string,
  progress: Partial<DailyProgress & { points_earned?: number }>
): Promise<void> => {
  const targetId = userId || getClientUserId();
  const dateStr = progress.progress_date || getTodayDateString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('daily_progress').upsert(
        {
          user_id: targetId,
          progress_date: dateStr,
          breakfast_completed: progress.breakfast_completed ?? false,
          morning_snack_completed: progress.morning_snack_completed ?? false,
          lunch_completed: progress.lunch_completed ?? false,
          evening_snack_completed: progress.evening_snack_completed ?? false,
          dinner_completed: progress.dinner_completed ?? false,
          workout_completed: progress.workout_completed ?? false,
          water_completed_ml: progress.water_completed_ml ?? 0,
          sleep_completed_minutes: progress.sleep_completed_minutes ?? 0,
          completion_percentage: progress.completion_percentage ?? 0,
          day_completed: Boolean(progress.day_completed),
          points_earned: progress.points_earned ?? progress.points_awarded ?? 0,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: 'user_id,progress_date' }
      );
    } catch (err) {
      console.warn('Supabase syncDailyProgressToSupabase error:', err);
    }
  }
};

/**
 * 4. WEEKLY PLAN OPERATIONS
 */
export async function getWeeklyPlan(_userId?: string): Promise<WeeklyPlan | null> {
  return localStore.getWeeklyPlan();
}

export async function saveWeeklyPlan(_userId: string, plan: WeeklyPlan): Promise<void> {
  localStore.setWeeklyPlan(plan);
}

/**
 * 5. LOGGING OPERATIONS (WATER, SLEEP, WEIGHT)
 */
export async function getWaterLogs(_userId?: string): Promise<WaterLog[]> {
  return localStore.getWaterLogs();
}

export async function saveWaterLog(_userId: string, log: WaterLog): Promise<void> {
  localStore.addWaterLog(log);
}

export async function getSleepLogs(_userId?: string): Promise<SleepLog[]> {
  return localStore.getSleepLogs();
}

export async function saveSleepLog(_userId: string, log: SleepLog): Promise<void> {
  localStore.addSleepLog(log);
}

export async function getWeightHistory(_userId?: string): Promise<WeightLog[]> {
  return localStore.getWeightLogs();
}

export async function saveWeight(_userId: string, log: WeightLog): Promise<void> {
  localStore.addWeightLog(log);
}

export async function getWorkoutProgress(userId?: string): Promise<boolean> {
  const targetId = userId || getClientUserId();
  const prog = localStore.getTodayProgress(targetId);
  return Boolean(prog.workout_completed);
}

/**
 * 6. USER DATA RESET
 */
export async function resetUserData(userId?: string): Promise<void> {
  const targetId = userId || getClientUserId();
  localStore.clearAll();

  if (isSupabaseConfigured && supabase) {
    try {
      await Promise.allSettled([
        supabase.from('profiles').delete().eq('user_id', targetId),
        supabase.from('health_targets').delete().eq('user_id', targetId),
        supabase.from('daily_progress').delete().eq('user_id', targetId),
        supabase.from('diet_plans').delete().eq('user_id', targetId),
        supabase.from('daily_tasks').delete().eq('user_id', targetId),
      ]);
    } catch (err) {
      console.warn('Supabase resetUserData error:', err);
    }
  }
}

/**
 * 7. ONBOARDING ORCHESTRATION
 */
export async function saveProfileAndTargets(
  userId: string,
  onboarding: any
): Promise<{ profile: ProfileRow; targets: HealthTargetsRow }> {
  const targetId = userId || getClientUserId();

  const heightCm =
    onboarding.height_unit === 'ft'
      ? Math.round(onboarding.height * 30.48)
      : onboarding.height || onboarding.height_cm || 170;

  const weightKg =
    onboarding.weight_unit === 'lbs'
      ? Math.round(onboarding.weight * 0.453592)
      : onboarding.weight || onboarding.weight_kg || 70;

  const computed = calculateAllTargets(
    onboarding.age || 25,
    onboarding.gender || onboarding.sex || 'male',
    heightCm,
    weightKg,
    onboarding.goal || 'lose_weight',
    onboarding.activity_level || 'moderately_active'
  );

  const profileData: any = {
    id: crypto.randomUUID(),
    user_id: targetId,
    age: onboarding.age || 25,
    gender: onboarding.gender || onboarding.sex || 'male',
    height: onboarding.height || heightCm,
    height_unit: onboarding.height_unit || 'cm',
    weight: onboarding.weight || weightKg,
    weight_unit: onboarding.weight_unit || 'kg',
    goal: onboarding.goal || 'lose_weight',
    activity_level: onboarding.activity_level || 'moderately_active',
    diet_type: onboarding.diet_type || onboarding.diet_preference || 'vegetarian',
    allergies: (onboarding.allergies || onboarding.dietary_restrictions || []) as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const targetsData: any = {
    id: crypto.randomUUID(),
    user_id: targetId,
    bmi: computed.bmi,
    bmr: computed.bmr,
    tdee: computed.tdee,
    daily_calories: computed.dailyCalories,
    protein_target: computed.proteinTarget,
    carbs_target: computed.carbsTarget,
    fat_target: computed.fatTarget,
    water_target: computed.waterTarget,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localStore.setProfile(profileData);
  localStore.setMetrics(computed);

  if (isSupabaseConfigured && supabase) {
    try {
      await Promise.all([
        supabase.from('profiles').upsert(profileData, { onConflict: 'user_id' }),
        supabase.from('health_targets').upsert(targetsData, { onConflict: 'user_id' }),
      ]);
    } catch (err) {
      console.warn('Supabase save profile error:', err);
    }
  }

  return { profile: profileData, targets: targetsData };
}

export async function createAndSave7DayPlan(
  _userId: string,
  targets: any,
  profile: any
): Promise<any[]> {
  const generated = generate7DayPlan({
    targetCalories: targets.daily_calories || targets.targetCalories || 2000,
    proteinTarget: targets.protein_target || targets.proteinTarget || 120,
    dietType: (profile.diet_type || profile.diet_preference || 'vegetarian') as any,
    allergies: (profile.allergies as string[]) || [],
    startDate: new Date(),
  });

  const weeklyPlanObj: WeeklyPlan = {
    generatedAt: new Date().toISOString(),
    days: generated.map((day) => ({
      dayName: day.dayName as any,
      date: day.date,
      totalCalories: day.totalCalories,
      protein: day.totalProtein,
      carbs: day.totalCarbs,
      fat: day.totalFat,
      fiber: 28,
      waterTargetMl: targets.water_target || targets.waterTarget || 2500,
      sleepTargetMinutes: 480,
      meals: day.meals.map((m) => ({
        mealType: m.meal_type,
        mealName: m.title,
        totalCalories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        fiber: 5,
        foodItems: m.items.map((it) => ({
          foodId: it.food_name.toLowerCase().replace(/\s+/g, '_'),
          name: it.food_name,
          quantity: it.quantity,
          unit: it.unit,
          calories: Math.round(m.calories / (m.items.length || 1)),
          protein: Math.round((m.protein / (m.items.length || 1)) * 10) / 10,
          carbs: Math.round((m.carbs / (m.items.length || 1)) * 10) / 10,
          fat: Math.round((m.fat / (m.items.length || 1)) * 10) / 10,
          fiber: 2,
        })),
      })),
    })),
    summary: {
      avgCalories: targets.daily_calories || targets.targetCalories || 2000,
      avgProtein: targets.protein_target || targets.proteinTarget || 120,
      avgCarbs: targets.carbs_target || targets.carbohydrateTarget || 220,
      avgFat: targets.fat_target || targets.fatTarget || 60,
      avgFiber: 28,
    },
  };

  localStore.setWeeklyPlan(weeklyPlanObj);
  return generated;
}

export async function fetchUserProfile(userId: string) {
  const [profile, targets] = await Promise.all([getProfile(userId), getHealthMetrics(userId)]);
  return { profile: profile as any, targets: targets as any };
}

export async function fetch7DayPlan(userId: string) {
  const plan = await getWeeklyPlan(userId);
  return plan ? plan.days : [];
}
