import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
import { submitSpeechAttempt } from "@/lib/server/reading-progress";

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
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();
  return NextResponse.json(attempts);
};

export const POST = async (req: NextRequest) => {
  const userId = await getClerkUserIdFromRequest(req);
  if (!userId) return unauthorizedApiResponse(req);

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
    userId,
    targetId,
    transcribedText,
    durationSec: durationSec ?? 60,
  });
  return NextResponse.json(attempt, { status: 201 });
};
