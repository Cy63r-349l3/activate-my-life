import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Global Ranking</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
          Activation Leaderboard
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
          Server Validated Points &bull; Streak Rankings &bull; Peer Accountability
        </p>
      </div>

      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-8 md:p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
          <Trophy className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white uppercase">
          Phase 1 Foundation Placeholder
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          The global points leaderboard, streak standings, and peer achievement rankings will be connected to live database aggregates in Phase 2.
        </p>
      </div>
    </div>
  );
}
