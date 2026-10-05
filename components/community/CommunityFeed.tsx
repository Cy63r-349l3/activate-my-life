'use client';

import React, { useState } from 'react';
import { Flame, Send, MessageSquare, Sparkles, AlertCircle } from 'lucide-react';
import { createCommunityPostAction, togglePostReactionAction } from '@/app/actions/community';
import { ButtonLoader } from '@/components/ui/Loading';

interface PostItem {
  id: string;
  user_id: string;
  content: string;
  day_number?: number | null;
  likes_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url?: string | null;
  };
}

interface CommunityFeedProps {
  initialPosts: PostItem[];
  activeDayNumber: number;
}

export default function CommunityFeed({ initialPosts, activeDayNumber }: CommunityFeedProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [content, setContent] = useState('');
  const [dayNumber, setDayNumber] = useState<number>(activeDayNumber || 1);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setPosting(true);
    setError(null);

    try {
      const res = await createCommunityPostAction(content.trim(), dayNumber);
      if (res.success && res.post) {
        setPosts((prev) => [res.post!, ...prev]);
        setContent('');
      } else {
        setError(res.error || 'Failed to post reflection.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error creating post.');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p))
    );

    await togglePostReactionAction(postId);
  };

  return (
    <div className="space-y-8">
      {/* Create Post Card */}
      <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <MessageSquare className="w-4 h-4" />
            <span>Share Today&apos;s Activation Reflection</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-zinc-400 font-semibold uppercase">Day Tag:</label>
            <select
              value={dayNumber}
              onChange={(e) => setDayNumber(Number(e.target.value))}
              className="bg-[#181820] border border-zinc-800 text-xs text-orange-400 font-bold rounded-lg px-2.5 py-1 focus:outline-none"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What uncomfortable action did you conquer today? Share your win with fellow activators..."
            className="w-full bg-[#181820] border border-zinc-800 focus:border-orange-500 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={posting || !content.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {posting ? (
                <>
                  <ButtonLoader />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>Post Reflection</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feed Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Live Activator Reflections ({posts.length})</span>
        </h2>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 italic space-y-2">
            <p>No community posts yet. Be the first activator to share your Day {activeDayNumber} win!</p>
          </div>
        ) : (
          posts.map((post) => {
            const authorName = post.profiles?.full_name || 'Activator';
            const username = post.profiles?.username || 'user';
            const initials = authorName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2);

            return (
              <div
                key={post.id}
                className="bg-[#121216] border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-6 space-y-4 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{authorName}</span>
                        <span className="text-xs text-zinc-500 font-mono">@{username}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-wider shrink-0">
                    Day {post.day_number}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold transition-all cursor-pointer group"
                  >
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500/30 group-hover:scale-110 transition-transform" />
                    <span>{post.likes_count} Fire</span>
                  </button>

                  <span className="text-[11px] text-zinc-500">Activator Verified Review</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
