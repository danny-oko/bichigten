import prisma from "@/lib/prisma";
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/users/:id
export const GET = async (_req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      userName: true,
      avatarUrl: true,
      totalXp: true,
      heartsRemaining: true,
    },
  });

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({
    ...user,
    title: getRankNameFromXp(user.totalXp),
  });
};

// PATCH /api/users/:id
export const PATCH = async (req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const body = await req.json();

  const user = await prisma.user.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(user);
};

// DELETE /api/users/:id
export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const { id } = await params;

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "User deleted" });
};
