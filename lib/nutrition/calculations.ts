import { Gender, Goal, ActivityLevel } from '@/types/user';
import { BMICalculation } from '@/types/health';

export function lbsToKg(lbs: number): number {
  return Math.round((lbs * 0.45359237) * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round((kg * 2.20462) * 10) / 10;
}

export function ftInToCm(feet: number, inches: number = 0): number {
  return Math.round((feet * 30.48 + inches * 2.54) * 10) / 10;
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Body Mass Index (BMI)
 */
export function calculateBMI(weightKg: number, heightCm: number): BMICalculation {
  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  let category: BMICalculation['category'] = 'Normal weight';
  let color = 'text-emerald-600';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-600';
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    color = 'text-emerald-600';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    color = 'text-orange-600';
  } else {
    category = 'Obese';
    color = 'text-rose-600';
  }

  const minHealthyWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    bmi,
    category,
    color,
    healthyWeightRange: {
      min: minHealthyWeight,
      max: maxHealthyWeight,
    },
  };
}

/**
 * Basal Metabolic Rate (BMR) - Mifflin-St Jeor
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender = 'male'
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    return Math.round(base + 5);
  } else if (gender === 'female') {
    return Math.round(base - 161);
  } else {
    return Math.round(base - 78);
  }
}

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  light: 1.375,
  moderately_active: 1.55,
  moderate: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
  extra_active: 1.9,
};

/**
 * Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel | string): number {
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * mult);
}

/**
 * Daily Calorie Target
 */
export function calculateDailyCalories(
  tdee: number,
  goal: Goal | string,
  gender: Gender = 'male'
): number {
  let target = tdee;

  if (goal === 'lose_weight' || goal === 'fat_loss') {
    const deficit = Math.min(Math.round(tdee * 0.18), 550); // safe 18% deficit
    target = tdee - deficit;
    const minSafeCalories = gender === 'female' ? 1200 : 1500;
    target = Math.max(target, minSafeCalories);
  } else if (goal === 'gain_weight' || goal === 'muscle_gain') {
    const surplus = Math.min(Math.round(tdee * 0.14), 450); // safe 14% surplus
    target = tdee + surplus;
  }

  return Math.round(target);
}

export const calculateTargetCalories = calculateDailyCalories;

/**
 * Protein, Carbs, Fat Targets
 */
export function calculateMacronutrients(
  dailyCalories: number,
  weightKg: number,
  goal: Goal | string = 'maintain_weight',
  activityLevel: ActivityLevel | string = 'moderately_active'
): {
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  fiberTarget: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
} {
  let proteinMultiplier = 1.4;
  if (goal === 'lose_weight' || goal === 'fat_loss') {
    proteinMultiplier = activityLevel === 'sedentary' ? 1.6 : 1.8;
  } else if (goal === 'gain_weight' || goal === 'muscle_gain') {
    proteinMultiplier = activityLevel === 'sedentary' ? 1.6 : 2.0;
  } else {
    proteinMultiplier = activityLevel === 'sedentary' ? 1.3 : 1.5;
  }

  const proteinTarget = Math.round(weightKg * proteinMultiplier);
  const proteinCalories = proteinTarget * 4;

  const fatCalories = Math.round(dailyCalories * 0.26);
  const minFat = Math.round(weightKg * 0.7);
  const fatTarget = Math.max(Math.round(fatCalories / 9), minFat);

  const remainingCalories = Math.max(0, dailyCalories - (proteinCalories + fatTarget * 9));
  const carbsTarget = Math.max(50, Math.round(remainingCalories / 4));
  const fiberTarget = Math.round((dailyCalories / 1000) * 14);

  return {
    proteinTarget,
    carbsTarget,
    fatTarget,
    fiberTarget,
    protein_g: proteinTarget,
    carbs_g: carbsTarget,
    fat_g: fatTarget,
    fiber_g: fiberTarget,
  };
}

export const calculateMacroTargets = calculateMacronutrients;

export function calculateProteinTarget(
  weightKg: number,
  goal: Goal | string = 'lose_weight',
  activityLevel: ActivityLevel | string = 'moderately_active'
): number {
  return calculateMacronutrients(2000, weightKg, goal, activityLevel).proteinTarget;
}

/**
 * Water Target (in ml)
 */
export function calculateWaterTarget(weightKg: number, activityLevel: ActivityLevel | string): number {
  const baseWater = weightKg * 35;
  const activityBonus: Record<string, number> = {
    sedentary: 0,
    lightly_active: 300,
    light: 300,
    moderately_active: 500,
    moderate: 500,
    very_active: 750,
    extremely_active: 1000,
    extra_active: 1000,
  };
  const bonus = activityBonus[activityLevel] ?? 300;
  const totalMl = baseWater + bonus;
  return Math.round(totalMl / 100) * 100;
}

export const calculateDailyWaterRequirement = calculateWaterTarget;

export function calculateSleepRecommendation(
  preferredBedtime: string = '23:00',
  preferredWakeTime: string = '07:00'
): {
  targetHours: number;
  recommendedBedtime: string;
  recommendedWakeTime: string;
  windDownSteps: { time: string; action: string }[];
} {
  const [bH, bM] = preferredBedtime.split(':').map(Number);
  const [wH, wM] = preferredWakeTime.split(':').map(Number);
  let totalMinutes = (wH * 60 + wM) - (bH * 60 + bM);
  if (totalMinutes <= 0) totalMinutes += 24 * 60;
  const targetHours = Math.round((totalMinutes / 60) * 10) / 10;

  return {
    targetHours: targetHours > 0 ? targetHours : 8.0,
    recommendedBedtime: preferredBedtime,
    recommendedWakeTime: preferredWakeTime,
    windDownSteps: [
      { time: '9:30 PM', action: 'Dim ambient lights & start winding down' },
      { time: '9:45 PM', action: 'Conclude eating; avoid heavy meals' },
      { time: '10:00 PM', action: 'Reduce blue light and screen exposure' },
      { time: '10:30 PM', action: 'Sleep in cool, quiet environment' },
    ],
  };
}

/**
 * Consolidated Health Targets Calculation
 */
export function calculateAllTargets(
  age: number,
  gender: Gender,
  heightCm: number,
  weightKg: number,
  goal: Goal | string,
  activityLevel: ActivityLevel | string
) {
  const bmiInfo = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const dailyCalories = calculateDailyCalories(tdee, goal, gender);
  const macros = calculateMacronutrients(dailyCalories, weightKg, goal, activityLevel);
  const waterTarget = calculateWaterTarget(weightKg, activityLevel);

  return {
    bmi: bmiInfo.bmi,
    bmiCategory: bmiInfo.category,
    bmr,
    tdee,
    dailyCalories,
    targetCalories: dailyCalories,
    proteinTarget: macros.proteinTarget,
    carbsTarget: macros.carbsTarget,
    carbohydrateTarget: macros.carbsTarget,
    fatTarget: macros.fatTarget,
    fiberTarget: macros.fiberTarget,
    waterTarget,
    waterTargetLitres: Math.round((waterTarget / 1000) * 10) / 10,
    sleepTargetMinutes: 480,
  };
}

export const calculateAllHealthMetrics = (
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Gender,
  activityLevel: ActivityLevel,
  goal: Goal
) => calculateAllTargets(age, sex, heightCm, weightKg, goal, activityLevel);

export function calculateAllMetrics(params: {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}) {
  const res = calculateAllTargets(
    params.age,
    params.gender,
    params.height,
    params.weight,
    params.goal,
    params.activityLevel
  );
  return {
    bmi: res.bmi,
    bmr: res.bmr,
    tdee: res.tdee,
    calorieTarget: res.dailyCalories,
    proteinTarget: res.proteinTarget,
    carbsTarget: res.carbsTarget,
    fatTarget: res.fatTarget,
    fiberTarget: res.fiberTarget,
    waterTarget: res.waterTarget,
  };
}
