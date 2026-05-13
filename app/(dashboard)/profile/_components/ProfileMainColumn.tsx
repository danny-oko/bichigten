import type { User } from "@prisma/client";

import {
  buildProfileUserFromData,
  fetchProfileDashboardData,
} from "@/lib/server/build-profile-user";

import type { ProfileTab, ProfileUser } from "../common/types";
import ProfileHero from "./ProfileHero";
import ProfileSummaryStats from "./ProfileSummaryStats";
import ProfileTabsSection from "./ProfileTabsSection";

type ProfileMainColumnProps = {
  activeTab: ProfileTab;
  appUser: User;
};

export default async function ProfileMainColumn({
  activeTab,
  appUser,
}: ProfileMainColumnProps) {
  const dashboard = await fetchProfileDashboardData(
    appUser.id,
    appUser.totalXp,
  );
  const profile = buildProfileUserFromData(appUser, dashboard);
  const currentUser: ProfileUser = { ...profile, activeTab };

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <ProfileHero
        name={currentUser.name}
        username={currentUser.username}
        memberSince={currentUser.memberSince}
        avatarUrl={currentUser.avatarUrl}
        avatarInitial={currentUser.avatarInitial}
        rankTitle={currentUser.rankTitle}
        language={currentUser.language}
      />
      <ProfileSummaryStats user={currentUser} />
      <ProfileTabsSection
        initialTab={activeTab}
        currentUser={currentUser}
      />
    </div>
  );
}
