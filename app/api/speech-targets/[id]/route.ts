import prisma from "@/lib/prisma";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
import { submitSpeechAttempt } from "@/lib/server/reading-progress";
import { NextRequest, NextResponse } from "next/server";

// GET /api/speech-targets/:id — attempts for the authenticated (or impersonated) user
export const GET = async (req: NextRequest) => {
  const userId = await getClerkUserIdFromRequest(req);
  if (!userId) return unauthorizedApiResponse(req);

  const attempts = await prisma.speechAttempt.findMany({
    where: { userId },
    include: { target: true },
    orderBy: { createdAt: "desc" },
  });
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
