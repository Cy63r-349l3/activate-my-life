import React from 'react';
import { createClient } from '@/lib/supabase/server';
import {
  Trophy,
  Flame,
  CheckCircle,
  Sparkles,
  Crown,
  Medal,
  TrendingUp,
} from 'lucide-react';

interface LeaderEntry {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  country: string | null;
  points: number;
  streak: number;
  completed_count: number;
}

async function fetchLeaderboard(): Promise<{
  byPoints: LeaderEntry[];
  byStreak: LeaderEntry[];
  byDays: LeaderEntry[];
  currentUserId: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, country, points, streak, completed_count')
    .order('points', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[Leaderboard] Supabase query error:', error);
  }

  const allRows: LeaderEntry[] = (data || []).map((r: any) => ({
    id: r.id,
    username: r.username && r.username.trim() !== '' ? r.username : `user_${r.id.substring(0, 5)}`,
    full_name: r.full_name || 'Activation User',
    avatar_url: r.avatar_url || null,
    country: r.country || null,
    points: r.points ?? 0,
    streak: r.streak ?? 0,
    completed_count: r.completed_count ?? 0,
  }));

  // For board display: show everyone (they earned their spot by signing up)
  const byPoints = [...allRows].sort((a, b) => b.points - a.points || b.streak - a.streak);
  const byStreak = [...allRows].sort((a, b) => b.streak - a.streak || b.points - a.points);
  const byDays = [...allRows].sort(
    (a, b) => b.completed_count - a.completed_count || b.points - a.points
  );

  return { byPoints, byStreak, byDays, currentUserId: user?.id ?? null };
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function rankColor(rank: number) {
  if (rank === 1) return 'text-amber-400';
  if (rank === 2) return 'text-zinc-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-zinc-500';
}

function rankBg(rank: number) {
  if (rank === 1) return 'bg-amber-500/15 border-amber-500/30';
  if (rank === 2) return 'bg-zinc-400/10 border-zinc-400/25';
  if (rank === 3) return 'bg-amber-700/15 border-amber-700/30';
  return 'bg-zinc-900/60 border-zinc-800/60';
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-zinc-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-bold text-zinc-500 w-5 text-center">{rank}</span>;
}

function Avatar({ entry, size = 'md' }: { entry: LeaderEntry; size?: 'sm' | 'md' | 'lg' }) {
  const sz =
    size === 'lg'
      ? 'w-16 h-16 text-lg'
      : size === 'md'
      ? 'w-10 h-10 text-sm'
      : 'w-8 h-8 text-xs';
  if (entry.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={entry.avatar_url}
        alt={entry.full_name}
        className={`${sz} rounded-full object-cover border-2 border-zinc-700`}
      />
    );
  }
  const hue = (entry.username.charCodeAt(0) * 37) % 360;
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold border-2 border-zinc-700`}
      style={{ background: `hsl(${hue}, 55%, 25%)`, color: `hsl(${hue}, 80%, 80%)` }}
    >
      {initials(entry.full_name)}
    </div>
  );
}

function Podium({
  entries,
  valueKey,
  valueSuffix,
}: {
  entries: LeaderEntry[];
  valueKey: keyof LeaderEntry;
  valueSuffix: string;
}) {
  const top3 = entries.slice(0, 3);
  if (top3.length < 2) return null;
  const order = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = ['h-20', 'h-28', 'h-16'];
  const realRanks = [2, 1, 3];

  return (
    <div className="flex items-end justify-center gap-3 mb-8 pt-4">
      {order.map((entry, i) => {
        const rank = realRanks[i];
        return (
          <div key={entry.id} className="flex flex-col items-center gap-1.5">
            <Avatar entry={entry} size={rank === 1 ? 'lg' : 'md'} />
            {rank === 1 && <Crown className="w-5 h-5 text-amber-400" />}
            <p className="text-xs font-bold text-white truncate max-w-[80px] text-center">
              @{entry.username}
            </p>
            <p className={`text-xs font-extrabold ${rankColor(rank)}`}>
              {String(entry[valueKey])} {valueSuffix}
            </p>
            <div
              className={`w-20 ${heights[i]} rounded-t-xl flex items-center justify-center text-2xl font-black ${
                rank === 1
                  ? 'bg-gradient-to-t from-amber-600 to-amber-400 text-amber-950'
                  : rank === 2
                  ? 'bg-gradient-to-t from-zinc-500 to-zinc-300 text-zinc-900'
                  : 'bg-gradient-to-t from-amber-800 to-amber-600 text-amber-950'
              }`}
            >
              {rank}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeaderRow({
  entry,
  rank,
  valueKey,
  valueSuffix,
  icon,
  isCurrentUser,
}: {
  entry: LeaderEntry;
  rank: number;
  valueKey: keyof LeaderEntry;
  valueSuffix: string;
  icon: React.ReactNode;
  isCurrentUser: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${rankBg(rank)} ${
        isCurrentUser ? 'ring-1 ring-amber-500/40' : ''
      }`}
    >
      <div className="w-7 flex-shrink-0 flex items-center justify-center">
        <RankIcon rank={rank} />
      </div>
      <Avatar entry={entry} size="sm" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isCurrentUser ? 'text-amber-300' : 'text-white'}`}>
          {entry.full_name}
          {isCurrentUser && (
            <span className="ml-2 text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full">
              YOU
            </span>
          )}
        </p>
        <p className="text-[11px] text-zinc-500 truncate">
          @{entry.username}
          {entry.country ? ` · ${entry.country}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-extrabold flex-shrink-0">
        <span className={rankColor(rank)}>{String(entry[valueKey])}</span>
        <span className="text-zinc-600 text-xs font-medium">{valueSuffix}</span>
        {icon}
      </div>
    </div>
  );
}

function TabPanel({
  entries,
  valueKey,
  valueSuffix,
  icon,
  currentUserId,
}: {
  entries: LeaderEntry[];
  valueKey: keyof LeaderEntry;
  valueSuffix: string;
  icon: React.ReactNode;
  currentUserId: string | null;
}) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-zinc-400 text-sm font-semibold">No data yet!</p>
        <p className="text-zinc-600 text-xs">Complete your first day to appear on the board.</p>
      </div>
    );
  }
  return (
    <div>
      <Podium entries={entries} valueKey={valueKey} valueSuffix={valueSuffix} />
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <LeaderRow
            key={entry.id}
            entry={entry}
            rank={i + 1}
            valueKey={valueKey}
            valueSuffix={valueSuffix}
            icon={icon}
            isCurrentUser={entry.id === currentUserId}
          />
        ))}
      </div>
    </div>
  );
}

export default async function LeaderboardPage() {
  const { byPoints, byStreak, byDays, currentUserId } = await fetchLeaderboard();

  const userPointsRank = byPoints.findIndex((e) => e.id === currentUserId) + 1;
  const userStreakRank = byStreak.findIndex((e) => e.id === currentUserId) + 1;
  const userDaysRank = byDays.findIndex((e) => e.id === currentUserId) + 1;
  const userEntry = byPoints.find((e) => e.id === currentUserId);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Rankings</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
          Activation Leaderboard
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
          Server Validated Points · Streak Rankings · Peer Accountability
        </p>
      </div>

      {/* Your stats strip */}
      {userEntry && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Points Rank',
              value: userPointsRank > 0 ? `#${userPointsRank}` : '—',
              sub: `${userEntry.points} pts`,
              icon: <Trophy className="w-4 h-4 text-amber-400" />,
              color: 'text-amber-400',
            },
            {
              label: 'Streak Rank',
              value: userStreakRank > 0 ? `#${userStreakRank}` : '—',
              sub: `${userEntry.streak} days`,
              icon: <Flame className="w-4 h-4 text-orange-400" />,
              color: 'text-orange-400',
            },
            {
              label: 'Days Rank',
              value: userDaysRank > 0 ? `#${userDaysRank}` : '—',
              sub: `${userEntry.completed_count} / 30`,
              icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
              color: 'text-emerald-400',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3 text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {stat.icon}
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  {stat.label}
                </span>
              </div>
              <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-zinc-500">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Points Board */}
      <section className="bg-[#0e0e12] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80 bg-amber-500/5">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Points Board</h2>
            <p className="text-[11px] text-zinc-500">{byPoints.length} activators ranked</p>
          </div>
          <TrendingUp className="w-4 h-4 text-amber-400/50 ml-auto" />
        </div>
        <div className="p-4">
          <TabPanel
            entries={byPoints}
            valueKey="points"
            valueSuffix="pts"
            icon={<Trophy className="w-3.5 h-3.5 text-amber-400" />}
            currentUserId={currentUserId}
          />
        </div>
      </section>

      {/* Streak Board */}
      <section className="bg-[#0e0e12] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80 bg-orange-500/5">
          <Flame className="w-5 h-5 text-orange-400" />
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Streak Board</h2>
            <p className="text-[11px] text-zinc-500">Consecutive day champions</p>
          </div>
        </div>
        <div className="p-4">
          <TabPanel
            entries={byStreak}
            valueKey="streak"
            valueSuffix="days"
            icon={<Flame className="w-3.5 h-3.5 text-orange-400" />}
            currentUserId={currentUserId}
          />
        </div>
      </section>

      {/* Completion Board */}
      <section className="bg-[#0e0e12] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80 bg-emerald-500/5">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Completion Board</h2>
            <p className="text-[11px] text-zinc-500">Most days completed out of 30</p>
          </div>
        </div>
        <div className="p-4">
          <TabPanel
            entries={byDays}
            valueKey="completed_count"
            valueSuffix="days"
            icon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
            currentUserId={currentUserId}
          />
        </div>
      </section>
    </div>
  );
}
