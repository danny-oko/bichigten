import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { cacheTagUser } from "@/lib/server/cache-tags";
import { invalidateAfterProgressWrite } from "@/lib/server/invalidate-data-cache";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
import { MAX_USER_HEARTS } from "@/lib/server/hearts-refill";
import { ACCELERATE_INTERACTIVE_TX_OPTIONS } from "@/lib/server/prisma-transaction";

export const GET = async (req: NextRequest) => {
  try {
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
          select: { lessonId: true, status: true },
        }),
      ["api-progress-get-all", userId],
      { revalidate: CACHE_REVALIDATE_SECONDS, tags: [cacheTagUser(userId)] },
    )();
    return NextResponse.json(progress);
  } catch (err) {
    console.log("error message: ", err);
    return NextResponse.json({ error_message: err });
  }
  
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

  const progress = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { heartsRemaining: true },
    });
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const existing = await tx.userLessonProgress.findUnique({
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

    const saved = await tx.userLessonProgress.upsert({
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

    const heartData: {
      heartsRemaining?: number;
      heartsDepletedAt?: Date | null;
    } = {};
    if (heartsRemaining !== null) {
      const raw = Number(heartsRemaining);
      if (Number.isFinite(raw)) {
        const clamped = Math.max(0, Math.min(MAX_USER_HEARTS, raw));
        heartData.heartsRemaining = clamped;
        if (clamped === 0) {
          if (user.heartsRemaining > 0) {
            heartData.heartsDepletedAt = new Date();
          }
        } else {
          heartData.heartsDepletedAt = null;
        }
      }
    }

    if (xpDelta > 0 || Object.keys(heartData).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...heartData,
          ...(xpDelta > 0 && { totalXp: { increment: xpDelta } }),
        },
      });
    }

    return saved;
  }, ACCELERATE_INTERACTIVE_TX_OPTIONS).catch((err) => {
    if (err instanceof Error && err.message === "USER_NOT_FOUND") {
      return null;
    }
    throw err;
  });

  if (!progress) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  invalidateAfterProgressWrite(userId);
  return NextResponse.json(progress, { status: 201 });
};
