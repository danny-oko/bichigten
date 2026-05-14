import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_SPEECH } from "@/lib/server/cache-tags";
import { invalidateAfterSpeechMutation } from "@/lib/server/invalidate-data-cache";

export const GET = async () => {
  const targets = await unstable_cache(
    async () =>
      prisma.speechTarget.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ["api-speech-targets-get"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_SPEECH] },
  )();

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

  invalidateAfterSpeechMutation();
  return NextResponse.json(target, { status: 201 });
};
