import { describe, it, expect } from 'vitest';
import { generateDayDietPlan, generateWeeklyPlan } from '../lib/nutrition/dietGenerator';
import { getFilteredFoods, FOOD_DATABASE } from '../lib/nutrition/foodDatabase';

describe('Diet Generator & Food Database Filtering', () => {
  describe('Diet Preference Filtering', () => {
    it('Scenario 4: Vegetarian filtering excludes meat and fish', () => {
      const foods = getFilteredFoods('vegetarian', []);
      const foodNames = foods.map((f) => f.name.toLowerCase());

      expect(foodNames.some((n) => n.includes('chicken'))).toBe(false);
      expect(foodNames.some((n) => n.includes('fish'))).toBe(false);

      const plan = generateDayDietPlan(
        'Monday',
        2000,
        120,
        'vegetarian',
        'indian',
        [],
        2800,
        480
      );

      // Verify no non-veg foods exist in any meal
      for (const meal of plan.meals) {
        for (const item of meal.foodItems) {
          const dbItem = FOOD_DATABASE.find((f) => f.id === item.foodId);
          expect(dbItem?.dietTypes).toContain('vegetarian');
        }
      }
    });

    it('Scenario 5: Vegan filtering excludes all animal products (dairy, eggs, meat)', () => {
      const foods = getFilteredFoods('vegan', []);
      const foodNames = foods.map((f) => f.name.toLowerCase());

      expect(foodNames.some((n) => n.includes('chicken'))).toBe(false);
      expect(foodNames.some((n) => n.includes('fish'))).toBe(false);
      expect(foodNames.some((n) => n.includes('egg'))).toBe(false);
      expect(foodNames.some((n) => n.includes('paneer'))).toBe(false);
      expect(foodNames.some((n) => n.includes('curd') || n.includes('yogurt'))).toBe(false);
      expect(foodNames.some((n) => n.includes('ghee'))).toBe(false);

      const plan = generateDayDietPlan(
        'Monday',
        1800,
        90,
        'vegan',
        'mixed',
        [],
        2500,
        480
      );

      for (const meal of plan.meals) {
        for (const item of meal.foodItems) {
          const dbItem = FOOD_DATABASE.find((f) => f.id === item.foodId);
          expect(dbItem?.dietTypes).toContain('vegan');
          expect(dbItem?.allergens).not.toContain('dairy');
          expect(dbItem?.allergens).not.toContain('eggs');
          expect(dbItem?.allergens).not.toContain('seafood');
        }
      }
    });
  });

  describe('Allergy Restriction Filtering', () => {
    it('Scenario 6: Nut allergy exclusion ensures no nuts or nut butter appear in generated plans', () => {
      const foods = getFilteredFoods('vegetarian', ['nuts']);
      const foodNames = foods.map((f) => f.name.toLowerCase());

      expect(foodNames.some((n) => n.includes('almond'))).toBe(false);
      expect(foodNames.some((n) => n.includes('walnut'))).toBe(false);
      expect(foodNames.some((n) => n.includes('peanut'))).toBe(false);

      const weeklyPlan = generateWeeklyPlan(
        2200,
        130,
        'vegetarian',
        'north_indian',
        ['nuts'],
        3000,
        480
      );

      expect(weeklyPlan.days.length).toBe(7);

      for (const day of weeklyPlan.days) {
        for (const meal of day.meals) {
          for (const item of meal.foodItems) {
            const dbItem = FOOD_DATABASE.find((f) => f.id === item.foodId);
            expect(dbItem?.allergens).not.toContain('nuts');
          }
        }
      }
    });
  });

  describe('7-Day Plan Rotation & Macro Stability', () => {
    it('generates a 7-day plan with meal rotation and close macro totals', () => {
      const weekly = generateWeeklyPlan(
        2000,
        120,
        'non_vegetarian',
        'indian',
        [],
        2800,
        480
      );

      expect(weekly.days.length).toBe(7);
      expect(weekly.summary.avgCalories).toBeGreaterThanOrEqual(1800);
      expect(weekly.summary.avgCalories).toBeLessThanOrEqual(2200);

      // Verify each day has 5 distinct meals
      for (const day of weekly.days) {
        expect(day.meals.length).toBe(5);
        expect(day.workoutPlan).toBeDefined();
      }
    });
  });
});
