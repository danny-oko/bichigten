import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const content = await unstable_cache(
    async () => prisma.lessonContent.findUnique({ where: { id } }),
    ["api-lesson-contents-id-get", id],
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();
  if (!content)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(content);
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = await req.json();
  const content = await prisma.lessonContent.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.text !== undefined && { text: body.text }),
      ...(body.unicode !== undefined && { unicode: body.unicode }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.animationCss !== undefined && {
        animationCss: body.animationCss,
      }),
      ...(body.order !== undefined && { order: parseInt(body.order) }),
    },
  });
  return NextResponse.json(content);
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  await prisma.lessonContent.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
};
