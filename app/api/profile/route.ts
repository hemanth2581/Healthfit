import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { fullOnboardingSchema } from '@/lib/validation';
import { isValidUUID } from '@/lib/anonymousUser';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || !isValidUUID(userId)) {
    return NextResponse.json({ error: 'Valid userId is required' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ message: 'Database not connected (client mode active)' }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('users_profiles')
      .select('*')
      .eq('anonymous_user_id', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymous_user_id, ...profileData } = body;

    if (!anonymous_user_id || !isValidUUID(anonymous_user_id)) {
      return NextResponse.json({ error: 'Valid anonymous_user_id is required' }, { status: 400 });
    }

    const validated = fullOnboardingSchema.safeParse(profileData);
    if (!validated.success) {
      return NextResponse.json({ error: 'Validation failed', details: validated.error.format() }, { status: 422 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Saved locally' }, { status: 200 });
    }

    const payload = {
      anonymous_user_id,
      age: validated.data.age,
      sex: validated.data.sex,
      height_cm: validated.data.height_cm,
      weight_kg: validated.data.weight_kg,
      activity_level: validated.data.activity_level,
      goal: validated.data.goal,
      goal_pace: validated.data.goal_pace,
      diet_preference: validated.data.diet_preference,
      cuisine_preference: validated.data.cuisine_preference,
      dietary_restrictions: validated.data.dietary_restrictions as any,
      workout_preference: validated.data.workout_preference,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await (supabase
      .from('users_profiles') as any)
      .upsert(payload, { onConflict: 'anonymous_user_id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
