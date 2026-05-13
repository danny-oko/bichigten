import { Award, Flame, Heart, Trophy, Zap } from "lucide-react";

import { mnProfile } from "@/lib/i18n/mn-profile";

import { ProfileUser } from "../common/types";

type ProfileSummaryStatsProps = {
  user: ProfileUser;
};

const statAccent: Record<string, string> = {
  xp: "from-[#fde8b8] to-[#E8920A]",
  league: "from-[#d4e4ff] to-[#8eb4e8]",
  hearts: "from-[#ffd6d6] to-[#e8920a]/40",
  streak: "from-[#f5d78a] to-[#E5A13D]",
  badges: "from-[#f5e6c8] to-[#c9a227]",
};

export default function ProfileSummaryStats({
  user,
}: ProfileSummaryStatsProps) {
  const stats = [
    {
      id: "xp",
      label: mnProfile.summaryTotalXp,
      value: user.totalXp.toLocaleString(),
    },
    {
      id: "league",
      label: mnProfile.summaryLeague,
      value: `#${user.leaguePosition}`,
    },
    {
      id: "hearts",
      label: mnProfile.summaryHearts,
      value: user.heartsRemaining.toString(),
    },
    {
      id: "streak",
      label: mnProfile.summaryStreak,
      value: user.streakCount.toString(),
    },
    {
      id: "badges",
      label: mnProfile.summaryBadges,
      value: user.badgeCount.toString(),
    },
  ];

  const iconFor = (id: string) => {
    const className = "size-3.5 shrink-0 opacity-90 md:size-4";
    switch (id) {
      case "xp":
        return <Zap className={`${className} text-[#b87408]`} aria-hidden />;
      case "league":
        return <Trophy className={`${className} text-[#1C2B4A]`} aria-hidden />;
      case "hearts":
        return (
          <Heart
            className={`${className} text-[#c45a2c]`}
            fill="currentColor"
            aria-hidden
          />
        );
      case "streak":
        return (
          <Flame
            className={`${className} text-[#E5A13D]`}
            strokeWidth={2.25}
            aria-hidden
          />
        );
      case "badges":
        return <Award className={`${className} text-[#9a7220]`} aria-hidden />;
      default:
        return null;
    }
  };

  return (
    <section className="grid grid-cols-2 gap-1.5 md:grid-cols-5 md:gap-2">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="group relative min-w-0 overflow-hidden rounded-2xl border-3 border-[#ead9bb] bg-transparent px-1.5 py-2 text-center shadow-[0_8px_24px_rgba(232,146,10,0.06)] dark:border-[#37464f] md:rounded-2xl md:px-2.5 md:py-2.5"
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-b-full bg-linear-to-r ${statAccent[stat.id] ?? "from-[#E8920A] to-[#f5c96a]"}`}
            aria-hidden
          />
          <p className="flex min-h-4 items-center justify-center text-[#b08a52] dark:text-[#c4a574]">
            {iconFor(stat.id)}
          </p>
          <p className="flex min-w-0 items-center justify-center text-lg font-extrabold tabular-nums leading-none text-[#1f1c18] dark:text-[#f0ebe3] md:text-2xl">
            {stat.value}
          </p>
          <p className="mt-0.5 wrap-break-word text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-[#8a806f] dark:text-[#9ba3a7] md:text-[10px] md:tracking-[0.14em]">
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}
