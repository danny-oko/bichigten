"use client";

import { useMemo, useState } from "react";

// 1. Ensure the interface matches the data from page.tsx
interface LeaderboardUser {
  id?: string;
  rank: number;
  name: string;
  title: string;
  xp: number;
  avatarUrl?: string | null;
  isMe?: boolean;
}

interface LeaderboardListProps {
  users: LeaderboardUser[];
  initialVisibleCount?: number;
  loadStep?: number;
}

export default function LeaderboardList({
  users,
  initialVisibleCount = 4,
  loadStep = 4,
}: LeaderboardListProps) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  // 2. visibleUsers must be defined inside the component
  const visibleUsers = useMemo(
    () => users.slice(0, visibleCount),
    [users, visibleCount],
  );

  const hasMore = visibleCount < users.length;

  return (
    <div className="mx-4 mt-3 flex flex-col gap-2">
      {/* 3. Mapping must happen inside the JSX return block */}
      {visibleUsers.map((user) => (
        <ListItem key={user.id || user.rank} user={user} />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((current) => current + loadStep)}
          className="mt-2 self-center rounded-xl border border-[#D7B680] bg-[#F3E0BD] px-5 py-2 text-sm font-semibold text-[#7A5C2E] transition hover:bg-[#EFD4A2]"
        >
          Load more
        </button>
      )}
    </div>
  );
}

// Sub-component for clarity
function ListItem({ user }: { user: LeaderboardUser }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${user.isMe ? "bg-[#E8940A]" : "bg-white border border-[#E8D9C0]"}`}
    >
      {/* ... existing ListItem JSX ... */}
      <span className={user.isMe ? "text-[#FFF8EE]" : "text-[#888]"}>
        {user.rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{user.name}</p>
        <p className="text-[10px] uppercase">{user.title}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{user.xp.toLocaleString()}</p>
        <p className="text-[10px]">XP</p>
      </div>
    </div>
  );
}
