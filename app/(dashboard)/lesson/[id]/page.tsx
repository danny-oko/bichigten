import { LessonPageClient } from "../_components/lesson-page-client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { ensureUser } from "@/lib/server/ensure-user";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  await ensureUser({
    id: userId,
    email: clerkUser?.emailAddresses[0]?.emailAddress,
    username: clerkUser?.username,
    name:
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
      undefined,
    avatarUrl: clerkUser?.imageUrl,
  });

  const dbUser = await unstable_cache(
    async () =>
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ["lesson-page-user-createdAt", userId],
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  const nowMs = new Date().getTime();
  const isFirstWeekUser = dbUser
    ? nowMs - new Date(dbUser.createdAt).getTime() <= twoDaysMs
    : false;

  return (
    <LessonPageClient
      lessonId={id}
      userId={userId}
      isFirstWeekUser={isFirstWeekUser}
    />
  );
}
