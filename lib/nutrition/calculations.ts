import { ActivityLevel, BMICalculation, Goal, GoalPace, HealthCalculations, Sex } from '@/types/health';

/**
 * Calculate Body Mass Index (BMI) and categorization.
 * BMI = weight (kg) / (height (m))^2
 */
export function calculateBMI(weightKg: number, heightCm: number): BMICalculation {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let category: BMICalculation['category'] = 'Normal weight';
  let color = 'text-emerald-500';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-500';
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    color = 'text-emerald-500';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    color = 'text-orange-500';
  } else {
    category = 'Obese';
    color = 'text-rose-500';
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
 * Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula:
 * Male: 10 * W + 6.25 * H - 5 * A + 5
 * Female: 10 * W + 6.25 * H - 5 * A - 161
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') {
    return Math.round(base + 5);
  } else if (sex === 'female') {
    return Math.round(base - 161);
  } else {
    // Non-binary/other: midpoint approximation
    return Math.round(base - 78);
  }
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE).
 * TDEE = BMR * Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate safe target calories based on TDEE, goal, and pace.
 */
export function calculateTargetCalories(
  tdee: number,
  goal: Goal,
  sex: Sex = 'male',
  pace: GoalPace = 'moderate'
): number {
  let target = tdee;

  if (goal === 'lose_weight') {
    const deficitPercentage = pace === 'conservative' ? 0.12 : pace === 'aggressive' ? 0.22 : 0.18;
    const rawDeficit = Math.round(tdee * deficitPercentage);
    const deficit = Math.min(rawDeficit, 600); // safety cap
    target = tdee - deficit;

    // Minimum safe intake floors
    const minSafeCalories = sex === 'female' ? 1200 : 1500;
    target = Math.max(target, minSafeCalories);
  } else if (goal === 'gain_weight') {
    const surplusPercentage = pace === 'conservative' ? 0.1 : pace === 'aggressive' ? 0.18 : 0.14;
    const surplus = Math.min(Math.round(tdee * surplusPercentage), 500);
    target = tdee + surplus;
  } else if (goal === 'improve_fitness') {
    // Body recomposition (slight deficit or maintenance)
    target = Math.round(tdee * 0.97);
  }

  return Math.round(target);
}

/**
 * Calculate protein target in grams.
 */
export function calculateProteinTarget(
  weightKg: number,
  goal: Goal,
  activityLevel: ActivityLevel
): number {
  let multiplier = 1.4;

  if (goal === 'lose_weight') {
    // Higher protein to spare lean muscle mass during a calorie deficit
    multiplier = activityLevel === 'sedentary' ? 1.5 : 1.8;
  } else if (goal === 'gain_weight') {
    // Muscle synthesis support
    multiplier = activityLevel === 'sedentary' ? 1.6 : 2.0;
  } else if (goal === 'improve_fitness') {
    multiplier = 1.7;
  } else {
    // Maintenance
    multiplier = activityLevel === 'sedentary' ? 1.2 : 1.5;
  }

  return Math.round(weightKg * multiplier);
}

/**
 * Calculate complete daily macronutrient breakdown.
 */
export function calculateMacroTargets(
  targetCalories: number,
  weightKg: number,
  goal: Goal,
  activityLevel: ActivityLevel
): {
  proteinTarget: number;
  carbohydrateTarget: number;
  fatTarget: number;
  fiberTarget: number;
} {
  const proteinTarget = calculateProteinTarget(weightKg, goal, activityLevel);
  const proteinCalories = proteinTarget * 4;

  // Fat target: 25-30% of total calories (minimum 0.7g per kg)
  const fatCaloriesTarget = Math.round(targetCalories * 0.26);
  const rawFat = Math.round(fatCaloriesTarget / 9);
  const minFat = Math.round(weightKg * 0.7);
  const fatTarget = Math.max(rawFat, minFat);
  const fatCalories = fatTarget * 9;

  // Carbs target: remaining calories / 4
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbohydrateTarget = Math.max(50, Math.round(remainingCalories / 4));

  // Fiber target: 14g per 1000 kcal
  const fiberTarget = Math.round((targetCalories / 1000) * 14);

  return {
    proteinTarget,
    carbohydrateTarget,
    fatTarget,
    fiberTarget,
  };
}

/**
 * Calculate recommended daily water intake in ml.
 */
export function calculateWaterTarget(weightKg: number, activityLevel: ActivityLevel): number {
  // Baseline: 35ml per kg body weight
  const baseWater = weightKg * 35;
  const activityBonus: Record<ActivityLevel, number> = {
    sedentary: 0,
    lightly_active: 300,
    moderately_active: 500,
    very_active: 750,
    extremely_active: 1000,
  };

  const totalMl = baseWater + (activityBonus[activityLevel] ?? 300);
  // Round to nearest 100ml
  return Math.round(totalMl / 100) * 100;
}

/**
 * Generate full health calculations object.
 */
export function calculateAllHealthMetrics(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
  activityLevel: ActivityLevel,
  goal: Goal,
  goalPace: GoalPace = 'moderate'
): HealthCalculations {
  const bmiInfo = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(weightKg, heightCm, age, sex);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal, sex, goalPace);
  const macros = calculateMacroTargets(targetCalories, weightKg, goal, activityLevel);
  const waterTarget = calculateWaterTarget(weightKg, activityLevel);

  return {
    bmi: bmiInfo.bmi,
    bmiCategory: bmiInfo.category,
    bmr,
    tdee,
    targetCalories,
    proteinTarget: macros.proteinTarget,
    carbohydrateTarget: macros.carbohydrateTarget,
    fatTarget: macros.fatTarget,
    fiberTarget: macros.fiberTarget,
    waterTarget,
    waterTargetLitres: Math.round((waterTarget / 1000) * 10) / 10,
    sleepTargetMinutes: 480, // 8 hours default
  };
}
