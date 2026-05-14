import { fetchLeaderboardTop100Cached } from "@/lib/server/leaderboard-data";
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";
import { NextResponse } from "next/server";

export const GET = async () => {
  const users = await fetchLeaderboardTop100Cached();

  const data = users.map((user) => {
    const title = getRankNameFromXp(user.totalXp);

    return {
      id: user.id,
      name: user.name ?? user.userName,
      xp: user.totalXp,
      title,
      avatar: user.avatarUrl,
    };
  });

  return NextResponse.json(data);
};
