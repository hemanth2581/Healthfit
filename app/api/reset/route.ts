import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, anonymous_user_id } = body;
    const targetUserId = userId || user_id || anonymous_user_id;

    if (!targetUserId || !isValidUUID(targetUserId)) {
      return NextResponse.json({ error: 'Valid user ID required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (supabase) {
      await Promise.all([
        supabase.from('profiles').delete().eq('user_id', targetUserId),
        supabase.from('health_targets').delete().eq('user_id', targetUserId),
        supabase.from('diet_plans').delete().eq('user_id', targetUserId),
        supabase.from('daily_tasks').delete().eq('user_id', targetUserId),
        supabase.from('daily_progress').delete().eq('user_id', targetUserId),
        supabase.from('streaks').delete().eq('user_id', targetUserId),
      ]);
    }

    return NextResponse.json({ success: true, message: 'All user data cleared' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error clearing user data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
