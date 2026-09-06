import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/anonymousUser';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || !isValidUUID(userId)) {
    return NextResponse.json({ error: 'Valid userId required' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ message: 'Client mode' }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('anonymous_user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ metrics: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymous_user_id, metrics, profile } = body;

    if (!anonymous_user_id || !isValidUUID(anonymous_user_id)) {
      return NextResponse.json({ error: 'Valid anonymous_user_id required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Saved locally' }, { status: 200 });
    }

    const payload = {
      anonymous_user_id,
      weight_kg: profile?.weight_kg || metrics.weight_kg,
      height_cm: profile?.height_cm || metrics.height_cm,
      bmi: metrics.bmi,
      bmi_category: metrics.bmiCategory,
      bmr: metrics.bmr,
      tdee: metrics.tdee,
      target_calories: metrics.targetCalories,
      protein_target_g: metrics.proteinTarget,
      carbs_target_g: metrics.carbohydrateTarget,
      fat_target_g: metrics.fatTarget,
      fiber_target_g: metrics.fiberTarget,
      water_target_ml: metrics.waterTarget,
      sleep_target_minutes: metrics.sleepTargetMinutes,
      recorded_at: new Date().toISOString(),
    };

    const { data, error } = await (supabase
      .from('health_metrics') as any)
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, metrics: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
