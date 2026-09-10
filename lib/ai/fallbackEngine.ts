import { UserContext } from './context';

/**
 * Intelligent Local Rule Engine for HealthFit AI Coach
 * Provides context-aware answers for meal substitutions, water calculations,
 * workout recovery, and habit advice when offline or when GROQ_API_KEY is unreachable.
 */

export function generateFallbackResponse(query: string, context?: UserContext | null): string {
  const q = query.toLowerCase().trim();

  const targetWater = context?.today?.waterTargetMl || context?.metrics?.waterTarget || 2500;
  const completedWater = context?.today?.waterCompletedMl || context?.todayProgress?.water_completed_ml || 0;
  const remainingWater = Math.max(0, targetWater - completedWater);

  const cal = context?.today?.totalPlannedCalories || context?.metrics?.targetCalories || 2000;
  const p = context?.metrics?.proteinTarget || 120;
  const c = context?.metrics?.carbsTarget || 210;
  const f = context?.metrics?.fatTarget || 55;
  const goal = context?.profile?.goal ? context.profile.goal.replace(/_/g, ' ') : 'fitness improvement';
  const dietPref = context?.profile?.diet_preference || 'balanced';

  // 1. Water / Hydration query
  if (q.includes('water') || q.includes('hydration') || q.includes('drink')) {
    const progressPct = Math.round((completedWater / targetWater) * 100);
    return `### 💧 Hydration Status & Guidance

- **Daily Water Target:** ${targetWater.toLocaleString()} mL
- **Logged Today:** ${completedWater.toLocaleString()} mL (${progressPct}% completed)
- **Remaining Needed:** **${remainingWater.toLocaleString()} mL**

**Actionable Advice:**
1. Aim to drink **250–350 mL** every 1.5 to 2 hours.
2. If exercising today, add **300–500 mL** around your workout window to compensate for perspiration.
3. Keep a reusable water bottle at your desk to track intake effortlessly.`;
  }

  // 2. Chicken to Paneer / Tofu / Soya Protein Substitution
  if (q.includes('chicken') && (q.includes('paneer') || q.includes('replace') || q.includes('substitute') || q.includes('tofu') || q.includes('soya'))) {
    return `### 🔄 Meal Substitution: Chicken ➔ Vegetarian Alternatives

| Source (per 100g) | Calories | Protein | Fat | Carbs |
|---|---|---|---|---|
| **Skinless Chicken Breast** | ~165 kcal | 31g | 3.6g | 0g |
| **Low-Fat Paneer** | ~190 kcal | 20g | 8g | 4g |
| **Regular Full-Fat Paneer** | ~265 kcal | 18g | 20g | 2g |
| **Firm Tofu** | ~85 kcal | 10g | 5g | 2g |
| **Soya Chunks (dry)** | ~345 kcal | 52g | 0.5g | 33g |

**Conversion Recommendations to match 30g Protein:**
- **Low-Fat Paneer:** ~150g (≈ 285 kcal)
- **Firm Tofu:** ~250g (≈ 210 kcal)
- **Soya Chunks:** ~55–60g dry weight (≈ 200 kcal)

*Tip:* Because standard paneer has higher fat than chicken, adjust cooking oil downwards by 1 tsp to keep your daily target (${cal} kcal) balanced.`;
  }

  // 3. Oats alternatives
  if (q.includes('oats') || q.includes('porridge') || q.includes('breakfast')) {
    return `### 🥣 High-Protein Breakfast Alternatives to Oats

Here are 4 excellent replacements aligned with your **${dietPref}** preferences:

1. **Vegetable Moong Dal Cheela (2 crepes)**
   - *Macros:* ~280 kcal | 18g Protein | 35g Carbs | 6g Fat
   - *Ingredients:* 60g split yellow moong batter, chopped spinach, onion, green chili.

2. **Greek Yogurt & Berry Bowl**
   - *Macros:* ~260 kcal | 22g Protein | 28g Carbs | 4g Fat
   - *Ingredients:* 170g 0% Greek yogurt, 50g fresh berries, 1 tbsp chia seeds, dash of cinnamon.

3. **Paneer / Tofu Bhurji with Whole Wheat Toast**
   - *Macros:* ~340 kcal | 24g Protein | 26g Carbs | 14g Fat
   - *Ingredients:* 100g crumbled low-fat paneer/tofu sautéed with turmeric, tomatoes, onions + 1 slice whole wheat bread.

4. **Quinoa & Vegetable Upma**
   - *Macros:* ~290 kcal | 10g Protein | 45g Carbs | 6g Fat
   - *Ingredients:* 60g raw quinoa cooked with mustard seeds, curry leaves, carrots, peas, and roasted peanuts.`;
  }

  // 4. Missed workout advice
  if (q.includes('missed') || q.includes('skip') || (q.includes('workout') && (q.includes('today') || q.includes('adjust')))) {
    const workoutTitle = context?.today?.workoutTitle || 'Scheduled Workout';
    return `### 🏋️ Missed Workout Strategy (${workoutTitle})

Don't panic! Fitness adaptation is driven by cumulative weekly consistency, not a single session.

**Recommended Action Plan:**
1. **Do NOT double up tomorrow:** Doing two full workouts in one day increases injury risk and central nervous system fatigue.
2. **Quick 12-Minute Bodyweight Routine (if you have time now):**
   - 3 rounds of: 15 Bodyweight Squats, 10 Push-ups, 20-sec Plank, 15 Glute Bridges.
3. **Nutrition Adjustment:** Maintain your protein target (**${p}g**) to support recovery, and stay within your **${cal} kcal** target.
4. **Sleep Priority:** Aim for **7–8 hours** of sleep tonight to reset hormonal recovery.`;
  }

  // 5. Late night hunger / cravings
  if (q.includes('hungry') || q.includes('night') || q.includes('craving') || q.includes('dinner')) {
    return `### 🌙 Managing Post-Dinner Hunger & Cravings

1. **Check Hydration:** Mild dehydration frequently masquerades as hunger. Drink a tall glass of warm water or peppermint tea first and wait 10 minutes.
2. **Review Dinner Protein & Fiber:** Ensure your evening meal contains at least 25–30g protein and adequate dietary fiber to stimulate satiety hormones.
3. **Smart Low-Calorie Snacks (Under 100 kcal):**
   - 100g 0% Fat Greek Yogurt with cinnamon (≈ 60 kcal, 10g protein)
   - 20g Roasted Makhana / Fox nuts with pink salt (≈ 70 kcal)
   - 1 boiled egg white (≈ 17 kcal, 4g protein)
   - Cucumber slices with lemon and chaat masala (≈ 15 kcal)`;
  }

  // 6. Calorie / Macro Target query
  if (q.includes('calorie') || q.includes('target') || q.includes('macro') || q.includes('protein') || q.includes('tdee') || q.includes('bmr')) {
    return `### 📊 Your Personalized HealthFit Nutritional Targets

- **Daily Calorie Target:** **${cal.toLocaleString()} kcal**
- **Protein Goal:** **${p}g** (${Math.round(p * 4)} kcal, ~${Math.round(((p * 4) / cal) * 100)}% of diet)
- **Carbohydrates Goal:** **${c}g** (${Math.round(c * 4)} kcal, ~${Math.round(((c * 4) / cal) * 100)}% of diet)
- **Healthy Fats Goal:** **${f}g** (${Math.round(f * 9)} kcal, ~${Math.round(((f * 9) / cal) * 100)}% of diet)
- **Fiber Minimum:** **${context?.metrics?.fiberTarget || 30}g / day**
- **Daily Water Target:** **${targetWater.toLocaleString()} mL**

*These values are calibrated specifically for your goal of **${goal}**.*`;
  }

  // 7. Today's meals scheduled
  if (q.includes('meal') || q.includes('eat today') || q.includes('schedule') || q.includes('plan')) {
    const meals = context?.today?.meals || [];
    if (meals.length > 0) {
      const mealList = meals
        .map((m) => `- **${m.mealType.toUpperCase()}**: ${m.mealName} (${m.calories} kcal, ${m.protein}g protein) [${m.completed ? '✅ Done' : '⏳ Scheduled'}]`)
        .join('\n');
      return `### 🍽️ Today's Scheduled Meal Plan (${context?.today?.dayName || 'Today'})\n\n${mealList}\n\n- **Total Planned Energy:** ${cal} kcal\n- **Protein Target:** ${p}g\n- **Hydration Logged:** ${completedWater} / ${targetWater} mL`;
    }
  }

  // 8. General HealthFit Guidance
  return `### 💡 HealthFit AI Coach Advice

Here is a summary of your active health plan (**${goal}**):

- **Target Calories:** ${cal.toLocaleString()} kcal / day
- **Protein Target:** ${p}g / day
- **Hydration Status:** ${completedWater.toLocaleString()} / ${targetWater.toLocaleString()} mL
- **Workout Status:** ${context?.today?.workoutCompleted ? '✅ Completed' : `Scheduled (${context?.today?.workoutTitle || 'Cardio & Strength'})`}

You can ask me specific questions such as:
- *"Can I replace chicken with paneer or tofu?"*
- *"What are high-protein alternatives to oats?"*
- *"How much water do I have left to drink today?"*
- *"What should I do if I missed today's workout?"*`;
}
