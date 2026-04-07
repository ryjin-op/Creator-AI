'use client';

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#121214] border border-white/5 overflow-hidden animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="h-40 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      {/* Content placeholder */}
      <div className="p-5 space-y-4">
        <div className="h-4 w-3/4 rounded-lg bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="h-3 w-1/2 rounded-lg bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 flex-1 rounded-xl bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <div className="h-8 w-10 rounded-xl bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
