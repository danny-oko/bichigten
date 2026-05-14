import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_SPEECH, cacheTagUser } from "@/lib/server/cache-tags";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import {
  getClerkUserIdFromRequest,
  getCurrentAppUserFromRequest,
} from "@/lib/server/get-current-app-user";
import { invalidateAfterProgressWrite } from "@/lib/server/invalidate-data-cache";
import {
  ReadingAttemptError,
  submitSpeechAttempt,
} from "@/lib/server/reading-progress";

export const GET = async (req: NextRequest) => {
  const userId = await getClerkUserIdFromRequest(req);
  if (!userId) return unauthorizedApiResponse(req);

  const attempts = await unstable_cache(
    async () =>
      prisma.speechAttempt.findMany({
        where: { userId },
        include: { target: true },
        orderBy: { createdAt: "desc" },
      }),
    ["api-speech-targets-id-get", userId],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: [CACHE_TAG_SPEECH, cacheTagUser(userId)],
    },
  )();
  return NextResponse.json(attempts);
};

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentAppUserFromRequest(req);
    if (!user) return unauthorizedApiResponse(req);

    const { durationSec, targetId, transcribedText } = await req.json();
    if (
      typeof targetId !== "string" ||
      typeof transcribedText !== "string" ||
      (durationSec !== undefined && typeof durationSec !== "number")
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const attempt = await submitSpeechAttempt({
      userId: user.id,
      targetId: targetId.trim(),
      transcribedText: transcribedText.trim(),
      durationSec: durationSec ?? 60,
    });
    invalidateAfterProgressWrite(user.id);
    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Failed to save reading attempt:", error);

    if (error instanceof ReadingAttemptError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Failed to save reading attempt" },
      { status: 500 },
    );
  }
};
