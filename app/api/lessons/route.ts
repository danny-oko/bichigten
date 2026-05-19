import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { invalidateAfterCatalogMutation } from "@/lib/server/invalidate-data-cache";
import { fetchLessonsCatalogCached } from "@/lib/server/lesson-catalog";

export const GET = async () => {
  const lessons = await fetchLessonsCatalogCached();
  return NextResponse.json(lessons);
};

export const POST = async (req: NextRequest) => {
  const { title, description, order, levelId, videoUrl } = await req.json();
  if (!title || !order || !levelId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }
  const lesson = await prisma.lesson.create({
    data: {
      title,
      description,
      videoUrl,
      order: parseInt(order),
      level: { connect: { id: levelId } },
    },
  });
  invalidateAfterCatalogMutation();
  return NextResponse.json(lesson, { status: 201 });
};
