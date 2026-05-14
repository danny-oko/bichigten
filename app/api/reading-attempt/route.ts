import { NextRequest, NextResponse } from "next/server";

import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getCurrentAppUserFromRequest } from "@/lib/server/get-current-app-user";
import { invalidateAfterProgressWrite } from "@/lib/server/invalidate-data-cache";
import {
  ReadingAttemptError,
  submitSpeechAttempt,
} from "@/lib/server/reading-progress";

type ReadingAttemptBody = {
  durationSec?: unknown;
  targetId?: unknown;
  transcribedText?: unknown;
};

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentAppUserFromRequest(req);
    if (!user) return unauthorizedApiResponse(req);

    const { durationSec, targetId, transcribedText } =
      (await req.json()) as ReadingAttemptBody;

    if (
      typeof targetId !== "string" ||
      typeof transcribedText !== "string" ||
      typeof durationSec !== "number"
    ) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    if (targetId.trim().length === 0) {
      return NextResponse.json(
        { message: "targetId is required" },
        { status: 400 },
      );
    }

    if (transcribedText.trim().length === 0) {
      return NextResponse.json(
        { message: "transcribedText cannot be empty" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(durationSec) || durationSec <= 0) {
      return NextResponse.json(
        { message: "durationSec must be greater than 0" },
        { status: 400 },
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[READING ATTEMPT] user:", user.id);
      console.log("[READING ATTEMPT] target:", targetId);
      console.log("[READING ATTEMPT] duration:", durationSec);
      console.log("[READING ATTEMPT] transcription:", transcribedText);
    }

    const attempt = await submitSpeechAttempt({
      userId: user.id,
      targetId: targetId.trim(),
      transcribedText: transcribedText.trim(),
      durationSec,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[READING ATTEMPT] created:", attempt.id);
    }

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

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        {
          message: "Failed to save reading attempt",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Failed to save reading attempt" },
      { status: 500 },
    );
  }
};
