import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

const CHIMEGE_STT_LONG_URL = "https://api.chimege.com/v1.2/stt-long";
const CHIMEGE_TRANSCRIPT_URL =
  "https://api.chimege.com/v1.2/stt-long-transcript";
const UPLOAD_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 1_000;
const POLL_TIMEOUT_MS = 30_000;
const POLL_REQUEST_TIMEOUT_MS = 3_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

const getUuid = (value: unknown): string => {
  if (!isRecord(value)) return "";

  const uuid = value.uuid;
  return typeof uuid === "string" ? uuid.trim() : "";
};

const extractTranscriptText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (!isRecord(value)) return "";

  const candidates = [
    value.text,
    value.transcription,
    value.transcript,
    value.result,
    isRecord(value.data) ? value.data.text : undefined,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return "";
};

const fetchWithTimeout = async (
  url: string,
  init: RequestInit,
  timeoutMs: number,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

const pollTranscript = async ({
  token,
  uuid,
}: {
  token: string;
  uuid: string;
}) => {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let transcribedText = "";

  for (let attempt = 0; attempt < 30 && Date.now() < deadline; attempt += 1) {
    await sleep(POLL_INTERVAL_MS);

    const remainingMs = Math.max(1, deadline - Date.now());

    try {
      const transcriptResponse = await fetchWithTimeout(
        CHIMEGE_TRANSCRIPT_URL,
        {
          method: "GET",
          headers: {
            Token: token,
            UUID: uuid,
          },
        },
        Math.min(POLL_REQUEST_TIMEOUT_MS, remainingMs),
      );

      const rawTranscriptResult = await transcriptResponse.text();
      const transcriptResult =
        parseJson(rawTranscriptResult) ?? rawTranscriptResult;
      const extracted = extractTranscriptText(transcriptResult);

      if (process.env.NODE_ENV === "development") {
        console.log("[CHIMEGE] transcript result:", transcriptResult);
        console.log("[CHIMEGE] extracted text:", extracted);
      }

      if (transcriptResponse.ok && extracted) {
        transcribedText = extracted;
        break;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[CHIMEGE] transcript poll error:",
          error instanceof Error ? error.message : String(error),
        );
      }
    }
  }

  return transcribedText;
};

export const POST = async (req: NextRequest) => {
  const token = process.env.CHIMEGE_API_TOKEN?.trim();

  if (!token) {
    return NextResponse.json(
      { message: "CHIMEGE_API_TOKEN is not configured." },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        { message: "Audio file is required." },
        { status: 400 },
      );
    }

    const audioBuffer = await audio.arrayBuffer();
    if (audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { message: "Audio body is empty." },
        { status: 400 },
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[CHIMEGE] audio size:", audioBuffer.byteLength);
    }

    const uploadResponse = await fetchWithTimeout(
      CHIMEGE_STT_LONG_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          Token: token,
        },
        body: audioBuffer,
      },
      UPLOAD_TIMEOUT_MS,
    );

    const rawUploadResult = await uploadResponse.text();
    const uploadResult = parseJson(rawUploadResult);

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[CHIMEGE] upload response:",
        uploadResult ?? rawUploadResult,
      );
    }

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { message: "Failed to upload audio to Chimege" },
        { status: 500 },
      );
    }

    const uuid = getUuid(uploadResult);

    if (process.env.NODE_ENV === "development") {
      console.log("[CHIMEGE] uuid:", uuid);
    }

    if (!uuid) {
      return NextResponse.json(
        { message: "No UUID returned from Chimege" },
        { status: 500 },
      );
    }

    const transcribedText = await pollTranscript({ token, uuid });

    if (!transcribedText) {
      return NextResponse.json(
        { message: "Chimege transcription timeout" },
        { status: 504 },
      );
    }

    return NextResponse.json({ transcribedText });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[CHIMEGE] transcription failed:", message);

    return NextResponse.json(
      {
        message: "Failed to transcribe audio.",
        error: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
};
