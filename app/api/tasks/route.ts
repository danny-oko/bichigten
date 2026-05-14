import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export const GET = async (req: NextRequest) => {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  const tasks = await unstable_cache(
    async () =>
      prisma.task.findMany({
        where: lessonId ? { lessonId } : undefined,
        orderBy: { order: "asc" },
      }),
    ["api-tasks-get", lessonId ?? ""],
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();
  return NextResponse.json(tasks);
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      lessonId,
      type,
      difficulty,
      question,
      correctAnswer,
      options,
      order,
      xpReward,
    } = body;

    if (!lessonId || !type || !question || order === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (type === "MC") {
      const hasValidChoices =
        options &&
        typeof options === "object" &&
        Array.isArray((options as { choices?: unknown[] }).choices);
      if (!hasValidChoices) {
        return NextResponse.json(
          { message: "MC type requires options.choices[]" },
          { status: 400 },
        );
      }
    }

    if (type === "MATCH") {
      const matchOptions = options as {
        leftSide?: unknown[];
        rightSide?: unknown[];
        pairs?: unknown[];
      };
      const isValidMatch =
        options &&
        typeof options === "object" &&
        Array.isArray(matchOptions.leftSide) &&
        Array.isArray(matchOptions.rightSide) &&
        Array.isArray(matchOptions.pairs);
      if (!isValidMatch) {
        return NextResponse.json(
          { message: "MATCH type requires leftSide, rightSide, and pairs" },
          { status: 400 },
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        lessonId,
        type,
        difficulty: difficulty || "EASY",
        xpReward: Number(xpReward ?? 10),
        question,
        correctAnswer,
        options,
        order: Number(order),
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
