import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_CATALOG } from "@/lib/server/cache-tags";
import { invalidateAfterCatalogMutation } from "@/lib/server/invalidate-data-cache";

export const GET = async () => {
  const sections = await unstable_cache(
    async () =>
      prisma.section.findMany({
        include: { lessons: true },
        orderBy: { order: "asc" },
      }),
    ["api-sections-get"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_CATALOG] },
  )();
  return NextResponse.json(sections);
};

export const POST = async (req: NextRequest) => {
  const { title, order } = await req.json();
  if (!title || order === undefined) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }
  const section = await prisma.section.create({
    data: { title, order: parseInt(order) },
  });
  invalidateAfterCatalogMutation();
  return NextResponse.json(section, { status: 201 });
};
