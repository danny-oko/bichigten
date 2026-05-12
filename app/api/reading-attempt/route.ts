import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateReadingResult } from "@/app/(dashboard)/reading/lib/calculateReadingScore";

type ReadingAttemptBody = {
  durationSec?: unknown;
  targetId?: unknown;
  transcribedText?: unknown;
  userId?: unknown;
};

export const POST = async (req: NextRequest) => {
  try {
    const { durationSec, targetId, transcribedText, userId } =
      (await req.json()) as ReadingAttemptBody;

    if (
      typeof userId !== "string" ||
      typeof targetId !== "string" ||
      typeof transcribedText !== "string" ||
      typeof durationSec !== "number"
    ) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    const target = await prisma.speechTarget.findUniqueOrThrow({
      where: { id: targetId },
      select: { cyrillicText: true },
    });

    const result = calculateReadingResult(
      target.cyrillicText,
      transcribedText,
      durationSec,
    );

    const attempt = await prisma.speechAttempt.create({
      data: {
        userId,
        targetId,
        transcribedText,
        durationSec,
        mistakes: result.mistakes,
        accuracy: result.accuracy,
        wordsRead: result.wordsRead,
        charactersRead: result.charactersRead,
        wpm: result.wpm,
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create reading attempt" },
      { status: 500 },
    );
  }
};
