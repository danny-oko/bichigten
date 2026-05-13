import { Suspense } from "react";

import { Header } from "@/app/_components/Bar-Sections/header";
import { MainLayout } from "@/components/layout/MainLayout";
import { buildLast7StreakDots } from "@/lib/server/build-profile-user";
import { auth } from "@clerk/nextjs/server";

import WebNearbyPlayers from "../leaderboard/_components/SocialPeersList";
import { HomePath } from "./_components/home-page-client";
import HomeLessonProgressWrapper from "./_components/HomeLessonProgressWrapper";
import HomeMobileHeaderWrapper from "./_components/HomeMobileHeaderWrapper";
import HomeNearbyPlayersWrapper from "./_components/HomeNearbyPlayersWrapper";
import {
  HomeHeaderProgressSkeleton,
  HomeLeaderboardSkeleton,
  HomeMobileHeaderSkeleton,
} from "./_components/HomeSidebarSkeletons";
import LessonProgressCard from "./_components/LessonProgressCard";

const guestStreakWeek = buildLast7StreakDots(new Set());

export default async function HomeSection() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen pb-28 font-['Plus_Jakarta_Sans']">
      <MainLayout
        aside={
          <div className="space-y-4">
            {userId ? (
              <>
                <Suspense fallback={<HomeHeaderProgressSkeleton />}>
                  <HomeLessonProgressWrapper />
                </Suspense>
                <Suspense fallback={<HomeLeaderboardSkeleton />}>
                  <HomeNearbyPlayersWrapper />
                </Suspense>
              </>
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
          <div className="flex min-h-0 w-full flex-1 flex-col items-center pt-20 sm:pt-24 md:pt-28">
            <HomePath />
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
