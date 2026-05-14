import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const section = await unstable_cache(
    async () =>
      prisma.section.findUnique({
        where: { id },
        include: { lessons: true },
      }),
    ["api-sections-id-get", id],
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();

  if (!section)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(section);
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = await req.json();

  try {
    const section = await prisma.section.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.order !== undefined && { order: parseInt(body.order) }),
      },
    });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  try {
    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
};
