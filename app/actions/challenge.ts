'use server';

import { createClient } from '@/lib/supabase/server';
import { submitDailyChallengeServer, SubmissionPayload } from '@/lib/challenge-service';

export async function submitDailyChallengeAction(payload: SubmissionPayload) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'Unauthenticated user session. Please sign in again.',
    };
  }

  try {
    const result = await submitDailyChallengeServer(user.id, payload);
    return result;
  } catch (err: any) {
    console.error('Error submitting daily challenge:', err);
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred during challenge submission.',
    };
  }
}
