import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export const GET = async (req: NextRequest) => {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  const contents = await unstable_cache(
    async () =>
      prisma.lessonContent.findMany({
        where: lessonId ? { lessonId } : undefined,
        orderBy: { order: "asc" },
      }),
    ["api-lesson-contents-get", lessonId ?? ""],
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();
  return NextResponse.json(contents);
};

export const POST = async (req: NextRequest) => {
  const { lessonId, name, text, unicode, imageUrl, animationCss, order } =
    await req.json();

  if (!lessonId || !name || !text || order === undefined)
    return NextResponse.json(
      { message: "Missing required fields: lessonId, name, text, order" },
      { status: 400 },
    );

  const content = await prisma.lessonContent.create({
    data: {
      lessonId,
      name,
      text,
      unicode: unicode ?? null,
      imageUrl: imageUrl ?? null,
      animationCss: animationCss ?? null,
      order: parseInt(order),
    },
  });
  return NextResponse.json(content, { status: 201 });
};
