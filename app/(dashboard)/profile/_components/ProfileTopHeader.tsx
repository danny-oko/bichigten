import { Flame } from "lucide-react";

import { ProfileUser } from "../common/types";

type ProfileTopHeaderProps = {
  user: ProfileUser;
};

export default function ProfileTopHeader({ user }: ProfileTopHeaderProps) {
  return (
    <section className="rounded-3xl border border-[#e6dece] bg-white px-5 py-5 shadow-[0_1px_1px_rgba(0,0,0,0.03)] md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#e8a131] bg-[#e19a1e] text-2xl font-bold text-white">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="size-full object-cover"
              />
            ) : (
              user.avatarInitial
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1f1c18]">{user.name}</h1>
            <p className="text-sm text-[#706552]">
              @{user.username} · Member since {user.memberSince}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-[#e7dbc2] bg-[#f8f1e3] px-3 py-1 text-[#8a6a2d]">
                {user.rankTitle}
              </span>
              <span className="rounded-full border border-[#e7dbc2] bg-[#f8f1e3] px-3 py-1 text-[#5e5b54]">
                {user.language}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#e7dbc2] bg-[#f8f1e3] px-3 py-1 text-[#b8742a]">
                <Flame className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                {user.streakLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 md:max-w-[440px]">
          <div className="mb-1 flex items-center justify-between text-sm font-semibold text-[#4c4237]">
            <span className="rounded-full bg-[#1d2b55] px-3 py-1 text-xs text-white">
              Level {user.level} - {user.levelTitle}
            </span>
            <span>{user.levelProgressText}</span>
          </div>
          <div className="h-2 rounded-full bg-[#e8e0d1]">
            <div
              className="h-2 rounded-full bg-[#e4a325]"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    (user.experience.currentXp / user.experience.nextLevelXp) * 100,
                  ),
                )}%`,
              }}
            />
          </div>
          <p className="mt-1 text-right text-xs font-medium text-[#8a806f]">
            {user.toNextLevelText}
          </p>
        </div>
      </div>
    </section>
  );
}
