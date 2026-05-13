export function ProfileLessonProgressCardSkeleton() {
  return (
    <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent dark:border-[#37464f] p-5">
      <header className="mb-4 border-b border-[#ECE7DE] pb-3 dark:border-[#37464f]">
        <div className="h-5 w-44 max-w-full animate-pulse rounded-md bg-[#ebe6dc] dark:bg-[#2f3d45]" />
        <div className="mt-2 h-4 w-56 max-w-full animate-pulse rounded-md bg-[#f0ebe3] dark:bg-[#37464f]/80" />
      </header>
      <div className="space-y-4">
        <div className="h-2 rounded-full bg-[#E9E3D8] dark:bg-[#252f35]">
          <div className="h-2 w-1/3 animate-pulse rounded-full bg-[#E8920A]/40 dark:bg-[#ffad33]/30" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#2f3d45]" />
          <div className="h-4 w-full max-w-[min(100%,14rem)] animate-pulse rounded-md bg-[#ebe6dc] dark:bg-[#2f3d45]" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-xl bg-[#e8920a]/35 dark:bg-[#1C2B4A]/50" />
      </div>
    </section>
  );
}

export function ProfileNearbyPlayersSkeleton() {
  return (
    <div className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 dark:border-[#84d8ff]/40">
      <div className="mb-4 flex items-center justify-between border-b border-[#ead9bb] pb-3 dark:border-[#37464f]">
        <div className="h-3 w-36 max-w-[55%] animate-pulse rounded bg-[#ead9bb] dark:bg-[#37464f]" />
        <div className="h-3 w-14 shrink-0 animate-pulse rounded bg-[#ead9bb] dark:bg-[#37464f]" />
      </div>
      <div className="mb-3 h-4 w-44 max-w-full animate-pulse rounded bg-[#ead9bb]/90 dark:bg-[#37464f]" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-3 py-2"
          >
            <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-[#e8e0d4] dark:bg-[#37464f]" />
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[#D3C4A8] dark:bg-[#37464f]" />
            <div className="h-4 min-w-0 flex-1 animate-pulse rounded bg-[#e8e0d4] dark:bg-[#37464f]" />
            <div className="flex shrink-0 flex-col items-end gap-1">
              <div className="h-4 w-12 animate-pulse rounded bg-[#FAC775]/60 dark:bg-[#84d8ff]/25" />
              <div className="h-2.5 w-10 animate-pulse rounded bg-[#2E8B6F]/25 dark:bg-[#4ade80]/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
