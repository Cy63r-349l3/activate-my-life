import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Award,
  CheckCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
  Target,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserChallengeState } from '@/lib/challenge-service';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let userId = 'demo-user-id';

  if (user) {
    userId = user.id;
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = profileData;
  }

  // Fetch real database state via getUserChallengeState
  const state = await getUserChallengeState(userId);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Activator';
  const currentDay = state.activeDayNumber;
  const currentTheme = state.currentDayTheme;
  const totalPoints = state.totalPoints;
  const streak = state.currentStreak;
  const completedCount = state.completedDaysCount;
  const progressPercentage = state.progressPercentage;
  const isTodayCompleted = state.isTodayCompleted;
  const isLocked = state.isLocked;
  const lockedUntil = state.lockedUntil;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Activation Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
            ACTION OVER INTENTION &bull; DISCIPLINE OVER MOOD
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="px-4 py-2.5 bg-[#121216] border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 rounded-xl transition-all"
          >
            Edit Profile
          </Link>
          <Link
            href="/challenge"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>{isTodayCompleted ? 'View Today’s Challenge' : isLocked ? 'View Next Challenge' : 'Continue Today’s Challenge'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Real Progress Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Day & Theme Card */}
        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Current Day
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-white">
              Day {currentDay} <span className="text-xs text-zinc-500 font-normal">/ 30</span>
            </p>
            <p className="text-[11px] text-orange-400 font-semibold uppercase tracking-wider mt-1 truncate">
              {currentTheme}
            </p>
          </div>
        </div>

        {/* Total Points Card */}
        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Points
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {totalPoints} <span className="text-xs text-amber-400 font-sans font-semibold">PTS</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Server Validated Score</p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Day Streak
            </span>
            <div className="p-2 rounded-xl bg-orange-600/10 text-orange-500">
              <Flame className="w-4 h-4 fill-orange-500/20" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {streak} <span className="text-xs text-zinc-500 font-sans font-normal">Days</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Consecutive Execution</p>
          </div>
        </div>

        {/* Days Completed Card */}
        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {completedCount} <span className="text-xs text-zinc-500 font-sans font-normal">/ 30</span>
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">
              {progressPercentage}% Total Progress
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar Component */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
          <span className="text-zinc-300">30-Day Activation Journey Progress</span>
          <span className="text-orange-400 font-mono font-bold">{completedCount} of 30 Days Completed ({progressPercentage}%)</span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden p-0.5 border border-zinc-800">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(3, progressPercentage))}%` }}
          />
        </div>
      </div>

      {/* Today's Action Journey Card */}
      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                Today&apos;s Activation Journey
              </h2>
              <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">
                Day {currentDay} — {currentTheme}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              isTodayCompleted
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                : isLocked
                ? 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                : 'bg-orange-950/60 text-orange-400 border border-orange-500/30'
            }`}
          >
            {isTodayCompleted ? 'Completed Today' : isLocked ? 'Locked' : 'Action Pending'}
          </span>
        </div>

        <div className="bg-[#181820] border border-zinc-800/60 rounded-xl p-6 md:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-base md:text-lg font-bold text-white uppercase">
                {state.dayDefinition.title}
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                {state.dayDefinition.intro}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-zinc-400">
              {isTodayCompleted
                ? 'You have submitted your official review for today. Review your answers or keep building your momentum!'
                : isLocked
                ? `Challenge locked until ${lockedUntil ? new Date(lockedUntil).toLocaleString() : 'tomorrow'}.`
                : 'Complete your Morning Plan and Evening Accountability Review to earn up to 100 PTS.'}
            </div>

            <Link
              href="/challenge"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <span>{isTodayCompleted ? 'View Day Review' : isLocked ? 'Check Status' : 'Open Day ' + currentDay + ' Challenge'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
