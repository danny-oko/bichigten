import { Flame } from "lucide-react";

import { mnProfile } from "@/lib/i18n/mn-profile";

import { StreakInfo } from "../common/types";

type StreakPanelProps = {
  streak: StreakInfo;
};

export default function StreakPanel({ streak }: StreakPanelProps) {
  return (
    <section className="rounded-3xl border border-[#ead9bb] bg-gradient-to-br from-white via-[#fffbf5] to-[#fff0dc] p-4 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
          {mnProfile.streakTitle}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#7e7463]">
          {mnProfile.streakCurrent}
        </p>
        <p className="flex items-center gap-2 text-5xl font-extrabold leading-none">
          <Flame
            className="size-10 shrink-0 text-[#E5A13D]"
            strokeWidth={2}
            aria-hidden
          />
          <span className="text-[#c77a0a]">{streak.current}</span>
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
                  ? "bg-gradient-to-b from-[#f0b83a] to-[#d48a0c] text-white"
                  : "border border-[#e8e0d4] bg-[#f2ece0] text-[#9a907f]"
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
          className="mt-4 w-full rounded-2xl border border-[#c8daf5] bg-gradient-to-r from-[#eef5ff] to-[#e4ecfb] px-3 py-2.5 text-sm font-bold text-[#2f4f78] transition-colors hover:bg-[#e8eef9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mnProfile.streakFreezeCta(streak.frozenCount)}
        </button>
      </div>
    </section>
  );
}
