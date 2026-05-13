import { ProfileBadge } from "../common/types";
import { mnProfile } from "@/lib/i18n/mn-profile";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type AchievementsPanelProps = {
  badges: ProfileBadge[];
};

export default function AchievementsPanel({ badges }: AchievementsPanelProps) {
  const unlockedCount = badges.filter((badge) => badge.unlocked).length;

  return (
    <section className="rounded-3xl border border-[#ead9bb] bg-gradient-to-br from-white via-[#fffdf9] to-[#fff4e6] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
          {mnProfile.achievementsTitle}
        </h2>
        <p className="rounded-full bg-[#fff4dc] px-3 py-1 text-sm font-bold text-[#8c6e2f] ring-1 ring-[#f5d9a0]">
          {mnProfile.achievementsEarned(unlockedCount, badges.length)}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-xl ${
                badge.unlocked
                  ? "border-[#f0d090] bg-gradient-to-br from-[#fff9eb] to-[#fdecc8] shadow-sm"
                  : "border-[#ebe5d8] bg-[#f7f3eb] opacity-50 grayscale"
              }`}
            >
              {badge.icon}
            </div>
            <p className="line-clamp-1 text-[11px] font-semibold text-[#7d7364]">
              {badge.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
