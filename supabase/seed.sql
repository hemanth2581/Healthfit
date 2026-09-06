-- HEALTHFIT SEED DATA
-- Default demonstration data for quick manual database verification

INSERT INTO public.users_profiles (
  anonymous_user_id,
  age,
  sex,
  height_cm,
  weight_kg,
  activity_level,
  goal,
  goal_pace,
  diet_preference,
  cuisine_preference,
  dietary_restrictions,
  workout_preference
) VALUES (
  'e0a3b2b4-5f8e-4a67-b892-0b1a2c3d4e5f',
  26,
  'male',
  178,
  75.0,
  'moderately_active',
  'lose_weight',
  'moderate',
  'non_vegetarian',
  'indian',
  '[]'::jsonb,
  'mixed'
) ON CONFLICT (anonymous_user_id) DO NOTHING;
