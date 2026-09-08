import { describe, it, expect } from 'vitest';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateProteinTarget,
  calculateMacroTargets,
  calculateDailyWaterRequirement,
  calculateSleepRecommendation,
} from '../../lib/nutrition/calculations';

describe('Nutrition & Biometric Calculations Engine', () => {
  describe('BMI Calculation', () => {
    it('Scenario 1: Underweight (< 18.5)', () => {
      const res = calculateBMI(50, 175);
      expect(res.bmi).toBe(16.3);
      expect(res.category).toBe('Underweight');
    });

    it('Scenario 2: Normal weight (18.5 - 24.9)', () => {
      const res = calculateBMI(68, 175);
      expect(res.bmi).toBe(22.2);
      expect(res.category).toBe('Normal weight');
    });

    it('Scenario 3: Overweight (25.0 - 29.9)', () => {
      const res = calculateBMI(80, 175);
      expect(res.bmi).toBe(26.1);
      expect(res.category).toBe('Overweight');
    });

    it('Obese (>= 30.0)', () => {
      const res = calculateBMI(95, 175);
      expect(res.bmi).toBe(31.0);
      expect(res.category).toBe('Obese');
    });
  });

  describe('BMR & TDEE (Mifflin-St Jeor)', () => {
    it('calculates male BMR accurately', () => {
      const bmr = calculateBMR(70, 175, 25, 'male');
      expect(bmr).toBe(1674);
    });

    it('calculates female BMR accurately', () => {
      const bmr = calculateBMR(60, 165, 25, 'female');
      expect(bmr).toBe(1345);
    });

    it('calculates TDEE based on activity multiplier', () => {
      const bmr = 1674;
      const sedentary = calculateTDEE(bmr, 'sedentary');
      const moderate = calculateTDEE(bmr, 'moderately_active');
      const veryActive = calculateTDEE(bmr, 'very_active');

      expect(sedentary).toBe(Math.round(1674 * 1.2));
      expect(moderate).toBe(Math.round(1674 * 1.55));
      expect(veryActive).toBe(Math.round(1674 * 1.725));
    });
  });

  describe('Target Calories & Macro Split', () => {
    it('applies safe calorie deficit for fat loss (15-20%)', () => {
      const tdee = 2400;
      const target = calculateTargetCalories(tdee, 'lose_weight');
      expect(target).toBe(1968);
      expect(target).toBeLessThan(tdee);
    });

    it('applies calorie surplus for muscle gain', () => {
      const tdee = 2400;
      const target = calculateTargetCalories(tdee, 'gain_weight');
      expect(target).toBe(2736);
      expect(target).toBeGreaterThan(tdee);
    });

    it('calculates protein target based on body weight and goal', () => {
      const protein = calculateProteinTarget(70, 'lose_weight');
      expect(protein).toBeGreaterThanOrEqual(112);
    });

    it('splits calories into macro distribution', () => {
      const macros = calculateMacroTargets(2000, 70, 'lose_weight', 'moderately_active');
      expect(macros.protein_g).toBeGreaterThan(100);
      expect(macros.carbs_g).toBeGreaterThan(100);
      expect(macros.fat_g).toBeGreaterThan(35);
    });
  });

  describe('Hydration & Sleep Targets', () => {
    it('calculates water target with activity multiplier', () => {
      const waterSedentary = calculateDailyWaterRequirement(70, 'sedentary');
      const waterActive = calculateDailyWaterRequirement(70, 'very_active');
      expect(waterSedentary).toBeGreaterThanOrEqual(2300);
      expect(waterActive).toBeGreaterThan(waterSedentary);
    });

    it('calculates sleep recommendation and wind-down routine', () => {
      const sleep = calculateSleepRecommendation('23:00', '07:00');
      expect(sleep.targetHours).toBe(8);
      expect(sleep.windDownSteps.length).toBeGreaterThan(0);
    });
  });
});
