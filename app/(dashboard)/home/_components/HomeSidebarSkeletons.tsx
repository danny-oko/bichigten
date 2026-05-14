/** Single aside boundary: matches {@link HomeDashboardSidebar} layout. */
export function HomeSignedInSidebarSkeleton() {
  return (
    <div className="space-y-4">
      <HomeHeaderProgressSkeleton />
      <HomeLeaderboardSkeleton />
    </div>
  );
}

export function HomeHeaderProgressSkeleton() {
  return (
    <div className="space-y-4">
      <div className="w-full animate-pulse rounded-xl bg-[#E9E3D8]/80 px-4 py-4 dark:bg-[#252f35]/80">
        <div className="flex items-center gap-10">
          <div className="h-8 w-16 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
          <div className="h-8 w-24 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
          <div className="h-8 w-20 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
        </div>
      </div>
      <section className="animate-pulse rounded-2xl border-3 border-[#E8920A]/40 bg-transparent p-5 dark:border-[#37464f]/60">
        <div className="mb-4 border-b border-[#ECE7DE]/60 pb-3 dark:border-[#37464f]/60">
          <div className="h-5 w-40 rounded bg-[#d4cbb8] dark:bg-[#37464f]" />
          <div className="mt-2 h-4 w-56 rounded bg-[#e5ddd0] dark:bg-[#2f3d45]" />
        </div>
        <div className="space-y-4">
          <div className="h-2 rounded-full bg-[#e5ddd0] dark:bg-[#2f3d45]" />
          <div className="h-4 w-full rounded bg-[#e5ddd0] dark:bg-[#2f3d45]" />
          <div className="h-10 w-full rounded-xl bg-[#e5ddd0] dark:bg-[#2f3d45]" />
        </div>
      </section>
    </div>
  );
}

export function HomeMobileHeaderSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-xl bg-[#E9E3D8]/80 px-4 py-4 dark:bg-[#252f35]/80">
      <div className="flex items-center gap-10">
        <div className="h-8 w-16 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
        <div className="h-8 w-24 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
        <div className="h-8 w-20 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
      </div>
    </div>
  );
}

export function HomeLeaderboardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border-3 border-[#E8920A]/40 bg-transparent p-5 dark:border-[#84d8ff]/20">
      <div className="mb-4 flex items-center justify-between border-b border-[#ead9bb]/60 pb-3 dark:border-[#37464f]/60">
        <div className="h-3 w-28 rounded bg-[#d4cbb8] dark:bg-[#37464f]" />
        <div className="h-3 w-16 rounded bg-[#d4cbb8] dark:bg-[#37464f]" />
      </div>
      <div className="mb-3 h-4 w-40 rounded bg-[#d4cbb8] dark:bg-[#37464f]" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-3 py-2"
          >
            <div className="h-4 w-4 rounded bg-[#e5ddd0] dark:bg-[#2f3d45]" />
            <div className="h-8 w-8 shrink-0 rounded-full bg-[#e5ddd0] dark:bg-[#2f3d45]" />
            <div className="h-4 flex-1 rounded bg-[#e5ddd0] dark:bg-[#2f3d45]" />
            <div className="h-4 w-12 rounded bg-[#e5ddd0] dark:bg-[#2f3d45]" />
          </div>
        ))}
      </div>
    </div>
  );
}
