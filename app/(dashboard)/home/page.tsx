import { Header } from "@/app/_components/Bar-Sections/header";
import prisma from "@/lib/prisma";
import { calculateDailyStreak } from "@/lib/server/daily-streak";
import { ensureUser } from "@/lib/server/ensure-user";
import { MainLayout } from "@/components/layout/MainLayout";
import { auth } from "@clerk/nextjs/server";
import WebNearbyPlayers from "../leaderboard/_components/SocialPeersList";
import LessonProgressCard from "./_components/LessonProgressCard";
import { HomePath } from "./_components/home-page-client";

export default async function HomeSection() {
  const { userId } = await auth();

  let xp = 0;
  let streak = 0;
  let heartsRemaining = 5;
  let completedLessonsCount = 0;
  let totalLessonsCount = 0;
  let nextLessonHref = "/dictionary";
  let nextLessonTitle = "Explore Dictionary";
  let nearbyPlayers: {
    id: string;
    rank: number;
    name: string;
    xp: number;
    xpChange: number;
    avatarUrl: string | null;
    isMe: boolean;
  }[] = [];

  if (userId) {
    // Keep this local and fast: if user row exists this is a cheap upsert path.
    // Clerk profile syncing is handled elsewhere (webhook/profile flows).
    const ensuredUser = await ensureUser({ id: userId });

    const [completedLessons, totalLessons, inProgressLesson, firstLesson, topPlayers] = await Promise.all([
      prisma.userLessonProgress.findMany({
        where: { userId, status: "COMPLETED", completedAt: { not: null } },
        select: { completedAt: true, lessonId: true },
      }),
      prisma.lesson.count(),
      prisma.userLessonProgress.findFirst({
        where: { userId, status: "IN_PROGRESS" },
        select: { lesson: { select: { id: true, title: true } } },
      }),
      prisma.lesson.findFirst({
        orderBy: { order: "asc" },
        select: { id: true, title: true },
      }),
      prisma.user.findMany({
        orderBy: { totalXp: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          userName: true,
          totalXp: true,
          avatarUrl: true,
        },
      }),
    ]);

    xp = ensuredUser.totalXp ?? 0;
    heartsRemaining = ensuredUser.heartsRemaining ?? 5;
    completedLessonsCount = new Set(completedLessons.map((item) => item.lessonId)).size;
    totalLessonsCount = totalLessons;
    const nextLesson = inProgressLesson?.lesson ?? firstLesson;
    if (nextLesson) {
      nextLessonHref = `/lesson/${nextLesson.id}`;
      nextLessonTitle = nextLesson.title;
    }

    nearbyPlayers = topPlayers.map((player, index) => ({
      id: player.id,
      rank: index + 1,
      name: player.name ?? player.userName,
      xp: player.totalXp,
      xpChange: 0,
      avatarUrl: player.avatarUrl,
      isMe: player.id === userId,
    }));

    streak = calculateDailyStreak(
      completedLessons
        .map((item) => item.completedAt)
        .filter((date): date is Date => Boolean(date)),
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE3] pb-28 font-['Plus_Jakarta_Sans']">
      <MainLayout
        aside={
          <div className="space-y-4">
            <Header
              streak={streak}
              totalXp={xp}
              heartsRemaining={heartsRemaining}
              fixedOnDesktop={false}
            />
            <LessonProgressCard
              completedLessons={completedLessonsCount}
              totalLessons={totalLessonsCount}
              nextLessonHref={nextLessonHref}
              nextLessonTitle={nextLessonTitle}
            />
            <WebNearbyPlayers players={nearbyPlayers} />
          </div>
        }
      >
        <div className="flex min-h-full flex-col items-center">
          <div className="w-full md:hidden">
            <Header
              streak={streak}
              totalXp={xp}
              heartsRemaining={heartsRemaining}
              fixedOnDesktop={false}
            />
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col items-center pt-20 sm:pt-24 md:pt-28">
            <HomePath />
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
