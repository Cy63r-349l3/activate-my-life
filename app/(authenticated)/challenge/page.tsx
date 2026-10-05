import React from 'react';
import { redirect } from 'next/navigation';
import {
  Sparkles,
  Flame,
  Award,
  Calendar,
  Quote,
  Target,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserChallengeState } from '@/lib/challenge-service';
import ChallengeInteractiveForm from '@/components/challenge/ChallengeInteractiveForm';
import CompletedDayCard from '@/components/challenge/CompletedDayCard';

export default async function ChallengePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasEnv && !user) {
    redirect('/login');
  }

  const userId = user?.id || 'demo-user-id';
  const state = await getUserChallengeState(userId);

  const {
    activeDayNumber,
    dayDefinition,
    isTodayCompleted,
    todaySubmission,
    totalPoints,
    currentStreak,
    completedDaysCount,
    progressPercentage,
    isLocked,
    lockedUntil,
  } = state;

  let completionStatusBadge = 'IN_PROGRESS';
  if (completedDaysCount === 0) {
    completionStatusBadge = 'NOT_STARTED';
  } else if (completedDaysCount >= 30) {
    completionStatusBadge = 'COMPLETED';
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>30-Day Challenge Engine</span>
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                completionStatusBadge === 'COMPLETED'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : completionStatusBadge === 'IN_PROGRESS'
                  ? 'bg-orange-950 text-orange-400 border border-orange-500/30'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Status: {completionStatusBadge}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
            Day {activeDayNumber} — {dayDefinition.theme}
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-medium tracking-wide mt-1">
            You are currently on Day {activeDayNumber} of 30.
          </p>
        </div>

        {/* Top Progress Stats */}
        <div className="flex items-center gap-3 bg-[#121216] border border-zinc-800/90 rounded-2xl p-4 shrink-0">
          <div className="text-center px-3">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">
              Streak
            </span>
            <span className="text-lg font-bold text-orange-400 font-mono flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-400/20" />
              {currentStreak}D
            </span>
          </div>

          <div className="border-l border-zinc-800 text-center px-3">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">
              Points
            </span>
            <span className="text-lg font-bold text-amber-400 font-mono flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              {totalPoints}
            </span>
          </div>

          <div className="border-l border-zinc-800 text-center px-3">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">
              Progress
            </span>
            <span className="text-lg font-bold text-white font-mono">
              {completedDaysCount}/30
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Banner */}
      <div className="bg-[#121216] border border-zinc-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
          <span className="text-zinc-400">Total Activation Completion</span>
          <span className="text-orange-400 font-mono">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(3, progressPercentage))}%` }}
          />
        </div>
      </div>

      {/* Daily Quote & Theme Introduction Card */}
      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
            <Quote className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              {dayDefinition.title}
            </h2>
            <blockquote className="text-xs md:text-sm italic text-zinc-300 border-l-2 border-orange-500/50 pl-3 py-0.5">
              &ldquo;{dayDefinition.quote}&rdquo;
            </blockquote>
            <p className="text-[11px] font-semibold text-orange-400 font-mono">
              &mdash; {dayDefinition.author}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 text-xs md:text-sm text-zinc-400 leading-relaxed">
          {dayDefinition.intro}
        </div>
      </div>

      {/* Main Form or Completed Card View */}
      {isTodayCompleted && todaySubmission ? (
        <CompletedDayCard
          dayNumber={activeDayNumber}
          theme={dayDefinition.theme}
          pointsEarned={todaySubmission.points_earned}
          submittedAt={todaySubmission.submitted_at}
          reflectionText={todaySubmission.reflection_text}
        />
      ) : isLocked ? (
        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 space-y-4 text-center">
          <h2 className="text-xl font-bold text-white uppercase">Challenge Locked</h2>
          <p className="text-zinc-400">
            Great work! You must wait 24 hours after completing your last challenge before starting the next one.
          </p>
          <p className="text-orange-400 font-mono text-sm mt-2">
            Available at: {lockedUntil ? new Date(lockedUntil).toLocaleString() : 'Soon'}
          </p>
        </div>
      ) : (
        <ChallengeInteractiveForm
          dayNumber={activeDayNumber}
          theme={dayDefinition.theme}
        />
      )}
    </div>
  );
}
