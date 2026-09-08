import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, anonymous_user_id, workout_type, duration_minutes, exercises_completed, total_exercises, date } = body;
    const targetUserId = userId || user_id || anonymous_user_id;

    if (!targetUserId || !isValidUUID(targetUserId)) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    const taskDate = date || new Date().toISOString().split('T')[0];
    const supabase = getServerSupabase();

    if (supabase) {
      // 1. Insert or update in workout_logs table if exists
      const { error: logError } = await (supabase as any).from('workout_logs').insert([
        {
          user_id: targetUserId,
          workout_date: taskDate,
          workout_type: workout_type || 'Full Body',
          duration_minutes: duration_minutes || 30,
          completed: true,
          exercises_completed: exercises_completed || total_exercises || 5,
          total_exercises: total_exercises || 5,
          created_at: new Date().toISOString(),
        } as any,
      ]);

      if (logError) {
        console.warn('Could not insert workout_logs row, falling back to daily_progress:', logError);
      }

      // 2. Mark workout as completed in daily_progress
      await supabase
        .from('daily_progress')
        .update({
          workout_completed: true,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('user_id', targetUserId)
        .eq('progress_date', taskDate);

      return NextResponse.json({ success: true, message: 'Workout recorded' });
    }

    return NextResponse.json({ success: true, message: 'Workout logged locally' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error logging workout';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
