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
          className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/95 px-2 py-2 text-center shadow-sm md:rounded-3xl md:px-2.5 md:py-2.5"
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-b-full bg-linear-to-r ${statAccent[stat.id] ?? "from-[#E8920A] to-[#f5c96a]"}`}
            aria-hidden
          />
          <p className="mb-0.5 flex min-h-4 items-center justify-center text-[#b08a52]">
            {iconFor(stat.id)}
          </p>
          <p className="flex items-center justify-center text-xl font-extrabold tabular-nums leading-none text-[#1f1c18] md:text-2xl">
            {stat.value}
          </p>
          <p className="mt-0.5 text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-[#8a806f] md:text-[10px] md:tracking-[0.14em]">
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}
