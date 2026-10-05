import React from 'react';
import {
  Award,
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  Crown,
  Trophy,
  Star,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserChallengeState } from '@/lib/challenge-service';

export default async function BadgesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userId = 'demo-user';
  if (user) userId = user.id;

  const state = await getUserChallengeState(userId);
  const totalPoints = state.totalPoints;
  const streak = state.currentStreak;
  const completedCount = state.completedDaysCount;

  // Define badges list with server-calculated unlock status
  const badges = [
    {
      id: 'day-1',
      name: 'Day 1 Initiated',
      description: 'Completed your first daily activation review.',
      category: 'Milestone',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      unlocked: completedCount >= 1,
      requirement: 'Complete Day 1 Challenge',
      progress: Math.min(100, (completedCount / 1) * 100),
    },
    {
      id: 'streak-3',
      name: '3-Day Fire',
      description: 'Maintained a 3-consecutive-day execution streak.',
      category: 'Streak',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      unlocked: streak >= 3,
      requirement: 'Achieve a 3-Day Streak',
      progress: Math.min(100, (streak / 3) * 100),
    },
    {
      id: 'streak-7',
      name: '7-Day Unstoppable',
      description: 'Completed 7 full days of unbroken discipline.',
      category: 'Streak',
      icon: ShieldCheck,
      color: 'from-blue-500 to-indigo-600',
      unlocked: streak >= 7 || completedCount >= 7,
      requirement: '7 Days Completed',
      progress: Math.min(100, (completedCount / 7) * 100),
    },
    {
      id: 'halfway-14',
      name: '14-Day Warrior',
      description: 'Reached the halfway mark of the 30-Day Activation.',
      category: 'Milestone',
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      unlocked: completedCount >= 14,
      requirement: '14 Days Completed',
      progress: Math.min(100, (completedCount / 14) * 100),
    },
    {
      id: 'points-500',
      name: '500 PTS Veteran',
      description: 'Earned 500+ points through daily commitment.',
      category: 'Points',
      icon: Star,
      color: 'from-emerald-500 to-teal-600',
      unlocked: totalPoints >= 500,
      requirement: 'Earn 500 Total Points',
      progress: Math.min(100, (totalPoints / 500) * 100),
    },
    {
      id: 'points-1000',
      name: '1000 PTS Club',
      description: 'Reached the 1,000 points elite milestone.',
      category: 'Points',
      icon: Award,
      color: 'from-amber-400 to-yellow-600',
      unlocked: totalPoints >= 1000,
      requirement: 'Earn 1000 Total Points',
      progress: Math.min(100, (totalPoints / 1000) * 100),
    },
    {
      id: 'master-30',
      name: '30-Day Activation Master',
      description: 'Finished the entire 30-Day Personal Activation Journey!',
      category: 'Mastery',
      icon: Trophy,
      color: 'from-yellow-400 via-amber-500 to-orange-600',
      unlocked: completedCount >= 30,
      requirement: 'Complete all 30 Days',
      progress: Math.min(100, (completedCount / 30) * 100),
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Achievement Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
            Activation Badges
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
            Milestones &bull; Discipline Badges &bull; Mastery Unlockables
          </p>
        </div>

        <div className="px-5 py-3 bg-[#121216] border border-zinc-800 rounded-2xl flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Unlocked</p>
            <p className="text-xl font-extrabold text-white font-mono">
              {unlockedCount} <span className="text-xs text-zinc-500 font-normal">/ {badges.length}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden group ${
                badge.unlocked
                  ? 'bg-[#121218] border-orange-500/30 hover:border-orange-500/60 shadow-lg shadow-orange-500/5'
                  : 'bg-[#0e0e12] border-zinc-800/60 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Card Backdrop Glow if unlocked */}
              {badge.unlocked && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none" />
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                      badge.unlocked
                        ? `bg-gradient-to-br ${badge.color}`
                        : 'bg-zinc-800/80 text-zinc-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      badge.unlocked
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-800/60 border border-zinc-700/40 text-zinc-500'
                    }`}
                  >
                    {badge.unlocked ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <span>Requirement</span>
                  <span className="text-orange-400 font-mono">{Math.round(badge.progress)}%</span>
                </div>

                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-zinc-700'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, badge.progress))}%` }}
                  />
                </div>

                <p className="text-[11px] text-zinc-500 italic">{badge.requirement}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
