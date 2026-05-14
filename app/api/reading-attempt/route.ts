import { NextRequest, NextResponse } from "next/server";

import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
import { invalidateAfterProgressWrite } from "@/lib/server/invalidate-data-cache";
import { submitSpeechAttempt } from "@/lib/server/reading-progress";

type ReadingAttemptBody = {
  durationSec?: unknown;
  targetId?: unknown;
  transcribedText?: unknown;
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getClerkUserIdFromRequest(req);
    if (!userId) return unauthorizedApiResponse(req);

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

    const attempt = await submitSpeechAttempt({
      userId,
      targetId,
      transcribedText,
      durationSec,
    });

    invalidateAfterProgressWrite(userId);
    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Failed to create reading attempt:", error);

    return NextResponse.json(
      { message: "Failed to create reading attempt" },
      { status: 500 },
    );
  }
};
