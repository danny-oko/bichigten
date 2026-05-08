import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/lessons/:id
export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Define params as a Promise
) => {
  const { id } = await params; // Unwrapping the promise

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { content: true, tasks: true, userProgress: true },
  });

  if (!lesson) {
    return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
};

// PATCH /api/lessons/:id
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Define params as a Promise
) => {
  try {
    const { id } = await params; // Unwrapping the promise
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
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed. Record may not exist.", error },
      { status: 400 },
    );
  }
};

// DELETE /api/lessons/:id
export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Define params as a Promise
) => {
  try {
    const { id } = await params; // Unwrapping the promise

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed. Record may not exist." },
      { status: 404 },
    );
  }
};
