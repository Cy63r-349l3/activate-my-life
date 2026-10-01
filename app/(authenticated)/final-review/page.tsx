import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export default function FinalReviewPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Day 30 Conclusion</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
          Final Activation Review
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
          30-Day Synthesis &bull; Certificate Generation &bull; Long-term Blueprint
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
          The 30-day final review synthesis and graduation certificate generator will unlock upon completing all 30 days of activation in Phase 2.
        </p>
      </div>
    </div>
  );
}
