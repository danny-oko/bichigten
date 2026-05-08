"use client";

import { useState } from "react";

interface League {
  label: string;
  value: string;
  count: number;
  icon: string;
}

const LEAGUES: League[] = [
  { label: "Bronze Mesa", value: "bronze", count: 47, icon: "🥉" },
  { label: "Silver Steppe", value: "silver", count: 24, icon: "⭐" },
  { label: "Gold Steppe", value: "gold", count: 18, icon: "🥇" },
  { label: "Platinum Sky", value: "platinum", count: 15, icon: "💎" },
  { label: "Diamond Gobi", value: "diamond", count: 6, icon: "🔷" },
];

interface WebLeagueFilterProps {
  defaultLeague?: string;
  onChange?: (league: string) => void;
}

export default function WebLeagueFilter({
  defaultLeague = "silver",
  onChange,
}: WebLeagueFilterProps) {
  const [active, setActive] = useState(defaultLeague);

  function handleSelect(value: string) {
    setActive(value);
    onChange?.(value);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {LEAGUES.map((league) => (
        <button
          key={league.value}
          onClick={() => handleSelect(league.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === league.value
              ? "bg-[#E8940A] text-white"
              : "bg-white border border-[#E8D9C0] text-[#666] hover:border-[#E8940A]"
          }`}
        >
          <span>{league.icon}</span>
          <span>{league.label}</span>
          <span
            className={`text-xs ${active === league.value ? "text-orange-100" : "text-[#999]"}`}
          >
            {league.count}
          </span>
        </button>
      ))}
    </div>
  );
}
