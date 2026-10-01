'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Trophy,
  User,
  Award,
  Users,
  ShieldCheck,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database';

interface AppShellProps {
  children: React.ReactNode;
  userProfile?: Profile | null;
}

export default function AppShell({ children, userProfile }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(userProfile || null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!userProfile) {
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (data) setProfile(data);
        }
      });
    } else {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  const mainNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Challenge', href: '/challenge', icon: Target },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const secondaryNavItems = [
    { name: 'Badges', href: '/badges', icon: Award },
    { name: 'Community', href: '/community', icon: Users },
  ];

  const isAdmin = profile?.role === 'admin';

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f0f13] border-r border-zinc-800/80 shrink-0 min-h-screen sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-sm tracking-wider uppercase text-white leading-tight">
                ACTIVATE MY LIFE
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-orange-400 font-semibold">
                30-Day Challenge
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Main Menu
            </p>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-orange-400' : 'text-zinc-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Social &amp; Rewards
            </p>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-orange-400' : 'text-zinc-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {isAdmin && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-400/80 mb-2">
                Administration
              </p>
              <nav className="space-y-1">
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/admin')
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/40'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel</span>
                </Link>
              </nav>
            </div>
          )}
        </div>

        {/* Motto Banner */}
        <div className="p-4 mx-4 mb-3 rounded-xl bg-[#14141a] border border-zinc-800/60 text-center">
          <p className="text-[10px] font-bold tracking-widest text-orange-400 uppercase">
            ACTION OVER INTENTION
          </p>
          <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">
            Discipline Over Mood
          </p>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-zinc-800/60 bg-[#0c0c0f]">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-3 flex-1 min-w-0 group"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-orange-400 uppercase shrink-0">
                {profile?.full_name ? profile.full_name[0] : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-orange-400 transition-colors">
                  {profile?.full_name || 'Activation User'}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  @{profile?.username || 'user'}
                </p>
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              title="Sign Out"
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0f0f13]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs tracking-wider uppercase text-white">
            ACTIVATE MY LIFE
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white rounded-lg bg-zinc-800/60"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-between p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <span className="font-extrabold text-sm uppercase tracking-wider text-white">
                  Navigation
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-2">
              {[...mainNavItems, ...secondaryNavItems].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl text-base font-medium ${
                      active
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-base font-medium bg-amber-950/40 text-amber-400 border border-amber-500/30"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>Admin Panel</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-500" />
                </Link>
              )}
            </nav>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-zinc-400">@{profile?.username || 'username'}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8 flex flex-col">
        <div className="max-w-6xl w-full mx-auto px-4 md:px-8 py-6 md:py-8 flex-1">
          {children}
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f13]/95 backdrop-blur-md border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                active
                  ? 'text-orange-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-orange-400 scale-110' : ''}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
