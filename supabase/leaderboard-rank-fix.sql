-- ============================================================
-- ACTIVATE MY LIFE: Leaderboard & Rank Fix Patch
-- Run this ENTIRE script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zaiypemnxejxwjryggtl/editor
-- ============================================================

-- STEP 1: Allow anon (unauthenticated server reads) to view profiles
-- This is needed so the server-side leaderboard query always works
-- even if the session cookie hasn't been passed correctly.
DROP POLICY IF EXISTS "Anon can view profiles for leaderboard" ON public.profiles;
CREATE POLICY "Anon can view profiles for leaderboard"
ON public.profiles FOR SELECT
TO anon
USING (true);

-- STEP 2: Create a function to recompute ranks for all users
CREATE OR REPLACE FUNCTION public.update_all_ranks()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles p
  SET rank = sub.new_rank
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (ORDER BY points DESC, streak DESC, completed_count DESC) AS new_rank
    FROM public.profiles
  ) sub
  WHERE p.id = sub.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 3: Create a trigger to update ranks after any profile points/streak change
CREATE OR REPLACE FUNCTION public.trigger_update_ranks()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.update_all_ranks();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_points_change ON public.profiles;
CREATE TRIGGER on_profile_points_change
  AFTER UPDATE OF points, streak, completed_count ON public.profiles
  FOR EACH STATEMENT EXECUTE FUNCTION public.trigger_update_ranks();

-- STEP 4: Run the rank update immediately so current data is ranked
SELECT public.update_all_ranks();

-- STEP 5: Verify your profile exists and show current state
SELECT id, full_name, username, points, streak, completed_count, rank
FROM public.profiles
ORDER BY points DESC;
