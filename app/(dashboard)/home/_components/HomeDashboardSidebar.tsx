import { Header } from "@/app/_components/Bar-Sections/header";
import WebNearbyPlayers from "@/app/(dashboard)/leaderboard/_components/SocialPeersList";
import { loadHomeProgressSidebar } from "@/lib/server/home-dashboard-data";
import { loadHomeNearbyPlayers } from "@/lib/server/nearby-players";
import { auth } from "@clerk/nextjs/server";

import LessonProgressCard from "./LessonProgressCard";

/** Desktop aside: header + lesson progress + nearby players in one RSC, parallel data load. */
export default async function HomeDashboardSidebar() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const [progress, players] = await Promise.all([
    loadHomeProgressSidebar(userId),
    loadHomeNearbyPlayers(userId),
  ]);

  return (
    <>
      <Header
        streak={progress.streak}
        streakWeekDays={progress.streakWeekDays}
        totalXp={progress.xp}
        heartsRemaining={progress.heartsRemaining}
        fixedOnDesktop={false}
      />
      <LessonProgressCard
        completedLessons={progress.completedLessons}
        totalLessons={progress.totalLessons}
        nextLessonHref={progress.nextLessonHref}
        nextLessonTitle={progress.nextLessonTitle}
      />
      <WebNearbyPlayers players={players} />
    </>
  );
}
