import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const task = await prisma.task.findUnique({ where: { id } });
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
  return NextResponse.json(task);
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
};
