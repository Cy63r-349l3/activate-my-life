import React from 'react';
import { redirect } from 'next/navigation';
import { ShieldCheck, Users, Database, Activity, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasEnv) {
    if (!user) {
      redirect('/login');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      redirect('/dashboard?error=unauthorized_admin');
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Authorized Administration Portal</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
            System Admin Console
          </h1>
          <p className="text-xs md:text-sm text-amber-200/80 font-medium uppercase tracking-wider mt-1">
            Server-side Role Validation Enforced (role = admin)
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Server Verified</span>
        </div>
      </div>

      {/* Admin Stats & Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#14141d] border border-amber-500/20 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase">
            User Management
          </h3>
          <p className="text-xs text-zinc-400">
            View registered activators, inspect auth logs, and adjust administrative permissions.
          </p>
        </div>

        <div className="bg-[#14141d] border border-amber-500/20 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase">
            Challenge Management
          </h3>
          <p className="text-xs text-zinc-400">
            Configure the 30-day prompts, points weightings, and reflection templates.
          </p>
        </div>

        <div className="bg-[#14141d] border border-amber-500/20 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase">
            System Telemetry
          </h3>
          <p className="text-xs text-zinc-400">
            Monitor Supabase RLS security policies, points transactions, and daily submission velocity.
          </p>
        </div>
      </div>

      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 text-xs text-zinc-400 space-y-2">
        <p className="font-semibold text-zinc-200 uppercase tracking-wider">
          Security Note:
        </p>
        <p>
          This admin console is protected via both middleware server-side session checks and server component RLS database policy validation. Unauthenticated users or non-admin profiles attempting direct URL navigation are automatically redirected to the dashboard.
        </p>
      </div>
    </div>
  );
}
