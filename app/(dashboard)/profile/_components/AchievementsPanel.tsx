import { ProfileBadge } from "../common/types";
import { mnProfile } from "@/lib/i18n/mn-profile";

type AchievementsPanelProps = {
  badges: ProfileBadge[];
};

export default function AchievementsPanel({ badges }: AchievementsPanelProps) {
  const unlockedCount = badges.filter((badge) => badge.unlocked).length;

  return (
    <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <h2 className="min-w-0 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f] dark:text-[#9ba3a7]">
          {mnProfile.achievementsTitle}
        </h2>
        <p className="shrink-0 rounded-full border-3 border-[#E8920A] bg-transparent px-2.5 py-1 text-xs font-bold text-[#8c6e2f] dark:border-[#84d8ff]/50 dark:text-[#e8c98a] sm:px-3 sm:text-sm">
          {mnProfile.achievementsEarned(unlockedCount, badges.length)}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex min-w-0 flex-col items-center gap-1 text-center sm:gap-1.5"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-3 text-lg sm:h-14 sm:w-14 sm:text-xl ${
                badge.unlocked
                  ? "border-[#E8920A] bg-transparent shadow-none dark:border-[#84d8ff]/50"
                  : "border-[#ebe5d8] bg-transparent opacity-50 grayscale dark:border-[#37464f]"
              }`}
            >
              {badge.icon}
            </div>
            <p className="line-clamp-2 w-full text-[10px] font-semibold leading-tight text-[#7d7364] dark:text-[#a8a095] sm:line-clamp-1 sm:text-[11px]">
              {badge.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
