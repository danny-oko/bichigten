"use client";

import { useMemo, useState } from "react";

import { mnUi } from "@/lib/i18n/mn-ui";

interface WebLeaderboardUser {
  id: string;
  rank: number;
  name: string;
  xp: number;
  title: string;
  avatarUrl: string | null; // Change from 'undefined' to 'null'
  isMe: boolean;
  isNew?: boolean;
  xpChange?: number;
}

interface WebLeaderboardListProps {
  users: WebLeaderboardUser[];
  maxXp?: number;
  initialVisibleCount?: number;
  loadStep?: number;
}
function WebListItem({
  user,
  maxXp,
}: {
  user: WebLeaderboardUser;
  maxXp: number;
}) {
  const progressPercent = Math.min((user.xp / maxXp) * 100, 100);

  return (
    <div
      className={`flex flex-col gap-2.5 rounded-2xl px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4 ${
        user.isMe
          ? "border-3 border-[#E8920A]/60 bg-[#E8920A]/10 dark:border-[#84d8ff] dark:bg-[#84d8ff]/15"
          : "border-3 border-[#ead9bb] bg-transparent dark:border-[#37464f] dark:bg-transparent"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-5 shrink-0 text-sm font-semibold text-[#7a5930] dark:text-[#94a3b8]">
          {user.rank}
        </span>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            user.isMe
              ? "bg-[#E8920A] text-white dark:bg-[#84d8ff] dark:text-[#131f24]"
              : "bg-[#D3C4A8] text-[#7a6a50] dark:bg-[#37464f] dark:text-[#9ba3a7]"
          }`}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            user.name[0]
          )}
        </div>

        <div className="min-w-0 flex-1 sm:w-36 sm:flex-none sm:shrink-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-[#3b2f2f] dark:text-[#d8d2c4]">
              {user.name}
            </p>
            {user.isNew && (
              <span className="shrink-0 rounded-full bg-[#E8920A]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#E8920A] dark:bg-[#84d8ff]/15 dark:text-[#84d8ff]">
                ШИНЭ
              </span>
            )}
          </div>
          <p className="truncate text-[10px] uppercase tracking-wide text-[#999] dark:text-[#94a3b8]">
            {user.title}
          </p>
        </div>

        <div className="shrink-0 text-right sm:hidden">
          <p className="text-xs font-bold tabular-nums text-[#E8920A] dark:text-[#84d8ff]">
            {user.xp.toLocaleString()} XP
          </p>
          {user.xpChange !== undefined && (
            <p
              className={`text-[10px] font-medium ${user.xpChange >= 0 ? "text-green-600 dark:text-[#4ade80]" : "text-red-500 dark:text-[#f87171]"}`}
            >
              {user.xpChange >= 0 ? "▲" : "▼"} {Math.abs(user.xpChange)}
            </p>
          )}
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3 sm:flex-1">
        <div className="h-2 min-w-0 flex-1 rounded-full bg-[#E9E3D8] dark:bg-[#37464f]">
          <div
            className="h-2 rounded-full bg-[#E8920A] dark:bg-[#84d8ff]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="hidden w-18 shrink-0 text-right sm:block sm:w-20">
          <p className="text-sm font-bold tabular-nums text-[#E8920A] dark:text-[#84d8ff]">
            {user.xp.toLocaleString()} XP
          </p>
          {user.xpChange !== undefined && (
            <p
              className={`text-[10px] font-medium ${user.xpChange >= 0 ? "text-green-600 dark:text-[#4ade80]" : "text-red-500 dark:text-[#f87171]"}`}
            >
              {user.xpChange >= 0 ? "▲" : "▼"} {Math.abs(user.xpChange)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WebLeaderboardList({
  users,
  maxXp,
  initialVisibleCount = 5,
  loadStep = 5,
}: WebLeaderboardListProps) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const visibleUsers = useMemo(
    () => users.slice(0, visibleCount),
    [users, visibleCount],
  );
  const max = maxXp ?? Math.max(...users.map((u) => u.xp));
  const hasMore = visibleCount < users.length;

  return (
    <div className="flex flex-col gap-2">
      {visibleUsers.map((user) => (
        <WebListItem key={user.id} user={user} maxXp={max} />
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() =>
            setVisibleCount((current: number) => current + loadStep)
          }
          className="mt-2 w-full max-w-sm self-center rounded-xl border-3 border-[#E8920A]/50 bg-[#E8920A]/15 px-4 py-2 text-sm font-semibold text-[#7A5C2E] transition hover:bg-[#E8920A]/25 sm:w-auto sm:px-5 dark:border-[#84d8ff] dark:bg-[#84d8ff]/15 dark:text-[#d8d2c4] dark:hover:bg-[#84d8ff]/25"
        >
          {mnUi.loadMore}
        </button>
      )}
    </div>
  );
}
