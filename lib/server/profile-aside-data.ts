import { cache } from "react";

import prisma from "@/lib/prisma";
import { mnProfile } from "@/lib/i18n/mn-profile";

export const loadProfileAsideLessonProgress = cache(async (userId: string) => {
  const [distinctLessons, totalLessons, inProgressLesson, firstLesson] =
    await Promise.all([
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

  const completedLessons = distinctLessons.length;
  const nextLesson = inProgressLesson?.lesson ?? firstLesson;
  const nextLessonHref = nextLesson ? `/lesson/${nextLesson.id}` : "/dictionary";
  const nextLessonTitle = nextLesson?.title ?? mnProfile.exploreDictionary;

  return {
    completedLessons,
    totalLessons,
    nextLessonHref,
    nextLessonTitle,
  };
});

export const loadProfileAsideNearbyPlayers = cache(
  async (userId: string, totalXp: number, displayName: string) => {
    const [leaguePeers, usersAbove] = await Promise.all([
      prisma.user.findMany({
        orderBy: { totalXp: "desc" },
        take: 12,
        select: { id: true, name: true, userName: true, totalXp: true },
      }),
      prisma.user.count({
        where: { totalXp: { gt: totalXp } },
      }),
    ]);

    const leaguePosition = usersAbove + 1;
    let leagueEntries = leaguePeers.map((u, i) => ({
      rank: i + 1,
      name: u.name ?? u.userName,
      xp: u.totalXp,
      isCurrentUser: u.id === userId,
    }));

    const inLeaderboard = leagueEntries.some((e) => e.isCurrentUser);
    if (!inLeaderboard) {
      leagueEntries = [
        ...leagueEntries,
        {
          rank: leaguePosition,
          name: displayName,
          xp: totalXp,
          isCurrentUser: true,
        },
      ];
    }

    return leagueEntries.slice(0, 5).map((entry) => ({
      id: `${entry.rank}-${entry.name}`,
      rank: entry.rank,
      name: entry.name,
      xp: entry.xp,
      xpChange: 0,
      avatarUrl: null as string | null,
      isMe: Boolean(entry.isCurrentUser),
    }));
  },
);
