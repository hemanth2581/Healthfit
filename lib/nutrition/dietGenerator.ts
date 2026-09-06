import { AllergyRestriction, CuisinePreference, DietPreference, Goal } from '@/types/health';
import { DayDietPlan, FoodItem, Meal, MealFoodPortion, MealType, WeeklyPlan } from '@/types/nutrition';
import { FOOD_DATABASE, getFilteredFoods } from './foodDatabase';
import { generateWeeklyWorkouts } from './fitnessGenerator';

interface MealTemplateItem {
  foodId: string;
  defaultPortion: number; // in servingSize units (e.g., 1.5 = 1.5 * servingSize)
  isScalable?: boolean;
}

interface MealTemplate {
  name: string;
  mealType: MealType;
  items: MealTemplateItem[];
  cuisine: CuisinePreference;
  dietTypes: DietPreference[];
  allergens: AllergyRestriction[];
}

// Curated rotation templates tailored for balanced macros
const MEAL_TEMPLATES: Record<MealType, MealTemplate[]> = {
  breakfast: [
    {
      name: 'Power Rolled Oats & Banana Bowl',
      mealType: 'breakfast',
      cuisine: 'international',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: [],
      items: [
        { foodId: 'carb-oats', defaultPortion: 1.5, isScalable: true },
        { foodId: 'dairy-milk', defaultPortion: 1.0, isScalable: false },
        { foodId: 'fruit-banana', defaultPortion: 1.0, isScalable: false },
        { foodId: 'nut-almonds', defaultPortion: 1.0, isScalable: false },
        { foodId: 'nut-chia-seeds', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Traditional Steamed Idli & Sambar',
      mealType: 'breakfast',
      cuisine: 'south_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: [],
      items: [
        { foodId: 'carb-idli', defaultPortion: 1.5, isScalable: true },
        { foodId: 'prot-sambar', defaultPortion: 1.2, isScalable: false },
        { foodId: 'prot-coconut-chutney', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Crispy Dosa with Sambar & Chutney',
      mealType: 'breakfast',
      cuisine: 'south_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: [],
      items: [
        { foodId: 'carb-dosa', defaultPortion: 1.5, isScalable: true },
        { foodId: 'prot-sambar', defaultPortion: 1.2, isScalable: false },
        { foodId: 'prot-coconut-chutney', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Homestyle Vegetable Poha with Peanuts',
      mealType: 'breakfast',
      cuisine: 'north_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['nuts'],
      items: [
        { foodId: 'carb-poha', defaultPortion: 1.3, isScalable: true },
        { foodId: 'nut-roasted-peanuts', defaultPortion: 1.0, isScalable: false },
        { foodId: 'fruit-pomegranate', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'South Indian Rava Upma & Chutney',
      mealType: 'breakfast',
      cuisine: 'south_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['gluten'],
      items: [
        { foodId: 'carb-upma', defaultPortion: 1.3, isScalable: true },
        { foodId: 'prot-sambar', defaultPortion: 1.0, isScalable: false },
        { foodId: 'fruit-apple', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'High-Protein Boiled Eggs & Whole Grain Toast',
      mealType: 'breakfast',
      cuisine: 'international',
      dietTypes: ['non_vegetarian', 'eggetarian'],
      allergens: ['eggs', 'gluten'],
      items: [
        { foodId: 'prot-eggs-boiled', defaultPortion: 1.0, isScalable: false },
        { foodId: 'carb-whole-wheat-bread', defaultPortion: 1.0, isScalable: true },
        { foodId: 'fruit-orange', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Vegan Tofu Scramble & Avocado/Olive Toast',
      mealType: 'breakfast',
      cuisine: 'international',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['soy', 'gluten'],
      items: [
        { foodId: 'prot-tofu', defaultPortion: 1.2, isScalable: true },
        { foodId: 'carb-whole-wheat-bread', defaultPortion: 1.0, isScalable: false },
        { foodId: 'veg-spinach', defaultPortion: 0.8, isScalable: false },
        { foodId: 'fat-olive-oil', defaultPortion: 1.0, isScalable: false },
      ],
    },
  ],
  morning_snack: [
    {
      name: 'Fresh Seasonal Fruit & Soaked Almonds',
      mealType: 'morning_snack',
      cuisine: 'mixed',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['nuts'],
      items: [
        { foodId: 'fruit-apple', defaultPortion: 1.0, isScalable: false },
        { foodId: 'nut-almonds', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Papaya Cubes & Chia Water',
      mealType: 'morning_snack',
      cuisine: 'mixed',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: [],
      items: [
        { foodId: 'fruit-papaya', defaultPortion: 1.0, isScalable: false },
        { foodId: 'nut-chia-seeds', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Greek Yogurt with Pomegranate',
      mealType: 'morning_snack',
      cuisine: 'mixed',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy'],
      items: [
        { foodId: 'prot-greek-yogurt', defaultPortion: 1.0, isScalable: true },
        { foodId: 'fruit-pomegranate', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Spiced Buttermilk (Chaas) & Walnuts',
      mealType: 'morning_snack',
      cuisine: 'indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy', 'nuts'],
      items: [
        { foodId: 'prot-buttermilk', defaultPortion: 1.0, isScalable: false },
        { foodId: 'nut-walnuts', defaultPortion: 1.0, isScalable: false },
      ],
    },
  ],
  lunch: [
    {
      name: 'Dal Tadka, Roti, Mixed Sabzi & Curd',
      mealType: 'lunch',
      cuisine: 'north_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy', 'gluten'],
      items: [
        { foodId: 'carb-roti', defaultPortion: 2.0, isScalable: true },
        { foodId: 'prot-yellow-dal', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-mixed-sabzi', defaultPortion: 1.0, isScalable: false },
        { foodId: 'prot-greek-yogurt', defaultPortion: 0.8, isScalable: false },
        { foodId: 'veg-cucumber-salad', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Brown Rice with Rajma Masala & Salad',
      mealType: 'lunch',
      cuisine: 'north_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: [],
      items: [
        { foodId: 'carb-brown-rice', defaultPortion: 1.2, isScalable: true },
        { foodId: 'prot-rajma', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-cucumber-salad', defaultPortion: 1.0, isScalable: false },
        { foodId: 'fat-olive-oil', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'South Indian Rice, Sambar, Palak Poriyal & Curd',
      mealType: 'lunch',
      cuisine: 'south_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy'],
      items: [
        { foodId: 'carb-white-rice', defaultPortion: 1.2, isScalable: true },
        { foodId: 'prot-sambar', defaultPortion: 1.3, isScalable: false },
        { foodId: 'veg-spinach', defaultPortion: 1.0, isScalable: false },
        { foodId: 'prot-greek-yogurt', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Grilled Chicken Breast, Brown Rice & Steamed Broccoli',
      mealType: 'lunch',
      cuisine: 'international',
      dietTypes: ['non_vegetarian'],
      allergens: [],
      items: [
        { foodId: 'prot-chicken-breast', defaultPortion: 1.2, isScalable: true },
        { foodId: 'carb-brown-rice', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-broccoli', defaultPortion: 1.0, isScalable: false },
        { foodId: 'fat-olive-oil', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Pan-Seared Fish Fillet with Quinoa & Greens',
      mealType: 'lunch',
      cuisine: 'international',
      dietTypes: ['non_vegetarian'],
      allergens: ['seafood'],
      items: [
        { foodId: 'prot-fish-fillet', defaultPortion: 1.2, isScalable: true },
        { foodId: 'carb-quinoa', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-cucumber-salad', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Chole Chickpea Curry with Roti & Salad',
      mealType: 'lunch',
      cuisine: 'north_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['gluten'],
      items: [
        { foodId: 'carb-roti', defaultPortion: 2.0, isScalable: true },
        { foodId: 'prot-chole', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-cucumber-salad', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'High-Protein Soya Chunk Curry with Brown Rice',
      mealType: 'lunch',
      cuisine: 'indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['soy'],
      items: [
        { foodId: 'prot-soya-chunks', defaultPortion: 1.2, isScalable: true },
        { foodId: 'carb-brown-rice', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-spinach', defaultPortion: 1.0, isScalable: false },
      ],
    },
  ],
  evening_snack: [
    {
      name: 'Roasted Peanuts & Green Tea / Lemon Water',
      mealType: 'evening_snack',
      cuisine: 'mixed',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['nuts'],
      items: [
        { foodId: 'nut-roasted-peanuts', defaultPortion: 1.2, isScalable: false },
        { foodId: 'fruit-orange', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Boiled Egg Whites with Pepper & Salt',
      mealType: 'evening_snack',
      cuisine: 'international',
      dietTypes: ['non_vegetarian', 'eggetarian'],
      allergens: ['eggs'],
      items: [
        { foodId: 'prot-egg-whites', defaultPortion: 1.2, isScalable: true },
        { foodId: 'fruit-apple', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Greek Yogurt with Chia & Berries',
      mealType: 'evening_snack',
      cuisine: 'international',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy'],
      items: [
        { foodId: 'prot-greek-yogurt', defaultPortion: 1.0, isScalable: true },
        { foodId: 'nut-chia-seeds', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Watermelon Slices & Pumpkin / Walnut Seeds',
      mealType: 'evening_snack',
      cuisine: 'mixed',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['nuts'],
      items: [
        { foodId: 'fruit-watermelon', defaultPortion: 1.0, isScalable: false },
        { foodId: 'nut-walnuts', defaultPortion: 0.8, isScalable: false },
      ],
    },
  ],
  dinner: [
    {
      name: 'Paneer Bhurji / Palak Paneer with Roti & Salad',
      mealType: 'dinner',
      cuisine: 'north_indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy', 'gluten'],
      items: [
        { foodId: 'prot-paneer', defaultPortion: 1.2, isScalable: true },
        { foodId: 'carb-roti', defaultPortion: 2.0, isScalable: true },
        { foodId: 'veg-spinach', defaultPortion: 1.0, isScalable: false },
        { foodId: 'veg-cucumber-salad', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Grilled Herb Chicken with Sweet Potato & Veggies',
      mealType: 'dinner',
      cuisine: 'international',
      dietTypes: ['non_vegetarian'],
      allergens: [],
      items: [
        { foodId: 'prot-chicken-breast', defaultPortion: 1.2, isScalable: true },
        { foodId: 'carb-sweet-potato', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-broccoli', defaultPortion: 1.0, isScalable: false },
        { foodId: 'fat-olive-oil', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Tofu Palak with Brown Rice / Roti',
      mealType: 'dinner',
      cuisine: 'indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['soy'],
      items: [
        { foodId: 'prot-tofu', defaultPortion: 1.3, isScalable: true },
        { foodId: 'carb-brown-rice', defaultPortion: 1.0, isScalable: true },
        { foodId: 'veg-spinach', defaultPortion: 1.0, isScalable: false },
        { foodId: 'veg-cucumber-salad', defaultPortion: 1.0, isScalable: false },
      ],
    },
    {
      name: 'Moong Dal Khichdi with Steamed Veggies & Ghee',
      mealType: 'dinner',
      cuisine: 'indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy'],
      items: [
        { foodId: 'carb-white-rice', defaultPortion: 0.8, isScalable: true },
        { foodId: 'prot-yellow-dal', defaultPortion: 1.2, isScalable: true },
        { foodId: 'veg-mixed-sabzi', defaultPortion: 1.0, isScalable: false },
        { foodId: 'fat-ghee', defaultPortion: 0.8, isScalable: false },
      ],
    },
    {
      name: 'Quinoa Veggie Stir Fry with Soya Chunks',
      mealType: 'dinner',
      cuisine: 'international',
      dietTypes: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      allergens: ['soy'],
      items: [
        { foodId: 'carb-quinoa', defaultPortion: 1.2, isScalable: true },
        { foodId: 'prot-soya-chunks', defaultPortion: 1.0, isScalable: true },
        { foodId: 'veg-mixed-sabzi', defaultPortion: 1.0, isScalable: false },
      ],
    },
  ],
  bedtime_snack: [
    {
      name: 'Warm Toned Milk with Turmeric & Almonds',
      mealType: 'bedtime_snack',
      cuisine: 'indian',
      dietTypes: ['vegetarian', 'non_vegetarian', 'eggetarian'],
      allergens: ['dairy', 'nuts'],
      items: [
        { foodId: 'dairy-milk', defaultPortion: 1.0, isScalable: false },
        { foodId: 'nut-almonds', defaultPortion: 0.5, isScalable: false },
      ],
    },
  ],
};

function isTemplateCompatible(
  template: MealTemplate,
  dietPreference: DietPreference,
  restrictions: AllergyRestriction[],
  cuisinePreference?: CuisinePreference
): boolean {
  if (!template.dietTypes.includes(dietPreference)) return false;

  // Check template allergens
  if (restrictions.length > 0) {
    const hasRestrictedAllergen = template.allergens.some((a) => restrictions.includes(a));
    if (hasRestrictedAllergen) return false;
  }

  // Check every individual item in the template against FOOD_DATABASE
  for (const item of template.items) {
    const food = FOOD_DATABASE.find((f) => f.id === item.foodId);
    if (!food) return false;
    if (!food.dietTypes.includes(dietPreference)) return false;
    if (restrictions.length > 0) {
      if (food.allergens.some((a) => restrictions.includes(a))) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Scale food items in a meal to hit a specific target calorie allotment for that meal.
 */
function compileMealFromTemplate(
  template: MealTemplate,
  targetMealCalories: number,
  dietPreference: DietPreference,
  restrictions: AllergyRestriction[]
): Meal {
  // First compute baseline macros
  let baselineCalories = 0;
  let baselineProtein = 0;
  let baselineCarbs = 0;
  let baselineFat = 0;
  let baselineFiber = 0;

  const rawPortions: { food: FoodItem; portion: number; isScalable: boolean }[] = [];

  for (const item of template.items) {
    let food = FOOD_DATABASE.find((f) => f.id === item.foodId);
    if (!food) continue;

    // If dairy milk is in the template but dairy is restricted or user is vegan, replace with almond/soy milk or safe beverage
    if (restrictions.includes('dairy') || dietPreference === 'vegan') {
      if (food.id === 'dairy-milk') {
        const replacement = FOOD_DATABASE.find(
          (f) => f.id === 'dairy-soy-milk' && (!restrictions.includes('soy'))
        ) || FOOD_DATABASE.find(
          (f) => f.id === 'dairy-almond-milk' && (!restrictions.includes('nuts'))
        ) || FOOD_DATABASE.find((f) => f.category === 'fruits');
        if (replacement) food = replacement;
      }
      if (food.id === 'prot-greek-yogurt' || food.id === 'fat-ghee' || food.id === 'prot-buttermilk') {
        const replacement = FOOD_DATABASE.find(
          (f) => f.id === 'prot-tofu' || f.id === 'fat-olive-oil' || f.id === 'fruit-papaya'
        );
        if (replacement) food = replacement;
      }
    }

    const portionMultiplier = item.defaultPortion;
    rawPortions.push({
      food,
      portion: portionMultiplier,
      isScalable: item.isScalable ?? true,
    });

    baselineCalories += food.calories * portionMultiplier;
    baselineProtein += food.protein * portionMultiplier;
    baselineCarbs += food.carbs * portionMultiplier;
    baselineFat += food.fat * portionMultiplier;
    baselineFiber += food.fiber * portionMultiplier;
  }

  // Calculate scaling factor
  let scale = baselineCalories > 0 ? targetMealCalories / baselineCalories : 1.0;
  // Keep scaling within realistic physical portion limits (0.6x to 2.2x)
  scale = Math.max(0.6, Math.min(scale, 2.2));

  const foodItems: MealFoodPortion[] = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  for (const p of rawPortions) {
    const itemScale = p.isScalable ? scale : 1.0;
    const finalQuantity = Math.round(p.food.servingSize * p.portion * itemScale);
    const itemRatio = finalQuantity / p.food.servingSize;

    const cal = Math.round(p.food.calories * itemRatio);
    const prot = Math.round(p.food.protein * itemRatio * 10) / 10;
    const carbs = Math.round(p.food.carbs * itemRatio * 10) / 10;
    const fat = Math.round(p.food.fat * itemRatio * 10) / 10;
    const fib = Math.round(p.food.fiber * itemRatio * 10) / 10;

    foodItems.push({
      foodId: p.food.id,
      name: p.food.name,
      quantity: finalQuantity,
      unit: p.food.servingUnit,
      calories: cal,
      protein: prot,
      carbs,
      fat,
      fiber: fib,
    });

    totalCalories += cal;
    totalProtein += prot;
    totalCarbs += carbs;
    totalFat += fat;
    totalFiber += fib;
  }

  return {
    mealType: template.mealType,
    mealName: template.name,
    foodItems,
    totalCalories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10,
  };
}

/**
 * Generate a single day's plan with 5 balanced meals.
 */
export function generateDayDietPlan(
  dayName: DayDietPlan['dayName'],
  targetCalories: number,
  proteinTarget: number,
  dietPreference: DietPreference,
  cuisinePreference: CuisinePreference,
  restrictions: AllergyRestriction[],
  waterTargetMl: number,
  sleepTargetMinutes: number,
  rotationIndex: number = 0
): DayDietPlan {
  // Calorie allocations:
  // Breakfast: 24%
  // Morning Snack: 8%
  // Lunch: 34%
  // Evening Snack: 8%
  // Dinner: 26%
  const breakfastTarget = Math.round(targetCalories * 0.24);
  const morningSnackTarget = Math.round(targetCalories * 0.08);
  const lunchTarget = Math.round(targetCalories * 0.34);
  const eveningSnackTarget = Math.round(targetCalories * 0.08);
  const dinnerTarget = Math.round(targetCalories * 0.26);

  const getCompatibleTemplates = (mealType: MealType): MealTemplate[] => {
    const list = MEAL_TEMPLATES[mealType] || [];
    const compatible = list.filter((t) =>
      isTemplateCompatible(t, dietPreference, restrictions, cuisinePreference)
    );

    if (compatible.length > 0) {
      // Prioritize chosen cuisine if available
      const cuisineMatched = compatible.filter(
        (t) => t.cuisine === cuisinePreference || t.cuisine === 'mixed' || t.cuisine === 'indian'
      );
      return cuisineMatched.length > 0 ? cuisineMatched : compatible;
    }

    // Fallback: build a generic dynamic meal from available filtered foods
    const safeFoods = getFilteredFoods(dietPreference, restrictions);
    const fallbackFood = safeFoods[0] || FOOD_DATABASE[0];
    return [
      {
        name: `Nutritious ${mealType.replace('_', ' ')} Plate`,
        mealType,
        cuisine: cuisinePreference,
        dietTypes: [dietPreference],
        allergens: [],
        items: [{ foodId: fallbackFood.id, defaultPortion: 1.5, isScalable: true }],
      },
    ];
  };

  const breakfastTemplates = getCompatibleTemplates('breakfast');
  const morningSnackTemplates = getCompatibleTemplates('morning_snack');
  const lunchTemplates = getCompatibleTemplates('lunch');
  const eveningSnackTemplates = getCompatibleTemplates('evening_snack');
  const dinnerTemplates = getCompatibleTemplates('dinner');

  const bTemplate = breakfastTemplates[rotationIndex % breakfastTemplates.length];
  const msTemplate = morningSnackTemplates[rotationIndex % morningSnackTemplates.length];
  const lTemplate = lunchTemplates[rotationIndex % lunchTemplates.length];
  const esTemplate = eveningSnackTemplates[rotationIndex % eveningSnackTemplates.length];
  const dTemplate = dinnerTemplates[rotationIndex % dinnerTemplates.length];

  const breakfast = compileMealFromTemplate(bTemplate, breakfastTarget, dietPreference, restrictions);
  const morningSnack = compileMealFromTemplate(msTemplate, morningSnackTarget, dietPreference, restrictions);
  const lunch = compileMealFromTemplate(lTemplate, lunchTarget, dietPreference, restrictions);
  const eveningSnack = compileMealFromTemplate(esTemplate, eveningSnackTarget, dietPreference, restrictions);
  const dinner = compileMealFromTemplate(dTemplate, dinnerTarget, dietPreference, restrictions);

  const meals = [breakfast, morningSnack, lunch, eveningSnack, dinner];

  const totalCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);
  const protein = Math.round(meals.reduce((sum, m) => sum + m.protein, 0) * 10) / 10;
  const carbs = Math.round(meals.reduce((sum, m) => sum + m.carbs, 0) * 10) / 10;
  const fat = Math.round(meals.reduce((sum, m) => sum + m.fat, 0) * 10) / 10;
  const fiber = Math.round(meals.reduce((sum, m) => sum + m.fiber, 0) * 10) / 10;

  return {
    dayName,
    meals,
    totalCalories,
    protein,
    carbs,
    fat,
    fiber,
    waterTargetMl,
    sleepTargetMinutes,
  };
}

/**
 * Generate a complete 7-Day Plan (Monday through Sunday) with daily meal rotation and workouts.
 */
export function generateWeeklyPlan(
  targetCalories: number,
  proteinTarget: number,
  dietPreference: DietPreference,
  cuisinePreference: CuisinePreference,
  restrictions: AllergyRestriction[],
  waterTargetMl: number,
  sleepTargetMinutes: number,
  activityLevel: any = 'moderately_active',
  goal: Goal = 'maintain_weight'
): WeeklyPlan {
  const days: DayDietPlan['dayName'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const workouts = generateWeeklyWorkouts(activityLevel, goal);

  const dayPlans: DayDietPlan[] = days.map((dayName, idx) => {
    const dayPlan = generateDayDietPlan(
      dayName,
      targetCalories,
      proteinTarget,
      dietPreference,
      cuisinePreference,
      restrictions,
      waterTargetMl,
      sleepTargetMinutes,
      idx
    );
    dayPlan.workoutPlan = workouts[dayName];
    return dayPlan;
  });

  const avgCalories = Math.round(dayPlans.reduce((sum, d) => sum + d.totalCalories, 0) / 7);
  const avgProtein = Math.round(dayPlans.reduce((sum, d) => sum + d.protein, 0) / 7);
  const avgCarbs = Math.round(dayPlans.reduce((sum, d) => sum + d.carbs, 0) / 7);
  const avgFat = Math.round(dayPlans.reduce((sum, d) => sum + d.fat, 0) / 7);
  const avgFiber = Math.round(dayPlans.reduce((sum, d) => sum + d.fiber, 0) / 7);

  return {
    days: dayPlans,
    generatedAt: new Date().toISOString(),
    summary: {
      avgCalories,
      avgProtein,
      avgCarbs,
      avgFat,
      avgFiber,
    },
  };
}
