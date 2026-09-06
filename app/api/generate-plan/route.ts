import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/anonymousUser';
import { calculateAllHealthMetrics } from '@/lib/nutrition/calculations';
import { generateWeeklyPlan } from '@/lib/nutrition/dietGenerator';
import { UserProfile } from '@/types/health';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymous_user_id, profile } = body as { anonymous_user_id: string; profile: UserProfile };

    if (!anonymous_user_id || !isValidUUID(anonymous_user_id)) {
      return NextResponse.json({ error: 'Valid anonymous_user_id is required' }, { status: 400 });
    }

    if (!profile || !profile.weight_kg || !profile.height_cm || !profile.age) {
      return NextResponse.json({ error: 'Incomplete profile data provided' }, { status: 422 });
    }

    // 1. Calculate health metrics
    const metrics = calculateAllHealthMetrics(
      profile.weight_kg,
      profile.height_cm,
      profile.age,
      profile.sex,
      profile.activity_level,
      profile.goal,
      profile.goal_pace || 'moderate'
    );

    // 2. Generate 7-day plan
    const weeklyPlan = generateWeeklyPlan(
      metrics.targetCalories,
      metrics.proteinTarget,
      profile.diet_preference,
      profile.cuisine_preference,
      profile.dietary_restrictions || [],
      metrics.waterTarget,
      metrics.sleepTargetMinutes,
      profile.activity_level,
      profile.goal
    );

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        // Clear previous diet plans for this user to avoid stale plans
        await (supabase.from('diet_plans') as any).delete().eq('anonymous_user_id', anonymous_user_id);

        const today = new Date();

        // Insert each day's plan and meals
        for (let i = 0; i < weeklyPlan.days.length; i++) {
          const dayPlan = weeklyPlan.days[i];
          const planDate = new Date(today);
          planDate.setDate(today.getDate() + i);
          const dateString = planDate.toISOString().split('T')[0];

          const { data: insertedPlan, error: planError } = await (supabase
            .from('diet_plans') as any)
            .insert({
              anonymous_user_id,
              plan_date: dateString,
              day_name: dayPlan.dayName,
              total_calories: dayPlan.totalCalories,
              protein_g: dayPlan.protein,
              carbs_g: dayPlan.carbs,
              fat_g: dayPlan.fat,
              fiber_g: dayPlan.fiber,
            })
            .select()
            .single();

          if (!planError && insertedPlan) {
            const mealsToInsert = dayPlan.meals.map((m) => ({
              diet_plan_id: insertedPlan.id,
              meal_type: m.mealType,
              meal_name: m.mealName,
              food_items: m.foodItems as any,
              calories: m.totalCalories,
              protein_g: m.protein,
              carbs_g: m.carbs,
              fat_g: m.fat,
              fiber_g: m.fiber,
            }));

            await (supabase.from('meals') as any).insert(mealsToInsert);
          }
        }
      } catch (dbErr) {
        console.warn('Supabase plan persistence warning (client will use generated payload):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      metrics,
      weeklyPlan,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error generating plan' }, { status: 500 });
  }
}
