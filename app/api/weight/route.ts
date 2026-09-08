import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, anonymous_user_id, weight_kg, date } = body;
    const targetUserId = userId || user_id || anonymous_user_id;

    if (!targetUserId || !isValidUUID(targetUserId)) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    if (!weight_kg || typeof weight_kg !== 'number' || weight_kg <= 20 || weight_kg >= 400) {
      return NextResponse.json({ error: 'Valid weight between 20kg and 400kg is required' }, { status: 400 });
    }

    const logDate = date || new Date().toISOString().split('T')[0];
    const supabase = getServerSupabase();

    if (supabase) {
      // 1. Insert into weight_logs table
      await (supabase as any).from('weight_logs').insert([
        {
          user_id: targetUserId,
          weight_kg,
          logged_date: logDate,
          created_at: new Date().toISOString(),
        } as any,
      ]);

      // 2. Update current profile weight
      await supabase
        .from('profiles')
        .update({
          weight: weight_kg,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('user_id', targetUserId);

      return NextResponse.json({ success: true, weight_kg, message: 'Weight logged successfully' });
    }

    return NextResponse.json({ success: true, weight_kg, message: 'Weight logged locally' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error recording weight';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
