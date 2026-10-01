'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ButtonLoader, PageLoader } from '@/components/ui/Loading';

function LoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectedFrom = searchParams.get('redirectedFrom');
    const authError = searchParams.get('error');
    if (redirectedFrom) {
      setError('Please sign in to access that page.');
    } else if (authError === 'auth_callback_failed') {
      setError('Email verification or login link expired. Please try signing in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Login Debug Error]:', authError);
        }
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        // Perform hard navigation so browser sends newly set cookies to server routes
        window.location.href = '/dashboard';
      } else {
        setError('Authentication succeeded but session could not be established. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Login Exception]:', err);
      }
      setError(err?.message || 'An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="marcus@example.com"
          className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] text-orange-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <ButtonLoader />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-widest hover:bg-orange-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            ACTIVATE MY LIFE
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
            Sign In To Your Account
          </h1>
          <p className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Movement Over Procrastination
          </p>
        </div>

        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <Suspense fallback={<PageLoader text="Loading Login System..." />}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            Don&apos;t have an activation account?{' '}
            <Link
              href="/signup"
              className="text-orange-400 font-semibold hover:underline"
            >
              Register Here
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-zinc-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-500/70" />
          <span>Protected by Row Level Security Architecture</span>
        </div>
      </div>
    </div>
  );
}
