import type {
  DailyChallenge,
  JourneyProgress,
  ProfileBadge,
  ProfileAppUser,
  ProfileUser,
} from "@/app/(dashboard)/profile/common/types";
import type { LessonStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import {
  CACHE_TAG_CATALOG,
  CACHE_TAG_LEADERBOARD,
  cacheTagUser,
} from "@/lib/server/cache-tags";
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";

import { mnProfile } from "@/lib/i18n/mn-profile";

import { PROFILE_SETTING_ITEMS } from "./profile-settings";
import {
  bestStreakFromCompletionDates,
  calculateDailyStreak,
  toUtcDateOnly,
} from "./daily-streak";

const XP_PER_LEVEL = 300;
const DAY_MS = 24 * 60 * 60 * 1000;
const HEATMAP_DAYS = 70;

/** Max age of completion rows loaded for profile (streak, heatmap, badges). Caps DB + payload size. */
const PROFILE_COMPLETION_LOOKBACK_DAYS = 800;

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat("mn-MN", { month: "short", year: "numeric" }).format(date);
}

function daysUntilNextMondayUtc(): number {
  const now = new Date();
  const dow = now.getUTCDay();
  return dow === 0 ? 1 : 8 - dow;
}

/** Last 7 UTC days (oldest → newest) with weekday labels — used by profile + header streak UI. */
export function buildLast7StreakDots(completionUtcMidnights: Set<number>) {
  const today = toUtcDateOnly(new Date()).getTime();
  const out: { label: string; completed: boolean }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const t = today - i * DAY_MS;
    const dow = new Date(t).getUTCDay();
    out.push({
      label: mnProfile.dowUtc[dow],
      completed: completionUtcMidnights.has(t),
    });
  }
  return out;
}

function buildActivityHeatmap(completedRows: { completedAt: Date | null }[]) {
  const today = toUtcDateOnly(new Date()).getTime();
  const start = today - (HEATMAP_DAYS - 1) * DAY_MS;
  const countByDay = new Map<number, number>();

  for (const row of completedRows) {
    if (!row.completedAt) continue;
    const ts = toUtcDateOnly(row.completedAt).getTime();
    if (ts < start || ts > today) continue;
    countByDay.set(ts, (countByDay.get(ts) ?? 0) + 1);
  }

  const maxCount = Math.max(...Array.from(countByDay.values()), 0);
  const getLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count <= 0) return 0;
    if (maxCount <= 1) return 2;
    const ratio = count / maxCount;
    if (ratio <= 0.34) return 1;
    if (ratio <= 0.67) return 2;
    if (ratio < 1) return 3;
    return 4;
  };

  return Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const t = start + i * DAY_MS;
    const count = countByDay.get(t) ?? 0;
    return {
      dateKey: new Date(t).toISOString().slice(0, 10),
      count,
      level: getLevel(count),
    };
  });
}

function buildBadges(completedLessonCount: number, totalXp: number, currentStreak: number): ProfileBadge[] {
  const { badges: b } = mnProfile;
  return [
    { id: "b1", label: b.b1, icon: "⭐", unlocked: completedLessonCount >= 1 },
    { id: "b2", label: b.b2, icon: "📚", unlocked: completedLessonCount >= 5 },
    { id: "b3", label: b.b3, icon: "🎯", unlocked: completedLessonCount >= 10 },
    { id: "b4", label: b.b4, icon: "🔥", unlocked: currentStreak >= 7 },
    { id: "b5", label: b.b5, icon: "✨", unlocked: totalXp >= 100 },
    { id: "b6", label: b.b6, icon: "💫", unlocked: totalXp >= 500 },
    { id: "b7", label: b.b7, icon: "🏆", unlocked: totalXp >= 1000 },
    { id: "b8", label: b.b8, icon: "🐉", unlocked: completedLessonCount >= 25 },
  ];
}

function buildChallenges(args: {
  lessonsDoneLast7Days: number;
  completedLessonToday: boolean;
  xpThisWeek: number;
}): DailyChallenge[] {
  const weeklyLessonTarget = 5;
  const xpTarget = 50;
  const pctLessons = Math.min(100, (args.lessonsDoneLast7Days / weeklyLessonTarget) * 100);
  const pctXp = Math.min(100, (args.xpThisWeek / xpTarget) * 100);
  const ch = mnProfile.challenges;
  const xpU = ch.xpUnit;

  return [
    {
      id: "c1",
      title: ch.c1Title,
      subtitle: ch.c1Subtitle,
      progressText: `${Math.min(args.lessonsDoneLast7Days, weeklyLessonTarget)}/${weeklyLessonTarget}`,
      progressPercent: pctLessons,
      done: args.lessonsDoneLast7Days >= weeklyLessonTarget,
      xpReward: 20,
    },
    {
      id: "c2",
      title: ch.c2Title,
      subtitle: ch.c2Subtitle,
      progressText: args.completedLessonToday ? "1/1" : "0/1",
      progressPercent: args.completedLessonToday ? 100 : 0,
      done: args.completedLessonToday,
      xpReward: 15,
    },
    {
      id: "c3",
      title: ch.c3Title,
      subtitle: ch.c3Subtitle,
      progressText: `${Math.min(args.xpThisWeek, xpTarget)}/${xpTarget} ${xpU}`,
      progressPercent: pctXp,
      done: args.xpThisWeek >= xpTarget,
      xpReward: 25,
    },
  ];
}

function emptyJourney(): JourneyProgress {
  return {
    moduleLabel: mnProfile.journeyModuleLabel,
    title: mnProfile.journeyEmptyTitle,
    description: mnProfile.journeyEmptyDescription,
    lessonProgressText: mnProfile.lessonsProgress(0, 0),
    completionPercent: 0,
    lessonsLeftText: "—",
    characterProgressText: "—",
    practiceProgressText: "—",
  };
}

/** Narrow rows from Prisma — used by profile page + `buildProfileUserFromData`. */
export type ProfileCompletedRow = { completedAt: Date; lessonId: string };
export type ProfileProgressRow = { lessonId: string; status: LessonStatus };
export type ProfileSectionRow = {
  id: string;
  title: string;
  order: number;
  lessons: { id: string; order: number }[];
};

/** Single round-trip payload for the profile route (aside + tabs). */
export type ProfileDashboardData = {
  completedRows: ProfileCompletedRow[];
  allProgressRows: ProfileProgressRow[];
  sections: ProfileSectionRow[];
  leaguePeers: {
    id: string;
    name: string | null;
    userName: string;
    totalXp: number;
  }[];
  weeklyXpSum: number;
  usersAbove: number;
};

async function fetchProfileDashboardDataUncached(
  userId: string,
  totalXp: number,
): Promise<ProfileDashboardData> {
  const weekAgo = new Date();
  weekAgo.setTime(weekAgo.getTime() - 7 * DAY_MS);
  const completionCutoff = new Date();
  completionCutoff.setTime(
    completionCutoff.getTime() - PROFILE_COMPLETION_LOOKBACK_DAYS * DAY_MS,
  );

  const [
    completedRowsRaw,
    allProgressRows,
    sections,
    leaguePeers,
    weeklyAgg,
    usersAbove,
  ] = await Promise.all([
    prisma.userLessonProgress.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { not: null, gte: completionCutoff },
      },
      select: { completedAt: true, lessonId: true },
    }),
    prisma.userLessonProgress.findMany({
      where: { userId },
      select: { lessonId: true, status: true },
    }),
    prisma.section.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        order: true,
        lessons: {
          orderBy: { order: "asc" },
          select: { id: true, order: true },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { totalXp: "desc" },
      take: 12,
      select: { id: true, name: true, userName: true, totalXp: true },
    }),
    prisma.userLessonProgress.aggregate({
      where: { userId, completedAt: { gte: weekAgo } },
      _sum: { xpEarned: true },
    }),
    prisma.user.count({
      where: { totalXp: { gt: totalXp } },
    }),
  ]);

  const completedRows: ProfileCompletedRow[] = completedRowsRaw
    .filter((r): r is { lessonId: string; completedAt: Date } => r.completedAt != null)
    .map((r) => ({ lessonId: r.lessonId, completedAt: r.completedAt }));

  return {
    completedRows,
    allProgressRows,
    sections,
    leaguePeers,
    weeklyXpSum: weeklyAgg._sum.xpEarned ?? 0,
    usersAbove,
  };
}

export async function fetchProfileDashboardData(
  userId: string,
  totalXp: number,
): Promise<ProfileDashboardData> {
  return unstable_cache(
    () => fetchProfileDashboardDataUncached(userId, totalXp),
    ["fetchProfileDashboardData", userId, String(totalXp)],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: [cacheTagUser(userId), CACHE_TAG_LEADERBOARD, CACHE_TAG_CATALOG],
    },
  )();
}

export function buildProfileUserFromData(
  appUser: ProfileAppUser,
  data: ProfileDashboardData,
): ProfileUser {
  const userId = appUser.id;
  const leaguePosition = data.usersAbove + 1;
  const weekAgo = new Date();
  weekAgo.setTime(weekAgo.getTime() - 7 * DAY_MS);

  const { completedRows, allProgressRows, sections, leaguePeers } = data;

  const completionDates = completedRows
    .map((r) => r.completedAt)
    .filter((d): d is NonNullable<typeof d> => d != null);

  const currentStreak = calculateDailyStreak(completionDates);
  const bestStreak = Math.max(
    bestStreakFromCompletionDates(completionDates),
    currentStreak,
  );

  const completionMidnightSet = new Set(
    completionDates.map((d) => toUtcDateOnly(d).getTime()),
  );
  const streakDays = buildLast7StreakDots(completionMidnightSet);
  const activityHeatmap = buildActivityHeatmap(completedRows);

  const xpThisWeek = data.weeklyXpSum;
  const lessonsDoneLast7Days = completedRows.filter((r) => {
    if (!r.completedAt) return false;
    return new Date(r.completedAt).getTime() >= weekAgo.getTime();
  }).length;

  const todayMidnight = toUtcDateOnly(new Date()).getTime();
  const completedLessonToday = completedRows.some(
    (r) => r.completedAt && toUtcDateOnly(r.completedAt).getTime() === todayMidnight,
  );

  const activeDaySet = new Set(
    completedRows
      .filter((r) => {
        if (!r.completedAt) return false;
        return new Date(r.completedAt).getTime() >= weekAgo.getTime();
      })
      .map((r) => toUtcDateOnly(r.completedAt!).getTime()),
  );
  const daysThisWeek = `${Math.min(7, activeDaySet.size)}/7`;

  const progressByLesson = new Map(allProgressRows.map((p) => [p.lessonId, p]));

  let journey: JourneyProgress = emptyJourney();
  if (sections.length > 0) {
    let currentSection = sections[sections.length - 1];
    for (const sec of sections) {
      const hasIncomplete = sec.lessons.some(
        (l) => progressByLesson.get(l.id)?.status !== "COMPLETED",
      );
      if (hasIncomplete) {
        currentSection = sec;
        break;
      }
    }

    const total = currentSection.lessons.length;
    const done = currentSection.lessons.filter(
      (l) => progressByLesson.get(l.id)?.status === "COMPLETED",
    ).length;
    const inProgress = currentSection.lessons.filter(
      (l) => progressByLesson.get(l.id)?.status === "IN_PROGRESS",
    ).length;
    const completionPercent = total ? Math.round((done / total) * 100) : 0;

    journey = {
      moduleLabel: mnProfile.journeyModuleLabel,
      title: currentSection.title,
      description: "",
      lessonProgressText: mnProfile.lessonsProgress(done, total),
      completionPercent,
      lessonsLeftText:
        total - done > 0
          ? total - done === 1
            ? mnProfile.lessonsLeftOne
            : mnProfile.lessonsLeftMany(total - done)
          : mnProfile.moduleComplete,
      characterProgressText:
        inProgress > 0
          ? mnProfile.inProgressCount(inProgress)
          : done > 0
            ? mnProfile.completedCount(done)
            : mnProfile.notStarted,
      practiceProgressText: "—",
    };
  }

  const completedLessonCount = new Set(completedRows.map((r) => r.lessonId)).size;
  const badges = buildBadges(completedLessonCount, appUser.totalXp, currentStreak);
  const dailyChallenges = buildChallenges({
    lessonsDoneLast7Days,
    completedLessonToday,
    xpThisWeek,
  });

  const displayName = appUser.name ?? appUser.userName;
  const rankTitle = getRankNameFromXp(appUser.totalXp);

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
        xp: appUser.totalXp,
        isCurrentUser: true,
      },
    ];
  }

  const level = Math.max(1, Math.floor(appUser.totalXp / XP_PER_LEVEL) + 1);
  const nextLevelXp = level * XP_PER_LEVEL;
  const previousLevelXp = (level - 1) * XP_PER_LEVEL;
  const inLevelXp = Math.max(0, appUser.totalXp - previousLevelXp);
  const neededInLevel = Math.max(1, nextLevelXp - previousLevelXp);
  const toNextLevel = Math.max(0, nextLevelXp - appUser.totalXp);

  return {
    id: appUser.id,
    email: appUser.email,
    name: displayName,
    username: appUser.userName,
    avatarUrl: appUser.avatarUrl,
    avatarInitial: displayName.charAt(0).toUpperCase() || "U",
    heartsRemaining: appUser.heartsRemaining,
    memberSince: formatMemberSince(appUser.createdAt),
    rankTitle,
    language: mnProfile.languageDisplay,
    streakLabel: mnProfile.streakLabel(currentStreak),
    level,
    levelTitle: mnProfile.levelTitle(level),
    totalXp: appUser.totalXp,
    levelProgressText: mnProfile.levelProgressLine(
      inLevelXp.toLocaleString(),
      neededInLevel.toLocaleString(),
    ),
    toNextLevelText: mnProfile.toNextLevelLine(
      toNextLevel.toLocaleString(),
      level + 1,
    ),
    leaguePosition,
    streakCount: currentStreak,
    badgeCount: badges.filter((b) => b.unlocked).length,
    completedLessonsCount: completedLessonCount,
    activeTab: "overview",
    weeklyStats: {
      xpThisWeek,
      daysThisWeek,
    },
    activityHeatmap,
    streak: {
      current: currentStreak,
      best: bestStreak,
      days: streakDays,
      frozenCount: 0,
    },
    experience: {
      currentLevel: level,
      currentXp: appUser.totalXp,
      nextLevelXp,
    },
    dailyChallenges,
    journey,
    badges,
    settings: PROFILE_SETTING_ITEMS,
    league: {
      name: mnProfile.leagueName(rankTitle),
      resetInText: mnProfile.leagueResetDays(daysUntilNextMondayUtc()),
      entries: leagueEntries,
    },
  };
}
