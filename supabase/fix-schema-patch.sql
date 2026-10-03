-- ============================================================
-- ACTIVATE MY LIFE: Schema Fix Patch
-- Run this in Supabase SQL Editor to fix auth/login issues
-- ============================================================

-- STEP 1: Add missing columns to user_stats table
ALTER TABLE public.user_stats
  ADD COLUMN IF NOT EXISTS current_day INTEGER DEFAULT 1 NOT NULL,
  ADD COLUMN IF NOT EXISTS completed_days INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS last_submission_date DATE;

-- STEP 2: Insert missing profile for the existing confirmed user
INSERT INTO public.profiles (id, full_name, username, role)
VALUES (
  '679a8fe2-a314-44b3-aa21-c04459e454df',
  'Adamu',
  'cyber',
  'user'
)
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Insert missing user_stats for the existing confirmed user
INSERT INTO public.user_stats (user_id, current_day, total_points, current_streak, longest_streak, completed_days)
VALUES (
  '679a8fe2-a314-44b3-aa21-c04459e454df',
  1, 0, 0, 0, 0
)
ON CONFLICT (user_id) DO NOTHING;

-- STEP 4: Recreate the handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Activation User'),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTRING(NEW.id::text, 1, 8))),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_stats (user_id, current_day, total_points, current_streak, longest_streak, completed_days)
  VALUES (NEW.id, 1, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
