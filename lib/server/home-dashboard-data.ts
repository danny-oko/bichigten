import { cache } from "react";

import prisma from "@/lib/prisma";
import { buildLast7StreakDots } from "@/lib/server/build-profile-user";
import { calculateDailyStreak, toUtcDateOnly } from "@/lib/server/daily-streak";
import { ensureUser } from "@/lib/server/ensure-user";

export const loadHomeProgressSidebar = cache(async (userId: string) => {
  /** Run before parallel reads: `ensureUser` uses DB writes + retries; bundling it in
   *  `Promise.all` with many siblings can exhaust the pool and hit "Unable to start a
   *  transaction in the given time" (interactive transaction wait). */
  const ensuredUser = await ensureUser({ id: userId });

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

export const loadHomeSectionHeader = cache(async (userId?: string | null) => {
  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      order: true,
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
        },
      },
    },
  });

  const orderedLessons = sections.flatMap((section) =>
    section.lessons.map((lesson) => ({ lesson, section })),
  );
  const firstLesson = orderedLessons[0];

  if (!firstLesson) {
    const firstSection = sections[0];

    return {
      sectionLabel: firstSection ? `Section ${firstSection.order}` : "Section 1",
      title: firstSection?.title ?? "Монгол бичгийн үндэс",
    };
  }

  if (!userId) {
    return {
      sectionLabel: `Section ${firstLesson.section.order}, Unit ${firstLesson.lesson.order}`,
      title: firstLesson.section.title,
    };
  }

  const completedProgress = await prisma.userLessonProgress.findMany({
    where: { userId, status: "COMPLETED" },
    select: { lessonId: true },
  });
  const completedLessonIds = new Set(
    completedProgress.map((progress) => progress.lessonId),
  );
  const currentLesson =
    orderedLessons.find(({ lesson }) => !completedLessonIds.has(lesson.id)) ??
    orderedLessons[orderedLessons.length - 1] ??
    firstLesson;

  return {
    sectionLabel: `Section ${currentLesson.section.order}, Unit ${currentLesson.lesson.order}`,
    title: currentLesson.section.title,
  };
});
