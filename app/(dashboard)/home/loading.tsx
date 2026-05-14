/** Fast shell while `/home` RSC + data resolve (e.g. after sign-up redirect). */
export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#ECE8D8] pb-28 font-['Plus_Jakarta_Sans']">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-6 md:flex-row md:pt-8">
        <aside className="hidden shrink-0 space-y-4 md:block md:w-72">
          <div className="h-14 animate-pulse rounded-2xl bg-white/60" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/60" />
          <div className="h-40 animate-pulse rounded-2xl bg-white/60" />
        </aside>
        <div className="flex flex-1 flex-col items-center gap-6 pt-4 md:pt-0">
          <div className="h-14 w-full max-w-md animate-pulse rounded-2xl bg-white/60 md:hidden" />
          <div className="h-[min(420px,55vh)] w-full max-w-[340px] animate-pulse rounded-3xl bg-white/50" />
        </div>
      </div>
    </div>
  );
}
