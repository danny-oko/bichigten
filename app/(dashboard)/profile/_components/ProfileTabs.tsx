"use client";

import { Button } from "@/components/ui/button";
import { mnProfile } from "@/lib/i18n/mn-profile";

import type { ProfileTab } from "../common/types";

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

const tabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "overview", label: mnProfile.tabOverview },
  { id: "achievements", label: mnProfile.tabAchievements },
  { id: "stats", label: mnProfile.tabStats },
  { id: "settings", label: mnProfile.tabSettings },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <nav
      className="flex w-full max-w-full flex-nowrap gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap [&::-webkit-scrollbar]:hidden"
      aria-label="Profile sections"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Button
            key={tab.id}
            type="button"
            variant="sortbutton"
            size="sort"
            aria-pressed={isActive}
            onClick={() => onTabChange(tab.id)}
            className="shrink-0 text-xs sm:text-sm"
          >
            {tab.label}
          </Button>
        );
      })}
    </nav>
  );
}
