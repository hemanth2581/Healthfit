import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/anonymousUser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymous_user_id } = body;

    if (!anonymous_user_id || !isValidUUID(anonymous_user_id)) {
      return NextResponse.json({ error: 'Valid anonymous_user_id required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (supabase) {
      await Promise.all([
        supabase.from('users_profiles').delete().eq('anonymous_user_id', anonymous_user_id),
        supabase.from('health_metrics').delete().eq('anonymous_user_id', anonymous_user_id),
        supabase.from('diet_plans').delete().eq('anonymous_user_id', anonymous_user_id),
        supabase.from('daily_progress').delete().eq('anonymous_user_id', anonymous_user_id),
        supabase.from('weight_logs').delete().eq('anonymous_user_id', anonymous_user_id),
        supabase.from('water_logs').delete().eq('anonymous_user_id', anonymous_user_id),
        supabase.from('sleep_logs').delete().eq('anonymous_user_id', anonymous_user_id),
      ]);
    }

    return NextResponse.json({ success: true, message: 'All user data cleared' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error clearing user data' }, { status: 500 });
  }
}
