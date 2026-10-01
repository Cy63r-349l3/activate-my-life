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

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let stats = null;

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = profileData;

    const { data: statsData } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();
    stats = statsData;
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Activator';
  const currentDay = stats?.current_day || 0;
  const totalPoints = profile?.points ?? stats?.total_points ?? 0;
  const streak = profile?.streak ?? stats?.current_streak ?? 0;
  const completedCount = profile?.completed_count ?? stats?.completed_days ?? 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 1 Dashboard</span>
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
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <span>Start Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Day Card */}
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
            <p className="text-[11px] text-zinc-500 mt-1">Personal Activation Journey</p>
          </div>
        </div>

        {/* Points Card */}
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
            <p className="text-[11px] text-zinc-500 mt-1">Server Validated Points</p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Day Streak
            </span>
            <div className="p-2 rounded-xl bg-orange-600/10 text-orange-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-white">
              {streak} <span className="text-xs text-zinc-500 font-normal">Days</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Consecutive Execution</p>
          </div>
        </div>

        {/* Completed Card */}
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
            <p className="text-2xl md:text-3xl font-extrabold text-white">
              {completedCount} <span className="text-xs text-zinc-500 font-normal">/ 30</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Challenges Submitted</p>
          </div>
        </div>
      </div>

      {/* Today's Challenge Section */}
      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                Today&apos;s Challenge
              </h2>
              <p className="text-xs text-zinc-400">Phase 1 Activation Journey Placeholder</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-mono">
            Phase 1 Ready
          </span>
        </div>

        <div className="bg-[#181820] border border-zinc-800/60 rounded-xl p-6 md:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white uppercase">
            Your daily activation journey will appear here.
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Phase 1 technical foundation complete. The full 30-day challenge submission engine, reflective journal forms, and daily prompt delivery will unlock in Phase 2.
          </p>
          <div className="pt-2">
            <Link
              href="/challenge"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-all"
            >
              <span>Explore Challenge Structure</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
