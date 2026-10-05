import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Target,
  Trophy,
  Compass,
  Zap,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: topUsers } = await supabase
    .from('profiles')
    .select('id, full_name, username, points, streak')
    .order('points', { ascending: false })
    .limit(3);

  const thirtyDayThemes = [
    { day: '01', theme: 'Opportunity' },
    { day: '02', theme: 'Action' },
    { day: '03', theme: 'Courage' },
    { day: '04', theme: 'Discipline' },
    { day: '05', theme: 'Purpose' },
    { day: '06', theme: 'Self-Talk' },
    { day: '07', theme: 'Learning' },
    { day: '08', theme: 'People' },
    { day: '09', theme: 'Comfort Zone' },
    { day: '10', theme: 'Execution' },
    { day: '11', theme: 'Energy' },
    { day: '12', theme: 'Focus' },
    { day: '13', theme: 'Fear' },
    { day: '14', theme: 'Health' },
    { day: '15', theme: 'Creation' },
    { day: '16', theme: 'Communication' },
    { day: '17', theme: 'Standards' },
    { day: '18', theme: 'Gratitude' },
    { day: '19', theme: 'Leadership' },
    { day: '20', theme: 'Time' },
    { day: '21', theme: 'Persistence' },
    { day: '22', theme: 'Relationships' },
    { day: '23', theme: 'Identity' },
    { day: '24', theme: 'Opportunity' },
    { day: '25', theme: 'Courage' },
    { day: '26', theme: 'Results' },
    { day: '27', theme: 'Reflection' },
    { day: '28', theme: 'Service' },
    { day: '29', theme: 'Vision' },
    { day: '30', theme: 'Activation' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800/80 bg-[#0c0c10]/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm md:text-base tracking-wider uppercase text-white block leading-tight">
                ACTIVATE MY LIFE
              </span>
              <span className="text-[10px] tracking-widest uppercase text-orange-400 font-semibold block">
                30-Day Personal Challenge
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs md:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-all"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>Start Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-28 pb-20 px-4 md:px-8 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
            <span>Interactive Digital Workbook Challenge</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.1]">
            ACTIVATE MY LIFE
          </h1>

          <div className="space-y-2 max-w-3xl mx-auto">
            <p className="text-lg md:text-2xl font-bold uppercase tracking-wide text-gradient-orange">
              ACTION OVER INTENTION &bull; DISCIPLINE OVER MOOD
            </p>
            <p className="text-sm md:text-base text-zinc-400 font-medium tracking-wide">
              MOVEMENT OVER PROCRASTINATION
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-300 leading-relaxed">
            The 30-Day Personal Activation Challenge transforms proven workbook principles into an interactive daily system. Engage in high-impact daily actions, strategic reflection, discipline building, and structured personal growth across 30 deliberate dimensions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            >
              <span>Begin Day 01 Activation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-[#141419] border border-zinc-800 hover:bg-zinc-800/80 text-zinc-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Existing Member Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-16 px-4 md:px-8 border-t border-b border-zinc-800/60 bg-[#0c0c10]/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Personal Activation System
            </h2>
            <h3 className="text-2xl md:text-4xl font-extrabold uppercase text-white">
              How The 30-Day Challenge Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-4 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase">
                1. Daily Action Prompts
              </h4>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Each day presents a single focused theme, mindset prompt, and physical or mental commitment to complete before midnight.
              </p>
            </div>

            <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-4 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase">
                2. Structured Reflection
              </h4>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Log your key insights, obstacle breakthroughs, and personal observations directly into your private activation journal.
              </p>
            </div>

            <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-4 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase">
                3. Streaks &amp; Points
              </h4>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Build discipline streaks, earn server-validated completion points, unlock achievement badges, and track rank on the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 30-Day Blueprint Themes Grid */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>The 30-Day Architecture</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold uppercase text-white">
            30 Days &bull; 30 Core Themes
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto">
            A comprehensive journey covering mindset, courage, health, relationships, leadership, and purpose.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {thirtyDayThemes.map((item) => (
            <div
              key={item.day}
              className="bg-[#121216] border border-zinc-800/70 hover:border-orange-500/40 rounded-xl p-3.5 text-center transition-all group"
            >
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-1">
                Day {item.day}
              </span>
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white uppercase truncate block">
                {item.theme}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard & Community Preview Placeholder */}
      <section className="py-16 px-4 md:px-8 border-t border-zinc-800/60 bg-[#0a0a0e]">
        <div className="max-w-5xl mx-auto bg-[#121217] border border-zinc-800 rounded-3xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold uppercase text-white">
              Accountability &amp; Leaderboards
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
              Track your daily progress alongside thousands of participants committed to personal activation, disciplined movement, and purpose-driven execution.
            </p>
          </div>

          <div className="bg-[#181820] border border-zinc-800 rounded-2xl p-4 md:p-6 max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-medium pb-2 border-b border-zinc-800">
              <span>RANK &bull; ACTIVATION MEMBER</span>
              <span>POINTS</span>
            </div>
            {(topUsers && topUsers.length > 0 ? topUsers : []).map((p, index) => (
              <div key={p.id} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-orange-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{p.full_name || p.username || 'Activation User'}</p>
                    <p className="text-[10px] text-zinc-500">{p.streak || 0} Day Streak</p>
                  </div>
                </div>
                <span className="font-mono text-zinc-300 font-semibold">
                  {(p.points || 0).toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all"
            >
              <span>Join The Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-[#09090b] px-4 md:px-8 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              ACTIVATE MY LIFE
            </span>
            <span>&bull; Phase 1 Foundation</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Action Over Intention &bull; Discipline Over Mood &bull; Movement Over Procrastination
          </p>
        </div>
      </footer>
    </div>
  );
}
