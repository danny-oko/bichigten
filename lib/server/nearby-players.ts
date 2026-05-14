import { cache } from "react";

import prisma from "@/lib/prisma";

/** Rows suitable for mapping to the “nearby players” sidebar list. */
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

/** Shared mapping for home / profile sidebar and leaderboard aside (top slice). */
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

  return mapUsersToNearbyPlayers(userId, topPlayers);
});
