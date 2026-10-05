'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldAlert,
  Flame,
  Award,
  RefreshCw,
  Sparkles,
  Search,
  Database,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toggleUserRoleAction, seedInitialBadgesAndPostsAction } from '@/app/actions/admin';
import { ButtonLoader } from '@/components/ui/Loading';

interface ProfileUser {
  id: string;
  full_name: string;
  username: string;
  role: string;
  points: number;
  streak: number;
  completed_count: number;
  created_at: string;
}

interface AdminUserTableProps {
  initialUsers: ProfileUser[];
  metrics: {
    usersCount: number;
    submissionsCount: number;
    totalPoints: number;
    maxStreak: number;
  };
}

export default function AdminUserTable({ initialUsers, metrics }: AdminUserTableProps) {
  const [users, setUsers] = useState<ProfileUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleRole = async (targetUser: ProfileUser) => {
    setUpdatingId(targetUser.id);
    setFeedback(null);

    try {
      const res = await toggleUserRoleAction(targetUser.id, targetUser.role);
      if (res.success && res.newRole) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: res.newRole! } : u))
        );
        setFeedback({
          type: 'success',
          message: `Role for ${targetUser.full_name} updated to ${res.newRole.toUpperCase()}.`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to update user role.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Unexpected error updating role.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSeedBadges = async () => {
    setSeeding(true);
    setFeedback(null);

    try {
      const res = await seedInitialBadgesAndPostsAction();
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message || 'Database initial seed completed successfully!',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to seed database entries.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Unexpected error during seed.',
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Banner Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">{metrics.usersCount}</p>
          <p className="text-[11px] text-zinc-500">Registered Activators</p>
        </div>

        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Submissions</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">{metrics.submissionsCount}</p>
          <p className="text-[11px] text-zinc-500">Total Reviews Filed</p>
        </div>

        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Points</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">{metrics.totalPoints}</p>
          <p className="text-[11px] text-zinc-500">Cumulative PTS Issued</p>
        </div>

        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Max Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">{metrics.maxStreak}</p>
          <p className="text-[11px] text-zinc-500">Highest Active Streak</p>
        </div>
      </div>

      {/* Admin Action Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#121216] border border-amber-500/20 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Database Seed & Maintenance Tools</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Initialize platform badges and default database definitions with one click.
          </p>
        </div>

        <button
          onClick={handleSeedBadges}
          disabled={seeding}
          className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {seeding ? (
            <>
              <ButtonLoader />
              <span>Seeding Database...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Seed Initial Badges</span>
            </>
          )}
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* User Directory Header & Search */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            <span>Registered User Directory ({users.length})</span>
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activators..."
              className="w-full bg-[#181820] border border-zinc-800 focus:border-orange-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#181820] border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Points</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-center">Completed</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 italic">
                    No users matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdminRole = user.role === 'admin';
                  const isUpdating = updatingId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{user.full_name || 'Activation User'}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">@{user.username || 'user'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isAdminRole
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                              : 'bg-zinc-800/80 text-zinc-400'
                          }`}
                        >
                          {isAdminRole ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-amber-400">
                        {user.points || 0} PTS
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-orange-400">
                        {user.streak || 0} 🔥
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-zinc-300">
                        {user.completed_count || 0} / 30
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                            isAdminRole
                              ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400'
                              : 'bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300'
                          } disabled:opacity-50`}
                        >
                          {isUpdating ? 'Updating...' : isAdminRole ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
