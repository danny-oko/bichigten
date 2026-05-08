"use client";

import AchievementsPanel from "./AchievementsPanel";
import ActivityHeatmap from "./ActivityHeatmap";
import { AppearanceToggle } from "./AppearanceToggle";
import CurrentJourneyPanel from "./CurrentJourneyPanel";
import ExperiencePanel from "./ExperiencePanel";
import LeaguePanel from "./LeaguePanel";
import { NotificationsPreference } from "./NotificationsPreference";
import { ProfileHelpSection } from "./ProfileHelpSection";
import SettingsPanel from "./SettingsPanel";
import StreakPanel from "./StreakPanel";
import type { ProfileTab, ProfileUser } from "../common/types";

type ProfileTabContentProps = {
  activeTab: ProfileTab;
  currentUser: ProfileUser;
};

export default function ProfileTabContent({
  activeTab,
  currentUser,
}: ProfileTabContentProps) {
  return (
    <div className="min-h-[360px]">
      <div
        className={activeTab === "overview" ? "space-y-4 md:space-y-5" : "hidden"}
      >
        <ActivityHeatmap days={currentUser.activityHeatmap} />
        <StreakPanel streak={currentUser.streak} />
        <CurrentJourneyPanel journey={currentUser.journey} />
        <AchievementsPanel badges={currentUser.badges} />
        <SettingsPanel settings={currentUser.settings} />
      </div>

      <div
        className={activeTab === "achievements" ? "space-y-4 md:space-y-5" : "hidden"}
      >
        <AchievementsPanel badges={currentUser.badges} />
      </div>

      <div className={activeTab === "stats" ? "space-y-4 md:space-y-5" : "hidden"}>
        <ActivityHeatmap days={currentUser.activityHeatmap} />
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <StreakPanel streak={currentUser.streak} />
          <ExperiencePanel experience={currentUser.experience} />
        </div>
        <LeaguePanel league={currentUser.league} />
        <section className="rounded-2xl border border-[#e6dece] bg-white p-4 md:p-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
            Weekly activity
          </h2>
          <p className="text-sm text-[#706552]">
            <span className="font-semibold text-[#433c31]">
              {currentUser.weeklyStats.xpThisWeek.toLocaleString()} XP
            </span>{" "}
            this week · Active{" "}
            <span className="font-semibold">{currentUser.weeklyStats.daysThisWeek}</span>{" "}
            days
          </p>
        </section>
      </div>

      <div
        className={
          activeTab === "settings" ? "flex w-full flex-col gap-6" : "hidden"
        }
      >
        <section className="rounded-2xl border border-[#e6dece] bg-white p-4 text-sm text-[#706552] md:p-5">
          Profile info can now be edited from the top profile card.
        </section>
        <AppearanceToggle />
        <NotificationsPreference />
        <ProfileHelpSection />
        <SettingsPanel settings={currentUser.settings} />
      </div>
    </div>
  );
}
