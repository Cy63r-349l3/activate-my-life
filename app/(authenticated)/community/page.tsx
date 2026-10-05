import React from 'react';
import { Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserChallengeState } from '@/lib/challenge-service';
import { fetchCommunityPostsAction } from '@/app/actions/community';
import CommunityFeed from '@/components/community/CommunityFeed';

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userId = 'demo-user';
  if (user) userId = user.id;

  const [posts, state] = await Promise.all([
    fetchCommunityPostsAction(),
    getUserChallengeState(userId),
  ]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Social Accountability Feed</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
          Activation Community
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
          Daily Reflections Feed &bull; Encouragement &bull; Collective Momentum
        </p>
      </div>

      {/* Main Community Feed */}
      <CommunityFeed initialPosts={posts} activeDayNumber={state.activeDayNumber} />
    </div>
  );
}
