import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/storage/anonymousUser';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || searchParams.get('user_id');

  if (!userId || !isValidUUID(userId)) {
    return NextResponse.json({ error: 'Valid userId is required' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ message: 'Database not connected (client mode active)' }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, anonymous_user_id, ...profileData } = body;
    const targetUserId = userId || user_id || anonymous_user_id;

    if (!targetUserId || !isValidUUID(targetUserId)) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Saved locally' }, { status: 200 });
    }

    const payload = {
      user_id: targetUserId,
      age: Number(profileData.age) || 25,
      gender: String(profileData.gender || profileData.sex || 'male'),
      height: Number(profileData.height || profileData.height_cm) || 175,
      height_unit: String(profileData.height_unit || 'cm'),
      weight: Number(profileData.weight || profileData.weight_kg) || 70,
      weight_unit: String(profileData.weight_unit || 'kg'),
      goal: String(profileData.goal || 'lose_weight'),
      activity_level: String(profileData.activity_level || 'moderately_active'),
      diet_type: String(profileData.diet_type || profileData.diet_preference || 'non_vegetarian'),
      allergies: profileData.allergies || profileData.dietary_restrictions || [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload as any, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
