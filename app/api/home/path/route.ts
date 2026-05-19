import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_CATALOG, cacheTagUser } from "@/lib/server/cache-tags";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
import { fetchLessonsCatalogCached } from "@/lib/server/lesson-catalog";
import { unstable_cache } from "next/cache";

/** Single round-trip for home path: catalog lessons + minimal user progress. */
export const GET = async (req: NextRequest) => {
  const userId = await getClerkUserIdFromRequest(req);

  const lessons = await fetchLessonsCatalogCached();

  if (!userId) {
    return NextResponse.json({ lessons, progress: [] });
  }

  const progress = await unstable_cache(
    async () =>
      prisma.userLessonProgress.findMany({
        where: { userId },
        select: { lessonId: true, status: true },
      }),
    ["api-home-path-progress", userId],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: [cacheTagUser(userId), CACHE_TAG_CATALOG],
    },
  )();

  return NextResponse.json({ lessons, progress });
};
