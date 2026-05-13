import { Flame } from "lucide-react";

import { mnProfile } from "@/lib/i18n/mn-profile";

import { StreakInfo } from "../common/types";

type StreakPanelProps = {
  streak: StreakInfo;
};

export default function StreakPanel({ streak }: StreakPanelProps) {
  return (
    <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
          {mnProfile.streakTitle}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#7e7463]">
          {mnProfile.streakCurrent}
        </p>
        <p className="flex flex-wrap items-center gap-2 text-3xl font-extrabold leading-none sm:text-4xl md:text-5xl">
          <Flame
            className="size-8 shrink-0 text-[#E5A13D] sm:size-10"
            strokeWidth={2}
            aria-hidden
          />
          <span className="tabular-nums text-[#c77a0a] dark:text-[#e8a84a]">
            {streak.current}
          </span>
        </p>
        <p className="mt-1 text-sm text-[#7d7364]">
          {mnProfile.streakDaysBest(streak.current, streak.best)}
        </p>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {streak.days.map((day, index) => (
            <div
              key={`${day.label}-${index}`}
              className={`rounded-full py-1.5 text-center text-[10px] font-bold ${
                day.completed
                  ? "border-3 border-[#E8920A] bg-transparent text-[#c77a0a] dark:border-[#84d8ff] dark:text-[#e8a84a]"
                  : "border-3 border-[#e8e0d4] bg-transparent text-[#9a907f] dark:border-[#37464f]"
              }`}
            >
              {day.label}
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={streak.frozenCount <= 0}
          title={
            streak.frozenCount <= 0
              ? mnProfile.streakFreezeUnavailable
              : undefined
          }
          className="mt-4 w-full rounded-2xl border-3 border-[#c8daf5] bg-transparent px-3 py-2.5 text-sm font-bold text-[#2f4f78] transition-colors hover:border-[#7eb8ea] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#4a6fa8] dark:text-[#b8d4ff]"
        >
          {mnProfile.streakFreezeCta(streak.frozenCount)}
        </button>
      </div>
    </section>
  );
}
