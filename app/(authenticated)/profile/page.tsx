'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Globe,
  FileText,
  Shield,
  Award,
  Flame,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database';
import { ProfileSkeleton, ButtonLoader } from '@/components/ui/Loading';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data) {
            setProfile(data);
            setFullName(data.full_name || '');
            setCountry(data.country || '');
            setCity(data.city || '');
            setBio(data.bio || '');
            setAvatarUrl(data.avatar_url || '');
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: 'error', text: 'Unauthenticated user.' });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          country: country.trim() || null,
          city: city.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                full_name: fullName.trim(),
                country: country.trim() || null,
                city: city.trim() || null,
                bio: bio.trim() || null,
                avatar_url: avatarUrl.trim() || null,
              }
            : null
        );
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || 'An error occurred while updating profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
          Personal Profile &amp; Settings
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider mt-1">
          Manage your activation identity and personal details
        </p>
      </div>

      {/* Profile Card Summary Banner */}
      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover border-2 border-orange-500/50 shadow-xl"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 border-2 border-orange-400/30 flex items-center justify-center text-3xl font-extrabold text-white uppercase shadow-xl">
              {fullName ? fullName[0] : 'U'}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {fullName || 'Activation User'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase tracking-wider mx-auto md:mx-0">
              <Shield className="w-3 h-3" />
              Role: {profile?.role || 'user'}
            </span>
          </div>

          <p className="text-xs text-orange-400 font-mono font-medium">
            @{profile?.username || 'user'}
          </p>

          <p className="text-xs text-zinc-400 line-clamp-2 max-w-lg">
            {bio || 'No activation bio written yet. Share your journey goals below.'}
          </p>
        </div>
      </div>

      {/* Read Only System Indicators (Points, Streak, Rank, Completed) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Points</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {profile?.points ?? 0} <span className="text-xs font-sans text-amber-400 font-semibold">PTS</span>
          </p>
          <p className="text-[10px] text-zinc-500">System Controlled</p>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Streak</span>
          </div>
          <p className="text-lg font-bold text-white">
            {profile?.streak ?? 0} <span className="text-xs text-zinc-400">Days</span>
          </p>
          <p className="text-[10px] text-zinc-500">System Controlled</p>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span>Leaderboard Rank</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            #{profile?.rank ?? 'Unranked'}
          </p>
          <p className="text-[10px] text-zinc-500">System Controlled</p>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed</span>
          </div>
          <p className="text-lg font-bold text-white">
            {profile?.completed_count ?? 0} <span className="text-xs text-zinc-400">/ 30</span>
          </p>
          <p className="text-[10px] text-zinc-500">System Controlled</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-3">
          Edit Profile Information
        </h3>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/60 border border-red-500/40 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Username <span className="text-[10px] text-zinc-500 font-normal">(Read Only)</span>
              </label>
              <input
                type="text"
                disabled
                value={profile?.username || ''}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Country
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                City
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Austin, TX"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Bio &amp; Activation Commitment
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your goals and why you are undertaking the 30-Day Personal Activation Challenge..."
                className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
              />
              <FileText className="w-4 h-4 text-zinc-500 absolute right-3.5 bottom-3.5" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <ButtonLoader />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
