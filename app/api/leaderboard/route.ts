import prisma from "@/lib/prisma";
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";
import { NextResponse } from "next/server";

// GET /api/leaderboard
export const GET = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      totalXp: "desc",
    },
    select: {
      id: true,
      name: true,
      userName: true,
      totalXp: true,
      avatarUrl: true,
    },
  });

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
