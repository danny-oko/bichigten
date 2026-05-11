import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/lessons — list view only needs metadata (omit content/tasks for speed)
export const GET = async () => {
  const lessons = await prisma.lesson.findMany({
    // select: {
    //   id: true,
    //   title: true,
    //   description: true,
    //   order: true,
    //   levelId: true,
    // },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(lessons);
};

// POST /api/lessons
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
