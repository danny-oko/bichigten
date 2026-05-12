import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const targets = await prisma.speechTarget.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(targets);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const wordsCount = body.cyrillicText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const target = await prisma.speechTarget.create({
    data: {
      title: body.title,
      description: body.description,
      difficulty: body.difficulty ?? "EASY",
      requiredAccuracy: body.requiredAccuracy ?? 90,
      cyrillicText: body.cyrillicText,
      traditionalText: body.traditionalText,
      wordsCount,
    },
  });

  return NextResponse.json(target, { status: 201 });
};
