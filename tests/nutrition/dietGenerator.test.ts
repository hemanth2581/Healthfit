import { describe, it, expect } from 'vitest';
import { generate7DayPlan, getMealAlternatives } from '../../lib/nutrition/dietGenerator';
import { getFilteredFoods } from '../../lib/nutrition/foodDatabase';
import { UserProfile } from '../../types/user';
import { HealthCalculations } from '../../types/health';

describe('Diet Generator & Food Database Filtering', () => {
  describe('Diet Preference Filtering', () => {
    it('Scenario 4: Vegetarian filtering excludes meat and fish', () => {
      const foods = getFilteredFoods('vegetarian', []);
      const foodNames = foods.map((f) => f.name.toLowerCase());

      expect(foodNames.some((n) => n.includes('chicken'))).toBe(false);
      expect(foodNames.some((n) => n.includes('fish'))).toBe(false);

      const plan = generate7DayPlan({
        targetCalories: 2000,
        proteinTarget: 120,
        dietType: 'vegetarian',
        allergies: [],
      });

      for (const day of plan) {
        for (const meal of day.meals) {
          const title = meal.title.toLowerCase();
          expect(title.includes('chicken')).toBe(false);
          expect(title.includes('fish')).toBe(false);
          for (const item of meal.items) {
            const itemLower = item.food_name.toLowerCase();
            expect(itemLower.includes('chicken')).toBe(false);
            expect(itemLower.includes('fish')).toBe(false);
          }
        }
      }
    });

    it('Scenario 5: Vegan filtering excludes all animal products', () => {
      const foods = getFilteredFoods('vegan', []);
      const foodNames = foods.map((f) => f.name.toLowerCase());

      expect(foodNames.some((n) => n.includes('chicken'))).toBe(false);
      expect(foodNames.some((n) => n.includes('egg'))).toBe(false);
      expect(foodNames.some((n) => n.includes('paneer'))).toBe(false);

      const plan = generate7DayPlan({
        targetCalories: 1800,
        proteinTarget: 90,
        dietType: 'vegan',
        allergies: [],
      });

      for (const day of plan) {
        for (const meal of day.meals) {
          const title = meal.title.toLowerCase();
          expect(title.includes('paneer')).toBe(false);
          expect(title.includes('egg')).toBe(false);
          expect(title.includes('chicken')).toBe(false);
        }
      }
    });
  });

  describe('Allergy Restriction Filtering', () => {
    it('Scenario 6: Nut allergy exclusion ensures no nuts appear in generated plans', () => {
      const foods = getFilteredFoods('vegetarian', ['nuts']);
      const foodNames = foods.map((f) => f.name.toLowerCase());

      expect(foodNames.some((n) => n.includes('almond'))).toBe(false);
      expect(foodNames.some((n) => n.includes('peanut'))).toBe(false);

      const weeklyPlan = generate7DayPlan({
        targetCalories: 2200,
        proteinTarget: 130,
        dietType: 'vegetarian',
        allergies: ['nuts', 'almonds', 'peanuts'],
      });

      expect(weeklyPlan.length).toBe(7);

      for (const day of weeklyPlan) {
        for (const meal of day.meals) {
          for (const item of meal.items) {
            const itemLower = item.food_name.toLowerCase();
            expect(itemLower.includes('almond')).toBe(false);
            expect(itemLower.includes('peanut')).toBe(false);
          }
        }
      }
    });
  });

  describe('Meal Replacement Engine', () => {
    const mockTargets: HealthCalculations = {
      bmi: 22.5,
      bmiCategory: 'Normal weight',
      bmr: 1600,
      tdee: 2200,
      targetCalories: 2000,
      proteinTarget: 120,
      carbohydrateTarget: 200,
      fatTarget: 55,
      fiberTarget: 30,
      waterTarget: 2500,
      waterTargetLitres: 2.5,
      sleepTargetMinutes: 480,
    };

    const mockProfile: UserProfile = {
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      activity_level: 'moderately_active',
      goal: 'fat_loss',
      diet_type: 'vegetarian',
      allergies: ['Nuts'],
    };

    it('returns valid calorie-matched alternatives for a meal', () => {
      const alternatives = getMealAlternatives('breakfast', mockTargets as any, mockProfile as any);
      expect(alternatives.length).toBeGreaterThanOrEqual(2);

      alternatives.forEach((alt) => {
        expect(alt.calories).toBeGreaterThan(100);
        expect(alt.protein).toBeGreaterThan(5);
        expect(alt.title).toBeTruthy();
      });
    });
  });
});
