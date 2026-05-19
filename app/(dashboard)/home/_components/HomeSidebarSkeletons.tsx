import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const statIconSkeleton =
  "size-7 shrink-0 rounded-md bg-[#d4cbb8]/90 sm:size-[30px] dark:bg-[#37464f]/90";
const statValueSkeleton =
  "h-4 rounded-md bg-[#d4cbb8]/90 sm:h-5 dark:bg-[#37464f]/90";

function StatGroupSkeleton({ valueClassName }: { valueClassName: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <Skeleton className={statIconSkeleton} />
      <Skeleton className={cn(statValueSkeleton, valueClassName)} />
    </div>
  );
}

/** Mirrors {@link Header} stats row (hearts, streak, XP). */
function HeaderStatsRowSkeleton() {
  return (
    <div className="w-full pt-[env(safe-area-inset-top)]">
      <div className="w-full min-w-0">
        <div
          className={[
            "flex w-full min-w-0 flex-row flex-nowrap items-center justify-between gap-x-2 py-2 sm:py-2.5 md:justify-start md:gap-x-5 md:py-3 lg:gap-x-8 xl:gap-x-10",
            "px-3 sm:px-4 md:px-[calc(1.25rem+3px)]",
          ].join(" ")}
        >
          <StatGroupSkeleton valueClassName="w-4 sm:w-5" />
          <StatGroupSkeleton valueClassName="w-4 sm:w-5" />
          <div className="flex min-w-0 max-w-full shrink items-center gap-2 sm:gap-3 md:max-w-none md:basis-0 md:grow md:justify-end">
            <Skeleton className={statIconSkeleton} />
            <Skeleton
              className={cn(statValueSkeleton, "w-20 sm:w-24 md:w-28")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <HeaderStatsRowSkeleton />
      <section className="animate-pulse rounded-2xl border-3 border-[#E8920A]/40 bg-transparent p-5 dark:border-[#37464f]/60">
        <div className="mb-4 border-b border-[#ECE7DE]/60 pb-3 dark:border-[#37464f]/60">
          <Skeleton className="h-5 w-40 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
          <Skeleton className="mt-2 h-4 w-56 rounded-md bg-[#e5ddd0] dark:bg-[#2f3d45]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-2 rounded-full bg-[#e5ddd0] dark:bg-[#2f3d45]" />
          <Skeleton className="h-4 w-full rounded-md bg-[#e5ddd0] dark:bg-[#2f3d45]" />
          <Skeleton className="h-10 w-full rounded-xl bg-[#e5ddd0] dark:bg-[#2f3d45]" />
        </div>
      </section>
    </div>
  );
}

export function HomeMobileHeaderSkeleton() {
  return <HeaderStatsRowSkeleton />;
}

export function HomeLeaderboardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border-3 border-[#E8920A]/40 bg-transparent p-5 dark:border-[#84d8ff]/20">
      <div className="mb-4 flex items-center justify-between border-b border-[#ead9bb]/60 pb-3 dark:border-[#37464f]/60">
        <Skeleton className="h-3 w-28 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
        <Skeleton className="h-3 w-16 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
      </div>
      <Skeleton className="mb-3 h-4 w-40 rounded-md bg-[#d4cbb8] dark:bg-[#37464f]" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-3 py-2"
          >
            <Skeleton className="h-4 w-4 rounded-md bg-[#e5ddd0] dark:bg-[#2f3d45]" />
            <Skeleton className="size-8 shrink-0 rounded-full bg-[#e5ddd0] dark:bg-[#2f3d45]" />
            <Skeleton className="h-4 flex-1 rounded-md bg-[#e5ddd0] dark:bg-[#2f3d45]" />
            <Skeleton className="h-4 w-12 rounded-md bg-[#e5ddd0] dark:bg-[#2f3d45]" />
          </div>
        ))}
      </div>
    </div>
  );
}
