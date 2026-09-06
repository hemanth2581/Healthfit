import { describe, it, expect } from 'vitest';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateProteinTarget,
  calculateWaterTarget,
  calculateAllHealthMetrics,
} from '../lib/nutrition/calculations';

describe('Health Calculation Engine', () => {
  describe('BMI Calculation', () => {
    it('calculates normal BMI correctly', () => {
      const result = calculateBMI(70, 175);
      // 70 / (1.75^2) = 22.857... -> 22.9
      expect(result.bmi).toBe(22.9);
      expect(result.category).toBe('Normal weight');
    });

    it('identifies underweight BMI', () => {
      const result = calculateBMI(48, 170);
      expect(result.bmi).toBeLessThan(18.5);
      expect(result.category).toBe('Underweight');
    });

    it('identifies overweight BMI', () => {
      const result = calculateBMI(85, 175);
      expect(result.bmi).toBeGreaterThanOrEqual(25);
      expect(result.bmi).toBeLessThanOrEqual(29.9);
      expect(result.category).toBe('Overweight');
    });

    it('identifies obese BMI', () => {
      const result = calculateBMI(105, 170);
      expect(result.bmi).toBeGreaterThanOrEqual(30.0);
      expect(result.category).toBe('Obese');
    });
  });

  describe('BMR Calculation (Mifflin-St Jeor)', () => {
    it('calculates male BMR accurately', () => {
      // 70kg, 175cm, 22yo, male: 10(70) + 6.25(175) - 5(22) + 5 = 700 + 1093.75 - 110 + 5 = 1688.75 -> 1689
      const bmr = calculateBMR(70, 175, 22, 'male');
      expect(bmr).toBe(1689);
    });

    it('calculates female BMR accurately', () => {
      // 60kg, 165cm, 25yo, female: 10(60) + 6.25(165) - 5(25) - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345
      const bmr = calculateBMR(60, 165, 25, 'female');
      expect(bmr).toBe(1345);
    });
  });

  describe('TDEE & Multipliers', () => {
    it('calculates moderate activity TDEE', () => {
      const bmr = 1689;
      // 1689 * 1.55 = 2617.95 -> 2618
      const tdee = calculateTDEE(bmr, 'moderately_active');
      expect(tdee).toBe(2618);
    });

    it('calculates sedentary activity TDEE', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, 'sedentary');
      expect(tdee).toBe(1800); // 1500 * 1.2
    });
  });

  describe('Prompt Test Scenarios 1 to 3', () => {
    it('Scenario 1: 70 kg / 175 cm / age 22 / moderate activity / maintenance', () => {
      const metrics = calculateAllHealthMetrics(70, 175, 22, 'male', 'moderately_active', 'maintain_weight');
      expect(metrics.bmi).toBe(22.9);
      expect(metrics.bmiCategory).toBe('Normal weight');
      expect(metrics.bmr).toBe(1689);
      expect(metrics.tdee).toBe(2618);
      expect(metrics.targetCalories).toBe(2618);
      expect(metrics.proteinTarget).toBeGreaterThanOrEqual(100);
      expect(metrics.waterTarget).toBeGreaterThanOrEqual(2500);
    });

    it('Scenario 2: 90 kg / 175 cm / age 25 / moderate activity / weight loss', () => {
      const metrics = calculateAllHealthMetrics(90, 175, 25, 'male', 'moderately_active', 'lose_weight');
      expect(metrics.bmi).toBe(29.4);
      expect(metrics.bmiCategory).toBe('Overweight');
      expect(metrics.targetCalories).toBeLessThan(metrics.tdee);
      // Safe deficit
      expect(metrics.tdee - metrics.targetCalories).toBeGreaterThanOrEqual(300);
      expect(metrics.tdee - metrics.targetCalories).toBeLessThanOrEqual(600);
      expect(metrics.proteinTarget).toBeGreaterThanOrEqual(140);
    });

    it('Scenario 3: 60 kg / 170 cm / age 23 / moderate activity / weight gain', () => {
      const metrics = calculateAllHealthMetrics(60, 170, 23, 'male', 'moderately_active', 'gain_weight');
      expect(metrics.bmi).toBe(20.8);
      expect(metrics.targetCalories).toBeGreaterThan(metrics.tdee);
      // Safe surplus
      expect(metrics.targetCalories - metrics.tdee).toBeGreaterThanOrEqual(250);
      expect(metrics.targetCalories - metrics.tdee).toBeLessThanOrEqual(500);
    });
  });

  describe('Water Target Calculations', () => {
    it('calculates water target with activity bonus', () => {
      const sedentaryWater = calculateWaterTarget(70, 'sedentary');
      const activeWater = calculateWaterTarget(70, 'very_active');
      expect(activeWater).toBeGreaterThan(sedentaryWater);
      expect(sedentaryWater).toBe(2500); // 70 * 35 = 2450 -> 2500ml
      expect(activeWater).toBe(3200); // 70 * 35 + 750 = 3200ml
    });
  });
});
