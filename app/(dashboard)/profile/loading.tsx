export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24 md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] px-4 pt-5 md:px-6 md:pt-8">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5">
          <div className="space-y-4 md:space-y-5">
            <div className="h-40 animate-pulse rounded-3xl bg-white" />
            <div className="h-24 animate-pulse rounded-2xl bg-white" />
            <div className="h-12 animate-pulse rounded-2xl bg-white" />
            <div className="h-56 animate-pulse rounded-2xl bg-white" />
          </div>
          <div className="hidden space-y-4 md:block">
            <div className="h-40 animate-pulse rounded-2xl bg-white" />
            <div className="h-40 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
