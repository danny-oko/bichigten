import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_CATALOG } from "@/lib/server/cache-tags";
import { invalidateAfterCatalogMutation } from "@/lib/server/invalidate-data-cache";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const task = await unstable_cache(
    async () => prisma.task.findUnique({ where: { id } }),
    ["api-tasks-id-get", id],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_CATALOG] },
  )();
  if (!task)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(task);
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = await req.json();
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(body.question && { question: body.question }),
      ...(body.correctAnswer && { correctAnswer: body.correctAnswer }),
      ...(body.options !== undefined && { options: body.options }),
      ...(body.xpReward !== undefined && { xpReward: parseInt(body.xpReward) }),
      ...(body.difficulty && { difficulty: body.difficulty }),
      ...(body.type && { type: body.type }),
      ...(body.order !== undefined && { order: parseInt(body.order) }),
    },
  });
  invalidateAfterCatalogMutation();
  return NextResponse.json(task);
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  invalidateAfterCatalogMutation();
  return NextResponse.json({ message: "Deleted" });
};
