import type {
  Prisma,
  ReadingDifficulty as PrismaReadingDifficulty,
} from "@prisma/client";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

const READING_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

type ReadingDifficulty = (typeof READING_DIFFICULTIES)[number];

type ReadingBody = {
  cyrillicText?: unknown;
  description?: unknown;
  difficulty?: unknown;
  id?: unknown;
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
  if (value === null || value === undefined) return undefined;
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

const parseBody = (body: ReadingBody) => {
  const title = getString(body.title);
  const cyrillicText = getString(body.cyrillicText);
  const traditionalText = getString(body.traditionalText);
  const wordsCount = getInt(body.wordsCount);
  const requiredAccuracy = getInt(body.requiredAccuracy);
  const description = getOptionalString(body.description);
  const difficulty = body.difficulty ?? "EASY";

  if (!title || !cyrillicText || !traditionalText || wordsCount === undefined) {
    return {
      error:
        "title, cyrillicText, traditionalText, and wordsCount are required",
    };
  }

  if (!isReadingDifficulty(difficulty)) {
    return { error: "difficulty must be EASY, MEDIUM, or HARD" };
  }

  return {
    data: {
      title,
      description,
      difficulty,
      requiredAccuracy,
      cyrillicText,
      traditionalText,
      wordsCount,
    },
  };
};

const parsePatchBody = (body: ReadingBody) => {
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

export const GET = async (req: NextRequest) => {
  try {
    const difficulty = req.nextUrl.searchParams.get("difficulty");
    const search = req.nextUrl.searchParams.get("search")?.trim();

    if (difficulty && !isReadingDifficulty(difficulty)) {
      return NextResponse.json(
        { message: "difficulty must be EASY, MEDIUM, or HARD" },
        { status: 400 },
      );
    }

    const diffKey = difficulty ?? "";
    const searchKey = search ?? "";

    const targets = await unstable_cache(
      async () => {
        const where: Prisma.SpeechTargetWhereInput = {};
        if (difficulty) {
          where.difficulty = difficulty as PrismaReadingDifficulty;
        }
        if (search) {
          where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { cyrillicText: { contains: search, mode: "insensitive" } },
          ];
        }
        return prisma.speechTarget.findMany({
          where,
          include: {
            _count: {
              select: { attempts: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      },
      ["api-reading-get", diffKey, searchKey],
      { revalidate: CACHE_REVALIDATE_SECONDS },
    )();

    return NextResponse.json(targets);
  } catch (error) {
    console.error("Failed to load reading targets:", error);

    return NextResponse.json(
      { message: "Failed to load reading targets" },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as ReadingBody;

    if (typeof body.cyrillicText !== "string") {
      return NextResponse.json(
        { message: "cyrillicText is required" },
        { status: 400 },
      );
    }

    const wordsCount = body.cyrillicText
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    const parsed = parseBody({ ...body, wordsCount });

    if ("error" in parsed) {
      return NextResponse.json({ message: parsed.error }, { status: 400 });
    }

    const target = await prisma.speechTarget.create({
      data: parsed.data,
    });

    return NextResponse.json(target, { status: 201 });
  } catch (error) {
    console.log("Failed to create reading target:", error);

    return NextResponse.json(
      { message: "Failed to create reading target" },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as ReadingBody;
    const id = getString(body.id);

    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    const parsed = parsePatchBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ message: parsed.error }, { status: 400 });
    }

    const target = await prisma.speechTarget.update({
      where: { id },
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

export const DELETE = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    await prisma.speechTarget.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete reading target" },
      { status: 500 },
    );
  }
};
