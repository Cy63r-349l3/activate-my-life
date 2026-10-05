'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function checkIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

export async function fetchAdminMetrics() {
  const supabase = await createClient();

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: submissionsCount } = await supabase
    .from('daily_submissions')
    .select('*', { count: 'exact', head: true });

  const { data: profiles } = await supabase.from('profiles').select('points, streak');

  const totalPoints = profiles?.reduce((sum, p) => sum + (p.points || 0), 0) || 0;
  const maxStreak = profiles?.reduce((max, p) => Math.max(max, p.streak || 0), 0) || 0;

  return {
    usersCount: usersCount || 0,
    submissionsCount: submissionsCount || 0,
    totalPoints,
    maxStreak,
  };
}

export async function fetchAllUsersAdmin() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users for admin:', error);
    return [];
  }

  return users || [];
}

export async function toggleUserRoleAction(targetUserId: string, currentRole: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required.' };
  }

  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', targetUserId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true, newRole };
}

export async function seedInitialBadgesAndPostsAction() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required.' };
  }

  const supabase = await createClient();

  const initialBadges = [
    { name: 'Day 1 Initiated', description: 'Completed your first daily activation.', icon_name: 'Zap', category: 'Milestone' },
    { name: '3-Day Fire', description: 'Maintained a 3-consecutive-day execution streak.', icon_name: 'Flame', category: 'Streak' },
    { name: '7-Day Unstoppable', description: 'Completed 7 full days of personal accountability.', icon_name: 'ShieldCheck', category: 'Streak' },
    { name: '1000 PTS Club', description: 'Earned over 1,000 activation points on the platform.', icon_name: 'Award', category: 'Points' },
    { name: '30-Day Master', description: 'Finished the entire 30-Day Personal Activation Challenge!', icon_name: 'Sparkles', category: 'Completion' },
  ];

  for (const b of initialBadges) {
    await supabase.from('badges').insert(b as any);
  }

  revalidatePath('/admin');
  revalidatePath('/badges');
  return { success: true, message: 'Database badges & seed entries populated.' };
}
