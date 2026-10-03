'use server';

import { createClient } from '@/lib/supabase/server';
import { submitDailyChallengeServer, SubmissionPayload } from '@/lib/challenge-service';

export async function submitDailyChallengeAction(payload: SubmissionPayload): Promise<{
  success: boolean;
  pointsEarned?: number;
  activeDayNumber?: number;
  message?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Unauthenticated user session. Please sign in again.',
      error: 'Unauthenticated user session. Please sign in again.',
    };
  }

  try {
    const result = await submitDailyChallengeServer(user.id, payload);
    return {
      ...result,
      error: result.message,
    };
  } catch (err: any) {
    console.error('Error submitting daily challenge:', err);
    return {
      success: false,
      message: err?.message || 'An unexpected error occurred during challenge submission.',
      error: err?.message || 'An unexpected error occurred during challenge submission.',
    };
  }
}
