import React from 'react';
import { Loader2 } from 'lucide-react';

export function ButtonLoader({ className = 'w-4 h-4' }: { className?: string }) {
  return <Loader2 className={`animate-spin text-current ${className}`} />;
}

export function PageLoader({ text = 'Loading activation system...' }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-orange-500/10 blur-sm" />
      </div>
      <p className="text-zinc-400 text-sm font-medium tracking-wide uppercase">{text}</p>
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[#121216] border border-zinc-800/80 rounded-xl p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-zinc-800 rounded w-1/3 mb-4" />
      <div className="h-8 bg-zinc-800/60 rounded w-2/3 mb-3" />
      <div className="h-4 bg-zinc-800/40 rounded w-1/2" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-zinc-800 shrink-0" />
        <div className="flex-1 text-center md:text-left space-y-3 w-full">
          <div className="h-7 bg-zinc-800 rounded w-48 mx-auto md:mx-0" />
          <div className="h-4 bg-zinc-800/60 rounded w-32 mx-auto md:mx-0" />
          <div className="h-4 bg-zinc-800/40 rounded w-64 mx-auto md:mx-0" />
        </div>
      </div>
      <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="h-6 bg-zinc-800 rounded w-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-zinc-800/40 rounded-lg" />
          <div className="h-12 bg-zinc-800/40 rounded-lg" />
          <div className="h-12 bg-zinc-800/40 rounded-lg" />
          <div className="h-12 bg-zinc-800/40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-zinc-800 rounded w-64" />
        <div className="h-4 bg-zinc-800/60 rounded w-48" />
      </div>
      
      {/* Progress Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#121216] border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <div className="h-4 bg-zinc-800 rounded w-20" />
            <div className="h-8 bg-zinc-800/70 rounded w-16" />
            <div className="h-3 bg-zinc-800/40 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Challenge Placeholder Card */}
      <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="h-6 bg-zinc-800 rounded w-48" />
        <div className="h-4 bg-zinc-800/60 rounded w-full max-w-lg" />
        <div className="h-32 bg-zinc-800/30 rounded-xl" />
      </div>
    </div>
  );
}
