import { mnProfile } from "@/lib/i18n/mn-profile";

import { ProfileUser } from "../common/types";

type LeaguePanelProps = {
  league: ProfileUser["league"];
};

export default function LeaguePanel({ league }: LeaguePanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border-3 border-[#E8920A] bg-transparent shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <div className="relative bg-transparent px-3 py-3 sm:px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1d2b55] dark:text-[#e8ecfb]">
          {league.name}
        </p>
        <p className="mt-1 text-xs text-[#243a6e] dark:text-[#b8c4e8]">{league.resetInText}</p>
      </div>
      <div className="divide-y divide-[#efe8db] dark:divide-[#37464f]">
        {league.entries.map((entry) => (
          <div
            key={`${entry.rank}-${entry.name}`}
            className="flex items-center justify-between gap-2 bg-transparent px-3 py-3 text-sm sm:px-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="w-4 shrink-0 text-[#8a806f] dark:text-[#94a3b8]">
                {entry.rank}
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <span className="truncate font-semibold text-[#27221d] dark:text-[#e8e4dc]">
                  {entry.name}
                </span>
                {entry.isCurrentUser ? (
                  <span className="shrink-0 rounded-full bg-[#e9a732] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {mnProfile.leagueYou}
                  </span>
                ) : null}
              </div>
            </div>
            <span className="shrink-0 pl-2 text-right font-bold tabular-nums text-[#4d4337] dark:text-[#c4bdb0]">
              {entry.xp.toLocaleString()}
              {mnProfile.leagueXpSuffix}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
