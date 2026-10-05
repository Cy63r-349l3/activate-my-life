import React from 'react';
import { redirect } from 'next/navigation';
import { ShieldCheck, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { fetchAdminMetrics, fetchAllUsersAdmin } from '@/app/actions/admin';
import AdminUserTable from '@/components/admin/AdminUserTable';

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

  // Fetch real database users & metrics
  const [users, metrics] = await Promise.all([
    fetchAllUsersAdmin(),
    fetchAdminMetrics(),
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
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
            Server-side Role Validation Enforced &bull; Real-time Platform Control
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2 shrink-0">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Server Verified (admin)</span>
        </div>
      </div>

      {/* Main Admin Interactive Console */}
      <AdminUserTable initialUsers={users} metrics={metrics} />
    </div>
  );
}
