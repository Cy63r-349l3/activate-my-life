import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export default function BadgesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Achievements</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
          Activation Badges
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
          Milestones &bull; Discipline Badges &bull; Mastery Unlockables
        </p>
      </div>

      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-8 md:p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
          <Award className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white uppercase">
          Phase 1 Foundation Placeholder
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          The achievement badge collection engine and unlockable milestone rewards will be implemented in later phases.
        </p>
      </div>
    </div>
  );
}
