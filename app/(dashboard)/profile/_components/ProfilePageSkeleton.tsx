/** Lightweight shell while profile data (Clerk + DB) resolves. */
export function ProfilePageSkeleton() {
  return (
    <div className="profile-page-shell min-h-screen bg-[#FFF8E7] pb-24 text-[#3b2f2f] md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] px-4 pt-5 md:px-6 md:pt-8">
        <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5">
          <main className="min-w-0">
            <div className="flex flex-col gap-5 md:gap-6">
              <div className="h-36 animate-pulse rounded-3xl bg-[#f0e6d4] md:h-40" />
              <div className="h-24 animate-pulse rounded-2xl bg-[#f0e6d4]" />
              <div className="h-10 w-full max-w-md animate-pulse rounded-full bg-[#f0e6d4]" />
              <div className="h-64 animate-pulse rounded-3xl bg-[#f0e6d4]" />
            </div>
          </main>
          <aside className="hidden min-w-0 md:block">
            <div className="sticky top-6 space-y-4">
              <div className="h-40 animate-pulse rounded-2xl bg-[#f0e6d4]" />
              <div className="h-52 animate-pulse rounded-2xl bg-[#f0e6d4]" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
