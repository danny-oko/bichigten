import { cache } from "react";

import prisma from "@/lib/prisma";
import { buildLast7StreakDots } from "@/lib/server/build-profile-user";
import { calculateDailyStreak, toUtcDateOnly } from "@/lib/server/daily-streak";
import { ensureUser } from "@/lib/server/ensure-user";

export const loadHomeProgressSidebar = cache(async (userId: string) => {
  const [
    ensuredUser,
    completionRows,
    distinctLessons,
    totalLessons,
    inProgressLesson,
    firstLesson,
  ] = await Promise.all([
    ensureUser({ id: userId }),
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

export const loadHomeNearbyPlayers = cache(async (userId: string) => {
  const topPlayers = await prisma.user.findMany({
    orderBy: { totalXp: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      userName: true,
      totalXp: true,
      avatarUrl: true,
    },
  });

  return topPlayers.map((player, index) => ({
    id: player.id,
    rank: index + 1,
    name: player.name ?? player.userName,
    xp: player.totalXp,
    xpChange: 0,
    avatarUrl: player.avatarUrl,
    isMe: player.id === userId,
  }));
});
