import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_CATALOG } from "@/lib/server/cache-tags";

const lessonsCatalogSelect = {
  id: true,
  title: true,
  description: true,
  order: true,
  levelId: true,
  videoUrl: true,
  level: {
    select: {
      title: true,
      order: true,
    },
  },
} as const;

export function fetchLessonsCatalogCached() {
  return unstable_cache(
    async () =>
      prisma.lesson.findMany({
        select: lessonsCatalogSelect,
        orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      }),
    ["fetchLessonsCatalogCached"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_CATALOG] },
  )();
}

export function fetchLessonSessionCached(lessonId: string) {
  return unstable_cache(
    async () =>
      Promise.all([
        prisma.lessonContent.findMany({
          where: { lessonId },
          orderBy: { order: "asc" },
        }),
        prisma.task.findMany({
          where: { lessonId },
          orderBy: { order: "asc" },
        }),
      ]),
    ["fetchLessonSessionCached", lessonId],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG_CATALOG] },
  )();
}
