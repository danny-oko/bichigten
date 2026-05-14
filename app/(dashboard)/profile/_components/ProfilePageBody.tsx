import { Suspense } from "react";

import HomeDashboardSidebar from "@/app/(dashboard)/home/_components/HomeDashboardSidebar";
import { HomeSignedInSidebarSkeleton } from "@/app/(dashboard)/home/_components/HomeSidebarSkeletons";
import LessonProgressCard from "@/app/(dashboard)/home/_components/LessonProgressCard";
import WebNearbyPlayers from "@/app/(dashboard)/leaderboard/_components/SocialPeersList";
import { Header } from "@/app/_components/Bar-Sections/header";
import { MainLayout } from "@/components/layout/MainLayout";
import { buildLast7StreakDots } from "@/lib/server/build-profile-user";
import { getCurrentAppUser } from "@/lib/server/get-current-app-user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import type { ProfileTab } from "../common/types";
import ProfileMainColumn from "./ProfileMainColumn";
import ProfileMainColumnSkeleton from "./ProfileMainColumnSkeleton";

const guestStreakWeek = buildLast7StreakDots(new Set());

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

  const { userId } = await auth();

  const profileAside = (
    <div className="space-y-4">
      {userId ? (
        <Suspense fallback={<HomeSignedInSidebarSkeleton />}>
          <HomeDashboardSidebar />
        </Suspense>
      ) : (
        <>
          <Header
            streak={0}
            streakWeekDays={guestStreakWeek}
            totalXp={0}
            heartsRemaining={5}
            fixedOnDesktop={false}
          />
          <LessonProgressCard
            completedLessons={0}
            totalLessons={0}
            nextLessonHref="/dictionary"
            nextLessonTitle="Explore Dictionary"
          />
          <WebNearbyPlayers players={[]} />
        </>
      )}
    </div>
  );

  return (
    <div className="profile-page-shell min-h-screen overflow-x-hidden bg-transparent pb-24 text-[#3b2f2f] md:pb-10 dark:text-[#d8d2c4]">
      <MainLayout aside={profileAside}>
        <Suspense fallback={<ProfileMainColumnSkeleton />}>
          <ProfileMainColumn activeTab={activeTab} appUser={appUser} />
        </Suspense>
      </MainLayout>
    </div>
  );
}
