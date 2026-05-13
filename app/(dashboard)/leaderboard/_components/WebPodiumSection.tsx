interface PodiumUser {
  rank: number;
  name: string;
  xp: number;
  streak?: number;
  avatarUrl?: string | null;
}

interface WebPodiumSectionProps {
  users: PodiumUser[];
}

function WebAvatar({
  rank,
  avatarUrl,
  name,
}: {
  rank: number;
  avatarUrl?: string | null;
  name: string;
}) {
  const isFirst = rank === 1;
  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center overflow-hidden rounded-full bg-[#D3C4A8] font-bold dark:bg-[#37464f] ${
          isFirst
            ? "h-16 w-16 border-4 border-[#E8920A] sm:h-20 sm:w-20 dark:border-[#84d8ff]"
            : "h-12 w-12 border-2 border-[#C8B89A] sm:h-14 sm:w-14 dark:border-[#52606b]"
        }`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#7a6a50] dark:text-[#9ba3a7]">{name[0]}</span>
        )}
      </div>
      <div
        className={`absolute -bottom-2 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold text-white ${
          rank === 1
            ? "bg-[#E8920A] dark:bg-[#84d8ff] dark:text-[#131f24]"
            : "bg-[#A89070] dark:bg-[#52606b]"
        }`}
      >
        {rank}
      </div>
    </div>
  );
}

export default function WebPodiumSection({ users }: WebPodiumSectionProps) {
  // Safe extraction without using '!'
  const first = users.find((u) => u.rank === 1);
  const second = users.find((u) => u.rank === 2);
  const third = users.find((u) => u.rank === 3);

  if (!first) return null; // Prevent crash if data is missing

  return (
    <div className="rounded-2xl border-3 border-[#E8920A] bg-transparent px-3 py-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] sm:px-6 sm:py-6 dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8">
        {second && <WebPodiumPerson user={second} />}
        <WebPodiumPerson user={first} />
        {third && <WebPodiumPerson user={third} />}
      </div>
    </div>
  );
}

function WebPodiumPerson({ user }: { user: PodiumUser }) {
  const isFirst = user.rank === 1;
  return (
    <div className="flex flex-col items-center gap-1">
      <WebAvatar rank={user.rank} avatarUrl={user.avatarUrl} name={user.name} />
      <p
        className={`mt-2 max-w-22 truncate px-0.5 text-center font-semibold text-[#3b2f2f] dark:text-[#d8d2c4] sm:mt-3 sm:max-w-36 ${isFirst ? "text-sm sm:text-base" : "text-xs sm:text-sm"}`}
      >
        {user.name}
      </p>
      <div
        className={`mt-1 text-center ${isFirst ? "rounded-2xl bg-[#E8920A] px-3 py-2 sm:px-8 sm:py-3 dark:border-2 dark:border-[#84d8ff] dark:bg-[#84d8ff]/10" : "rounded-xl border border-[#ead9bb] bg-[#E8920A]/10 px-3 py-1.5 sm:px-6 sm:py-2 dark:border-[#84d8ff]/35 dark:bg-[#84d8ff]/10"}`}
      >
        <div
          className={`font-bold tabular-nums ${isFirst ? "text-lg text-white sm:text-2xl dark:text-[#84d8ff]" : "text-sm text-[#E8920A] sm:text-base dark:text-[#84d8ff]"}`}
        >
          {user.xp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}
