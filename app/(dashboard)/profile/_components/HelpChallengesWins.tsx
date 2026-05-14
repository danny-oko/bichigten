"use client";

import Lottie from "lottie-react";

import congratsAnimation from "@/public/lottie/congrats.json";
import { mnProfile } from "@/lib/i18n/mn-profile";

export function HelpChallengesWins() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <ul className="list-none space-y-2.5 p-0 text-sm leading-relaxed text-[#5c5346] dark:text-[#c4bcb0]">
          {mnProfile.helpChallengesBullets.map((line, i) => (
            <li
              key={i}
              className="rounded-xl border border-[#ead9bb]/80 bg-[#fffdf7]/50 px-3 py-2 dark:border-[#37464f] dark:bg-[#0f172a]/25"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1 self-center sm:self-start">
        <div
          className="relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
          role="img"
          aria-label={mnProfile.helpChallengesWinBadge}
        >
          <Lottie
            animationData={congratsAnimation}
            loop
            className="h-full w-full scale-100 drop-shadow-sm"
          />
        </div>
        <span className="text-center text-[0.65rem] font-semibold tracking-wide text-[#a67c2e] dark:text-[#84d8ff]">
          {mnProfile.helpChallengesWinBadge}
        </span>
      </div>
    </div>
  );
}
