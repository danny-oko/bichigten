import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export const GET = async () => {
  const lessons = await unstable_cache(
    async () =>
      prisma.lesson.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          levelId: true,
          videoUrl: true,
          level: {
            select: {
              title: true,
              order: true,
            },
          },
        },
        orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      }),
    ["api-lessons-get"],
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();
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
  return NextResponse.json(lesson, { status: 201 });
};
