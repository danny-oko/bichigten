import { cache } from "react";
import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_CATALOG, cacheTagUser } from "@/lib/server/cache-tags";
import { buildLast7StreakDots } from "@/lib/server/build-profile-user";
import { calculateDailyStreak, toUtcDateOnly } from "@/lib/server/daily-streak";
import { ensureUser } from "@/lib/server/ensure-user";

async function loadHomeProgressSidebarQueries(userId: string) {
  const [
    completionRows,
    distinctLessons,
    totalLessons,
    inProgressLesson,
    firstLesson,
  ] = await Promise.all([
    prisma.userLessonProgress.findMany({
      where: { userId, status: "COMPLETED", completedAt: { not: null } },
      select: { completedAt: true },
    }),
    prisma.userLessonProgress.groupBy({
      by: ["lessonId"],
      where: { userId, status: "COMPLETED", completedAt: { not: null } },
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
  ]);

  return {
    completionRows,
    distinctLessons,
    totalLessons,
    inProgressLesson,
    firstLesson,
  };
}

export const loadHomeProgressSidebar = cache(async (userId: string) => {
  const ensuredUser = await ensureUser({ id: userId });

  const {
    completionRows,
    distinctLessons,
    totalLessons,
    inProgressLesson,
    firstLesson,
  } = await unstable_cache(
    () => loadHomeProgressSidebarQueries(userId),
    ["loadHomeProgressSidebar", userId],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: [cacheTagUser(userId), CACHE_TAG_CATALOG],
    },
  )();

  const completedAtDates = completionRows
    .map((r) => r.completedAt)
    .filter((d): d is Date => Boolean(d));
  const streak = calculateDailyStreak(completedAtDates);
  const completionMidnightSet = new Set(
    completedAtDates.map((d) => toUtcDateOnly(d).getTime()),
  );
  const streakWeekDays = buildLast7StreakDots(completionMidnightSet);
  const completedLessonsCount = distinctLessons.length;
  const nextLesson = inProgressLesson?.lesson ?? firstLesson;
  let nextLessonHref = "/dictionary";
  let nextLessonTitle = "Explore Dictionary";
  if (nextLesson) {
    nextLessonHref = `/lesson/${nextLesson.id}`;
    nextLessonTitle = nextLesson.title;
  }

  return {
    xp: ensuredUser.totalXp ?? 0,
    heartsRemaining: ensuredUser.heartsRemaining ?? 5,
    streak,
    streakWeekDays,
    completedLessons: completedLessonsCount,
    totalLessons,
    nextLessonHref,
    nextLessonTitle,
  };
});
