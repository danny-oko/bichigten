import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_LEADERBOARD, cacheTagUser } from "@/lib/server/cache-tags";
import { invalidateAfterUserRowMutation } from "@/lib/server/invalidate-data-cache";
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";

type Params = { params: Promise<{ id: string }> };

export const GET = async (_req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const user = await unstable_cache(
    async () =>
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          userName: true,
          avatarUrl: true,
          totalXp: true,
          heartsRemaining: true,
        },
      }),
    ["api-users-id-get", id],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [cacheTagUser(id), CACHE_TAG_LEADERBOARD] },
  )();

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({
    ...user,
    title: getRankNameFromXp(user.totalXp),
  });
};

export const PATCH = async (req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const body = await req.json();

  const user = await prisma.user.update({
    where: { id },
    data: body,
  });

  invalidateAfterUserRowMutation(id);
  return NextResponse.json(user);
};

export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const { id } = await params;

  await prisma.user.delete({ where: { id } });

  invalidateAfterUserRowMutation(id);
  return NextResponse.json({ message: "User deleted" });
};
