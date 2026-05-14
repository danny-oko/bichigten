import { Suspense } from "react";

import { Header } from "@/app/_components/Bar-Sections/header";
import { MainLayout } from "@/components/layout/MainLayout";
import { buildLast7StreakDots } from "@/lib/server/build-profile-user";
import { auth } from "@clerk/nextjs/server";

import WebNearbyPlayers from "../leaderboard/_components/SocialPeersList";
import { HomePath } from "./_components/home-page-client";
import HomeDashboardSidebar from "./_components/HomeDashboardSidebar";
import HomeMobileHeaderWrapper from "./_components/HomeMobileHeaderWrapper";
import {
  HomeMobileHeaderSkeleton,
  HomeSignedInSidebarSkeleton,
} from "./_components/HomeSidebarSkeletons";
import LessonProgressCard from "./_components/LessonProgressCard";

const guestStreakWeek = buildLast7StreakDots(new Set());

export default async function HomeSection() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen pb-28">
      <MainLayout
        aside={
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
        }
      >
        <div className="flex min-h-full flex-col items-center">
          <div className="w-full md:hidden">
            {userId ? (
              <Suspense fallback={<HomeMobileHeaderSkeleton />}>
                <HomeMobileHeaderWrapper />
              </Suspense>
            ) : (
              <Header
                streak={0}
                streakWeekDays={guestStreakWeek}
                totalXp={0}
                heartsRemaining={5}
                fixedOnDesktop={false}
              />
            )}
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col items-center">
            <HomePath />
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
