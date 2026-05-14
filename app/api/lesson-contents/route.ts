import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const contents = await prisma.lessonContent.findMany({
    orderBy: { order: "asc" },
  });
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
