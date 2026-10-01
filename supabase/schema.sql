-- ACTIVATE MY LIFE: PHASE 1 & 2 SUPABASE SCHEMA & RLS POLICIES
-- Copy & run this entire script in your Supabase SQL Editor

-- 1. ENUM FOR USER ROLES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE
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
  role user_role DEFAULT 'user' NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL,
  rank INTEGER,
  completed_count INTEGER DEFAULT 0 NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 3. USER STATS TABLE
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

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User stats are viewable by authenticated users" ON public.user_stats;
CREATE POLICY "User stats are viewable by authenticated users" 
ON public.user_stats FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
CREATE POLICY "Users can update their own stats" 
ON public.user_stats FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;
CREATE POLICY "Users can insert their own stats" 
ON public.user_stats FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 4. CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  total_days INTEGER DEFAULT 30 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Challenges viewable by all authenticated users" ON public.challenges;
CREATE POLICY "Challenges viewable by all authenticated users" 
ON public.challenges FOR SELECT 
TO authenticated 
USING (true);

-- 5. CHALLENGE DAYS TABLE
CREATE TABLE IF NOT EXISTS public.challenge_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  theme TEXT NOT NULL,
  title TEXT NOT NULL,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  action_prompt TEXT NOT NULL,
  reflection_prompt TEXT NOT NULL,
  points INTEGER DEFAULT 100 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(challenge_id, day_number)
);

ALTER TABLE public.challenge_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Challenge days viewable by all authenticated users" ON public.challenge_days;
CREATE POLICY "Challenge days viewable by all authenticated users" 
ON public.challenge_days FOR SELECT 
TO authenticated 
USING (true);

-- 6. DAILY SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.daily_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_id UUID DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
  day_number INTEGER NOT NULL,
  action_completed BOOLEAN DEFAULT false NOT NULL,
  reflection_text TEXT,
  points_earned INTEGER DEFAULT 0 NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, day_number)
);

ALTER TABLE public.daily_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own submissions" ON public.daily_submissions;
CREATE POLICY "Users can view their own submissions" 
ON public.daily_submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.daily_submissions;
CREATE POLICY "Users can insert their own submissions" 
ON public.daily_submissions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 7. POINTS TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.points_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own transactions" ON public.points_transactions;
CREATE POLICY "Users can view their own transactions" 
ON public.points_transactions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.points_transactions;
CREATE POLICY "Users can insert their own transactions" 
ON public.points_transactions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 8. BADGES TABLE
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Badges viewable by authenticated users" ON public.badges;
CREATE POLICY "Badges viewable by authenticated users" 
ON public.badges FOR SELECT 
TO authenticated 
USING (true);

-- 9. USER BADGES TABLE
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User badges viewable by authenticated users" ON public.user_badges;
CREATE POLICY "User badges viewable by authenticated users" 
ON public.user_badges FOR SELECT 
TO authenticated 
USING (true);

-- 10. COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  day_number INTEGER,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Community posts viewable by authenticated users" ON public.community_posts;
CREATE POLICY "Community posts viewable by authenticated users" 
ON public.community_posts FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can insert community posts" ON public.community_posts;
CREATE POLICY "Users can insert community posts" 
ON public.community_posts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 11. POST REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT DEFAULT 'fire' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Post reactions viewable by authenticated users" ON public.post_reactions;
CREATE POLICY "Post reactions viewable by authenticated users" 
ON public.post_reactions FOR SELECT 
TO authenticated 
USING (true);

-- 12. AUTOMATIC PROFILE & STATS CREATION TRIGGER
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

  INSERT INTO public.user_stats (user_id, current_day)
  VALUES (NEW.id, 1)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
