import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_CATALOG } from "@/lib/server/cache-tags";
import { invalidateAfterCatalogMutation } from "@/lib/server/invalidate-data-cache";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const lesson = await unstable_cache(
    async () =>
      prisma.lesson.findUnique({
        where: { id },
        include: { content: true, tasks: true, userProgress: true, level: true },
      }),
    ["api-lessons-id-get", id],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_CATALOG] },
  )();

  if (!lesson) {
    return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
};

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

    invalidateAfterCatalogMutation();
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

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    await prisma.lesson.delete({ where: { id } });
    invalidateAfterCatalogMutation();
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
