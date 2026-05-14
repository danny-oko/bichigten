import prisma from "@/lib/prisma";
import { invalidateAfterProgressWrite } from "@/lib/server/invalidate-data-cache";
import { unauthorizedApiResponse } from "@/lib/server/dev-postman-bypass";
import { getClerkUserIdFromRequest } from "@/lib/server/get-current-app-user";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export const PATCH = async (req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const userId = await getClerkUserIdFromRequest(req);
  if (!userId) return unauthorizedApiResponse(req);

  const existing = await prisma.userLessonProgress.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (existing.userId !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const progress = await prisma.userLessonProgress.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.xpEarned !== undefined && { xpEarned: parseInt(body.xpEarned) }),
      ...(body.status === "COMPLETED" && { completedAt: new Date() }),
    },
  });
  invalidateAfterProgressWrite(userId);
  return NextResponse.json(progress);
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const userId = await getClerkUserIdFromRequest(req);
  if (!userId) return unauthorizedApiResponse(req);

  const existing = await prisma.userLessonProgress.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (existing.userId !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.userLessonProgress.delete({ where: { id } });
  invalidateAfterProgressWrite(userId);
  return NextResponse.json({ message: "Deleted" });
};
