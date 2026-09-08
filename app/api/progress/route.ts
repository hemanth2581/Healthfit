import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';
import { getTodayDateString } from '@/lib/utils/dates';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || searchParams.get('user_id');
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
      .eq('user_id', userId)
      .eq('progress_date', date)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error fetching progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, anonymous_user_id, ...progressData } = body;
    const targetUserId = userId || user_id || anonymous_user_id;

    if (!targetUserId || !isValidUUID(targetUserId)) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Saved locally' }, { status: 200 });
    }

    const progress_date = progressData.progress_date || getTodayDateString();

    const payload = {
      user_id: targetUserId,
      progress_date,
      total_tasks: Number(progressData.total_tasks) || 8,
      completed_tasks: Number(progressData.completed_tasks) || 0,
      points_earned: Number(progressData.points_earned) || 0,
      water_intake: Number(progressData.water_intake) || 0,
      water_target: Number(progressData.water_target) || 2500,
      day_completed: Boolean(progressData.day_completed),
      completed_at: progressData.day_completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('daily_progress')
      .upsert(payload as any, { onConflict: 'user_id,progress_date' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, progress: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error updating progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
