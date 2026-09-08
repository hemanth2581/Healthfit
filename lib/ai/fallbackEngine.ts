import { UserContext } from './context';

/**
 * Intelligent Local Rule Engine for HealthFit AI Coach
 * Provides immediate answers for meal substitutions, water calculations,
 * workout recovery, and habit advice when offline or when GROQ_API_KEY is not set.
 */

export function generateFallbackResponse(query: string, context?: UserContext | null): string {
  const q = query.toLowerCase().trim();

  // 1. Water query
  if (q.includes('water') || q.includes('hydration') || q.includes('drink')) {
    const target = context?.metrics?.waterTarget || 2500;
    const completed = context?.todayProgress?.water_completed_ml || 0;
    const remaining = Math.max(0, target - completed);
    return `### 💧 Hydration Status & Guidance\n\n- **Target:** ${target.toLocaleString()} ml / day\n- **Logged Today:** ${completed.toLocaleString()} ml\n- **Remaining:** ${remaining.toLocaleString()} ml\n\n**Recommendation:** Aim to sip 250–500 ml every 2 hours. If exercising, drink an extra 250–500 ml around your workout session.`;
  }

  // 2. Chicken to Paneer / Protein substitution
  if (q.includes('chicken') && (q.includes('paneer') || q.includes('replace') || q.includes('substitute'))) {
    return `### 🔄 Meal Substitution: Chicken ➔ Paneer / Tofu\n\nYes! You can substitute 150g of Chicken Breast with **120g of low-fat Paneer** or **150g of Firm Tofu**.\n\n- **Protein parity:** ~30–35g protein.\n- **Note on fats:** Paneer is higher in dietary fats than lean chicken, so reduce cooking oil slightly by 1 tsp to keep daily caloric balance intact.`;
  }

  // 3. Oats replacement
  if (q.includes('oats') || q.includes('porridge')) {
    return `### 🥣 Oats Substitution Alternatives\n\nHere are excellent complex carbohydrate breakfast replacements that match similar fiber and glycemic profiles:\n\n1. **Vegetable Poha (150g cooked)** + 2 Boiled Eggs or 50g Paneer.\n2. **Steamed Idli (2–3 pcs)** + 150ml Vegetable Sambar.\n3. **Whole Wheat Toast (2 slices)** with 2 scrambled eggs or tofu bhurji.\n4. **Quinoa Upma (150g cooked)** tempered with mustard seeds and roasted peanuts.`;
  }

  // 4. Missed workout advice
  if (q.includes('missed') || q.includes('skip') || (q.includes('workout') && q.includes('today'))) {
    return `### 🏋️ Missed Workout Strategy\n\nDon't worry! Consistency across the week is what drives long-term transformation.\n\n**Action Plan:**\n1. **Do not double up tomorrow:** Overtraining increases injury risk and fatigue.\n2. **Quick 15-min movement:** If you have 15 minutes right now, do 3 rounds of 15 bodyweight squats, 10 push-ups, and a 30-second plank.\n3. **Stay on track with nutrition & hydration:** Hit your protein target and get 7–8 hours of sleep tonight.`;
  }

  // 5. Hungry after dinner / late night cravings
  if (q.includes('hungry') || q.includes('night') || q.includes('craving')) {
    return `### 🌙 Managing Late Night Hunger\n\nIf you feel hungry after dinner, consider these factors:\n\n1. **Protein & Fiber Check:** Ensure your dinner contains at least 25–35g protein and high-fiber greens (like spinach or salad) for satiety.\n2. **Hydration:** Dehydration is often mistaken for hunger. Drink a warm glass of water or chamomile tea.\n3. **Safe bedtime snack:** If genuinely hungry, have **100g Greek yogurt**, **1 boiled egg white**, or a **small handful of roasted makhana (15g)**.`;
  }

  // 6. Calorie / Macro Target query
  if (q.includes('calorie') || q.includes('target') || q.includes('macro') || q.includes('protein')) {
    const cal = context?.metrics?.targetCalories || 2000;
    const p = context?.metrics?.proteinTarget || 120;
    const c = context?.metrics?.carbsTarget || 210;
    const f = context?.metrics?.fatTarget || 55;
    return `### 📊 Your Daily Nutritional Targets\n\n- **Daily Calories:** ${cal.toLocaleString()} kcal\n- **Protein:** ${p}g (${Math.round(p * 4)} kcal)\n- **Carbohydrates:** ${c}g (${Math.round(c * 4)} kcal)\n- **Healthy Fats:** ${f}g (${Math.round(f * 9)} kcal)\n\nThese values are calculated based on your biometric profile and fitness goal.`;
  }

  // 7. General Fallback Guidance
  return `### 💡 HealthFit AI Coach Advice\n\nI am analyzing your current plan (**${context?.profile?.goal?.replace('_', ' ') || 'general wellness'}**):\n\n- **Daily Calories:** ${context?.metrics?.targetCalories || 2000} kcal\n- **Hydration:** ${(context?.todayProgress?.water_completed_ml || 0)} / ${(context?.metrics?.waterTarget || 2500)} ml\n- **Workout:** ${context?.todayProgress?.workout_completed ? 'Completed ✓' : 'Scheduled'}\n\n*Tip: You can ask specific questions like "Can I replace chicken with paneer?", "How much water do I have left?", or "What should I do if I missed my workout?"*`;
}
