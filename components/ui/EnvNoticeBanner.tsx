import { AlertTriangle } from 'lucide-react';

export default function EnvNoticeBanner() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasUrl && hasKey) {
    return null;
  }

  return (
    <div className="bg-amber-950/80 border-b border-amber-600/40 text-amber-200 px-4 py-2.5 text-xs md:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Supabase Setup Required:</strong> Environment variables missing.
            Copy <code className="bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-100 font-mono text-[11px]">.env.example</code> to <code className="bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-100 font-mono text-[11px]">.env.local</code> and provide your Supabase URL &amp; Anon Key.
          </span>
        </div>
        <span className="hidden sm:inline-block text-amber-400/80 text-[11px] font-mono shrink-0">
          Phase 1 Foundation
        </span>
      </div>
    </div>
  );
}
