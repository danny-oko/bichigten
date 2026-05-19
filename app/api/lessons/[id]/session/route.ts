import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_CATALOG, cacheTagUser } from "@/lib/server/cache-tags";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
import { ensureHeartsRefilledIfDue } from "@/lib/server/hearts-refill";
import { fetchLessonSessionCached } from "@/lib/server/lesson-catalog";
import { unstable_cache } from "next/cache";

type Params = { params: Promise<{ id: string }> };

/** Lesson play data in one request: contents, tasks, and hearts. */
export const GET = async (req: NextRequest, { params }: Params) => {
  const { id: lessonId } = await params;
  const userId = await getClerkUserIdFromRequest(req);

  if (!userId) return unauthorizedApiResponse(req);

  await ensureHeartsRefilledIfDue(userId);

  const [[contents, tasks], heartsRow] = await Promise.all([
    fetchLessonSessionCached(lessonId),
    unstable_cache(
      async () =>
        prisma.user.findUnique({
          where: { id: userId },
          select: { heartsRemaining: true },
        }),
      ["api-lesson-session-hearts", userId],
      {
        revalidate: CACHE_REVALIDATE_SECONDS,
        tags: [cacheTagUser(userId)],
      },
    )(),
  ]);

  return NextResponse.json({
    contents,
    tasks,
    heartsRemaining: heartsRow?.heartsRemaining ?? 5,
  });
};
