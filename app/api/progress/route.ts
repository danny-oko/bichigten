import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { cacheTagUser } from "@/lib/server/cache-tags";
import { invalidateAfterProgressWrite } from "@/lib/server/invalidate-data-cache";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";

export const GET = async (req: NextRequest) => {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  const userId = await getClerkUserIdFromRequest(req);

  if (!userId) return unauthorizedApiResponse(req);

  if (lessonId) {
    const progress = await unstable_cache(
      async () =>
        prisma.userLessonProgress.findUnique({
          where: { userId_lessonId: { userId, lessonId } },
        }),
      ["api-progress-get", userId, lessonId],
      {
        revalidate: CACHE_REVALIDATE_SECONDS,
        tags: [cacheTagUser(userId)],
      },
    )();
    return NextResponse.json(progress);
  }

  const progress = await unstable_cache(
    async () =>
      prisma.userLessonProgress.findMany({
        where: { userId },
        include: { lesson: true },
      }),
    ["api-progress-get-all", userId],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [cacheTagUser(userId)] },
  )();
  return NextResponse.json(progress);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const userId = await getClerkUserIdFromRequest(req);
  const { lessonId, status } = body;
  const heartsRemaining =
    body.heartsRemaining !== undefined ? Number(body.heartsRemaining) : null;
  const xpEarned = Number(body.xpEarned ?? 0);
  const nextStatusRaw = status ?? "IN_PROGRESS";

  if (!userId) return unauthorizedApiResponse(req);

  if (!lessonId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const existing = await prisma.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
    select: { xpEarned: true, status: true, completedAt: true },
  });

  const nextStatus =
    existing?.status === "COMPLETED" && nextStatusRaw !== "COMPLETED"
      ? "COMPLETED"
      : (nextStatusRaw ?? existing?.status ?? "LOCKED");
  const nextCompletedAt =
    nextStatus === "COMPLETED"
      ? (existing?.completedAt ?? new Date())
      : (existing?.completedAt ?? null);

  const progress = await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      status: nextStatus,
      xpEarned,
      completedAt: nextCompletedAt,
    },
    create: {
      userId,
      lessonId,
      status: nextStatusRaw ?? "LOCKED",
      xpEarned,
      completedAt: nextStatusRaw === "COMPLETED" ? new Date() : null,
    },
  });

  const xpDelta = Math.max(0, xpEarned - (existing?.xpEarned ?? 0));

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(heartsRemaining !== null && { heartsRemaining }),
      ...(xpDelta > 0 && { totalXp: { increment: xpDelta } }),
    },
  });

  invalidateAfterProgressWrite(userId);
  return NextResponse.json(progress, { status: 201 });
};
