import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, anonymous_user_id, amount_ml, date } = body;
    const targetUserId = userId || user_id || anonymous_user_id;

    if (!targetUserId || !isValidUUID(targetUserId)) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    const taskDate = date || new Date().toISOString().split('T')[0];
    const supabase = getServerSupabase();

    if (supabase) {
      const { data: existing } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('progress_date', taskDate)
        .maybeSingle();

      const newWater = ((existing as any)?.water_intake || 0) + (amount_ml || 250);

      await supabase
        .from('daily_progress')
        .update({
          water_intake: newWater,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('user_id', targetUserId)
        .eq('progress_date', taskDate);

      return NextResponse.json({ success: true, water_intake: newWater });
    }

    return NextResponse.json({ success: true, message: 'Updated locally' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error updating water';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
