import { MainLayout } from "@/components/layout/MainLayout";
import { mnProfile } from "@/lib/i18n/mn-profile";
import {
  buildProfileUserFromData,
  fetchProfileDashboardData,
} from "@/lib/server/build-profile-user";
import { getCurrentAppUser } from "@/lib/server/get-current-app-user";
import { redirect } from "next/navigation";
import LessonProgressCard from "../../home/_components/LessonProgressCard";
import WebNearbyPlayers from "../../leaderboard/_components/SocialPeersList";
import type { ProfileTab, ProfileUser } from "../common/types";
import ProfileHero from "./ProfileHero";
import ProfileSummaryStats from "./ProfileSummaryStats";
import ProfileTabsSection from "./ProfileTabsSection";

type ProfilePageBodyProps = {
  activeTab: ProfileTab;
};

export default async function ProfilePageBody({
  activeTab,
}: ProfilePageBodyProps) {
  const appUser = await getCurrentAppUser();
  if (!appUser) {
    redirect("/sign-in");
  }

  const dashboard = await fetchProfileDashboardData(
    appUser.id,
    appUser.totalXp,
  );
  const profile = buildProfileUserFromData(appUser, dashboard);
  const currentUser: ProfileUser = { ...profile, activeTab };

  const nextLesson =
    dashboard.inProgressLesson?.lesson ?? dashboard.firstLesson;
  const nextLessonHref = nextLesson
    ? `/lesson/${nextLesson.id}`
    : "/dictionary";
  const nextLessonTitle = nextLesson?.title ?? mnProfile.exploreDictionary;
  const nearbyPlayers = currentUser.league.entries.slice(0, 5).map((entry) => ({
    id: `${entry.rank}-${entry.name}`,
    rank: entry.rank,
    name: entry.name,
    xp: entry.xp,
    xpChange: 0,
    avatarUrl: null,
    isMe: Boolean(entry.isCurrentUser),
  }));

  const profileAside = (
    <>
      <LessonProgressCard
        completedLessons={currentUser.completedLessonsCount}
        totalLessons={dashboard.totalLessonsCount}
        nextLessonHref={nextLessonHref}
        nextLessonTitle={nextLessonTitle}
      />
      <WebNearbyPlayers players={nearbyPlayers} />
    </>
  );

  return (
    <div className="profile-page-shell min-h-screen overflow-x-hidden bg-transparent pb-24 text-[#3b2f2f] md:pb-10 dark:text-[#d8d2c4]">
      <MainLayout aside={profileAside}>
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
      </MainLayout>
    </div>
  );
}
