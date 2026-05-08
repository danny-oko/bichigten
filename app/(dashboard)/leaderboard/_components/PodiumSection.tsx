import React from "react";

// The core data structure for a user
interface PodiumUser {
  rank: number; // Changed from 1 | 2 | 3 to number to accept index + 1
  name: string;
  xp: number;
  avatarUrl?: string | null;
  avatar?: string | null;
}

// This interface must exist and match what is used in the function signature
interface PodiumSectionProps {
  users: PodiumUser[];
}

function Avatar({
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
        className={`rounded-full bg-[#D3C4A8] flex items-center justify-center overflow-hidden ${
          isFirst
            ? "w-16 h-16 border-[3px] border-[#E8940A]"
            : "w-12 h-12 border-2 border-[#C8B89A]"
        }`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-[#7a6a50] font-bold">
            {name[0]?.toUpperCase()}
          </span>
        )}
      </div>
      <div
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${
          rank === 1 ? "bg-[#E8940A]" : "bg-[#A89070]"
        }`}
      >
        {rank}
      </div>
    </div>
  );
}

function PodiumPerson({ user }: { user: PodiumUser }) {
  const isFirst = user.rank === 1;
  const finalAvatar = user.avatarUrl || user.avatar;

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <Avatar rank={user.rank} avatarUrl={finalAvatar} name={user.name} />
      <p
        className={`mt-2.5 font-medium text-[#222] truncate w-full text-center ${isFirst ? "text-[15px] font-bold" : "text-xs"}`}
      >
        {user.name}
      </p>
      {isFirst ? (
        <div className="bg-[#E8940A] rounded-2xl px-5 py-2.5 text-center mt-1">
          <div className="text-2xl font-bold text-white">
            {user.xp.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#FDE8BC]">XP</div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-[#E8940A]">
            {user.xp.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#999]">XP</div>
        </div>
      )}
    </div>
  );
}

export default function PodiumSection({ users }: PodiumSectionProps) {
  const first = users.find((u) => u.rank === 1);
  const second = users.find((u) => u.rank === 2);
  const third = users.find((u) => u.rank === 3);

  if (!first) return null;

  return (
    <div className="mx-4 mt-3 bg-white rounded-2xl border border-[#E8D9C0] px-3 pt-4 pb-5 shadow-sm">
      <div className="flex justify-center mb-3">
        <div className="w-7 h-7 bg-[#E8940A] rounded-full flex items-center justify-center text-sm">
          ⭐
        </div>
      </div>
      <div className="flex items-end justify-center gap-2">
        <div className="flex-1">{second && <PodiumPerson user={second} />}</div>
        <div className="flex-1 scale-110 mb-1">
          {first && <PodiumPerson user={first} />}
        </div>
        <div className="flex-1">{third && <PodiumPerson user={third} />}</div>
      </div>
    </div>
  );
}
