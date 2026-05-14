import { unstable_cache } from "next/cache";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_LEADERBOARD } from "@/lib/server/cache-tags";

const leaderboardTopSelect = {
  id: true,
  name: true,
  userName: true,
  totalXp: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export type LeaderboardTopUserRow = Prisma.UserGetPayload<{
  select: typeof leaderboardTopSelect;
}>;

export function fetchLeaderboardTop100Cached(): Promise<
  LeaderboardTopUserRow[]
> {
  return unstable_cache(
    async () =>
      prisma.user.findMany({
        orderBy: { totalXp: "desc" },
        select: leaderboardTopSelect,
        take: 100,
      }),
    ["fetchLeaderboardTop100Cached"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_LEADERBOARD] },
  )();
}

export function fetchUserTotalXpCached(userId: string) {
  return unstable_cache(
    async () =>
      prisma.user.findUnique({
        where: { id: userId },
        select: { totalXp: true },
      }),
    ["fetchUserTotalXpCached", userId],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_LEADERBOARD] },
  )();
}
