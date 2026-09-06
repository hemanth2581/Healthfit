-- HEALTHFIT INITIAL SCHEMA MIGRATION
-- Compatible with PostgreSQL / Supabase with Row Level Security (RLS)

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. users_profiles
CREATE TABLE IF NOT EXISTS public.users_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id UUID UNIQUE NOT NULL,
  age INTEGER,
  sex TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  activity_level TEXT,
  goal TEXT,
  goal_pace TEXT DEFAULT 'moderate',
  diet_preference TEXT,
  cuisine_preference TEXT,
  dietary_restrictions JSONB DEFAULT '[]'::jsonb,
  workout_preference TEXT DEFAULT 'mixed',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. health_metrics
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id UUID NOT NULL,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  bmi NUMERIC,
  bmi_category TEXT,
  bmr NUMERIC,
  tdee NUMERIC,
  target_calories NUMERIC,
  protein_target_g NUMERIC,
  carbs_target_g NUMERIC,
  fat_target_g NUMERIC,
  fiber_target_g NUMERIC,
  water_target_ml INTEGER,
  sleep_target_minutes INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 3. diet_plans
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id UUID NOT NULL,
  plan_date DATE NOT NULL,
  day_name TEXT NOT NULL,
  total_calories NUMERIC,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  fiber_g NUMERIC,
  workout_plan JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. meals
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_plan_id UUID REFERENCES public.diet_plans(id) ON DELETE CASCADE,
  meal_type TEXT,
  meal_name TEXT,
  food_items JSONB,
  calories NUMERIC,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  fiber_g NUMERIC
);

-- 5. daily_progress
CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id UUID NOT NULL,
  progress_date DATE NOT NULL,
  breakfast_completed BOOLEAN DEFAULT false,
  morning_snack_completed BOOLEAN DEFAULT false,
  lunch_completed BOOLEAN DEFAULT false,
  evening_snack_completed BOOLEAN DEFAULT false,
  dinner_completed BOOLEAN DEFAULT false,
  workout_completed BOOLEAN DEFAULT false,
  water_completed_ml INTEGER DEFAULT 0,
  sleep_completed_minutes INTEGER DEFAULT 0,
  completion_percentage NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(anonymous_user_id, progress_date)
);

-- 6. weight_logs
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id UUID NOT NULL,
  weight_kg NUMERIC NOT NULL,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- 7. water_logs
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id UUID NOT NULL,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- 8. sleep_logs
CREATE TABLE IF NOT EXISTS public.sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id UUID NOT NULL,
  sleep_start TIMESTAMPTZ NOT NULL,
  sleep_end TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  quality_rating INTEGER,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES for fast lookup by anonymous_user_id
CREATE INDEX IF NOT EXISTS idx_users_profiles_anon ON public.users_profiles(anonymous_user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_anon ON public.health_metrics(anonymous_user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_anon ON public.diet_plans(anonymous_user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_anon ON public.daily_progress(anonymous_user_id, progress_date);
CREATE INDEX IF NOT EXISTS idx_weight_logs_anon ON public.weight_logs(anonymous_user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_logs_anon ON public.water_logs(anonymous_user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_anon ON public.sleep_logs(anonymous_user_id, logged_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;

-- Allow public / anon operations on own anonymous_user_id
CREATE POLICY "Allow public anon access for profiles"
  ON public.users_profiles FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public anon access for health metrics"
  ON public.health_metrics FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public anon access for diet plans"
  ON public.diet_plans FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public anon access for meals"
  ON public.meals FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public anon access for daily progress"
  ON public.daily_progress FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public anon access for weight logs"
  ON public.weight_logs FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public anon access for water logs"
  ON public.water_logs FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public anon access for sleep logs"
  ON public.sleep_logs FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
