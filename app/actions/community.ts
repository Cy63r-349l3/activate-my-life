'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function fetchCommunityPostsAction() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Error fetching community posts:', error);
    return [];
  }

  if (!posts || posts.length === 0) return [];

  // Fetch profiles for posts
  const userIds = Array.from(new Set(posts.map((p) => p.user_id)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

  return posts.map((post) => ({
    ...post,
    profiles: profileMap.get(post.user_id) || {
      full_name: 'Activator',
      username: 'user',
    },
  }));
}

export async function createCommunityPostAction(content: string, dayNumber?: number) {
  if (!content || !content.trim()) {
    return { success: false, error: 'Post content cannot be empty.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required.' };
  }

  const { data: post, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: user.id,
      content: content.trim(),
      day_number: dayNumber || 1,
      likes_count: 0,
      created_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating community post:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/community');
  return { success: true, post };
}

export async function togglePostReactionAction(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required.' };
  }

  // Increment likes count on post
  const { data: post } = await supabase
    .from('community_posts')
    .select('likes_count')
    .eq('id', postId)
    .single();

  const newLikes = (post?.likes_count || 0) + 1;

  const { error } = await supabase
    .from('community_posts')
    .update({ likes_count: newLikes })
    .eq('id', postId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/community');
  return { success: true, newLikes };
}
