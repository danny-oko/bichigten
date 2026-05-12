import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/lessons/:id
export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { content: true, tasks: true, userProgress: true, level: true },
  });

  if (!lesson) {
    return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
};

// PATCH /api/lessons/:id
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const body = await req.json();

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.order !== undefined && {
          order:
            typeof body.order === "string"
              ? parseInt(body.order, 10)
              : body.order,
        }),
        ...(body.isCompleted !== undefined && {
          isCompleted: body.isCompleted,
        }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.levelId && { levelId: body.levelId }),
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            message: "A lesson with this order already exists in the section.",
          },
          { status: 409 },
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Lesson not found." },
          { status: 404 },
        );
      }
    }

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 400 });
  }
};

// DELETE /api/lessons/:id
export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    await prisma.lesson.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Lesson not found." },
        { status: 404 },
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 500 });
  }
};
