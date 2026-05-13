import { Header } from "@/app/_components/Bar-Sections/header";
import { loadHomeProgressSidebar } from "@/lib/server/home-dashboard-data";
import { auth } from "@clerk/nextjs/server";

import LessonProgressCard from "./LessonProgressCard";

export default async function HomeLessonProgressWrapper() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const data = await loadHomeProgressSidebar(userId);

  return (
    <>
      <Header
        streak={data.streak}
        streakWeekDays={data.streakWeekDays}
        totalXp={data.xp}
        heartsRemaining={data.heartsRemaining}
        fixedOnDesktop={false}
      />
      <LessonProgressCard
        completedLessons={data.completedLessons}
        totalLessons={data.totalLessons}
        nextLessonHref={data.nextLessonHref}
        nextLessonTitle={data.nextLessonTitle}
      />
    </>
  );
}
