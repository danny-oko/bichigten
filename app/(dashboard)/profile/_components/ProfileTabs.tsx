"use client";

import type { ProfileTab } from "../common/types";

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

const tabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "achievements", label: "Achievements" },
  { id: "stats", label: "Stats" },
  { id: "settings", label: "Settings" },
];

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <nav className="flex items-center gap-6 border-b border-[#dfd6c6] px-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              isActive
                ? "text-[#433c31]"
                : "text-[#8d8270] hover:text-[#433c31]"
            }`}
          >
            {tab.label}
            {isActive ? (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#d39a2f]" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
