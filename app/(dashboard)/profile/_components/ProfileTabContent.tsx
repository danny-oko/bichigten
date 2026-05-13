"use client";

import AchievementsPanel from "./AchievementsPanel";
import ActivityHeatmap from "./ActivityHeatmap";
import { AppearanceToggle } from "./AppearanceToggle";
import CurrentJourneyPanel from "./CurrentJourneyPanel";
import ExperiencePanel from "./ExperiencePanel";
import LeaguePanel from "./LeaguePanel";
import { NotificationsPreference } from "./NotificationsPreference";
import { ProfileAccountForm } from "./ProfileAccountForm";
import { ProfileHelpSection } from "./ProfileHelpSection";
import SettingsPanel from "./SettingsPanel";
import StreakPanel from "./StreakPanel";
import { mnProfile } from "@/lib/i18n/mn-profile";
import type { ProfileTab, ProfileUser } from "../common/types";

type ProfileTabContentProps = {
  activeTab: ProfileTab;
  currentUser: ProfileUser;
};

export default function ProfileTabContent({
  activeTab,
  currentUser,
}: ProfileTabContentProps) {
  if (activeTab === "overview") {
    return (
      <div className="min-h-[200px] space-y-4 md:space-y-5">
        <ActivityHeatmap days={currentUser.activityHeatmap} />
        <StreakPanel streak={currentUser.streak} />
        <CurrentJourneyPanel journey={currentUser.journey} />
        <AchievementsPanel badges={currentUser.badges} />
        <SettingsPanel settings={currentUser.settings} />
      </div>
    );
  }

  if (activeTab === "achievements") {
    return (
      <div className="min-h-[200px] space-y-4 md:space-y-5">
        <AchievementsPanel badges={currentUser.badges} />
      </div>
    );
  }

  if (activeTab === "stats") {
    return (
      <div className="min-h-[200px] space-y-4 md:space-y-5">
        <ActivityHeatmap days={currentUser.activityHeatmap} />
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <StreakPanel streak={currentUser.streak} />
          <ExperiencePanel experience={currentUser.experience} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] w-full flex-col gap-6">
      <section className="rounded-3xl border border-dashed border-[#e5cfa8] bg-gradient-to-br from-[#fffdf8] to-[#fff4dc] p-4 text-sm text-[#706552] md:p-5">
        {mnProfile.settingsHint}
      </section>
      <ProfileAccountForm
        initialName={currentUser.name}
        initialUserName={currentUser.username}
        initialAvatarUrl={currentUser.avatarUrl ?? ""}
      />
      <AppearanceToggle />
      <NotificationsPreference />
      <ProfileHelpSection />
      <SettingsPanel settings={currentUser.settings} />
    </div>
  );
}
