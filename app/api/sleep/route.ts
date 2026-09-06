import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/anonymousUser';
import { sleepLogSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || !isValidUUID(userId)) {
    return NextResponse.json({ error: 'Valid userId required' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ logs: [] }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('anonymous_user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ logs: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymous_user_id, ...sleepData } = body;

    if (!anonymous_user_id || !isValidUUID(anonymous_user_id)) {
      return NextResponse.json({ error: 'Valid anonymous_user_id required' }, { status: 400 });
    }

    const validated = sleepLogSchema.safeParse(sleepData);
    if (!validated.success) {
      return NextResponse.json({ error: 'Validation failed', details: validated.error.format() }, { status: 422 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Saved locally' }, { status: 200 });
    }

    const { data, error } = await (supabase
      .from('sleep_logs') as any)
      .insert({
        anonymous_user_id,
        sleep_start: validated.data.sleep_start,
        sleep_end: validated.data.sleep_end,
        duration_minutes: validated.data.duration_minutes,
        quality_rating: validated.data.quality_rating || null,
        notes: validated.data.notes || null,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, log: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error logging sleep' }, { status: 500 });
  }
}
