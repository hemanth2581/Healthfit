import { NextRequest, NextResponse } from 'next/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';
import { calculateAllTargets } from '@/lib/nutrition/calculations';
import { generate7DayPlan } from '@/lib/nutrition/dietGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, anonymous_user_id, profile } = body;
    let targetUserId = userId || user_id || anonymous_user_id;
    if (!targetUserId || !isValidUUID(targetUserId)) {
      targetUserId = crypto.randomUUID();
    }

    if (!profile || !profile.weight_kg || !profile.height_cm || !profile.age) {
      return NextResponse.json({ error: 'Incomplete profile data provided' }, { status: 422 });
    }

    const targets = calculateAllTargets(
      profile.age,
      profile.sex || profile.gender || 'male',
      profile.height_cm,
      profile.weight_kg,
      profile.goal || 'lose_weight',
      profile.activity_level || 'moderately_active'
    );

    const plan = generate7DayPlan({
      targetCalories: targets.dailyCalories,
      proteinTarget: targets.proteinTarget,
      dietType: profile.diet_type || profile.diet_preference || 'non_vegetarian',
      allergies: profile.allergies || profile.dietary_restrictions || [],
    });

    return NextResponse.json({
      success: true,
      targets,
      plan,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error generating plan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
