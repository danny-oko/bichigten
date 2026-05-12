import prisma from "@/lib/prisma";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
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

  const { targetId, transcribedText, wordsRead } = await req.json();
  if (!targetId || !transcribedText || wordsRead === undefined) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }
  const attempt = await prisma.speechAttempt.create({
    data: {
      userId,
      targetId,
      transcribedText,
      durationSec: 60,
      mistakes: 0,
      accuracy: 100,
      wordsRead: Number(wordsRead),
      charactersRead: String(transcribedText).length,
      wpm: Number(wordsRead),
    },
  });
  return NextResponse.json(attempt, { status: 201 });
};
