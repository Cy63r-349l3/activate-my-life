import { createClient } from '@/lib/supabase/server';
import { getDayDefinition, DayDefinition } from '@/lib/challenge-data';

export interface MorningPlanInput {
  priority_1: string;
  even_if: string;
  uncomfortable_action: string;
  move_body_plan: string;
  learn_plan: string;
  impact_plan: string;
}

export interface EveningReviewInput {
  moved_body: boolean;
  learned_text: string;
  created_value: boolean;
  took_action: boolean;
  kept_word: boolean;
  best_thing: string;
  opportunity_noticed: string;
  procrastinated_text: string;
  better_tomorrow: string;
  gratitude_text: string;
  first_action_tomorrow: string;
  daily_score: number; // 1 to 10
}

export interface FinalReviewInput {
  physical_changes?: string;
  mental_changes?: string;
  professional_changes?: string;
  relationship_changes?: string;
  confidence_changes?: string;
  what_to_stop?: string;
  what_to_continue?: string;
  what_to_start?: string;
  next_30_day_commitment?: string;
}

export interface SubmissionPayload {
  morning: MorningPlanInput;
  evening: EveningReviewInput;
  finalReview?: FinalReviewInput;
}

export interface UserChallengeState {
  userId: string;
  activeDayNumber: number;
  currentDayTheme: string;
  dayDefinition: DayDefinition;
  isTodayCompleted: boolean;
  todaySubmission: any | null;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  completedDaysCount: number;
  progressPercentage: number;
  isLocked: boolean;
  lockedUntil: string | null;
}

export async function getUserChallengeState(userId: string): Promise<UserChallengeState> {
  const supabase = await createClient();

  // 1. Get or initialize user_stats (only use columns that exist in the live DB)
  let { data: stats } = await supabase
    .from('user_stats')
    .select('user_id, total_points, current_streak, longest_streak, updated_at')
    .eq('user_id', userId)
    .single();

  if (!stats) {
    const { data: newStats } = await supabase
      .from('user_stats')
      .insert({
        user_id: userId,
        challenge_id: '00000000-0000-0000-0000-000000000000',
        total_points: 0,
        current_streak: 0,
        longest_streak: 0,
      } as any)
      .select('user_id, total_points, current_streak, longest_streak, updated_at')
      .single();
    stats = newStats;
  }

  // 2. Fetch all daily submissions for user
  const { data: submissions } = await supabase
    .from('daily_submissions')
    .select('*')
    .eq('user_id', userId)
    .order('day_number', { ascending: true });

  const completedSubmissions = submissions || [];
  const completedDaysCount = completedSubmissions.length;

  // Determine active day: next uncompleted day (1 to 30)
  let activeDayNumber = Math.min(30, completedDaysCount + 1);

  // Check if today's active day has already been completed
  const todaySubmission = completedSubmissions.find(
    (s) => s.day_number === activeDayNumber
  );
  const isTodayCompleted = Boolean(todaySubmission);

  // If day 30 is already completed, activeDayNumber stays 30 and isTodayCompleted is true
  if (completedDaysCount >= 30) {
    activeDayNumber = 30;
  }

  let isLocked = false;
  let lockedUntil = null;
  
  // Find the most recent submission
  const lastSubmission = completedSubmissions.length > 0 
    ? completedSubmissions[completedSubmissions.length - 1]
    : null;

  if (lastSubmission && !isTodayCompleted) {
    const lastSubmissionTime = new Date(lastSubmission.submitted_at).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (now - lastSubmissionTime < twentyFourHours) {
      isLocked = true;
      lockedUntil = new Date(lastSubmissionTime + twentyFourHours).toISOString();
    }
  }

  const dayDefinition = getDayDefinition(activeDayNumber);
  const totalPoints = stats?.total_points ?? 0;
  const currentStreak = stats?.current_streak ?? 0;
  const longestStreak = stats?.longest_streak ?? 0;

  const progressPercentage = Math.round((completedDaysCount / 30) * 100);

  return {
    userId,
    activeDayNumber,
    currentDayTheme: dayDefinition.theme,
    dayDefinition,
    isTodayCompleted,
    todaySubmission: todaySubmission || null,
    totalPoints,
    currentStreak,
    longestStreak,
    completedDaysCount,
    progressPercentage,
    isLocked,
    lockedUntil,
  };
}

export async function submitDailyChallengeServer(
  userId: string,
  payload: SubmissionPayload
): Promise<{ success: boolean; pointsEarned: number; activeDayNumber: number; message?: string }> {
  const supabase = await createClient();

  // 1. Validate user and get official server state
  const state = await getUserChallengeState(userId);

  if (state.isTodayCompleted) {
    return {
      success: false,
      pointsEarned: 0,
      activeDayNumber: state.activeDayNumber,
      message: `Day ${state.activeDayNumber} has already been officially completed. Duplicate points are not allowed.`,
    };
  }

  const activeDayNumber = state.activeDayNumber;
  const { morning, evening } = payload;

  // 2. SERVER-SIDE POINT CALCULATION (Max 100 points)
  let pointsEarned = 0;

  // Move Body (20 pts)
  if (evening.moved_body || morning.move_body_plan?.trim()) {
    pointsEarned += 20;
  }

  // Activate Mind (20 pts)
  if (evening.learned_text?.trim() || morning.learn_plan?.trim()) {
    pointsEarned += 20;
  }

  // Uncomfortable Action (20 pts)
  if (evening.took_action || morning.uncomfortable_action?.trim()) {
    pointsEarned += 20;
  }

  // Create Value (20 pts)
  if (evening.created_value || morning.impact_plan?.trim()) {
    pointsEarned += 20;
  }

  // Daily Review completed (10 pts)
  if (evening.best_thing?.trim() || evening.gratitude_text?.trim()) {
    pointsEarned += 10;
  }

  // Daily Score submitted (10 pts)
  if (evening.daily_score >= 1 && evening.daily_score <= 10) {
    pointsEarned += 10;
  }

  // Cap max points at 100
  pointsEarned = Math.min(100, Math.max(0, pointsEarned));

  // 3. Upsert into daily_submissions
  // Using a per-day UUID derived from day_number to avoid the unique constraint
  // collision when all days share the same dummy challenge_id / challenge_day_id.
  const reflectionData = JSON.stringify(payload);
  const dummyChallengeId = '00000000-0000-0000-0000-000000000000';
  // Build a deterministic UUID per day: 00000000-0000-0000-0000-<day padded to 12 digits>
  const perDayId = `00000000-0000-0000-0000-${String(activeDayNumber).padStart(12, '0')}`;

  const todayDateStr = new Date().toISOString().split('T')[0];
  const { error: subError } = await supabase.from('daily_submissions').upsert({
    user_id: userId,
    challenge_id: dummyChallengeId,
    challenge_day_id: perDayId,
    day_id: perDayId,
    day_number: activeDayNumber,
    action_completed: true,
    reflection_text: reflectionData,
    points_earned: pointsEarned,
    activity_date: todayDateStr,
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  } as any, {
    onConflict: 'user_id,challenge_id,challenge_day_id',
  });

  if (subError) {
    console.error('Failed to insert daily submission:', subError);
    return {
      success: false,
      pointsEarned: 0,
      activeDayNumber,
      message: subError.message || 'Failed to record daily submission.',
    };
  }

  // 4. Insert points_transaction
  await supabase.from('points_transactions').insert({
    user_id: userId,
    amount: pointsEarned,
    reason: `Completed Day ${activeDayNumber} Activation`,
  });

  // 5. Update user_stats & calculate streak (only columns that exist in live DB)
  const { data: currentStats } = await supabase
    .from('user_stats')
    .select('user_id, total_points, current_streak, longest_streak, updated_at')
    .eq('user_id', userId)
    .single();

  let newStreak = (currentStats?.current_streak || 0) + 1;
  let penaltyPoints = 0;

  // Use updated_at to detect if last submission was yesterday or earlier to break streak
  if (currentStats?.updated_at) {
    const lastDate = new Date(currentStats.updated_at);
    const todayDate = new Date();
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 1) {
      newStreak = 1;
      penaltyPoints = 10;
    }
  }

  if (penaltyPoints > 0) {
    await supabase.from('points_transactions').insert({
      user_id: userId,
      amount: -penaltyPoints,
      reason: `Missed a day before Day ${activeDayNumber} Activation`,
    });
  }

  const newLongestStreak = Math.max(currentStats?.longest_streak || 0, newStreak);
  const newTotalPoints = Math.max(0, (currentStats?.total_points || 0) + pointsEarned - penaltyPoints);

  await supabase
    .from('user_stats')
    .update({
      total_points: newTotalPoints,
      current_streak: newStreak,
      longest_streak: newLongestStreak,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  // 6. Sync profile table
  await supabase
    .from('profiles')
    .update({
      points: newTotalPoints,
      streak: newStreak,
      completed_count: state.completedDaysCount + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return {
    success: true,
    pointsEarned,
    activeDayNumber,
  };
}
