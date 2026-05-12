import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const READING_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

type ReadingDifficulty = (typeof READING_DIFFICULTIES)[number];
type ReadingRouteContext = {
  params: Promise<{ readingId: string }>;
};

type PatchBody = {
  cyrillicText?: unknown;
  description?: unknown;
  difficulty?: unknown;
  requiredAccuracy?: unknown;
  title?: unknown;
  traditionalText?: unknown;
  wordsCount?: unknown;
};

const isReadingDifficulty = (value: unknown): value is ReadingDifficulty => {
  return (
    typeof value === "string" &&
    READING_DIFFICULTIES.includes(value as ReadingDifficulty)
  );
};

const getString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value.trim() : undefined;
};

const getOptionalString = (value: unknown): string | null | undefined => {
  if (value === null) return null;
  if (value === undefined) return undefined;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getInt = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value !== "string" || value.trim().length === 0) return undefined;

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

const parsePatchBody = (body: PatchBody) => {
  const data: {
    cyrillicText?: string;
    description?: string | null;
    difficulty?: ReadingDifficulty;
    requiredAccuracy?: number;
    title?: string;
    traditionalText?: string;
    wordsCount?: number;
  } = {};

  const title = getString(body.title);
  const description = getOptionalString(body.description);
  const cyrillicText = getString(body.cyrillicText);
  const traditionalText = getString(body.traditionalText);
  const wordsCount = getInt(body.wordsCount);
  const requiredAccuracy = getInt(body.requiredAccuracy);

  if (title) data.title = title;
  if (description !== undefined) data.description = description;
  if (cyrillicText) data.cyrillicText = cyrillicText;
  if (traditionalText) data.traditionalText = traditionalText;
  if (wordsCount !== undefined) data.wordsCount = wordsCount;
  if (requiredAccuracy !== undefined) data.requiredAccuracy = requiredAccuracy;

  if (body.difficulty !== undefined) {
    if (!isReadingDifficulty(body.difficulty)) {
      return { error: "difficulty must be EASY, MEDIUM, or HARD" };
    }
    data.difficulty = body.difficulty;
  }

  return { data };
};

export const GET = async (_req: NextRequest, context: ReadingRouteContext) => {
  try {
    const { readingId } = await context.params;
    const target = await prisma.speechTarget.findUnique({
      where: { id: readingId },
      include: {
        _count: {
          select: { attempts: true },
        },
      },
    });

    if (!target) {
      return NextResponse.json(
        { message: "Reading target not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(target);
  } catch {
    return NextResponse.json(
      { message: "Failed to load reading target" },
      { status: 500 },
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  context: ReadingRouteContext,
) => {
  try {
    const { readingId } = await context.params;
    const body = (await req.json()) as PatchBody;
    const parsed = parsePatchBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ message: parsed.error }, { status: 400 });
    }

    const target = await prisma.speechTarget.update({
      where: { id: readingId },
      data: parsed.data,
    });

    return NextResponse.json(target);
  } catch {
    return NextResponse.json(
      { message: "Failed to update reading target" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: ReadingRouteContext,
) => {
  try {
    const { readingId } = await context.params;

    await prisma.speechTarget.delete({
      where: { id: readingId },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete reading target" },
      { status: 500 },
    );
  }
};
