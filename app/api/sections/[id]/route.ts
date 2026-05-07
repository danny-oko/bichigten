import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/sections/:id
export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Define as Promise
) => {
  const { id } = await params; // Unwrapping the promise

  const section = await prisma.section.findUnique({
    where: { id },
    include: { lessons: true },
  });

  if (!section)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(section);
};

// PATCH /api/sections/:id
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Define as Promise
) => {
  const { id } = await params; // Unwrapping the promise
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

// DELETE /api/sections/:id
export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Define as Promise
) => {
  const { id } = await params; // Unwrapping the promise

  try {
    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
};
