import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/anonymousUser';
import { getTodayDateString } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date') || getTodayDateString();

  if (!userId || !isValidUUID(userId)) {
    return NextResponse.json({ error: 'Valid userId is required' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ message: 'Client mode active' }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('anonymous_user_id', userId)
      .eq('progress_date', date)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymous_user_id, ...progressData } = body;

    if (!anonymous_user_id || !isValidUUID(anonymous_user_id)) {
      return NextResponse.json({ error: 'Valid anonymous_user_id is required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Saved locally' }, { status: 200 });
    }

    const progress_date = progressData.progress_date || getTodayDateString();

    // Calculate score
    let score = 0;
    if (progressData.breakfast_completed) score += 1;
    if (progressData.morning_snack_completed) score += 1;
    if (progressData.lunch_completed) score += 1;
    if (progressData.evening_snack_completed) score += 1;
    if (progressData.dinner_completed) score += 1;
    if (progressData.workout_completed) score += 1;
    if ((progressData.water_completed_ml || 0) >= 2000) score += 1;

    const completion_percentage = Math.round((score / 7) * 100);

    const payload = {
      anonymous_user_id,
      progress_date,
      breakfast_completed: Boolean(progressData.breakfast_completed),
      morning_snack_completed: Boolean(progressData.morning_snack_completed),
      lunch_completed: Boolean(progressData.lunch_completed),
      evening_snack_completed: Boolean(progressData.evening_snack_completed),
      dinner_completed: Boolean(progressData.dinner_completed),
      workout_completed: Boolean(progressData.workout_completed),
      water_completed_ml: Number(progressData.water_completed_ml) || 0,
      sleep_completed_minutes: Number(progressData.sleep_completed_minutes) || 0,
      completion_percentage,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await (supabase
      .from('daily_progress') as any)
      .upsert(payload, { onConflict: 'anonymous_user_id,progress_date' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, progress: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating progress' }, { status: 500 });
  }
}
