import React from 'react';
import {
  CheckCircle2,
  Award,
  Calendar,
  Flame,
  Sun,
  Moon,
  Sparkles,
  Lock,
} from 'lucide-react';

interface CompletedDayCardProps {
  dayNumber: number;
  theme: string;
  pointsEarned: number;
  submittedAt: string;
  reflectionText: string | null;
}

export default function CompletedDayCard({
  dayNumber,
  theme,
  pointsEarned,
  submittedAt,
  reflectionText,
}: CompletedDayCardProps) {
  let parsedData: any = null;
  try {
    if (reflectionText) {
      parsedData = JSON.parse(reflectionText);
    }
  } catch {
    parsedData = null;
  }

  const morning = parsedData?.morning || {};
  const evening = parsedData?.evening || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Status Header Banner */}
      <div className="bg-[#121216] border border-emerald-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Day {dayNumber} Completed</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
              Day {dayNumber} — {theme}
            </h2>
            <p className="text-xs text-zinc-400">
              Submitted on{' '}
              {new Date(submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#181820] border border-zinc-800 rounded-xl px-5 py-3 shrink-0">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
              Points Earned
            </span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              +{pointsEarned} <span className="text-xs font-sans text-zinc-400">PTS</span>
            </span>
          </div>
          {evening.daily_score && (
            <div className="border-l border-zinc-700 pl-4 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Score
              </span>
              <span className="text-2xl font-extrabold text-orange-400 font-mono">
                {evening.daily_score}/10
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lock Notice */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            This challenge day has been officially scored and completed. Additional points cannot be awarded for re-opening.
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
          Verified
        </span>
      </div>

      {/* Submitted Review Record */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
          <Sun className="w-4 h-4 text-orange-400" />
          <span>Your Submitted Record</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {morning.priority_1 && (
            <div className="p-3 bg-[#18181f] border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                #1 Priority Today
              </span>
              <p className="text-zinc-200">{morning.priority_1}</p>
            </div>
          )}

          {morning.uncomfortable_action && (
            <div className="p-3 bg-[#18181f] border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Uncomfortable Action Taken
              </span>
              <p className="text-zinc-200">{morning.uncomfortable_action}</p>
            </div>
          )}

          {evening.learned_text && (
            <div className="p-3 bg-[#18181f] border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                What I Learned
              </span>
              <p className="text-zinc-200">{evening.learned_text}</p>
            </div>
          )}

          {evening.best_thing && (
            <div className="p-3 bg-[#18181f] border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Best Thing Done
              </span>
              <p className="text-zinc-200">{evening.best_thing}</p>
            </div>
          )}

          {evening.gratitude_text && (
            <div className="p-3 bg-[#18181f] border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Grateful For
              </span>
              <p className="text-zinc-200">{evening.gratitude_text}</p>
            </div>
          )}

          {evening.first_action_tomorrow && (
            <div className="p-3 bg-[#18181f] border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Tomorrow&apos;s First Action
              </span>
              <p className="text-zinc-200">{evening.first_action_tomorrow}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
