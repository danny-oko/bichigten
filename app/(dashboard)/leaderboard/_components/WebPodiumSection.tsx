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
        className={`rounded-full bg-[#D3C4A8] flex items-center justify-center font-bold overflow-hidden ${
          isFirst
            ? "w-20 h-20 border-4 border-[#E8940A]"
            : "w-14 h-14 border-2 border-[#C8B89A]"
        }`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#7a6a50]">{name[0]}</span>
        )}
      </div>
      <div
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
          rank === 1 ? "bg-[#E8940A]" : "bg-[#A89070]"
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
    <div className="bg-white rounded-2xl border border-[#E8D9C0] px-6 py-6 shadow-sm">
      <div className="flex items-end justify-center gap-8">
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
        className={`mt-3 font-semibold text-[#222] ${isFirst ? "text-base" : "text-sm"}`}
      >
        {user.name}
      </p>
      <div
        className={`${isFirst ? "bg-[#E8940A] rounded-2xl px-8 py-3" : "bg-[#F4EFE8] rounded-xl px-6 py-2"} text-center mt-1`}
      >
        <div
          className={`font-bold ${isFirst ? "text-white text-2xl" : "text-[#E8940A] text-base"}`}
        >
          {user.xp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}
