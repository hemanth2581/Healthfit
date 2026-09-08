import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || searchParams.get('user_id');

  if (!userId || !isValidUUID(userId)) {
    return NextResponse.json({ error: 'Valid userId required' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ message: 'Client mode' }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('health_targets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ targets: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error fetching targets';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
