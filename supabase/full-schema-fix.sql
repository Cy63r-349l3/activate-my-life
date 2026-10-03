-- ============================================================
-- ACTIVATE MY LIFE: FULL SCHEMA & COLUMN FIX SCRIPT (v8)
-- Copy and run this entire SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zaiypemnxejxwjryggtl/editor
-- ============================================================

-- 1. RESTRUCTURE USER_STATS PRIMARY KEY (Removes challenge_id from primary key)
ALTER TABLE public.user_stats DROP CONSTRAINT IF EXISTS user_stats_pkey CASCADE;
ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_pkey PRIMARY KEY (user_id);

-- 2. MAKE CHALLENGE_ID OPTIONAL WITH DEFAULT
ALTER TABLE public.user_stats DROP CONSTRAINT IF EXISTS user_stats_challenge_id_fkey CASCADE;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS challenge_id UUID DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE public.user_stats ALTER COLUMN challenge_id DROP NOT NULL;
ALTER TABLE public.user_stats ALTER COLUMN challenge_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;

-- 3. PROFILES TABLE & CONVERT ROLE TO TEXT
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  country TEXT,
  city TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL,
  rank INTEGER,
  completed_count INTEGER DEFAULT 0 NOT NULL
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role TYPE text USING role::text;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 4. USER STATS TABLE & COLUMNS
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_day INTEGER DEFAULT 1 NOT NULL,
  total_points INTEGER DEFAULT 0 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  completed_days INTEGER DEFAULT 0 NOT NULL,
  last_submission_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS current_day INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS completed_days INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User stats are viewable by authenticated users" ON public.user_stats;
CREATE POLICY "User stats are viewable by authenticated users" 
ON public.user_stats FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
CREATE POLICY "Users can update their own stats" 
ON public.user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;
CREATE POLICY "Users can insert their own stats" 
ON public.user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 5. DAILY SUBMISSIONS TABLE & COLUMNS
CREATE TABLE IF NOT EXISTS public.daily_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_id UUID DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
  day_number INTEGER NOT NULL,
  action_completed BOOLEAN DEFAULT false NOT NULL,
  reflection_text TEXT,
  points_earned INTEGER DEFAULT 0 NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.daily_submissions ADD COLUMN IF NOT EXISTS day_id UUID DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL;
ALTER TABLE public.daily_submissions ADD COLUMN IF NOT EXISTS day_number INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE public.daily_submissions ADD COLUMN IF NOT EXISTS action_completed BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE public.daily_submissions ADD COLUMN IF NOT EXISTS reflection_text TEXT;
ALTER TABLE public.daily_submissions ADD COLUMN IF NOT EXISTS points_earned INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.daily_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own submissions" ON public.daily_submissions;
CREATE POLICY "Users can view their own submissions" 
ON public.daily_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.daily_submissions;
CREATE POLICY "Users can insert their own submissions" 
ON public.daily_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 6. INSERT PROFILE FOR YOUR ACCOUNT (Adamu)
INSERT INTO public.profiles (id, full_name, username)
SELECT '679a8fe2-a314-44b3-aa21-c04459e454df', 'Adamu', 'cyber'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = '679a8fe2-a314-44b3-aa21-c04459e454df'
);

-- 7. INSERT STATS FOR YOUR ACCOUNT
INSERT INTO public.user_stats (user_id, current_day, total_points, current_streak, longest_streak, completed_days)
SELECT '679a8fe2-a314-44b3-aa21-c04459e454df', 1, 0, 0, 0, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_stats WHERE user_id = '679a8fe2-a314-44b3-aa21-c04459e454df'
);

-- Done!
