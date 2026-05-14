import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await unstable_cache(
    async () =>
      prisma.user.findUnique({
        where: { id: userId },
        select: { totalXp: true },
      }),
    ["api-users-me-get", userId],
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
};
