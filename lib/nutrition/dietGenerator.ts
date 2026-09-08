import { DietType } from '@/types/user';
import { CuisinePreference } from '@/types/health';

export interface GeneratedMealItem {
  food_name: string;
  quantity: number;
  unit: string;
}

export interface GeneratedMeal {
  meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'dinner';
  meal_time: string;
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: GeneratedMealItem[];
}

export interface GeneratedDayPlan {
  date: string; // YYYY-MM-DD
  dayName: string; // 'Monday', 'Tuesday', etc.
  dayShort: string; // 'MON', 'TUE', etc.
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: GeneratedMeal[];
  tasks: {
    task_type: 'meal' | 'habit';
    title: string;
    description: string;
    scheduled_time: string;
    points: number;
    required: boolean;
  }[];
}

export interface GeneratorOptions {
  targetCalories: number;
  proteinTarget: number;
  dietType: DietType;
  cuisine?: CuisinePreference;
  allergies?: string[];
  startDate?: Date;
}

export interface MealAlternative {
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: { name: string; qty: number; unit: string }[];
}

export const MEAL_TEMPLATES: Record<
  string,
  {
    breakfast: { title: string; desc: string; items: { name: string; qty: number; unit: string; cal: number; p: number; c: number; f: number }[] }[];
    morningSnack: { title: string; desc: string; items: { name: string; qty: number; unit: string; cal: number; p: number; c: number; f: number }[] }[];
    lunch: { title: string; desc: string; items: { name: string; qty: number; unit: string; cal: number; p: number; c: number; f: number }[] }[];
    eveningSnack: { title: string; desc: string; items: { name: string; qty: number; unit: string; cal: number; p: number; c: number; f: number }[] }[];
    dinner: { title: string; desc: string; items: { name: string; qty: number; unit: string; cal: number; p: number; c: number; f: number }[] }[];
  }
> = {
  non_vegetarian: {
    breakfast: [
      {
        title: 'Boiled Eggs with Whole Wheat Toast & Tea',
        desc: 'High-protein breakfast with whole eggs and complex carbohydrates',
        items: [
          { name: 'Whole Boiled Eggs', qty: 2, unit: 'piece', cal: 156, p: 12.6, c: 1.1, f: 10.6 },
          { name: 'Whole Wheat Toast', qty: 2, unit: 'slices', cal: 160, p: 6.0, c: 28.0, f: 2.0 },
          { name: 'Black Coffee / Green Tea', qty: 1, unit: 'cup', cal: 5, p: 0.5, c: 1.0, f: 0 },
        ],
      },
      {
        title: 'Oats Porridge with Egg White Scramble & Fruit',
        desc: 'Lean protein and slow-digesting oats for sustained morning energy',
        items: [
          { name: 'Rolled Oats Porridge', qty: 150, unit: 'g', cal: 180, p: 6.0, c: 32.0, f: 3.0 },
          { name: 'Egg White Scramble', qty: 3, unit: 'whites', cal: 51, p: 10.8, c: 0.7, f: 0.2 },
          { name: 'Sliced Apple', qty: 1, unit: 'piece', cal: 80, p: 0.5, c: 20.0, f: 0.3 },
        ],
      },
      {
        title: 'Steamed Idli with Egg Curry & Sambar',
        desc: 'Traditional fermented steamed rice cakes with protein-packed eggs',
        items: [
          { name: 'Steamed Idli', qty: 2, unit: 'piece', cal: 140, p: 4.0, c: 29.0, f: 0.4 },
          { name: 'Boiled Egg (2 pcs)', qty: 2, unit: 'piece', cal: 156, p: 12.6, c: 1.1, f: 10.6 },
          { name: 'Vegetable Sambar', qty: 150, unit: 'ml', cal: 90, p: 3.5, c: 14.0, f: 2.0 },
        ],
      },
      {
        title: 'Grilled Chicken Breast Bowl with Avocado & Toast',
        desc: 'Nutrient-dense power breakfast with healthy unsaturated fats',
        items: [
          { name: 'Grilled Chicken Breast', qty: 100, unit: 'g', cal: 165, p: 31.0, c: 0, f: 3.6 },
          { name: 'Whole Wheat Toast', qty: 2, unit: 'slices', cal: 160, p: 6.0, c: 28.0, f: 2.0 },
          { name: 'Avocado Slices', qty: 40, unit: 'g', cal: 65, p: 0.8, c: 3.4, f: 6.0 },
        ],
      },
    ],
    morningSnack: [
      {
        title: 'Fresh Apple & Roasted Almonds',
        desc: 'Crisp fruit with micronutrients and healthy fats',
        items: [
          { name: 'Fresh Red Apple', qty: 1, unit: 'piece', cal: 80, p: 0.5, c: 21.0, f: 0.3 },
          { name: 'Almonds', qty: 10, unit: 'nuts', cal: 70, p: 2.5, c: 2.5, f: 6.0 },
        ],
      },
      {
        title: 'Greek Yogurt with Blueberries',
        desc: 'Probiotics and antioxidant-rich berry snack',
        items: [
          { name: 'Greek Yogurt', qty: 150, unit: 'g', cal: 100, p: 10.0, c: 6.0, f: 2.0 },
          { name: 'Fresh Berries', qty: 50, unit: 'g', cal: 35, p: 0.5, c: 7.0, f: 0.2 },
        ],
      },
    ],
    lunch: [
      {
        title: 'Grilled Chicken Breast with Brown Rice & Dal',
        desc: 'Balanced plate with lean poultry and complex grains',
        items: [
          { name: 'Grilled Chicken Breast', qty: 150, unit: 'g', cal: 240, p: 46.0, c: 0, f: 5.0 },
          { name: 'Cooked Brown Rice', qty: 150, unit: 'g', cal: 165, p: 3.5, c: 35.0, f: 1.5 },
          { name: 'Yellow Moong Dal', qty: 150, unit: 'ml', cal: 130, p: 7.0, c: 18.0, f: 2.5 },
          { name: 'Mixed Cucumber & Tomato Salad', qty: 100, unit: 'g', cal: 30, p: 1.0, c: 6.0, f: 0.2 },
        ],
      },
      {
        title: 'Fish Curry with Steamed Rice & Sauteed Veggies',
        desc: 'Omega-3 rich fish curry with aromatic herbs',
        items: [
          { name: 'Grilled / Curried Fish', qty: 150, unit: 'g', cal: 190, p: 32.0, c: 2.0, f: 6.0 },
          { name: 'Steamed Rice', qty: 150, unit: 'g', cal: 195, p: 4.0, c: 42.0, f: 0.5 },
          { name: 'Sauteed French Beans & Carrots', qty: 120, unit: 'g', cal: 60, p: 2.5, c: 11.0, f: 1.0 },
        ],
      },
      {
        title: 'Chicken Tikka Roll in Whole Wheat Wrap',
        desc: 'Spiced tandoori chicken cubes in a high-fiber whole wheat roti',
        items: [
          { name: 'Tandoori Chicken Tikka', qty: 140, unit: 'g', cal: 210, p: 36.0, c: 2.0, f: 5.0 },
          { name: 'Whole Wheat Roti', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Mint Yogurt Dip & Salad', qty: 80, unit: 'g', cal: 45, p: 2.0, c: 4.0, f: 2.0 },
        ],
      },
    ],
    eveningSnack: [
      {
        title: 'Spiced Buttermilk with Roasted Makhana',
        desc: 'Light, crunchy and refreshing afternoon snack',
        items: [
          { name: 'Spiced Buttermilk (Chaas)', qty: 250, unit: 'ml', cal: 60, p: 3.0, c: 5.0, f: 2.0 },
          { name: 'Roasted Foxnuts (Makhana)', qty: 25, unit: 'g', cal: 90, p: 2.5, c: 18.0, f: 0.5 },
        ],
      },
      {
        title: 'Banana with Boiled Egg Whites',
        desc: 'Quick pre-workout energy and pure albumin protein',
        items: [
          { name: 'Ripe Banana', qty: 1, unit: 'piece', cal: 105, p: 1.3, c: 27.0, f: 0.3 },
          { name: 'Boiled Egg Whites', qty: 2, unit: 'whites', cal: 34, p: 7.2, c: 0.5, f: 0.1 },
        ],
      },
    ],
    dinner: [
      {
        title: 'Whole Wheat Phulka with Chicken Tikka & Salad',
        desc: 'Light dinner with lean protein to promote nighttime recovery',
        items: [
          { name: 'Whole Wheat Phulka (Roti)', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Tandoori / Pan-seared Chicken', qty: 120, unit: 'g', cal: 190, p: 35.0, c: 2.0, f: 4.5 },
          { name: 'Green Salad with Lemon', qty: 100, unit: 'g', cal: 25, p: 1.0, c: 5.0, f: 0.2 },
        ],
      },
      {
        title: 'Egg Bhurji with 2 Rotis & Steamed Spinach',
        desc: 'Scrambled spiced eggs with antioxidant-rich palak',
        items: [
          { name: 'Egg Bhurji (2 Whole + 1 White)', qty: 150, unit: 'g', cal: 210, p: 18.0, c: 4.0, f: 13.0 },
          { name: 'Whole Wheat Roti', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Steamed Palak / Greens', qty: 100, unit: 'g', cal: 40, p: 2.5, c: 5.0, f: 1.0 },
        ],
      },
    ],
  },
  vegetarian: {
    breakfast: [
      {
        title: 'Steamed Idli with Sambar & Coconut Chutney',
        desc: 'Fermented lentil and rice cakes rich in gut-healthy probiotics',
        items: [
          { name: 'Steamed Idli', qty: 2, unit: 'piece', cal: 140, p: 4.0, c: 29.0, f: 0.4 },
          { name: 'Vegetable Sambar', qty: 150, unit: 'ml', cal: 90, p: 3.5, c: 14.0, f: 2.0 },
          { name: 'Coconut Chutney', qty: 30, unit: 'g', cal: 65, p: 0.8, c: 2.5, f: 6.0 },
        ],
      },
      {
        title: 'Spiced Paneer Bhurji with Whole Wheat Toast',
        desc: 'Calcium and protein-rich fresh cottage cheese scramble',
        items: [
          { name: 'Paneer Bhurji', qty: 100, unit: 'g', cal: 190, p: 14.0, c: 4.0, f: 13.0 },
          { name: 'Whole Wheat Toast', qty: 2, unit: 'slices', cal: 160, p: 6.0, c: 28.0, f: 2.0 },
        ],
      },
      {
        title: 'Vegetable Poha with Roasted Peanuts',
        desc: 'Flattened rice tempered with mustard seeds and turmeric',
        items: [
          { name: 'Vegetable Poha', qty: 180, unit: 'g', cal: 210, p: 4.5, c: 38.0, f: 5.0 },
          { name: 'Roasted Peanuts', qty: 15, unit: 'g', cal: 85, p: 3.5, c: 2.5, f: 7.0 },
        ],
      },
      {
        title: 'Oats & Milk Porridge with Banana & Chia Seeds',
        desc: 'Warm oat porridge with plant fiber and heart-healthy fats',
        items: [
          { name: 'Rolled Oats Porridge', qty: 150, unit: 'g', cal: 180, p: 6.0, c: 32.0, f: 3.0 },
          { name: 'Milk / Soy Milk', qty: 150, unit: 'ml', cal: 90, p: 4.5, c: 7.5, f: 4.0 },
          { name: 'Chia Seeds', qty: 10, unit: 'g', cal: 50, p: 2.0, c: 4.0, f: 3.5 },
        ],
      },
    ],
    morningSnack: [
      {
        title: 'Fresh Apple with Soaked Almonds',
        desc: 'Natural fruit fructose and vitamin E',
        items: [
          { name: 'Apple', qty: 1, unit: 'piece', cal: 80, p: 0.5, c: 21.0, f: 0.3 },
          { name: 'Soaked Almonds', qty: 8, unit: 'nuts', cal: 55, p: 2.0, c: 2.0, f: 4.8 },
        ],
      },
      {
        title: 'Sprouted Moong Salad with Lemon',
        desc: 'Enzyme-rich sprouted green gram with pomegranate',
        items: [
          { name: 'Sprouted Moong', qty: 100, unit: 'g', cal: 105, p: 7.5, c: 19.0, f: 0.5 },
          { name: 'Pomegranate Seeds', qty: 30, unit: 'g', cal: 25, p: 0.5, c: 6.0, f: 0.3 },
        ],
      },
    ],
    lunch: [
      {
        title: 'Brown Rice with Paneer Curry, Dal & Curd',
        desc: 'Classic vegetarian complete balanced thali',
        items: [
          { name: 'Cooked Brown Rice', qty: 150, unit: 'g', cal: 165, p: 3.5, c: 35.0, f: 1.5 },
          { name: 'Paneer Curry', qty: 100, unit: 'g', cal: 180, p: 12.0, c: 6.0, f: 12.0 },
          { name: 'Moong / Toor Dal', qty: 150, unit: 'ml', cal: 130, p: 7.0, c: 18.0, f: 2.5 },
          { name: 'Fresh Curd (Dahi)', qty: 100, unit: 'g', cal: 65, p: 3.5, c: 4.5, f: 3.5 },
        ],
      },
      {
        title: 'Rajma Masala with Steamed Rice & Green Salad',
        desc: 'Kidney beans stewed in fragrant tomato-onion gravy',
        items: [
          { name: 'Rajma Masala (Kidney Beans)', qty: 200, unit: 'g', cal: 220, p: 12.0, c: 32.0, f: 4.5 },
          { name: 'Steamed Rice', qty: 150, unit: 'g', cal: 195, p: 4.0, c: 42.0, f: 0.5 },
          { name: 'Cucumber Salad', qty: 100, unit: 'g', cal: 25, p: 1.0, c: 5.0, f: 0.2 },
        ],
      },
      {
        title: 'Chole (Chickpea Curry) with 2 Rotis & Curd',
        desc: 'Protein and complex carb rich chickpea lunch',
        items: [
          { name: 'Chole Curry', qty: 180, unit: 'g', cal: 230, p: 11.0, c: 34.0, f: 5.5 },
          { name: 'Whole Wheat Roti', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Fresh Dahi (Curd)', qty: 100, unit: 'g', cal: 65, p: 3.5, c: 4.5, f: 3.5 },
        ],
      },
    ],
    eveningSnack: [
      {
        title: 'Spiced Buttermilk & Roasted Chana',
        desc: 'Low-calorie hydrator with roasted Bengal gram',
        items: [
          { name: 'Spiced Buttermilk', qty: 250, unit: 'ml', cal: 60, p: 3.0, c: 5.0, f: 2.0 },
          { name: 'Roasted Chana', qty: 30, unit: 'g', cal: 110, p: 6.0, c: 18.0, f: 2.0 },
        ],
      },
      {
        title: 'Banana with Roasted Pumpkin Seeds',
        desc: 'Magnesium and potassium boost',
        items: [
          { name: 'Banana', qty: 1, unit: 'piece', cal: 105, p: 1.3, c: 27.0, f: 0.3 },
          { name: 'Pumpkin Seeds', qty: 15, unit: 'g', cal: 85, p: 4.5, c: 2.0, f: 7.0 },
        ],
      },
    ],
    dinner: [
      {
        title: 'Whole Wheat Roti with Soya Chunk Curry & Veggies',
        desc: 'High-protein plant-based dinner to support muscle repair',
        items: [
          { name: 'Whole Wheat Roti', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Soya Chunk Curry', qty: 150, unit: 'g', cal: 175, p: 18.0, c: 12.0, f: 5.0 },
          { name: 'Mixed Steamed Veggies', qty: 100, unit: 'g', cal: 50, p: 2.0, c: 9.0, f: 0.5 },
        ],
      },
      {
        title: 'Palak Paneer with 2 Phulkas & Salad',
        desc: 'Creamy spinach gravy with cottage cheese cubes',
        items: [
          { name: 'Palak Paneer', qty: 150, unit: 'g', cal: 210, p: 14.0, c: 8.0, f: 14.0 },
          { name: 'Whole Wheat Phulka', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Onion-Tomato Salad', qty: 80, unit: 'g', cal: 25, p: 1.0, c: 5.0, f: 0.2 },
        ],
      },
      {
        title: 'Dal Khichdi with Roasted Papad & Curd',
        desc: 'Comforting, easily digestible rice-lentil blend',
        items: [
          { name: 'Dal Khichdi', qty: 220, unit: 'g', cal: 240, p: 8.0, c: 45.0, f: 3.5 },
          { name: 'Fresh Curd', qty: 100, unit: 'g', cal: 65, p: 3.5, c: 4.5, f: 3.5 },
          { name: 'Roasted Papad', qty: 1, unit: 'piece', cal: 40, p: 2.0, c: 6.0, f: 0.5 },
        ],
      },
    ],
  },
  vegan: {
    breakfast: [
      {
        title: 'Rolled Oats Porridge with Chia Seeds & Almond Milk',
        desc: 'Fiber-rich vegan warm breakfast bowl',
        items: [
          { name: 'Rolled Oats (Dry)', qty: 45, unit: 'g', cal: 170, p: 6.0, c: 30.0, f: 3.0 },
          { name: 'Almond Milk (Unsweetened)', qty: 200, unit: 'ml', cal: 40, p: 1.5, c: 1.5, f: 3.0 },
          { name: 'Chia Seeds', qty: 10, unit: 'g', cal: 50, p: 2.0, c: 4.0, f: 3.5 },
          { name: 'Sliced Banana', qty: 0.5, unit: 'piece', cal: 50, p: 0.6, c: 13.0, f: 0.1 },
        ],
      },
      {
        title: 'Tofu Bhurji with Whole Wheat Toast',
        desc: 'Scrambled organic tofu tempered with onion, tomato, and turmeric',
        items: [
          { name: 'Tofu (Firm)', qty: 120, unit: 'g', cal: 140, p: 16.0, c: 3.0, f: 8.0 },
          { name: 'Whole Wheat Toast', qty: 2, unit: 'slices', cal: 160, p: 6.0, c: 28.0, f: 2.0 },
        ],
      },
    ],
    morningSnack: [
      {
        title: 'Apple with Walnut Halves',
        desc: 'Brain-boosting healthy fats and polyphenols',
        items: [
          { name: 'Fresh Apple', qty: 1, unit: 'piece', cal: 80, p: 0.5, c: 21.0, f: 0.3 },
          { name: 'Walnut Halves', qty: 4, unit: 'pieces', cal: 65, p: 1.5, c: 1.5, f: 6.5 },
        ],
      },
    ],
    lunch: [
      {
        title: 'Chana Masala with Brown Rice & Cucumber Salad',
        desc: 'Protein-packed chickpea curry with whole brown rice',
        items: [
          { name: 'Chana Masala (Chickpeas)', qty: 180, unit: 'g', cal: 230, p: 11.0, c: 34.0, f: 5.5 },
          { name: 'Cooked Brown Rice', qty: 150, unit: 'g', cal: 165, p: 3.5, c: 35.0, f: 1.5 },
          { name: 'Cucumber & Lemon Salad', qty: 100, unit: 'g', cal: 20, p: 0.8, c: 4.0, f: 0.1 },
        ],
      },
    ],
    eveningSnack: [
      {
        title: 'Roasted Chana with Green Tea',
        desc: 'Crisp roasted chickpeas paired with warm green tea',
        items: [
          { name: 'Roasted Bengal Gram', qty: 35, unit: 'g', cal: 125, p: 7.0, c: 20.0, f: 2.5 },
          { name: 'Green Tea (No sugar)', qty: 1, unit: 'cup', cal: 2, p: 0.2, c: 0.5, f: 0 },
        ],
      },
    ],
    dinner: [
      {
        title: 'Tofu & Vegetable Stir Fry with Roti',
        desc: 'Crispy pan-fried tofu with colorful bell peppers and broccoli',
        items: [
          { name: 'Sautéed Tofu', qty: 120, unit: 'g', cal: 150, p: 17.0, c: 4.0, f: 8.5 },
          { name: 'Whole Wheat Roti', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Stir Fried Broccoli & Carrots', qty: 120, unit: 'g', cal: 55, p: 3.0, c: 9.0, f: 1.0 },
        ],
      },
    ],
  },
  eggetarian: {
    breakfast: [
      {
        title: '2 Boiled Eggs with Idli & Sambar',
        desc: 'Balanced morning meal with steamed lentils and whole eggs',
        items: [
          { name: 'Steamed Idli', qty: 2, unit: 'piece', cal: 140, p: 4.0, c: 29.0, f: 0.4 },
          { name: 'Whole Boiled Eggs', qty: 2, unit: 'piece', cal: 156, p: 12.6, c: 1.1, f: 10.6 },
          { name: 'Vegetable Sambar', qty: 150, unit: 'ml', cal: 90, p: 3.5, c: 14.0, f: 2.0 },
        ],
      },
      {
        title: 'Egg Omelette with Whole Wheat Toast & Veggies',
        desc: 'Fluffy vegetable omelette with whole grains',
        items: [
          { name: 'Vegetable 2-Egg Omelette', qty: 1, unit: 'serving', cal: 180, p: 13.0, c: 3.0, f: 13.0 },
          { name: 'Whole Wheat Toast', qty: 2, unit: 'slices', cal: 160, p: 6.0, c: 28.0, f: 2.0 },
        ],
      },
    ],
    morningSnack: [
      {
        title: 'Fresh Apple with Almonds',
        desc: 'Natural energy recharge',
        items: [
          { name: 'Apple', qty: 1, unit: 'piece', cal: 80, p: 0.5, c: 21.0, f: 0.3 },
          { name: 'Almonds', qty: 10, unit: 'nuts', cal: 70, p: 2.5, c: 2.5, f: 6.0 },
        ],
      },
    ],
    lunch: [
      {
        title: 'Egg Curry with Steamed Rice & Dal',
        desc: 'Richly spiced home-style egg curry',
        items: [
          { name: 'Egg Curry (2 Eggs)', qty: 180, unit: 'g', cal: 220, p: 14.0, c: 8.0, f: 14.0 },
          { name: 'Steamed Rice', qty: 150, unit: 'g', cal: 195, p: 4.0, c: 42.0, f: 0.5 },
          { name: 'Yellow Dal', qty: 150, unit: 'ml', cal: 130, p: 7.0, c: 18.0, f: 2.5 },
        ],
      },
    ],
    eveningSnack: [
      {
        title: 'Spiced Buttermilk with Roasted Makhana',
        desc: 'Light and crunchy snack',
        items: [
          { name: 'Spiced Buttermilk', qty: 250, unit: 'ml', cal: 60, p: 3.0, c: 5.0, f: 2.0 },
          { name: 'Roasted Makhana', qty: 25, unit: 'g', cal: 90, p: 2.5, c: 18.0, f: 0.5 },
        ],
      },
    ],
    dinner: [
      {
        title: 'Egg Bhurji with 2 Rotis & Green Salad',
        desc: 'Quick, delicious, and high in essential amino acids',
        items: [
          { name: 'Egg Bhurji (2 Eggs + Veggies)', qty: 150, unit: 'g', cal: 200, p: 14.0, c: 4.0, f: 14.0 },
          { name: 'Whole Wheat Roti', qty: 2, unit: 'rotis', cal: 160, p: 6.0, c: 32.0, f: 1.0 },
          { name: 'Cucumber Tomato Salad', qty: 100, unit: 'g', cal: 30, p: 1.0, c: 6.0, f: 0.2 },
        ],
      },
    ],
  },
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORTS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/**
 * Returns alternative options for a given meal type respecting diet and allergen filters
 */
export function getMealAlternatives(
  mealType: 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'dinner',
  currentTitleOrTargets?: string | any,
  dietTypeOrProfile?: DietType | any,
  allergiesList?: string[]
): (MealAlternative & { name: string; portion_size: string })[] {
  let currentTitle = '';
  let dietType: DietType = 'vegetarian';
  let allergies: string[] = [];

  if (typeof currentTitleOrTargets === 'string') {
    currentTitle = currentTitleOrTargets;
    if (typeof dietTypeOrProfile === 'string') {
      dietType = dietTypeOrProfile as DietType;
    }
    if (Array.isArray(allergiesList)) {
      allergies = allergiesList;
    }
  } else if (typeof dietTypeOrProfile === 'object' && dietTypeOrProfile !== null) {
    dietType = (dietTypeOrProfile.diet_type as DietType) || 'vegetarian';
    allergies = Array.isArray(dietTypeOrProfile.allergies) ? (dietTypeOrProfile.allergies as string[]) : [];
  }

  const dietKey = MEAL_TEMPLATES[dietType] ? dietType : 'vegetarian';
  const templates = MEAL_TEMPLATES[dietKey];

  const keyMap = {
    breakfast: 'breakfast',
    morning_snack: 'morningSnack',
    lunch: 'lunch',
    evening_snack: 'eveningSnack',
    dinner: 'dinner',
  } as const;

  const list = templates[keyMap[mealType]] || [];

  return list
    .filter((template) => !currentTitle || template.title !== currentTitle)
    .filter((template) => {
      if (!allergies || allergies.length === 0) return true;
      return !template.items.some((item) =>
        allergies.some((allergy) => item.name.toLowerCase().includes(allergy.toLowerCase()))
      );
    })
    .map((template) => {
      const cal = template.items.reduce((s, x) => s + x.cal, 0);
      const p = Math.round(template.items.reduce((s, x) => s + x.p, 0) * 10) / 10;
      const c = Math.round(template.items.reduce((s, x) => s + x.c, 0) * 10) / 10;
      const f = Math.round(template.items.reduce((s, x) => s + x.f, 0) * 10) / 10;

      return {
        title: template.title,
        name: template.title,
        description: template.desc,
        calories: cal,
        protein: p,
        carbs: c,
        fat: f,
        portion_size: template.items.map((i) => `${i.qty} ${i.unit}`).join(' + '),
        items: template.items.map((i) => ({ name: i.name, qty: i.qty, unit: i.unit })),
      };
    });
}

/**
 * Generates a full 7-day plan with meals and tasks
 */
export function generate7DayPlan(options: GeneratorOptions): GeneratedDayPlan[] {
  const { targetCalories, dietType, allergies = [], startDate = new Date() } = options;

  const dietKey = MEAL_TEMPLATES[dietType] ? dietType : 'vegetarian';
  const templates = MEAL_TEMPLATES[dietKey];

  const days: GeneratedDayPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + i);

    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, '0');
    const dayNum = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;

    const dayName = DAY_NAMES[(dayDate.getDay() + 6) % 7];
    const dayShort = DAY_SHORTS[(dayDate.getDay() + 6) % 7];

    const bIndex = i % templates.breakfast.length;
    const msIndex = i % templates.morningSnack.length;
    const lIndex = i % templates.lunch.length;
    const esIndex = i % templates.eveningSnack.length;
    const dIndex = i % templates.dinner.length;

    const rawBreakfast = templates.breakfast[bIndex];
    const rawMSnack = templates.morningSnack[msIndex];
    const rawLunch = templates.lunch[lIndex];
    const rawESnack = templates.eveningSnack[esIndex];
    const rawDinner = templates.dinner[dIndex];

    const templateBaseCalories =
      rawBreakfast.items.reduce((s, x) => s + x.cal, 0) +
      rawMSnack.items.reduce((s, x) => s + x.cal, 0) +
      rawLunch.items.reduce((s, x) => s + x.cal, 0) +
      rawESnack.items.reduce((s, x) => s + x.cal, 0) +
      rawDinner.items.reduce((s, x) => s + x.cal, 0);

    const scaleFactor = Math.max(0.75, Math.min(1.8, targetCalories / (templateBaseCalories || 1800)));

    function scaleMeal(
      raw: { title: string; desc: string; items: { name: string; qty: number; unit: string; cal: number; p: number; c: number; f: number }[] },
      mealType: 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'dinner',
      mealTime: string
    ): GeneratedMeal {
      let filteredItems = raw.items;
      if (allergies.length > 0) {
        filteredItems = filteredItems.filter(
          (item) => !allergies.some((a) => item.name.toLowerCase().includes(a.toLowerCase()))
        );
      }
      if (filteredItems.length === 0) {
        filteredItems = raw.items;
      }

      const scaledItems = filteredItems.map((item) => {
        const scaledQty = Math.round(item.qty * (item.unit === 'piece' || item.unit === 'slices' ? 1 : scaleFactor));
        return {
          food_name: item.name,
          quantity: scaledQty,
          unit: item.unit,
        };
      });

      const totalCal = Math.round(filteredItems.reduce((s, x) => s + x.cal, 0) * scaleFactor);
      const totalP = Math.round(filteredItems.reduce((s, x) => s + x.p, 0) * scaleFactor * 10) / 10;
      const totalC = Math.round(filteredItems.reduce((s, x) => s + x.c, 0) * scaleFactor * 10) / 10;
      const totalF = Math.round(filteredItems.reduce((s, x) => s + x.f, 0) * scaleFactor * 10) / 10;

      return {
        meal_type: mealType,
        meal_time: mealTime,
        title: raw.title,
        description: raw.desc,
        calories: totalCal,
        protein: totalP,
        carbs: totalC,
        fat: totalF,
        items: scaledItems,
      };
    }

    const breakfast = scaleMeal(rawBreakfast, 'breakfast', '08:00');
    const morningSnack = scaleMeal(rawMSnack, 'morning_snack', '11:00');
    const lunch = scaleMeal(rawLunch, 'lunch', '13:30');
    const eveningSnack = scaleMeal(rawESnack, 'evening_snack', '17:00');
    const dinner = scaleMeal(rawDinner, 'dinner', '20:00');

    const meals: GeneratedMeal[] = [breakfast, morningSnack, lunch, eveningSnack, dinner];

    const dayTotalCalories = meals.reduce((s, m) => s + m.calories, 0);
    const dayTotalProtein = Math.round(meals.reduce((s, m) => s + m.protein, 0));
    const dayTotalCarbs = Math.round(meals.reduce((s, m) => s + m.carbs, 0));
    const dayTotalFat = Math.round(meals.reduce((s, m) => s + m.fat, 0));

    const tasks = [
      {
        task_type: 'meal' as const,
        title: 'Breakfast',
        description: breakfast.title,
        scheduled_time: '08:00',
        points: 15,
        required: true,
      },
      {
        task_type: 'meal' as const,
        title: 'Morning Snack',
        description: morningSnack.title,
        scheduled_time: '11:00',
        points: 10,
        required: true,
      },
      {
        task_type: 'meal' as const,
        title: 'Lunch',
        description: lunch.title,
        scheduled_time: '13:30',
        points: 15,
        required: true,
      },
      {
        task_type: 'meal' as const,
        title: 'Evening Snack',
        description: eveningSnack.title,
        scheduled_time: '17:00',
        points: 10,
        required: true,
      },
      {
        task_type: 'meal' as const,
        title: 'Dinner',
        description: dinner.title,
        scheduled_time: '20:00',
        points: 15,
        required: true,
      },
      {
        task_type: 'habit' as const,
        title: 'Drink required water',
        description: 'Hit your daily water target to stay energized',
        scheduled_time: 'Throughout Day',
        points: 10,
        required: true,
      },
      {
        task_type: 'habit' as const,
        title: 'Follow meal timings',
        description: 'Eat meals within ±30 mins of scheduled time',
        scheduled_time: 'All Day',
        points: 15,
        required: true,
      },
      {
        task_type: 'habit' as const,
        title: 'Sleep on schedule',
        description: 'Wind down and get 7-8 hours of restful sleep',
        scheduled_time: '10:30 PM',
        points: 10,
        required: true,
      },
    ];

    days.push({
      date: dateStr,
      dayName,
      dayShort,
      totalCalories: dayTotalCalories,
      totalProtein: dayTotalProtein,
      totalCarbs: dayTotalCarbs,
      totalFat: dayTotalFat,
      meals,
      tasks,
    });
  }

  return days;
}
