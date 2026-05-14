import { cache } from "react";
import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";

import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export type NearbyPlayerSourceRow = {
  id: string;
  name: string | null;
  userName: string | null;
  totalXp: number;
  avatarUrl: string | null;
};

export type NearbyPlayer = {
  id: string;
  rank: number;
  name: string;
  xp: number;
  xpChange: number;
  avatarUrl: string | null;
  isMe: boolean;
};

export function mapUsersToNearbyPlayers(
  viewerId: string | null | undefined,
  rows: NearbyPlayerSourceRow[],
): NearbyPlayer[] {
  const uid = viewerId ?? "";
  return rows.map((player, index) => ({
    id: player.id,
    rank: index + 1,
    name: (player.name ?? player.userName) || "Anonymous",
    xp: player.totalXp,
    xpChange: 0,
    avatarUrl: player.avatarUrl,
    isMe: Boolean(uid && player.id === uid),
  }));
}

async function fetchTopPlayersForSidebar() {
  return prisma.user.findMany({
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
}

const getTopPlayersForSidebarCached = unstable_cache(
  fetchTopPlayersForSidebar,
  ["loadHomeNearbyPlayers-top5"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);

export const loadHomeNearbyPlayers = cache(async (userId: string) => {
  const topPlayers = await getTopPlayersForSidebarCached();
  return mapUsersToNearbyPlayers(userId, topPlayers);
});
