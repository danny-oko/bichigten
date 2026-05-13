const statAccent: Record<string, string> = {
  xp: "from-[#fde8b8] to-[#E8920A]",
  league: "from-[#d4e4ff] to-[#8eb4e8]",
  hearts: "from-[#ffd6d6] to-[#e8920a]/40",
  streak: "from-[#f5d78a] to-[#E5A13D]",
  badges: "from-[#f5e6c8] to-[#c9a227]",
};

const statIds = ["xp", "league", "hearts", "streak", "badges"] as const;

export default function ProfileMainColumnSkeleton() {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <section className="relative overflow-hidden rounded-2xl border-3 border-[#E8920A] bg-transparent shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
        <div className="relative px-5 pb-5 pt-5 md:px-8 md:pt-6">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-18 w-18 shrink-0 animate-pulse items-center justify-center overflow-hidden rounded-full border-4 border-[#fde9c4] bg-linear-to-br from-[#f0a31a]/50 to-[#d9780a]/50 ring-2 ring-white/90 sm:h-20 sm:w-20 md:h-22 md:w-22" />
              <div className="min-w-0 flex-1 space-y-2 pt-2">
                <div className="h-7 w-48 max-w-full animate-pulse rounded-md bg-[#ebe6dc] dark:bg-[#2f3d45] sm:h-8 md:h-9" />
                <div className="h-4 w-64 max-w-full animate-pulse rounded bg-[#f0ebe3] dark:bg-[#37464f]" />
                <div className="mt-2 flex flex-wrap gap-2 md:hidden">
                  <div className="h-7 w-20 animate-pulse rounded-full border border-[#e7dbc2]/80 bg-transparent dark:border-[#4a4335]" />
                  <div className="h-7 w-24 animate-pulse rounded-full border border-[#d3def3]/80 bg-transparent dark:border-[#3d4f6a]" />
                </div>
              </div>
            </div>
            <div className="hidden flex-wrap gap-2 pt-2 md:flex">
              <div className="h-7 w-20 animate-pulse rounded-full border border-[#e7dbc2]/80 bg-transparent dark:border-[#4a4335]" />
              <div className="h-7 w-24 animate-pulse rounded-full border border-[#d3def3]/80 bg-transparent dark:border-[#3d4f6a]" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-1.5 md:grid-cols-5 md:gap-2">
        {statIds.map((id) => (
          <div
            key={id}
            className="group relative min-w-0 overflow-hidden rounded-2xl border-3 border-[#ead9bb] bg-transparent px-1.5 py-2 text-center shadow-[0_8px_24px_rgba(232,146,10,0.06)] dark:border-[#37464f] md:rounded-2xl md:px-2.5 md:py-2.5"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-b-full bg-linear-to-r ${statAccent[id] ?? "from-[#E8920A] to-[#f5c96a]"}`}
              aria-hidden
            />
            <div className="flex min-h-4 items-center justify-center">
              <div className="size-3.5 animate-pulse rounded-sm bg-[#b08a52]/35 md:size-4 dark:bg-[#c4a574]/30" />
            </div>
            <div className="mx-auto mt-0.5 h-6 w-12 animate-pulse rounded-md bg-[#ebe6dc] dark:bg-[#2f3d45] md:h-7 md:w-14" />
            <div className="mx-auto mt-1 h-2.5 w-[85%] animate-pulse rounded bg-[#ebe6dc]/90 dark:bg-[#37464f]" />
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-3">
        <nav
          className="flex w-full max-w-full flex-nowrap gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap [&::-webkit-scrollbar]:hidden"
          aria-hidden
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 shrink-0 animate-pulse rounded-full border-2 border-[#ead9bb] bg-[#fff9e5]/80 px-4 dark:border-[#37464f] dark:bg-[#1a2228]/50 sm:h-9 sm:px-5"
              style={{ width: `${68 + i * 12}px` }}
            />
          ))}
        </nav>

        <div className="min-h-[200px] space-y-4 md:space-y-5">
          <div className="w-full overflow-x-auto rounded-2xl border-3 border-[#E8920A] bg-transparent p-3 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
            <div className="min-w-[400px] px-1">
              <div className="mb-2 ml-7 flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 flex-1 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#2f3d45]"
                  />
                ))}
              </div>
              {Array.from({ length: 7 }).map((_, row) => (
                <div
                  key={row}
                  className="mb-1 grid grid-cols-[24px_repeat(26,minmax(0,1fr))] gap-1"
                >
                  <div className="h-2.5 self-center animate-pulse rounded-sm bg-[#ebe6dc] dark:bg-[#37464f]" />
                  {Array.from({ length: 26 }).map((__, col) => (
                    <div
                      key={col}
                      className="aspect-square min-h-[10px] animate-pulse rounded-md border border-[#E8E5DC] bg-[#F5F3EE] dark:border-[#37464f] dark:bg-[#252f35]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
            <div className="h-3 w-24 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded bg-[#f0ebe3] dark:bg-[#37464f]/80" />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-md bg-[#E5A13D]/35" />
              <div className="h-10 w-16 animate-pulse rounded-md bg-[#ebe6dc] dark:bg-[#2f3d45] sm:h-12 sm:w-20" />
            </div>
            <div className="mt-2 h-3 w-48 max-w-full animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded-full border-3 border-[#e8e0d4] bg-[#f5f3ee] dark:border-[#37464f] dark:bg-[#252f35]"
                />
              ))}
            </div>
            <div className="mt-3 h-10 w-full animate-pulse rounded-xl border-3 border-[#e8e0d4] bg-transparent dark:border-[#37464f]" />
          </section>

          <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)] md:p-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="h-6 w-36 animate-pulse rounded-full border-3 border-[#E8920A]/40 bg-transparent dark:border-[#84d8ff]/30" />
              <div className="h-4 w-16 animate-pulse rounded-md bg-[#ebe6dc] dark:bg-[#37464f]" />
            </div>
            <div className="h-7 w-[min(100%,18rem)] animate-pulse rounded-md bg-[#ebe6dc] dark:bg-[#2f3d45] sm:h-8" />
            <div className="mt-2 h-4 w-full max-w-md animate-pulse rounded bg-[#f0ebe3] dark:bg-[#37464f]/80" />
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e9e2d5] dark:bg-[#252f35]">
              <div className="h-full w-1/4 animate-pulse rounded-full bg-linear-to-r from-[#f5c96a] via-[#E8920A] to-[#c9780a]/50" />
            </div>
            <div className="mt-1 flex justify-between">
              <div className="h-3 w-24 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
              <div className="h-3 w-8 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border-3 border-dashed border-[#e5d4b8] bg-transparent p-3 dark:border-[#4a5560]">
                <div className="h-3 w-24 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
                <div className="mt-2 h-6 w-20 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#2f3d45]" />
              </div>
              <div className="rounded-2xl border-3 border-dashed border-[#e5d4b8] bg-transparent p-3 dark:border-[#4a5560]">
                <div className="h-3 w-28 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
                <div className="mt-2 h-6 w-12 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#2f3d45]" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
            <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
              <div className="h-3 w-28 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
              <div className="h-7 w-24 shrink-0 animate-pulse rounded-full border-3 border-[#E8920A]/40 bg-transparent dark:border-[#84d8ff]/30" />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-w-0 flex-col items-center gap-1 sm:gap-1.5"
                >
                  <div className="flex h-11 w-11 shrink-0 animate-pulse items-center justify-center rounded-2xl border-3 border-[#ebe5d8] bg-transparent sm:h-14 sm:w-14 dark:border-[#37464f]" />
                  <div className="h-2.5 w-full max-w-18 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
            <div className="mb-3 h-3 w-32 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-[#ead9bb]/80 bg-transparent px-3 py-2.5 dark:border-[#37464f]/80"
                >
                  <div className="size-9 shrink-0 animate-pulse rounded-full bg-[#ebe6dc] dark:bg-[#37464f]" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="h-3.5 w-28 max-w-full animate-pulse rounded bg-[#ebe6dc] dark:bg-[#2f3d45]" />
                    <div className="h-2.5 w-48 max-w-full animate-pulse rounded bg-[#f0ebe3] dark:bg-[#37464f]/70" />
                  </div>
                  <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-[#ebe6dc] dark:bg-[#37464f]" />
                </div>
              ))}
            </div>
            <div className="mt-4 h-11 w-full animate-pulse rounded-xl border-2 border-[#f5a5a5]/60 bg-transparent dark:border-[#f87171]/40" />
          </section>
        </div>
      </div>
    </div>
  );
}
