import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/navigation/AppShell';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasEnv && !user) {
    redirect('/login');
  }

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    profile = data;

    // Fallback: If database trigger did not auto-create profile row, create it on-demand server side
    if (!profile) {
      const defaultFullName =
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Activation User';
      const defaultUsername =
        user.user_metadata?.username ||
        `user_${user.id.substring(0, 8)}`;

      const { data: createdProfile } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: defaultFullName,
          username: defaultUsername,
          role: 'user',
        })
        .select('*')
        .single();

      profile = createdProfile;
    }
  }

  return <AppShell userProfile={profile}>{children}</AppShell>;
}
